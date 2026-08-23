using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class SocialLink : AuditableEntity
{
    public required string Platform { get; set; }
    public string? Label { get; set; }
    public string? ShortLabel { get; set; }
    public required string Url { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
