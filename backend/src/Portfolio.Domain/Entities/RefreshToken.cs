using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Stores a hashed refresh token for rotation-based refresh flows.
/// The raw token is never persisted; only a SHA-256 hash is stored.
/// </summary>
public class RefreshToken : AuditableEntity
{
    public Guid AdminUserId { get; set; }
    public required string TokenHash { get; set; }
    public required string JwtId { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string? ReplacedByTokenHash { get; set; }
    public string? CreatedByIp { get; set; }
    public string? RevokedByIp { get; set; }

    public AdminUser? AdminUser { get; set; }

    public bool IsActive => RevokedAt is null && DateTime.UtcNow < ExpiresAt;
}
