namespace Portfolio.Application.DTOs.Content;

public sealed record SkillDto(
    Guid Id,
    string Name,
    string Category,
    string? Description,
    string? Icon,
    string? PositionX,
    string? PositionY,
    int DisplayOrder,
    bool IsActive);

public sealed record SkillUpsertDto(
    string Name,
    string Category,
    string? Description,
    string? Icon,
    string? PositionX,
    string? PositionY,
    int DisplayOrder,
    bool IsActive);
