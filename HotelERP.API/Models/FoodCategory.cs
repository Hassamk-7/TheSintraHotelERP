using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class FoodCategory : BaseEntity
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
        public string Type { get; set; } // Appetizer, Main Course, Dessert, Beverage, etc.

        public bool IsVegetarian { get; set; }

        public bool IsHalal { get; set; }

        [StringLength(100)]
        public string Cuisine { get; set; } // Pakistani, Chinese, Continental, etc.

        public int DisplayOrder { get; set; }

        [StringLength(7)]
        public string ColorCode { get; set; } // Hex color for UI display

        [StringLength(200)]
        public string ImagePath { get; set; }
    }

    public class MenuCategoryMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public int DisplayOrder { get; set; }
    }

    public class MenuCuisineMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public int DisplayOrder { get; set; }
    }
}
