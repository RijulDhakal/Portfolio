using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin")]
[Authorize]
public sealed class AdminContentController(ContentService contentService) : ControllerBase
{
    [HttpGet("hero")]
    public async Task<ActionResult<ApiResponse<HeroDto>>> GetHero(CancellationToken ct)
    {
        var hero = await contentService.GetHeroAsync(ControllerHelpers.GetBaseUrl(Request), ct);
        return Ok(ApiResponse.Ok(hero));
    }

    [HttpPut("hero")]
    public async Task<ActionResult<ApiResponse<HeroDto>>> UpsertHero([FromBody] HeroUpsertDto dto, CancellationToken ct)
    {
        var hero = await contentService.UpsertHeroAsync(dto, ct);
        return Ok(ApiResponse.Ok(hero, "Hero section updated."));
    }

    [HttpGet("about")]
    public async Task<ActionResult<ApiResponse<AboutDto>>> GetAbout(CancellationToken ct)
    {
        var about = await contentService.GetAboutAsync(ControllerHelpers.GetBaseUrl(Request), ct);
        return Ok(ApiResponse.Ok(about));
    }

    [HttpPut("about")]
    public async Task<ActionResult<ApiResponse<AboutDto>>> UpsertAbout([FromBody] AboutUpsertDto dto, CancellationToken ct)
    {
        var about = await contentService.UpsertAboutAsync(dto, ct);
        return Ok(ApiResponse.Ok(about, "About section updated."));
    }

    [HttpGet("settings")]
    public async Task<ActionResult<ApiResponse<SiteSettingDto>>> GetSettings(CancellationToken ct)
    {
        var settings = await contentService.GetSettingsAsync(ct);
        return Ok(ApiResponse.Ok(settings));
    }

    [HttpPut("settings")]
    public async Task<ActionResult<ApiResponse<SiteSettingDto>>> UpsertSettings([FromBody] SiteSettingUpsertDto dto, CancellationToken ct)
    {
        var settings = await contentService.UpsertSettingsAsync(dto, ct);
        return Ok(ApiResponse.Ok(settings, "Site settings updated."));
    }
}
