using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin/skills")]
[Authorize]
public sealed class AdminSkillsController(SkillService skillService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<SkillDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] string? category,
        [FromQuery] bool? activeOnly, [FromQuery] int page = 1, [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
    {
        var result = await skillService.GetAllAsync(search, category, activeOnly, page, pageSize, ct);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<SkillDto>>> Get(Guid id, CancellationToken ct)
    {
        var skill = await skillService.GetAsync(id, ct);
        if (skill is null) return NotFound(ApiResponse.Fail("Skill not found."));
        return Ok(ApiResponse.Ok(skill));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<SkillDto>>> Create([FromBody] SkillUpsertDto dto, CancellationToken ct)
    {
        var skill = await skillService.CreateAsync(dto, ct);
        return Ok(ApiResponse.Ok(skill, "Skill created."));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<SkillDto>>> Update(Guid id, [FromBody] SkillUpsertDto dto, CancellationToken ct)
    {
        var skill = await skillService.UpdateAsync(id, dto, ct);
        if (skill is null) return NotFound(ApiResponse.Fail("Skill not found."));
        return Ok(ApiResponse.Ok(skill, "Skill updated."));
    }

    [HttpPatch("{id:guid}/active")]
    public async Task<ActionResult<ApiResponse<object>>> SetActive(Guid id, [FromBody] bool isActive, CancellationToken ct)
    {
        var updated = await skillService.SetActiveAsync(id, isActive, ct);
        if (!updated) return NotFound(ApiResponse.Fail("Skill not found."));
        return Ok(ApiResponse.Ok(null, isActive ? "Skill activated." : "Skill deactivated."));
    }

    [HttpPut("reorder")]
    public async Task<ActionResult<ApiResponse<object>>> Reorder([FromBody] List<Guid> orderedIds, CancellationToken ct)
    {
        var reordered = await skillService.ReorderAsync(orderedIds, ct);
        if (!reordered) return BadRequest(ApiResponse.Fail("Reorder failed. The id list must match existing skills."));
        return Ok(ApiResponse.Ok(null, "Order updated."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await skillService.DeleteAsync(id, ct);
        if (!deleted) return NotFound(ApiResponse.Fail("Skill not found."));
        return Ok(ApiResponse.Ok(null, "Skill deleted."));
    }
}
