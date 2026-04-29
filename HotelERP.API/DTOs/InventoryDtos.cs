using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class InventoryItemDto : BaseDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(100)]
        public string Category { get; set; }

        [StringLength(50)]
        public string Unit { get; set; }

        [Range(0, double.MaxValue)]
        public decimal CurrentStock { get; set; }

        [Range(0, double.MaxValue)]
        public decimal MinimumStockLevel { get; set; }

        [Range(0, double.MaxValue)]
        public decimal ReorderLevel { get; set; }

        [StringLength(500)]
        public string Description { get; set; }
    }

    public class InventoryItemCreateDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(100)]
        public string Category { get; set; }

        [Required]
        [StringLength(50)]
        public string Unit { get; set; }

        [Range(0, double.MaxValue)]
        public decimal CurrentStock { get; set; } = 0;

        [Range(0, double.MaxValue)]
        public decimal MinimumStockLevel { get; set; } = 5;

        [Range(0, double.MaxValue)]
        public decimal ReorderLevel { get; set; } = 10;

        [StringLength(500)]
        public string Description { get; set; }
    }

    public class StockMovementDto : BaseDto
    {
        public int ItemId { get; set; }
        public DateTime MovementDate { get; set; }
        public string MovementType { get; set; }
        public string Reference { get; set; }
        public string ReferenceId { get; set; }
        public decimal Quantity { get; set; }
        public decimal? UnitCost { get; set; }
        public decimal? TotalCost { get; set; }
        public string Notes { get; set; }
    }

    public class SupplierDto : BaseDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(100)]
        public string ContactPerson { get; set; }

        [StringLength(100)]
        [EmailAddress]
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
    }

    public class PurchaseDto : BaseDto
    {
        [Required]
        [StringLength(50)]
        public string PurchaseNumber { get; set; }

        public int SupplierId { get; set; }
        public SupplierDto Supplier { get; set; }

        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
        public DateTime? ExpectedDeliveryDate { get; set; }
        public DateTime? DeliveryDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        [StringLength(100)]
        public string Reference { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        [Range(0, double.MaxValue)]
        public decimal SubTotal { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TaxAmount { get; set; }

        [Range(0, double.MaxValue)]
        public decimal DiscountAmount { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        // Navigation property
        public virtual ICollection<PurchaseItemDto> Items { get; set; } = new List<PurchaseItemDto>();
    }

    public class PurchaseItemDto : BaseDto
    {
        public int PurchaseId { get; set; }
        public int ItemId { get; set; }
        public InventoryItemDto Item { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public string Notes { get; set; }
    }
}
