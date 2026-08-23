using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSiteCopy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "UPDATE \"Abouts\" SET \"Heading\" = 'Designing with purpose.\nBuilding with code.' WHERE \"Heading\" = 'Designing with purpose.';");
            migrationBuilder.AddColumn<string>(
                name: "ShortLabel",
                table: "SocialLinks",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SiteCopies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Navigation = table.Column<string>(type: "jsonb", nullable: false),
                    Intro = table.Column<string>(type: "jsonb", nullable: false),
                    About = table.Column<string>(type: "jsonb", nullable: false),
                    Skills = table.Column<string>(type: "jsonb", nullable: false),
                    Services = table.Column<string>(type: "jsonb", nullable: false),
                    Work = table.Column<string>(type: "jsonb", nullable: false),
                    Experience = table.Column<string>(type: "jsonb", nullable: false),
                    Education = table.Column<string>(type: "jsonb", nullable: false),
                    Personal = table.Column<string>(type: "jsonb", nullable: false),
                    Contact = table.Column<string>(type: "jsonb", nullable: false),
                    Footer = table.Column<string>(type: "jsonb", nullable: false),
                    GlobalUi = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamptz", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteCopies", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SiteCopies");

            migrationBuilder.DropColumn(
                name: "ShortLabel",
                table: "SocialLinks");
        }
    }
}
