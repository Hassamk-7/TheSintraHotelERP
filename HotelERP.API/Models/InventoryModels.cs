using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class StockManagement : BaseEntity
    {
        [Required]
        public int ItemId { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }

        [StringLength(50)]
        public string TransactionType { get; set; } // Purchase, Issue, Return, Transfer, Adjustment

        public decimal Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalValue { get; set; }

        public decimal StockBalance { get; set; }

        [StringLength(50)]
        public string Reference { get; set; }

        [StringLength(100)]
        public string Department { get; set; }

        [StringLength(100)]
        public string IssuedTo { get; set; }

        [StringLength(100)]
        public string PostedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual ItemMaster Item { get; set; }
    }

    public class PurchaseOrder : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string PONumber { get; set; }

        [Required]
        public int SupplierId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        public DateTime? ExpectedDeliveryDate { get; set; }

        public DateTime? ActualDeliveryDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Draft, Sent, Partial, Received, Cancelled

        public decimal SubTotal { get; set; }

        public decimal TaxAmount { get; set; }

        public decimal TotalAmount { get; set; }

        [StringLength(100)]
        public string OrderedBy { get; set; }

        [StringLength(100)]
        public string ApprovedBy { get; set; }

        public DateTime? ApprovalDate { get; set; }

        [StringLength(500)]
        public string Terms { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual Supplier Supplier { get; set; }
        public virtual ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    }

    public class PurchaseOrderItem : BaseEntity
    {
        [Required]
        public int PurchaseOrderId { get; set; }

        [Required]
        public int ItemId { get; set; }

        [Required]
        public decimal Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        public decimal ReceivedQuantity { get; set; }

        public decimal PendingQuantity { get; set; }

        [StringLength(500)]
        public string Specifications { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual PurchaseOrder PurchaseOrder { get; set; }
        public virtual ItemMaster Item { get; set; }
    }

    public class StockAlert : BaseEntity
    {
        [Required]
        public int ItemId { get; set; }

        [Required]
        [StringLength(50)]
        public string AlertType { get; set; } // Low Stock, Out of Stock, Expiry Alert

        [Required]
        public DateTime AlertDate { get; set; }

        public decimal CurrentStock { get; set; }

        public decimal MinimumLevel { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Active, Resolved, Ignored

        [StringLength(100)]
        public string AlertedTo { get; set; }

        public DateTime? ResolvedDate { get; set; }

        [StringLength(100)]
        public string ResolvedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual ItemMaster Item { get; set; }
    }

    public class InventoryReport : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string ReportName { get; set; }

        [Required]
        [StringLength(50)]
        public string ReportType { get; set; } // Stock Summary, Movement, Valuation, Expiry

        [Required]
        public DateTime ReportDate { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [StringLength(100)]
        public string GeneratedBy { get; set; }

        [StringLength(200)]
        public string FilePath { get; set; }

        [StringLength(500)]
        public string Parameters { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }
    }
}
