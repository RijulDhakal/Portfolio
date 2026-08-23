using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Portfolio.Infrastructure.Persistence;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PortfolioDbContext>
{
    public PortfolioDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .AddJsonFile(FindApiAppSettings(), optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connection = configuration["DATABASE_CONNECTION_STRING"]
            ?? configuration.GetConnectionString("Default")
            ?? "Host=localhost;Port=5432;Database=portfolio;Username=portfolio;Password=portfolio";

        var options = new DbContextOptionsBuilder<PortfolioDbContext>()
            .UseNpgsql(connection)
            .Options;

        return new PortfolioDbContext(options);
    }

    private static string FindApiAppSettings()
    {
        var current = new DirectoryInfo(Directory.GetCurrentDirectory());
        for (var dir = current; dir is not null; dir = dir.Parent)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Portfolio.Api", "appsettings.json");
            if (File.Exists(candidate)) return candidate;

            var candidate2 = Path.Combine(dir.FullName, "Portfolio.Api", "appsettings.json");
            if (File.Exists(candidate2)) return candidate2;
        }
        return Path.Combine(current!.FullName, "appsettings.json");
    }
}
