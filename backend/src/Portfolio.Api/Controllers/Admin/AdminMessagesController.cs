using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Contact;
using Portfolio.Application.Services;

namespace Portfolio.Api.Controllers.Admin;

[ApiController]
[Route("api/v1/admin/messages")]
[Authorize]
public sealed class AdminMessagesController(ContactService contactService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ContactMessageDto>>>> GetAll(
        [FromQuery] bool? unreadOnly, [FromQuery] int page = 1, [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
    {
        var result = await contactService.GetAllAsync(page, pageSize, unreadOnly, ct);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ContactMessageDto>>> Get(Guid id, CancellationToken ct)
    {
        var message = await contactService.GetAsync(id, ct);
        if (message is null) return NotFound(ApiResponse.Fail("Message not found."));
        return Ok(ApiResponse.Ok(message));
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<ActionResult<ApiResponse<object>>> MarkRead(Guid id, [FromBody] bool isRead, CancellationToken ct)
    {
        var updated = await contactService.MarkReadAsync(id, isRead, ct);
        if (!updated) return NotFound(ApiResponse.Fail("Message not found."));
        return Ok(ApiResponse.Ok(null, isRead ? "Message marked as read." : "Message marked as unread."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await contactService.DeleteAsync(id, ct);
        if (!deleted) return NotFound(ApiResponse.Fail("Message not found."));
        return Ok(ApiResponse.Ok(null, "Message deleted."));
    }
}
