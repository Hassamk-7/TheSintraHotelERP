using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class Room : BaseEntity
    {
        [Required]
        [StringLength(20)]
        public string RoomNumber { get; set; } = string.Empty;

        public int RoomTypeId { get; set; }

        public int? BlockFloorId { get; set; } // Foreign key to BlockFloor (hierarchical structure)

        public int FloorNumber { get; set; }

        [StringLength(50)]
        public string? Block { get; set; } // Block/Wing designation

        [StringLength(50)]
        public string Status { get; set; } = string.Empty; // Available, Occupied, Maintenance, etc.

        public decimal? RoomSize { get; set; }

        [StringLength(20)]
        public string? RoomSizeUnit { get; set; }

        public int MaxAdults { get; set; }

        public int MaxChildren { get; set; }

        public int? BaseOccupancy { get; set; }

        public int? MaxAgeOfChild { get; set; }

        public int? SingleBedCount { get; set; }

        public int? DoubleBedCount { get; set; }

        public int? QueenBedCount { get; set; }

        public int? KingBedCount { get; set; }

        public int? SofaBedCount { get; set; }

        public decimal BasePrice { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(200)]
        public string? Features { get; set; } // Comma-separated features

        public DateTime? LastMaintenanceDate { get; set; } // Last maintenance date

        // Note: HousekeepingStatus and LastCleaned removed as they don't exist in current DB schema

        // Navigation properties
        public virtual RoomType RoomType { get; set; }
        public virtual BlockFloor BlockFloor { get; set; }
        public virtual ICollection<Reservation> Reservations { get; set; }
        public virtual ICollection<RoomImage> Images { get; set; }
        public virtual ICollection<RoomStatusMaster> RoomStatuses { get; set; }
        public virtual ICollection<CleaningSchedule> CleaningSchedules { get; set; }

        [NotMapped]
        public int? HotelId { get; set; }
    }

    public class RoomType : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Code { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public decimal BasePrice { get; set; }

        public int? HotelId { get; set; }

        public int MaxOccupancy { get; set; }

        public int? MaximumAdults { get; set; }

        public int? MaximumChildren { get; set; }

        [StringLength(200)]
        public string? Amenities { get; set; } // Comma-separated amenities

        // Additional fields to match database schema
        [StringLength(100)]
        public string? RoomSize { get; set; }

        [StringLength(50)]
        public string? BedType { get; set; }

        [StringLength(50)]
        public string? ViewType { get; set; }

        public decimal? ExtraBedRate { get; set; }

        public decimal? ChildRate { get; set; }

        public bool ExtraBedAllowed { get; set; } = true;

        [NotMapped]
        public string? VideoPath { get; set; }

        public decimal? BaseRate { get; set; }

        public virtual Hotel Hotel { get; set; }

        // Navigation property
        public virtual ICollection<Room> Rooms { get; set; }
        public virtual ICollection<RoomTypeImage> Images { get; set; }
    }

    public class RoomImage : BaseEntity
    {
        public int RoomId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public string? Caption { get; set; }

        // Navigation property
        public virtual Room Room { get; set; }
    }
}
