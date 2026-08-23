using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Single-row store (like <see cref="TypographySetting"/>) holding every
/// user-visible static text string on the public site. Each group maps to a
/// section of the portfolio and is serialized to its own jsonb column.
/// </summary>
public class SiteCopy : AuditableEntity
{
    public SiteCopyNavigation Navigation { get; set; } = new();
    public SiteCopyIntro Intro { get; set; } = new();
    public SiteCopyAbout About { get; set; } = new();
    public SiteCopySkills Skills { get; set; } = new();
    public SiteCopyServices Services { get; set; } = new();
    public SiteCopyWork Work { get; set; } = new();
    public SiteCopyExperience Experience { get; set; } = new();
    public SiteCopyEducation Education { get; set; } = new();
    public SiteCopyPersonal Personal { get; set; } = new();
    public SiteCopyContact Contact { get; set; } = new();
    public SiteCopyFooter Footer { get; set; } = new();
    public SiteCopyGlobalUi GlobalUi { get; set; } = new();
}

public sealed class NavLink
{
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
}

public sealed class SiteCopyNavigation
{
    public string Brand { get; set; } = string.Empty;
    public string HireMe { get; set; } = string.Empty;
    public List<NavLink> Links { get; set; } = new();
}

public sealed class SiteCopyIntro
{
    public string Line1 { get; set; } = string.Empty;
    public string Line2 { get; set; } = string.Empty;
    public string Line3 { get; set; } = string.Empty;

    /// <summary>Supports the <c>{name}</c> token, rendered as a highlighted span.</summary>
    public string Body { get; set; } = string.Empty;
}

public sealed class SiteCopyAbout
{
    public string Number { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Stat1Label { get; set; } = string.Empty;
    public string Stat2Label { get; set; } = string.Empty;
    public string Stat3Label { get; set; } = string.Empty;
    public string StatSuffix { get; set; } = string.Empty;
}

public sealed class SiteCopySkills
{
    public string Number { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;

    /// <summary>Multi-line, separated by <c>\n</c>; alternating lines render secondary.</summary>
    public string Heading { get; set; } = string.Empty;
    public string CenterLabel { get; set; } = string.Empty;
}

public sealed class SiteCopyServices
{
    public string Number { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Heading { get; set; } = string.Empty;
}

public sealed class SiteCopyWork
{
    public string Number { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Heading { get; set; } = string.Empty;
    public string ViewProjectLabel { get; set; } = string.Empty;
    public string Separator { get; set; } = string.Empty;
}

public sealed class SiteCopyExperience
{
    public string Number { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Heading { get; set; } = string.Empty;
}

public sealed class SiteCopyEducation
{
    public string Number { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Heading { get; set; } = string.Empty;
    public string OfConnector { get; set; } = string.Empty;
    public string Dash { get; set; } = string.Empty;
}

public sealed class SiteCopyPersonal
{
    public string Label { get; set; } = string.Empty;
    public string Heading { get; set; } = string.Empty;
    public List<string> MarqueeWords { get; set; } = new();
    public string MarqueeSeparator { get; set; } = string.Empty;

    /// <summary>Supports the <c>{highlight}...{/highlight}</c> token, rendered bold + underlined.</summary>
    public string Body { get; set; } = string.Empty;
}

public sealed class SiteCopyContact
{
    public string Number { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string HeadingLine1 { get; set; } = string.Empty;
    public string HeadingLine2 { get; set; } = string.Empty;

    /// <summary>Rendered with the electric accent color.</summary>
    public string HeadingLine3 { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string EmailLabel { get; set; } = string.Empty;
    public string PhoneLabel { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string FormNameLabel { get; set; } = string.Empty;
    public string FormEmailLabel { get; set; } = string.Empty;
    public string FormMessageLabel { get; set; } = string.Empty;
    public string NamePlaceholder { get; set; } = string.Empty;
    public string EmailPlaceholder { get; set; } = string.Empty;
    public string MessagePlaceholder { get; set; } = string.Empty;
    public string SubmitLabel { get; set; } = string.Empty;
    public string SendingLabel { get; set; } = string.Empty;
    public string SuccessTitle { get; set; } = string.Empty;
    public string SuccessBody { get; set; } = string.Empty;
    public string SendAnotherLabel { get; set; } = string.Empty;
    public string ErrorFallback { get; set; } = string.Empty;
}

public sealed class SiteCopyFooter
{
    public string NavigationHeading { get; set; } = string.Empty;
    public string ContactHeading { get; set; } = string.Empty;
    public List<NavLink> NavLinks { get; set; } = new();
    public string BuiltWith { get; set; } = string.Empty;
}

public sealed class SiteCopyGlobalUi
{
    public string CursorDefault { get; set; } = string.Empty;
    public string CursorHome { get; set; } = string.Empty;
    public string CursorLetsTalk { get; set; } = string.Empty;
    public string CursorView { get; set; } = string.Empty;
    public string CursorDownload { get; set; } = string.Empty;
    public string CursorDesign { get; set; } = string.Empty;
    public string CursorBuild { get; set; } = string.Empty;
    public string CursorCreate { get; set; } = string.Empty;
    public string CursorExplore { get; set; } = string.Empty;
    public string CursorOpen { get; set; } = string.Empty;
    public string CursorBolt { get; set; } = string.Empty;
    public string HeroImageAlt { get; set; } = string.Empty;
}
