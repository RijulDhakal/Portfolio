using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class EducationService(IPortfolioDbContext db, IValidator<EducationUpsertDto> validator)
{
    public async Task<PagedResult<EducationDto>> GetAllAsync(string? search, int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Educations.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(e => e.Institution.Contains(search) || e.Field!.Contains(search));

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(e => e.DisplayOrder).ThenBy(e => e.StartYear)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(e => e.ToDto())
            .ToListAsync(ct);

        return new PagedResult<EducationDto>(items, total, page, pageSize);
    }

    public async Task<EducationDto?> GetAsync(Guid id, CancellationToken ct = default)
    {
        var education = await db.Educations.FirstOrDefaultAsync(e => e.Id == id, ct);
        return education?.ToDto();
    }

    public async Task<EducationDto> CreateAsync(EducationUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var education = new Education
        {
            Institution = dto.Institution.Trim(),
            Degree = dto.Degree.Trim(),
            Field = dto.Field,
            StartYear = dto.StartYear,
            EndYear = dto.EndYear,
            Description = dto.Description,
            DisplayOrder = dto.DisplayOrder
        };
        db.Educations.Add(education);
        await db.SaveChangesAsync(ct);
        return education.ToDto();
    }

    public async Task<EducationDto?> UpdateAsync(Guid id, EducationUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var education = await db.Educations.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (education is null) return null;

        education.Institution = dto.Institution.Trim();
        education.Degree = dto.Degree.Trim();
        education.Field = dto.Field;
        education.StartYear = dto.StartYear;
        education.EndYear = dto.EndYear;
        education.Description = dto.Description;
        education.DisplayOrder = dto.DisplayOrder;
        education.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return education.ToDto();
    }

    public async Task<bool> ReorderAsync(IReadOnlyList<Guid> orderedIds, CancellationToken ct = default)
    {
        var educations = await db.Educations.Where(e => orderedIds.Contains(e.Id)).ToListAsync(ct);
        if (educations.Count != orderedIds.Count) return false;

        for (var i = 0; i < orderedIds.Count; i++)
        {
            var education = educations.First(e => e.Id == orderedIds[i]);
            education.DisplayOrder = i;
        }
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var education = await db.Educations.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (education is null) return false;

        db.Educations.Remove(education);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
