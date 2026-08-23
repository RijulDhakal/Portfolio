using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Media;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin/dashboard")]
[Authorize]
public sealed class AdminDashboardController(DashboardService dashboardService) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> Stats(CancellationToken ct)
    {
        var stats = await dashboardService.GetStatsAsync(ControllerHelpers.GetBaseUrl(Request), ct);
        return Ok(ApiResponse.Ok(stats));
    }
}
