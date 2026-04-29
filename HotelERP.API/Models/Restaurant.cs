using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class Dish : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        public int CategoryId { get; set; }
        
        [ForeignKey("CategoryId")]
        public virtual DishCategory Category { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [StringLength(255)]
        public string ImageUrl { get; set; }

        [StringLength(50)]
        public string DietaryInfo { get; set; } // Vegetarian, Vegan, Gluten-Free, etc.

        public bool IsAvailable { get; set; } = true;

        public int PreparationTime { get; set; } // in minutes

        [Range(0, 1000)]
        public int Calories { get; set; }

        [StringLength(1000)]
        public string Ingredients { get; set; }

        [StringLength(1000)]
        public string Allergens { get; set; }

        [StringLength(50)]
        public string SpiceLevel { get; set; } // Mild, Medium, Hot, etc.

        // Navigation properties
        public virtual ICollection<RestaurantOrderedProduct> OrderedProducts { get; set; } = new List<RestaurantOrderedProduct>();
    }

    public class RestaurantOrder : BaseEntity
    {
        public int? HotelId { get; set; }

        [StringLength(50)]
        public string OrderNumber { get; set; }

        public int? ReservationId { get; set; }

        public int? RestaurantReservationId { get; set; }

        public int? CheckInId { get; set; }

        public int? GuestId { get; set; }

        [StringLength(200)]
        public string GuestName { get; set; }

        public int? RoomId { get; set; }

        public int? TableId { get; set; }

        [StringLength(50)]
        public string OrderType { get; set; } // Dine-in, Room Service, Takeaway, Delivery

        [StringLength(50)]
        public string Status { get; set; } // Pending, In Progress, Ready, Served, Cancelled

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public DateTime? DeliveryTime { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ServiceCharge { get; set; }

        [StringLength(50)]
        public string PaymentStatus { get; set; } // Pending, Paid, Partial, Cancelled

        // Navigation properties
        public virtual Reservation Reservation { get; set; }
        public virtual Guest Guest { get; set; }
        public virtual CheckInMaster CheckIn { get; set; }
        public virtual Room Room { get; set; }
        public virtual RestaurantTable Table { get; set; }
        public virtual ICollection<RestaurantOrderedProduct> OrderedProducts { get; set; }
        public virtual ICollection<RestaurantBillingInfo> BillingInfos { get; set; }
    }

    public class RestaurantOrderedProduct : BaseEntity
    {
        public int OrderId { get; set; }
        public int DishId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string SpecialInstructions { get; set; }
        public string Status { get; set; } // Pending, In Progress, Ready, Served, Cancelled

        // Navigation properties
        public virtual RestaurantOrder Order { get; set; }
        public virtual Dish Dish { get; set; }
    }

    public class RestaurantBillingInfo : BaseEntity
    {
        public int OrderId { get; set; }
        public string BillingNumber { get; set; }
        public DateTime BillingDate { get; set; } = DateTime.UtcNow;
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } // Pending, Paid, Refunded, Partially Refunded
        public string Notes { get; set; }

        // Navigation property
        public virtual RestaurantOrder Order { get; set; }
    }

    public class RestaurantTable : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string TableNumber { get; set; }

        public int SeatingCapacity { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Available, Occupied, Reserved, Maintenance

        [StringLength(100)]
        public string Location { get; set; } // Floor, Section, etc.

        // Navigation property
        public virtual ICollection<RestaurantOrder> Orders { get; set; }
    }
}
