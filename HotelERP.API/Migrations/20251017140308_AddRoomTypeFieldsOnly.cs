using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomTypeFieldsOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BedType",
                table: "RoomTypes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ChildRate",
                table: "RoomTypes",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ExtraBedAllowed",
                table: "RoomTypes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "ExtraBedRate",
                table: "RoomTypes",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomSize",
                table: "RoomTypes",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ViewType",
                table: "RoomTypes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RoomTypeId1",
                table: "RoomTypeImages",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoomTypeImages_RoomTypeId1",
                table: "RoomTypeImages",
                column: "RoomTypeId1");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomTypeImages_RoomTypes_RoomTypeId1",
                table: "RoomTypeImages",
                column: "RoomTypeId1",
                principalTable: "RoomTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomTypeImages_RoomTypes_RoomTypeId1",
                table: "RoomTypeImages");

            migrationBuilder.DropIndex(
                name: "IX_RoomTypeImages_RoomTypeId1",
                table: "RoomTypeImages");

            migrationBuilder.DropColumn(
                name: "BedType",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "ChildRate",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "ExtraBedAllowed",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "ExtraBedRate",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "RoomSize",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "ViewType",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "RoomTypeId1",
                table: "RoomTypeImages");
        }
    }
}
