using FluentValidation;
using Portfolio.Application.DTOs.Content;

namespace Portfolio.Application.Validators;

public sealed class ProjectUpsertDtoValidator : AbstractValidator<ProjectUpsertDto>
{
    public ProjectUpsertDtoValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug).NotEmpty().Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("must contain only lowercase letters, numbers and hyphens (e.g. my-project)");
        RuleFor(x => x.ShortDescription).MaximumLength(500).When(x => x.ShortDescription is not null);
        RuleFor(x => x.FullDescription).MaximumLength(10_000).When(x => x.FullDescription is not null);
        RuleFor(x => x.Category).MaximumLength(100).When(x => x.Category is not null);
        RuleForEach(x => x.Technologies).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Thumbnail).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL or a path starting with /").When(x => x.Thumbnail is not null);
        RuleFor(x => x.FeaturedImage).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
            .WithMessage("must be a valid http(s) URL or a path starting with /").When(x => x.FeaturedImage is not null);
        RuleFor(x => x.LiveUrl).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: false))
            .WithMessage("must be a valid http(s) URL").When(x => x.LiveUrl is not null);
        RuleFor(x => x.GithubUrl).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: false))
            .WithMessage("must be a valid http(s) URL").When(x => x.GithubUrl is not null);
        RuleFor(x => x.FigmaUrl).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: false))
            .WithMessage("must be a valid http(s) URL").When(x => x.FigmaUrl is not null);
        RuleFor(x => x.CaseStudyUrl).Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: false))
            .WithMessage("must be a valid http(s) URL").When(x => x.CaseStudyUrl is not null);
        RuleFor(x => x.Year).MaximumLength(50).When(x => x.Year is not null);
        RuleFor(x => x.Role).MaximumLength(200).When(x => x.Role is not null);
        RuleFor(x => x.Client).MaximumLength(200).When(x => x.Client is not null);
        RuleFor(x => x.Problem).MaximumLength(10_000).When(x => x.Problem is not null);
        RuleFor(x => x.Goal).MaximumLength(10_000).When(x => x.Goal is not null);
        RuleFor(x => x.Contribution).MaximumLength(10_000).When(x => x.Contribution is not null);
        RuleFor(x => x.Process).MaximumLength(10_000).When(x => x.Process is not null);
        RuleForEach(x => x.Features).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Challenges).MaximumLength(10_000).When(x => x.Challenges is not null);
        RuleFor(x => x.Solution).MaximumLength(10_000).When(x => x.Solution is not null);
        RuleFor(x => x.Results).MaximumLength(10_000).When(x => x.Results is not null);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
        RuleForEach(x => x.Images)
            .ChildRules(image =>
            {
                image.RuleFor(i => i.ImageUrl).NotEmpty().Must(u => ValidationHelpers.IsValidOptionalUrl(u, allowRelative: true))
                    .WithMessage("must be a valid http(s) URL or a path starting with /");
                image.RuleFor(i => i.AltText).MaximumLength(300).When(i => i.AltText is not null);
                image.RuleFor(i => i.DisplayOrder).GreaterThanOrEqualTo(0);
            });
    }
}
