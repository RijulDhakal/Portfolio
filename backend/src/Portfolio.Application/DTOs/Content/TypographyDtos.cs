namespace Portfolio.Application.DTOs.Content;

public sealed record TypographyGlobalDto(
    string? HeadingFont,
    string? BodyFont,
    string? HeadingSize,
    string? BodySize,
    string? HeadingWeight,
    string? BodyWeight,
    string? HeadingLetterSpacing,
    string? BodyLetterSpacing,
    string? HeadingLineHeight,
    string? BodyLineHeight,
    bool? HeadingUppercase);

public sealed record TypographyElementOverrideDto(
    string? FontFamily,
    string? FontSize,
    string? FontWeight,
    string? LetterSpacing,
    string? LineHeight,
    bool? Uppercase,
    string? TextAlign);

public sealed record TypographySettingDto(
    Guid Id,
    TypographyGlobalDto Global,
    Dictionary<string, TypographyElementOverrideDto> Overrides,
    DateTime UpdatedAt);

public sealed record TypographySettingUpsertDto(
    TypographyGlobalDto Global,
    Dictionary<string, TypographyElementOverrideDto> Overrides);
