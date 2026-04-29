using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class Expense : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        public int ExpenseTypeId { get; set; }

        [ForeignKey("ExpenseTypeId")]
        public virtual ExpenseType ExpenseType { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime ExpenseDate { get; set; }

        [StringLength(50)]
        public string PaymentMethod { get; set; } // Cash, Credit Card, Bank Transfer, etc.

        [StringLength(100)]
        public string ReferenceNumber { get; set; }

        [StringLength(200)]
        public string VendorName { get; set; }

        [StringLength(500)]
        public string VendorAddress { get; set; }

        [StringLength(20)]
        public string VendorPhone { get; set; }

        [StringLength(100)]
        public string VendorEmail { get; set; }

        [StringLength(50)]
        public string InvoiceNumber { get; set; }

        [DataType(DataType.Date)]
        public DateTime? InvoiceDate { get; set; }

        [StringLength(255)]
        public string AttachmentPath { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Paid, Rejected

        [StringLength(1000)]
        public string Notes { get; set; }

        [StringLength(50)]
        public string ApprovedBy { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? ApprovalDate { get; set; }

        [StringLength(50)]
        public string PaidBy { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? PaymentDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TaxAmount { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? TaxRate { get; set; }

        [StringLength(50)]
        public string Category { get; set; } // Operating, Capital, etc.

        public bool IsRecurring { get; set; } = false;

        [StringLength(50)]
        public string RecurrencePattern { get; set; } // Monthly, Quarterly, Yearly

        public int? RecurrenceInterval { get; set; }

        [DataType(DataType.Date)]
        public DateTime? NextRecurrenceDate { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }
    }

    public class ExpenseType : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(50)]
        public string Category { get; set; } // Operating, Administrative, Marketing, etc.

        public bool IsTaxDeductible { get; set; } = true;

        [StringLength(100)]
        public string AccountCode { get; set; } // For accounting integration

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        // Navigation property
        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
