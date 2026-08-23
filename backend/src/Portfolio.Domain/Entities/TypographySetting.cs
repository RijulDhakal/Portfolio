using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>Single-row store; Overrides keyed by element key, null = inherit design default.</summary>
public class TypographySetting : AuditableEntity
{
    public TypographyGlobalSettings Global { get; set; } = new();
    public Dictionary<string, TypographyElementOverride> Overrides { get; set; } = new();
}

public sealed class TypographyGlobalSettings
{
    public string? HeadingFont { get; set; }
    public string? BodyFont { get; set; }
    public string? HeadingSize { get; set; }
    public string? BodySize { get; set; }
    public string? HeadingWeight { get; set; }
    public string? BodyWeight { get; set; }
    public string? HeadingLetterSpacing { get; set; }
    public string? BodyLetterSpacing { get; set; }
    public string? HeadingLineHeight { get; set; }
    public string? BodyLineHeight { get; set; }
    public bool? HeadingUppercase { get; set; }
}

/// <summary>
/// Per-element override. All values are optional; a null value means the
/// element inherits from the global defaults (or the design default).
/// </summary>
public sealed class TypographyElementOverride
{
    public string? FontFamily { get; set; }
    public string? FontSize { get; set; }
    public string? FontWeight { get; set; }
    public string? LetterSpacing { get; set; }
    public string? LineHeight { get; set; }
    public bool? Uppercase { get; set; }
    public string? TextAlign { get; set; }
}
