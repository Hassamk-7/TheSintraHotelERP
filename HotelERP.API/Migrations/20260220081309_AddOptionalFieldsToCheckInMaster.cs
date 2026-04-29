using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddOptionalFieldsToCheckInMaster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BTCComments",
                table: "CheckInMasters",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BTCFolio",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BtcId",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CheckinNotes",
                table: "CheckInMasters",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ComingFrom",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "CheckInMasters",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Complimentary",
                table: "CheckInMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                table: "CheckInMasters",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "DropOff",
                table: "CheckInMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DropStation",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EnteredBy",
                table: "CheckInMasters",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FBCredits",
                table: "CheckInMasters",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Folio1",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Folio2",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Folio3",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupId",
                table: "CheckInMasters",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestName2",
                table: "CheckInMasters",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestName3",
                table: "CheckInMasters",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InclusivePrivileges",
                table: "CheckInMasters",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Industry",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Market",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Meals",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NTN",
                table: "CheckInMasters",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Newspaper",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NoPost",
                table: "CheckInMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PaymentAccount",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "CheckInMasters",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Pickup",
                table: "CheckInMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PickupCarrier",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PickupStation",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PickupTime",
                table: "CheckInMasters",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Purpose",
                table: "CheckInMasters",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RatePlanId",
                table: "CheckInMasters",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReferenceCompany",
                table: "CheckInMasters",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReservationMadeBy",
                table: "CheckInMasters",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReservationNotes",
                table: "CheckInMasters",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "CheckInMasters",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VIPStatus",
                table: "CheckInMasters",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BTCComments",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "BTCFolio",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "BtcId",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "CheckinNotes",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "ComingFrom",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Company",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Complimentary",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Discount",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "DropOff",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "DropStation",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "EnteredBy",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "FBCredits",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Folio1",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Folio2",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Folio3",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "GuestName2",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "GuestName3",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "InclusivePrivileges",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Industry",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Market",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Meals",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "NTN",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Newspaper",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "NoPost",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "PaymentAccount",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Pickup",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "PickupCarrier",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "PickupStation",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "PickupTime",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Purpose",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "RatePlanId",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "ReferenceCompany",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "ReservationMadeBy",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "ReservationNotes",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "CheckInMasters");

            migrationBuilder.DropColumn(
                name: "VIPStatus",
                table: "CheckInMasters");
        }
    }
}
