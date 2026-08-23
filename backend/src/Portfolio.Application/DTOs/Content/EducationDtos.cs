namespace Portfolio.Application.DTOs.Content;

public sealed record EducationDto(
    Guid Id,
    string Institution,
    string Degree,
    string? Field,
    string? StartYear,
    string? EndYear,
    string? Description,
    int DisplayOrder);

public sealed record EducationUpsertDto(
    string Institution,
    string Degree,
    string? Field,
    string? StartYear,
    string? EndYear,
    string? Description,
    int DisplayOrder);
