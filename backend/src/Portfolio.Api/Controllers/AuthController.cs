using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Auth;
using Portfolio.Application.Interfaces;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(
        [FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await authService.LoginAsync(request.Email, request.Password, ControllerHelpers.GetIpAddress(Request), ct);
        if (result is null)
            return Unauthorized(ApiResponse.Fail("Invalid email or password."));

        return Ok(ApiResponse.Ok(result, "Login successful."));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Refresh(
        [FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        var result = await authService.RefreshAsync(request.RefreshToken, ControllerHelpers.GetIpAddress(Request), ct);
        if (result is null)
            return Unauthorized(ApiResponse.Fail("The refresh token is invalid or has expired."));

        return Ok(ApiResponse.Ok(result, "Token refreshed."));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> Logout(
        [FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        await authService.LogoutAsync(request.RefreshToken, ControllerHelpers.GetIpAddress(Request), ct);
        return Ok(ApiResponse.Ok(null, "Logged out."));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserDto>>> Me(CancellationToken ct)
    {
        var userId = ControllerHelpers.GetClaimUserId(HttpContext);
        if (userId is null || !Guid.TryParse(userId, out var id))
            return Unauthorized(ApiResponse.Fail("Invalid token."));

        var user = await authService.FindByIdAsync(id, ct);
        if (user is null)
            return NotFound(ApiResponse.Fail("User not found."));

        var dto = new UserDto(user.Id, user.Email, user.Role, user.LastLoginAt);
        return Ok(ApiResponse.Ok(dto));
    }
}
