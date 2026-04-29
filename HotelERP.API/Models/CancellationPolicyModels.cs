using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    /// <summary>
    /// Cancellation Policy Master - Defines refund/penalty rules
    /// </summary>
    public class CancellationPolicy : BaseEntity
    {
        [Required]
        public int HotelId { get; set; }

        [Required]
        [StringLength(50)]
        public string Code { get; set; } // e.g., CAN48, NRF100, CORP72

        [Required]
        [StringLength(200)]
        public string Name { get; set; } // e.g., "Free cancel 48h", "Non-refundable"

        [StringLength(500)]
        public string Description { get; set; }

        // --- Structured Rules ---
        public bool IsRefundable { get; set; } = true;

        /// <summary>
        /// Free cancellation until X hours before arrival
        /// NULL = no free cancellation
        /// </summary>
        public int? FreeCancellationHours { get; set; }

        /// <summary>
        /// Penalty amount/percentage after free cancellation deadline
        /// e.g., "1 night", "100%", "50%"
        /// </summary>
        [StringLength(100)]
        public string PenaltyAfterDeadline { get; set; }

        /// <summary>
        /// When penalty applies: "Arrival date" or "Booking date"
        /// </summary>
        [StringLength(50)]
        public string PenaltyAppliesToDate { get; set; } = "Arrival date";

        /// <summary>
        /// No-show penalty (e.g., "1 night", "100%")
        /// </summary>
        [StringLength(100)]
        public string NoShowPenalty { get; set; }

        /// <summary>
        /// Early departure penalty (e.g., "1 night", "None")
        /// </summary>
        [StringLength(100)]
        public string EarlyDeparturePenalty { get; set; }

        /// <summary>
        /// Property timezone for deadline calculation
        /// </summary>
        [StringLength(50)]
        public string Timezone { get; set; } = "UTC";

        /// <summary>
        /// Priority for conflict resolution (higher wins)
        /// </summary>
        public int Priority { get; set; } = 0;

        /// <summary>
        /// Source: manual, system, channel
        /// </summary>
        [StringLength(50)]
        public string Source { get; set; } = "manual";

        /// <summary>
        /// Display text for different channels (optional)
        /// </summary>
        [StringLength(2000)]
        public string DisplayTextDefault { get; set; }

        [StringLength(2000)]
        public string DisplayTextWebsite { get; set; }

        [StringLength(2000)]
        public string DisplayTextBookingCom { get; set; }

        [StringLength(2000)]
        public string DisplayTextExpedia { get; set; }

        [StringLength(2000)]
        public string DisplayTextOTA { get; set; }

        /// <summary>
        /// Applies to all channels unless overridden
        /// </summary>
        public bool AppliesAllChannels { get; set; } = true;

        public bool IsActive { get; set; } = true;

        // Navigation properties
        [ForeignKey("HotelId")]
        public virtual Hotel Hotel { get; set; }

        public virtual ICollection<RatePlanCancellationPolicy> RatePlanPolicies { get; set; } = new List<RatePlanCancellationPolicy>();
    }

    /// <summary>
    /// Links Rate Plans to Cancellation Policies
    /// </summary>
    public class RatePlanCancellationPolicy : BaseEntity
    {
        [Required]
        public int PlanId { get; set; }

        [Required]
        public int CancellationPolicyId { get; set; }

        /// <summary>
        /// Priority if multiple policies apply
        /// </summary>
        public int Priority { get; set; } = 0;

        [ForeignKey("PlanId")]
        public virtual Plan Plan { get; set; }

        [ForeignKey("CancellationPolicyId")]
        public virtual CancellationPolicy CancellationPolicy { get; set; }
    }

    /// <summary>
    /// Cancellation/No-show penalty posting to folio
    /// </summary>
    public class CancellationPenaltyPosting : BaseEntity
    {
        [Required]
        public int ReservationId { get; set; }

        [Required]
        public int CancellationPolicyId { get; set; }

        [StringLength(50)]
        public string PenaltyType { get; set; } // Cancellation, NoShow, EarlyDeparture

        [Column(TypeName = "decimal(18,2)")]
        public decimal PenaltyAmount { get; set; }

        [StringLength(100)]
        public string PenaltyDescription { get; set; }

        public DateTime CancelledAt { get; set; }

        public DateTime? FreeCancellationDeadline { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Posted, Refunded, Settled

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation properties
        [ForeignKey("ReservationId")]
        public virtual Reservation Reservation { get; set; }

        [ForeignKey("CancellationPolicyId")]
        public virtual CancellationPolicy CancellationPolicy { get; set; }
    }
}
