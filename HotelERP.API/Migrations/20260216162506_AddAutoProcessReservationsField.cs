using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAutoProcessReservationsField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AutoProcessReservations",
                table: "ChannelManagerSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutoProcessReservations",
                table: "ChannelManagerSettings");
        }
    }
}
