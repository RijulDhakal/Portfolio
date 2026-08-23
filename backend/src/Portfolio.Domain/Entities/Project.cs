using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class Project : AuditableEntity
{
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public string? ShortDescription { get; set; }
    public string? FullDescription { get; set; }
    public string? Category { get; set; }
    public List<string> Technologies { get; set; } = [];
    public string? Thumbnail { get; set; }
    public string? FeaturedImage { get; set; }
    public string? LiveUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? FigmaUrl { get; set; }
    public string? CaseStudyUrl { get; set; }

    // Optional case-study metadata. All nullable so existing projects keep working.
    public string? Year { get; set; }
    public string? Role { get; set; }
    public string? Client { get; set; }
    public string? Problem { get; set; }
    public string? Goal { get; set; }
    public string? Contribution { get; set; }
    public string? Process { get; set; }
    public List<string> Features { get; set; } = [];
    public string? Challenges { get; set; }
    public string? Solution { get; set; }
    public string? Results { get; set; }

    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsPublished { get; set; }

    public ICollection<ProjectImage> Images { get; set; } = [];
}
