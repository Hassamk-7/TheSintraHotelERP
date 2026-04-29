using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.Backend.Models.NightAudit
{
    [Table("NightAuditRevenueSummary")]
    public class NightAuditRevenueSummary
    {
        [Key]
        public int SummaryId { get; set; }

        [Required]
        public int AuditId { get; set; }

        [Required]
        public DateTime BusinessDate { get; set; }

        [Required]
        [StringLength(20)]
        public string DepartmentCode { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string DepartmentName { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal GrossRevenue { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ServiceCharge { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal NetRevenue { get; set; } = 0;

        public int TransactionCount { get; set; } = 0;

        [Column(TypeName = "decimal(5,2)")]
        public decimal Percentage { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation Properties
        [ForeignKey("AuditId")]
        public virtual NightAuditLog NightAuditLog { get; set; } = null!;
    }
}
