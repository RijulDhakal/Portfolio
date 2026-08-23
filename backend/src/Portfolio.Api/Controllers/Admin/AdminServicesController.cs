using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Content;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin/services")]
[Authorize]
public sealed class AdminServicesController(ServiceService serviceService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ServiceDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] bool? activeOnly,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await serviceService.GetAllAsync(search, activeOnly, page, pageSize, ct);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> Get(Guid id, CancellationToken ct)
    {
        var service = await serviceService.GetAsync(id, ct);
        if (service is null) return NotFound(ApiResponse.Fail("Service not found."));
        return Ok(ApiResponse.Ok(service));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> Create([FromBody] ServiceUpsertDto dto, CancellationToken ct)
    {
        var service = await serviceService.CreateAsync(dto, ct);
        return Ok(ApiResponse.Ok(service, "Service created."));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> Update(Guid id, [FromBody] ServiceUpsertDto dto, CancellationToken ct)
    {
        var service = await serviceService.UpdateAsync(id, dto, ct);
        if (service is null) return NotFound(ApiResponse.Fail("Service not found."));
        return Ok(ApiResponse.Ok(service, "Service updated."));
    }

    [HttpPatch("{id:guid}/active")]
    public async Task<ActionResult<ApiResponse<object>>> SetActive(Guid id, [FromBody] bool isActive, CancellationToken ct)
    {
        var updated = await serviceService.SetActiveAsync(id, isActive, ct);
        if (!updated) return NotFound(ApiResponse.Fail("Service not found."));
        return Ok(ApiResponse.Ok(null, isActive ? "Service activated." : "Service deactivated."));
    }

    [HttpPut("reorder")]
    public async Task<ActionResult<ApiResponse<object>>> Reorder([FromBody] List<Guid> orderedIds, CancellationToken ct)
    {
        var reordered = await serviceService.ReorderAsync(orderedIds, ct);
        if (!reordered) return BadRequest(ApiResponse.Fail("Reorder failed. The id list must match existing services."));
        return Ok(ApiResponse.Ok(null, "Order updated."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await serviceService.DeleteAsync(id, ct);
        if (!deleted) return NotFound(ApiResponse.Fail("Service not found."));
        return Ok(ApiResponse.Ok(null, "Service deleted."));
    }
}
