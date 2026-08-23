using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Portfolio.Application.Common;
using Portfolio.Application.Interfaces;

namespace Portfolio.Infrastructure.Storage;

public sealed class LocalFileStorageService(IOptions<StorageOptions> options, IHostEnvironment environment) : IFileStorageService
{
    private readonly StorageOptions _options = options.Value;

    private string RootPath => Path.Combine(environment.ContentRootPath, _options.LocalPath.TrimStart('/', '\\'));

    public async Task<StoredFile> SaveAsync(Stream content, string fileName, string folder, CancellationToken ct = default)
    {
        var safeFolder = SanitizeFolder(folder);
        var directory = Path.Combine(RootPath, safeFolder);
        Directory.CreateDirectory(directory);

        var filePath = Path.Combine(directory, fileName);
        await using var fileStream = File.Create(filePath);
        await content.CopyToAsync(fileStream, ct);

        var relativeUrl = $"/{_options.LocalPath.Trim('/', '\\')}/{safeFolder}/{fileName}";
        return new StoredFile(relativeUrl, fileName);
    }

    public Task DeleteAsync(string relativeUrl, CancellationToken ct = default)
    {
        var segments = relativeUrl.TrimStart('/').Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 0) return Task.CompletedTask;

        var uploadsPrefix = _options.LocalPath.Trim('/', '\\');
        if (segments.Length > 1 && segments[0].Equals(uploadsPrefix, StringComparison.OrdinalIgnoreCase))
            segments = segments[1..];

        var filePath = Path.Combine(RootPath, Path.Combine(segments));
        if (File.Exists(filePath))
            File.Delete(filePath);

        return Task.CompletedTask;
    }

    private static string SanitizeFolder(string folder)
    {
        if (string.IsNullOrWhiteSpace(folder)) return "general";
        var sanitized = string.Concat(folder.Select(c =>
            Path.GetInvalidFileNameChars().Contains(c) || c is '/' or '\\' ? '-' : c));
        return string.IsNullOrWhiteSpace(sanitized) ? "general" : sanitized;
    }
}
