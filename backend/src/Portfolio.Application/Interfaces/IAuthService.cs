using Portfolio.Application.DTOs.Auth;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces;

public interface IAuthService
{
    Task<AdminUser?> FindByEmailAsync(string email, CancellationToken ct = default);
    Task<AdminUser?> FindByIdAsync(Guid id, CancellationToken ct = default);
    Task<AdminUser> CreateAdminAsync(string email, string password, string role, CancellationToken ct = default);
    Task<LoginResponse?> LoginAsync(string email, string password, string? ipAddress, CancellationToken ct = default);
    Task<LoginResponse?> RefreshAsync(string refreshToken, string? ipAddress, CancellationToken ct = default);
    Task LogoutAsync(string refreshToken, string? ipAddress, CancellationToken ct = default);
}
