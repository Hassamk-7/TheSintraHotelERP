using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class ReservationDto : BaseDto
    {
        [Required]
        [StringLength(50)]
        public string ReservationNumber { get; set; }

        public int GuestId { get; set; }
        public GuestDto Guest { get; set; }

        public int? RoomId { get; set; }
        public RoomDto Room { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        [Range(1, 10)]
        public int NumberOfAdults { get; set; } = 2;

        [Range(0, 10)]
        public int NumberOfChildren { get; set; } = 0;

        [StringLength(20)]
        public string Status { get; set; } = "Pending";

        [StringLength(500)]
        public string SpecialRequests { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalPaid { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Balance { get; set; }

        [StringLength(50)]
        public string PaymentStatus { get; set; } = "Pending";

        // Navigation properties
        public virtual ICollection<ReservationDetailDto> Details { get; set; } = new List<ReservationDetailDto>();
        public virtual ICollection<ReservationPaymentDto> Payments { get; set; } = new List<ReservationPaymentDto>();
        public virtual CheckInDto CheckIn { get; set; }
        public virtual CheckOutDto CheckOut { get; set; }
    }

    public class ReservationCreateDto
    {
        [Required]
        public int GuestId { get; set; }

        public int? RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        [Range(1, 10)]
        public int NumberOfAdults { get; set; } = 2;

        [Range(0, 10)]
        public int NumberOfChildren { get; set; } = 0;

        [StringLength(500)]
        public string SpecialRequests { get; set; }

        public List<ReservationDetailCreateDto> RoomDetails { get; set; } = new List<ReservationDetailCreateDto>();
    }

    public class ReservationDetailDto : BaseDto
    {
        public int ReservationId { get; set; }
        public int RoomId { get; set; }
        public RoomDto Room { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal Rate { get; set; }
        public decimal TotalAmount { get; set; }
        public string SpecialRequest { get; set; }
    }

    public class ReservationDetailCreateDto
    {
        [Required]
        public int RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Rate { get; set; }

        [StringLength(500)]
        public string SpecialRequest { get; set; }
    }

    public class ReservationPaymentDto : BaseDto
    {
        public int ReservationId { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public string PaymentStatus { get; set; }
        public string Notes { get; set; }
    }

    public class ReservationPaymentCreateDto
    {
        [Required]
        public int ReservationId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; }

        [StringLength(100)]
        public string TransactionId { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }

    public class CheckInDto : BaseDto
    {
        public int ReservationId { get; set; }
        public DateTime CheckInDateTime { get; set; } = DateTime.UtcNow;
        public int CheckedInBy { get; set; }
        public string Notes { get; set; }
    }

    public class CheckOutDto : BaseDto
    {
        public int ReservationId { get; set; }
        public DateTime CheckOutDateTime { get; set; } = DateTime.UtcNow;
        public int CheckedOutBy { get; set; }
        public decimal TotalBill { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal Balance { get; set; }
        public string PaymentStatus { get; set; }
        public string Notes { get; set; }
    }

    public class AdminCreateReservationDto
    {
        public int? HotelId { get; set; }

        public int? RoomTypeId { get; set; }

        [Required]
        public int GuestId { get; set; }

        public int? RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        [Range(1, 10)]
        public int NumberOfAdults { get; set; } = 1;

        [Range(0, 10)]
        public int NumberOfChildren { get; set; } = 0;

        [StringLength(500)]
        public string? SpecialRequests { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        // --- Pricing & Payment (all optional) ---
        public decimal RoomRate { get; set; }
        public decimal Discount { get; set; }
        public decimal FBCredits { get; set; }
        public int NumberOfRooms { get; set; } = 1;
        public int Nights { get; set; }
        public decimal AdvanceAmount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentAccount { get; set; }
        public string? RatePlanId { get; set; }
        public string? NTN { get; set; }
        public string? BookingSource { get; set; }

        // --- Guest Companions ---
        public string? GuestName2 { get; set; }
        public string? GuestName3 { get; set; }
        public string? GroupId { get; set; }

        // --- Marketing / Source ---
        public string? Source { get; set; }
        public string? Market { get; set; }
        public string? Region { get; set; }
        public string? Industry { get; set; }
        public string? Purpose { get; set; }
        public string? ReferenceCompany { get; set; }
        public string? ReservationMadeBy { get; set; }

        // --- Transport / Pickup ---
        public bool Pickup { get; set; }
        public string? PickupStation { get; set; }
        public string? PickupCarrier { get; set; }
        public string? PickupTime { get; set; }
        public bool DropOff { get; set; }
        public string? DropStation { get; set; }

        // --- Folio ---
        public string? BTCFolio { get; set; }
        public string? Folio1 { get; set; }
        public string? Folio2 { get; set; }
        public string? Folio3 { get; set; }

        // --- Additional Info ---
        public string? BTCComments { get; set; }
        public string? BtcId { get; set; }
        public bool Complimentary { get; set; }
        public string? Company { get; set; }
        public string? ComingFrom { get; set; }
        public string? Newspaper { get; set; }
        public string? Meals { get; set; }
        public string? VIPStatus { get; set; }
        public string? ReservationNotes { get; set; }
        public string? CheckinNotes { get; set; }
        public bool NoPost { get; set; }
        public string? EnteredBy { get; set; }
        public string? InclusivePrivileges { get; set; }
    }

    public class UpdateReservationStatusDto
    {
        [Required]
        [StringLength(20)]
        public string Status { get; set; }
    }

    public class ReservationFullDto : ReservationDto
    {
        public GuestDto Guest { get; set; }
        public string? SpecialRequests { get; set; }
        public string? PaymentStatus { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
