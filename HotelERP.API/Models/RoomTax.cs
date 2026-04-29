using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    [Table("RoomTax")]
    public class RoomTax
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HotelId { get; set; }

        [Required]
        public int RoomTypeId { get; set; }

        [Required]
        [StringLength(100)]
        public string TaxName { get; set; }

        [Required]
        [StringLength(20)]
        public string TaxType { get; set; } // "Percentage" or "Amount"

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxValue { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string? CreatedBy { get; set; }

        [StringLength(100)]
        public string? UpdatedBy { get; set; }

        // Navigation Properties
        [ForeignKey("HotelId")]
        public virtual Hotel? Hotel { get; set; }

        [ForeignKey("RoomTypeId")]
        public virtual RoomType? RoomType { get; set; }
    }
}
