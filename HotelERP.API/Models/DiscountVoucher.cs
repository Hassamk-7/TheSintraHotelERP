using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class DiscountVoucher : BaseEntity
    {
        [StringLength(50)]
        public string VoucherCode { get; set; } // Auto-generated: VOUCH-2025-0001

        [Required]
        [StringLength(200)]
        public string VoucherName { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public int RoomTypeId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; }

        [StringLength(20)]
        public string DiscountType { get; set; } = "Fixed"; // Fixed, Percentage

        [Column(TypeName = "decimal(5,2)")]
        public decimal? DiscountPercentage { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MinimumAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaximumDiscount { get; set; }

        public int? MaxUsageCount { get; set; }

        public int UsedCount { get; set; } = 0;

        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Inactive, Expired

        [StringLength(100)]
        public string ApprovedBy { get; set; } // Owner/Director name

        [StringLength(500)]
        public string Terms { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        [ForeignKey("RoomTypeId")]
        public virtual RoomType RoomType { get; set; }
    }
}
