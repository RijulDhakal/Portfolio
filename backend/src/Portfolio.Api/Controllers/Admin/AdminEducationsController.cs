using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin/educations")]
[Authorize]
public sealed class AdminEducationsController(EducationService educationService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<EducationDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await educationService.GetAllAsync(search, page, pageSize, ct);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<EducationDto>>> Get(Guid id, CancellationToken ct)
    {
        var education = await educationService.GetAsync(id, ct);
        if (education is null) return NotFound(ApiResponse.Fail("Education not found."));
        return Ok(ApiResponse.Ok(education));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<EducationDto>>> Create([FromBody] EducationUpsertDto dto, CancellationToken ct)
    {
        var education = await educationService.CreateAsync(dto, ct);
        return Ok(ApiResponse.Ok(education, "Education created."));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<EducationDto>>> Update(Guid id, [FromBody] EducationUpsertDto dto, CancellationToken ct)
    {
        var education = await educationService.UpdateAsync(id, dto, ct);
        if (education is null) return NotFound(ApiResponse.Fail("Education not found."));
        return Ok(ApiResponse.Ok(education, "Education updated."));
    }

    [HttpPut("reorder")]
    public async Task<ActionResult<ApiResponse<object>>> Reorder([FromBody] List<Guid> orderedIds, CancellationToken ct)
    {
        var reordered = await educationService.ReorderAsync(orderedIds, ct);
        if (!reordered) return BadRequest(ApiResponse.Fail("Reorder failed. The id list must match existing entries."));
        return Ok(ApiResponse.Ok(null, "Order updated."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await educationService.DeleteAsync(id, ct);
        if (!deleted) return NotFound(ApiResponse.Fail("Education not found."));
        return Ok(ApiResponse.Ok(null, "Education deleted."));
    }
}
