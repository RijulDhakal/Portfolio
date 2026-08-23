using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class SkillService(IPortfolioDbContext db, IValidator<SkillUpsertDto> validator)
{
    public async Task<PagedResult<SkillDto>> GetAllAsync(string? search, string? category, bool? activeOnly, int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = db.Skills.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s => s.Name.Contains(search) || s.Description!.Contains(search));
        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(s => s.Category == category);
        if (activeOnly == true)
            query = query.Where(s => s.IsActive);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(s => s.DisplayOrder).ThenBy(s => s.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => s.ToDto())
            .ToListAsync(ct);

        return new PagedResult<SkillDto>(items, total, page, pageSize);
    }

    public async Task<SkillDto?> GetAsync(Guid id, CancellationToken ct = default)
    {
        var skill = await db.Skills.FirstOrDefaultAsync(s => s.Id == id, ct);
        return skill?.ToDto();
    }

    public async Task<SkillDto> CreateAsync(SkillUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var skill = new Skill
        {
            Name = dto.Name.Trim(),
            Category = dto.Category,
            Description = dto.Description,
            Icon = dto.Icon,
            PositionX = dto.PositionX,
            PositionY = dto.PositionY,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };
        db.Skills.Add(skill);
        await db.SaveChangesAsync(ct);
        return skill.ToDto();
    }

    public async Task<SkillDto?> UpdateAsync(Guid id, SkillUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var skill = await db.Skills.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (skill is null) return null;

        skill.Name = dto.Name.Trim();
        skill.Category = dto.Category;
        skill.Description = dto.Description;
        skill.Icon = dto.Icon;
        skill.PositionX = dto.PositionX;
        skill.PositionY = dto.PositionY;
        skill.DisplayOrder = dto.DisplayOrder;
        skill.IsActive = dto.IsActive;
        skill.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return skill.ToDto();
    }

    public async Task<bool> SetActiveAsync(Guid id, bool isActive, CancellationToken ct = default)
    {
        var skill = await db.Skills.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (skill is null) return false;

        skill.IsActive = isActive;
        skill.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> ReorderAsync(IReadOnlyList<Guid> orderedIds, CancellationToken ct = default)
    {
        var skills = await db.Skills.Where(s => orderedIds.Contains(s.Id)).ToListAsync(ct);
        if (skills.Count != orderedIds.Count) return false;

        for (var i = 0; i < orderedIds.Count; i++)
        {
            var skill = skills.First(s => s.Id == orderedIds[i]);
            skill.DisplayOrder = i;
        }
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var skill = await db.Skills.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (skill is null) return false;

        db.Skills.Remove(skill);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
