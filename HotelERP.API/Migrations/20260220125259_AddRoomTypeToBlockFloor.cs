using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomTypeToBlockFloor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RoomTypeId",
                table: "BlockFloors",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BlockFloors_RoomTypeId",
                table: "BlockFloors",
                column: "RoomTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_BlockFloors_RoomTypes_RoomTypeId",
                table: "BlockFloors",
                column: "RoomTypeId",
                principalTable: "RoomTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlockFloors_RoomTypes_RoomTypeId",
                table: "BlockFloors");

            migrationBuilder.DropIndex(
                name: "IX_BlockFloors_RoomTypeId",
                table: "BlockFloors");

            migrationBuilder.DropColumn(
                name: "RoomTypeId",
                table: "BlockFloors");
        }
    }
}
