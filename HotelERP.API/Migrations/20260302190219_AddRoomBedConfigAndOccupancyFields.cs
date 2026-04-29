using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomBedConfigAndOccupancyFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BaseOccupancy",
                table: "Rooms",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DoubleBedCount",
                table: "Rooms",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "KingBedCount",
                table: "Rooms",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxAgeOfChild",
                table: "Rooms",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QueenBedCount",
                table: "Rooms",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SingleBedCount",
                table: "Rooms",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SofaBedCount",
                table: "Rooms",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BaseOccupancy",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "DoubleBedCount",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "KingBedCount",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "MaxAgeOfChild",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "QueenBedCount",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "SingleBedCount",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "SofaBedCount",
                table: "Rooms");
        }
    }
}
