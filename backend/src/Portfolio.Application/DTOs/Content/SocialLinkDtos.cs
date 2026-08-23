namespace Portfolio.Application.DTOs.Content;

public sealed record SocialLinkDto(
    Guid Id,
    string Platform,
    string? Label,
    string? ShortLabel,
    string Url,
    string? Icon,
    int DisplayOrder,
    bool IsActive);

public sealed record SocialLinkUpsertDto(
    string Platform,
    string? Label,
    string? ShortLabel,
    string Url,
    string? Icon,
    int DisplayOrder,
    bool IsActive);
