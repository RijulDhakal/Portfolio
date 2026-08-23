using Portfolio.Application.DTOs.Content;
using Portfolio.Application.DTOs.Contact;

namespace Portfolio.Application.DTOs.Media;

public sealed record MediaItemDto(
    Guid Id,
    string FileName,
    string OriginalFileName,
    string FileType,
    string MimeType,
    long FileSize,
    string Url,
    string? AltText,
    string Folder,
    DateTime UploadedAt,
    string? UploadedBy);

public sealed record MediaUploadResultDto(MediaItemDto Item);

public sealed record DashboardStatsDto(
    int ProjectsCount,
    int PublishedProjects,
    int SkillsCount,
    int ServicesCount,
    int UnreadMessages,
    int MediaCount,
    List<ProjectDto> RecentProjects,
    List<ContactMessageDto> RecentMessages);
