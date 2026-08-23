using Portfolio.Application.DTOs.Content;
using Portfolio.Application.DTOs.Contact;
using Portfolio.Application.DTOs.Media;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Mapping;

public static class Mappers
{
    public static string? ResolveUrl(string? url, string? baseUrl)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;
        if (url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
            url.StartsWith("https://", StringComparison.OrdinalIgnoreCase) ||
            url.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
            return url;
        if (url.StartsWith("/uploads", StringComparison.OrdinalIgnoreCase) &&
            !string.IsNullOrWhiteSpace(baseUrl))
            return baseUrl.TrimEnd('/') + url;
        return url;
    }

    public static HeroDto ToDto(this Hero h, string? baseUrl = null) => new(
        h.Id, h.Greeting, h.Name, h.Title, h.Description,
        ResolveUrl(h.ProfilePhoto, baseUrl), ResolveUrl(h.CvFile, baseUrl), h.CvFileName,
        h.PrimaryButtonText, h.PrimaryButtonUrl, h.SecondaryButtonText, h.SecondaryButtonUrl,
        h.AvailabilityText, h.IsActive, h.UpdatedAt);

    public static AboutDto ToDto(this About a, string? baseUrl = null) => new(
        a.Id, a.Heading, a.Description, ResolveUrl(a.ProfileImage, baseUrl),
        a.ExperienceYears, a.ProjectsCompleted, a.TechnologiesCount, a.CommitsCount,
        a.Education, a.AdditionalInformation, a.UpdatedAt);

    public static SkillDto ToDto(this Skill s) => new(
        s.Id, s.Name, s.Category, s.Description, s.Icon, s.PositionX, s.PositionY,
        s.DisplayOrder, s.IsActive);

    public static ServiceDto ToDto(this Service s) => new(
        s.Id, s.Title, s.Description, s.Icon, s.Features, s.DisplayOrder, s.IsActive);

    public static ExperienceDto ToDto(this Experience e) => new(
        e.Id, e.Year, e.Role, e.Description, e.DisplayOrder);

    public static EducationDto ToDto(this Education e) => new(
        e.Id, e.Institution, e.Degree, e.Field, e.StartYear, e.EndYear, e.Description, e.DisplayOrder);

    public static ProjectImageDto ToDto(this ProjectImage i) => new(i.Id, i.ImageUrl, i.AltText, i.DisplayOrder);

    public static ProjectDto ToDto(this Project p, string? baseUrl = null) => new(
        p.Id, p.Title, p.Slug, p.ShortDescription, p.FullDescription, p.Category,
        p.Technologies, ResolveUrl(p.Thumbnail, baseUrl), ResolveUrl(p.FeaturedImage, baseUrl),
        p.LiveUrl, p.GithubUrl, p.FigmaUrl, p.CaseStudyUrl,
        p.Year, p.Role, p.Client, p.Problem, p.Goal, p.Contribution, p.Process,
        p.Features, p.Challenges, p.Solution, p.Results,
        p.DisplayOrder, p.IsFeatured, p.IsPublished, p.CreatedAt, p.UpdatedAt,
        p.Images.OrderBy(i => i.DisplayOrder).Select(i => new ProjectImageDto(i.Id, ResolveUrl(i.ImageUrl, baseUrl) ?? string.Empty, i.AltText, i.DisplayOrder)).ToList());

    public static SiteSettingDto ToDto(this SiteSetting s) => new(
        s.Id, s.SiteName, s.SiteTitle, s.MetaTitle, s.MetaDescription,
        s.Favicon, s.OgImage, s.Logo, s.CopyrightText, s.GoogleAnalyticsId, s.UpdatedAt);

    public static SocialLinkDto ToDto(this SocialLink s) => new(
        s.Id, s.Platform, s.Label, s.ShortLabel, s.Url, s.Icon, s.DisplayOrder, s.IsActive);

    public static ContactMessageDto ToDto(this ContactMessage m) => new(
        m.Id, m.Name, m.Email, m.Message, m.IsRead, m.CreatedAt);

    public static MediaItemDto ToDto(this MediaItem m, string? baseUrl = null) => new(
        m.Id, m.FileName, m.OriginalFileName, m.FileType.ToString(), m.MimeType,
        m.FileSize, ResolveUrl(m.Url, baseUrl) ?? string.Empty, m.AltText,
        m.Folder, m.UploadedAt, m.UploadedBy);

    public static TypographyGlobalDto ToDto(this TypographyGlobalSettings g) => new(
        g.HeadingFont, g.BodyFont, g.HeadingSize, g.BodySize,
        g.HeadingWeight, g.BodyWeight, g.HeadingLetterSpacing, g.BodyLetterSpacing,
        g.HeadingLineHeight, g.BodyLineHeight, g.HeadingUppercase);

    public static TypographyElementOverrideDto ToDto(this TypographyElementOverride o) => new(
        o.FontFamily, o.FontSize, o.FontWeight, o.LetterSpacing,
        o.LineHeight, o.Uppercase, o.TextAlign);

    public static TypographySettingDto ToDto(this TypographySetting s) => new(
        s.Id,
        s.Global.ToDto(),
        s.Overrides.ToDictionary(kv => kv.Key, kv => kv.Value.ToDto()),
        s.UpdatedAt);

    public static TypographyGlobalSettings ToEntity(this TypographyGlobalDto d) => new()
    {
        HeadingFont = d.HeadingFont,
        BodyFont = d.BodyFont,
        HeadingSize = d.HeadingSize,
        BodySize = d.BodySize,
        HeadingWeight = d.HeadingWeight,
        BodyWeight = d.BodyWeight,
        HeadingLetterSpacing = d.HeadingLetterSpacing,
        BodyLetterSpacing = d.BodyLetterSpacing,
        HeadingLineHeight = d.HeadingLineHeight,
        BodyLineHeight = d.BodyLineHeight,
        HeadingUppercase = d.HeadingUppercase,
    };

    public static TypographyElementOverride ToEntity(this TypographyElementOverrideDto d) => new()
    {
        FontFamily = d.FontFamily,
        FontSize = d.FontSize,
        FontWeight = d.FontWeight,
        LetterSpacing = d.LetterSpacing,
        LineHeight = d.LineHeight,
        Uppercase = d.Uppercase,
        TextAlign = d.TextAlign,
    };

    public static Dictionary<string, TypographyElementOverride> ToEntity(this Dictionary<string, TypographyElementOverrideDto> overrides) =>
        overrides.ToDictionary(kv => kv.Key, kv => kv.Value.ToEntity());

    public static NavLinkDto ToDto(this NavLink n) => new(n.Label, n.Href);

    public static NavLink ToEntity(this NavLinkDto d) => new()
    {
        Label = d.Label,
        Href = d.Href,
    };

    public static SiteCopyNavigationDto ToDto(this SiteCopyNavigation g) => new(
        g.Brand, g.HireMe, g.Links.Select(l => l.ToDto()).ToList());

    public static SiteCopyNavigation ToEntity(this SiteCopyNavigationDto d) => new()
    {
        Brand = d.Brand,
        HireMe = d.HireMe,
        Links = d.Links.Select(l => l.ToEntity()).ToList(),
    };

    public static SiteCopyIntroDto ToDto(this SiteCopyIntro g) => new(
        g.Line1, g.Line2, g.Line3, g.Body);

    public static SiteCopyIntro ToEntity(this SiteCopyIntroDto d) => new()
    {
        Line1 = d.Line1,
        Line2 = d.Line2,
        Line3 = d.Line3,
        Body = d.Body,
    };

    public static SiteCopyAboutDto ToDto(this SiteCopyAbout g) => new(
        g.Number, g.Label, g.Stat1Label, g.Stat2Label, g.Stat3Label, g.StatSuffix);

    public static SiteCopyAbout ToEntity(this SiteCopyAboutDto d) => new()
    {
        Number = d.Number,
        Label = d.Label,
        Stat1Label = d.Stat1Label,
        Stat2Label = d.Stat2Label,
        Stat3Label = d.Stat3Label,
        StatSuffix = d.StatSuffix,
    };

    public static SiteCopySkillsDto ToDto(this SiteCopySkills g) => new(
        g.Number, g.Label, g.Heading, g.CenterLabel);

    public static SiteCopySkills ToEntity(this SiteCopySkillsDto d) => new()
    {
        Number = d.Number,
        Label = d.Label,
        Heading = d.Heading,
        CenterLabel = d.CenterLabel,
    };

    public static SiteCopyServicesDto ToDto(this SiteCopyServices g) => new(
        g.Number, g.Label, g.Heading);

    public static SiteCopyServices ToEntity(this SiteCopyServicesDto d) => new()
    {
        Number = d.Number,
        Label = d.Label,
        Heading = d.Heading,
    };

    public static SiteCopyWorkDto ToDto(this SiteCopyWork g) => new(
        g.Number, g.Label, g.Heading, g.ViewProjectLabel, g.Separator);

    public static SiteCopyWork ToEntity(this SiteCopyWorkDto d) => new()
    {
        Number = d.Number,
        Label = d.Label,
        Heading = d.Heading,
        ViewProjectLabel = d.ViewProjectLabel,
        Separator = d.Separator,
    };

    public static SiteCopyExperienceDto ToDto(this SiteCopyExperience g) => new(
        g.Number, g.Label, g.Heading);

    public static SiteCopyExperience ToEntity(this SiteCopyExperienceDto d) => new()
    {
        Number = d.Number,
        Label = d.Label,
        Heading = d.Heading,
    };

    public static SiteCopyEducationDto ToDto(this SiteCopyEducation g) => new(
        g.Number, g.Label, g.Heading, g.OfConnector, g.Dash);

    public static SiteCopyEducation ToEntity(this SiteCopyEducationDto d) => new()
    {
        Number = d.Number,
        Label = d.Label,
        Heading = d.Heading,
        OfConnector = d.OfConnector,
        Dash = d.Dash,
    };

    public static SiteCopyPersonalDto ToDto(this SiteCopyPersonal g) => new(
        g.Label, g.Heading, g.MarqueeWords, g.MarqueeSeparator, g.Body);

    public static SiteCopyPersonal ToEntity(this SiteCopyPersonalDto d) => new()
    {
        Label = d.Label,
        Heading = d.Heading,
        MarqueeWords = d.MarqueeWords,
        MarqueeSeparator = d.MarqueeSeparator,
        Body = d.Body,
    };

    public static SiteCopyContactDto ToDto(this SiteCopyContact g) => new(
        g.Number, g.Label, g.HeadingLine1, g.HeadingLine2, g.HeadingLine3, g.Body,
        g.EmailLabel, g.PhoneLabel, g.PhoneNumber,
        g.FormNameLabel, g.FormEmailLabel, g.FormMessageLabel,
        g.NamePlaceholder, g.EmailPlaceholder, g.MessagePlaceholder,
        g.SubmitLabel, g.SendingLabel, g.SuccessTitle, g.SuccessBody, g.SendAnotherLabel, g.ErrorFallback);

    public static SiteCopyContact ToEntity(this SiteCopyContactDto d) => new()
    {
        Number = d.Number,
        Label = d.Label,
        HeadingLine1 = d.HeadingLine1,
        HeadingLine2 = d.HeadingLine2,
        HeadingLine3 = d.HeadingLine3,
        Body = d.Body,
        EmailLabel = d.EmailLabel,
        PhoneLabel = d.PhoneLabel,
        PhoneNumber = d.PhoneNumber,
        FormNameLabel = d.FormNameLabel,
        FormEmailLabel = d.FormEmailLabel,
        FormMessageLabel = d.FormMessageLabel,
        NamePlaceholder = d.NamePlaceholder,
        EmailPlaceholder = d.EmailPlaceholder,
        MessagePlaceholder = d.MessagePlaceholder,
        SubmitLabel = d.SubmitLabel,
        SendingLabel = d.SendingLabel,
        SuccessTitle = d.SuccessTitle,
        SuccessBody = d.SuccessBody,
        SendAnotherLabel = d.SendAnotherLabel,
        ErrorFallback = d.ErrorFallback,
    };

    public static SiteCopyFooterDto ToDto(this SiteCopyFooter g) => new(
        g.NavigationHeading, g.ContactHeading, g.NavLinks.Select(l => l.ToDto()).ToList(), g.BuiltWith);

    public static SiteCopyFooter ToEntity(this SiteCopyFooterDto d) => new()
    {
        NavigationHeading = d.NavigationHeading,
        ContactHeading = d.ContactHeading,
        NavLinks = d.NavLinks.Select(l => l.ToEntity()).ToList(),
        BuiltWith = d.BuiltWith,
    };

    public static SiteCopyGlobalUiDto ToDto(this SiteCopyGlobalUi g) => new(
        g.CursorDefault, g.CursorHome, g.CursorLetsTalk, g.CursorView, g.CursorDownload,
        g.CursorDesign, g.CursorBuild, g.CursorCreate, g.CursorExplore, g.CursorOpen,
        g.CursorBolt, g.HeroImageAlt);

    public static SiteCopyGlobalUi ToEntity(this SiteCopyGlobalUiDto d) => new()
    {
        CursorDefault = d.CursorDefault,
        CursorHome = d.CursorHome,
        CursorLetsTalk = d.CursorLetsTalk,
        CursorView = d.CursorView,
        CursorDownload = d.CursorDownload,
        CursorDesign = d.CursorDesign,
        CursorBuild = d.CursorBuild,
        CursorCreate = d.CursorCreate,
        CursorExplore = d.CursorExplore,
        CursorOpen = d.CursorOpen,
        CursorBolt = d.CursorBolt,
        HeroImageAlt = d.HeroImageAlt,
    };

    public static SiteCopyDto ToDto(this SiteCopy s) => new(
        s.Id,
        s.Navigation.ToDto(),
        s.Intro.ToDto(),
        s.About.ToDto(),
        s.Skills.ToDto(),
        s.Services.ToDto(),
        s.Work.ToDto(),
        s.Experience.ToDto(),
        s.Education.ToDto(),
        s.Personal.ToDto(),
        s.Contact.ToDto(),
        s.Footer.ToDto(),
        s.GlobalUi.ToDto(),
        s.UpdatedAt);

    public static SiteCopy ToEntity(this SiteCopyUpsertDto d) => new()
    {
        Navigation = d.Navigation.ToEntity(),
        Intro = d.Intro.ToEntity(),
        About = d.About.ToEntity(),
        Skills = d.Skills.ToEntity(),
        Services = d.Services.ToEntity(),
        Work = d.Work.ToEntity(),
        Experience = d.Experience.ToEntity(),
        Education = d.Education.ToEntity(),
        Personal = d.Personal.ToEntity(),
        Contact = d.Contact.ToEntity(),
        Footer = d.Footer.ToEntity(),
        GlobalUi = d.GlobalUi.ToEntity(),
    };
}
