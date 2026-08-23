using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class ServiceService(IPortfolioDbContext db, IValidator<ServiceUpsertDto> validator)
{
    public async Task<PagedResult<ServiceDto>> GetAllAsync(string? search, bool? activeOnly, int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Services.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s => s.Title.Contains(search) || s.Description!.Contains(search));
        if (activeOnly == true)
            query = query.Where(s => s.IsActive);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(s => s.DisplayOrder).ThenBy(s => s.Title)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => s.ToDto())
            .ToListAsync(ct);

        return new PagedResult<ServiceDto>(items, total, page, pageSize);
    }

    public async Task<ServiceDto?> GetAsync(Guid id, CancellationToken ct = default)
    {
        var service = await db.Services.FirstOrDefaultAsync(s => s.Id == id, ct);
        return service?.ToDto();
    }

    public async Task<ServiceDto> CreateAsync(ServiceUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var service = new Service
        {
            Title = dto.Title.Trim(),
            Description = dto.Description,
            Icon = dto.Icon,
            Features = dto.Features ?? [],
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };
        db.Services.Add(service);
        await db.SaveChangesAsync(ct);
        return service.ToDto();
    }

    public async Task<ServiceDto?> UpdateAsync(Guid id, ServiceUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var service = await db.Services.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (service is null) return null;

        service.Title = dto.Title.Trim();
        service.Description = dto.Description;
        service.Icon = dto.Icon;
        service.Features = dto.Features ?? [];
        service.DisplayOrder = dto.DisplayOrder;
        service.IsActive = dto.IsActive;
        service.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return service.ToDto();
    }

    public async Task<bool> SetActiveAsync(Guid id, bool isActive, CancellationToken ct = default)
    {
        var service = await db.Services.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (service is null) return false;

        service.IsActive = isActive;
        service.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> ReorderAsync(IReadOnlyList<Guid> orderedIds, CancellationToken ct = default)
    {
        var services = await db.Services.Where(s => orderedIds.Contains(s.Id)).ToListAsync(ct);
        if (services.Count != orderedIds.Count) return false;

        for (var i = 0; i < orderedIds.Count; i++)
        {
            var service = services.First(s => s.Id == orderedIds[i]);
            service.DisplayOrder = i;
        }
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var service = await db.Services.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (service is null) return false;

        db.Services.Remove(service);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
