namespace Portfolio.Application.DTOs.Content;

public sealed record ExperienceDto(
    Guid Id,
    string Year,
    string Role,
    string? Description,
    int DisplayOrder);

public sealed record ExperienceUpsertDto(
    string Year,
    string Role,
    string? Description,
    int DisplayOrder);
