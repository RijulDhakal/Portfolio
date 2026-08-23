using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Service : AuditableEntity
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public List<string> Features { get; set; } = [];
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
