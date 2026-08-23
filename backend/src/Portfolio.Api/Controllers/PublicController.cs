using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Contact;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/v1")]
[AllowAnonymous]
public sealed class PublicController(
    ContentService contentService,
    ContactService contactService,
    TypographyService typographyService,
    SiteCopyService siteCopyService) : ControllerBase
{
    [HttpGet("hero")]
    public async Task<ActionResult<ApiResponse<HeroDto>>> Hero(CancellationToken ct)
    {
        var hero = await contentService.GetHeroAsync(ControllerHelpers.GetBaseUrl(Request), ct);
        return Ok(ApiResponse.Ok(hero));
    }

    [HttpGet("about")]
    public async Task<ActionResult<ApiResponse<AboutDto>>> About(CancellationToken ct)
    {
        var about = await contentService.GetAboutAsync(ControllerHelpers.GetBaseUrl(Request), ct);
        return Ok(ApiResponse.Ok(about));
    }

    [HttpGet("skills")]
    public async Task<ActionResult<ApiResponse<List<SkillDto>>>> Skills(CancellationToken ct)
    {
        var skills = await contentService.GetActiveSkillsAsync(ct);
        return Ok(ApiResponse.Ok(skills));
    }

    [HttpGet("services")]
    public async Task<ActionResult<ApiResponse<List<ServiceDto>>>> Services(CancellationToken ct)
    {
        var services = await contentService.GetActiveServicesAsync(ct);
        return Ok(ApiResponse.Ok(services));
    }

    [HttpGet("projects")]
    public async Task<ActionResult<ApiResponse<List<ProjectDto>>>> Projects(CancellationToken ct)
    {
        var projects = await contentService.GetPublishedProjectsAsync(ControllerHelpers.GetBaseUrl(Request), ct);
        return Ok(ApiResponse.Ok(projects));
    }

    [HttpGet("projects/{slug}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> ProjectBySlug(string slug, CancellationToken ct)
    {
        var project = await contentService.GetPublishedProjectBySlugAsync(slug, ControllerHelpers.GetBaseUrl(Request), ct);
        if (project is null)
            return NotFound(ApiResponse.Fail($"Project '{slug}' was not found."));
        return Ok(ApiResponse.Ok(project));
    }

    [HttpGet("experiences")]
    public async Task<ActionResult<ApiResponse<List<ExperienceDto>>>> Experiences(CancellationToken ct)
    {
        var experiences = await contentService.GetExperiencesAsync(ct);
        return Ok(ApiResponse.Ok(experiences));
    }

    [HttpGet("educations")]
    public async Task<ActionResult<ApiResponse<List<EducationDto>>>> Educations(CancellationToken ct)
    {
        var educations = await contentService.GetEducationsAsync(ct);
        return Ok(ApiResponse.Ok(educations));
    }

    [HttpGet("social-links")]
    public async Task<ActionResult<ApiResponse<List<SocialLinkDto>>>> SocialLinks(CancellationToken ct)
    {
        var links = await contentService.GetActiveSocialLinksAsync(ct);
        return Ok(ApiResponse.Ok(links));
    }

    [HttpGet("settings")]
    public async Task<ActionResult<ApiResponse<SiteSettingDto>>> Settings(CancellationToken ct)
    {
        var settings = await contentService.GetSettingsAsync(ct);
        return Ok(ApiResponse.Ok(settings));
    }

    [HttpGet("site-copy")]
    public async Task<ActionResult<ApiResponse<SiteCopyDto>>> SiteCopy(CancellationToken ct)
    {
        var copy = await siteCopyService.GetAsync(ct);
        return Ok(ApiResponse.Ok(copy));
    }

    [HttpGet("typography")]
    public async Task<ActionResult<ApiResponse<TypographySettingDto>>> Typography(CancellationToken ct)
    {
        var settings = await typographyService.GetAsync(ct);
        return Ok(ApiResponse.Ok(settings));
    }

    [HttpPost("contact")]
    [EnableRateLimiting("contact")]
    public async Task<ActionResult<ApiResponse<ContactMessageDto>>> Contact([FromBody] ContactMessageRequest request, CancellationToken ct)
    {
        var message = await contactService.SubmitAsync(request, ct);
        return Ok(ApiResponse.Ok(message, "Message sent successfully."));
    }
}
