using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Interfaces;

public interface IPortfolioDbContext
{
    DbSet<AdminUser> AdminUsers { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<Hero> Heroes { get; }
    DbSet<About> Abouts { get; }
    DbSet<Skill> Skills { get; }
    DbSet<Service> Services { get; }
    DbSet<Project> Projects { get; }
    DbSet<ProjectImage> ProjectImages { get; }
    DbSet<ContactMessage> ContactMessages { get; }
    DbSet<MediaItem> MediaItems { get; }
    DbSet<SiteSetting> SiteSettings { get; }
    DbSet<SocialLink> SocialLinks { get; }
    DbSet<Experience> Experiences { get; }
    DbSet<Education> Educations { get; }
    DbSet<TypographySetting> TypographySettings { get; }
    DbSet<SiteCopy> SiteCopies { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
