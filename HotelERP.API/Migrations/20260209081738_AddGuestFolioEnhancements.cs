using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddGuestFolioEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "GuestFolios",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ChargeItemCode",
                table: "GuestFolios",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DueAmount",
                table: "GuestFolios",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "FolioIndex",
                table: "GuestFolios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GuestId",
                table: "GuestFolios",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InvoiceNumber",
                table: "GuestFolios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsReversed",
                table: "GuestFolios",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Memo",
                table: "GuestFolios",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PaidAmount",
                table: "GuestFolios",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "PaymentAccountCode",
                table: "GuestFolios",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "GuestFolios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReservationId",
                table: "GuestFolios",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReversedFromId",
                table: "GuestFolios",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomNumber",
                table: "GuestFolios",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "GuestFolios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TaxAmount",
                table: "GuestFolios",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "GuestFolios",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "FolioChargeItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DefaultPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    TaxPercentage = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FolioChargeItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FolioPaymentAccounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    AccountType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FolioPaymentAccounts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GuestFolios_GuestId",
                table: "GuestFolios",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_GuestFolios_ReservationId",
                table: "GuestFolios",
                column: "ReservationId");

            migrationBuilder.AddForeignKey(
                name: "FK_GuestFolios_Guests_GuestId",
                table: "GuestFolios",
                column: "GuestId",
                principalTable: "Guests",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GuestFolios_Reservations_ReservationId",
                table: "GuestFolios",
                column: "ReservationId",
                principalTable: "Reservations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuestFolios_Guests_GuestId",
                table: "GuestFolios");

            migrationBuilder.DropForeignKey(
                name: "FK_GuestFolios_Reservations_ReservationId",
                table: "GuestFolios");

            migrationBuilder.DropTable(
                name: "FolioChargeItems");

            migrationBuilder.DropTable(
                name: "FolioPaymentAccounts");

            migrationBuilder.DropIndex(
                name: "IX_GuestFolios_GuestId",
                table: "GuestFolios");

            migrationBuilder.DropIndex(
                name: "IX_GuestFolios_ReservationId",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "ChargeItemCode",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "DueAmount",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "FolioIndex",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "GuestId",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "InvoiceNumber",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "IsReversed",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "Memo",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "PaidAmount",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "PaymentAccountCode",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "ReservationId",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "ReversedFromId",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "RoomNumber",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "TaxAmount",
                table: "GuestFolios");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "GuestFolios");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "GuestFolios",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);
        }
    }
}
