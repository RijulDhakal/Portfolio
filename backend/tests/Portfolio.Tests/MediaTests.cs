using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using FluentAssertions;

namespace Portfolio.Tests;

public sealed class MediaTests(PortfolioApiFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Media_Upload_ValidPng_ReturnsUrl()
    {
        var token = await LoginAsync();
        var envelope = await UploadAsync(token, "test.png", new byte[] { 0x89, 0x50, 0x4E, 0x47 });

        envelope.Success.Should().BeTrue();
        envelope.Data.Should().NotBeNull();
        envelope.Data!.Url.Should().StartWith("/uploads");
    }

    [Fact]
    public async Task Media_Upload_DisallowedExtension_Returns400()
    {
        var token = await LoginAsync();
        var envelope = await UploadAsync(token, "virus.exe", new byte[] { 0x4D, 0x5A }, expectedStatus: HttpStatusCode.BadRequest);

        envelope.Success.Should().BeFalse();
        envelope.Errors.Should().NotBeNullOrEmpty();
        envelope.Errors!.Should().Contain(e => e.Contains("not allowed"));
    }

    [Fact]
    public async Task Media_Upload_WithoutAuth_Returns401()
    {
        var envelope = await UploadAsync(null, "test.png", new byte[] { 0x89 }, expectedStatus: HttpStatusCode.Unauthorized);
        envelope.Success.Should().BeFalse();
    }

    [Fact]
    public async Task Media_List_ThenDelete()
    {
        var token = await LoginAsync();
        var uploaded = await UploadAsync(token, "list-test.png", new byte[] { 0x89, 0x50, 0x4E, 0x47 });
        var mediaId = uploaded.Data!.Id;

        var list = await GetAsync<MediaList>("/api/v1/admin/media", token);
        list.Data!.Items.Should().Contain(m => m.Id == mediaId);

        var (status, _) = await DeleteAsync<object>($"/api/v1/admin/media/{mediaId}", token);
        status.Should().Be(HttpStatusCode.OK);
    }

    private async Task<ApiTestBase.Envelope<MediaDto>> UploadAsync(
        string? token, string fileName, byte[] content, HttpStatusCode expectedStatus = HttpStatusCode.OK)
    {
        using var form = new MultipartFormDataContent();
        using var fileContent = new ByteArrayContent(content);
        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/octet-stream");
        form.Add(fileContent, "File", fileName);
        form.Add(new StringContent("Test alt text"), "AltText");
        form.Add(new StringContent("projects"), "Folder");

        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/admin/media/upload");
        if (token is not null)
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Content = form;

        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(expectedStatus);

        var json = await response.Content.ReadAsStringAsync();
        if (string.IsNullOrWhiteSpace(json))
            return new ApiTestBase.Envelope<MediaDto>(false, null, null, null);

        return System.Text.Json.JsonSerializer.Deserialize<ApiTestBase.Envelope<MediaDto>>(
            json, new System.Text.Json.JsonSerializerOptions(System.Text.Json.JsonSerializerDefaults.Web))!;
    }

    public sealed record MediaDto(
        Guid Id,
        string FileName,
        string OriginalFileName,
        string FileType,
        string MimeType,
        long FileSize,
        string Url,
        string? AltText,
        string Folder,
        DateTime UploadedAt);

    public sealed record MediaList(IReadOnlyList<MediaDto> Items, int Total, int Page, int PageSize);
}
