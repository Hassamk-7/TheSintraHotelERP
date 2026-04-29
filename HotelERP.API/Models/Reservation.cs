using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class Reservation : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string ReservationNumber { get; set; }

        public int? HotelId { get; set; }

        public int? RoomTypeId { get; set; }

        public int GuestId { get; set; }

        public int? RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        public int NumberOfAdults { get; set; }

        public int NumberOfChildren { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, CheckedIn, CheckedOut, Cancelled, NoShow

        [StringLength(500)]
        public string? SpecialRequests { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal TotalPaid { get; set; }

        public decimal Balance => TotalAmount - TotalPaid;

        public string PaymentStatus { get; set; } = "Pending"; // Pending, Partial, Paid, Refunded

        [StringLength(50)]
        public string? BookingSource { get; set; } // Online, Walk-in, Phone, Agent, etc.

        // --- Pricing & Payment ---
        public decimal RoomRate { get; set; }

        public decimal Discount { get; set; }

        public decimal FBCredits { get; set; }

        public int NumberOfRooms { get; set; } = 1;

        public int Nights { get; set; }

        public decimal AdvanceAmount { get; set; }

        [StringLength(50)]
        public string? PaymentMethod { get; set; } // Cash, Credit Card, Bank Transfer, etc.

        [StringLength(100)]
        public string? PaymentAccount { get; set; } // e.g. 10001-Credit Cards H.

        [StringLength(50)]
        public string? RatePlanId { get; set; }

        [StringLength(50)]
        public string? NTN { get; set; } // Tax Number

        // --- Guest Companions ---
        [StringLength(200)]
        public string? GuestName2 { get; set; }

        [StringLength(200)]
        public string? GuestName3 { get; set; }

        [StringLength(50)]
        public string? GroupId { get; set; }

        // --- Marketing / Source ---
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

        // --- Transport / Pickup ---
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

        // --- Folio ---
        [StringLength(100)]
        public string? BTCFolio { get; set; } // Bill to Company folio

        [StringLength(100)]
        public string? Folio1 { get; set; }

        [StringLength(100)]
        public string? Folio2 { get; set; }

        [StringLength(100)]
        public string? Folio3 { get; set; }

        // --- Additional Info ---
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
        public virtual Guest Guest { get; set; }
        public virtual Room Room { get; set; }
        public virtual ICollection<ReservationDetail> Details { get; set; }
        public virtual ICollection<ReservationPayment> Payments { get; set; }
        public virtual CheckIn CheckIn { get; set; }
        public virtual CheckOut CheckOut { get; set; }
    }

    public class ReservationDetail : BaseEntity
    {
        public int ReservationId { get; set; }
        public int RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal Rate { get; set; }
        public decimal TotalAmount { get; set; }
        public string? SpecialRequest { get; set; }

        // Navigation properties
        public virtual Reservation Reservation { get; set; }
        public virtual Room Room { get; set; }
    }

    public class ReservationPayment : BaseEntity
    {
        public int ReservationId { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public decimal Amount { get; set; }
        public string? PaymentMethod { get; set; } // Cash, Credit Card, Debit Card, Bank Transfer, etc.
        public string? TransactionId { get; set; }
        public string? PaymentStatus { get; set; } // Pending, Completed, Failed, Refunded
        public string? Notes { get; set; }

        // Navigation property
        public virtual Reservation Reservation { get; set; }
    }

    public class CheckIn : BaseEntity
    {
        public int ReservationId { get; set; }
        public DateTime CheckInDateTime { get; set; } = DateTime.UtcNow;
        public int CheckedInBy { get; set; } // Staff ID who checked in the guest
        public string? Notes { get; set; }

        // Navigation property
        public virtual Reservation Reservation { get; set; }
    }

    public class CheckOut : BaseEntity
    {
        public int ReservationId { get; set; }
        public DateTime CheckOutDateTime { get; set; } = DateTime.UtcNow;
        public int CheckedOutBy { get; set; } // Staff ID who checked out the guest
        public decimal TotalBill { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal Balance { get; set; }
        public string? PaymentStatus { get; set; }
        public string? Notes { get; set; }

        // Navigation property
        public virtual Reservation Reservation { get; set; }
    }
}
