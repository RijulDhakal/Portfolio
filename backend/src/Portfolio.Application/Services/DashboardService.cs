using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Media;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;

namespace Portfolio.Application.Services;

public sealed class DashboardService(IPortfolioDbContext db)
{
    public async Task<DashboardStatsDto> GetStatsAsync(string? baseUrl = null, CancellationToken ct = default)
    {
        var projectsCount = await db.Projects.CountAsync(ct);
        var publishedProjects = await db.Projects.CountAsync(p => p.IsPublished, ct);
        var skillsCount = await db.Skills.CountAsync(ct);
        var servicesCount = await db.Services.CountAsync(ct);
        var unreadMessages = await db.ContactMessages.CountAsync(m => !m.IsRead, ct);
        var mediaCount = await db.MediaItems.CountAsync(ct);

        var recentProjects = await db.Projects
            .Include(p => p.Images)
            .OrderByDescending(p => p.UpdatedAt)
            .Take(5)
            .ToListAsync(ct);

        var recentMessages = await db.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .Take(5)
            .ToListAsync(ct);

        return new DashboardStatsDto(
            projectsCount, publishedProjects, skillsCount, servicesCount, unreadMessages, mediaCount,
            recentProjects.Select(p => p.ToDto(baseUrl)).ToList(),
            recentMessages.Select(m => m.ToDto()).ToList());
    }
}
