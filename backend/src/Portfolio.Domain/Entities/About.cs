using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class About : AuditableEntity
{
    public string Heading { get; set; } = "Designing with purpose.";
    public string Description { get; set; } =
        "I'm a UI/UX Designer and Developer who enjoys turning ideas into intuitive interfaces and functional digital products.";
    public string? ProfileImage { get; set; }
    public int ExperienceYears { get; set; } = 2;
    public int ProjectsCompleted { get; set; } = 10;
    public int TechnologiesCount { get; set; } = 15;
    public int? CommitsCount { get; set; }
    public string? Education { get; set; }
    public string? AdditionalInformation { get; set; }
}
