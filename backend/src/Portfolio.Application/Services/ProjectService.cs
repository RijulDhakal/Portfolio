using System.Text.RegularExpressions;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Services;

public sealed partial class ProjectService(IPortfolioDbContext db, IValidator<ProjectUpsertDto> validator)
{
    [GeneratedRegex("[^a-z0-9]+", RegexOptions.Compiled)]
    private static partial Regex SlugSanitizer();

    public static string NormalizeSlug(string slug)
    {
        var normalized = slug.Trim().ToLowerInvariant();
        normalized = SlugSanitizer().Replace(normalized, "-").Trim('-');
        return normalized.Length > 100 ? normalized[..100] : normalized;
    }

    public async Task<PagedResult<ProjectDto>> GetAllAsync(
        string? search, bool? publishedOnly, bool? featuredOnly, int page, int pageSize,
        string? baseUrl = null, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        IQueryable<Project> query = db.Projects.AsNoTracking().Include(p => p.Images);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Title.Contains(search) || p.Slug.Contains(search) || p.Category!.Contains(search));
        if (publishedOnly == true)
            query = query.Where(p => p.IsPublished);
        if (featuredOnly == true)
            query = query.Where(p => p.IsFeatured);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(p => p.DisplayOrder).ThenByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<ProjectDto>(items.Select(p => p.ToDto(baseUrl)).ToList(), total, page, pageSize);
    }

    public async Task<ProjectDto?> GetAsync(Guid id, string? baseUrl = null, CancellationToken ct = default)
    {
        var project = await db.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id, ct);
        return project?.ToDto(baseUrl);
    }

    public async Task<ProjectDto?> GetBySlugAsync(string slug, string? baseUrl = null, CancellationToken ct = default)
    {
        var project = await db.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Slug == slug, ct);
        return project?.ToDto(baseUrl);
    }

    public async Task<ProjectDto> CreateAsync(ProjectUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var slug = NormalizeSlug(dto.Slug);
        if (string.IsNullOrEmpty(slug))
            throw new Portfolio.Application.Common.ValidationException("Slug is required and must contain at least one letter or number.");

        if (await db.Projects.AnyAsync(p => p.Slug == slug, ct))
            throw new ConflictException($"A project with the slug '{slug}' already exists.");

        var project = new Project
        {
            Title = dto.Title.Trim(),
            Slug = slug,
            ShortDescription = dto.ShortDescription,
            FullDescription = dto.FullDescription,
            Category = dto.Category,
            Technologies = dto.Technologies ?? [],
            Thumbnail = dto.Thumbnail,
            FeaturedImage = dto.FeaturedImage,
            LiveUrl = dto.LiveUrl,
            GithubUrl = dto.GithubUrl,
            FigmaUrl = dto.FigmaUrl,
            CaseStudyUrl = dto.CaseStudyUrl,
            Year = dto.Year?.Trim(),
            Role = dto.Role?.Trim(),
            Client = dto.Client?.Trim(),
            Problem = dto.Problem,
            Goal = dto.Goal,
            Contribution = dto.Contribution,
            Process = dto.Process,
            Features = dto.Features ?? [],
            Challenges = dto.Challenges,
            Solution = dto.Solution,
            Results = dto.Results,
            DisplayOrder = dto.DisplayOrder,
            IsFeatured = dto.IsFeatured,
            IsPublished = dto.IsPublished
        };

        project.Images = (dto.Images ?? [])
            .OrderBy(i => i.DisplayOrder)
            .Select(i => new ProjectImage
            {
                ImageUrl = i.ImageUrl,
                AltText = i.AltText,
                DisplayOrder = i.DisplayOrder
            })
            .ToList();

        db.Projects.Add(project);
        await db.SaveChangesAsync(ct);
        return project.ToDto();
    }

    public async Task<ProjectDto?> UpdateAsync(Guid id, ProjectUpsertDto dto, CancellationToken ct = default)
    {
        await validator.ValidateAndThrowAsync(dto, ct);
        var project = await db.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id, ct);
        if (project is null) return null;

        var slug = NormalizeSlug(dto.Slug);
        if (string.IsNullOrEmpty(slug))
            throw new Portfolio.Application.Common.ValidationException("Slug is required and must contain at least one letter or number.");

        if (await db.Projects.AnyAsync(p => p.Slug == slug && p.Id != id, ct))
            throw new ConflictException($"A project with the slug '{slug}' already exists.");

        project.Title = dto.Title.Trim();
        project.Slug = slug;
        project.ShortDescription = dto.ShortDescription;
        project.FullDescription = dto.FullDescription;
        project.Category = dto.Category;
        project.Technologies = dto.Technologies ?? [];
        project.Thumbnail = dto.Thumbnail;
        project.FeaturedImage = dto.FeaturedImage;
        project.LiveUrl = dto.LiveUrl;
        project.GithubUrl = dto.GithubUrl;
        project.FigmaUrl = dto.FigmaUrl;
        project.CaseStudyUrl = dto.CaseStudyUrl;
        project.Year = dto.Year?.Trim();
        project.Role = dto.Role?.Trim();
        project.Client = dto.Client?.Trim();
        project.Problem = dto.Problem;
        project.Goal = dto.Goal;
        project.Contribution = dto.Contribution;
        project.Process = dto.Process;
        project.Features = dto.Features ?? [];
        project.Challenges = dto.Challenges;
        project.Solution = dto.Solution;
        project.Results = dto.Results;
        project.DisplayOrder = dto.DisplayOrder;
        project.IsFeatured = dto.IsFeatured;
        project.IsPublished = dto.IsPublished;
        project.UpdatedAt = DateTime.UtcNow;

        SyncImages(project, dto.Images ?? []);
        await db.SaveChangesAsync(ct);
        return project.ToDto();
    }

    public async Task<bool> SetPublishedAsync(Guid id, bool isPublished, CancellationToken ct = default)
    {
        var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id, ct);
        if (project is null) return false;

        project.IsPublished = isPublished;
        project.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> SetFeaturedAsync(Guid id, bool isFeatured, CancellationToken ct = default)
    {
        var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id, ct);
        if (project is null) return false;

        project.IsFeatured = isFeatured;
        project.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> ReorderAsync(IReadOnlyList<Guid> orderedIds, CancellationToken ct = default)
    {
        var projects = await db.Projects.Where(p => orderedIds.Contains(p.Id)).ToListAsync(ct);
        if (projects.Count != orderedIds.Count) return false;

        for (var i = 0; i < orderedIds.Count; i++)
        {
            var project = projects.First(p => p.Id == orderedIds[i]);
            project.DisplayOrder = i;
        }
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id, ct);
        if (project is null) return false;

        db.Projects.Remove(project);
        await db.SaveChangesAsync(ct);
        return true;
    }

    private static void SyncImages(Project project, IReadOnlyCollection<ProjectImageUpsertDto> incoming)
    {
        var existingById = project.Images.ToDictionary(i => i.Id);
        var seenIds = new HashSet<Guid>();

        var order = 0;
        foreach (var item in incoming.OrderBy(i => i.DisplayOrder))
        {
            if (item.Id is { } id && existingById.TryGetValue(id, out var existing))
            {
                existing.ImageUrl = item.ImageUrl;
                existing.AltText = item.AltText;
                existing.DisplayOrder = order;
                seenIds.Add(existing.Id);
            }
            else
            {
                project.Images.Add(new ProjectImage
                {
                    ImageUrl = item.ImageUrl,
                    AltText = item.AltText,
                    DisplayOrder = order
                });
            }
            order++;
        }

        var toRemove = project.Images.Where(i => !seenIds.Contains(i.Id)).ToList();
        foreach (var image in toRemove)
            project.Images.Remove(image);
    }
}
