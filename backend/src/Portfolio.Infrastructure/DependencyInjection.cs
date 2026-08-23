using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Common;
using Portfolio.Application.Interfaces;
using Portfolio.Infrastructure.Persistence;
using Portfolio.Infrastructure.Storage;

namespace Portfolio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connection = configuration["DATABASE_CONNECTION_STRING"]
            ?? configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException(
                "Database connection string is not configured. Set DATABASE_CONNECTION_STRING or ConnectionStrings:Default.");

        services.AddDbContext<PortfolioDbContext>(options =>
            options.UseNpgsql(connection));

        services.AddScoped<IPortfolioDbContext>(sp => sp.GetRequiredService<PortfolioDbContext>());

        var storage = configuration.GetSection(StorageOptions.SectionName).Get<StorageOptions>() ?? new StorageOptions();

        if (storage.Provider.Equals("s3", StringComparison.OrdinalIgnoreCase))
        {
            services.Configure<StorageCredentials>(configuration.GetSection("Storage:Credentials"));
            services.AddSingleton<IFileStorageService, S3FileStorageService>();
        }
        else
        {
            services.AddSingleton<IFileStorageService, LocalFileStorageService>();
        }

        return services;
    }
}
