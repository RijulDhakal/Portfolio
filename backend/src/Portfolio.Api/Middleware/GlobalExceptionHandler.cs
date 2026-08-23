using System.Text.Json;
using FluentValidation;
using Portfolio.Application.Common;

namespace Portfolio.Api.Middleware;

public sealed class GlobalExceptionHandler(
    RequestDelegate next,
    ILogger<GlobalExceptionHandler> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message, errors) = exception switch
        {
            FluentValidation.ValidationException fve =>
                (StatusCodes.Status400BadRequest, "Validation failed.", fve.Errors.Select(e => e.ErrorMessage).ToList()),
            Portfolio.Application.Common.ValidationException ve =>
                (StatusCodes.Status400BadRequest, "Validation failed.", new List<string> { ve.Message }),
            NotFoundException => (StatusCodes.Status404NotFound, "The requested resource was not found.", (List<string>?)null),
            ConflictException ce => (StatusCodes.Status409Conflict, ce.Message, (List<string>?)null),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "You are not authorized to perform this action.", (List<string>?)null),
            _ => (StatusCodes.Status500InternalServerError, "Something went wrong", (List<string>?)null)
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
            logger.LogError(exception, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);
        else
            logger.LogWarning("Request {Method} {Path} failed with status {Status}: {Message}",
                context.Request.Method, context.Request.Path, statusCode, message);

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json; charset=utf-8";

        var response = ApiResponse.Fail(message, errors);
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, JsonOptions));
    }
}
