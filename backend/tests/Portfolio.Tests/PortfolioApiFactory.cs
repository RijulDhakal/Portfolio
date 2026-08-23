using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;

namespace Portfolio.Tests;

public sealed class PortfolioApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")
        .WithDatabase("portfolio_test")
        .WithUsername("portfolio")
        .WithPassword("portfolio")
        .Build();

    public const string JwtSecret =
        "integration-test-secret-key-0123456789abcdef-0123456789abcdef";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("JWT_SECRET", JwtSecret);
        builder.UseSetting("DATABASE_CONNECTION_STRING", _postgres.GetConnectionString());
        builder.UseSetting("Storage:LocalPath", "uploads-test");
    }

    public async Task InitializeAsync() => await _postgres.StartAsync();

    public new async Task DisposeAsync()
    {
        try
        {
            var uploadsTest = Path.Combine(
                Services.GetRequiredService<Microsoft.Extensions.Hosting.IHostEnvironment>().ContentRootPath,
                "uploads-test");
            if (Directory.Exists(uploadsTest))
                Directory.Delete(uploadsTest, recursive: true);
        }
        catch
        {
        }

        await base.DisposeAsync();
        await _postgres.DisposeAsync();
    }
}

[CollectionDefinition("api")]
public sealed class ApiCollection : ICollectionFixture<PortfolioApiFactory>;
