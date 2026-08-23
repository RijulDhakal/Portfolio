namespace Portfolio.Application.DTOs.Content;

public sealed record AboutDto(
    Guid Id,
    string Heading,
    string Description,
    string? ProfileImage,
    int ExperienceYears,
    int ProjectsCompleted,
    int TechnologiesCount,
    int? CommitsCount,
    string? Education,
    string? AdditionalInformation,
    DateTime UpdatedAt);

public sealed record AboutUpsertDto(
    string Heading,
    string Description,
    string? ProfileImage,
    int ExperienceYears,
    int ProjectsCompleted,
    int TechnologiesCount,
    int? CommitsCount,
    string? Education,
    string? AdditionalInformation);
