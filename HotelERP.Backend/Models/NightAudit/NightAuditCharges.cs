using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.Backend.Models.NightAudit
{
    [Table("NightAuditCharges")]
    public class NightAuditCharges
    {
        [Key]
        public int ChargeId { get; set; }

        public int? AuditId { get; set; }

        [Required]
        public DateTime BusinessDate { get; set; }

        public int? ReservationId { get; set; }

        public int? GuestId { get; set; }

        [StringLength(10)]
        public string? RoomNumber { get; set; }

        [StringLength(100)]
        public string? GuestName { get; set; }

        [Required]
        [StringLength(50)]
        public string ChargeType { get; set; } = string.Empty; // Room, Restaurant, Spa, Laundry, etc.

        [Required]
        [StringLength(255)]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ServiceCharge { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [StringLength(20)]
        public string? DepartmentCode { get; set; }

        [StringLength(50)]
        public string? DepartmentName { get; set; }

        [StringLength(100)]
        public string? PostedBy { get; set; }

        public DateTime PostedTime { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string Status { get; set; } = "Posted"; // Posted, Pending, Reversed

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation Properties
        [ForeignKey("AuditId")]
        public virtual NightAuditLog? NightAuditLog { get; set; }
    }
}
