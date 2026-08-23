namespace Portfolio.Application.Common;

public sealed record ApiResponse<T>(bool Success, string? Message, T? Data, List<string>? Errors = null)
{
    public static ApiResponse<T> Ok(T data, string? message = null) => new(true, message, data);
    public static ApiResponse<T> Fail(string message, List<string>? errors = null) => new(false, message, default, errors);
}

public static class ApiResponse
{
    public static ApiResponse<object> Ok(object? data = null, string? message = null) => new(true, message, data);
    public static ApiResponse<object> Fail(string message, List<string>? errors = null) => new(false, message, null, errors);
}
