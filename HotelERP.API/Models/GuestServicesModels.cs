using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class ConciergeServices : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string ServiceNumber { get; set; }

        [Required]
        public int GuestId { get; set; }

        public int? RoomId { get; set; }

        [Required]
        [StringLength(100)]
        public string ServiceType { get; set; } // Information, Booking, Arrangement, Recommendation

        [Required]
        [StringLength(500)]
        public string ServiceDescription { get; set; }

        [Required]
        public DateTime RequestDate { get; set; }

        public DateTime? CompletionDate { get; set; }

        [StringLength(50)]
        public string Priority { get; set; } // Low, Medium, High, Urgent

        [StringLength(50)]
        public string Status { get; set; } // Requested, InProgress, Completed, Cancelled

        public decimal ServiceCharge { get; set; }

        [StringLength(100)]
        public string AssignedTo { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [StringLength(500)]
        public string CompletionNotes { get; set; }

        public int Rating { get; set; }

        [StringLength(500)]
        public string GuestFeedback { get; set; }

        // Navigation properties
        public virtual Guest Guest { get; set; }
        public virtual Room Room { get; set; }
    }

    public class SpaWellness : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string BookingNumber { get; set; }

        [Required]
        public int GuestId { get; set; }

        [Required]
        [StringLength(100)]
        public string ServiceName { get; set; }

        [StringLength(500)]
        public string ServiceDescription { get; set; }

        [StringLength(50)]
        public string ServiceCategory { get; set; } // Massage, Facial, Body Treatment, Wellness

        [Required]
        public DateTime BookingDate { get; set; }

        [Required]
        public DateTime ServiceDate { get; set; }

        public TimeSpan ServiceTime { get; set; }

        public int Duration { get; set; } // in minutes

        public decimal ServicePrice { get; set; }

        [StringLength(100)]
        public string Therapist { get; set; }

        [StringLength(50)]
        public string RoomFacility { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Booked, Confirmed, InProgress, Completed, Cancelled

        [StringLength(500)]
        public string SpecialRequests { get; set; }

        [StringLength(500)]
        public string TreatmentNotes { get; set; }

        public int Rating { get; set; }

        [StringLength(500)]
        public string GuestFeedback { get; set; }

        // Navigation properties
        public virtual Guest Guest { get; set; }
    }

    public class EventManagement : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string EventNumber { get; set; }

        [Required]
        [StringLength(200)]
        public string EventName { get; set; }

        [StringLength(50)]
        public string EventType { get; set; } // Wedding, Conference, Birthday, Corporate, Social

        [Required]
        public int OrganizerGuestId { get; set; }

        [Required]
        public DateTime EventDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public int ExpectedGuests { get; set; }

        public int ActualGuests { get; set; }

        [StringLength(100)]
        public string Venue { get; set; }

        public decimal VenueCharge { get; set; }

        public decimal CateringCharge { get; set; }

        public decimal DecorationCharge { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal AdvancePaid { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Inquiry, Booked, Confirmed, InProgress, Completed, Cancelled

        [StringLength(500)]
        public string SpecialRequirements { get; set; }

        [StringLength(100)]
        public string EventManager { get; set; }

        [StringLength(500)]
        public string EventNotes { get; set; }

        // Navigation properties
        public virtual Guest OrganizerGuest { get; set; }
    }

    public class Transportation : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string BookingNumber { get; set; }

        [Required]
        public int GuestId { get; set; }

        [Required]
        [StringLength(50)]
        public string TransportType { get; set; } // Airport Transfer, City Tour, Car Rental, Taxi

        [Required]
        [StringLength(200)]
        public string PickupLocation { get; set; }

        [Required]
        [StringLength(200)]
        public string DropoffLocation { get; set; }

        [Required]
        public DateTime BookingDate { get; set; }

        [Required]
        public DateTime ServiceDate { get; set; }

        public TimeSpan ServiceTime { get; set; }

        [StringLength(50)]
        public string VehicleType { get; set; } // Sedan, SUV, Van, Bus

        public int PassengerCount { get; set; }

        public decimal ServiceCharge { get; set; }

        [StringLength(100)]
        public string DriverName { get; set; }

        [StringLength(20)]
        public string DriverPhone { get; set; }

        [StringLength(50)]
        public string VehicleNumber { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Booked, Confirmed, InProgress, Completed, Cancelled

        [StringLength(500)]
        public string SpecialInstructions { get; set; }

        [StringLength(500)]
        public string ServiceNotes { get; set; }

        public int Rating { get; set; }

        [StringLength(500)]
        public string GuestFeedback { get; set; }

        // Navigation properties
        public virtual Guest Guest { get; set; }
    }

    public class TourTravel : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string BookingNumber { get; set; }

        [Required]
        public int GuestId { get; set; }

        [Required]
        [StringLength(200)]
        public string TourName { get; set; }

        [StringLength(500)]
        public string TourDescription { get; set; }

        [StringLength(50)]
        public string TourType { get; set; } // City Tour, Historical, Adventure, Cultural, Religious

        [Required]
        public DateTime BookingDate { get; set; }

        [Required]
        public DateTime TourDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public int Duration { get; set; } // in hours

        public int ParticipantCount { get; set; }

        public decimal TourPrice { get; set; }

        public decimal TotalAmount { get; set; }

        [StringLength(100)]
        public string TourGuide { get; set; }

        [StringLength(20)]
        public string GuidePhone { get; set; }

        [StringLength(50)]
        public string TransportArrangement { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Booked, Confirmed, InProgress, Completed, Cancelled

        [StringLength(500)]
        public string Inclusions { get; set; }

        [StringLength(500)]
        public string Exclusions { get; set; }

        [StringLength(500)]
        public string SpecialRequirements { get; set; }

        public int Rating { get; set; }

        [StringLength(500)]
        public string GuestFeedback { get; set; }

        // Navigation properties
        public virtual Guest Guest { get; set; }
    }

    public class GuestFeedbackService : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string FeedbackNumber { get; set; }

        [Required]
        public int GuestId { get; set; }

        public int? CheckInId { get; set; }

        [Required]
        public DateTime FeedbackDate { get; set; }

        [StringLength(50)]
        public string FeedbackType { get; set; } // Service, Food, Room, Facility, Staff, Overall

        public int OverallRating { get; set; } // 1-5 scale

        public int ServiceRating { get; set; }

        public int CleanlinessRating { get; set; }

        public int FoodRating { get; set; }

        public int StaffRating { get; set; }

        public int ValueForMoneyRating { get; set; }

        [StringLength(1000)]
        public string Comments { get; set; }

        [StringLength(500)]
        public string Suggestions { get; set; }

        [StringLength(500)]
        public string Complaints { get; set; }

        public bool WouldRecommend { get; set; }

        public bool WouldReturnAgain { get; set; }

        [StringLength(50)]
        public string FeedbackSource { get; set; } // In-Person, Online, Email, Phone

        [StringLength(50)]
        public string Status { get; set; } // Received, Reviewed, Responded, Closed

        [StringLength(100)]
        public string ReviewedBy { get; set; }

        public DateTime? ResponseDate { get; set; }

        [StringLength(500)]
        public string ManagementResponse { get; set; }

        // Navigation properties
        public virtual Guest Guest { get; set; }
        public virtual CheckInMaster CheckIn { get; set; }
    }
}
