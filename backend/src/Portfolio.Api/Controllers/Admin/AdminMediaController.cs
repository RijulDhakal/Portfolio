using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Media;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin/media")]
[Authorize]
public sealed class AdminMediaController(MediaService mediaService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<MediaItemDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] string? fileType,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await mediaService.GetAllAsync(search, fileType, page, pageSize, ct);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<MediaItemDto>>> Get(Guid id, CancellationToken ct)
    {
        var item = await mediaService.GetAsync(id, ct);
        if (item is null) return NotFound(ApiResponse.Fail("Media item not found."));
        return Ok(ApiResponse.Ok(item));
    }

    [HttpPost("upload")]
    [RequestSizeLimit(20 * 1024 * 1024)]
    [RequestFormLimits(MultipartBodyLengthLimit = 20 * 1024 * 1024)]
    public async Task<ActionResult<ApiResponse<MediaItemDto>>> Upload(
        [FromForm] MediaUploadRequest request, CancellationToken ct)
    {
        if (request.File.Length == 0)
            return BadRequest(ApiResponse.Fail("The uploaded file is empty."));

        var uploadedBy = ControllerHelpers.GetClaimUserId(HttpContext);
        await using var stream = request.File.OpenReadStream();
        var item = await mediaService.UploadAsync(stream, request.File.FileName, request.AltText, request.Folder ?? "general", uploadedBy, ct);
        return Ok(ApiResponse.Ok(item, "File uploaded."));
    }

    [HttpPut("{id:guid}/metadata")]
    public async Task<ActionResult<ApiResponse<MediaItemDto>>> UpdateMetadata(
        Guid id, [FromBody] UpdateMediaMetadataRequest request, CancellationToken ct)
    {
        var updated = await mediaService.UpdateMetadataAsync(id, request.AltText, request.Folder, ct);
        if (!updated) return NotFound(ApiResponse.Fail("Media item not found."));
        var item = await mediaService.GetAsync(id, ct);
        return Ok(ApiResponse.Ok(item, "Metadata updated."));
    }

    [HttpPost("{id:guid}/replace")]
    [RequestSizeLimit(20 * 1024 * 1024)]
    [RequestFormLimits(MultipartBodyLengthLimit = 20 * 1024 * 1024)]
    public async Task<ActionResult<ApiResponse<MediaItemDto>>> Replace(
        Guid id, [FromForm] MediaUploadRequest request, CancellationToken ct)
    {
        if (request.File.Length == 0)
            return BadRequest(ApiResponse.Fail("The uploaded file is empty."));

        var uploadedBy = ControllerHelpers.GetClaimUserId(HttpContext);
        await using var stream = request.File.OpenReadStream();
        var item = await mediaService.ReplaceAsync(id, stream, request.File.FileName, uploadedBy, ct);
        if (item is null) return NotFound(ApiResponse.Fail("Media item not found."));
        return Ok(ApiResponse.Ok(item, "File replaced."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await mediaService.DeleteAsync(id, ct);
        if (!deleted) return NotFound(ApiResponse.Fail("Media item not found."));
        return Ok(ApiResponse.Ok(null, "File deleted."));
    }
}

public sealed class MediaUploadRequest
{
    public required IFormFile File { get; init; }
    public string? AltText { get; init; }
    public string? Folder { get; init; }
}

public sealed record UpdateMediaMetadataRequest(string? AltText, string? Folder);
