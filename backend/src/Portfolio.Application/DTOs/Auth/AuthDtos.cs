using System.ComponentModel.DataAnnotations;

namespace Portfolio.Application.DTOs.Auth;

public sealed record LoginRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; init; } = string.Empty;

    [Required, MinLength(8), MaxLength(128)]
    public string Password { get; init; } = string.Empty;
}

public sealed record RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; init; } = string.Empty;
}

public sealed record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    DateTime RefreshTokenExpiresAt,
    UserDto User);

public sealed record UserDto(Guid Id, string Email, string Role, DateTime? LastLoginAt);
