using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.Backend.Models.NightAudit
{
    [Table("NightAuditVariances")]
    public class NightAuditVariances
    {
        [Key]
        public int VarianceId { get; set; }

        [Required]
        public int AuditId { get; set; }

        [Required]
        public DateTime BusinessDate { get; set; }

        [Required]
        [StringLength(50)]
        public string VarianceType { get; set; } = string.Empty; // Payment, Charge, Room Status, System

        [Required]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; } = 0;

        [StringLength(20)]
        public string Severity { get; set; } = "Medium"; // Low, Medium, High, Critical

        [StringLength(100)]
        public string? ResolvedBy { get; set; }

        public string? ResolutionNotes { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Open"; // Open, Resolved, Escalated, Closed

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? ResolvedAt { get; set; }

        // Navigation Properties
        [ForeignKey("AuditId")]
        public virtual NightAuditLog NightAuditLog { get; set; } = null!;
    }
}
