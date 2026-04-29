using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.Backend.Models.NightAudit
{
    [Table("NightAuditRoomStatus")]
    public class NightAuditRoomStatus
    {
        [Key]
        public int StatusId { get; set; }

        public int? AuditId { get; set; }

        [Required]
        public DateTime BusinessDate { get; set; }

        [Required]
        [StringLength(10)]
        public string RoomNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string RoomType { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty; // Occupied, Vacant, OOO, Dirty, Maintenance

        public int GuestCount { get; set; } = 0;

        [StringLength(100)]
        public string? GuestName { get; set; }

        public DateTime? CheckInDate { get; set; }

        public DateTime? CheckOutDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal RateAmount { get; set; } = 0;

        public DateTime LastUpdated { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string? UpdatedBy { get; set; }

        // Navigation Properties
        [ForeignKey("AuditId")]
        public virtual NightAuditLog? NightAuditLog { get; set; }
    }
}
