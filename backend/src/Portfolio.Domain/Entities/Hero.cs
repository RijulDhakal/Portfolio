using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Hero : AuditableEntity
{
    public string Greeting { get; set; } = "Hello I'm";
    public string Name { get; set; } = "Rijul Dhakal";
    public string Title { get; set; } = "UI/UX Designer & Developer";
    public string Description { get; set; } =
        "I excel at designing elegant digital experiences and developing modern web applications.";
    public string? ProfilePhoto { get; set; }
    public string? CvFile { get; set; }
    public string? CvFileName { get; set; }
    public string? PrimaryButtonText { get; set; } = "VIEW MY WORK";
    public string? PrimaryButtonUrl { get; set; }
    public string? SecondaryButtonText { get; set; } = "DOWNLOAD CV";
    public string? SecondaryButtonUrl { get; set; }
    public string? AvailabilityText { get; set; }
    public bool IsActive { get; set; } = true;
}
