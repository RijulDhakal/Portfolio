using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class ExperienceService(IPortfolioDbContext db, IValidator<ExperienceUpsertDto> validator)
{
    public async Task<PagedResult<ExperienceDto>> GetAllAsync(string? search, int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Experiences.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(e => e.Role.Contains(search) || e.Description!.Contains(search));

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(e => e.DisplayOrder).ThenBy(e => e.Year)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(e => e.ToDto())
            .ToListAsync(ct);

        return new PagedResult<ExperienceDto>(items, total, page, pageSize);
    }

    public async Task<ExperienceDto?> GetAsync(Guid id, CancellationToken ct = default)
    {
        var experience = await db.Experiences.FirstOrDefaultAsync(e => e.Id == id, ct);
        return experience?.ToDto();
    }

    public async Task<ExperienceDto> CreateAsync(ExperienceUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var experience = new Experience
        {
            Year = dto.Year.Trim(),
            Role = dto.Role.Trim(),
            Description = dto.Description,
            DisplayOrder = dto.DisplayOrder
        };
        db.Experiences.Add(experience);
        await db.SaveChangesAsync(ct);
        return experience.ToDto();
    }

    public async Task<ExperienceDto?> UpdateAsync(Guid id, ExperienceUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var experience = await db.Experiences.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (experience is null) return null;

        experience.Year = dto.Year.Trim();
        experience.Role = dto.Role.Trim();
        experience.Description = dto.Description;
        experience.DisplayOrder = dto.DisplayOrder;
        experience.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return experience.ToDto();
    }

    public async Task<bool> ReorderAsync(IReadOnlyList<Guid> orderedIds, CancellationToken ct = default)
    {
        var experiences = await db.Experiences.Where(e => orderedIds.Contains(e.Id)).ToListAsync(ct);
        if (experiences.Count != orderedIds.Count) return false;

        for (var i = 0; i < orderedIds.Count; i++)
        {
            var experience = experiences.First(e => e.Id == orderedIds[i]);
            experience.DisplayOrder = i;
        }
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var experience = await db.Experiences.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (experience is null) return false;

        db.Experiences.Remove(experience);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
