using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomRatesTieredPricingAndDays : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Days",
                table: "RoomRates",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountRate",
                table: "RoomRates",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RateMonWed",
                table: "RoomRates",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RateSatSun",
                table: "RoomRates",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RateThuFri",
                table: "RoomRates",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Days",
                table: "RoomRates");

            migrationBuilder.DropColumn(
                name: "DiscountRate",
                table: "RoomRates");

            migrationBuilder.DropColumn(
                name: "RateMonWed",
                table: "RoomRates");

            migrationBuilder.DropColumn(
                name: "RateSatSun",
                table: "RoomRates");

            migrationBuilder.DropColumn(
                name: "RateThuFri",
                table: "RoomRates");
        }
    }
}
