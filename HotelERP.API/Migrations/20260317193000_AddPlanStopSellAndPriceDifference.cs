using System;
using HotelERP.API.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    [DbContext(typeof(HotelDbContext))]
    [Migration("20260317193000_AddPlanStopSellAndPriceDifference")]
    public partial class AddPlanStopSellAndPriceDifference : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PriceAdjustmentType",
                table: "Plans",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PriceDifferenceType",
                table: "Plans",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceDifferenceValue",
                table: "Plans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "StopSell",
                table: "Plans",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ValidFrom",
                table: "Plans",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ValidTo",
                table: "Plans",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceAdjustmentType",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "PriceDifferenceType",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "PriceDifferenceValue",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "StopSell",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "ValidFrom",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "ValidTo",
                table: "Plans");
        }
    }
}
