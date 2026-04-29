using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBlockFloorHierarchy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BlockFloorId",
                table: "Rooms",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Blocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelId = table.Column<int>(type: "int", nullable: false),
                    BlockName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BlockCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TotalFloors = table.Column<int>(type: "int", nullable: false),
                    TotalRooms = table.Column<int>(type: "int", nullable: false),
                    BlockManager = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Blocks_Hotels_HotelId",
                        column: x => x.HotelId,
                        principalTable: "Hotels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlockFloors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BlockId = table.Column<int>(type: "int", nullable: false),
                    FloorNumber = table.Column<int>(type: "int", nullable: false),
                    FloorName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TotalRooms = table.Column<int>(type: "int", nullable: false),
                    AvailableRooms = table.Column<int>(type: "int", nullable: false),
                    OccupiedRooms = table.Column<int>(type: "int", nullable: false),
                    OutOfOrderRooms = table.Column<int>(type: "int", nullable: false),
                    FloorManager = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    HousekeepingSupervisor = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    HasElevatorAccess = table.Column<bool>(type: "bit", nullable: false),
                    HasFireExit = table.Column<bool>(type: "bit", nullable: false),
                    SafetyFeatures = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SpecialFeatures = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlockFloors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlockFloors_Blocks_BlockId",
                        column: x => x.BlockId,
                        principalTable: "Blocks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_BlockFloorId",
                table: "Rooms",
                column: "BlockFloorId");

            migrationBuilder.CreateIndex(
                name: "IX_BlockFloors_BlockId",
                table: "BlockFloors",
                column: "BlockId");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_HotelId",
                table: "Blocks",
                column: "HotelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_BlockFloors_BlockFloorId",
                table: "Rooms",
                column: "BlockFloorId",
                principalTable: "BlockFloors",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_BlockFloors_BlockFloorId",
                table: "Rooms");

            migrationBuilder.DropTable(
                name: "BlockFloors");

            migrationBuilder.DropTable(
                name: "Blocks");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_BlockFloorId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "BlockFloorId",
                table: "Rooms");
        }
    }
}
