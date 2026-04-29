using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.Backend.Models.NightAudit
{
    [Table("NightAuditPayments")]
    public class NightAuditPayments
    {
        [Key]
        public int PaymentId { get; set; }

        public int? AuditId { get; set; }

        [Required]
        public DateTime BusinessDate { get; set; }

        public int? ReservationId { get; set; }

        public int? GuestId { get; set; }

        [StringLength(100)]
        public string? GuestName { get; set; }

        [StringLength(10)]
        public string? RoomNumber { get; set; }

        [Required]
        [StringLength(30)]
        public string PaymentMethod { get; set; } = string.Empty; // Cash, Credit Card, Bank Transfer, Online

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [StringLength(3)]
        public string CurrencyCode { get; set; } = "PKR";

        [StringLength(50)]
        public string? ReferenceNumber { get; set; }

        [StringLength(20)]
        public string? CardType { get; set; } // Visa, MasterCard, etc.

        [StringLength(100)]
        public string? ProcessedBy { get; set; }

        public DateTime ProcessedTime { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string Status { get; set; } = "Completed"; // Completed, Pending, Failed, Refunded

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation Properties
        [ForeignKey("AuditId")]
        public virtual NightAuditLog? NightAuditLog { get; set; }
    }
}
