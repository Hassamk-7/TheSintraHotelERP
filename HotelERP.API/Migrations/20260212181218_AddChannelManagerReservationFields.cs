using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddChannelManagerReservationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExternalBookingId",
                table: "ChannelManagerReservations",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExternalRateName",
                table: "ChannelManagerReservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LeaderName",
                table: "ChannelManagerReservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SyncType",
                table: "ChannelManagerReservations",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TravelAgentName",
                table: "ChannelManagerReservations",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExternalBookingId",
                table: "ChannelManagerReservations");

            migrationBuilder.DropColumn(
                name: "ExternalRateName",
                table: "ChannelManagerReservations");

            migrationBuilder.DropColumn(
                name: "LeaderName",
                table: "ChannelManagerReservations");

            migrationBuilder.DropColumn(
                name: "SyncType",
                table: "ChannelManagerReservations");

            migrationBuilder.DropColumn(
                name: "TravelAgentName",
                table: "ChannelManagerReservations");
        }
    }
}
