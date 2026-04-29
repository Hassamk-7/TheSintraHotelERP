#nullable enable
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class HousekeepingRoomStatus : BaseEntity
    {
        [Required]
        public int RoomId { get; set; }

        [Required]
        [StringLength(50)]
        public string CleaningStatus { get; set; } // Clean, Dirty, Inspected, OutOfOrder, Maintenance

        [Required]
        [StringLength(50)]
        public string OccupancyStatus { get; set; } // Vacant, Occupied, OutOfOrder

        public DateTime LastCleaned { get; set; }

        public DateTime? NextCleaningScheduled { get; set; }

        [StringLength(100)]
        public string AssignedHousekeeper { get; set; }

        [StringLength(500)]
        public string CleaningNotes { get; set; }

        public bool RequiresInspection { get; set; }

        public DateTime? InspectionDate { get; set; }

        [StringLength(100)]
        public string InspectedBy { get; set; }

        [StringLength(500)]
        public string InspectionNotes { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
    }

    public class CleaningSchedule : BaseEntity
    {
        [StringLength(50)]
        public string ScheduleNumber { get; set; }

        [Required]
        public int RoomId { get; set; }

        [Required]
        public DateTime ScheduledDate { get; set; }

        [Required]
        public DateTime ScheduledTime { get; set; }

        [StringLength(50)]
        public string CleaningType { get; set; } // Regular, Deep, Maintenance, Checkout

        [StringLength(100)]
        public string AssignedHousekeeper { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Scheduled, InProgress, Completed, Cancelled

        public DateTime? StartTime { get; set; }

        public DateTime? CompletionTime { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [StringLength(500)]
        public string CompletionNotes { get; set; }

        public int EstimatedDuration { get; set; }

        public int ActualDuration { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
    }

    public class MaintenanceRequest
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string RequestNumber { get; set; } = string.Empty;
        
        [Required]
        public int RoomId { get; set; }
        public virtual Room? Room { get; set; }
        
        [Required]
        [StringLength(50)]
        public string IssueType { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Priority { get; set; } = "Medium";
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending";
        
        public DateTime ReportedDate { get; set; }
        
        [StringLength(100)]
        public string? ReportedBy { get; set; }
        
        [StringLength(100)]
        public string? AssignedTo { get; set; }
        
        public DateTime? ScheduledDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? EstimatedCost { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? ActualCost { get; set; }
        
        [StringLength(500)]
        public string? WorkPerformed { get; set; }
        
        [StringLength(200)]
        public string? PartsUsed { get; set; }
        
        [StringLength(500)]
        public string? CompletionNotes { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class LostAndFound
    {
        public int Id { get; set; }
        
        [StringLength(50)]
        public string? ItemNumber { get; set; }
        
        [StringLength(100)]
        public string? ItemDescription { get; set; }
        
        [StringLength(50)]
        public string? Category { get; set; }
        
        [Required]
        public int RoomId { get; set; }
        public virtual Room? Room { get; set; }
        
        [StringLength(100)]
        public string? LocationFound { get; set; }
        
        public DateTime? DateFound { get; set; }
        
        [StringLength(100)]
        public string? FoundBy { get; set; }
        
        [StringLength(50)]
        public string? Status { get; set; }
        
        [StringLength(100)]
        public string? GuestName { get; set; }
        
        [StringLength(20)]
        public string? GuestPhone { get; set; }
        
        [StringLength(100)]
        public string? GuestEmail { get; set; }
        
        public DateTime? ClaimedDate { get; set; }
        
        [StringLength(100)]
        public string? ClaimedBy { get; set; }
        
        [StringLength(500)]
        public string? Remarks { get; set; }
        
        [StringLength(200)]
        public string? ImagePath { get; set; }
        
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool? IsActive { get; set; } = true;
    }

    public class HousekeepingLaundry : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string LaundryNumber { get; set; }

        public int? RoomId { get; set; }

        public int? GuestId { get; set; }

        [Required]
        [StringLength(100)]
        public string ServiceType { get; set; }

        [Required]
        public DateTime RequestDate { get; set; }

        public DateTime? PickupDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Requested, Picked, Processing, Ready, Delivered

        public int ItemCount { get; set; }

        public decimal TotalWeight { get; set; }

        public decimal ServiceCharge { get; set; }

        public decimal ExpressCharge { get; set; }

        public decimal TotalAmount { get; set; }

        [StringLength(50)]
        public string PaymentStatus { get; set; }

        [StringLength(100)]
        public string ProcessedBy { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        public bool IsExpress { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
        public virtual Guest Guest { get; set; }
    }
}
