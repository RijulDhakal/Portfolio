using System.Net;
using FluentAssertions;

namespace Portfolio.Tests;

public sealed class ContentCrudTests(PortfolioApiFactory factory) : ApiTestBase(factory)
{
    [Fact]
    public async Task Skill_Create_ThenGet_ThenUpdate_ThenDelete()
    {
        var token = await LoginAsync();

        var created = await PostAsync<ApiTestBase.SkillDto>("/api/v1/admin/skills", new
        {
            name = "Test Skill",
            category = "Testing",
            description = "A skill created by integration tests",
            icon = "ri-test-line",
            positionX = "10%",
            positionY = "20%",
            displayOrder = 99,
            isActive = true
        }, token);

        created.Success.Should().BeTrue();
        created.Data.Should().NotBeNull();
        var skillId = created.Data!.Id;

        var fetched = await GetAsync<ApiTestBase.SkillDto>($"/api/v1/admin/skills/{skillId}", token);
        fetched.Data!.Name.Should().Be("Test Skill");

        var updated = await PutAsync<ApiTestBase.SkillDto>($"/api/v1/admin/skills/{skillId}", new
        {
            name = "Test Skill Renamed",
            category = "Testing",
            description = "Updated description",
            icon = "ri-test-line",
            positionX = "11%",
            positionY = "21%",
            displayOrder = 99,
            isActive = true
        }, token);
        updated.Data!.Name.Should().Be("Test Skill Renamed");

        var (status, _) = await DeleteAsync<object>($"/api/v1/admin/skills/{skillId}", token);
        status.Should().Be(HttpStatusCode.OK);

        var (afterDelete, _) = await DeleteAsync<object>($"/api/v1/admin/skills/{skillId}", token);
        afterDelete.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Skill_Create_WithInvalidPayload_Returns400()
    {
        var token = await LoginAsync();

        var envelope = await PostAsync<object>("/api/v1/admin/skills", new
        {
            name = "",
            category = "",
            displayOrder = -1,
            isActive = true
        }, token, expectedStatus: HttpStatusCode.BadRequest);

        envelope.Success.Should().BeFalse();
    }

    [Fact]
    public async Task Project_Create_WithDuplicateSlug_Returns409()
    {
        var token = await LoginAsync();
        var existingSlug = await GetFirstProjectSlugAsync(token);

        var envelope = await PostAsync<object>("/api/v1/admin/projects", new
        {
            title = "Duplicate Project",
            slug = existingSlug,
            technologies = new[] { "React" },
            displayOrder = 1,
            isFeatured = false,
            isPublished = false
        }, token, expectedStatus: HttpStatusCode.Conflict);

        envelope.Success.Should().BeFalse();
        envelope.Message.Should().Contain("already exists");
    }

    [Fact]
    public async Task Project_Create_Publish_ThenPubliclyVisible_ThenDelete()
    {
        var token = await LoginAsync();
        var slug = $"test-project-{Guid.NewGuid():N}"[..20];

        var created = await PostAsync<ApiTestBase.SkillDto>("/api/v1/admin/projects", new
        {
            title = "Test Project",
            slug,
            technologies = new[] { "React", "TypeScript" },
            displayOrder = 1,
            isFeatured = false,
            isPublished = false
        }, token);
        created.Success.Should().BeTrue();
        var projectId = created.Data!.Id;

        var notFound = await GetAsync<object>($"/api/v1/projects/{slug}", expectedStatus: HttpStatusCode.NotFound);
        notFound.Success.Should().BeFalse();

        await PutAsync<object>($"/api/v1/admin/projects/{projectId}", new
        {
            title = "Test Project",
            slug,
            technologies = new[] { "React", "TypeScript" },
            displayOrder = 1,
            isFeatured = false,
            isPublished = true
        }, token);

        var publicEnvelope = await GetAsync<ApiTestBase.SkillDto>($"/api/v1/projects/{slug}");
        publicEnvelope.Success.Should().BeTrue();

        var (status, _) = await DeleteAsync<object>($"/api/v1/admin/projects/{projectId}", token);
        status.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Hero_Update_WithSectionAnchorAndUploadPath_Succeeds()
    {
        var token = await LoginAsync();

        var updated = await PutAsync<ApiTestBase.HeroDto>("/api/v1/admin/hero", new
        {
            greeting = "Hello I'm",
            name = "Rijul Dhakal",
            title = "UI/UX Designer & Developer",
            description = "Seeded description",
            profilePhoto = "/uploads/general/profile-test.jpg",
            cvFile = (string?)null,
            cvFileName = (string?)null,
            primaryButtonText = "VIEW MY WORK",
            primaryButtonUrl = "#work",
            secondaryButtonText = "DOWNLOAD CV",
            secondaryButtonUrl = (string?)null,
            availabilityText = "Available for freelance work",
            isActive = true
        }, token);

        updated.Success.Should().BeTrue();
        updated.Data!.ProfilePhoto.Should().Be("/uploads/general/profile-test.jpg");
        updated.Data.PrimaryButtonUrl.Should().Be("#work");
    }

    [Fact]
    public async Task Hero_Update_WithUnsafeButtonUrl_Returns400()
    {
        var token = await LoginAsync();

        var envelope = await PutAsync<object>("/api/v1/admin/hero", new
        {
            greeting = "Hello I'm",
            name = "Rijul Dhakal",
            title = "UI/UX Designer & Developer",
            description = "Seeded description",
            profilePhoto = (string?)null,
            cvFile = (string?)null,
            cvFileName = (string?)null,
            primaryButtonText = "VIEW MY WORK",
            primaryButtonUrl = "javascript:alert(1)",
            secondaryButtonText = "DOWNLOAD CV",
            secondaryButtonUrl = (string?)null,
            availabilityText = "Available for freelance work",
            isActive = true
        }, token, expectedStatus: HttpStatusCode.BadRequest);

        envelope.Success.Should().BeFalse();
        envelope.Errors.Should().Contain(e => e.Contains("must be a valid http(s) URL"));
    }

    [Fact]
    public async Task SocialLink_Create_WithFragmentUrl_Returns400()
    {
        var token = await LoginAsync();

        var envelope = await PostAsync<object>("/api/v1/admin/social-links", new
        {
            platform = "Internal",
            label = "Anchor only",
            url = "#home",
            icon = (string?)null,
            displayOrder = 99,
            isActive = true
        }, token, expectedStatus: HttpStatusCode.BadRequest);

        envelope.Success.Should().BeFalse();
    }

    private async Task<string> GetFirstProjectSlugAsync(string token)
    {
        var envelope = await GetAsync<ProjectList>("/api/v1/admin/projects", token);
        envelope.Data.Should().NotBeNull();
        envelope.Data!.Items.Should().NotBeEmpty();
        return envelope.Data.Items[0].Slug;
    }

    public sealed record ProjectList(IReadOnlyList<ProjectSummary> Items, int Total, int Page, int PageSize);

    public sealed record ProjectSummary(Guid Id, string Title, string Slug);
}
