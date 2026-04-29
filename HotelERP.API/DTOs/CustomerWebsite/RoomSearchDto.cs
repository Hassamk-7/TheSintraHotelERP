namespace HotelERP.API.DTOs.CustomerWebsite
{
    public class RoomSearchRequestDto
    {
        public string? Location { get; set; } // Hotel City
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Adults { get; set; } = 1;
        public int Children { get; set; } = 0;
        public int Rooms { get; set; } = 1;
        public int? RoomTypeId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }

    public class RoomSearchResponseDto
    {
        public int HotelId { get; set; }
        public int RoomTypeId { get; set; }
        public string RoomTypeName { get; set; } = string.Empty;
        public string RoomTypeCode { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int MaxAdults { get; set; }
        public int MaxChildren { get; set; }
        public int MaxOccupancy { get; set; }
        public string BedType { get; set; } = string.Empty;
        public string RoomSize { get; set; } = string.Empty;
        public string ViewType { get; set; } = string.Empty;
        public string VideoPath { get; set; } = string.Empty;
        public bool ExtraBedAllowed { get; set; }
        public decimal? ExtraBedRate { get; set; }
        public string HotelLocation { get; set; } = string.Empty; // Hotel City
        public List<string> Amenities { get; set; } = new();
        public List<string> Images { get; set; } = new();
        public int AvailableRooms { get; set; }
        public int TotalRooms { get; set; }
        public decimal Rating { get; set; } = 4.5m;
        public List<RoomTaxDto> Taxes { get; set; } = new();
        public decimal TotalTaxAmount { get; set; }
        public decimal PriceWithTax { get; set; }
        public int? MinStay { get; set; }
        public int? MaxStay { get; set; }
        public bool ClosedToArrival { get; set; }
        public bool ClosedToDeparture { get; set; }
        public string RestrictionMessage { get; set; } = string.Empty;
    }

    public class RoomTaxDto
    {
        public int Id { get; set; }
        public string TaxName { get; set; } = string.Empty;
        public string TaxType { get; set; } = string.Empty; // Percentage or Fixed
        public decimal TaxValue { get; set; }
        public decimal TaxAmount { get; set; } // Calculated tax amount
    }

    public class HotelLocationDto
    {
        public int Id { get; set; }
        public string HotelName { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class RoomTypeDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int MaxOccupancy { get; set; }
        public string BedType { get; set; } = string.Empty;
        public string RoomSize { get; set; } = string.Empty;
        public string ViewType { get; set; } = string.Empty;
        public bool ExtraBedAllowed { get; set; }
        public decimal? ExtraBedRate { get; set; }
        public decimal? ChildRate { get; set; }
        public List<AmenityDto> Amenities { get; set; } = new();
        public List<string> Images { get; set; } = new();
        public List<RoomDto> AvailableRooms { get; set; } = new();
    }

    public class AmenityDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
    }

    public class RoomDto
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public int FloorNumber { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
    }
}
