using System;
using System.Collections.Generic;

namespace HotelERP.API.DTOs
{
    // --- Cancellation Policy DTOs ---
    public class CancellationPolicyDto
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsRefundable { get; set; }
        public int? FreeCancellationHours { get; set; }
        public string PenaltyAfterDeadline { get; set; }
        public string PenaltyAppliesToDate { get; set; }
        public string NoShowPenalty { get; set; }
        public string EarlyDeparturePenalty { get; set; }
        public string Timezone { get; set; }
        public int Priority { get; set; }
        public string Source { get; set; }
        public string DisplayTextDefault { get; set; }
        public string DisplayTextWebsite { get; set; }
        public string DisplayTextBookingCom { get; set; }
        public string DisplayTextExpedia { get; set; }
        public string DisplayTextOTA { get; set; }
        public bool AppliesAllChannels { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CancellationPolicyCreateDto
    {
        public int HotelId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsRefundable { get; set; } = true;
        public int? FreeCancellationHours { get; set; }
        public string PenaltyAfterDeadline { get; set; }
        public string PenaltyAppliesToDate { get; set; } = "Arrival date";
        public string NoShowPenalty { get; set; }
        public string EarlyDeparturePenalty { get; set; }
        public string Timezone { get; set; } = "UTC";
        public int Priority { get; set; } = 0;
        public string Source { get; set; } = "manual";
        public string DisplayTextDefault { get; set; }
        public string DisplayTextWebsite { get; set; }
        public string DisplayTextBookingCom { get; set; }
        public string DisplayTextExpedia { get; set; }
        public string DisplayTextOTA { get; set; }
        public bool AppliesAllChannels { get; set; } = true;
    }

    public class CancellationPolicyUpdateDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsRefundable { get; set; }
        public int? FreeCancellationHours { get; set; }
        public string PenaltyAfterDeadline { get; set; }
        public string PenaltyAppliesToDate { get; set; }
        public string NoShowPenalty { get; set; }
        public string EarlyDeparturePenalty { get; set; }
        public string Timezone { get; set; }
        public int Priority { get; set; }
        public string DisplayTextDefault { get; set; }
        public string DisplayTextWebsite { get; set; }
        public string DisplayTextBookingCom { get; set; }
        public string DisplayTextExpedia { get; set; }
        public string DisplayTextOTA { get; set; }
        public bool AppliesAllChannels { get; set; }
        public bool IsActive { get; set; }
    }

    public class CancellationPolicyListDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public bool IsRefundable { get; set; }
        public string FreeCancelText { get; set; } // "48h", "72h", "Free", etc.
        public string PenaltyText { get; set; } // "1 night", "100%", etc.
        public string NoShowText { get; set; }
        public string EarlyDepText { get; set; }
        public string UsedByRatePlans { get; set; } // Comma-separated rate plan names
        public bool IsActive { get; set; }
        public string Status { get; set; } // Active, Inactive
    }

    // --- Rate Plan Cancellation Policy Link ---
    public class RatePlanCancellationPolicyDto
    {
        public int Id { get; set; }
        public int PlanId { get; set; }
        public int CancellationPolicyId { get; set; }
        public string PolicyCode { get; set; }
        public string PolicyName { get; set; }
        public int Priority { get; set; }
    }

    public class RatePlanCancellationPolicyCreateDto
    {
        public int PlanId { get; set; }
        public int CancellationPolicyId { get; set; }
        public int Priority { get; set; } = 0;
    }

    // --- Cancellation Penalty Posting ---
    public class CancellationPenaltyPostingDto
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        public int CancellationPolicyId { get; set; }
        public string PenaltyType { get; set; }
        public decimal PenaltyAmount { get; set; }
        public string PenaltyDescription { get; set; }
        public DateTime CancelledAt { get; set; }
        public DateTime? FreeCancellationDeadline { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
    }

    public class CancellationPenaltyPostingCreateDto
    {
        public int ReservationId { get; set; }
        public int CancellationPolicyId { get; set; }
        public string PenaltyType { get; set; }
        public decimal PenaltyAmount { get; set; }
        public string PenaltyDescription { get; set; }
        public DateTime? FreeCancellationDeadline { get; set; }
        public string Notes { get; set; }
    }

    // --- Policy Evaluation Result ---
    public class PolicyEvaluationResultDto
    {
        public int PolicyId { get; set; }
        public string PolicyCode { get; set; }
        public string PolicyName { get; set; }
        public bool IsRefundable { get; set; }
        public DateTime? FreeCancellationDeadline { get; set; }
        public bool IsWithinFreeCancellation { get; set; }
        public decimal PenaltyAmount { get; set; }
        public string PenaltyType { get; set; }
        public string PenaltyDescription { get; set; }
        public string EvaluationMessage { get; set; }
    }
}
