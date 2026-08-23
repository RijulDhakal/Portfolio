using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.Infrastructure.Data;

public static class PortfolioDbSeeder
{
    private const string LegacyDefaultPassword = "Admin@123!";
    private const int MinAdminPasswordLength = 12;

    public static async Task SeedAsync(
        IServiceProvider services,
        IConfiguration configuration,
        CancellationToken ct = default)
    {
        var db = services.GetRequiredService<PortfolioDbContext>();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("PortfolioDbSeeder");
        var isProduction = services.GetRequiredService<IHostEnvironment>().IsProduction();

        await db.Database.MigrateAsync(ct);

        var adminEmail = (configuration["ADMIN_EMAIL"] ?? "admin@rijuldhakal.com").Trim().ToLowerInvariant();
        var adminPassword = configuration["ADMIN_PASSWORD"];

        if (isProduction && string.IsNullOrWhiteSpace(adminPassword))
            throw new InvalidOperationException(
                "ADMIN_PASSWORD is required in production. Set it to a strong value (>= 12 characters) before deploying.");
        if (isProduction && !IsStrongAdminPassword(adminPassword!))
            throw new InvalidOperationException(
                $"ADMIN_PASSWORD must be at least {MinAdminPasswordLength} characters and must not be a known default value.");

        adminPassword ??= LegacyDefaultPassword;
        if (!isProduction && adminPassword == LegacyDefaultPassword)
            logger.LogWarning(
                "Seeding admin {Email} with the LEGACY DEFAULT password. NEVER use this outside local development.",
                adminEmail);

        await SeedAdminAsync(db, logger, adminEmail, adminPassword, ct);
        await RotateLegacyAdminPasswordAsync(db, logger, adminEmail, adminPassword, ct);
        await SeedHeroAsync(db, ct);
        await SeedAboutAsync(db, ct);
        await SeedSkillsAsync(db, ct);
        await SeedServicesAsync(db, ct);
        await SeedProjectsAsync(db, ct);
        await SeedExperiencesAsync(db, ct);
        await SeedEducationAsync(db, ct);
        await SeedSiteSettingsAsync(db, ct);
        await SeedSocialLinksAsync(db, ct);
        await SeedTypographyAsync(db, ct);
        await SeedSiteCopyAsync(db, ct);
        await NormalizeLegacyLinksAsync(db, logger, ct);

        await db.SaveChangesAsync(ct);
        logger.LogInformation("Portfolio database seeded successfully.");
    }

    // Navbar links point at home-page sections; dedicated routes (/services
    // /work /about /contact) stay reachable via direct URL and project cards.
    // Rewrite only the exact seeded values so existing databases pick this up;
    // custom editor values are never touched.
    private static readonly Dictionary<string, string> LegacyNavHrefMap = new()
    {
        ["/services"] = "#services",
        ["/work"] = "#work",
        ["/about"] = "#about",
        ["/contact"] = "#contact",
    };

    private static async Task NormalizeLegacyLinksAsync(PortfolioDbContext db, ILogger logger, CancellationToken ct)
    {
        var heroes = await db.Heroes.Where(h => h.PrimaryButtonUrl == "/work").ToListAsync(ct);
        foreach (var hero in heroes)
            hero.PrimaryButtonUrl = "#work";

        var copies = await db.SiteCopies.ToListAsync(ct);
        foreach (var copy in copies)
        {
            var links = copy.Navigation.Links;
            if (!links.Any(l => LegacyNavHrefMap.ContainsKey(l.Href))) continue;

            // Assign a new instance: JSONB value converters compare snapshots,
            // so in-place mutation of the nested object would not be persisted.
            copy.Navigation = new SiteCopyNavigation
            {
                Brand = copy.Navigation.Brand,
                HireMe = copy.Navigation.HireMe,
                Links = links
                    .Select(l => LegacyNavHrefMap.TryGetValue(l.Href, out var anchor)
                        ? new NavLink { Label = l.Label, Href = anchor }
                        : new NavLink { Label = l.Label, Href = l.Href })
                    .ToList(),
            };
            logger.LogInformation("Normalized navigation routes to home-section anchors.");
        }
    }

    private static bool IsStrongAdminPassword(string password) =>
        password.Length >= MinAdminPasswordLength && password != LegacyDefaultPassword;

    /// <summary>
    /// Security: databases seeded by older builds may still hold an admin whose
    /// password is the hardcoded legacy default. When ADMIN_PASSWORD is provided
    /// explicitly, rotate such accounts instead of leaving known credentials live.
    /// </summary>
    private static async Task RotateLegacyAdminPasswordAsync(
        PortfolioDbContext db, ILogger logger, string adminEmail, string configuredPassword, CancellationToken ct)
    {
        if (configuredPassword == LegacyDefaultPassword) return;

        var admin = await db.AdminUsers.FirstOrDefaultAsync(u => u.Email == adminEmail, ct);
        if (admin is null || !BCrypt.Net.BCrypt.Verify(LegacyDefaultPassword, admin.PasswordHash)) return;

        admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(configuredPassword);
        logger.LogInformation(
            "Rotated legacy default password for admin {Email} because ADMIN_PASSWORD was configured.", adminEmail);
    }

    private static async Task SeedAdminAsync(PortfolioDbContext db, ILogger logger, string email, string password, CancellationToken ct)
    {
        if (await db.AdminUsers.AnyAsync(u => u.Email == email, ct)) return;

        db.AdminUsers.Add(new AdminUser
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = AdminRoles.Admin,
            IsActive = true
        });
        logger.LogInformation("Seeded admin user {Email}. CHANGE THE DEFAULT PASSWORD AFTER FIRST LOGIN.", email);
    }

    private static async Task SeedHeroAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.Heroes.AnyAsync(ct)) return;

        db.Heroes.Add(new Hero
        {
            Greeting = "Hello I'm",
            Name = "Rijul Dhakal",
            Title = "UI/UX Designer & Developer",
            Description =
                "I'm a UI/UX Designer and Developer who enjoys turning ideas into intuitive interfaces and functional digital products. " +
                "My work combines design thinking, frontend development, backend development, and business understanding.",
            ProfilePhoto = "/images/rijul-placeholder.jpg",
            PrimaryButtonText = "VIEW MY WORK",
            PrimaryButtonUrl = "#work",
            SecondaryButtonText = "DOWNLOAD CV",
            AvailabilityText = "Available for freelance work"
        });
    }

    private static async Task SeedAboutAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.Abouts.AnyAsync(ct)) return;

        db.Abouts.Add(new About
        {
            Heading = "Designing with purpose.\nBuilding with code.",
            Description =
                "I'm a UI/UX Designer and Developer who enjoys turning ideas into intuitive interfaces and functional digital products. " +
                "My work combines design thinking, frontend development, backend development, and business understanding.",
            ExperienceYears = 2,
            ProjectsCompleted = 10,
            TechnologiesCount = 15,
            Education = "Nepal Commerce Campus — Bachelor in Information Management"
        });
    }

    private static async Task SeedSkillsAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.Skills.AnyAsync(ct)) return;

        (string Name, string Category, string Desc, string Left, string Top)[] skills =
        [
            ("Figma", "UI / UX", "Interface Design, Collaborative Prototyping", "20.00%", "50.00%"),
            ("Wireframing", "UI / UX", "Layout Planning, User Flow Mapping", "30.50%", "27.00%"),
            ("Entrepreneurship", "BUSINESS", "Business Strategy, Product Validation", "69.50%", "27.00%"),
            ("React", "DEVELOPMENT", "Frontend Development, Component Architecture, Interactive Interfaces", "80.00%", "50.00%"),
            ("Next.js", "DEVELOPMENT", "Server-side Rendering, Static Site Generation, API Routes", "67.00%", "73.00%"),
            ("UX Research", "UI / UX", "User Interviews, Usability Testing", "50.00%", "12.00%"),
            ("Journey Maps", "UI / UX", "Experience Mapping, Pain Point Identification", "33.00%", "14.50%"),
            ("UI/UX Training", "BUSINESS", "Mentorship, Curriculum Design, Workshops", "67.00%", "14.50%"),
            ("Prototyping", "UI / UX", "Interactive Mockups, Micro-interactions", "13.00%", "33.00%"),
            ("Visual Design", "UI / UX", "Typography, Color Theory, Brand Identity", "12.00%", "67.00%"),
            ("Food Distribution", "BUSINESS", "Logistics, Supply Chain, Operations", "87.00%", "33.00%"),
            ("TypeScript", "DEVELOPMENT", "Static Typing, Interface Design, Scalable Codebases", "50.00%", "85.00%"),
            ("Saptarishi Group", "BUSINESS", "Business Management, Strategic Planning", "83.00%", "16.00%"),
            ("PostgreSQL", "DEVELOPMENT", "Relational Databases, Complex Queries, Data Integrity", "91.00%", "50.00%"),
            ("JavaScript", "DEVELOPMENT", "Dynamic Interactions, ES6+, Async Programming", "85.00%", "71.00%"),
            ("FastAPI", "DEVELOPMENT", "Python, High-performance APIs, Async", "70.00%", "91.00%"),
            ("ASP.NET Core", "DEVELOPMENT", "Web APIs, MVC, High-performance Backends", "50.00%", "96.00%"),
            ("Tailwind CSS", "DEVELOPMENT", "Utility-first Styling, Responsive Design", "30.00%", "91.00%"),
            ("Node.js", "DEVELOPMENT", "Server-side JavaScript, REST APIs, Microservices", "15.00%", "83.00%")
        ];

        for (var i = 0; i < skills.Length; i++)
        {
            db.Skills.Add(new Skill
            {
                Name = skills[i].Name,
                Category = skills[i].Category,
                Description = skills[i].Desc,
                PositionX = skills[i].Left,
                PositionY = skills[i].Top,
                DisplayOrder = i,
                IsActive = true
            });
        }
    }

    private static async Task SeedServicesAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.Services.AnyAsync(ct)) return;

        (string Title, string Desc, string[] Features)[] services =
        [
            ("UI/UX DESIGN",
                "Designing intuitive and visually engaging digital experiences that balance user needs with business goals.",
                ["Wireframing", "Prototyping", "UX Research", "Visual Design", "Interaction Design"]),
            ("WEB DEVELOPMENT",
                "Building modern, scalable web applications from interface to backend.",
                ["Frontend Development", "Backend Development", "REST APIs", "Database Integration", "Responsive Applications"]),
            ("DIGITAL PRODUCT DESIGN",
                "Turning product ideas into structured, usable and engaging digital experiences.",
                ["User Flows", "Design Systems", "Responsive Interfaces", "Interaction Design"]),
            ("TRAINING",
                "Helping learners build practical UI/UX and digital skills through focused training.",
                ["UI/UX Crash Courses", "30-Day Courses", "1-Week Intensive", "Workshops", "Training Sessions"])
        ];

        for (var i = 0; i < services.Length; i++)
        {
            db.Services.Add(new Service
            {
                Title = services[i].Title,
                Description = services[i].Desc,
                Features = [.. services[i].Features],
                DisplayOrder = i,
                IsActive = true
            });
        }
    }

    private static async Task SeedProjectsAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.Projects.AnyAsync(ct)) return;

        var now = DateTime.UtcNow;
        var saptarishi = new Project
        {
            Title = "SAPTARISHI PLATFORM",
            Slug = "saptarishi-platform",
            ShortDescription = "Full-stack web platform for the Saptarishi business group.",
            FullDescription =
                "A full-stack web platform built for the Saptarishi Business Group, covering business operations, " +
                "internal tools and public-facing experiences.",
            Category = "Full-Stack Web App",
            Technologies = ["React", ".NET", "PostgreSQL"],
            Thumbnail = "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=2000&auto=format&fit=crop",
            FeaturedImage = "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=2000&auto=format&fit=crop",
            DisplayOrder = 0,
            IsFeatured = true,
            IsPublished = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        var exhibition = new Project
        {
            Title = "DIGITAL EXHIBITION",
            Slug = "digital-exhibition",
            ShortDescription = "Immersive 3D digital exhibition experience.",
            FullDescription =
                "An immersive 3D digital exhibition experience built with Next.js, Three.js and GSAP, " +
                "showcasing products and artworks in an interactive spatial environment.",
            Category = "3D Experience",
            Technologies = ["Next.js", "Three.js", "GSAP"],
            Thumbnail = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
            FeaturedImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
            DisplayOrder = 1,
            IsFeatured = true,
            IsPublished = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        db.Projects.AddRange(saptarishi, exhibition);
    }

    private static async Task SeedExperiencesAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.Experiences.AnyAsync(ct)) return;

        (string Year, string Role, string Desc)[] experiences =
        [
            ("2024 — PRESENT", "Freelance UI/UX Designer & Developer",
                "Designing and building digital products for various clients. Focusing on full-stack development with React, Next.js, and .NET."),
            ("2023 — 2024", "Saptarishi Business Group",
                "Involved in entrepreneurship, strategic planning, and operational management. Developed internal tools and platforms."),
            ("2022 — 2023", "UI/UX Training Instructor",
                "Conducted workshops, 30-day crash courses, and 1-week intensive sessions to help learners build practical digital skills.")
        ];

        for (var i = 0; i < experiences.Length; i++)
        {
            db.Experiences.Add(new Experience
            {
                Year = experiences[i].Year,
                Role = experiences[i].Role,
                Description = experiences[i].Desc,
                DisplayOrder = i
            });
        }
    }

    private static async Task SeedEducationAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.Educations.AnyAsync(ct)) return;

        db.Educations.Add(new Education
        {
            Institution = "Nepal Commerce Campus",
            Degree = "Bachelor",
            Field = "Information Management",
            StartYear = "2018",
            EndYear = "2023",
            Description =
                "Focus on business management principles combined with modern information technology. " +
                "Blended coursework in UI/UX, software engineering, and business strategy.",
            DisplayOrder = 0
        });
    }

    private static async Task SeedSiteSettingsAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.SiteSettings.AnyAsync(ct)) return;

        db.SiteSettings.Add(new SiteSetting
        {
            SiteName = "Rijul Dhakal",
            SiteTitle = "UI/UX Designer & Developer",
            MetaTitle = "Rijul Dhakal — UI/UX Designer & Developer",
            MetaDescription =
                "Portfolio of Rijul Dhakal — UI/UX Designer and Developer crafting intuitive interfaces and functional digital products.",
            CopyrightText = "© 2026 Rijul Dhakal. All rights reserved."
        });
    }

    private static async Task SeedSocialLinksAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.SocialLinks.AnyAsync(ct)) return;

        (string Platform, string Label, string? ShortLabel, string Url)[] links =
        [
            ("GitHub", "GitHub", "GH", "https://github.com/"),
            ("LinkedIn", "LinkedIn", "IN", "https://www.linkedin.com/"),
            ("X", "X (Twitter)", "X", "https://x.com/"),
            ("Dribbble", "Dribbble", "FI", "https://dribbble.com/"),
            ("Email", "Email", null, "mailto:rijuldhakal95@gmail.com")
        ];

        for (var i = 0; i < links.Length; i++)
        {
            db.SocialLinks.Add(new SocialLink
            {
                Platform = links[i].Platform,
                Label = links[i].Label,
                ShortLabel = links[i].ShortLabel,
                Url = links[i].Url,
                DisplayOrder = i,
                IsActive = true
            });
        }
    }

    private static async Task SeedTypographyAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.TypographySettings.AnyAsync(ct)) return;

        db.TypographySettings.Add(new TypographySetting());
    }

    private static async Task SeedSiteCopyAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.SiteCopies.AnyAsync(ct)) return;

        db.SiteCopies.Add(new SiteCopy
        {
            Navigation = new SiteCopyNavigation
            {
                Brand = "Rijul",
                HireMe = "Hire Me",
                Links =
                [
                    new NavLink { Label = "Home", Href = "/" },
                    new NavLink { Label = "Services", Href = "#services" },
                    new NavLink { Label = "Work", Href = "#work" },
                    new NavLink { Label = "About", Href = "#about" },
                    new NavLink { Label = "Contact", Href = "#contact" }
                ]
            },
            Intro = new SiteCopyIntro
            {
                Line1 = "I DESIGN.",
                Line2 = "I BUILD.",
                Line3 = "I EXPERIMENT.",
                Body = "I'm {name}, a UI/UX Designer and Developer focused on creating thoughtful digital experiences and modern web applications."
            },
            About = new SiteCopyAbout
            {
                Number = "01 /",
                Label = "About",
                Stat1Label = "Years Experience",
                Stat2Label = "Projects",
                Stat3Label = "Technologies",
                StatSuffix = "+"
            },
            Skills = new SiteCopySkills
            {
                Number = "02 /",
                Label = "Skills",
                Heading = "Tools I\nWork With.",
                CenterLabel = "RIJUL"
            },
            Services = new SiteCopyServices
            {
                Number = "03 /",
                Label = "Services",
                Heading = "What I\nCan Do."
            },
            Work = new SiteCopyWork
            {
                Number = "04 /",
                Label = "Selected Work",
                Heading = "Things\nI've Built.",
                ViewProjectLabel = "View Project",
                Separator = "|"
            },
            Experience = new SiteCopyExperience
            {
                Number = "05 /",
                Label = "Experience",
                Heading = "The Journey\nSo Far."
            },
            Education = new SiteCopyEducation
            {
                Number = "06 /",
                Label = "Education",
                Heading = "Where I\nLearned.",
                OfConnector = "of",
                Dash = "\u2014"
            },
            Personal = new SiteCopyPersonal
            {
                Label = "Beyond the Screen.",
                Heading = "Design \u2726 Code \u2726 Business",
                MarqueeWords = ["Design", "Code", "Business"],
                MarqueeSeparator = "\u2726",
                Body = "I enjoy working at the intersection of design, technology and business \u2014 creating experiences that aren't only visually engaging, but {highlight}useful and practical{/highlight}."
            },
            Contact = new SiteCopyContact
            {
                Number = "07 /",
                Label = "Contact",
                HeadingLine1 = "LET'S",
                HeadingLine2 = "MAKE",
                HeadingLine3 = "SOMETHING.",
                Body = "Have an idea, project or collaboration in mind? Let's talk.",
                EmailLabel = "Email",
                PhoneLabel = "Phone",
                PhoneNumber = "+977 9746254793",
                FormNameLabel = "Your Name",
                FormEmailLabel = "Your Email",
                FormMessageLabel = "Your Message",
                NamePlaceholder = "John Doe",
                EmailPlaceholder = "john@example.com",
                MessagePlaceholder = "Tell me about your project...",
                SubmitLabel = "SEND MESSAGE",
                SendingLabel = "SENDING...",
                SuccessTitle = "Message Sent",
                SuccessBody = "Thanks for reaching out! I'll get back to you as soon as possible.",
                SendAnotherLabel = "SEND ANOTHER",
                ErrorFallback = "Something went wrong. Please try again."
            },
            Footer = new SiteCopyFooter
            {
                NavigationHeading = "Navigation",
                ContactHeading = "Contact",
                NavLinks =
                [
                    new NavLink { Label = "Home", Href = "#home" },
                    new NavLink { Label = "Intro", Href = "#intro" },
                    new NavLink { Label = "About", Href = "#about" },
                    new NavLink { Label = "Skills", Href = "#skills" },
                    new NavLink { Label = "Services", Href = "#services" },
                    new NavLink { Label = "Work", Href = "#work" },
                    new NavLink { Label = "Experience", Href = "#experience" },
                    new NavLink { Label = "Education", Href = "#education" },
                    new NavLink { Label = "Contact", Href = "#contact" }
                ],
                BuiltWith = "Built with curiosity."
            },
            GlobalUi = new SiteCopyGlobalUi
            {
                CursorDefault = "VIEW",
                CursorHome = "HOME",
                CursorLetsTalk = "LET'S TALK",
                CursorView = "VIEW",
                CursorDownload = "DOWNLOAD",
                CursorDesign = "DESIGN",
                CursorBuild = "BUILD",
                CursorCreate = "CREATE",
                CursorExplore = "EXPLORE",
                CursorOpen = "OPEN",
                CursorBolt = "\u26a1",
                HeroImageAlt = "Rijul Dhakal Portrait"
            }
        });
    }
}