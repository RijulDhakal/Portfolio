namespace Portfolio.Application.DTOs.Content;

public sealed record ServiceDto(
    Guid Id,
    string Title,
    string? Description,
    string? Icon,
    List<string> Features,
    int DisplayOrder,
    bool IsActive);

public sealed record ServiceUpsertDto(
    string Title,
    string? Description,
    string? Icon,
    List<string>? Features,
    int DisplayOrder,
    bool IsActive);
