namespace HotelERP.API.DTOs
{
    public class CheckInCreateDto
    {
        public string? reservationId { get; set; }
        public int guestId { get; set; }
        public int roomId { get; set; }
        public string checkInDate { get; set; }
        public string expectedCheckOutDate { get; set; }
        public int numberOfGuests { get; set; }
        public decimal roomRate { get; set; }
        public decimal totalAmount { get; set; }
        public decimal advancePaid { get; set; }
        public string? specialRequests { get; set; }
        public string checkedInBy { get; set; } = "Reception Staff";
        public string? remarks { get; set; }

        // Pricing & Payment (Optional)
        public decimal discount { get; set; }
        public decimal fbCredits { get; set; }
        public string? paymentMethod { get; set; }
        public string? paymentAccount { get; set; }
        public string? ratePlanId { get; set; }
        public string? ntn { get; set; }

        // Guest Companions & Group (Optional)
        public string? guestName2 { get; set; }
        public string? guestName3 { get; set; }
        public string? groupId { get; set; }

        // Marketing / Source (Optional)
        public string? source { get; set; }
        public string? market { get; set; }
        public string? region { get; set; }
        public string? industry { get; set; }
        public string? purpose { get; set; }
        public string? referenceCompany { get; set; }
        public string? reservationMadeBy { get; set; }

        // Transport / Pickup & Drop (Optional)
        public bool pickup { get; set; }
        public string? pickupStation { get; set; }
        public string? pickupCarrier { get; set; }
        public string? pickupTime { get; set; }
        public bool dropOff { get; set; }
        public string? dropStation { get; set; }

        // Folio & BTC (Optional)
        public string? btcFolio { get; set; }
        public string? folio1 { get; set; }
        public string? folio2 { get; set; }
        public string? folio3 { get; set; }

        // Additional Information (Optional)
        public string? btcComments { get; set; }
        public string? btcId { get; set; }
        public bool complimentary { get; set; }
        public string? company { get; set; }
        public string? comingFrom { get; set; }
        public string? newspaper { get; set; }
        public string? meals { get; set; }
        public string? vipStatus { get; set; }
        public string? reservationNotes { get; set; }
        public string? checkinNotes { get; set; }
        public bool noPost { get; set; }
        public string? enteredBy { get; set; }
        public string? inclusivePrivileges { get; set; }
    }

    public class CheckInUpdateDto : CheckInCreateDto
    {
        public int id { get; set; }
    }

    public class CheckOutCreateDto
    {
        public int CheckInId { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal RoomCharges { get; set; }
        public decimal ServiceCharges { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalPaid { get; set; }
        public string PaymentMethod { get; set; } = "Cash";
        public string PaymentStatus { get; set; } = "Paid";
        public string CheckedOutBy { get; set; } = "Reception Staff";
        public string? Remarks { get; set; }
        public bool LateCheckOut { get; set; }
        public decimal LateCheckOutCharges { get; set; }
    }
}
