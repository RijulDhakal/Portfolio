using FluentValidation;
using Portfolio.Application.DTOs.Content;

namespace Portfolio.Application.Validators;

public sealed class SiteCopyUpsertDtoValidator : AbstractValidator<SiteCopyUpsertDto>
{
    public SiteCopyUpsertDtoValidator()
    {
        RuleFor(x => x.Navigation).NotNull();
        RuleFor(x => x.Navigation.Brand).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Navigation.HireMe).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Navigation.Links).NotNull();
        RuleForEach(x => x.Navigation.Links).ChildRules(link =>
        {
            link.RuleFor(l => l.Label).NotEmpty().MaximumLength(60);
            link.RuleFor(l => l.Href).NotEmpty().MaximumLength(200)
                .Must(ValidationHelpers.IsValidNavLinkHref)
                .WithMessage("must be an internal path starting with /, a section anchor like #work, mailto:, tel:, or an http(s) URL");
        });

        RuleFor(x => x.Intro).NotNull();
        RuleFor(x => x.Intro.Line1).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Intro.Line2).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Intro.Line3).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Intro.Body).NotEmpty().MaximumLength(2000);

        RuleFor(x => x.About).NotNull();
        RuleFor(x => x.About.Number).NotEmpty().MaximumLength(20);
        RuleFor(x => x.About.Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.About.Stat1Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.About.Stat2Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.About.Stat3Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.About.StatSuffix).NotEmpty().MaximumLength(10);

        RuleFor(x => x.Skills).NotNull();
        RuleFor(x => x.Skills.Number).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Skills.Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Skills.Heading).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Skills.CenterLabel).NotEmpty().MaximumLength(60);

        RuleFor(x => x.Services).NotNull();
        RuleFor(x => x.Services.Number).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Services.Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Services.Heading).NotEmpty().MaximumLength(300);

        RuleFor(x => x.Work).NotNull();
        RuleFor(x => x.Work.Number).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Work.Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Work.Heading).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Work.ViewProjectLabel).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Work.Separator).MaximumLength(10);

        RuleFor(x => x.Experience).NotNull();
        RuleFor(x => x.Experience.Number).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Experience.Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Experience.Heading).NotEmpty().MaximumLength(300);

        RuleFor(x => x.Education).NotNull();
        RuleFor(x => x.Education.Number).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Education.Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Education.Heading).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Education.OfConnector).NotEmpty().MaximumLength(30);
        RuleFor(x => x.Education.Dash).MaximumLength(10);

        RuleFor(x => x.Personal).NotNull();
        RuleFor(x => x.Personal.Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Personal.Heading).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Personal.MarqueeWords).NotNull();
        RuleForEach(x => x.Personal.MarqueeWords).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Personal.MarqueeSeparator).NotEmpty().MaximumLength(10);
        RuleFor(x => x.Personal.Body).NotEmpty().MaximumLength(2000);

        RuleFor(x => x.Contact).NotNull();
        RuleFor(x => x.Contact.Number).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Contact.Label).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.HeadingLine1).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Contact.HeadingLine2).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Contact.HeadingLine3).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Contact.Body).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.Contact.EmailLabel).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.PhoneLabel).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.PhoneNumber).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.FormNameLabel).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.FormEmailLabel).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.FormMessageLabel).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.NamePlaceholder).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Contact.EmailPlaceholder).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Contact.MessagePlaceholder).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Contact.SubmitLabel).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.SendingLabel).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.SuccessTitle).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.SuccessBody).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.Contact.SendAnotherLabel).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Contact.ErrorFallback).NotEmpty().MaximumLength(500);

        RuleFor(x => x.Footer).NotNull();
        RuleFor(x => x.Footer.NavigationHeading).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Footer.ContactHeading).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Footer.NavLinks).NotNull();
        RuleForEach(x => x.Footer.NavLinks).ChildRules(link =>
        {
            link.RuleFor(l => l.Label).NotEmpty().MaximumLength(60);
            link.RuleFor(l => l.Href).NotEmpty().MaximumLength(200)
                .Must(ValidationHelpers.IsValidNavLinkHref)
                .WithMessage("must be an internal path starting with /, a section anchor like #work, mailto:, tel:, or an http(s) URL");
        });
        RuleFor(x => x.Footer.BuiltWith).NotEmpty().MaximumLength(120);

        RuleFor(x => x.GlobalUi).NotNull();
        RuleFor(x => x.GlobalUi.CursorDefault).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorHome).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorLetsTalk).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorView).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorDownload).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorDesign).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorBuild).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorCreate).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorExplore).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorOpen).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.CursorBolt).NotEmpty().MaximumLength(60);
        RuleFor(x => x.GlobalUi.HeroImageAlt).NotEmpty().MaximumLength(200);
    }
}
