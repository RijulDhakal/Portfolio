using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin/social-links")]
[Authorize]
public sealed class AdminSocialLinksController(SocialLinkService socialLinkService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<SocialLinkDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] bool? activeOnly,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await socialLinkService.GetAllAsync(search, activeOnly, page, pageSize, ct);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<SocialLinkDto>>> Get(Guid id, CancellationToken ct)
    {
        var link = await socialLinkService.GetAsync(id, ct);
        if (link is null) return NotFound(ApiResponse.Fail("Social link not found."));
        return Ok(ApiResponse.Ok(link));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<SocialLinkDto>>> Create([FromBody] SocialLinkUpsertDto dto, CancellationToken ct)
    {
        var link = await socialLinkService.CreateAsync(dto, ct);
        return Ok(ApiResponse.Ok(link, "Social link created."));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<SocialLinkDto>>> Update(Guid id, [FromBody] SocialLinkUpsertDto dto, CancellationToken ct)
    {
        var link = await socialLinkService.UpdateAsync(id, dto, ct);
        if (link is null) return NotFound(ApiResponse.Fail("Social link not found."));
        return Ok(ApiResponse.Ok(link, "Social link updated."));
    }

    [HttpPatch("{id:guid}/active")]
    public async Task<ActionResult<ApiResponse<object>>> SetActive(Guid id, [FromBody] bool isActive, CancellationToken ct)
    {
        var updated = await socialLinkService.SetActiveAsync(id, isActive, ct);
        if (!updated) return NotFound(ApiResponse.Fail("Social link not found."));
        return Ok(ApiResponse.Ok(null, isActive ? "Social link activated." : "Social link deactivated."));
    }

    [HttpPut("reorder")]
    public async Task<ActionResult<ApiResponse<object>>> Reorder([FromBody] List<Guid> orderedIds, CancellationToken ct)
    {
        var reordered = await socialLinkService.ReorderAsync(orderedIds, ct);
        if (!reordered) return BadRequest(ApiResponse.Fail("Reorder failed. The id list must match existing links."));
        return Ok(ApiResponse.Ok(null, "Order updated."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await socialLinkService.DeleteAsync(id, ct);
        if (!deleted) return NotFound(ApiResponse.Fail("Social link not found."));
        return Ok(ApiResponse.Ok(null, "Social link deleted."));
    }
}
