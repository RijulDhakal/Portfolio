using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Portfolio.Api.Middleware;
using Portfolio.Application;
using Portfolio.Application.Common;
using Portfolio.Infrastructure;
using Portfolio.Infrastructure.Data;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, services, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpContextAccessor();

var jwt = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrWhiteSpace(jwt.Secret))
{
    // Legacy fallback: JWT_SECRET (single underscore) does not auto-map to
    // Jwt:Secret in .NET config; JWT__SECRET (double underscore) does.
    var envSecret = builder.Configuration["JWT_SECRET"];
    if (!string.IsNullOrWhiteSpace(envSecret))
    {
        jwt.Secret = envSecret;
        builder.Configuration["Jwt:Secret"] = envSecret;
    }
}
if (string.IsNullOrWhiteSpace(jwt.Secret))
    throw new InvalidOperationException(
        "Jwt:Secret is not configured. Configure it using .NET User Secrets for development or an environment variable in production.");
if (jwt.Secret.Length < 32)
    throw new InvalidOperationException(
        "Jwt:Secret must be at least 32 characters (256 bits) for HMAC-SHA256. Generate one with: openssl rand -base64 64");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Secret)),
            RoleClaimType = "role",
            NameClaimType = "sub",
            ClockSkew = TimeSpan.FromSeconds(30),
            // Pin the accepted signing algorithms so tokens declaring other
            // "alg" values are rejected outright.
            ValidAlgorithms = [SecurityAlgorithms.HmacSha256]
        };
    });

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.Configure<MediaOptions>(builder.Configuration.GetSection(MediaOptions.SectionName));
builder.Services.Configure<StorageOptions>(builder.Configuration.GetSection(StorageOptions.SectionName));

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // X-Forwarded-* headers are only honored for explicitly trusted proxies.
    // Behind a reverse proxy set FORWARDED_HEADERS_KNOWN_PROXIES (comma-separated
    // IPs) and optionally FORWARDED_HEADERS_KNOWN_NETWORKS (CIDRs); otherwise all
    // clients would appear to share the proxy IP, collapsing per-IP rate limits
    // into one global bucket.
    var knownProxies = builder.Configuration["FORWARDED_HEADERS_KNOWN_PROXIES"];
    var knownNetworks = builder.Configuration["FORWARDED_HEADERS_KNOWN_NETWORKS"];
    if (!string.IsNullOrWhiteSpace(knownProxies))
    {
        foreach (var ip in knownProxies.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            if (System.Net.IPAddress.TryParse(ip, out var parsed))
                options.KnownProxies.Add(parsed);
    }
    else
    {
        options.KnownProxies.Clear();
    }

    if (!string.IsNullOrWhiteSpace(knownNetworks))
    {
        foreach (var cidr in knownNetworks.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            var parts = cidr.Split('/');
            if (parts.Length != 2 || !System.Net.IPAddress.TryParse(parts[0], out var network)
                || !int.TryParse(parts[1], out var prefix))
                throw new InvalidOperationException($"Invalid CIDR in FORWARDED_HEADERS_KNOWN_NETWORKS: '{cidr}'");
            options.KnownNetworks.Add(new Microsoft.AspNetCore.HttpOverrides.IPNetwork(network, prefix));
        }
    }
    else
    {
        options.KnownNetworks.Clear();
    }
});

var cors = builder.Configuration.GetSection(CorsOptions.SectionName).Get<CorsOptions>() ?? new CorsOptions();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        if (cors.AllowedOrigins.Length == 0)
        {
            if (!builder.Environment.IsDevelopment())
                throw new InvalidOperationException(
                    "Cors:AllowedOrigins is not configured. Set the CORS_ALLOWED_ORIGINS environment variable.");
            policy.AllowAnyOrigin();
        }
        else
        {
            policy.WithOrigins(cors.AllowedOrigins);
        }
        policy.AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, ct) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(
            ApiResponse.Fail("Too many requests. Please try again later."), ct);
    };

    options.AddPolicy("login", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(5),
                QueueLimit = 0
            }));

    options.AddPolicy("contact", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);

var app = builder.Build();

app.UseForwardedHeaders();
app.UseSerilogRequestLogging();

// Baseline security headers for every API response, including /uploads files.
app.Use(async (context, next) =>
{
    if (!context.Response.HasStarted)
    {
        var headers = context.Response.Headers;
        headers["X-Content-Type-Options"] = "nosniff";
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        headers["X-Frame-Options"] = "DENY";
        if (!app.Environment.IsDevelopment())
            headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    }
    await next(context);
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads",
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.CacheControl = "public, max-age=604800";
        // Sandboxed browsing context: uploaded SVGs/PDFs opened directly cannot
        // run scripts against the API origin; <img> embedding is unaffected.
        ctx.Context.Response.Headers.ContentSecurityPolicy = "sandbox";
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseMiddleware<GlobalExceptionHandler>();
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    await PortfolioDbSeeder.SeedAsync(scope.ServiceProvider, builder.Configuration);
}

app.Run();

public partial class Program;
