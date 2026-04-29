using System;
using HotelERP.API.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    [DbContext(typeof(HotelDbContext))]
    [Migration("20260318052000_AddPlanCtaCtdRestrictions")]
    public partial class AddPlanCtaCtdRestrictions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ClosedToArrival",
                table: "Plans",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedToArrivalValidFrom",
                table: "Plans",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedToArrivalValidTo",
                table: "Plans",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ClosedToDeparture",
                table: "Plans",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedToDepartureValidFrom",
                table: "Plans",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedToDepartureValidTo",
                table: "Plans",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClosedToArrival",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "ClosedToArrivalValidFrom",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "ClosedToArrivalValidTo",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "ClosedToDeparture",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "ClosedToDepartureValidFrom",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "ClosedToDepartureValidTo",
                table: "Plans");
        }
    }
}
