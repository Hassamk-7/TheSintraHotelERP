using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class DishDto : BaseDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(100)]
        public string Category { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [StringLength(255)]
        public string ImageUrl { get; set; }

        public bool IsAvailable { get; set; }

        [Range(0, 1000)]
        public int PreparationTime { get; set; }
    }

    public class DishCreateDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(100)]
        public string Category { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [StringLength(255)]
        public string ImageUrl { get; set; }

        public bool IsAvailable { get; set; } = true;

        [Range(0, 1000)]
        public int PreparationTime { get; set; } = 30;
    }

    public class RestaurantOrderDto : BaseDto
    {
        [StringLength(50)]
        public string OrderNumber { get; set; }

        public int? ReservationId { get; set; }
        public int? RoomId { get; set; }
        public int? TableId { get; set; }

        [StringLength(50)]
        public string OrderType { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryTime { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [Range(0, double.MaxValue)]
        public decimal SubTotal { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TaxAmount { get; set; }

        [Range(0, double.MaxValue)]
        public decimal DiscountAmount { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        // Navigation properties
        public virtual ICollection<RestaurantOrderedProductDto> OrderedProducts { get; set; } = new List<RestaurantOrderedProductDto>();
        public virtual ICollection<RestaurantBillingInfoDto> BillingInfos { get; set; } = new List<RestaurantBillingInfoDto>();
    }

    public class RestaurantOrderCreateDto
    {
        public int? ReservationId { get; set; }
        public int? RoomId { get; set; }
        public int? TableId { get; set; }

        [Required]
        [StringLength(50)]
        public string OrderType { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [Required]
        public List<RestaurantOrderedProductCreateDto> OrderedProducts { get; set; } = new List<RestaurantOrderedProductCreateDto>();
    }

    public class RestaurantOrderedProductDto : BaseDto
    {
        public int OrderId { get; set; }
        public int DishId { get; set; }
        public DishDto Dish { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string SpecialInstructions { get; set; }
        public string Status { get; set; }
    }

    public class RestaurantOrderedProductCreateDto
    {
        [Required]
        public int DishId { get; set; }

        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; } = 1;

        [StringLength(500)]
        public string SpecialInstructions { get; set; }
    }

    public class RestaurantBillingInfoDto : BaseDto
    {
        public int OrderId { get; set; }
        public string BillingNumber { get; set; }
        public DateTime BillingDate { get; set; }
        public string PaymentMethod { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
    }

    public class CreateDishDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }

    public class CreateRestaurantOrderDto
    {
        public int? RoomId { get; set; }

        public int? TableId { get; set; }

        [Required]
        [StringLength(50)]
        public string OrderType { get; set; } // Dine-in, Room Service, Takeaway

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }
    }
}
