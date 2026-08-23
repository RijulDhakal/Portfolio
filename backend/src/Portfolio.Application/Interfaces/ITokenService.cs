using Portfolio.Application.Common;

namespace Portfolio.Application.Interfaces;

public interface ITokenService
{
    Task<TokenResult> CreateTokensAsync(Domain.Entities.AdminUser user, string? ipAddress, CancellationToken ct = default);
    Task<RotatedTokenResult?> RotateRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default);
    Task RevokeRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default);
}

public sealed record TokenResult(string AccessToken, string RefreshToken, DateTime AccessTokenExpiresAt, DateTime RefreshTokenExpiresAt);

public sealed record RotatedTokenResult(TokenResult Tokens, Guid AdminUserId);
