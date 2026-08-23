namespace Portfolio.Application.Common;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int AccessTokenMinutes { get; set; } = 15;
    public int RefreshTokenDays { get; set; } = 14;
}

public class MediaOptions
{
    public const string SectionName = "Media";

    public long MaxFileSizeBytes { get; set; } = 10 * 1024 * 1024;
    public string[] AllowedExtensions { get; set; } = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".pdf"];
    public string PublicBaseUrl { get; set; } = string.Empty;
}

public class StorageOptions
{
    public const string SectionName = "Storage";

    public string Provider { get; set; } = "local";
    public string LocalPath { get; set; } = "uploads";
    public string ConnectionString { get; set; } = string.Empty;
    public string Bucket { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
}

public class CorsOptions
{
    public const string SectionName = "Cors";

    public string[] AllowedOrigins { get; set; } = [];
}
