using System.ComponentModel.DataAnnotations;

namespace Portfolio.Application.DTOs.Contact;

public sealed record ContactMessageRequest
{
    [Required, MaxLength(200)]
    public string Name { get; init; } = string.Empty;

    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; init; } = string.Empty;

    [Required, MinLength(10), MaxLength(5000)]
    public string Message { get; init; } = string.Empty;
}

public sealed record ContactMessageDto(
    Guid Id,
    string Name,
    string Email,
    string Message,
    bool IsRead,
    DateTime CreatedAt);
