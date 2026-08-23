using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin/experiences")]
[Authorize]
public sealed class AdminExperiencesController(ExperienceService experienceService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ExperienceDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await experienceService.GetAllAsync(search, page, pageSize, ct);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ExperienceDto>>> Get(Guid id, CancellationToken ct)
    {
        var experience = await experienceService.GetAsync(id, ct);
        if (experience is null) return NotFound(ApiResponse.Fail("Experience not found."));
        return Ok(ApiResponse.Ok(experience));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ExperienceDto>>> Create([FromBody] ExperienceUpsertDto dto, CancellationToken ct)
    {
        var experience = await experienceService.CreateAsync(dto, ct);
        return Ok(ApiResponse.Ok(experience, "Experience created."));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ExperienceDto>>> Update(Guid id, [FromBody] ExperienceUpsertDto dto, CancellationToken ct)
    {
        var experience = await experienceService.UpdateAsync(id, dto, ct);
        if (experience is null) return NotFound(ApiResponse.Fail("Experience not found."));
        return Ok(ApiResponse.Ok(experience, "Experience updated."));
    }

    [HttpPut("reorder")]
    public async Task<ActionResult<ApiResponse<object>>> Reorder([FromBody] List<Guid> orderedIds, CancellationToken ct)
    {
        var reordered = await experienceService.ReorderAsync(orderedIds, ct);
        if (!reordered) return BadRequest(ApiResponse.Fail("Reorder failed. The id list must match existing entries."));
        return Ok(ApiResponse.Ok(null, "Order updated."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await experienceService.DeleteAsync(id, ct);
        if (!deleted) return NotFound(ApiResponse.Fail("Experience not found."));
        return Ok(ApiResponse.Ok(null, "Experience deleted."));
    }
}
