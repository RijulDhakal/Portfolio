namespace Portfolio.Application.DTOs.Content;

public sealed record SiteSettingDto(
    Guid Id,
    string SiteName,
    string SiteTitle,
    string? MetaTitle,
    string? MetaDescription,
    string? Favicon,
    string? OgImage,
    string? Logo,
    string? CopyrightText,
    string? GoogleAnalyticsId,
    DateTime UpdatedAt);

public sealed record SiteSettingUpsertDto(
    string SiteName,
    string SiteTitle,
    string? MetaTitle,
    string? MetaDescription,
    string? Favicon,
    string? OgImage,
    string? Logo,
    string? CopyrightText,
    string? GoogleAnalyticsId);
