using FluentValidation;
using Portfolio.Application.DTOs.Content;

namespace Portfolio.Application.Validators;

public sealed class HeroUpsertDtoValidator : AbstractValidator<HeroUpsertDto>
{
    public HeroUpsertDtoValidator()
    {
        RuleFor(x => x.Greeting).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.PrimaryButtonText).MaximumLength(60).When(x => x.PrimaryButtonText is not null);
        RuleFor(x => x.SecondaryButtonText).MaximumLength(60).When(x => x.SecondaryButtonText is not null);
        RuleFor(x => x.PrimaryButtonUrl).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL, a path starting with /, or a section anchor like #work").When(x => x.PrimaryButtonUrl is not null);
        RuleFor(x => x.SecondaryButtonUrl).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL, a path starting with /, or a section anchor like #work").When(x => x.SecondaryButtonUrl is not null);
        RuleFor(x => x.ProfilePhoto).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL or a path starting with /").When(x => x.ProfilePhoto is not null);
        RuleFor(x => x.CvFile).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL or a path starting with /").When(x => x.CvFile is not null);
    }
}

public sealed class AboutUpsertDtoValidator : AbstractValidator<AboutUpsertDto>
{
    public AboutUpsertDtoValidator()
    {
        RuleFor(x => x.Heading).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(5000);
        RuleFor(x => x.ExperienceYears).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ProjectsCompleted).GreaterThanOrEqualTo(0);
        RuleFor(x => x.TechnologiesCount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.CommitsCount).GreaterThanOrEqualTo(0).When(x => x.CommitsCount is not null);
        RuleFor(x => x.ProfileImage).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL or a path starting with /").When(x => x.ProfileImage is not null);
        RuleFor(x => x.Education).MaximumLength(2000).When(x => x.Education is not null);
        RuleFor(x => x.AdditionalInformation).MaximumLength(2000).When(x => x.AdditionalInformation is not null);
    }
}

public sealed class SkillUpsertDtoValidator : AbstractValidator<SkillUpsertDto>
{
    public SkillUpsertDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Category).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Description).MaximumLength(300).When(x => x.Description is not null);
        RuleFor(x => x.PositionX).Matches(@"^\d+(\.\d+)?%$")
            .WithMessage("must be a percentage like 50.00%").When(x => x.PositionX is not null);
        RuleFor(x => x.PositionY).Matches(@"^\d+(\.\d+)?%$")
            .WithMessage("must be a percentage like 50.00%").When(x => x.PositionY is not null);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
    }
}

public sealed class ServiceUpsertDtoValidator : AbstractValidator<ServiceUpsertDto>
{
    public ServiceUpsertDtoValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(1000).When(x => x.Description is not null);
        RuleForEach(x => x.Features).NotEmpty().MaximumLength(100);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
    }
}

public sealed class ExperienceUpsertDtoValidator : AbstractValidator<ExperienceUpsertDto>
{
    public ExperienceUpsertDtoValidator()
    {
        RuleFor(x => x.Year).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Role).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(1000).When(x => x.Description is not null);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
    }
}

public sealed class EducationUpsertDtoValidator : AbstractValidator<EducationUpsertDto>
{
    public EducationUpsertDtoValidator()
    {
        RuleFor(x => x.Institution).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Degree).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Field).MaximumLength(150).When(x => x.Field is not null);
        RuleFor(x => x.StartYear).MaximumLength(10).When(x => x.StartYear is not null);
        RuleFor(x => x.EndYear).MaximumLength(10).When(x => x.EndYear is not null);
        RuleFor(x => x.Description).MaximumLength(1000).When(x => x.Description is not null);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
    }
}

public sealed class SiteSettingUpsertDtoValidator : AbstractValidator<SiteSettingUpsertDto>
{
    public SiteSettingUpsertDtoValidator()
    {
        RuleFor(x => x.SiteName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.SiteTitle).NotEmpty().MaximumLength(300);
        RuleFor(x => x.MetaTitle).MaximumLength(300).When(x => x.MetaTitle is not null);
        RuleFor(x => x.MetaDescription).MaximumLength(1000).When(x => x.MetaDescription is not null);
        RuleFor(x => x.GoogleAnalyticsId).MaximumLength(100).When(x => x.GoogleAnalyticsId is not null);
        RuleFor(x => x.CopyrightText).MaximumLength(200).When(x => x.CopyrightText is not null);
        RuleFor(x => x.Favicon).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL or a path starting with /").When(x => x.Favicon is not null);
        RuleFor(x => x.OgImage).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL or a path starting with /").When(x => x.OgImage is not null);
        RuleFor(x => x.Logo).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL or a path starting with /").When(x => x.Logo is not null);
    }
}

public sealed class SocialLinkUpsertDtoValidator : AbstractValidator<SocialLinkUpsertDto>
{
    public SocialLinkUpsertDtoValidator()
    {
        RuleFor(x => x.Platform).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Label).MaximumLength(100).When(x => x.Label is not null);
        RuleFor(x => x.Url).NotEmpty().Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: false))
            .WithMessage("must be a valid http(s) URL");
        RuleFor(x => x.Icon).MaximumLength(100).When(x => x.Icon is not null);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
    }
}
