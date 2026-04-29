using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class RoomRates : BaseEntity
    {
        [Required]
        public int RoomTypeId { get; set; }

        [Required]
        [StringLength(50)]
        public string RateCode { get; set; }

        [Required]
        [StringLength(100)]
        public string RateName { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public decimal BaseRate { get; set; }

        public decimal WeekendRate { get; set; }

        public decimal DiscountRate { get; set; }

        public decimal RateMonWed { get; set; }

        public decimal RateThuFri { get; set; }

        public decimal RateSatSun { get; set; }

        [StringLength(100)]
        public string Days { get; set; } // Comma-separated days: Mon,Tue,Wed,Thu,Fri,Sat,Sun

        public int? MinStay { get; set; }

        public int? MaxStay { get; set; }

        public bool ClosedToArrival { get; set; }

        public bool ClosedToDeparture { get; set; }

        public decimal SeasonalRate { get; set; }

        [StringLength(50)]
        public string Season { get; set; } // Peak, Off-Peak, Regular

        public DateTime EffectiveFrom { get; set; }

        public DateTime EffectiveTo { get; set; }

        [StringLength(50)]
        public string Currency { get; set; }

        public bool IncludesBreakfast { get; set; }

        public bool IncludesTax { get; set; }

        public decimal TaxPercentage { get; set; }

        [StringLength(500)]
        public string Terms { get; set; }

        // Navigation properties
        public virtual RoomType RoomType { get; set; }
    }

    public class RoomAmenities : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string AmenityName { get; set; }

        [Required]
        [StringLength(20)]
        public string AmenityCode { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string Category { get; set; } // Bathroom, Entertainment, Comfort, Technology

        public int? RoomTypeId { get; set; }

        public bool IsChargeable { get; set; }

        public decimal ChargeAmount { get; set; }

        [StringLength(50)]
        public string ChargeType { get; set; } // Per Night, Per Use, One Time

        public bool IsAvailable { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }

        public int DisplayOrder { get; set; }

        [StringLength(500)]
        public string Specifications { get; set; }

        // Navigation properties
        public virtual RoomType RoomType { get; set; }
    }

    public class RoomAmenityMapping : BaseEntity
    {
        [Required]
        public int RoomId { get; set; }

        [Required]
        public int AmenityId { get; set; }

        public bool IsIncluded { get; set; }

        public decimal AdditionalCharge { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
        public virtual RoomAmenities Amenity { get; set; }
    }

    public class FloorManagement : BaseEntity
    {
        [Required]
        public int FloorNumber { get; set; }

        [Required]
        [StringLength(100)]
        public string FloorName { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public int TotalRooms { get; set; }

        public int AvailableRooms { get; set; }

        public int OccupiedRooms { get; set; }

        public int OutOfOrderRooms { get; set; }

        [StringLength(100)]
        public string FloorManager { get; set; }

        [StringLength(100)]
        public string HousekeepingSupervisor { get; set; }

        public bool HasElevatorAccess { get; set; }

        public bool HasFireExit { get; set; }

        [StringLength(500)]
        public string SafetyFeatures { get; set; }

        [StringLength(500)]
        public string SpecialFeatures { get; set; }

        [StringLength(200)]
        public string FloorPlanPath { get; set; }

        [StringLength(200)]
        public string FloorImagePath { get; set; }
    }

    public class RoomTypeAmenityMapping : BaseEntity
    {
        [Required]
        public int RoomTypeId { get; set; }

        [Required]
        public int AmenityId { get; set; }

        public bool IsStandard { get; set; }

        public bool IsOptional { get; set; }

        public decimal AdditionalCharge { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation properties
        public virtual RoomType RoomType { get; set; }
        public virtual RoomAmenities Amenity { get; set; }
    }

    // === BLOCK & FLOOR HIERARCHY ===
    public class Block : BaseEntity
    {
        [Required]
        public int HotelId { get; set; }

        [Required]
        [StringLength(100)]
        public string BlockName { get; set; }

        [StringLength(50)]
        public string? BlockCode { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public int TotalFloors { get; set; }

        public int TotalRooms { get; set; }

        [StringLength(100)]
        public string? BlockManager { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual Hotel Hotel { get; set; }
        public virtual ICollection<BlockFloor> Floors { get; set; } = new List<BlockFloor>();
    }

    public class BlockFloor : BaseEntity
    {
        [Required]
        public int BlockId { get; set; }

        public int? RoomTypeId { get; set; }

        [Required]
        public int FloorNumber { get; set; }

        [Required]
        [StringLength(100)]
        public string FloorName { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public int TotalRooms { get; set; }

        public int AvailableRooms { get; set; }

        public int OccupiedRooms { get; set; }

        public int OutOfOrderRooms { get; set; }

        [StringLength(100)]
        public string? FloorManager { get; set; }

        [StringLength(100)]
        public string? HousekeepingSupervisor { get; set; }

        public bool HasElevatorAccess { get; set; }

        public bool HasFireExit { get; set; }

        [StringLength(500)]
        public string? SafetyFeatures { get; set; }

        [StringLength(500)]
        public string? SpecialFeatures { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual Block Block { get; set; }
        public virtual RoomType RoomType { get; set; }
        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
    }

}
