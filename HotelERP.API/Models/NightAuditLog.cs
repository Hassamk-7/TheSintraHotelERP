using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    [Table("NightAuditLog")]
    public class NightAuditLog
    {
        [Key]
        public int AuditId { get; set; }

        [Required]
        public DateTime BusinessDate { get; set; }

        public DateTime? AuditStartTime { get; set; }

        public DateTime? AuditEndTime { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalCharges { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPayments { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal VarianceAmount { get; set; } = 0;

        public int RoomCount { get; set; } = 0;

        public int OccupiedRooms { get; set; } = 0;

        [Column(TypeName = "decimal(5,2)")]
        public decimal OccupancyPercentage { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ADR { get; set; } = 0; // Average Daily Rate

        [Column(TypeName = "decimal(18,2)")]
        public decimal RevPAR { get; set; } = 0; // Revenue Per Available Room

        [Column(TypeName = "decimal(18,2)")]
        public decimal RoomRevenue { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ExtraRevenue { get; set; } = 0;

        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Running, Completed, Failed

        [StringLength(100)]
        public string? CompletedBy { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Navigation Properties
        public virtual ICollection<NightAuditCharges> Charges { get; set; } = new List<NightAuditCharges>();
        public virtual ICollection<NightAuditPayments> Payments { get; set; } = new List<NightAuditPayments>();
        public virtual ICollection<NightAuditRoomStatus> RoomStatuses { get; set; } = new List<NightAuditRoomStatus>();
        public virtual ICollection<NightAuditVariances> Variances { get; set; } = new List<NightAuditVariances>();
        public virtual ICollection<NightAuditRevenueSummary> RevenueSummaries { get; set; } = new List<NightAuditRevenueSummary>();
    }
}
