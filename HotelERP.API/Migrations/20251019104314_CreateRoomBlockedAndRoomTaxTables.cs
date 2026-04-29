using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class CreateRoomBlockedAndRoomTaxTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Skip adding Block and LastMaintenanceDate columns as they already exist

            migrationBuilder.CreateTable(
                name: "RoomBlocked",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelId = table.Column<int>(type: "int", nullable: false),
                    RoomTypeId = table.Column<int>(type: "int", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    BlockStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BlockEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BlockReason = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    BlockType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BlockedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BlockNotes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomBlocked", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoomBlocked_Hotels_HotelId",
                        column: x => x.HotelId,
                        principalTable: "Hotels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_RoomBlocked_RoomTypes_RoomTypeId",
                        column: x => x.RoomTypeId,
                        principalTable: "RoomTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_RoomBlocked_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

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
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_RoomTax_RoomTypes_RoomTypeId",
                        column: x => x.RoomTypeId,
                        principalTable: "RoomTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RoomBlocked_HotelId",
                table: "RoomBlocked",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomBlocked_RoomId",
                table: "RoomBlocked",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomBlocked_RoomTypeId",
                table: "RoomBlocked",
                column: "RoomTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomTax_HotelId",
                table: "RoomTax",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomTax_RoomTypeId",
                table: "RoomTax",
                column: "RoomTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoomBlocked");

            migrationBuilder.DropTable(
                name: "RoomTax");

            // Skip dropping Block and LastMaintenanceDate columns as they already existed
        }
    }
}
