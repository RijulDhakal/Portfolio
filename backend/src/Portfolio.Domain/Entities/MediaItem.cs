using Portfolio.Domain.Common;
using Portfolio.Domain.Enums;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Metadata for an uploaded file. Binary data is never stored in PostgreSQL —
/// the storage provider owns the blob and this entity records its location.
/// </summary>
public class MediaItem : AuditableEntity
{
    public required string FileName { get; set; }
    public required string OriginalFileName { get; set; }
    public FileType FileType { get; set; }
    public required string MimeType { get; set; }
    public long FileSize { get; set; }
    public required string Url { get; set; }
    public string? AltText { get; set; }
    public string Folder { get; set; } = "general";
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public string? UploadedBy { get; set; }
}
