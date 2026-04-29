using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    [Table("RoomBlocked")]
    public class RoomBlocked
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HotelId { get; set; }

        [Required]
        public int RoomTypeId { get; set; }

        [Required]
        public int RoomId { get; set; }

        [Required]
        public DateTime BlockStartDate { get; set; }

        [Required]
        public DateTime BlockEndDate { get; set; }

        [Required]
        [StringLength(200)]
        public string BlockReason { get; set; }

        [Required]
        [StringLength(50)]
        public string BlockType { get; set; } // 'Maintenance', 'Renovation', 'OutOfOrder', 'Reserved', 'Other'

        [Required]
        [StringLength(100)]
        public string BlockedBy { get; set; }

        [StringLength(500)]
        public string? BlockNotes { get; set; }

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

        [ForeignKey("RoomId")]
        public virtual Room? Room { get; set; }

        // Computed Properties
        [NotMapped]
        public int BlockDuration => (BlockEndDate - BlockStartDate).Days + 1;

        [NotMapped]
        public bool IsCurrentlyBlocked => DateTime.Now >= BlockStartDate && DateTime.Now <= BlockEndDate && IsActive;

        [NotMapped]
        public bool IsFutureBlock => BlockStartDate > DateTime.Now && IsActive;

        [NotMapped]
        public bool IsPastBlock => BlockEndDate < DateTime.Now;
    }

    // DTO for Room Availability Summary
    public class RoomAvailabilityDto
    {
        public int HotelId { get; set; }
        public string HotelName { get; set; }
        public int RoomTypeId { get; set; }
        public string RoomTypeName { get; set; }
        public int TotalRooms { get; set; }
        public int CurrentlyBlockedRooms { get; set; }
        public int AvailableRooms { get; set; }
        public decimal AvailabilityPercentage => TotalRooms > 0 ? (decimal)AvailableRooms / TotalRooms * 100 : 0;
    }

    // DTO for Calendar Integration
    public class RoomBlockCalendarDto
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string RoomNumber { get; set; }
        public string RoomTypeName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; }
        public string BlockType { get; set; }
        public string BlockedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
