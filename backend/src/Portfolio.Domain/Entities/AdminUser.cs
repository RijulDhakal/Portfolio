using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class AdminUser : AuditableEntity
{
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public string Role { get; set; } = AdminRoles.Admin;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}
