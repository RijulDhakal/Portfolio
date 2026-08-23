using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using FluentAssertions;

namespace Portfolio.Tests;

[Collection("api")]
public abstract class ApiTestBase
{
    protected const string AdminEmail = "admin@rijuldhakal.com";
    protected const string AdminPassword = "Admin@123!";

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    protected readonly PortfolioApiFactory Factory;
    protected readonly HttpClient Client;
    private static int _ipCounter;

    protected ApiTestBase(PortfolioApiFactory factory)
    {
        Factory = factory;
        Client = factory.CreateClient();
    }

    protected async Task<Envelope<T>> GetEnvelope<T>(HttpResponseMessage response) =>
        (await response.Content.ReadFromJsonAsync<Envelope<T>>(JsonOptions))!;

    protected async Task<Envelope<T>> PostAsync<T>(
        string url,
        object body,
        string? token = null,
        HttpStatusCode expectedStatus = HttpStatusCode.OK)
    {
        using var request = CreateRequest(HttpMethod.Post, url, token, body);
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(expectedStatus);
        return await GetEnvelope<T>(response);
    }

    protected async Task<Envelope<T>> PutAsync<T>(
        string url,
        object body,
        string? token,
        HttpStatusCode expectedStatus = HttpStatusCode.OK)
    {
        using var request = CreateRequest(HttpMethod.Put, url, token, body);
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(expectedStatus);
        return await GetEnvelope<T>(response);
    }

    protected async Task<Envelope<T>> GetAsync<T>(string url, string? token = null, HttpStatusCode expectedStatus = HttpStatusCode.OK)
    {
        using var request = CreateRequest(HttpMethod.Get, url, token);
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(expectedStatus);
        return await GetEnvelope<T>(response);
    }

    protected async Task<(HttpStatusCode Status, Envelope<T>? Body)> DeleteAsync<T>(
        string url, string? token = null)
    {
        using var request = CreateRequest(HttpMethod.Delete, url, token);
        var response = await Client.SendAsync(request);
        var body = response.Content.Headers.ContentLength == 0
            ? null
            : await GetEnvelope<T>(response);
        return (response.StatusCode, body);
    }

    protected async Task<string> LoginAsync(string email = AdminEmail, string password = AdminPassword)
    {
        var envelope = await PostAsync<LoginResponse>("/api/v1/auth/login",
            new { email, password });
        envelope.Data.Should().NotBeNull();
        return envelope.Data!.AccessToken;
    }

    protected async Task<LoginResponse> LoginFullAsync(string email = AdminEmail, string password = AdminPassword)
    {
        var envelope = await PostAsync<LoginResponse>("/api/v1/auth/login",
            new { email, password });
        envelope.Data.Should().NotBeNull();
        return envelope.Data!;
    }

    protected static HttpRequestMessage CreateRequest(HttpMethod method, string url, string? token, object? body = null)
    {
        var request = new HttpRequestMessage(method, url);
        if (token is not null)
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        if (body is not null)
            request.Content = JsonContent.Create(body, options: JsonOptions);

        var ip = Interlocked.Increment(ref _ipCounter);
        request.Headers.Add("X-Forwarded-For", $"10.0.{ip % 250}.{ip % 250 + 1}");
        return request;
    }

    public sealed record Envelope<T>(bool Success, string? Message, T? Data, List<string>? Errors);

    public sealed record LoginResponse(
        string AccessToken,
        string RefreshToken,
        DateTime AccessTokenExpiresAt,
        DateTime RefreshTokenExpiresAt,
        UserDto User);

    public sealed record UserDto(Guid Id, string Email, string Role, DateTime? LastLoginAt);

    public sealed record SkillDto(
        Guid Id,
        string Name,
        string Category,
        string? Description,
        string? Icon,
        string? PositionX,
        string? PositionY,
        int DisplayOrder,
        bool IsActive);

    public sealed record HeroDto(
        Guid Id,
        string? Greeting,
        string Name,
        string? Title,
        string? Description,
        string? ProfilePhoto,
        string? CvFile,
        string? CvFileName,
        string? PrimaryButtonText,
        string? PrimaryButtonUrl,
        string? SecondaryButtonText,
        string? SecondaryButtonUrl,
        string? AvailabilityText,
        bool IsActive,
        DateTime UpdatedAt);
}
