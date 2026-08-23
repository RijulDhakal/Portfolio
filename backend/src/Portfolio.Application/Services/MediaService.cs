using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Portfolio.Application.Common;
using Portfolio.Application.DTOs.Media;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Mapping;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Enums;

namespace Portfolio.Application.Services;

public sealed class MediaService(
    IPortfolioDbContext db,
    IFileStorageService storage,
    IOptions<MediaOptions> mediaOptions,
    ILogger<MediaService> logger)
{
    private readonly MediaOptions _options = mediaOptions.Value;

    private static readonly Dictionary<string, (string Mime, FileType Type)> ExtensionMap = new(StringComparer.OrdinalIgnoreCase)
    {
        [".jpg"] = ("image/jpeg", FileType.Image),
        [".jpeg"] = ("image/jpeg", FileType.Image),
        [".png"] = ("image/png", FileType.Image),
        [".webp"] = ("image/webp", FileType.Image),
        [".svg"] = ("image/svg+xml", FileType.Image),
        [".pdf"] = ("application/pdf", FileType.Document)
    };

    // Security: the declared extension must match the file's actual content.
    // A renamed .exe/.html must never pass as an image.
    public static bool HasAllowedContentSignature(Stream content, string extension)
    {
        Span<byte> buffer = stackalloc byte[512];
        var read = 0;
        while (read < buffer.Length)
        {
            var n = content.Read(buffer[read..]);
            if (n == 0) break;
            read += n;
        }
        if (content.CanSeek) content.Position = 0;

        var header = buffer[..read];
        switch (extension.ToLowerInvariant())
        {
            case ".jpg" or ".jpeg":
                return read >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;
            case ".png":
                return read >= 4 && header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47;
            case ".webp":
                return read >= 12
                    && header[0] == (byte)'R' && header[1] == (byte)'I' && header[2] == (byte)'F' && header[3] == (byte)'F'
                    && header[8] == (byte)'W' && header[9] == (byte)'E' && header[10] == (byte)'B' && header[11] == (byte)'P';
            case ".pdf":
                return read >= 4 && header[0] == (byte)'%' && header[1] == (byte)'P' && header[2] == (byte)'D' && header[3] == (byte)'F';
            case ".svg":
            {
                var text = System.Text.Encoding.UTF8.GetString(header);
                var trimmed = text.TrimStart('\uFEFF', ' ', '\t', '\r', '\n');
                return trimmed.StartsWith("<svg", StringComparison.OrdinalIgnoreCase)
                    || (trimmed.StartsWith("<?xml", StringComparison.OrdinalIgnoreCase)
                        && trimmed.Contains("<svg", StringComparison.OrdinalIgnoreCase));
            }
            default:
                return false;
        }
    }

    public async Task<MediaItemDto> UploadAsync(Stream content, string originalFileName, string? altText, string folder, string? uploadedBy, CancellationToken ct = default)
    {
        var extension = Path.GetExtension(originalFileName);
        if (string.IsNullOrWhiteSpace(extension) || !ExtensionMap.TryGetValue(extension, out var kind))
            throw new ValidationException($"File type '{extension}' is not allowed. Allowed: {string.Join(", ", ExtensionMap.Keys)}");

        if (!HasAllowedContentSignature(content, extension))
            throw new ValidationException("File content does not match its extension.");

        if (content.Length > _options.MaxFileSizeBytes)
            throw new ValidationException($"File exceeds the maximum size of {_options.MaxFileSizeBytes / 1024 / 1024} MB");

        var safeName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var stored = await storage.SaveAsync(content, safeName, folder, ct);

        var item = new MediaItem
        {
            FileName = safeName,
            OriginalFileName = Path.GetFileName(originalFileName),
            FileType = kind.Type,
            MimeType = kind.Mime,
            FileSize = content.Length,
            Url = stored.RelativeUrl,
            AltText = altText,
            Folder = folder,
            UploadedBy = uploadedBy
        };

        db.MediaItems.Add(item);
        await db.SaveChangesAsync(ct);
        logger.LogInformation("Uploaded media {FileName} ({FileSize} bytes) to {Folder}", safeName, content.Length, folder);
        return item.ToDto();
    }

    public async Task<PagedResult<MediaItemDto>> GetAllAsync(string? search, string? fileType, int page, int pageSize, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.MediaItems.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(m => m.OriginalFileName.Contains(search) || m.AltText!.Contains(search));
        if (!string.IsNullOrWhiteSpace(fileType) && Enum.TryParse<FileType>(fileType, true, out var type))
            query = query.Where(m => m.FileType == type);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(m => m.UploadedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => m.ToDto())
            .ToListAsync(ct);

        return new PagedResult<MediaItemDto>(items, total, page, pageSize);
    }

    public async Task<MediaItemDto?> GetAsync(Guid id, CancellationToken ct = default)
    {
        var item = await db.MediaItems.FirstOrDefaultAsync(m => m.Id == id, ct);
        return item?.ToDto();
    }

    public async Task<bool> UpdateMetadataAsync(Guid id, string? altText, string? folder, CancellationToken ct = default)
    {
        var item = await db.MediaItems.FirstOrDefaultAsync(m => m.Id == id, ct);
        if (item is null) return false;

        if (altText is not null) item.AltText = altText;
        if (!string.IsNullOrWhiteSpace(folder)) item.Folder = folder;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<MediaItemDto?> ReplaceAsync(Guid id, Stream content, string originalFileName, string? uploadedBy, CancellationToken ct = default)
    {
        var item = await db.MediaItems.FirstOrDefaultAsync(m => m.Id == id, ct);
        if (item is null) return null;

        var extension = Path.GetExtension(originalFileName);
        if (string.IsNullOrWhiteSpace(extension) || !ExtensionMap.TryGetValue(extension, out var kind))
            throw new ValidationException($"File type '{extension}' is not allowed.");

        if (!HasAllowedContentSignature(content, extension))
            throw new ValidationException("File content does not match its extension.");

        if (content.Length > _options.MaxFileSizeBytes)
            throw new ValidationException($"File exceeds the maximum size of {_options.MaxFileSizeBytes / 1024 / 1024} MB");

        var safeName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var stored = await storage.SaveAsync(content, safeName, item.Folder, ct);

        await storage.DeleteAsync(item.Url, ct);

        item.FileName = safeName;
        item.OriginalFileName = Path.GetFileName(originalFileName);
        item.FileType = kind.Type;
        item.MimeType = kind.Mime;
        item.FileSize = content.Length;
        item.Url = stored.RelativeUrl;
        item.UploadedBy = uploadedBy;
        item.UploadedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        logger.LogInformation("Replaced media {Id} with {FileName}", id, safeName);
        return item.ToDto();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var item = await db.MediaItems.FirstOrDefaultAsync(m => m.Id == id, ct);
        if (item is null) return false;

        try
        {
            await storage.DeleteAsync(item.Url, ct);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to delete stored file for media {Id}", id);
        }

        db.MediaItems.Remove(item);
        await db.SaveChangesAsync(ct);
        logger.LogInformation("Deleted media {Id}", id);
        return true;
    }
}
