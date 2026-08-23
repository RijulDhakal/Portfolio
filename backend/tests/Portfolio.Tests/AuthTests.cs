using System.Net;
using FluentAssertions;

namespace Portfolio.Tests;

public sealed class AuthTests(PortfolioApiFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Login_WithValidCredentials_ReturnsTokensAndAdminRole()
    {
        var envelope = await PostAsync<ApiTestBase.LoginResponse>("/api/v1/auth/login",
            new { email = AdminEmail, password = AdminPassword });

        envelope.Success.Should().BeTrue();
        envelope.Data.Should().NotBeNull();
        envelope.Data!.AccessToken.Should().NotBeNullOrWhiteSpace();
        envelope.Data.RefreshToken.Should().NotBeNullOrWhiteSpace();
        envelope.Data.AccessTokenExpiresAt.Should().BeAfter(DateTime.UtcNow);
        envelope.Data.RefreshTokenExpiresAt.Should().BeAfter(DateTime.UtcNow);
        envelope.Data.User.Email.Should().Be(AdminEmail);
        envelope.Data.User.Role.Should().Be("ADMIN");
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401()
    {
        using var request = CreateLoginRequest(AdminEmail, "wrong-password");
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_WithUnknownEmail_Returns401()
    {
        using var request = CreateLoginRequest("nobody@example.com", AdminPassword);
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Me_WithValidToken_ReturnsAdminUser()
    {
        var token = await LoginAsync();
        var envelope = await GetAsync<ApiTestBase.UserDto>("/api/v1/auth/me", token);

        envelope.Success.Should().BeTrue();
        envelope.Data!.Email.Should().Be(AdminEmail);
        envelope.Data.Role.Should().Be("ADMIN");
    }

    [Fact]
    public async Task Me_WithoutToken_Returns401()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/auth/me");
        var response = await Client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Refresh_RotatesTokenAndInvalidatesOldOne()
    {
        var login = await LoginFullAsync();
        var refreshEnvelope = await PostAsync<ApiTestBase.LoginResponse>("/api/v1/auth/refresh",
            new { refreshToken = login.RefreshToken });

        refreshEnvelope.Success.Should().BeTrue();
        refreshEnvelope.Data!.AccessToken.Should().NotBe(login.AccessToken);
        refreshEnvelope.Data.RefreshToken.Should().NotBe(login.RefreshToken);

        using var reused = CreateRequest(HttpMethod.Post, "/api/v1/auth/refresh", null,
            new { refreshToken = login.RefreshToken });
        var reusedResponse = await Client.SendAsync(reused);
        reusedResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Refresh_WithReusedToken_RevokesAllUserTokens()
    {
        var login = await LoginFullAsync();
        var firstRefresh = await PostAsync<ApiTestBase.LoginResponse>("/api/v1/auth/refresh",
            new { refreshToken = login.RefreshToken });
        firstRefresh.Success.Should().BeTrue();

        using var reuseRequest = CreateRequest(HttpMethod.Post, "/api/v1/auth/refresh", null,
            new { refreshToken = login.RefreshToken });
        var reuseResponse = await Client.SendAsync(reuseRequest);
        reuseResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        using var followUpRequest = CreateRequest(HttpMethod.Post, "/api/v1/auth/refresh", null,
            new { refreshToken = firstRefresh.Data!.RefreshToken });
        var followUpResponse = await Client.SendAsync(followUpRequest);
        followUpResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Logout_RevokesRefreshToken()
    {
        var login = await LoginFullAsync();

        using var logoutRequest = CreateRequest(HttpMethod.Post, "/api/v1/auth/logout", login.AccessToken,
            new { refreshToken = login.RefreshToken });
        var logoutResponse = await Client.SendAsync(logoutRequest);
        logoutResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        using var refreshRequest = CreateRequest(HttpMethod.Post, "/api/v1/auth/refresh", null,
            new { refreshToken = login.RefreshToken });
        var refreshResponse = await Client.SendAsync(refreshRequest);
        refreshResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    private static HttpRequestMessage CreateLoginRequest(string email, string password) =>
        CreateRequest(HttpMethod.Post, "/api/v1/auth/login", null, new { email, password });
}
