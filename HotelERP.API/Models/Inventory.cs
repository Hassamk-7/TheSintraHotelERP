using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class InventoryCategory : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public int? ParentCategoryId { get; set; }

        [ForeignKey("ParentCategoryId")]
        public virtual InventoryCategory ParentCategory { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        // Navigation properties
        public virtual ICollection<InventoryCategory> ChildCategories { get; set; } = new List<InventoryCategory>();
        public virtual ICollection<InventoryItem> Items { get; set; } = new List<InventoryItem>();
    }

    public class InventoryItem : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual InventoryCategory Category { get; set; }

        public int? SupplierId { get; set; }

        [ForeignKey("SupplierId")]
        public virtual Supplier Supplier { get; set; }

        [Required]
        [StringLength(50)]
        public string UnitOfMeasure { get; set; } // kg, ltr, pcs, etc.

        [Column(TypeName = "decimal(18,2)")]
        public decimal CostPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal SellingPrice { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal TaxRate { get; set; } = 0;

        [Column(TypeName = "decimal(18,3)")]
        public decimal StockQuantity { get; set; }

        [Column(TypeName = "decimal(18,3)")]
        public decimal ReorderLevel { get; set; }

        [Column(TypeName = "decimal(18,3)")]
        public decimal ReorderQuantity { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(255)]
        public string ImageUrl { get; set; }

        [StringLength(1000)]
        public string Notes { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        // Navigation properties
        public virtual ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
        public virtual ICollection<PurchaseItem> PurchaseItems { get; set; } = new List<PurchaseItem>();
    }

    public class StockMovement : BaseEntity
    {
        [Required]
        public int ItemId { get; set; }

        [ForeignKey("ItemId")]
        public virtual InventoryItem Item { get; set; }

        [Required]
        public DateTime MovementDate { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(50)]
        public string MovementType { get; set; } // IN, OUT, Purchase, Sale, Adjustment, etc.

        [Required]
        [Column(TypeName = "decimal(18,3)")]
        public decimal Quantity { get; set; }

        [StringLength(100)]
        public string ReferenceId { get; set; }

        [StringLength(100)]
        public string ReferenceType { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? UnitCost { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalCost { get; set; }

        [StringLength(1000)]
        public string Notes { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }
    }

    public class Supplier : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(100)]
        public string ContactPerson { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(50)]
        public string Phone { get; set; }

        [StringLength(50)]
        public string Mobile { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(50)]
        public string TaxNumber { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        // Navigation properties
        public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
        public virtual ICollection<InventoryItem> ItemsSupplied { get; set; } = new List<InventoryItem>();
    }

    public class Purchase : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string PurchaseNumber { get; set; }

        public int SupplierId { get; set; }

        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

        public DateTime? ExpectedDeliveryDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Draft, Ordered, Received, Partially Received, Cancelled

        [StringLength(100)]
        public string Reference { get; set; } // PO Number, Invoice Number, etc.

        [StringLength(500)]
        public string Notes { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        // Navigation properties
        public virtual Supplier Supplier { get; set; }
        public virtual ICollection<PurchaseItem> Items { get; set; }
    }

    public class PurchaseItem : BaseEntity
    {
        public int PurchaseId { get; set; }
        public int ItemId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public string Notes { get; set; }

        // Navigation properties
        public virtual Purchase Purchase { get; set; }
        public virtual InventoryItem Item { get; set; }
    }
}
