using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class SyncOrderItemsManualFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_MenuManagements_MenuItemId",
                table: "OrderItems");

            migrationBuilder.AlterColumn<int>(
                name: "MenuItemId",
                table: "OrderItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            // BarItemId was manually added to the DB; guard this migration so re-applying doesn't fail.
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.OrderItems', 'BarItemId') IS NULL
BEGIN
    ALTER TABLE dbo.OrderItems ADD BarItemId int NULL;
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_OrderItems_BarItemId' AND object_id = OBJECT_ID('dbo.OrderItems'))
BEGIN
    CREATE INDEX IX_OrderItems_BarItemId ON dbo.OrderItems(BarItemId);
END;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_OrderItems_BarManagements_BarItemId')
BEGIN
    ALTER TABLE dbo.OrderItems WITH CHECK
    ADD CONSTRAINT FK_OrderItems_BarManagements_BarItemId
    FOREIGN KEY (BarItemId) REFERENCES dbo.BarManagements(Id);
END;
");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_MenuManagements_MenuItemId",
                table: "OrderItems",
                column: "MenuItemId",
                principalTable: "MenuManagements",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_BarManagements_BarItemId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_MenuManagements_MenuItemId",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_BarItemId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "BarItemId",
                table: "OrderItems");

            migrationBuilder.AlterColumn<int>(
                name: "MenuItemId",
                table: "OrderItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_MenuManagements_MenuItemId",
                table: "OrderItems",
                column: "MenuItemId",
                principalTable: "MenuManagements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
