using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class SocialLinkService(IPortfolioDbContext db, IValidator<SocialLinkUpsertDto> validator)
{
    public async Task<PagedResult<SocialLinkDto>> GetAllAsync(string? search, bool? activeOnly, int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.SocialLinks.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s => s.Platform.Contains(search) || s.Label!.Contains(search));
        if (activeOnly == true)
            query = query.Where(s => s.IsActive);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(s => s.DisplayOrder).ThenBy(s => s.Platform)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => s.ToDto())
            .ToListAsync(ct);

        return new PagedResult<SocialLinkDto>(items, total, page, pageSize);
    }

    public async Task<SocialLinkDto?> GetAsync(Guid id, CancellationToken ct = default)
    {
        var link = await db.SocialLinks.FirstOrDefaultAsync(s => s.Id == id, ct);
        return link?.ToDto();
    }

    public async Task<SocialLinkDto> CreateAsync(SocialLinkUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var link = new SocialLink
        {
            Platform = dto.Platform.Trim(),
            Label = dto.Label,
            Url = dto.Url.Trim(),
            Icon = dto.Icon,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };
        db.SocialLinks.Add(link);
        await db.SaveChangesAsync(ct);
        return link.ToDto();
    }

    public async Task<SocialLinkDto?> UpdateAsync(Guid id, SocialLinkUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var link = await db.SocialLinks.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (link is null) return null;

        link.Platform = dto.Platform.Trim();
        link.Label = dto.Label;
        link.Url = dto.Url.Trim();
        link.Icon = dto.Icon;
        link.DisplayOrder = dto.DisplayOrder;
        link.IsActive = dto.IsActive;
        link.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return link.ToDto();
    }

    public async Task<bool> SetActiveAsync(Guid id, bool isActive, CancellationToken ct = default)
    {
        var link = await db.SocialLinks.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (link is null) return false;

        link.IsActive = isActive;
        link.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> ReorderAsync(IReadOnlyList<Guid> orderedIds, CancellationToken ct = default)
    {
        var links = await db.SocialLinks.Where(s => orderedIds.Contains(s.Id)).ToListAsync(ct);
        if (links.Count != orderedIds.Count) return false;

        for (var i = 0; i < orderedIds.Count; i++)
        {
            var link = links.First(s => s.Id == orderedIds[i]);
            link.DisplayOrder = i;
        }
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var link = await db.SocialLinks.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (link is null) return false;

        db.SocialLinks.Remove(link);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
