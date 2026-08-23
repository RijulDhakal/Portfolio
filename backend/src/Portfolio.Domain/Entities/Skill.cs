using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// A skill displayed in the interactive skill universe.
/// PositionX / PositionY are optional percentage strings (e.g. "20.00%") that
/// let the CMS control where the skill sits in the frontend orbit animation
/// while the frontend keeps ownership of the animation itself.
/// </summary>
public class Skill : AuditableEntity
{
    public required string Name { get; set; }
    public string Category { get; set; } = "Development";
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public string? PositionX { get; set; }
    public string? PositionY { get; set; }
    public bool IsActive { get; set; } = true;
}
