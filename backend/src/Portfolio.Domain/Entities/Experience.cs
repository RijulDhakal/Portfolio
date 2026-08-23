using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Experience : AuditableEntity
{
    public string Year { get; set; } = "2024 — PRESENT";
    public required string Role { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
}
