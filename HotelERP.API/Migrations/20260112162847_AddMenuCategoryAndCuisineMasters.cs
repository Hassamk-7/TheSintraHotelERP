using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMenuCategoryAndCuisineMasters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_OrderItems_MenuManagements_MenuItemId')
BEGIN
    ALTER TABLE [OrderItems] DROP CONSTRAINT [FK_OrderItems_MenuManagements_MenuItemId];
END
");

            migrationBuilder.Sql(@"
IF COL_LENGTH('OrderItems', 'DrinksPricingId') IS NULL
BEGIN
    ALTER TABLE [OrderItems] ADD [DrinksPricingId] int NULL;
END
");

            migrationBuilder.AlterColumn<string>(
                name: "DrinkName",
                table: "DrinksPricings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "DrinkCode",
                table: "DrinksPricings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);


            migrationBuilder.Sql(@"
IF COL_LENGTH('DrinksPricings', 'DrinksMasterId') IS NULL
BEGIN
    ALTER TABLE [DrinksPricings] ADD [DrinksMasterId] int NOT NULL DEFAULT 0;
END
");


            migrationBuilder.Sql(@"
IF COL_LENGTH('DrinksPricings', 'ItemMasterId') IS NULL
BEGIN
    ALTER TABLE [DrinksPricings] ADD [ItemMasterId] int NULL;
END
");


            migrationBuilder.Sql(@"
IF COL_LENGTH('DrinksMasters', 'Price') IS NULL
BEGIN
    ALTER TABLE [DrinksMasters] ADD [Price] decimal(18,2) NOT NULL DEFAULT 0;
END
");


            migrationBuilder.Sql(@"
IF COL_LENGTH('DrinksCategories', 'ImagePath') IS NULL
BEGIN
    ALTER TABLE [DrinksCategories] ADD [ImagePath] nvarchar(200) NULL;
END
");

            migrationBuilder.CreateTable(
                name: "MenuCategoryMasters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuCategoryMasters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MenuCuisineMasters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuCuisineMasters", x => x.Id);
                });

            migrationBuilder.Sql(@"
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'OrderItems')
AND EXISTS (SELECT 1 FROM sys.tables WHERE name = 'MenuItems')
AND NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_OrderItems_MenuItems_MenuItemId')
BEGIN
    ALTER TABLE [OrderItems] WITH CHECK ADD CONSTRAINT [FK_OrderItems_MenuItems_MenuItemId]
    FOREIGN KEY([MenuItemId]) REFERENCES [MenuItems]([MenuItemID]);
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_MenuItems_MenuItemId",
                table: "OrderItems");

            migrationBuilder.DropTable(
                name: "MenuCategoryMasters");

            migrationBuilder.DropTable(
                name: "MenuCuisineMasters");

            migrationBuilder.DropColumn(
                name: "DrinksPricingId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "DrinksMasterId",
                table: "DrinksPricings");

            migrationBuilder.DropColumn(
                name: "ItemMasterId",
                table: "DrinksPricings");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "DrinksMasters");

            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "DrinksCategories");

            migrationBuilder.AlterColumn<string>(
                name: "DrinkName",
                table: "DrinksPricings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DrinkCode",
                table: "DrinksPricings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.Sql(@"
IF OBJECT_ID(N'[MenuManagements]', N'U') IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_OrderItems_MenuManagements_MenuItemId')
    BEGIN
        ALTER TABLE [OrderItems] WITH CHECK ADD CONSTRAINT [FK_OrderItems_MenuManagements_MenuItemId]
        FOREIGN KEY([MenuItemId]) REFERENCES [MenuManagements]([Id]);
    END
END
");
        }
    }
}
