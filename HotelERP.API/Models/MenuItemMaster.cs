using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class MenuItemMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public decimal Price { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }

        [StringLength(50)]
        public string Category { get; set; }

        [StringLength(50)]
        public string Cuisine { get; set; }

        public bool IsVegetarian { get; set; }

        public bool IsHalal { get; set; }

        public bool IsSpicy { get; set; }

        [StringLength(500)]
        public string Ingredients { get; set; }

        public int PreparationTime { get; set; }

        public bool IsAvailable { get; set; }
    }

    public class DrinksCategory : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }

        [StringLength(50)]
        public string CategoryType { get; set; }

        public bool IsAlcoholic { get; set; }

        public bool IsHot { get; set; }

        [StringLength(7)]
        public string ColorCode { get; set; }

        public int DisplayOrder { get; set; }
    }

    public class LaundryMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string ServiceName { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public decimal Price { get; set; }

        [StringLength(50)]
        public string ServiceType { get; set; }

        [StringLength(50)]
        public string Unit { get; set; }

        public int ProcessingHours { get; set; }

        public bool IsExpressService { get; set; }

        public decimal ExpressCharge { get; set; }

        public bool IsAvailable { get; set; }
    }

    public class DrinksQuantity : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public decimal Volume { get; set; }

        [StringLength(20)]
        public string Unit { get; set; }

        public bool IsStandard { get; set; }

        public int DisplayOrder { get; set; }
    }

    public class DrinksMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public decimal Price { get; set; }

        [StringLength(50)]
        public string Category { get; set; }

        public bool IsAlcoholic { get; set; }

        public decimal AlcoholContent { get; set; }

        [StringLength(100)]
        public string Brand { get; set; }

        [StringLength(500)]
        public string Ingredients { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }

        public bool IsAvailable { get; set; }
    }
}
