using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelERP.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCancellationPolicyModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CancellationPolicies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HotelId = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsRefundable = table.Column<bool>(type: "bit", nullable: false),
                    FreeCancellationHours = table.Column<int>(type: "int", nullable: true),
                    PenaltyAfterDeadline = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PenaltyAppliesToDate = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NoShowPenalty = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    EarlyDeparturePenalty = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Timezone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    Source = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DisplayTextDefault = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    DisplayTextWebsite = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    DisplayTextBookingCom = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    DisplayTextExpedia = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    DisplayTextOTA = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    AppliesAllChannels = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CancellationPolicies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CancellationPolicies_Hotels_HotelId",
                        column: x => x.HotelId,
                        principalTable: "Hotels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CancellationPenaltyPostings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReservationId = table.Column<int>(type: "int", nullable: false),
                    CancellationPolicyId = table.Column<int>(type: "int", nullable: false),
                    PenaltyType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PenaltyAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PenaltyDescription = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CancelledAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FreeCancellationDeadline = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CancellationPenaltyPostings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CancellationPenaltyPostings_CancellationPolicies_CancellationPolicyId",
                        column: x => x.CancellationPolicyId,
                        principalTable: "CancellationPolicies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CancellationPenaltyPostings_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RatePlanCancellationPolicies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanId = table.Column<int>(type: "int", nullable: false),
                    CancellationPolicyId = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RatePlanCancellationPolicies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RatePlanCancellationPolicies_CancellationPolicies_CancellationPolicyId",
                        column: x => x.CancellationPolicyId,
                        principalTable: "CancellationPolicies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RatePlanCancellationPolicies_Plans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "Plans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CancellationPenaltyPostings_CancellationPolicyId",
                table: "CancellationPenaltyPostings",
                column: "CancellationPolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_CancellationPenaltyPostings_ReservationId",
                table: "CancellationPenaltyPostings",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_CancellationPolicies_HotelId",
                table: "CancellationPolicies",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_RatePlanCancellationPolicies_CancellationPolicyId",
                table: "RatePlanCancellationPolicies",
                column: "CancellationPolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_RatePlanCancellationPolicies_PlanId",
                table: "RatePlanCancellationPolicies",
                column: "PlanId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CancellationPenaltyPostings");

            migrationBuilder.DropTable(
                name: "RatePlanCancellationPolicies");

            migrationBuilder.DropTable(
                name: "CancellationPolicies");
        }
    }
}
