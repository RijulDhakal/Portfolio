using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Contact;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class ContactService(IPortfolioDbContext db, IValidator<ContactMessageRequest> validator)
{
    public async Task<ContactMessageDto> SubmitAsync(ContactMessageRequest request, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(request, ct);
        var message = new ContactMessage
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Message = request.Message.Trim()
        };
        db.ContactMessages.Add(message);
        await db.SaveChangesAsync(ct);
        return message.ToDto();
    }

    public async Task<PagedResult<ContactMessageDto>> GetAllAsync(int page, int pageSize, bool? unreadOnly, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.ContactMessages.AsNoTracking();
        if (unreadOnly == true)
            query = query.Where(m => !m.IsRead);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => m.ToDto())
            .ToListAsync(ct);

        return new PagedResult<ContactMessageDto>(items, total, page, pageSize);
    }

    public async Task<ContactMessageDto?> GetAsync(Guid id, CancellationToken ct = default)
    {
        var message = await db.ContactMessages.FirstOrDefaultAsync(m => m.Id == id, ct);
        return message?.ToDto();
    }

    public async Task<bool> MarkReadAsync(Guid id, bool isRead, CancellationToken ct = default)
    {
        var message = await db.ContactMessages.FirstOrDefaultAsync(m => m.Id == id, ct);
        if (message is null) return false;

        message.IsRead = isRead;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var message = await db.ContactMessages.FirstOrDefaultAsync(m => m.Id == id, ct);
        if (message is null) return false;

        db.ContactMessages.Remove(message);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
