using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Education : AuditableEntity
{
    public required string Institution { get; set; }
    public string Degree { get; set; } = "Bachelor";
    public string? Field { get; set; }
    public string? StartYear { get; set; }
    public string? EndYear { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
}
