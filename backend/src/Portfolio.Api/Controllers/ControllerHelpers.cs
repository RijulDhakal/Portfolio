namespace Portfolio.Api.Controllers;

public static class ControllerHelpers
{
    public static string GetBaseUrl(HttpRequest request) =>
        $"{request.Scheme}://{request.Host}";

    public static string? GetIpAddress(HttpRequest request) =>
        request.HttpContext.Connection.RemoteIpAddress?.ToString();

    public static string? GetClaimUserId(HttpContext httpContext)
    {
        var value = httpContext.User.FindFirst("sub")?.Value
            ?? httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return value;
    }
}
