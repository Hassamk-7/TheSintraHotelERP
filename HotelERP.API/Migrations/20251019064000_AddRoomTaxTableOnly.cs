using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomTaxTableOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RoomTax",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelId = table.Column<int>(type: "int", nullable: false),
                    RoomTypeId = table.Column<int>(type: "int", nullable: false),
                    TaxName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TaxType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TaxValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomTax", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoomTax_Hotels_HotelId",
                        column: x => x.HotelId,
                        principalTable: "Hotels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoomTax_RoomTypes_RoomTypeId",
                        column: x => x.RoomTypeId,
                        principalTable: "RoomTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RoomTax_HotelId",
                table: "RoomTax",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomTax_RoomTypeId",
                table: "RoomTax",
                column: "RoomTypeId");

            // Insert sample data
            migrationBuilder.InsertData(
                table: "RoomTax",
                columns: new[] { "HotelId", "RoomTypeId", "TaxName", "TaxType", "TaxValue", "IsActive", "CreatedAt", "UpdatedAt", "CreatedBy" },
                values: new object[,]
                {
                    { 1, 1, "GST", "Percentage", 18.00m, true, DateTime.UtcNow, DateTime.UtcNow, "System" },
                    { 1, 1, "Service Tax", "Percentage", 10.00m, true, DateTime.UtcNow, DateTime.UtcNow, "System" },
                    { 1, 2, "GST", "Percentage", 18.00m, true, DateTime.UtcNow, DateTime.UtcNow, "System" },
                    { 1, 2, "Luxury Tax", "Percentage", 5.00m, true, DateTime.UtcNow, DateTime.UtcNow, "System" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoomTax");
        }
    }
}
