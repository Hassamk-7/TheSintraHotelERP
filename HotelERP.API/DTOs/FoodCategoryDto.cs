using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class CreateFoodCategoryDto
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
        public string Type { get; set; }

        public bool IsVegetarian { get; set; }

        public bool IsHalal { get; set; }

        [StringLength(100)]
        public string Cuisine { get; set; }

        public int DisplayOrder { get; set; }

        [StringLength(7)]
        public string ColorCode { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }
    }

    public class UpdateFoodCategoryDto : CreateFoodCategoryDto
    {
    }

    public class FoodCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public bool IsVegetarian { get; set; }
        public bool IsHalal { get; set; }
        public string Cuisine { get; set; }
        public int DisplayOrder { get; set; }
        public string ColorCode { get; set; }
        public string ImagePath { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
