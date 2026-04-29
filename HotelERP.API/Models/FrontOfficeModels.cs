using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class ReservationMaster : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string ReservationNumber { get; set; } = string.Empty;

        [Required]
        public int GuestId { get; set; }

        [Required]
        public int RoomTypeId { get; set; }

        public int? RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        public int NumberOfGuests { get; set; }

        public int NumberOfRooms { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal AdvanceAmount { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = string.Empty; // Confirmed, Pending, Cancelled, CheckedIn

        [StringLength(500)]
        public string SpecialRequests { get; set; }

        [StringLength(50)]
        public string BookingSource { get; set; } // Direct, Online, Agent

        [StringLength(100)]
        public string BookedBy { get; set; }

        public DateTime BookingDate { get; set; }

        [StringLength(500)]
        public string CancellationReason { get; set; }

        public DateTime? CancellationDate { get; set; }

        // Navigation properties
        public virtual Guest Guest { get; set; }
        public virtual RoomType RoomType { get; set; }
        public virtual Room Room { get; set; }
    }

    public class CheckInMaster : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string CheckInNumber { get; set; } = string.Empty;

        public int? ReservationId { get; set; }

        [Required]
        public int GuestId { get; set; }

        [Required]
        public int RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime ExpectedCheckOutDate { get; set; }

        public int NumberOfGuests { get; set; }

        public decimal RoomRate { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal AdvancePaid { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Active, CheckedOut

        [StringLength(500)]
        public string SpecialRequests { get; set; }

        [StringLength(100)]
        public string CheckedInBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // --- Pricing & Payment (Optional) ---
        public decimal Discount { get; set; }

        public decimal FBCredits { get; set; }

        [StringLength(50)]
        public string? PaymentMethod { get; set; } // Cash, Credit Card, Bank Transfer, etc.

        [StringLength(100)]
        public string? PaymentAccount { get; set; }

        [StringLength(50)]
        public string? RatePlanId { get; set; }

        [StringLength(50)]
        public string? NTN { get; set; } // Tax Number

        // --- Guest Companions & Group (Optional) ---
        [StringLength(200)]
        public string? GuestName2 { get; set; }

        [StringLength(200)]
        public string? GuestName3 { get; set; }

        [StringLength(50)]
        public string? GroupId { get; set; }

        // --- Marketing / Source (Optional) ---
        [StringLength(100)]
        public string? Source { get; set; } // Online, Walk-in, etc.

        [StringLength(100)]
        public string? Market { get; set; } // Front Office, Corporate, etc.

        [StringLength(100)]
        public string? Region { get; set; }

        [StringLength(100)]
        public string? Industry { get; set; }

        [StringLength(200)]
        public string? Purpose { get; set; } // Business, Leisure, Event

        [StringLength(200)]
        public string? ReferenceCompany { get; set; }

        [StringLength(200)]
        public string? ReservationMadeBy { get; set; }

        // --- Transport / Pickup & Drop (Optional) ---
        public bool Pickup { get; set; }

        [StringLength(100)]
        public string? PickupStation { get; set; } // airport, railway station, etc.

        [StringLength(100)]
        public string? PickupCarrier { get; set; } // e.g. PK029382

        [StringLength(50)]
        public string? PickupTime { get; set; } // e.g. 3:10

        public bool DropOff { get; set; }

        [StringLength(100)]
        public string? DropStation { get; set; }

        // --- Folio & BTC (Optional) ---
        [StringLength(100)]
        public string? BTCFolio { get; set; } // Bill to Company folio

        [StringLength(100)]
        public string? Folio1 { get; set; }

        [StringLength(100)]
        public string? Folio2 { get; set; }

        [StringLength(100)]
        public string? Folio3 { get; set; }

        // --- Additional Information (Optional) ---
        [StringLength(500)]
        public string? BTCComments { get; set; } // Bill to Company comments

        [StringLength(100)]
        public string? BtcId { get; set; }

        public bool Complimentary { get; set; }

        [StringLength(200)]
        public string? Company { get; set; }

        [StringLength(100)]
        public string? ComingFrom { get; set; }

        [StringLength(100)]
        public string? Newspaper { get; set; }

        [StringLength(100)]
        public string? Meals { get; set; } // bf only, half board, full board

        [StringLength(50)]
        public string? VIPStatus { get; set; }

        [StringLength(500)]
        public string? ReservationNotes { get; set; }

        [StringLength(500)]
        public string? CheckinNotes { get; set; }

        public bool NoPost { get; set; }

        [StringLength(200)]
        public string? EnteredBy { get; set; }

        [StringLength(1000)]
        public string? InclusivePrivileges { get; set; } // e.g. Airport Transfer | Buffet Breakfast | WiFi

        // Navigation properties
        public virtual ReservationMaster Reservation { get; set; }
        public virtual Guest Guest { get; set; }
        public virtual Room Room { get; set; }
    }

    public class CheckOutMaster : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string CheckOutNumber { get; set; }

        [Required]
        public int CheckInId { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        public decimal RoomCharges { get; set; }

        public decimal ServiceCharges { get; set; }

        public decimal TaxAmount { get; set; }

        public decimal TotalBill { get; set; }

        public decimal TotalPaid { get; set; }

        public decimal Balance { get; set; }

        [StringLength(50)]
        public string PaymentMethod { get; set; }

        [StringLength(50)]
        public string PaymentStatus { get; set; } // Paid, Pending, Partial

        [StringLength(100)]
        public string CheckedOutBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        public bool LateCheckOut { get; set; }

        public decimal LateCheckOutCharges { get; set; }

        // Navigation properties
        public virtual CheckInMaster CheckIn { get; set; }
    }

    public class RoomStatusMaster : BaseEntity
    {
        [Required]
        public int RoomId { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } // Available, Occupied, OutOfOrder, Maintenance, Cleaning

        [StringLength(50)]
        public string HousekeepingStatus { get; set; } // Clean, Dirty, Inspected, OutOfOrder

        public DateTime StatusDate { get; set; }

        [StringLength(100)]
        public string UpdatedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        public DateTime? MaintenanceScheduled { get; set; }

        public DateTime? CleaningScheduled { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
    }

    public class GuestRegistration : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string RegistrationNumber { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(50)]
        public string IdType { get; set; }

        [StringLength(50)]
        public string IdNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(20)]
        public string Gender { get; set; }

        [StringLength(50)]
        public string Nationality { get; set; }

        [StringLength(100)]
        public string Company { get; set; }

        [StringLength(50)]
        public string Purpose { get; set; } // Business, Leisure, Event

        [StringLength(100)]
        public string RegisteredBy { get; set; }

        public DateTime RegistrationDate { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }
    }

    public class WalkInGuest : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string WalkInNumber { get; set; }

        [Required]
        [StringLength(100)]
        public string GuestName { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(50)]
        public string IdType { get; set; }

        [StringLength(50)]
        public string IdNumber { get; set; }

        [Required]
        public int RoomTypeId { get; set; }

        public int? RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        public int NumberOfGuests { get; set; }

        public decimal RoomRate { get; set; }

        public decimal TotalAmount { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Inquiry, Confirmed, CheckedIn

        [StringLength(100)]
        public string HandledBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual RoomType RoomType { get; set; }
        public virtual Room Room { get; set; }
    }
}
