using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddReservationEnhancedFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BtcId",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CheckinNotes",
                table: "Reservations",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ComingFrom",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "Reservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Complimentary",
                table: "Reservations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                table: "Reservations",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "DropOff",
                table: "Reservations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DropStation",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EnteredBy",
                table: "Reservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FBCredits",
                table: "Reservations",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Folio1",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Folio2",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Folio3",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupId",
                table: "Reservations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestName2",
                table: "Reservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestName3",
                table: "Reservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InclusivePrivileges",
                table: "Reservations",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Industry",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Market",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Meals",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NTN",
                table: "Reservations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Newspaper",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Nights",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "NoPost",
                table: "Reservations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfRooms",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PaymentAccount",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Reservations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Pickup",
                table: "Reservations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PickupCarrier",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PickupStation",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PickupTime",
                table: "Reservations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Purpose",
                table: "Reservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RatePlanId",
                table: "Reservations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReferenceCompany",
                table: "Reservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReservationMadeBy",
                table: "Reservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReservationNotes",
                table: "Reservations",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RoomRate",
                table: "Reservations",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Reservations",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VIPStatus",
                table: "Reservations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdvanceAmount",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "BTCComments",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "BTCFolio",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "BtcId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CheckinNotes",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ComingFrom",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Company",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Complimentary",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Discount",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DropOff",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DropStation",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "EnteredBy",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "FBCredits",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Folio1",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Folio2",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Folio3",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "GuestName2",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "GuestName3",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "InclusivePrivileges",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Industry",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Market",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Meals",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "NTN",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Newspaper",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Nights",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "NoPost",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "NumberOfRooms",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PaymentAccount",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Pickup",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PickupCarrier",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PickupStation",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PickupTime",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Purpose",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "RatePlanId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ReferenceCompany",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ReservationMadeBy",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ReservationNotes",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "RoomRate",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "VIPStatus",
                table: "Reservations");
        }
    }
}
