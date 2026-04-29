using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRestaurantGuestAndTableReservations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CheckInId",
                table: "RestaurantOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GuestId",
                table: "RestaurantOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestName",
                table: "RestaurantOrders",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RestaurantReservationId",
                table: "RestaurantOrders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RestaurantTableReservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelId = table.Column<int>(type: "int", nullable: true),
                    TableId = table.Column<int>(type: "int", nullable: false),
                    GuestId = table.Column<int>(type: "int", nullable: true),
                    CheckInId = table.Column<int>(type: "int", nullable: true),
                    GuestName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    GuestPhone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    GuestEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RoomNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ReservationDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NumberOfGuests = table.Column<int>(type: "int", nullable: false),
                    DurationHours = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AdvanceAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SpecialRequests = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsCancelled = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantTableReservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RestaurantTableReservations_CheckInMasters_CheckInId",
                        column: x => x.CheckInId,
                        principalTable: "CheckInMasters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RestaurantTableReservations_Guests_GuestId",
                        column: x => x.GuestId,
                        principalTable: "Guests",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RestaurantTableReservations_TableMasters_TableId",
                        column: x => x.TableId,
                        principalTable: "TableMasters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantOrders_CheckInId",
                table: "RestaurantOrders",
                column: "CheckInId");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantOrders_GuestId",
                table: "RestaurantOrders",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantTableReservations_CheckInId",
                table: "RestaurantTableReservations",
                column: "CheckInId");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantTableReservations_GuestId",
                table: "RestaurantTableReservations",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantTableReservations_TableId",
                table: "RestaurantTableReservations",
                column: "TableId");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantOrders_CheckInMasters_CheckInId",
                table: "RestaurantOrders",
                column: "CheckInId",
                principalTable: "CheckInMasters",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantOrders_Guests_GuestId",
                table: "RestaurantOrders",
                column: "GuestId",
                principalTable: "Guests",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantOrders_CheckInMasters_CheckInId",
                table: "RestaurantOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantOrders_Guests_GuestId",
                table: "RestaurantOrders");

            migrationBuilder.DropTable(
                name: "RestaurantTableReservations");

            migrationBuilder.DropIndex(
                name: "IX_RestaurantOrders_CheckInId",
                table: "RestaurantOrders");

            migrationBuilder.DropIndex(
                name: "IX_RestaurantOrders_GuestId",
                table: "RestaurantOrders");

            migrationBuilder.DropColumn(
                name: "CheckInId",
                table: "RestaurantOrders");

            migrationBuilder.DropColumn(
                name: "GuestId",
                table: "RestaurantOrders");

            migrationBuilder.DropColumn(
                name: "GuestName",
                table: "RestaurantOrders");

            migrationBuilder.DropColumn(
                name: "RestaurantReservationId",
                table: "RestaurantOrders");
        }
    }
}
