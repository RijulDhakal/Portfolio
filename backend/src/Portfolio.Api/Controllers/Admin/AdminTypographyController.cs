using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin")]
[Authorize]
public sealed class AdminTypographyController(TypographyService typographyService) : ControllerBase
{
    [HttpGet("typography")]
    public async Task<ActionResult<ApiResponse<TypographySettingDto>>> GetTypography(CancellationToken ct)
    {
        var settings = await typographyService.GetAsync(ct);
        return Ok(ApiResponse.Ok(settings));
    }

    [HttpPut("typography")]
    public async Task<ActionResult<ApiResponse<TypographySettingDto>>> UpsertTypography([FromBody] TypographySettingUpsertDto dto, CancellationToken ct)
    {
        var settings = await typographyService.UpsertAsync(dto, ct);
        return Ok(ApiResponse.Ok(settings, "Typography settings updated."));
    }
}
