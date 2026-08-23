using FluentValidation;
using Portfolio.Application.DTOs.Content;

namespace Portfolio.Application.Validators;

public sealed class TypographySettingUpsertDtoValidator : AbstractValidator<TypographySettingUpsertDto>
{
    private static readonly string[] AllowedAlignments = ["left", "center", "right"];

    public TypographySettingUpsertDtoValidator()
    {
        RuleFor(x => x.Global).NotNull();
        RuleFor(x => x.Global.HeadingFont).MaximumLength(100).When(x => x.Global.HeadingFont is not null);
        RuleFor(x => x.Global.BodyFont).MaximumLength(100).When(x => x.Global.BodyFont is not null);
        RuleFor(x => x.Global.HeadingSize).MaximumLength(50).When(x => x.Global.HeadingSize is not null);
        RuleFor(x => x.Global.BodySize).MaximumLength(50).When(x => x.Global.BodySize is not null);
        RuleFor(x => x.Global.HeadingWeight).MaximumLength(20).When(x => x.Global.HeadingWeight is not null);
        RuleFor(x => x.Global.BodyWeight).MaximumLength(20).When(x => x.Global.BodyWeight is not null);
        RuleFor(x => x.Global.HeadingLetterSpacing).MaximumLength(30).When(x => x.Global.HeadingLetterSpacing is not null);
        RuleFor(x => x.Global.BodyLetterSpacing).MaximumLength(30).When(x => x.Global.BodyLetterSpacing is not null);
        RuleFor(x => x.Global.HeadingLineHeight).MaximumLength(30).When(x => x.Global.HeadingLineHeight is not null);
        RuleFor(x => x.Global.BodyLineHeight).MaximumLength(30).When(x => x.Global.BodyLineHeight is not null);

        RuleFor(x => x.Overrides).NotNull();
        RuleForEach(x => x.Overrides).Must(kv => !string.IsNullOrWhiteSpace(kv.Key) && kv.Key.Length <= 200)
            .WithMessage("override keys must be non-empty and at most 200 characters");
        RuleForEach(x => x.Overrides).Must(kv => kv.Value is not null)
            .WithMessage("override values must not be null");
        RuleForEach(x => x.Overrides).Must(kv => kv.Value.FontFamily is null || kv.Value.FontFamily.Length <= 100)
            .WithMessage("FontFamily must be at most 100 characters");
        RuleForEach(x => x.Overrides).Must(kv => kv.Value.FontSize is null || kv.Value.FontSize.Length <= 50)
            .WithMessage("FontSize must be at most 50 characters");
        RuleForEach(x => x.Overrides).Must(kv => kv.Value.FontWeight is null || kv.Value.FontWeight.Length <= 20)
            .WithMessage("FontWeight must be at most 20 characters");
        RuleForEach(x => x.Overrides).Must(kv => kv.Value.LetterSpacing is null || kv.Value.LetterSpacing.Length <= 30)
            .WithMessage("LetterSpacing must be at most 30 characters");
        RuleForEach(x => x.Overrides).Must(kv => kv.Value.LineHeight is null || kv.Value.LineHeight.Length <= 30)
            .WithMessage("LineHeight must be at most 30 characters");
        RuleForEach(x => x.Overrides).Must(kv => kv.Value.TextAlign is null || AllowedAlignments.Contains(kv.Value.TextAlign))
            .WithMessage($"TextAlign must be one of: {string.Join(", ", AllowedAlignments)}");
    }
}
