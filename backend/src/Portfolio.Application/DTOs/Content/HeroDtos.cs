namespace Portfolio.Application.DTOs.Content;

public sealed record HeroDto(
    Guid Id,
    string Greeting,
    string Name,
    string Title,
    string Description,
    string? ProfilePhoto,
    string? CvFile,
    string? CvFileName,
    string? PrimaryButtonText,
    string? PrimaryButtonUrl,
    string? SecondaryButtonText,
    string? SecondaryButtonUrl,
    string? AvailabilityText,
    bool IsActive,
    DateTime UpdatedAt);

public sealed record HeroUpsertDto(
    string Greeting,
    string Name,
    string Title,
    string Description,
    string? ProfilePhoto,
    string? CvFile,
    string? CvFileName,
    string? PrimaryButtonText,
    string? PrimaryButtonUrl,
    string? SecondaryButtonText,
    string? SecondaryButtonUrl,
    string? AvailabilityText,
    bool IsActive);
