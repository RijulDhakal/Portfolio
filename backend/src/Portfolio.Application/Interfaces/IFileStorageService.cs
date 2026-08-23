namespace Portfolio.Application.Interfaces;

public sealed record StoredFile(string RelativeUrl, string FileName);

public interface IFileStorageService
{
    Task<StoredFile> SaveAsync(Stream content, string originalFileName, string folder, CancellationToken ct = default);
    Task DeleteAsync(string relativeUrl, CancellationToken ct = default);
}
