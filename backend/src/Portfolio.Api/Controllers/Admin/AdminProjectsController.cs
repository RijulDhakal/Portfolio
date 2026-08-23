using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin/projects")]
[Authorize]
public sealed class AdminProjectsController(ProjectService projectService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ProjectDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] bool? publishedOnly, [FromQuery] bool? featuredOnly,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await projectService.GetAllAsync(search, publishedOnly, featuredOnly, page, pageSize,
            ControllerHelpers.GetBaseUrl(Request), ct);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> Get(Guid id, CancellationToken ct)
    {
        var project = await projectService.GetAsync(id, ControllerHelpers.GetBaseUrl(Request), ct);
        if (project is null) return NotFound(ApiResponse.Fail("Project not found."));
        return Ok(ApiResponse.Ok(project));
    }

    [HttpGet("by-slug/{slug}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> GetBySlug(string slug, CancellationToken ct)
    {
        var project = await projectService.GetBySlugAsync(slug, ControllerHelpers.GetBaseUrl(Request), ct);
        if (project is null) return NotFound(ApiResponse.Fail("Project not found."));
        return Ok(ApiResponse.Ok(project));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> Create([FromBody] ProjectUpsertDto dto, CancellationToken ct)
    {
        var project = await projectService.CreateAsync(dto, ct);
        return Ok(ApiResponse.Ok(project, "Project created."));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> Update(Guid id, [FromBody] ProjectUpsertDto dto, CancellationToken ct)
    {
        var project = await projectService.UpdateAsync(id, dto, ct);
        if (project is null) return NotFound(ApiResponse.Fail("Project not found."));
        return Ok(ApiResponse.Ok(project, "Project updated."));
    }

    [HttpPatch("{id:guid}/publish")]
    public async Task<ActionResult<ApiResponse<object>>> SetPublished(Guid id, [FromBody] bool isPublished, CancellationToken ct)
    {
        var updated = await projectService.SetPublishedAsync(id, isPublished, ct);
        if (!updated) return NotFound(ApiResponse.Fail("Project not found."));
        return Ok(ApiResponse.Ok(null, isPublished ? "Project published." : "Project unpublished."));
    }

    [HttpPatch("{id:guid}/feature")]
    public async Task<ActionResult<ApiResponse<object>>> SetFeatured(Guid id, [FromBody] bool isFeatured, CancellationToken ct)
    {
        var updated = await projectService.SetFeaturedAsync(id, isFeatured, ct);
        if (!updated) return NotFound(ApiResponse.Fail("Project not found."));
        return Ok(ApiResponse.Ok(null, isFeatured ? "Project featured." : "Project unfeatured."));
    }

    [HttpPut("reorder")]
    public async Task<ActionResult<ApiResponse<object>>> Reorder([FromBody] List<Guid> orderedIds, CancellationToken ct)
    {
        var reordered = await projectService.ReorderAsync(orderedIds, ct);
        if (!reordered) return BadRequest(ApiResponse.Fail("Reorder failed. The id list must match existing projects."));
        return Ok(ApiResponse.Ok(null, "Order updated."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await projectService.DeleteAsync(id, ct);
        if (!deleted) return NotFound(ApiResponse.Fail("Project not found."));
        return Ok(ApiResponse.Ok(null, "Project deleted."));
    }
}
