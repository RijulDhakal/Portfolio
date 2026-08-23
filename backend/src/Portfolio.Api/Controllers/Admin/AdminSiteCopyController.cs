using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin")]
[Authorize]
public sealed class AdminSiteCopyController(SiteCopyService siteCopyService) : ControllerBase
{
    [HttpGet("site-copy")]
    public async Task<ActionResult<ApiResponse<SiteCopyDto>>> Get(CancellationToken ct)
    {
        var copy = await siteCopyService.GetAsync(ct);
        return Ok(ApiResponse.Ok(copy));
    }

    [HttpPut("site-copy")]
    public async Task<ActionResult<ApiResponse<SiteCopyDto>>> Upsert([FromBody] SiteCopyUpsertDto dto, CancellationToken ct)
    {
        var copy = await siteCopyService.UpsertAsync(dto, ct);
        return Ok(ApiResponse.Ok(copy, "Site copy updated."));
    }
}
