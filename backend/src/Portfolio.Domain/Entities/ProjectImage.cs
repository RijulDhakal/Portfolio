using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class ProjectImage : AuditableEntity
{
    public Guid ProjectId { get; set; }
    public required string ImageUrl { get; set; }
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }

    public Project? Project { get; set; }
}
