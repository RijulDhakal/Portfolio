using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence;

public sealed class PortfolioDbContext(DbContextOptions<PortfolioDbContext> options)
    : DbContext(options), IPortfolioDbContext
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    // Typography JSONB stores only explicitly configured members: an unconfigured
    // element/global serializes as {} rather than a payload of nulls.
    private static readonly JsonSerializerOptions TypographyJsonOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private static readonly ValueConverter<List<string>, string> StringListConverter =
        new(v => JsonSerializer.Serialize(v, JsonOptions),
            v => string.IsNullOrWhiteSpace(v)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(v, JsonOptions) ?? new List<string>());

    private static readonly ValueConverter<TypographyGlobalSettings, string> TypographyGlobalConverter =
        new(v => JsonSerializer.Serialize(v, TypographyJsonOptions),
            v => JsonSerializer.Deserialize<TypographyGlobalSettings>(v, TypographyJsonOptions) ?? new TypographyGlobalSettings());

    private static readonly ValueConverter<Dictionary<string, TypographyElementOverride>, string> TypographyOverridesConverter =
        new(v => JsonSerializer.Serialize(v, TypographyJsonOptions),
            v => JsonSerializer.Deserialize<Dictionary<string, TypographyElementOverride>>(v, TypographyJsonOptions) ?? new Dictionary<string, TypographyElementOverride>());

    private static readonly JsonSerializerOptions SiteCopyJsonOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private static ValueConverter<T, string> SiteCopyConverter<T>() where T : new() =>
        new(v => JsonSerializer.Serialize(v, SiteCopyJsonOptions),
            v => JsonSerializer.Deserialize<T>(v, SiteCopyJsonOptions) ?? new T());

    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Hero> Heroes => Set<Hero>();
    public DbSet<About> Abouts => Set<About>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectImage> ProjectImages => Set<ProjectImage>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<MediaItem> MediaItems => Set<MediaItem>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<Education> Educations => Set<Education>();
    public DbSet<TypographySetting> TypographySettings => Set<TypographySetting>();
    public DbSet<SiteCopy> SiteCopies => Set<SiteCopy>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    property.SetColumnType("timestamptz");
            }
        }

        modelBuilder.Entity<AdminUser>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.Property(u => u.PasswordHash).HasMaxLength(200).IsRequired();
            e.Property(u => u.Role).HasMaxLength(50).IsRequired();
            e.HasMany(u => u.RefreshTokens)
                .WithOne(t => t.AdminUser)
                .HasForeignKey(t => t.AdminUserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RefreshToken>(e =>
        {
            e.HasIndex(t => t.TokenHash).IsUnique();
            e.HasIndex(t => t.AdminUserId);
            e.Property(t => t.TokenHash).HasMaxLength(64).IsRequired();
            e.Property(t => t.JwtId).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<Hero>(e =>
        {
            e.Property(h => h.Name).HasMaxLength(120).IsRequired();
            e.Property(h => h.Title).HasMaxLength(200).IsRequired();
            e.Property(h => h.ProfilePhoto).HasMaxLength(1000);
            e.Property(h => h.CvFile).HasMaxLength(1000);
        });

        modelBuilder.Entity<About>(e =>
        {
            e.Property(a => a.Heading).HasMaxLength(300).IsRequired();
            e.Property(a => a.Description).HasMaxLength(5000).IsRequired();
        });

        modelBuilder.Entity<Skill>(e =>
        {
            e.Property(s => s.Name).HasMaxLength(100).IsRequired();
            e.Property(s => s.Category).HasMaxLength(50).IsRequired();
            e.Property(s => s.PositionX).HasMaxLength(10);
            e.Property(s => s.PositionY).HasMaxLength(10);
            e.HasIndex(s => new { s.Category, s.DisplayOrder });
            e.HasIndex(s => s.IsActive);
        });

        modelBuilder.Entity<Service>(e =>
        {
            e.Property(s => s.Title).HasMaxLength(200).IsRequired();
            e.Property(s => s.Features)
                .HasColumnType("jsonb")
                .HasConversion(StringListConverter);
            e.HasIndex(s => new { s.IsActive, s.DisplayOrder });
        });

        modelBuilder.Entity<Project>(e =>
        {
            e.Property(p => p.Title).HasMaxLength(200).IsRequired();
            e.Property(p => p.Slug).HasMaxLength(100).IsRequired();
            e.Property(p => p.Technologies)
                .HasColumnType("jsonb")
                .HasConversion(StringListConverter);
            e.Property(p => p.Features)
                .HasColumnType("jsonb")
                .HasConversion(StringListConverter);
            e.Property(p => p.Thumbnail).HasMaxLength(1000);
            e.Property(p => p.FeaturedImage).HasMaxLength(1000);
            e.Property(p => p.Year).HasMaxLength(50);
            e.Property(p => p.Role).HasMaxLength(200);
            e.Property(p => p.Client).HasMaxLength(200);
            e.HasIndex(p => p.Slug).IsUnique();
            e.HasIndex(p => p.IsPublished);
            e.HasIndex(p => p.IsFeatured);
            e.HasIndex(p => p.DisplayOrder);
            e.HasIndex(p => p.CreatedAt);
            e.HasMany(p => p.Images)
                .WithOne(i => i.Project)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProjectImage>(e =>
        {
            e.Property(i => i.ImageUrl).HasMaxLength(1000).IsRequired();
            e.HasIndex(i => i.ProjectId);
        });

        modelBuilder.Entity<ContactMessage>(e =>
        {
            e.Property(m => m.Name).HasMaxLength(200).IsRequired();
            e.Property(m => m.Email).HasMaxLength(256).IsRequired();
            e.Property(m => m.Message).HasMaxLength(5000).IsRequired();
            e.HasIndex(m => m.CreatedAt);
            e.HasIndex(m => m.IsRead);
        });

        modelBuilder.Entity<MediaItem>(e =>
        {
            e.Property(m => m.FileName).HasMaxLength(200).IsRequired();
            e.Property(m => m.OriginalFileName).HasMaxLength(300).IsRequired();
            e.Property(m => m.MimeType).HasMaxLength(100).IsRequired();
            e.Property(m => m.Url).HasMaxLength(1000).IsRequired();
            e.Property(m => m.Folder).HasMaxLength(100).IsRequired();
            e.HasIndex(m => new { m.UploadedAt, m.FileType });
        });

        modelBuilder.Entity<SiteSetting>(e =>
        {
            e.Property(s => s.SiteName).HasMaxLength(200).IsRequired();
            e.Property(s => s.SiteTitle).HasMaxLength(300).IsRequired();
        });

        modelBuilder.Entity<SocialLink>(e =>
        {
            e.Property(s => s.Platform).HasMaxLength(50).IsRequired();
            e.Property(s => s.Url).HasMaxLength(1000).IsRequired();
            e.HasIndex(s => new { s.IsActive, s.DisplayOrder });
        });

        modelBuilder.Entity<Experience>(e =>
        {
            e.Property(x => x.Role).HasMaxLength(200).IsRequired();
            e.Property(x => x.Year).HasMaxLength(50).IsRequired();
            e.HasIndex(x => x.DisplayOrder);
        });

        modelBuilder.Entity<Education>(e =>
        {
            e.Property(x => x.Institution).HasMaxLength(200).IsRequired();
            e.Property(x => x.Degree).HasMaxLength(100).IsRequired();
            e.HasIndex(x => x.DisplayOrder);
        });

        modelBuilder.Entity<TypographySetting>(e =>
        {
            e.Property(t => t.Global)
                .HasColumnType("jsonb")
                .HasConversion(TypographyGlobalConverter);
            e.Property(t => t.Overrides)
                .HasColumnType("jsonb")
                .HasConversion(TypographyOverridesConverter);
        });

        modelBuilder.Entity<SiteCopy>(e =>
        {
            e.Property(s => s.Navigation).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyNavigation>());
            e.Property(s => s.Intro).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyIntro>());
            e.Property(s => s.About).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyAbout>());
            e.Property(s => s.Skills).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopySkills>());
            e.Property(s => s.Services).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyServices>());
            e.Property(s => s.Work).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyWork>());
            e.Property(s => s.Experience).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyExperience>());
            e.Property(s => s.Education).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyEducation>());
            e.Property(s => s.Personal).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyPersonal>());
            e.Property(s => s.Contact).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyContact>());
            e.Property(s => s.Footer).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyFooter>());
            e.Property(s => s.GlobalUi).HasColumnType("jsonb").HasConversion(SiteCopyConverter<SiteCopyGlobalUi>());
        });
    }
}
