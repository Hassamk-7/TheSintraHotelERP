namespace HotelERP.API.DTOs.CustomerWebsite
{
    public class RoomSelectionDto
    {
        public int RoomTypeId { get; set; }
        public string RoomTypeName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal BasePrice { get; set; }
        // Optional client-provided tax/total to ensure taxes are not dropped when RoomTaxes are not configured
        public decimal TaxAmount { get; set; }
        public decimal TotalWithTax { get; set; }
        public int? PlanId { get; set; }
        public string? PlanName { get; set; }
        public decimal PlanSurcharge { get; set; }
    }

    public class CreateReservationDto
    {
        public int? HotelId { get; set; }

        public int? RoomTypeId { get; set; }

        public List<RoomSelectionDto> SelectedRooms { get; set; } = new();
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfAdults { get; set; }
        public int NumberOfChildren { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;
        
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string IdType { get; set; } = string.Empty;
        public string IdNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string EmergencyContact { get; set; } = string.Empty;
        public string EmergencyPhone { get; set; } = string.Empty;
        public string Nationality { get; set; } = string.Empty;
        public string Occupation { get; set; } = string.Empty;
        
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal AdvanceAmount { get; set; }
        public string CouponCode { get; set; } = string.Empty;
        public int? VoucherId { get; set; }
        public string VoucherCode { get; set; } = string.Empty;
        public string ArrivalTime { get; set; } = string.Empty;
        public string BookingSource { get; set; } = string.Empty;
        public int NumberOfRooms { get; set; }
        public int Nights { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string PaymentAccount { get; set; } = string.Empty;
        public string RatePlanId { get; set; } = string.Empty;
        public string GuestName2 { get; set; } = string.Empty;
        public string GuestName3 { get; set; } = string.Empty;
        public string GroupId { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string Market { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Purpose { get; set; } = string.Empty;
        public string ReferenceCompany { get; set; } = string.Empty;
        public string ReservationMadeBy { get; set; } = string.Empty;
        public bool Pickup { get; set; }
        public string PickupStation { get; set; } = string.Empty;
        public string PickupCarrier { get; set; } = string.Empty;
        public string PickupTime { get; set; } = string.Empty;
        public bool DropOff { get; set; }
        public string DropStation { get; set; } = string.Empty;
        public string BTCFolio { get; set; } = string.Empty;
        public string Folio1 { get; set; } = string.Empty;
        public string Folio2 { get; set; } = string.Empty;
        public string Folio3 { get; set; } = string.Empty;
        public string BTCComments { get; set; } = string.Empty;
        public string BtcId { get; set; } = string.Empty;
        public bool Complimentary { get; set; }
        public string ComingFrom { get; set; } = string.Empty;
        public string Newspaper { get; set; } = string.Empty;
        public string Meals { get; set; } = string.Empty;
        public string VIPStatus { get; set; } = string.Empty;
        public string ReservationNotes { get; set; } = string.Empty;
        public string CheckinNotes { get; set; } = string.Empty;
        public bool NoPost { get; set; }
        public string EnteredBy { get; set; } = string.Empty;
        public string InclusivePrivileges { get; set; } = string.Empty;
    }

    public class ReservedRoomDto
    {
        public string RoomTypeName { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
    }

    public class ReservationResponseDto
    {
        public int ReservationId { get; set; }
        public string ReservationNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfNights { get; set; }
        public List<ReservedRoomDto> Rooms { get; set; } = new();
        public int NumberOfAdults { get; set; }
        public int NumberOfChildren { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalPaid { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string GuestName { get; set; } = string.Empty;
        public string GuestEmail { get; set; } = string.Empty;
        public string GuestPhone { get; set; } = string.Empty;
        public string GuestAddress { get; set; } = string.Empty;
        public string GuestCity { get; set; } = string.Empty;
        public string GuestCountry { get; set; } = string.Empty;
        public string SpecialRequests { get; set; } = string.Empty;
        public string HotelName { get; set; } = string.Empty;
        public string HotelAddress { get; set; } = string.Empty;
        public string HotelPhone { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CheckAvailabilityDto
    {
        public int RoomTypeId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfRooms { get; set; } = 1;
    }

    public class AvailabilityResponseDto
    {
        public bool IsAvailable { get; set; }
        public int AvailableRooms { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal PricePerNight { get; set; }
        public int NumberOfNights { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? MinStay { get; set; }
        public int? MaxStay { get; set; }
        public bool ClosedToArrival { get; set; }
        public bool ClosedToDeparture { get; set; }
    }
}
