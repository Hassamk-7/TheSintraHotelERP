using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class ItemMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string Category { get; set; }

        [StringLength(50)]
        public string Unit { get; set; }

        public decimal PurchasePrice { get; set; }

        public decimal SalePrice { get; set; }

        public int MinStockLevel { get; set; }

        public int MaxStockLevel { get; set; }

        public int CurrentStock { get; set; }

        [StringLength(100)]
        public string Supplier { get; set; }

        [StringLength(50)]
        public string Brand { get; set; }

        public bool IsPerishable { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [StringLength(200)]
        public string StorageLocation { get; set; }
    }
}
