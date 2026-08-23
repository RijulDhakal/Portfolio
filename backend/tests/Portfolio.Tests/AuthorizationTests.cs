using System.Net;
using FluentAssertions;

namespace Portfolio.Tests;

public sealed class AuthorizationTests(PortfolioApiFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task AdminSkills_WithoutToken_Returns401()
    {
        using var request = CreateRequest(HttpMethod.Get, "/api/v1/admin/skills", null);
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task AdminSkills_WithInvalidToken_Returns401()
    {
        using var request = CreateRequest(HttpMethod.Get, "/api/v1/admin/skills", "not-a-valid-token");
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task AdminSkills_WithValidToken_Returns200()
    {
        var token = await LoginAsync();
        var envelope = await GetAsync<ApiTestBase.SkillDto>("/api/v1/admin/skills", token);
        envelope.Success.Should().BeTrue();
    }

    [Fact]
    public async Task AdminDashboard_WithoutToken_Returns401()
    {
        using var request = CreateRequest(HttpMethod.Get, "/api/v1/admin/dashboard/stats", null);
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task PublicEndpoints_DoNotRequireAuth()
    {
        using var request = CreateRequest(HttpMethod.Get, "/api/v1/hero", null);
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
