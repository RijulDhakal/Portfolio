using Amazon.S3;
using Amazon.S3.Model;
using Amazon.Runtime;
using Microsoft.Extensions.Options;
using Portfolio.Application.Common;
using Portfolio.Application.Interfaces;

namespace Portfolio.Infrastructure.Storage;

public sealed class S3FileStorageService(IOptions<StorageOptions> options, IOptions<StorageCredentials> credentials) : IFileStorageService
{
    private readonly StorageOptions _options = options.Value;
    private readonly StorageCredentials _credentials = credentials.Value;

    private AmazonS3Client CreateClient() => new(
        new BasicAWSCredentials(_credentials.AccessKey, _credentials.SecretKey),
        new AmazonS3Config
        {
            ServiceURL = string.IsNullOrWhiteSpace(_options.Endpoint) ? null : _options.Endpoint,
            ForcePathStyle = !string.IsNullOrWhiteSpace(_options.Endpoint)
        });

    public async Task<StoredFile> SaveAsync(Stream content, string fileName, string folder, CancellationToken ct = default)
    {
        var safeFolder = string.IsNullOrWhiteSpace(folder) ? "general" : folder.Trim('/');
        var key = $"{safeFolder}/{fileName}";

        using var client = CreateClient();
        await client.PutObjectAsync(new PutObjectRequest
        {
            BucketName = _options.Bucket,
            Key = key,
            InputStream = content,
            AutoCloseStream = false,
            DisablePayloadSigning = true
        }, ct);

        var url = string.IsNullOrWhiteSpace(_options.Endpoint)
            ? $"https://{_options.Bucket}.s3.amazonaws.com/{key}"
            : $"{_options.Endpoint.TrimEnd('/')}/{_options.Bucket}/{key}";

        return new StoredFile(url, fileName);
    }

    public async Task DeleteAsync(string relativeUrl, CancellationToken ct = default)
    {
        if (!Uri.TryCreate(relativeUrl, UriKind.Absolute, out var uri)) return;
        var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length < 2) return;

        using var client = CreateClient();
        await client.DeleteObjectAsync(new DeleteObjectRequest
        {
            BucketName = segments[0],
            Key = string.Join('/', segments[1..])
        }, ct);
    }
}

public sealed class StorageCredentials
{
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
}
