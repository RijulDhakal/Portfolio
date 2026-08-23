using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class SiteCopyService(
    IPortfolioDbContext db,
    IValidator<SiteCopyUpsertDto> validator)
{
    public async Task<SiteCopyDto?> GetAsync(CancellationToken ct = default)
    {
        var copy = await db.SiteCopies.OrderBy(s => s.CreatedAt).FirstOrDefaultAsync(ct);
        return copy?.ToDto();
    }

    public async Task<SiteCopyDto> UpsertAsync(SiteCopyUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var copy = await db.SiteCopies.OrderBy(s => s.CreatedAt).FirstOrDefaultAsync(ct);
        if (copy is null)
        {
            copy = new SiteCopy();
            db.SiteCopies.Add(copy);
        }

        copy.Navigation = dto.Navigation.ToEntity();
        copy.Intro = dto.Intro.ToEntity();
        copy.About = dto.About.ToEntity();
        copy.Skills = dto.Skills.ToEntity();
        copy.Services = dto.Services.ToEntity();
        copy.Work = dto.Work.ToEntity();
        copy.Experience = dto.Experience.ToEntity();
        copy.Education = dto.Education.ToEntity();
        copy.Personal = dto.Personal.ToEntity();
        copy.Contact = dto.Contact.ToEntity();
        copy.Footer = dto.Footer.ToEntity();
        copy.GlobalUi = dto.GlobalUi.ToEntity();
        copy.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return copy.ToDto();
    }
}
