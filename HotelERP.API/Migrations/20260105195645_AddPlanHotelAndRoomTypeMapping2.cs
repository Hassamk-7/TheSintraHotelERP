using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPlanHotelAndRoomTypeMapping2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "Plans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(@"UPDATE p
SET p.HotelId = h.Id
FROM Plans p
CROSS APPLY (
    SELECT TOP (1) Id
    FROM Hotels
    ORDER BY Id
) h
WHERE p.HotelId = 0");

            migrationBuilder.CreateTable(
                name: "PlanRoomTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanId = table.Column<int>(type: "int", nullable: false),
                    RoomTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanRoomTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanRoomTypes_Plans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "Plans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlanRoomTypes_RoomTypes_RoomTypeId",
                        column: x => x.RoomTypeId,
                        principalTable: "RoomTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Plans_HotelId",
                table: "Plans",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanRoomTypes_PlanId",
                table: "PlanRoomTypes",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanRoomTypes_RoomTypeId",
                table: "PlanRoomTypes",
                column: "RoomTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Plans_Hotels_HotelId",
                table: "Plans",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plans_Hotels_HotelId",
                table: "Plans");

            migrationBuilder.DropTable(
                name: "PlanRoomTypes");

            migrationBuilder.DropIndex(
                name: "IX_Plans_HotelId",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "Plans");
        }
    }
}
