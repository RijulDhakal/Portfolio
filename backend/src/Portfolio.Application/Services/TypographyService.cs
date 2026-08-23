using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class TypographyService(
    IPortfolioDbContext db,
    IValidator<TypographySettingUpsertDto> validator)
{
    public async Task<TypographySettingDto?> GetAsync(CancellationToken ct = default)
    {
        var settings = await db.TypographySettings.OrderBy(s => s.CreatedAt).FirstOrDefaultAsync(ct);
        return settings?.ToDto();
    }

    public async Task<TypographySettingDto> UpsertAsync(TypographySettingUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var settings = await db.TypographySettings.OrderBy(s => s.CreatedAt).FirstOrDefaultAsync(ct);
        if (settings is null)
        {
            settings = new TypographySetting();
            db.TypographySettings.Add(settings);
        }

        settings.Global = dto.Global.ToEntity();
        settings.Overrides = dto.Overrides.ToEntity();
        settings.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return settings.ToDto();
    }
}
