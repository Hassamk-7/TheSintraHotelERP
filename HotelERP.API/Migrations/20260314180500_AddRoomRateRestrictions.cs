using HotelERP.API.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    [DbContext(typeof(HotelDbContext))]
    [Migration("20260314180500_AddRoomRateRestrictions")]
    public partial class AddRoomRateRestrictions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ClosedToArrival",
                table: "RoomRates",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ClosedToDeparture",
                table: "RoomRates",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaxStay",
                table: "RoomRates",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinStay",
                table: "RoomRates",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClosedToArrival",
                table: "RoomRates");

            migrationBuilder.DropColumn(
                name: "ClosedToDeparture",
                table: "RoomRates");

            migrationBuilder.DropColumn(
                name: "MaxStay",
                table: "RoomRates");

            migrationBuilder.DropColumn(
                name: "MinStay",
                table: "RoomRates");
        }
    }
}
