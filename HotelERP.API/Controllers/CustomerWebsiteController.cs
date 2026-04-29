using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.DTOs.CustomerWebsite;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerWebsiteController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public CustomerWebsiteController(HotelDbContext context)
        {
            _context = context;
        }

        private static string BuildRestrictionMessage(RoomRates rate)
        {
            var messages = new List<string>();

            if (rate.MinStay.HasValue)
            {
                messages.Add($"Minimum stay is {rate.MinStay.Value} night(s)");
            }

            if (rate.MaxStay.HasValue)
            {
                messages.Add($"Maximum stay is {rate.MaxStay.Value} night(s)");
            }

            if (rate.ClosedToArrival)
            {
                messages.Add($"Arrival allowed only on {rate.EffectiveFrom:yyyy-MM-dd}");
            }

            if (rate.ClosedToDeparture)
            {
                messages.Add($"Departure allowed only on {rate.EffectiveTo:yyyy-MM-dd}");
            }

            return string.Join(". ", messages);
        }

        private static bool IsRateBookable(RoomRates? rate, DateTime checkInDate, DateTime checkOutDate, out string restrictionMessage)
        {
            restrictionMessage = string.Empty;
            if (rate == null)
            {
                return true;
            }

            var arrival = checkInDate.Date;
            var departure = checkOutDate.Date;
            var validFrom = rate.EffectiveFrom.Date;
            var validTo = rate.EffectiveTo.Date;
            var nights = (departure - arrival).Days;

            if (nights <= 0)
            {
                restrictionMessage = "Invalid date range";
                return false;
            }

            if (arrival < validFrom || departure > validTo)
            {
                restrictionMessage = $"Rate is valid only from {validFrom:yyyy-MM-dd} to {validTo:yyyy-MM-dd}";
                return false;
            }

            if (rate.MinStay.HasValue && nights < rate.MinStay.Value)
            {
                restrictionMessage = $"Minimum stay is {rate.MinStay.Value} night(s)";
                return false;
            }

            if (rate.MaxStay.HasValue && nights > rate.MaxStay.Value)
            {
                restrictionMessage = $"Maximum stay is {rate.MaxStay.Value} night(s)";
                return false;
            }

            if (rate.ClosedToArrival && arrival != validFrom)
            {
                restrictionMessage = $"Arrival allowed only on {validFrom:yyyy-MM-dd}";
                return false;
            }

            if (rate.ClosedToDeparture && departure != validTo)
            {
                restrictionMessage = $"Departure allowed only on {validTo:yyyy-MM-dd}";
                return false;
            }

            return true;
        }

        // GET: api/CustomerWebsite/hotels
        [HttpGet("hotels")]
        public async Task<ActionResult<IEnumerable<HotelLocationDto>>> GetHotels()
        {
            var hotels = await _context.Hotels
                .Where(h => h.IsActive == true)
                .Select(h => new HotelLocationDto
                {
                    Id = h.Id,
                    HotelName = h.HotelName ?? "",
                    City = h.City ?? "",
                    Address = h.Address ?? "",
                    PhoneNumber = h.PhoneNumber ?? "",
                    Email = h.Email ?? ""
                })
                .ToListAsync();

            return Ok(hotels);
        }

        // GET: api/CustomerWebsite/room-types
        [HttpGet("room-types")]
        public async Task<ActionResult<IEnumerable<RoomSearchResponseDto>>> GetRoomTypes()
        {
            var firstHotel = await _context.Hotels.FirstOrDefaultAsync(h => h.IsActive == true);
            var firstHotelId = firstHotel?.Id ?? 0;
            var firstHotelCity = firstHotel?.City ?? "";

            var roomTypes = await _context.RoomTypes
                .Where(rt => rt.IsActive == true)
                .Select(rt => new RoomSearchResponseDto
                {
                    HotelId = (rt.HotelId ?? 0) != 0 ? (rt.HotelId ?? 0) : firstHotelId,
                    RoomTypeId = rt.Id,
                    RoomTypeName = rt.Name ?? "",
                    RoomTypeCode = rt.Code ?? "",
                    Description = rt.Description ?? "",
                    BasePrice = rt.BasePrice,
                    MaxAdults = rt.MaximumAdults ?? 0,
                    MaxChildren = rt.MaximumChildren ?? 0,
                    MaxOccupancy = rt.MaxOccupancy,
                    BedType = rt.BedType ?? "",
                    RoomSize = rt.RoomSize ?? "",
                    ViewType = rt.ViewType ?? "",
                    VideoPath = "",
                    ExtraBedAllowed = rt.ExtraBedAllowed,
                    ExtraBedRate = rt.ExtraBedRate,
                    Amenities = new List<string>(),
                    Images = new List<string>(),
                    AvailableRooms = 0,
                    Rating = 4.5m
                })
                .ToListAsync();

            // Get images for each room type
            foreach (var roomType in roomTypes)
            {
                // Set hotel location
                roomType.HotelLocation = firstHotelCity;

                var images = await _context.RoomTypeImages
                    .Where(i => i.RoomTypeId == roomType.RoomTypeId && i.IsActive == true)
                    .OrderBy(i => i.DisplayOrder)
                    .Select(i => i.CompressedPath ?? i.ImagePath ?? "")
                    .ToListAsync();
                roomType.Images = images;

                // Get amenities
                var amenities = await _context.RoomTypeAmenityMappings
                    .Where(m => m.RoomTypeId == roomType.RoomTypeId)
                    .Join(_context.RoomAmenities,
                        m => m.AmenityId,
                        a => a.Id,
                        (m, a) => a.AmenityName ?? "")
                    .ToListAsync();
                roomType.Amenities = amenities;

                // Get taxes for this room type
                var taxes = await _context.RoomTaxes
                    .Where(t => t.RoomTypeId == roomType.RoomTypeId && t.IsActive == true)
                    .Select(t => new RoomTaxDto
                    {
                        Id = t.Id,
                        TaxName = t.TaxName ?? "",
                        TaxType = t.TaxType ?? "",
                        TaxValue = t.TaxValue,
                        TaxAmount = t.TaxType == "Percentage" 
                            ? (roomType.BasePrice * t.TaxValue / 100) 
                            : t.TaxValue
                    })
                    .ToListAsync();
                roomType.Taxes = taxes;
                roomType.TotalTaxAmount = taxes.Sum(t => t.TaxAmount);
                roomType.PriceWithTax = roomType.BasePrice + roomType.TotalTaxAmount;

                // Get total rooms count
                var totalRooms = await _context.Rooms
                    .Where(r => r.RoomTypeId == roomType.RoomTypeId && r.IsActive == true)
                    .CountAsync();
                roomType.TotalRooms = totalRooms;

                // Count available rooms
                var availableRooms = await _context.Rooms
                    .Where(r => r.RoomTypeId == roomType.RoomTypeId && 
                               r.IsActive == true && 
                               r.Status == "Available")
                    .CountAsync();
                roomType.AvailableRooms = availableRooms;
            }

            return Ok(roomTypes);
        }

        // POST: api/CustomerWebsite/search-rooms
        [HttpPost("search-rooms")]
        public async Task<ActionResult<IEnumerable<RoomSearchResponseDto>>> SearchRooms([FromBody] RoomSearchRequestDto request)
        {
            var nights = (request.CheckOutDate.Date - request.CheckInDate.Date).Days;
            if (nights <= 0)
            {
                return BadRequest("Invalid date range");
            }

            var query = _context.RoomTypes.Where(rt => rt.IsActive == true);

            // Filter by room type if specified
            if (request.RoomTypeId.HasValue)
            {
                query = query.Where(rt => rt.Id == request.RoomTypeId.Value);
            }

            // Filter by price range
            if (request.MinPrice.HasValue)
            {
                query = query.Where(rt => rt.BasePrice >= request.MinPrice.Value);
            }
            if (request.MaxPrice.HasValue)
            {
                query = query.Where(rt => rt.BasePrice <= request.MaxPrice.Value);
            }

            // Filter by occupancy
            query = query.Where(rt => rt.MaxOccupancy >= request.Adults + request.Children);

            var firstHotel = await _context.Hotels.FirstOrDefaultAsync(h => h.IsActive == true);
            var firstHotelId = firstHotel?.Id ?? 0;
            var firstHotelCity = firstHotel?.City ?? "";

            var roomTypes = await query
                .Select(rt => new RoomSearchResponseDto
                {
                    HotelId = (rt.HotelId ?? 0) != 0 ? (rt.HotelId ?? 0) : firstHotelId,
                    RoomTypeId = rt.Id,
                    RoomTypeName = rt.Name ?? "",
                    RoomTypeCode = rt.Code ?? "",
                    Description = rt.Description ?? "",
                    BasePrice = rt.BasePrice,
                    MaxAdults = rt.MaximumAdults ?? 0,
                    MaxChildren = rt.MaximumChildren ?? 0,
                    MaxOccupancy = rt.MaxOccupancy,
                    BedType = rt.BedType ?? "",
                    RoomSize = rt.RoomSize ?? "",
                    ViewType = rt.ViewType ?? "",
                    VideoPath = "",
                    ExtraBedAllowed = rt.ExtraBedAllowed,
                    ExtraBedRate = rt.ExtraBedRate,
                    Amenities = new List<string>(),
                    Images = new List<string>(),
                    AvailableRooms = 0,
                    Rating = 4.5m
                })
                .ToListAsync();

            // Check availability for each room type
            foreach (var roomType in roomTypes)
            {
                var applicableRate = await _context.RoomRates
                    .Where(r => r.IsActive && r.RoomTypeId == roomType.RoomTypeId)
                    .Where(r => request.CheckInDate.Date >= r.EffectiveFrom.Date && request.CheckOutDate.Date <= r.EffectiveTo.Date)
                    .OrderBy(r => r.EffectiveFrom)
                    .ThenBy(r => r.Id)
                    .FirstOrDefaultAsync();

                roomType.MinStay = applicableRate?.MinStay;
                roomType.MaxStay = applicableRate?.MaxStay;
                roomType.ClosedToArrival = applicableRate?.ClosedToArrival ?? false;
                roomType.ClosedToDeparture = applicableRate?.ClosedToDeparture ?? false;
                roomType.RestrictionMessage = applicableRate != null ? BuildRestrictionMessage(applicableRate) : string.Empty;

                if (!IsRateBookable(applicableRate, request.CheckInDate, request.CheckOutDate, out var restrictionMessage))
                {
                    roomType.AvailableRooms = 0;
                    roomType.RestrictionMessage = restrictionMessage;
                    continue;
                }

                // Set hotel location
                roomType.HotelLocation = firstHotelCity;

                // Get images - use CompressedPath if available, otherwise ImagePath
                var images = await _context.RoomTypeImages
                    .Where(i => i.RoomTypeId == roomType.RoomTypeId && i.IsActive == true)
                    .OrderBy(i => i.DisplayOrder)
                    .Select(i => i.CompressedPath ?? i.ImagePath ?? "")
                    .ToListAsync();
                roomType.Images = images;

                // Get amenities
                var amenities = await _context.RoomTypeAmenityMappings
                    .Where(m => m.RoomTypeId == roomType.RoomTypeId)
                    .Join(_context.RoomAmenities,
                        m => m.AmenityId,
                        a => a.Id,
                        (m, a) => a.AmenityName ?? "")
                    .ToListAsync();
                roomType.Amenities = amenities;

                // Get taxes for this room type
                var taxes = await _context.RoomTaxes
                    .Where(t => t.RoomTypeId == roomType.RoomTypeId && t.IsActive == true)
                    .Select(t => new RoomTaxDto
                    {
                        Id = t.Id,
                        TaxName = t.TaxName ?? "",
                        TaxType = t.TaxType ?? "",
                        TaxValue = t.TaxValue,
                        TaxAmount = t.TaxType == "Percentage" 
                            ? (roomType.BasePrice * t.TaxValue / 100) 
                            : t.TaxValue
                    })
                    .ToListAsync();
                roomType.Taxes = taxes;
                roomType.TotalTaxAmount = taxes.Sum(t => t.TaxAmount);
                roomType.PriceWithTax = roomType.BasePrice + roomType.TotalTaxAmount;

                var capacityRoom = await _context.Rooms
                    .Where(r => r.RoomTypeId == roomType.RoomTypeId &&
                               r.IsActive == true)
                    .OrderByDescending(r => r.MaxAdults + r.MaxChildren)
                    .ThenByDescending(r => r.MaxAdults)
                    .FirstOrDefaultAsync();

                if (capacityRoom != null)
                {
                    roomType.MaxAdults = capacityRoom.MaxAdults;
                    roomType.MaxChildren = capacityRoom.MaxChildren;
                    roomType.MaxOccupancy = capacityRoom.MaxAdults + capacityRoom.MaxChildren;
                }

                // Get total rooms count for this room type
                var totalRooms = await _context.Rooms
                    .Where(r => r.RoomTypeId == roomType.RoomTypeId && r.IsActive == true)
                    .CountAsync();
                roomType.TotalRooms = totalRooms;

                // Check availability for the date range
                var bookedRoomIds = await _context.Reservations
                    .Where(r => r.RoomId != null &&
                               r.Status != "Cancelled" &&
                               ((r.CheckInDate >= request.CheckInDate && r.CheckInDate < request.CheckOutDate) ||
                                (r.CheckOutDate > request.CheckInDate && r.CheckOutDate <= request.CheckOutDate) ||
                                (r.CheckInDate <= request.CheckInDate && r.CheckOutDate >= request.CheckOutDate)))
                    .Select(r => r.RoomId)
                    .ToListAsync();

                // Exclude rooms that are blocked for the requested date range
                var blockedRoomIds = await _context.RoomBlocked
                    .Where(rb => rb.IsActive &&
                                rb.RoomId != 0 &&
                                rb.RoomTypeId == roomType.RoomTypeId &&
                                ((rb.BlockStartDate >= request.CheckInDate && rb.BlockStartDate < request.CheckOutDate) ||
                                 (rb.BlockEndDate > request.CheckInDate && rb.BlockEndDate <= request.CheckOutDate) ||
                                 (rb.BlockStartDate <= request.CheckInDate && rb.BlockEndDate >= request.CheckOutDate)))
                    .Select(rb => rb.RoomId)
                    .ToListAsync();

                var availableRooms = await _context.Rooms
                    .Where(r => r.RoomTypeId == roomType.RoomTypeId &&
                               r.IsActive == true &&
                               r.Status == "Available" &&
                               !bookedRoomIds.Contains(r.Id) &&
                               !blockedRoomIds.Contains(r.Id))
                    .CountAsync();

                roomType.AvailableRooms = availableRooms;
            }

            return Ok(roomTypes.Where(rt => rt.AvailableRooms >= request.Rooms).ToList());
        }

        // GET: api/CustomerWebsite/room-type/{id}
        [HttpGet("room-type/{id}")]
        public async Task<ActionResult<RoomTypeDetailDto>> GetRoomTypeDetail(int id)
        {
            var roomType = await _context.RoomTypes
                .Where(rt => rt.Id == id && rt.IsActive == true)
                .FirstOrDefaultAsync();

            if (roomType == null)
            {
                return NotFound();
            }

            var detail = new RoomTypeDetailDto
            {
                Id = roomType.Id,
                Name = roomType.Name ?? "",
                Code = roomType.Code ?? "",
                Description = roomType.Description ?? "",
                BasePrice = roomType.BasePrice,
                MaxOccupancy = roomType.MaxOccupancy,
                BedType = roomType.BedType ?? "",
                RoomSize = roomType.RoomSize ?? "",
                ViewType = roomType.ViewType ?? "",
                ExtraBedAllowed = roomType.ExtraBedAllowed,
                ExtraBedRate = roomType.ExtraBedRate,
                ChildRate = roomType.ChildRate
            };

            // Get images - use CompressedPath if available
            detail.Images = await _context.RoomTypeImages
                .Where(i => i.RoomTypeId == id && i.IsActive == true)
                .OrderBy(i => i.DisplayOrder)
                .Select(i => i.CompressedPath ?? i.ImagePath ?? "")
                .ToListAsync();

            // Get amenities
            detail.Amenities = await _context.RoomTypeAmenityMappings
                .Where(m => m.RoomTypeId == id)
                .Join(_context.RoomAmenities,
                    m => m.AmenityId,
                    a => a.Id,
                    (m, a) => new AmenityDto
                    {
                        Id = a.Id,
                        Name = a.AmenityName ?? "",
                        Code = a.AmenityCode ?? "",
                        Icon = ""
                    })
                .ToListAsync();

            // Get available rooms
            detail.AvailableRooms = await _context.Rooms
                .Where(r => r.RoomTypeId == id && r.IsActive == true && r.Status == "Available")
                .Select(r => new RoomDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber ?? "",
                    FloorNumber = r.FloorNumber,
                    Status = r.Status ?? "",
                    BasePrice = r.BasePrice
                })
                .ToListAsync();

            return Ok(detail);
        }

        // POST: api/CustomerWebsite/check-availability
        [HttpPost("check-availability")]
        public async Task<ActionResult<AvailabilityResponseDto>> CheckAvailability([FromBody] CheckAvailabilityDto request)
        {
            var roomType = await _context.RoomTypes.FindAsync(request.RoomTypeId);
            if (roomType == null)
            {
                return NotFound("Room type not found");
            }

            // Calculate number of nights
            var nights = (request.CheckOutDate - request.CheckInDate).Days;
            if (nights <= 0)
            {
                return BadRequest("Invalid date range");
            }

            var applicableRate = await _context.RoomRates
                .Where(r => r.IsActive && r.RoomTypeId == request.RoomTypeId)
                .Where(r => request.CheckInDate.Date >= r.EffectiveFrom.Date && request.CheckOutDate.Date <= r.EffectiveTo.Date)
                .OrderBy(r => r.EffectiveFrom)
                .ThenBy(r => r.Id)
                .FirstOrDefaultAsync();

            if (!IsRateBookable(applicableRate, request.CheckInDate, request.CheckOutDate, out var restrictionMessage))
            {
                return Ok(new AvailabilityResponseDto
                {
                    IsAvailable = false,
                    AvailableRooms = 0,
                    PricePerNight = 0,
                    NumberOfNights = nights,
                    TotalPrice = 0,
                    MinStay = applicableRate?.MinStay,
                    MaxStay = applicableRate?.MaxStay,
                    ClosedToArrival = applicableRate?.ClosedToArrival ?? false,
                    ClosedToDeparture = applicableRate?.ClosedToDeparture ?? false,
                    Message = restrictionMessage
                });
            }

            // Check for booked rooms
            var bookedRoomIds = await _context.Reservations
                .Where(r => r.RoomId != null &&
                           r.Status != "Cancelled" &&
                           ((r.CheckInDate >= request.CheckInDate && r.CheckInDate < request.CheckOutDate) ||
                            (r.CheckOutDate > request.CheckInDate && r.CheckOutDate <= request.CheckOutDate) ||
                            (r.CheckInDate <= request.CheckInDate && r.CheckOutDate >= request.CheckOutDate)))
                .Select(r => r.RoomId)
                .ToListAsync();

            // Exclude rooms that are blocked for the requested date range
            var blockedRoomIds = await _context.RoomBlocked
                .Where(rb => rb.IsActive &&
                            rb.RoomId != 0 &&
                            rb.RoomTypeId == request.RoomTypeId &&
                            ((rb.BlockStartDate >= request.CheckInDate && rb.BlockStartDate < request.CheckOutDate) ||
                             (rb.BlockEndDate > request.CheckInDate && rb.BlockEndDate <= request.CheckOutDate) ||
                             (rb.BlockStartDate <= request.CheckInDate && rb.BlockEndDate >= request.CheckOutDate)))
                .Select(rb => rb.RoomId)
                .ToListAsync();

            var availableRooms = await _context.Rooms
                .Where(r => r.RoomTypeId == request.RoomTypeId &&
                           r.IsActive == true &&
                           r.Status == "Available" &&
                           !bookedRoomIds.Contains(r.Id) &&
                           !blockedRoomIds.Contains(r.Id))
                .CountAsync();

            var pricePerNight = roomType.BasePrice;
            var totalPrice = pricePerNight * nights * request.NumberOfRooms;

            var response = new AvailabilityResponseDto
            {
                IsAvailable = availableRooms >= request.NumberOfRooms,
                AvailableRooms = availableRooms,
                PricePerNight = pricePerNight,
                NumberOfNights = nights,
                TotalPrice = totalPrice,
                MinStay = applicableRate?.MinStay,
                MaxStay = applicableRate?.MaxStay,
                ClosedToArrival = applicableRate?.ClosedToArrival ?? false,
                ClosedToDeparture = applicableRate?.ClosedToDeparture ?? false,
                Message = availableRooms >= request.NumberOfRooms 
                    ? $"{availableRooms} rooms available" 
                    : "Not enough rooms available for selected dates"
            };

            return Ok(response);
        }
    }
}
