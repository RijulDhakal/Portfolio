using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed class ContentService(
    IPortfolioDbContext db,
    IValidator<HeroUpsertDto> heroValidator,
    IValidator<AboutUpsertDto> aboutValidator,
    IValidator<SiteSettingUpsertDto> settingsValidator)
{
    public async Task<HeroDto?> GetHeroAsync(string? baseUrl = null, CancellationToken ct = default)
    {
        var hero = await db.Heroes.OrderBy(h => h.CreatedAt).FirstOrDefaultAsync(ct);
        return hero?.ToDto(baseUrl);
    }

    public async Task<HeroDto> UpsertHeroAsync(HeroUpsertDto dto, CancellationToken ct = default)
    {
        await heroValidator.ValidateAndThrowAsync(dto, ct);
        var hero = await db.Heroes.OrderBy(h => h.CreatedAt).FirstOrDefaultAsync(ct);
        if (hero is null)
        {
            hero = new Hero();
            db.Heroes.Add(hero);
        }

        hero.Greeting = dto.Greeting;
        hero.Name = dto.Name;
        hero.Title = dto.Title;
        hero.Description = dto.Description;
        hero.ProfilePhoto = dto.ProfilePhoto;
        hero.CvFile = dto.CvFile;
        hero.CvFileName = dto.CvFileName;
        hero.PrimaryButtonText = dto.PrimaryButtonText;
        hero.PrimaryButtonUrl = dto.PrimaryButtonUrl;
        hero.SecondaryButtonText = dto.SecondaryButtonText;
        hero.SecondaryButtonUrl = dto.SecondaryButtonUrl;
        hero.AvailabilityText = dto.AvailabilityText;
        hero.IsActive = dto.IsActive;
        hero.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return hero.ToDto();
    }

    public async Task<AboutDto?> GetAboutAsync(string? baseUrl = null, CancellationToken ct = default)
    {
        var about = await db.Abouts.OrderBy(a => a.CreatedAt).FirstOrDefaultAsync(ct);
        return about?.ToDto(baseUrl);
    }

    public async Task<AboutDto> UpsertAboutAsync(AboutUpsertDto dto, CancellationToken ct = default)
    {
        await aboutValidator.ValidateAndThrowAsync(dto, ct);
        var about = await db.Abouts.OrderBy(a => a.CreatedAt).FirstOrDefaultAsync(ct);
        if (about is null)
        {
            about = new About();
            db.Abouts.Add(about);
        }

        about.Heading = dto.Heading;
        about.Description = dto.Description;
        about.ProfileImage = dto.ProfileImage;
        about.ExperienceYears = dto.ExperienceYears;
        about.ProjectsCompleted = dto.ProjectsCompleted;
        about.TechnologiesCount = dto.TechnologiesCount;
        about.CommitsCount = dto.CommitsCount;
        about.Education = dto.Education;
        about.AdditionalInformation = dto.AdditionalInformation;
        about.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return about.ToDto();
    }

    public async Task<SiteSettingDto?> GetSettingsAsync(CancellationToken ct = default)
    {
        var settings = await db.SiteSettings.OrderBy(s => s.CreatedAt).FirstOrDefaultAsync(ct);
        return settings?.ToDto();
    }

    public async Task<SiteSettingDto> UpsertSettingsAsync(SiteSettingUpsertDto dto, CancellationToken ct = default)
    {
        await settingsValidator.ValidateAndThrowAsync(dto, ct);
        var settings = await db.SiteSettings.OrderBy(s => s.CreatedAt).FirstOrDefaultAsync(ct);
        if (settings is null)
        {
            settings = new SiteSetting();
            db.SiteSettings.Add(settings);
        }

        settings.SiteName = dto.SiteName;
        settings.SiteTitle = dto.SiteTitle;
        settings.MetaTitle = dto.MetaTitle;
        settings.MetaDescription = dto.MetaDescription;
        settings.Favicon = dto.Favicon;
        settings.OgImage = dto.OgImage;
        settings.Logo = dto.Logo;
        settings.CopyrightText = dto.CopyrightText;
        settings.GoogleAnalyticsId = dto.GoogleAnalyticsId;
        settings.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return settings.ToDto();
    }

    public async Task<List<SkillDto>> GetActiveSkillsAsync(CancellationToken ct = default) =>
        await db.Skills
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder).ThenBy(s => s.Name)
            .Select(s => s.ToDto())
            .ToListAsync(ct);

    public async Task<List<ServiceDto>> GetActiveServicesAsync(CancellationToken ct = default) =>
        await db.Services
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder).ThenBy(s => s.Title)
            .Select(s => s.ToDto())
            .ToListAsync(ct);

    public async Task<List<ProjectDto>> GetPublishedProjectsAsync(string? baseUrl = null, CancellationToken ct = default)
    {
        var projects = await db.Projects
            .Include(p => p.Images)
            .Where(p => p.IsPublished)
            .OrderBy(p => p.DisplayOrder).ThenByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
        return projects.Select(p => p.ToDto(baseUrl)).ToList();
    }

    public async Task<ProjectDto?> GetPublishedProjectBySlugAsync(string slug, string? baseUrl = null, CancellationToken ct = default)
    {
        var project = await db.Projects
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished, ct);
        return project?.ToDto(baseUrl);
    }

    public async Task<List<ExperienceDto>> GetExperiencesAsync(CancellationToken ct = default) =>
        await db.Experiences
            .OrderBy(e => e.DisplayOrder).ThenBy(e => e.CreatedAt)
            .Select(e => e.ToDto())
            .ToListAsync(ct);

    public async Task<List<EducationDto>> GetEducationsAsync(CancellationToken ct = default) =>
        await db.Educations
            .OrderBy(e => e.DisplayOrder).ThenBy(e => e.CreatedAt)
            .Select(e => e.ToDto())
            .ToListAsync(ct);

    public async Task<List<SocialLinkDto>> GetActiveSocialLinksAsync(CancellationToken ct = default) =>
        await db.SocialLinks
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => s.ToDto())
            .ToListAsync(ct);
}
