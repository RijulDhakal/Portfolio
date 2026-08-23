using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Portfolio.Application.DTOs.Auth;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class AuthService(
    IPortfolioDbContext db,
    ITokenService tokenService,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<AdminUser?> FindByEmailAsync(string email, CancellationToken ct = default)
        => await db.AdminUsers.FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant(), ct);

    public async Task<AdminUser> CreateAdminAsync(string email, string password, string role, CancellationToken ct = default)
    {
        var user = new AdminUser
        {
            Email = email.ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt(12)),
            Role = role,
            IsActive = true
        };
        db.AdminUsers.Add(user);
        await db.SaveChangesAsync(ct);
        logger.LogInformation("Created admin user {Email} with role {Role}", user.Email, role);
        return user;
    }

    public async Task<LoginResponse?> LoginAsync(string email, string password, string? ipAddress, CancellationToken ct = default)
    {
        var user = await FindByEmailAsync(email, ct);
        if (user is null)
        {
            logger.LogWarning("Login attempt for unknown email {Email}", email);
            return null;
        }

        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            logger.LogWarning("Failed login attempt for {Email}", email);
            return null;
        }

        if (!user.IsActive)
        {
            logger.LogWarning("Login attempt for deactivated user {Email}", email);
            return null;
        }

        var tokens = await tokenService.CreateTokensAsync(user, ipAddress, ct);
        user.LastLoginAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        return new LoginResponse(
            tokens.AccessToken, tokens.RefreshToken,
            tokens.AccessTokenExpiresAt, tokens.RefreshTokenExpiresAt,
            new UserDto(user.Id, user.Email, user.Role, user.LastLoginAt));
    }

    public async Task<LoginResponse?> RefreshAsync(string refreshToken, string? ipAddress, CancellationToken ct = default)
    {
        var rotated = await tokenService.RotateRefreshTokenAsync(refreshToken, ipAddress, ct);
        if (rotated is null) return null;

        var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Id == rotated.AdminUserId, ct);
        if (user is null || !user.IsActive) return null;

        return new LoginResponse(
            rotated.Tokens.AccessToken, rotated.Tokens.RefreshToken,
            rotated.Tokens.AccessTokenExpiresAt, rotated.Tokens.RefreshTokenExpiresAt,
            new UserDto(user.Id, user.Email, user.Role, user.LastLoginAt));
    }

    public async Task<AdminUser?> FindByIdAsync(Guid id, CancellationToken ct = default)
        => await db.AdminUsers.FirstOrDefaultAsync(u => u.Id == id, ct);

    public Task LogoutAsync(string refreshToken, string? ipAddress, CancellationToken ct = default)
        => tokenService.RevokeRefreshTokenAsync(refreshToken, ipAddress, ct);
}
