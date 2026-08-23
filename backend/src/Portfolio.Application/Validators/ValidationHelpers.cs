namespace Portfolio.Application.Validators;

public static class ValidationHelpers
{
    public static bool IsValidOptionalUrl(string? url, bool allowRelative)
    {
        if (string.IsNullOrWhiteSpace(url)) return true;
        // Section anchors (#work) and CMS upload paths (/uploads/...) are legitimate relative values.
        if (allowRelative && (url.StartsWith('/') || url.StartsWith('#'))) return true;
        return Uri.TryCreate(url, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }

    /// <summary>
    /// Security: nav/footer link targets must be internal paths, anchors,
    /// mailto:, tel: or http(s) — never executable schemes (javascript:, data:).
    /// </summary>
    public static bool IsValidNavLinkHref(string? href)
    {
        if (string.IsNullOrWhiteSpace(href)) return false;
        if (href.StartsWith('/') || href.StartsWith('#')) return true;

        return Uri.TryCreate(href, UriKind.Absolute, out var uri)
               && uri.Scheme is "http" or "https" or "mailto" or "tel";
    }
}
