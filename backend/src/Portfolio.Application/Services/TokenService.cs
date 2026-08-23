using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Portfolio.Application.Common;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class TokenService(
    IPortfolioDbContext db,
    IOptions<JwtOptions> jwtOptions,
    ILogger<TokenService> logger) : ITokenService
{
    private readonly JwtOptions _jwt = jwtOptions.Value;

    public async Task<TokenResult> CreateTokensAsync(AdminUser user, string? ipAddress, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var jwtId = Guid.NewGuid().ToString();
        var accessTokenExpires = now.AddMinutes(_jwt.AccessTokenMinutes);
        var refreshTokenExpires = now.AddDays(_jwt.RefreshTokenDays);

        var accessToken = GenerateAccessToken(user, jwtId, now, accessTokenExpires);
        var refreshToken = GenerateRefreshToken();
        var tokenHash = HashRefreshToken(refreshToken);

        db.RefreshTokens.Add(new RefreshToken
        {
            AdminUserId = user.Id,
            TokenHash = tokenHash,
            JwtId = jwtId,
            ExpiresAt = refreshTokenExpires,
            CreatedByIp = ipAddress
        });
        await db.SaveChangesAsync(ct);

        return new TokenResult(accessToken, refreshToken, accessTokenExpires, refreshTokenExpires);
    }

    public async Task<RotatedTokenResult?> RotateRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default)
    {
        var tokenHash = HashRefreshToken(refreshToken);
        var stored = await db.RefreshTokens
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

        if (stored is null) return null;

        if (stored.RevokedAt is not null)
        {
            logger.LogWarning("Refresh token reuse detected for user {AdminUserId}; revoking all tokens", stored.AdminUserId);
            var userTokens = db.RefreshTokens.Where(t => t.AdminUserId == stored.AdminUserId);
            foreach (var t in userTokens.Where(t => t.RevokedAt == null))
            {
                t.RevokedAt = DateTime.UtcNow;
            }
            await db.SaveChangesAsync(ct);
            return null;
        }

        if (DateTime.UtcNow >= stored.ExpiresAt)
        {
            stored.RevokedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            return null;
        }

        var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Id == stored.AdminUserId, ct);
        if (user is null || !user.IsActive) return null;

        var now = DateTime.UtcNow;
        var jwtId = Guid.NewGuid().ToString();
        var accessTokenExpires = now.AddMinutes(_jwt.AccessTokenMinutes);
        var refreshTokenExpires = now.AddDays(_jwt.RefreshTokenDays);
        var newRefreshToken = GenerateRefreshToken();
        var newTokenHash = HashRefreshToken(newRefreshToken);

        stored.RevokedAt = now;
        stored.RevokedByIp = ipAddress;
        stored.ReplacedByTokenHash = newTokenHash;

        db.RefreshTokens.Add(new RefreshToken
        {
            AdminUserId = user.Id,
            TokenHash = newTokenHash,
            JwtId = jwtId,
            ExpiresAt = refreshTokenExpires,
            CreatedByIp = ipAddress
        });
        await db.SaveChangesAsync(ct);

        return new RotatedTokenResult(
            new TokenResult(GenerateAccessToken(user, jwtId, now, accessTokenExpires), newRefreshToken, accessTokenExpires, refreshTokenExpires),
            user.Id);
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken ct = default)
    {
        var tokenHash = HashRefreshToken(refreshToken);
        var stored = await db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash, ct);
        if (stored is null || stored.RevokedAt is not null) return;

        stored.RevokedAt = DateTime.UtcNow;
        stored.RevokedByIp = ipAddress;
        await db.SaveChangesAsync(ct);
    }

    private string GenerateAccessToken(AdminUser user, string jwtId, DateTime issuedAt, DateTime expiresAt)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret));
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
            [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, jwtId),
                new Claim(ClaimTypes.Role, user.Role)
            ]),
            Issuer = _jwt.Issuer,
            Audience = _jwt.Audience,
            IssuedAt = issuedAt,
            Expires = expiresAt,
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        };
        return new JsonWebTokenHandler().CreateToken(descriptor);
    }

    private static string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

    private static string HashRefreshToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}
