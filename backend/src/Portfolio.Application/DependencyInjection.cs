using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Services;

namespace Portfolio.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ContentService>();
        services.AddScoped<ContactService>();
        services.AddScoped<MediaService>();
        services.AddScoped<DashboardService>();
        services.AddScoped<SkillService>();
        services.AddScoped<ServiceService>();
        services.AddScoped<ProjectService>();
        services.AddScoped<SocialLinkService>();
        services.AddScoped<ExperienceService>();
        services.AddScoped<EducationService>();
        services.AddScoped<TypographyService>();
        services.AddScoped<SiteCopyService>();

        return services;
    }
}
