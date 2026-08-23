namespace Portfolio.Domain.Common;

public static class AdminRoles
{
    public const string Admin = "ADMIN";
    public const string Editor = "EDITOR";

    public static readonly string[] All = [Admin, Editor];
}
