using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class MenuManagement : BaseEntity
    {
        public int? HotelId { get; set; }

        [Required]
        [StringLength(100)]
        public string MenuName { get; set; }

        [Required]
        [StringLength(20)]
        public string MenuCode { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string MenuType { get; set; } // Breakfast, Lunch, Dinner, Beverages

        [StringLength(50)]
        public string Category { get; set; }

        public decimal Price { get; set; }

        public decimal CostPrice { get; set; }

        [StringLength(50)]
        public string Cuisine { get; set; }

        public bool IsVegetarian { get; set; }

        public bool IsHalal { get; set; }

        public bool IsSpicy { get; set; }

        [StringLength(500)]
        public string Ingredients { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }

        public int PreparationTime { get; set; }

        public bool IsAvailable { get; set; }

        public int DisplayOrder { get; set; }

        [StringLength(100)]
        public string ChefSpecial { get; set; }
    }

    // RestaurantOrder class is defined in Restaurant.cs to avoid duplication

    public class OrderItem : BaseEntity
    {
        [Required]
        public int OrderId { get; set; }
        public int? MenuItemId { get; set; }

        public int? BarItemId { get; set; }

        public int? DrinksPricingId { get; set; }

        [Required]
        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Ordered, Preparing, Ready, Served

        // Navigation properties
        public virtual RestaurantOrder Order { get; set; }
        public virtual MenuItem MenuItem { get; set; }
        public virtual BarManagement BarItem { get; set; }
    }

    public class TableManagement : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string TableNumber { get; set; }

        [Required]
        [StringLength(20)]
        public string TableCode { get; set; }

        public int Capacity { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string TableType { get; set; } // Regular, VIP, Outdoor

        [StringLength(50)]
        public string Status { get; set; } // Available, Occupied, Reserved, Cleaning

        public bool IsReservable { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public DateTime? ReservedFrom { get; set; }

        public DateTime? ReservedTo { get; set; }

        [StringLength(100)]
        public string ReservedBy { get; set; }
    }

    public class RestaurantTableReservation : BaseEntity
    {
        public int? HotelId { get; set; }

        [Required]
        public int TableId { get; set; }

        public int? GuestId { get; set; }

        public int? CheckInId { get; set; }

        [Required]
        [StringLength(200)]
        public string GuestName { get; set; }

        [Required]
        [StringLength(50)]
        public string GuestPhone { get; set; }

        [StringLength(100)]
        public string GuestEmail { get; set; }

        [StringLength(50)]
        public string RoomNumber { get; set; }

        [Required]
        public DateTime ReservationDateTime { get; set; }

        public int NumberOfGuests { get; set; }

        public int DurationHours { get; set; } = 2;

        [StringLength(50)]
        public string Status { get; set; } = "Confirmed";

        public decimal AdvanceAmount { get; set; }

        [StringLength(500)]
        public string SpecialRequests { get; set; }

        public bool IsCancelled { get; set; }

        // Navigation
        public virtual TableMaster Table { get; set; }
        public virtual Guest Guest { get; set; }
        public virtual CheckInMaster CheckIn { get; set; }
    }

    public class KitchenDisplay : BaseEntity
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        public int OrderItemId { get; set; }

        [Required]
        [StringLength(100)]
        public string ItemName { get; set; }

        [Required]
        public int Quantity { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [StringLength(50)]
        public string Priority { get; set; } // Normal, High, Urgent

        [StringLength(50)]
        public string Status { get; set; } // Pending, Preparing, Ready

        public DateTime OrderTime { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? CompletionTime { get; set; }

        [StringLength(100)]
        public string AssignedChef { get; set; }

        [StringLength(50)]
        public string KitchenSection { get; set; }

        // Navigation properties
        public virtual RestaurantOrder Order { get; set; }
        public virtual OrderItem OrderItem { get; set; }
    }

    public class BarManagement : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string DrinkName { get; set; }

        [Required]
        [StringLength(20)]
        public string DrinkCode { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string Category { get; set; } // Beer, Wine, Spirits, Cocktails, Mocktails

        public decimal Price { get; set; }

        public decimal CostPrice { get; set; }

        public bool IsAlcoholic { get; set; }

        public decimal AlcoholContent { get; set; }

        [StringLength(100)]
        public string Brand { get; set; }

        [StringLength(500)]
        public string Ingredients { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }

        public bool IsAvailable { get; set; }

        public int DisplayOrder { get; set; }

        [StringLength(50)]
        public string ServingSize { get; set; }

        public bool IsHappyHourItem { get; set; }

        public decimal HappyHourPrice { get; set; }
    }

    public class RoomService : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string ServiceNumber { get; set; }

        [Required]
        public int RoomId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public DateTime RequestTime { get; set; }

        public DateTime? DeliveryTime { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Requested, Preparing, On Way, Delivered

        public decimal DeliveryCharge { get; set; }

        [StringLength(100)]
        public string DeliveredBy { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        public int Rating { get; set; }

        [StringLength(500)]
        public string Feedback { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
        public virtual RestaurantOrder Order { get; set; }
    }
}
