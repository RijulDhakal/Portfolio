namespace Portfolio.Application.DTOs.Content;

public sealed record NavLinkDto(string Label, string Href);

public sealed record SiteCopyNavigationDto(
    string Brand,
    string HireMe,
    List<NavLinkDto> Links);

public sealed record SiteCopyIntroDto(
    string Line1,
    string Line2,
    string Line3,
    string Body);

public sealed record SiteCopyAboutDto(
    string Number,
    string Label,
    string Stat1Label,
    string Stat2Label,
    string Stat3Label,
    string StatSuffix);

public sealed record SiteCopySkillsDto(
    string Number,
    string Label,
    string Heading,
    string CenterLabel);

public sealed record SiteCopyServicesDto(
    string Number,
    string Label,
    string Heading);

public sealed record SiteCopyWorkDto(
    string Number,
    string Label,
    string Heading,
    string ViewProjectLabel,
    string Separator);

public sealed record SiteCopyExperienceDto(
    string Number,
    string Label,
    string Heading);

public sealed record SiteCopyEducationDto(
    string Number,
    string Label,
    string Heading,
    string OfConnector,
    string Dash);

public sealed record SiteCopyPersonalDto(
    string Label,
    string Heading,
    List<string> MarqueeWords,
    string MarqueeSeparator,
    string Body);

public sealed record SiteCopyContactDto(
    string Number,
    string Label,
    string HeadingLine1,
    string HeadingLine2,
    string HeadingLine3,
    string Body,
    string EmailLabel,
    string PhoneLabel,
    string PhoneNumber,
    string FormNameLabel,
    string FormEmailLabel,
    string FormMessageLabel,
    string NamePlaceholder,
    string EmailPlaceholder,
    string MessagePlaceholder,
    string SubmitLabel,
    string SendingLabel,
    string SuccessTitle,
    string SuccessBody,
    string SendAnotherLabel,
    string ErrorFallback);

public sealed record SiteCopyFooterDto(
    string NavigationHeading,
    string ContactHeading,
    List<NavLinkDto> NavLinks,
    string BuiltWith);

public sealed record SiteCopyGlobalUiDto(
    string CursorDefault,
    string CursorHome,
    string CursorLetsTalk,
    string CursorView,
    string CursorDownload,
    string CursorDesign,
    string CursorBuild,
    string CursorCreate,
    string CursorExplore,
    string CursorOpen,
    string CursorBolt,
    string HeroImageAlt);

public sealed record SiteCopyDto(
    Guid Id,
    SiteCopyNavigationDto Navigation,
    SiteCopyIntroDto Intro,
    SiteCopyAboutDto About,
    SiteCopySkillsDto Skills,
    SiteCopyServicesDto Services,
    SiteCopyWorkDto Work,
    SiteCopyExperienceDto Experience,
    SiteCopyEducationDto Education,
    SiteCopyPersonalDto Personal,
    SiteCopyContactDto Contact,
    SiteCopyFooterDto Footer,
    SiteCopyGlobalUiDto GlobalUi,
    DateTime UpdatedAt);

public sealed record SiteCopyUpsertDto(
    SiteCopyNavigationDto Navigation,
    SiteCopyIntroDto Intro,
    SiteCopyAboutDto About,
    SiteCopySkillsDto Skills,
    SiteCopyServicesDto Services,
    SiteCopyWorkDto Work,
    SiteCopyExperienceDto Experience,
    SiteCopyEducationDto Education,
    SiteCopyPersonalDto Personal,
    SiteCopyContactDto Contact,
    SiteCopyFooterDto Footer,
    SiteCopyGlobalUiDto GlobalUi);
