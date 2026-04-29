using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddChannelManagerTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChannelManagerSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Provider = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BaseUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SendReservationUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    HotelListUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    HotelInfoUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HotelCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ChannelId = table.Column<int>(type: "int", nullable: false),
                    IsProduction = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    AutoSyncAvailability = table.Column<bool>(type: "bit", nullable: false),
                    AutoPullReservations = table.Column<bool>(type: "bit", nullable: false),
                    SyncIntervalMinutes = table.Column<int>(type: "int", nullable: false),
                    LastAvailabilitySync = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastReservationSync = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastRateSync = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelManagerSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ChannelManagerLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChannelManagerSettingId = table.Column<int>(type: "int", nullable: true),
                    Action = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Direction = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    RequestPayload = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResponsePayload = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ErrorMessage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    HttpStatusCode = table.Column<int>(type: "int", nullable: true),
                    DurationMs = table.Column<long>(type: "bigint", nullable: true),
                    ExternalReservationId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ExternalRoomId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelManagerLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChannelManagerLogs_ChannelManagerSettings_ChannelManagerSettingId",
                        column: x => x.ChannelManagerSettingId,
                        principalTable: "ChannelManagerSettings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ChannelManagerReservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChannelManagerSettingId = table.Column<int>(type: "int", nullable: false),
                    ExternalReservationId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ExternalStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LocalReservationId = table.Column<int>(type: "int", nullable: true),
                    GuestFirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    GuestLastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    GuestEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    GuestPhone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    GuestCountryCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    ExternalRoomId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ExternalRoomName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ExternalRateId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CheckInDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CheckOutDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Adults = table.Column<int>(type: "int", nullable: false),
                    Children = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CurrencyCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    PaymentType = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    RawPayload = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsMarkedAsSent = table.Column<bool>(type: "bit", nullable: false),
                    IsProcessed = table.Column<bool>(type: "bit", nullable: false),
                    ProcessingNotes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ReceivedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelManagerReservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChannelManagerReservations_ChannelManagerSettings_ChannelManagerSettingId",
                        column: x => x.ChannelManagerSettingId,
                        principalTable: "ChannelManagerSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChannelManagerReservations_Reservations_LocalReservationId",
                        column: x => x.LocalReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ChannelManagerRoomMappings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChannelManagerSettingId = table.Column<int>(type: "int", nullable: false),
                    LocalRoomTypeId = table.Column<int>(type: "int", nullable: false),
                    ExternalRoomId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ExternalRoomName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelManagerRoomMappings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChannelManagerRoomMappings_ChannelManagerSettings_ChannelManagerSettingId",
                        column: x => x.ChannelManagerSettingId,
                        principalTable: "ChannelManagerSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChannelManagerRoomMappings_RoomTypes_LocalRoomTypeId",
                        column: x => x.LocalRoomTypeId,
                        principalTable: "RoomTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChannelManagerRateMappings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChannelManagerSettingId = table.Column<int>(type: "int", nullable: false),
                    LocalRoomRateId = table.Column<int>(type: "int", nullable: true),
                    ChannelManagerRoomMappingId = table.Column<int>(type: "int", nullable: false),
                    ExternalRateId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ExternalRateName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CurrencyCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelManagerRateMappings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChannelManagerRateMappings_ChannelManagerRoomMappings_ChannelManagerRoomMappingId",
                        column: x => x.ChannelManagerRoomMappingId,
                        principalTable: "ChannelManagerRoomMappings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChannelManagerRateMappings_ChannelManagerSettings_ChannelManagerSettingId",
                        column: x => x.ChannelManagerSettingId,
                        principalTable: "ChannelManagerSettings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChannelManagerLogs_ChannelManagerSettingId",
                table: "ChannelManagerLogs",
                column: "ChannelManagerSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelManagerRateMappings_ChannelManagerRoomMappingId",
                table: "ChannelManagerRateMappings",
                column: "ChannelManagerRoomMappingId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelManagerRateMappings_ChannelManagerSettingId",
                table: "ChannelManagerRateMappings",
                column: "ChannelManagerSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelManagerReservations_ChannelManagerSettingId",
                table: "ChannelManagerReservations",
                column: "ChannelManagerSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelManagerReservations_LocalReservationId",
                table: "ChannelManagerReservations",
                column: "LocalReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelManagerRoomMappings_ChannelManagerSettingId",
                table: "ChannelManagerRoomMappings",
                column: "ChannelManagerSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelManagerRoomMappings_LocalRoomTypeId",
                table: "ChannelManagerRoomMappings",
                column: "LocalRoomTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChannelManagerLogs");

            migrationBuilder.DropTable(
                name: "ChannelManagerRateMappings");

            migrationBuilder.DropTable(
                name: "ChannelManagerReservations");

            migrationBuilder.DropTable(
                name: "ChannelManagerRoomMappings");

            migrationBuilder.DropTable(
                name: "ChannelManagerSettings");
        }
    }
}
