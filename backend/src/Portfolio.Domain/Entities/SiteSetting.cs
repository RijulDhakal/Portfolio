using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class SiteSetting : AuditableEntity
{
    public string SiteName { get; set; } = "Rijul Dhakal";
    public string SiteTitle { get; set; } = "UI/UX Designer & Developer";
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? Favicon { get; set; }
    public string? OgImage { get; set; }
    public string? Logo { get; set; }
    public string? CopyrightText { get; set; }
    public string? GoogleAnalyticsId { get; set; }
}
