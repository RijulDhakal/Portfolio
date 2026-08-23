using System.Net;
using System.Text.Json;
using FluentAssertions;

namespace Portfolio.Tests;

public sealed class PublicApiTests(PortfolioApiFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Hero_ReturnsSeededContent()
    {
        var envelope = await GetAsync<ApiTestBase.HeroDto>("/api/v1/hero");
        envelope.Success.Should().BeTrue();
        envelope.Data.Should().NotBeNull();
        envelope.Data!.Name.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Skills_ReturnsSeededSkills()
    {
        var envelope = await GetAsync<List<ApiTestBase.SkillDto>>("/api/v1/skills");
        envelope.Success.Should().BeTrue();
        envelope.Data.Should().NotBeNull();
        envelope.Data!.Count.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task Projects_ReturnsSeededProjects()
    {
        var envelope = await GetAsync<List<ProjectItem>>("/api/v1/projects");
        envelope.Success.Should().BeTrue();
        envelope.Data.Should().NotBeNull();
        envelope.Data!.Count.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task Projects_ByUnknownSlug_Returns404()
    {
        using var request = CreateRequest(HttpMethod.Get, "/api/v1/projects/does-not-exist", null);
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Experiences_Returns200()
    {
        var envelope = await GetAsync<List<object>>("/api/v1/experiences");
        envelope.Success.Should().BeTrue();
        envelope.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task Educations_Returns200()
    {
        var envelope = await GetAsync<List<object>>("/api/v1/educations");
        envelope.Success.Should().BeTrue();
        envelope.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task SocialLinks_Returns200()
    {
        var envelope = await GetAsync<List<object>>("/api/v1/social-links");
        envelope.Success.Should().BeTrue();
        envelope.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task Settings_Returns200()
    {
        var envelope = await GetAsync<object>("/api/v1/settings");
        envelope.Success.Should().BeTrue();
        envelope.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task Contact_WithValidPayload_Returns200()
    {
        var envelope = await PostAsync<object>("/api/v1/contact", new
        {
            name = "Test Visitor",
            email = "visitor@example.com",
            message = "This is a test contact message with enough length."
        });
        envelope.Success.Should().BeTrue();
    }

    [Fact]
    public async Task Contact_WithInvalidPayload_Returns400WithErrors()
    {
        using var request = CreateRequest(HttpMethod.Post, "/api/v1/contact", null,
            new { name = "", email = "not-an-email", message = "short" });
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var body = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(body);
        var errors = doc.RootElement.TryGetProperty("errors", out var errorsElement) ? errorsElement : default;
        errors.ValueKind.Should().NotBe(JsonValueKind.Undefined);
    }

    public sealed record ProjectItem(Guid Id, string Title, string Slug);
}
