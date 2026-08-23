using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

public class ContactMessage : AuditableEntity
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Message { get; set; }
    public bool IsRead { get; set; }
}
