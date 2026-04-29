using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System.Text.Json;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsManagementController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<RoomsManagementController> _logger;

        public RoomsManagementController(HotelDbContext context, ILogger<RoomsManagementController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ROOM TYPES ENDPOINTS
        [HttpGet("room-types")]
        public async Task<IActionResult> GetRoomTypes()
        {
            try
            {
                var roomTypes = await _context.RoomTypes
                    .Where(rt => rt.IsActive)
                    .OrderBy(rt => rt.Name)
                    .Select(rt => new
                    {
                        rt.Id,
                        rt.Name,
                        rt.Code,
                        rt.HotelId,
                        rt.Description,
                        rt.MaxOccupancy,
                        rt.MaximumAdults,
                        rt.MaximumChildren
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = roomTypes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room types");
                return StatusCode(500, new { success = false, message = "Error retrieving room types" });
            }
        }

        // ROOM RATES ENDPOINTS
        [HttpGet("room-rates")]
        public async Task<IActionResult> GetRoomRates([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.RoomRates.Include(r => r.RoomType).Where(r => r.IsActive);
                
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(r => r.RateName.Contains(search) || r.RateCode.Contains(search));

                var totalCount = await query.CountAsync();
                var rates = await query
                    .OrderBy(r => r.RoomType.Name)
                    .ThenBy(r => r.RateName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = rates, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room rates");
                return StatusCode(500, new { success = false, message = "Error retrieving room rates" });
            }
        }

        [HttpGet("room-rates/{id}")]
        public async Task<IActionResult> GetRoomRate(int id)
        {
            try
            {
                var rate = await _context.RoomRates
                    .Include(r => r.RoomType)
                    .FirstOrDefaultAsync(r => r.Id == id && r.IsActive);

                if (rate == null)
                    return NotFound(new { success = false, message = "Room rate not found" });

                return Ok(new { success = true, data = rate });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room rate");
                return StatusCode(500, new { success = false, message = "Error retrieving room rate" });
            }
        }

        [HttpPost("room-rates")]
        public async Task<IActionResult> CreateRoomRate([FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                decimal ParseDecimal(JsonElement element)
                {
                    try
                    {
                        if (element.ValueKind == JsonValueKind.Number)
                        {
                            return element.GetDecimal();
                        }

                        if (element.ValueKind == JsonValueKind.String)
                        {
                            var raw = element.GetString();
                            return decimal.TryParse(raw, out var parsed) ? parsed : 0;
                        }
                    }
                    catch
                    {
                    }

                    return 0;
                }

                int? ParseNullableInt(JsonElement element)
                {
                    try
                    {
                        if (element.ValueKind == JsonValueKind.Number)
                        {
                            return element.GetInt32();
                        }

                        if (element.ValueKind == JsonValueKind.String)
                        {
                            var raw = element.GetString();
                            return int.TryParse(raw, out var parsed) ? parsed : null;
                        }
                    }
                    catch
                    {
                    }

                    return null;
                }

                bool ParseBool(JsonElement element)
                {
                    try
                    {
                        if (element.ValueKind == JsonValueKind.True) return true;
                        if (element.ValueKind == JsonValueKind.False) return false;
                        if (element.ValueKind == JsonValueKind.String)
                        {
                            var raw = element.GetString();
                            if (bool.TryParse(raw, out var parsedBool)) return parsedBool;
                            if (int.TryParse(raw, out var parsedInt)) return parsedInt != 0;
                        }
                        if (element.ValueKind == JsonValueKind.Number)
                        {
                            return element.GetInt32() != 0;
                        }
                    }
                    catch
                    {
                    }

                    return false;
                }

                // Parse JSON data safely
                string rateName = "";
                string rateCode = "";
                string description = "";
                string season = "Regular";
                int roomTypeId = 0;
                decimal baseRate = 0;
                decimal weekendRate = 0;
                decimal discountRate = 0;
                string days = "";
                DateTime effectiveFrom = DateTime.UtcNow;
                DateTime effectiveTo = DateTime.UtcNow.AddYears(1);
                int? minStay = null;
                int? maxStay = null;
                bool closedToArrival = false;
                bool closedToDeparture = false;
                bool isActive = true;

                if (requestJson.TryGetProperty("rateName", out var rateNameElement))
                {
                    rateName = rateNameElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("rateCode", out var rateCodeElement))
                {
                    rateCode = rateCodeElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("roomTypeId", out var roomTypeIdElement))
                {
                    try
                    {
                        if (roomTypeIdElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        {
                            roomTypeId = roomTypeIdElement.GetInt32();
                        }
                        else
                        {
                            var roomTypeIdStr = roomTypeIdElement.GetString();
                            int.TryParse(roomTypeIdStr, out roomTypeId);
                        }
                    }
                    catch
                    {
                        roomTypeId = 0;
                    }
                }

                if (requestJson.TryGetProperty("description", out var descriptionElement))
                {
                    description = descriptionElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("seasonType", out var seasonElement))
                {
                    season = seasonElement.GetString() ?? "Regular";
                }

                if (requestJson.TryGetProperty("season", out var seasonAltElement))
                {
                    season = seasonAltElement.GetString() ?? season;
                }

                if (requestJson.TryGetProperty("baseRate", out var baseRateElement))
                {
                    baseRate = ParseDecimal(baseRateElement);
                }

                if (requestJson.TryGetProperty("weekendRate", out var weekendRateElement))
                {
                    weekendRate = ParseDecimal(weekendRateElement);
                }

                if (requestJson.TryGetProperty("discountRate", out var discountRateElement))
                {
                    discountRate = ParseDecimal(discountRateElement);
                }

                if (requestJson.TryGetProperty("days", out var daysElement))
                {
                    days = daysElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("minStay", out var minStayElement))
                {
                    minStay = ParseNullableInt(minStayElement);
                }

                if (requestJson.TryGetProperty("maxStay", out var maxStayElement))
                {
                    maxStay = ParseNullableInt(maxStayElement);
                }

                if (requestJson.TryGetProperty("closedToArrival", out var closedToArrivalElement))
                {
                    closedToArrival = ParseBool(closedToArrivalElement);
                }

                if (requestJson.TryGetProperty("closedToDeparture", out var closedToDepartureElement))
                {
                    closedToDeparture = ParseBool(closedToDepartureElement);
                }

                if (requestJson.TryGetProperty("validFrom", out var validFromElement))
                {
                    string validFromStr = validFromElement.GetString() ?? "";
                    if (DateTime.TryParse(validFromStr, out DateTime parsedFrom))
                    {
                        effectiveFrom = parsedFrom;
                    }
                }

                if (requestJson.TryGetProperty("effectiveFrom", out var effectiveFromElement))
                {
                    string effectiveFromStr = effectiveFromElement.GetString() ?? "";
                    if (DateTime.TryParse(effectiveFromStr, out DateTime parsedFrom))
                    {
                        effectiveFrom = parsedFrom;
                    }
                }

                if (requestJson.TryGetProperty("validTo", out var validToElement))
                {
                    string validToStr = validToElement.GetString() ?? "";
                    if (DateTime.TryParse(validToStr, out DateTime parsedTo))
                    {
                        effectiveTo = parsedTo;
                    }
                }

                if (requestJson.TryGetProperty("effectiveTo", out var effectiveToElement))
                {
                    string effectiveToStr = effectiveToElement.GetString() ?? "";
                    if (DateTime.TryParse(effectiveToStr, out DateTime parsedTo))
                    {
                        effectiveTo = parsedTo;
                    }
                }

                if (requestJson.TryGetProperty("isActive", out var isActiveElement))
                {
                    isActive = isActiveElement.GetBoolean();
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(rateName))
                {
                    return BadRequest(new { success = false, message = "Rate name is required" });
                }

                if (string.IsNullOrWhiteSpace(rateCode))
                {
                    return BadRequest(new { success = false, message = "Rate code is required" });
                }

                if (roomTypeId <= 0)
                {
                    return BadRequest(new { success = false, message = "Room type is required" });
                }

                var roomType = await _context.RoomTypes
                    .FirstOrDefaultAsync(rt => rt.Id == roomTypeId && rt.IsActive == true);

                if (roomType == null)
                {
                    return BadRequest(new { success = false, message = "Invalid room type selected" });
                }

                // Check if rate code already exists
                var existingRate = await _context.RoomRates.AnyAsync(r => r.RateCode == rateCode && r.IsActive == true);
                if (existingRate)
                {
                    return BadRequest(new { success = false, message = "Rate code already exists" });
                }

                var rate = new RoomRates
                {
                    RoomTypeId = roomType.Id,
                    RateName = rateName,
                    RateCode = rateCode,
                    Description = description,
                    BaseRate = baseRate,
                    WeekendRate = weekendRate,
                    DiscountRate = discountRate,
                    RateMonWed = 0,
                    RateThuFri = 0,
                    RateSatSun = 0,
                    Days = days,
                    MinStay = minStay,
                    MaxStay = maxStay,
                    ClosedToArrival = closedToArrival,
                    ClosedToDeparture = closedToDeparture,
                    SeasonalRate = weekendRate, // Use weekend rate as seasonal rate
                    Season = season,
                    EffectiveFrom = effectiveFrom,
                    EffectiveTo = effectiveTo,
                    Currency = "PKR",
                    IncludesBreakfast = false,
                    IncludesTax = false,
                    TaxPercentage = 0,
                    Terms = "",
                    IsActive = isActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.RoomRates.Add(rate);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created room rate: {rateName} with code: {rateCode}");
                return CreatedAtAction(nameof(GetRoomRate), new { id = rate.Id },
                    new { success = true, data = rate, message = "Room rate created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room rate");
                return StatusCode(500, new { success = false, message = "Error creating room rate" });
            }
        }

        [HttpPut("room-rates/{id}")]
        public async Task<IActionResult> UpdateRoomRate(int id, [FromBody] RoomRates rate)
        {
            try
            {
                var existingRate = await _context.RoomRates.FindAsync(id);
                if (existingRate == null || !existingRate.IsActive)
                    return NotFound(new { success = false, message = "Room rate not found" });

                // Update properties
                existingRate.RateName = rate.RateName;
                existingRate.Description = rate.Description;
                existingRate.BaseRate = rate.BaseRate;
                existingRate.WeekendRate = rate.WeekendRate;
                existingRate.DiscountRate = rate.DiscountRate;
                existingRate.RateMonWed = 0;
                existingRate.RateThuFri = 0;
                existingRate.RateSatSun = 0;
                existingRate.Days = rate.Days;
                existingRate.MinStay = rate.MinStay;
                existingRate.MaxStay = rate.MaxStay;
                existingRate.ClosedToArrival = rate.ClosedToArrival;
                existingRate.ClosedToDeparture = rate.ClosedToDeparture;
                existingRate.SeasonalRate = rate.SeasonalRate;
                existingRate.Season = rate.Season;
                existingRate.EffectiveFrom = rate.EffectiveFrom;
                existingRate.EffectiveTo = rate.EffectiveTo;
                existingRate.Currency = rate.Currency;
                existingRate.IncludesBreakfast = rate.IncludesBreakfast;
                existingRate.IncludesTax = rate.IncludesTax;
                existingRate.TaxPercentage = rate.TaxPercentage;
                existingRate.Terms = rate.Terms;
                existingRate.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Room rate updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room rate");
                return StatusCode(500, new { success = false, message = "Error updating room rate" });
            }
        }

        [HttpDelete("room-rates/{id}")]
        public async Task<IActionResult> DeleteRoomRate(int id)
        {
            try
            {
                var rate = await _context.RoomRates.FindAsync(id);
                if (rate == null || !rate.IsActive)
                    return NotFound(new { success = false, message = "Room rate not found" });

                rate.IsActive = false;
                rate.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Room rate deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room rate");
                return StatusCode(500, new { success = false, message = "Error deleting room rate" });
            }
        }

        // ROOM AMENITIES ENDPOINTS
        [HttpGet("room-amenities")]
        public async Task<IActionResult> GetRoomAmenities([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string category = "", [FromQuery] int? roomTypeId = null, [FromQuery] int? hotelId = null)
        {
            try
            {
                var query = _context.RoomAmenities
                    .Include(a => a.RoomType)
                    .ThenInclude(rt => rt.Hotel)
                    .Where(a => a.IsActive);
                
                if (!string.IsNullOrEmpty(category))
                    query = query.Where(a => a.Category == category);

                if (roomTypeId.HasValue)
                    query = query.Where(a => a.RoomTypeId == roomTypeId.Value);

                if (hotelId.HasValue)
                    query = query.Where(a => a.RoomType != null && a.RoomType.HotelId == hotelId.Value);

                var totalCount = await query.CountAsync();

                var amenities = await query
                    .OrderBy(a => a.Category)
                    .ThenBy(a => a.DisplayOrder)
                    .ThenBy(a => a.AmenityName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(a => new
                    {
                        a.Id,
                        a.AmenityName,
                        a.AmenityCode,
                        a.Description,
                        a.Category,
                        a.RoomTypeId,
                        RoomTypeName = a.RoomType != null ? a.RoomType.Name : "",
                        HotelId = a.RoomType != null ? a.RoomType.HotelId : (int?)null,
                        HotelName = a.RoomType != null && a.RoomType.Hotel != null ? a.RoomType.Hotel.HotelName : "",
                        a.IsChargeable,
                        a.ChargeAmount,
                        a.ChargeType,
                        a.IsAvailable,
                        a.IsActive,
                        a.CreatedAt,
                        a.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = amenities, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room amenities");
                return StatusCode(500, new { success = false, message = "Error retrieving room amenities" });
            }
        }

        [HttpPost("room-amenities")]
        public async Task<IActionResult> CreateRoomAmenity([FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                // Parse JSON data safely
                string amenityName = "";
                string amenityCode = "";
                string description = "";
                string category = "";
                int? roomTypeId = null;
                bool isChargeable = false;
                decimal chargeAmount = 0;
                string chargeType = "";
                bool isAvailable = true;
                bool isActive = true;

                if (requestJson.TryGetProperty("amenityName", out var amenityNameElement))
                {
                    amenityName = amenityNameElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("amenityCode", out var amenityCodeElement))
                {
                    amenityCode = amenityCodeElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("description", out var descriptionElement))
                {
                    description = descriptionElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("category", out var categoryElement))
                {
                    category = categoryElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("roomTypeId", out var roomTypeIdElement))
                {
                    try
                    {
                        if (roomTypeIdElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        {
                            roomTypeId = roomTypeIdElement.GetInt32();
                        }
                        else
                        {
                            var roomTypeIdStr = roomTypeIdElement.GetString();
                            if (int.TryParse(roomTypeIdStr, out var parsedRoomTypeId))
                                roomTypeId = parsedRoomTypeId;
                        }
                    }
                    catch
                    {
                        roomTypeId = null;
                    }
                }

                if (requestJson.TryGetProperty("isChargeable", out var isChargeableElement))
                {
                    isChargeable = isChargeableElement.GetBoolean();
                }

                if (requestJson.TryGetProperty("chargeAmount", out var chargeAmountElement))
                {
                    string chargeAmountStr = chargeAmountElement.GetString() ?? "0";
                    decimal.TryParse(chargeAmountStr, out chargeAmount);
                }

                if (requestJson.TryGetProperty("chargeType", out var chargeTypeElement))
                {
                    chargeType = chargeTypeElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("isAvailable", out var isAvailableElement))
                {
                    isAvailable = isAvailableElement.GetBoolean();
                }

                if (requestJson.TryGetProperty("isActive", out var isActiveElement))
                {
                    isActive = isActiveElement.GetBoolean();
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(amenityName))
                {
                    return BadRequest(new { success = false, message = "Amenity name is required" });
                }

                if (string.IsNullOrWhiteSpace(amenityCode))
                {
                    return BadRequest(new { success = false, message = "Amenity code is required" });
                }

                // Check if amenity code already exists
                var existingAmenity = await _context.RoomAmenities.AnyAsync(a => a.AmenityCode == amenityCode && a.IsActive == true);
                if (existingAmenity)
                {
                    return BadRequest(new { success = false, message = "Amenity code already exists" });
                }

                var amenity = new RoomAmenities
                {
                    AmenityName = amenityName,
                    AmenityCode = amenityCode,
                    Description = description,
                    Category = category,
                    RoomTypeId = roomTypeId,
                    IsChargeable = isChargeable,
                    ChargeAmount = chargeAmount,
                    ChargeType = chargeType,
                    IsAvailable = isAvailable,
                    ImagePath = "",
                    DisplayOrder = 0,
                    Specifications = "",
                    IsActive = isActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.RoomAmenities.Add(amenity);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created room amenity: {amenityName} with code: {amenityCode}");
                return Ok(new { success = true, data = amenity, message = "Room amenity created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room amenity");
                return StatusCode(500, new { success = false, message = "Error creating room amenity" });
            }
        }

        [HttpPut("room-amenities/{id}")]
        public async Task<IActionResult> UpdateRoomAmenity(int id, [FromBody] RoomAmenities updatedAmenity)
        {
            try
            {
                var amenity = await _context.RoomAmenities.FindAsync(id);
                if (amenity == null)
                {
                    return NotFound(new { success = false, message = "Room amenity not found" });
                }

                // Update properties from the model
                if (!string.IsNullOrEmpty(updatedAmenity.AmenityName))
                    amenity.AmenityName = updatedAmenity.AmenityName;
                
                if (!string.IsNullOrEmpty(updatedAmenity.AmenityCode))
                    amenity.AmenityCode = updatedAmenity.AmenityCode;
                
                amenity.Description = updatedAmenity.Description ?? "";
                amenity.Category = updatedAmenity.Category ?? "";
                amenity.RoomTypeId = updatedAmenity.RoomTypeId;
                amenity.IsChargeable = updatedAmenity.IsChargeable;
                amenity.ChargeAmount = updatedAmenity.ChargeAmount;
                amenity.ChargeType = updatedAmenity.ChargeType ?? "";
                amenity.IsAvailable = updatedAmenity.IsAvailable;
                amenity.IsActive = updatedAmenity.IsActive;
                
                // Keep existing values for optional fields if not provided
                if (!string.IsNullOrEmpty(updatedAmenity.ImagePath))
                    amenity.ImagePath = updatedAmenity.ImagePath;
                
                if (updatedAmenity.DisplayOrder > 0)
                    amenity.DisplayOrder = updatedAmenity.DisplayOrder;
                
                if (!string.IsNullOrEmpty(updatedAmenity.Specifications))
                    amenity.Specifications = updatedAmenity.Specifications;

                amenity.UpdatedAt = DateTime.UtcNow;
                _context.Entry(amenity).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = amenity, message = "Room amenity updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room amenity");
                return StatusCode(500, new { success = false, message = "Error updating room amenity" });
            }
        }

        [HttpDelete("room-amenities/{id}")]
        public async Task<IActionResult> DeleteRoomAmenity(int id)
        {
            try
            {
                var amenity = await _context.RoomAmenities.FindAsync(id);
                if (amenity == null)
                {
                    return NotFound(new { success = false, message = "Room amenity not found" });
                }

                // Soft delete - set IsActive to false
                amenity.IsActive = false;
                amenity.UpdatedAt = DateTime.UtcNow;
                _context.Entry(amenity).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Deleted room amenity: {amenity.AmenityName} with ID: {id}");
                return Ok(new { success = true, message = "Room amenity deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting room amenity with ID: {id}");
                return StatusCode(500, new { success = false, message = $"Error deleting room amenity with ID: {id}" });
            }
        }

        // FLOOR MANAGEMENT ENDPOINTS
        [HttpGet("floor-management")]
        public async Task<IActionResult> GetFloorManagement()
        {
            try
            {
                var floors = await _context.FloorManagements
                    .Where(f => f.IsActive)
                    .OrderBy(f => f.FloorNumber)
                    .ToListAsync();

                return Ok(new { success = true, data = floors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving floor management");
                return StatusCode(500, new { success = false, message = "Error retrieving floor management" });
            }
        }

        [HttpPost("floor-management")]
        public async Task<IActionResult> CreateFloorManagement([FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                // Parse JSON data safely
                int floorNumber = 0;
                string floorName = "";
                string description = "";
                int totalRooms = 0;
                int availableRooms = 0;
                int occupiedRooms = 0;
                int outOfOrderRooms = 0;
                string floorManager = "";
                string housekeepingSupervisor = "";
                bool hasElevatorAccess = false;
                bool hasFireExit = false;
                string safetyFeatures = "";
                string specialFeatures = "";

                if (requestJson.TryGetProperty("floorNumber", out var floorNumberElement))
                {
                    if (floorNumberElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        int.TryParse(floorNumberElement.GetString(), out floorNumber);
                    }
                    else if (floorNumberElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        floorNumber = floorNumberElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("floorName", out var floorNameElement))
                {
                    floorName = floorNameElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("description", out var descriptionElement))
                {
                    description = descriptionElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("totalRooms", out var totalRoomsElement))
                {
                    if (totalRoomsElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        int.TryParse(totalRoomsElement.GetString(), out totalRooms);
                    }
                    else if (totalRoomsElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        totalRooms = totalRoomsElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("availableRooms", out var availableRoomsElement))
                {
                    if (availableRoomsElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        int.TryParse(availableRoomsElement.GetString(), out availableRooms);
                    }
                    else if (availableRoomsElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        availableRooms = availableRoomsElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("occupiedRooms", out var occupiedRoomsElement))
                {
                    if (occupiedRoomsElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        int.TryParse(occupiedRoomsElement.GetString(), out occupiedRooms);
                    }
                    else if (occupiedRoomsElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        occupiedRooms = occupiedRoomsElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("outOfOrderRooms", out var outOfOrderRoomsElement))
                {
                    if (outOfOrderRoomsElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        int.TryParse(outOfOrderRoomsElement.GetString(), out outOfOrderRooms);
                    }
                    else if (outOfOrderRoomsElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        outOfOrderRooms = outOfOrderRoomsElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("floorManager", out var floorManagerElement))
                {
                    floorManager = floorManagerElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("housekeepingSupervisor", out var housekeepingSupervisorElement))
                {
                    housekeepingSupervisor = housekeepingSupervisorElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("hasElevatorAccess", out var hasElevatorAccessElement))
                {
                    hasElevatorAccess = hasElevatorAccessElement.GetBoolean();
                }

                if (requestJson.TryGetProperty("hasFireExit", out var hasFireExitElement))
                {
                    hasFireExit = hasFireExitElement.GetBoolean();
                }

                if (requestJson.TryGetProperty("safetyFeatures", out var safetyFeaturesElement))
                {
                    safetyFeatures = safetyFeaturesElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("specialFeatures", out var specialFeaturesElement))
                {
                    specialFeatures = specialFeaturesElement.GetString() ?? "";
                }

                // Validate required fields
                if (floorNumber <= 0)
                {
                    return BadRequest(new { success = false, message = "Valid floor number is required" });
                }

                if (string.IsNullOrWhiteSpace(floorName))
                {
                    return BadRequest(new { success = false, message = "Floor name is required" });
                }

                // Check if floor number already exists
                var existingFloor = await _context.FloorManagements.AnyAsync(f => f.FloorNumber == floorNumber && f.IsActive);
                if (existingFloor)
                    return BadRequest(new { success = false, message = "Floor number already exists" });

                var floor = new FloorManagement
                {
                    FloorNumber = floorNumber,
                    FloorName = floorName,
                    Description = description,
                    TotalRooms = totalRooms,
                    AvailableRooms = availableRooms,
                    OccupiedRooms = occupiedRooms,
                    OutOfOrderRooms = outOfOrderRooms,
                    FloorManager = floorManager,
                    HousekeepingSupervisor = housekeepingSupervisor,
                    HasElevatorAccess = hasElevatorAccess,
                    HasFireExit = hasFireExit,
                    SafetyFeatures = safetyFeatures,
                    SpecialFeatures = specialFeatures,
                    FloorPlanPath = "",
                    FloorImagePath = "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.FloorManagements.Add(floor);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created floor: {floorName} with number: {floorNumber}");
                return Ok(new { success = true, data = floor, message = "Floor management created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating floor management");
                return StatusCode(500, new { success = false, message = "Error creating floor management" });
            }
        }

        [HttpPut("floor-management/{id}")]
        public async Task<IActionResult> UpdateFloorManagement(int id, [FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                var existingFloor = await _context.FloorManagements.FindAsync(id);
                if (existingFloor == null || !existingFloor.IsActive)
                    return NotFound(new { success = false, message = "Floor not found" });

                // Parse and update fields from JSON
                if (requestJson.TryGetProperty("floorName", out var floorNameElement))
                {
                    var floorName = floorNameElement.GetString();
                    if (!string.IsNullOrWhiteSpace(floorName))
                        existingFloor.FloorName = floorName;
                }

                if (requestJson.TryGetProperty("description", out var descriptionElement))
                {
                    existingFloor.Description = descriptionElement.GetString() ?? existingFloor.Description;
                }

                if (requestJson.TryGetProperty("totalRooms", out var totalRoomsElement))
                {
                    if (totalRoomsElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (int.TryParse(totalRoomsElement.GetString(), out int totalRooms))
                            existingFloor.TotalRooms = totalRooms;
                    }
                    else if (totalRoomsElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        existingFloor.TotalRooms = totalRoomsElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("availableRooms", out var availableRoomsElement))
                {
                    if (availableRoomsElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (int.TryParse(availableRoomsElement.GetString(), out int availableRooms))
                            existingFloor.AvailableRooms = availableRooms;
                    }
                    else if (availableRoomsElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        existingFloor.AvailableRooms = availableRoomsElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("occupiedRooms", out var occupiedRoomsElement))
                {
                    if (occupiedRoomsElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (int.TryParse(occupiedRoomsElement.GetString(), out int occupiedRooms))
                            existingFloor.OccupiedRooms = occupiedRooms;
                    }
                    else if (occupiedRoomsElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        existingFloor.OccupiedRooms = occupiedRoomsElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("outOfOrderRooms", out var outOfOrderRoomsElement))
                {
                    if (outOfOrderRoomsElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (int.TryParse(outOfOrderRoomsElement.GetString(), out int outOfOrderRooms))
                            existingFloor.OutOfOrderRooms = outOfOrderRooms;
                    }
                    else if (outOfOrderRoomsElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        existingFloor.OutOfOrderRooms = outOfOrderRoomsElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("floorManager", out var floorManagerElement))
                {
                    existingFloor.FloorManager = floorManagerElement.GetString() ?? existingFloor.FloorManager;
                }

                if (requestJson.TryGetProperty("housekeepingSupervisor", out var housekeepingSupervisorElement))
                {
                    existingFloor.HousekeepingSupervisor = housekeepingSupervisorElement.GetString() ?? existingFloor.HousekeepingSupervisor;
                }

                if (requestJson.TryGetProperty("hasElevatorAccess", out var hasElevatorAccessElement))
                {
                    existingFloor.HasElevatorAccess = hasElevatorAccessElement.GetBoolean();
                }

                if (requestJson.TryGetProperty("hasFireExit", out var hasFireExitElement))
                {
                    existingFloor.HasFireExit = hasFireExitElement.GetBoolean();
                }

                if (requestJson.TryGetProperty("safetyFeatures", out var safetyFeaturesElement))
                {
                    existingFloor.SafetyFeatures = safetyFeaturesElement.GetString() ?? existingFloor.SafetyFeatures;
                }

                if (requestJson.TryGetProperty("specialFeatures", out var specialFeaturesElement))
                {
                    existingFloor.SpecialFeatures = specialFeaturesElement.GetString() ?? existingFloor.SpecialFeatures;
                }

                existingFloor.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Floor management updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating floor management");
                return StatusCode(500, new { success = false, message = "Error updating floor management" });
            }
        }

        [HttpDelete("floor-management/{id}")]
        public async Task<IActionResult> DeleteFloorManagement(int id)
        {
            try
            {
                var floor = await _context.FloorManagements.FindAsync(id);
                if (floor == null)
                    return NotFound(new { success = false, message = "Floor not found" });

                // Soft delete - set IsActive to false
                floor.IsActive = false;
                floor.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Deleted floor: {floor.FloorName} with ID: {id}");
                return Ok(new { success = true, message = "Floor deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting floor with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error deleting floor" });
            }
        }

        // FLOORS ENDPOINTS (Alternative routes for frontend compatibility)
        [HttpGet("floors")]
        public async Task<IActionResult> GetFloors([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.FloorManagements.Where(f => f.IsActive);
                
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(f => f.FloorName.Contains(search) || f.Description.Contains(search));

                var totalCount = await query.CountAsync();
                var floors = await query
                    .OrderBy(f => f.FloorNumber)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = floors, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving floors");
                return StatusCode(500, new { success = false, message = "Error retrieving floors" });
            }
        }

        [HttpGet("floors/{id}")]
        public async Task<IActionResult> GetFloor(int id)
        {
            try
            {
                var floor = await _context.FloorManagements
                    .FirstOrDefaultAsync(f => f.Id == id && f.IsActive);

                if (floor == null)
                    return NotFound(new { success = false, message = "Floor not found" });

                return Ok(new { success = true, data = floor });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving floor");
                return StatusCode(500, new { success = false, message = "Error retrieving floor" });
            }
        }

        [HttpPost("floors")]
        public async Task<IActionResult> CreateFloor([FromForm] FloorManagement floor, IFormFile floorImage)
        {
            try
            {
                _logger.LogInformation($"Received floor data: FloorNumber={floor?.FloorNumber}, FloorName={floor?.FloorName}, Manager={floor?.FloorManager}");
                
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );
                    _logger.LogWarning("ModelState validation failed: {Errors}", System.Text.Json.JsonSerializer.Serialize(errors));
                    return BadRequest(new { success = false, message = "Invalid data", errors = errors });
                }

                if (floor == null)
                    return BadRequest(new { success = false, message = "Floor data is required" });

                // Check if floor number already exists
                var existingFloor = await _context.FloorManagements.AnyAsync(f => f.FloorNumber == floor.FloorNumber && f.IsActive);
                if (existingFloor)
                    return BadRequest(new { success = false, message = "Floor number already exists" });

                // Handle image upload
                if (floorImage != null && floorImage.Length > 0)
                {
                    try
                    {
                        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "floors");
                        Directory.CreateDirectory(uploadsFolder);
                        
                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + floorImage.FileName;
                        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await floorImage.CopyToAsync(fileStream);
                        }
                        
                        floor.FloorImagePath = uniqueFileName;
                        _logger.LogInformation($"Floor image uploaded: {uniqueFileName}");
                    }
                    catch (Exception imageEx)
                    {
                        _logger.LogError(imageEx, "Error uploading floor image");
                        // Continue without image if upload fails
                    }
                }

                floor.IsActive = true;
                floor.CreatedAt = DateTime.UtcNow;
                floor.UpdatedAt = DateTime.UtcNow;

                _context.FloorManagements.Add(floor);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created floor: {floor.FloorName} with number: {floor.FloorNumber}");
                return CreatedAtAction(nameof(GetFloor), new { id = floor.Id },
                    new { success = true, data = floor, message = "Floor created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating floor: {Message}", ex.Message);
                return StatusCode(500, new { success = false, message = $"Error creating floor: {ex.Message}" });
            }
        }

        [HttpPut("floors/{id}")]
        public async Task<IActionResult> UpdateFloor(int id, [FromForm] FloorManagement floor, IFormFile floorImage)
        {
            try
            {
                var existingFloor = await _context.FloorManagements.FindAsync(id);
                if (existingFloor == null || !existingFloor.IsActive)
                    return NotFound(new { success = false, message = "Floor not found" });

                // Check if floor number already exists (excluding current floor)
                var duplicateFloor = await _context.FloorManagements
                    .AnyAsync(f => f.FloorNumber == floor.FloorNumber && f.Id != id && f.IsActive);
                if (duplicateFloor)
                    return BadRequest(new { success = false, message = "Floor number already exists" });

                // Handle image upload for update
                if (floorImage != null && floorImage.Length > 0)
                {
                    try
                    {
                        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "floors");
                        Directory.CreateDirectory(uploadsFolder);
                        
                        // Delete old image if exists
                        if (!string.IsNullOrEmpty(existingFloor.FloorImagePath))
                        {
                            var oldImagePath = Path.Combine(uploadsFolder, existingFloor.FloorImagePath);
                            if (System.IO.File.Exists(oldImagePath))
                            {
                                System.IO.File.Delete(oldImagePath);
                            }
                        }
                        
                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + floorImage.FileName;
                        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await floorImage.CopyToAsync(fileStream);
                        }
                        
                        existingFloor.FloorImagePath = uniqueFileName;
                        _logger.LogInformation($"Floor image updated: {uniqueFileName}");
                    }
                    catch (Exception imageEx)
                    {
                        _logger.LogError(imageEx, "Error updating floor image");
                        // Continue without updating image if upload fails
                    }
                }

                // Update properties
                existingFloor.FloorNumber = floor.FloorNumber;
                existingFloor.FloorName = floor.FloorName;
                existingFloor.Description = floor.Description;
                existingFloor.TotalRooms = floor.TotalRooms;
                existingFloor.AvailableRooms = floor.AvailableRooms;
                existingFloor.OccupiedRooms = floor.OccupiedRooms;
                existingFloor.OutOfOrderRooms = floor.OutOfOrderRooms;
                existingFloor.FloorManager = floor.FloorManager;
                existingFloor.HousekeepingSupervisor = floor.HousekeepingSupervisor;
                existingFloor.HasElevatorAccess = floor.HasElevatorAccess;
                existingFloor.HasFireExit = floor.HasFireExit;
                existingFloor.SafetyFeatures = floor.SafetyFeatures;
                existingFloor.SpecialFeatures = floor.SpecialFeatures;
                existingFloor.FloorPlanPath = floor.FloorPlanPath;
                existingFloor.IsActive = floor.IsActive;
                existingFloor.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                
                _logger.LogInformation($"Updated floor: {existingFloor.FloorName} with ID: {id}");
                return Ok(new { success = true, data = existingFloor, message = "Floor updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating floor");
                return StatusCode(500, new { success = false, message = "Error updating floor" });
            }
        }

        [HttpDelete("floors/{id}")]
        public async Task<IActionResult> DeleteFloor(int id)
        {
            try
            {
                var floor = await _context.FloorManagements.FindAsync(id);
                if (floor == null)
                    return NotFound(new { success = false, message = "Floor not found" });

                // Soft delete - set IsActive to false
                floor.IsActive = false;
                floor.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Deleted floor: {floor.FloorName} with ID: {id}");
                return Ok(new { success = true, message = "Floor deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting floor with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error deleting floor" });
            }
        }

        // ROOM AMENITY MAPPING ENDPOINTS
        [HttpGet("room-amenity-mapping/{roomId}")]
        public async Task<IActionResult> GetRoomAmenityMapping(int roomId)
        {
            try
            {
                var mappings = await _context.RoomAmenityMappings
                    .Include(m => m.Room)
                    .Include(m => m.Amenity)
                    .Where(m => m.RoomId == roomId && m.IsActive)
                    .ToListAsync();

                return Ok(new { success = true, data = mappings });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room amenity mapping");
                return StatusCode(500, new { success = false, message = "Error retrieving room amenity mapping" });
            }
        }

        [HttpPost("room-amenity-mapping")]
        public async Task<IActionResult> CreateRoomAmenityMapping([FromBody] RoomAmenityMapping mapping)
        {
            try
            {
                mapping.IsActive = true;
                mapping.CreatedAt = DateTime.UtcNow;
                mapping.UpdatedAt = DateTime.UtcNow;

                _context.RoomAmenityMappings.Add(mapping);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = mapping, message = "Room amenity mapping created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room amenity mapping");
                return StatusCode(500, new { success = false, message = "Error creating room amenity mapping" });
            }
        }

        // ROOMS ENDPOINTS
        [HttpGet("rooms")]
        public async Task<IActionResult> GetRooms(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string search = "",
            [FromQuery] int? roomTypeId = null,
            [FromQuery] int? hotelId = null)
        {
            try
            {
                var query = _context.Rooms
                    .Include(r => r.RoomType)
                    .ThenInclude(rt => rt.Hotel)
                    .AsQueryable();

                if (roomTypeId.HasValue)
                    query = query.Where(r => r.RoomTypeId == roomTypeId.Value);

                if (hotelId.HasValue)
                    query = query.Where(r => r.RoomType.HotelId == hotelId.Value);
                
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(r => r.RoomNumber.Contains(search) || r.RoomType.Name.Contains(search) || r.RoomType.Hotel.HotelName.Contains(search));

                var totalCount = await query.CountAsync();
                var rooms = await query
                    .OrderBy(r => r.RoomNumber)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(r => new
                    {
                        r.Id,
                        r.RoomNumber,
                        r.RoomTypeId,
                        r.BlockFloorId,
                        RoomType = r.RoomType.Name,
                        HotelId = r.RoomType.HotelId,
                        HotelName = r.RoomType.Hotel.HotelName,
                        r.FloorNumber,
                        Floor = r.FloorNumber,
                        r.Block,
                        BlockName = r.Block,
                        r.Status,
                        r.RoomSize,
                        r.RoomSizeUnit,
                        r.MaxAdults,
                        r.MaxChildren,
                        r.BaseOccupancy,
                        r.MaxAgeOfChild,
                        r.SingleBedCount,
                        r.DoubleBedCount,
                        r.QueenBedCount,
                        r.KingBedCount,
                        r.SofaBedCount,
                        MaxOccupancy = r.MaxAdults,
                        r.BasePrice,
                        CurrentRate = r.BasePrice,
                        r.Description,
                        r.LastMaintenanceDate,
                        r.CreatedAt,
                        r.UpdatedAt
                    })
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {rooms.Count} rooms from database");
                return Ok(new { success = true, data = rooms, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving rooms");
                return StatusCode(500, new { success = false, message = "Error retrieving rooms" });
            }
        }

        [HttpGet("rooms/{id}")]
        public async Task<IActionResult> GetRoom(int id)
        {
            try
            {
                var room = await _context.Rooms
                    .Include(r => r.RoomType)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (room == null)
                    return NotFound(new { success = false, message = "Room not found" });

                var roomData = new
                {
                    room.Id,
                    room.RoomNumber,
                    room.RoomTypeId,
                    room.BlockFloorId,
                    RoomType = room.RoomType?.Name,
                    room.FloorNumber,
                    room.Block,
                    room.Status,
                    room.RoomSize,
                    room.RoomSizeUnit,
                    room.MaxAdults,
                    room.BasePrice,
                    room.Description,
                    room.LastMaintenanceDate,
                    room.CreatedAt,
                    room.UpdatedAt
                };

                return Ok(new { success = true, data = roomData });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room");
                return StatusCode(500, new { success = false, message = "Error retrieving room" });
            }
        }

        [HttpGet("rooms/by-roomtype")]
        public async Task<IActionResult> GetRoomsByHotelAndRoomType([FromQuery] int hotelId, [FromQuery] int roomTypeId)
        {
            try
            {
                var roomType = await _context.RoomTypes
                    .AsNoTracking()
                    .FirstOrDefaultAsync(rt => rt.Id == roomTypeId);

                if (roomType == null)
                    return NotFound(new { success = false, message = "Room type not found" });

                if (roomType.HotelId != hotelId)
                    return BadRequest(new { success = false, message = "Room type does not belong to selected hotel" });

                var rooms = await _context.Rooms
                    .AsNoTracking()
                    .Where(r => r.RoomTypeId == roomTypeId)
                    .OrderBy(r => r.RoomNumber)
                    .Select(r => new { r.Id, r.RoomNumber })
                    .ToListAsync();

                return Ok(new { success = true, data = rooms, totalCount = rooms.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving rooms for hotelId {HotelId}, roomTypeId {RoomTypeId}", hotelId, roomTypeId);
                return StatusCode(500, new { success = false, message = "Error retrieving rooms" });
            }
        }

        [HttpPost("rooms")]
        public async Task<IActionResult> CreateRoom([FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                // Parse JSON data safely
                string roomNumber = "";
                int roomTypeId = 0;
                int? blockFloorId = null;
                int floorNumber = 0;
                string block = "";
                string status = "Available";
                int maxOccupancy = 2;
                decimal? roomSize = null;
                string roomSizeUnit = "Sq Ft";
                decimal currentRate = 0;
                string description = "";

                if (requestJson.TryGetProperty("roomNumber", out var roomNumberElement))
                {
                    roomNumber = roomNumberElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("roomTypeId", out var roomTypeIdElement))
                {
                    if (roomTypeIdElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        int.TryParse(roomTypeIdElement.GetString(), out roomTypeId);
                    }
                    else if (roomTypeIdElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        roomTypeId = roomTypeIdElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("blockFloorId", out var blockFloorIdElement))
                {
                    if (blockFloorIdElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (int.TryParse(blockFloorIdElement.GetString(), out var parsed))
                            blockFloorId = parsed;
                    }
                    else if (blockFloorIdElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        blockFloorId = blockFloorIdElement.GetInt32();
                    }
                    else if (blockFloorIdElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                    {
                        blockFloorId = null;
                    }
                }

                if (requestJson.TryGetProperty("floorNumber", out var floorNumberElement))
                {
                    if (floorNumberElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        int.TryParse(floorNumberElement.GetString(), out floorNumber);
                    }
                    else if (floorNumberElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        floorNumber = floorNumberElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("block", out var blockElement))
                {
                    block = blockElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("status", out var statusElement))
                {
                    status = statusElement.GetString() ?? "Available";
                }

                if (requestJson.TryGetProperty("maxOccupancy", out var maxOccupancyElement))
                {
                    if (maxOccupancyElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        int.TryParse(maxOccupancyElement.GetString(), out maxOccupancy);
                    }
                    else if (maxOccupancyElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        maxOccupancy = maxOccupancyElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("roomSize", out var roomSizeElement))
                {
                    if (roomSizeElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (decimal.TryParse(roomSizeElement.GetString(), out var parsed))
                            roomSize = parsed;
                    }
                    else if (roomSizeElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        roomSize = roomSizeElement.GetDecimal();
                    }
                    else if (roomSizeElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                    {
                        roomSize = null;
                    }
                }

                if (requestJson.TryGetProperty("roomSizeUnit", out var roomSizeUnitElement))
                {
                    roomSizeUnit = roomSizeUnitElement.GetString() ?? roomSizeUnit;
                }

                if (requestJson.TryGetProperty("currentRate", out var currentRateElement))
                {
                    if (currentRateElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        decimal.TryParse(currentRateElement.GetString(), out currentRate);
                    }
                    else if (currentRateElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        currentRate = currentRateElement.GetDecimal();
                    }
                }

                if (requestJson.TryGetProperty("description", out var descriptionElement))
                {
                    description = descriptionElement.GetString() ?? "";
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(roomNumber))
                {
                    return BadRequest(new { success = false, message = "Room number is required" });
                }

                if (roomTypeId <= 0)
                {
                    return BadRequest(new { success = false, message = "Valid room type is required" });
                }

                if (blockFloorId.HasValue)
                {
                    var floor = await _context.BlockFloors.FindAsync(blockFloorId.Value);
                    if (floor == null)
                        return BadRequest(new { success = false, message = "Invalid floor selected" });
                }

                // Check if room number already exists
                var existingRoom = await _context.Rooms.AnyAsync(r => r.RoomNumber == roomNumber);
                if (existingRoom)
                {
                    return BadRequest(new { success = false, message = "Room number already exists" });
                }

                // Verify room type exists
                var roomType = await _context.RoomTypes.FindAsync(roomTypeId);
                if (roomType == null)
                {
                    return BadRequest(new { success = false, message = "Invalid room type selected" });
                }

                var room = new Room
                {
                    RoomNumber = roomNumber,
                    RoomTypeId = roomTypeId,
                    BlockFloorId = blockFloorId,
                    FloorNumber = floorNumber,
                    Block = block,
                    Status = status,
                    RoomSize = roomSize,
                    RoomSizeUnit = roomSizeUnit,
                    MaxAdults = maxOccupancy,
                    BasePrice = currentRate,
                    Description = description,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created room: {roomNumber} on floor {floorNumber}, block {block}");
                return CreatedAtAction(nameof(GetRoom), new { id = room.Id },
                    new { success = true, data = room, message = "Room created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room");
                return StatusCode(500, new { success = false, message = "Error creating room" });
            }
        }

        [HttpPost("rooms/bulk")]
        public async Task<IActionResult> CreateRoomsBulk([FromBody] JsonElement requestJson)
        {
            try
            {
                int hotelId = 0;
                int roomTypeId = 0;
                int quantity = 0;
                int? blockFloorId = null;
                int floorNumber = 0;
                string block = "";
                string status = "Available";
                int maxOccupancy = 2;
                decimal? roomSize = null;
                string roomSizeUnit = "Sq Ft";
                decimal currentRate = 0;
                string description = "";
                DateTime? lastMaintenanceDate = null;

                if (requestJson.TryGetProperty("hotelId", out var hotelIdElement))
                {
                    if (hotelIdElement.ValueKind == JsonValueKind.String)
                        int.TryParse(hotelIdElement.GetString(), out hotelId);
                    else if (hotelIdElement.ValueKind == JsonValueKind.Number)
                        hotelId = hotelIdElement.GetInt32();
                }

                if (requestJson.TryGetProperty("roomTypeId", out var roomTypeIdElement))
                {
                    if (roomTypeIdElement.ValueKind == JsonValueKind.String)
                        int.TryParse(roomTypeIdElement.GetString(), out roomTypeId);
                    else if (roomTypeIdElement.ValueKind == JsonValueKind.Number)
                        roomTypeId = roomTypeIdElement.GetInt32();
                }

                if (requestJson.TryGetProperty("quantity", out var qtyElement))
                {
                    if (qtyElement.ValueKind == JsonValueKind.String)
                        int.TryParse(qtyElement.GetString(), out quantity);
                    else if (qtyElement.ValueKind == JsonValueKind.Number)
                        quantity = qtyElement.GetInt32();
                }

                if (requestJson.TryGetProperty("blockFloorId", out var blockFloorIdElement))
                {
                    if (blockFloorIdElement.ValueKind == JsonValueKind.String)
                    {
                        if (int.TryParse(blockFloorIdElement.GetString(), out var parsed))
                            blockFloorId = parsed;
                    }
                    else if (blockFloorIdElement.ValueKind == JsonValueKind.Number)
                    {
                        blockFloorId = blockFloorIdElement.GetInt32();
                    }
                    else if (blockFloorIdElement.ValueKind == JsonValueKind.Null)
                    {
                        blockFloorId = null;
                    }
                }

                if (requestJson.TryGetProperty("floorNumber", out var floorNumberElement))
                {
                    if (floorNumberElement.ValueKind == JsonValueKind.String)
                        int.TryParse(floorNumberElement.GetString(), out floorNumber);
                    else if (floorNumberElement.ValueKind == JsonValueKind.Number)
                        floorNumber = floorNumberElement.GetInt32();
                }

                if (requestJson.TryGetProperty("block", out var blockElement))
                {
                    block = blockElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("status", out var statusElement))
                {
                    status = statusElement.GetString() ?? "Available";
                }

                if (requestJson.TryGetProperty("maxOccupancy", out var maxOccupancyElement))
                {
                    if (maxOccupancyElement.ValueKind == JsonValueKind.String)
                        int.TryParse(maxOccupancyElement.GetString(), out maxOccupancy);
                    else if (maxOccupancyElement.ValueKind == JsonValueKind.Number)
                        maxOccupancy = maxOccupancyElement.GetInt32();
                }

                if (requestJson.TryGetProperty("roomSize", out var roomSizeElement))
                {
                    if (roomSizeElement.ValueKind == JsonValueKind.String)
                    {
                        if (decimal.TryParse(roomSizeElement.GetString(), out var parsed))
                            roomSize = parsed;
                    }
                    else if (roomSizeElement.ValueKind == JsonValueKind.Number)
                    {
                        roomSize = roomSizeElement.GetDecimal();
                    }
                    else if (roomSizeElement.ValueKind == JsonValueKind.Null)
                    {
                        roomSize = null;
                    }
                }

                if (requestJson.TryGetProperty("roomSizeUnit", out var roomSizeUnitElement))
                {
                    roomSizeUnit = roomSizeUnitElement.GetString() ?? roomSizeUnit;
                }

                if (requestJson.TryGetProperty("currentRate", out var currentRateElement))
                {
                    if (currentRateElement.ValueKind == JsonValueKind.String)
                        decimal.TryParse(currentRateElement.GetString(), out currentRate);
                    else if (currentRateElement.ValueKind == JsonValueKind.Number)
                        currentRate = currentRateElement.GetDecimal();
                }

                if (requestJson.TryGetProperty("description", out var descriptionElement))
                {
                    description = descriptionElement.GetString() ?? "";
                }

                if (requestJson.TryGetProperty("lastMaintenanceDate", out var lastMaintenanceDateElement))
                {
                    if (lastMaintenanceDateElement.ValueKind == JsonValueKind.String)
                    {
                        var dateStr = lastMaintenanceDateElement.GetString();
                        if (DateTime.TryParse(dateStr, out DateTime parsed))
                        {
                            lastMaintenanceDate = parsed;
                        }
                    }
                    else if (lastMaintenanceDateElement.ValueKind == JsonValueKind.Null)
                    {
                        lastMaintenanceDate = null;
                    }
                }

                // Parse new fields for bulk creation
                int maxAdults = maxOccupancy;
                int maxChildren = 0;
                int? baseOccupancy = null;
                int? maxAgeOfChild = null;
                int? singleBedCount = null;
                int? doubleBedCount = null;
                int? queenBedCount = null;
                int? kingBedCount = null;
                int? sofaBedCount = null;

                if (requestJson.TryGetProperty("maxAdults", out var maxAdultsElement))
                {
                    if (maxAdultsElement.ValueKind == JsonValueKind.Number)
                        maxAdults = maxAdultsElement.GetInt32();
                    else if (maxAdultsElement.ValueKind == JsonValueKind.String && int.TryParse(maxAdultsElement.GetString(), out int parsedMaxAdults))
                        maxAdults = parsedMaxAdults;
                }

                if (requestJson.TryGetProperty("maxChildren", out var maxChildrenElement))
                {
                    if (maxChildrenElement.ValueKind == JsonValueKind.Number)
                        maxChildren = maxChildrenElement.GetInt32();
                    else if (maxChildrenElement.ValueKind == JsonValueKind.String && int.TryParse(maxChildrenElement.GetString(), out int parsedMaxChildren))
                        maxChildren = parsedMaxChildren;
                }

                if (requestJson.TryGetProperty("baseOccupancy", out var baseOccupancyElement))
                {
                    if (baseOccupancyElement.ValueKind == JsonValueKind.Number)
                        baseOccupancy = baseOccupancyElement.GetInt32();
                    else if (baseOccupancyElement.ValueKind == JsonValueKind.String && int.TryParse(baseOccupancyElement.GetString(), out int parsedBaseOccupancy))
                        baseOccupancy = parsedBaseOccupancy;
                }

                if (requestJson.TryGetProperty("maxAgeOfChild", out var maxAgeOfChildElement))
                {
                    if (maxAgeOfChildElement.ValueKind == JsonValueKind.Number)
                        maxAgeOfChild = maxAgeOfChildElement.GetInt32();
                    else if (maxAgeOfChildElement.ValueKind == JsonValueKind.String && int.TryParse(maxAgeOfChildElement.GetString(), out int parsedMaxAgeOfChild))
                        maxAgeOfChild = parsedMaxAgeOfChild;
                }

                if (requestJson.TryGetProperty("singleBedCount", out var singleBedCountElement))
                {
                    if (singleBedCountElement.ValueKind == JsonValueKind.Number)
                        singleBedCount = singleBedCountElement.GetInt32();
                    else if (singleBedCountElement.ValueKind == JsonValueKind.String && int.TryParse(singleBedCountElement.GetString(), out int parsedSingleBedCount))
                        singleBedCount = parsedSingleBedCount;
                }

                if (requestJson.TryGetProperty("doubleBedCount", out var doubleBedCountElement))
                {
                    if (doubleBedCountElement.ValueKind == JsonValueKind.Number)
                        doubleBedCount = doubleBedCountElement.GetInt32();
                    else if (doubleBedCountElement.ValueKind == JsonValueKind.String && int.TryParse(doubleBedCountElement.GetString(), out int parsedDoubleBedCount))
                        doubleBedCount = parsedDoubleBedCount;
                }

                if (requestJson.TryGetProperty("queenBedCount", out var queenBedCountElement))
                {
                    if (queenBedCountElement.ValueKind == JsonValueKind.Number)
                        queenBedCount = queenBedCountElement.GetInt32();
                    else if (queenBedCountElement.ValueKind == JsonValueKind.String && int.TryParse(queenBedCountElement.GetString(), out int parsedQueenBedCount))
                        queenBedCount = parsedQueenBedCount;
                }

                if (requestJson.TryGetProperty("kingBedCount", out var kingBedCountElement))
                {
                    if (kingBedCountElement.ValueKind == JsonValueKind.Number)
                        kingBedCount = kingBedCountElement.GetInt32();
                    else if (kingBedCountElement.ValueKind == JsonValueKind.String && int.TryParse(kingBedCountElement.GetString(), out int parsedKingBedCount))
                        kingBedCount = parsedKingBedCount;
                }

                if (requestJson.TryGetProperty("sofaBedCount", out var sofaBedCountElement))
                {
                    if (sofaBedCountElement.ValueKind == JsonValueKind.Number)
                        sofaBedCount = sofaBedCountElement.GetInt32();
                    else if (sofaBedCountElement.ValueKind == JsonValueKind.String && int.TryParse(sofaBedCountElement.GetString(), out int parsedSofaBedCount))
                        sofaBedCount = parsedSofaBedCount;
                }

                if (hotelId <= 0)
                {
                    return BadRequest(new { success = false, message = "Hotel is required" });
                }

                if (roomTypeId <= 0)
                {
                    return BadRequest(new { success = false, message = "Valid room type is required" });
                }

                if (quantity <= 0)
                {
                    return BadRequest(new { success = false, message = "Quantity must be greater than 0" });
                }

                if (quantity > 500)
                {
                    return BadRequest(new { success = false, message = "Quantity is too large" });
                }

                var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == hotelId && h.IsActive);
                if (!hotelExists)
                {
                    return BadRequest(new { success = false, message = "Invalid hotel selected" });
                }

                var roomType = await _context.RoomTypes.FirstOrDefaultAsync(rt => rt.Id == roomTypeId && rt.IsActive);
                if (roomType == null)
                {
                    return BadRequest(new { success = false, message = "Invalid room type selected" });
                }

                if ((roomType.HotelId ?? 0) != 0 && roomType.HotelId != hotelId)
                {
                    return BadRequest(new { success = false, message = "Room type does not belong to selected hotel" });
                }

                if (!requestJson.TryGetProperty("roomNumbers", out var roomNumbersElement) || roomNumbersElement.ValueKind != JsonValueKind.Array)
                {
                    return BadRequest(new { success = false, message = "roomNumbers array is required" });
                }

                var requestedNumbers = roomNumbersElement.EnumerateArray()
                    .Select(e => e.ValueKind == JsonValueKind.String ? (e.GetString() ?? "") : e.ToString())
                    .Select(s => (s ?? "").Trim())
                    .Where(s => !string.IsNullOrWhiteSpace(s))
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList();

                if (requestedNumbers.Count != quantity)
                {
                    return BadRequest(new { success = false, message = "roomNumbers count must match quantity" });
                }

                // Check for duplicate room numbers within the same hotel and room type
                var existing = await _context.Rooms
                    .Where(r => r.RoomType.HotelId == hotelId && r.RoomTypeId == roomTypeId && requestedNumbers.Contains(r.RoomNumber))
                    .Select(r => r.RoomNumber)
                    .ToListAsync();

                if (existing.Count > 0)
                {
                    var roomTypeName = roomType?.Name ?? "this room type";
                    return BadRequest(new { success = false, message = $"Room number(s) {string.Join(", ", existing)} already exist for {roomTypeName} in this hotel", existingRoomNumbers = existing });
                }

                var now = DateTime.UtcNow;
                var rooms = requestedNumbers.Select(roomNumber => new Room
                {
                    RoomNumber = roomNumber,
                    RoomTypeId = roomTypeId,
                    BlockFloorId = blockFloorId,
                    FloorNumber = floorNumber,
                    Block = block,
                    Status = status,
                    RoomSize = roomSize,
                    RoomSizeUnit = roomSizeUnit,
                    MaxAdults = maxAdults,
                    MaxChildren = maxChildren,
                    BaseOccupancy = baseOccupancy,
                    MaxAgeOfChild = maxAgeOfChild,
                    SingleBedCount = singleBedCount,
                    DoubleBedCount = doubleBedCount,
                    QueenBedCount = queenBedCount,
                    KingBedCount = kingBedCount,
                    SofaBedCount = sofaBedCount,
                    BasePrice = currentRate,
                    Description = description,
                    LastMaintenanceDate = lastMaintenanceDate,
                    CreatedAt = now,
                    UpdatedAt = now
                }).ToList();

                _context.Rooms.AddRange(rooms);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Created {Count} rooms (bulk) for RoomTypeId={RoomTypeId} HotelId={HotelId}", rooms.Count, roomTypeId, hotelId);
                return Ok(new { success = true, data = rooms.Select(r => new { r.Id, r.RoomNumber, r.RoomTypeId }), message = "Rooms created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk creating rooms");
                return StatusCode(500, new { success = false, message = "Error creating rooms" });
            }
        }

        [HttpPut("rooms/{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                var room = await _context.Rooms.FindAsync(id);
                if (room == null)
                    return NotFound(new { success = false, message = "Room not found" });

                // Parse and update fields
                if (requestJson.TryGetProperty("roomNumber", out var roomNumberElement))
                {
                    var newRoomNumber = roomNumberElement.GetString();
                    if (!string.IsNullOrWhiteSpace(newRoomNumber) && newRoomNumber != room.RoomNumber)
                    {
                        // Get the room's hotel ID and room type ID for validation
                        var roomWithType = await _context.Rooms
                            .Include(r => r.RoomType)
                            .FirstOrDefaultAsync(r => r.Id == id);
                        
                        if (roomWithType != null)
                        {
                            var hotelIdForRoom = roomWithType.RoomType?.HotelId ?? 0;
                            var roomTypeIdForRoom = roomWithType.RoomTypeId;
                            
                            // Check if new room number already exists for the same hotel and room type
                            var existingRoom = await _context.Rooms
                                .Include(r => r.RoomType)
                                .AnyAsync(r => r.Id != id && r.RoomNumber == newRoomNumber && r.RoomTypeId == roomTypeIdForRoom && r.RoomType.HotelId == hotelIdForRoom);
                            
                            if (existingRoom)
                            {
                                return BadRequest(new { success = false, message = $"Room number {newRoomNumber} already exists for this room type in this hotel" });
                            }
                        }
                        room.RoomNumber = newRoomNumber;
                    }
                }

                if (requestJson.TryGetProperty("roomTypeId", out var roomTypeIdElement))
                {
                    int roomTypeId = 0;
                    if (roomTypeIdElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        int.TryParse(roomTypeIdElement.GetString(), out roomTypeId);
                    }
                    else if (roomTypeIdElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        roomTypeId = roomTypeIdElement.GetInt32();
                    }

                    if (roomTypeId > 0)
                    {
                        var roomType = await _context.RoomTypes.FindAsync(roomTypeId);
                        if (roomType == null)
                        {
                            return BadRequest(new { success = false, message = "Invalid room type selected" });
                        }
                        room.RoomTypeId = roomTypeId;
                    }
                }

                if (requestJson.TryGetProperty("floorNumber", out var floorNumberElement))
                {
                    if (floorNumberElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (int.TryParse(floorNumberElement.GetString(), out int floorNumber))
                            room.FloorNumber = floorNumber;
                    }
                    else if (floorNumberElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        room.FloorNumber = floorNumberElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("block", out var blockElement))
                {
                    room.Block = blockElement.GetString() ?? room.Block;
                }

                if (requestJson.TryGetProperty("status", out var statusElement))
                {
                    room.Status = statusElement.GetString() ?? room.Status;
                }

                if (requestJson.TryGetProperty("maxOccupancy", out var maxOccupancyElement))
                {
                    if (maxOccupancyElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (int.TryParse(maxOccupancyElement.GetString(), out int maxOccupancy))
                            room.MaxAdults = maxOccupancy;
                    }
                    else if (maxOccupancyElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        room.MaxAdults = maxOccupancyElement.GetInt32();
                    }
                }

                if (requestJson.TryGetProperty("roomSize", out var roomSizeElement))
                {
                    if (roomSizeElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (decimal.TryParse(roomSizeElement.GetString(), out var parsed))
                            room.RoomSize = parsed;
                    }
                    else if (roomSizeElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        room.RoomSize = roomSizeElement.GetDecimal();
                    }
                    else if (roomSizeElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                    {
                        room.RoomSize = null;
                    }
                }

                if (requestJson.TryGetProperty("roomSizeUnit", out var roomSizeUnitElement))
                {
                    room.RoomSizeUnit = roomSizeUnitElement.GetString() ?? room.RoomSizeUnit;
                }

                if (requestJson.TryGetProperty("currentRate", out var currentRateElement))
                {
                    if (currentRateElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (decimal.TryParse(currentRateElement.GetString(), out decimal currentRate))
                            room.BasePrice = currentRate;
                    }
                    else if (currentRateElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        room.BasePrice = currentRateElement.GetDecimal();
                    }
                }

                if (requestJson.TryGetProperty("description", out var descriptionElement))
                {
                    room.Description = descriptionElement.GetString() ?? room.Description;
                }

                if (requestJson.TryGetProperty("blockFloorId", out var blockFloorIdElement))
                {
                    int? blockFloorId = null;
                    if (blockFloorIdElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        if (int.TryParse(blockFloorIdElement.GetString(), out var parsed))
                            blockFloorId = parsed;
                    }
                    else if (blockFloorIdElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    {
                        blockFloorId = blockFloorIdElement.GetInt32();
                    }
                    else if (blockFloorIdElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                    {
                        blockFloorId = null;
                    }

                    if (blockFloorId.HasValue)
                    {
                        var floor = await _context.BlockFloors.FindAsync(blockFloorId.Value);
                        if (floor == null)
                            return BadRequest(new { success = false, message = "Invalid floor selected" });
                    }

                    room.BlockFloorId = blockFloorId;
                }

                if (requestJson.TryGetProperty("lastMaintenanceDate", out var lastMaintenanceDateElement))
                {
                    if (lastMaintenanceDateElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        var dateStr = lastMaintenanceDateElement.GetString();
                        if (DateTime.TryParse(dateStr, out DateTime maintenanceDate))
                        {
                            room.LastMaintenanceDate = maintenanceDate;
                        }
                    }
                    else if (lastMaintenanceDateElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                    {
                        room.LastMaintenanceDate = null;
                    }
                }

                // Handle new fields: maxAdults, maxChildren, baseOccupancy, maxAgeOfChild
                if (requestJson.TryGetProperty("maxAdults", out var maxAdultsElement))
                {
                    if (maxAdultsElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        room.MaxAdults = maxAdultsElement.GetInt32();
                    else if (maxAdultsElement.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(maxAdultsElement.GetString(), out int maxAdults))
                        room.MaxAdults = maxAdults;
                }

                if (requestJson.TryGetProperty("maxChildren", out var maxChildrenElement))
                {
                    if (maxChildrenElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        room.MaxChildren = maxChildrenElement.GetInt32();
                    else if (maxChildrenElement.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(maxChildrenElement.GetString(), out int maxChildren))
                        room.MaxChildren = maxChildren;
                }

                if (requestJson.TryGetProperty("baseOccupancy", out var baseOccupancyElement))
                {
                    if (baseOccupancyElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        room.BaseOccupancy = baseOccupancyElement.GetInt32();
                    else if (baseOccupancyElement.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(baseOccupancyElement.GetString(), out int baseOccupancy))
                        room.BaseOccupancy = baseOccupancy;
                    else if (baseOccupancyElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                        room.BaseOccupancy = null;
                }

                if (requestJson.TryGetProperty("maxAgeOfChild", out var maxAgeOfChildElement))
                {
                    if (maxAgeOfChildElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        room.MaxAgeOfChild = maxAgeOfChildElement.GetInt32();
                    else if (maxAgeOfChildElement.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(maxAgeOfChildElement.GetString(), out int maxAgeOfChild))
                        room.MaxAgeOfChild = maxAgeOfChild;
                    else if (maxAgeOfChildElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                        room.MaxAgeOfChild = null;
                }

                // Handle bed configuration fields
                if (requestJson.TryGetProperty("singleBedCount", out var singleBedCountElement))
                {
                    if (singleBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        room.SingleBedCount = singleBedCountElement.GetInt32();
                    else if (singleBedCountElement.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(singleBedCountElement.GetString(), out int singleBedCount))
                        room.SingleBedCount = singleBedCount;
                    else if (singleBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                        room.SingleBedCount = null;
                }

                if (requestJson.TryGetProperty("doubleBedCount", out var doubleBedCountElement))
                {
                    if (doubleBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        room.DoubleBedCount = doubleBedCountElement.GetInt32();
                    else if (doubleBedCountElement.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(doubleBedCountElement.GetString(), out int doubleBedCount))
                        room.DoubleBedCount = doubleBedCount;
                    else if (doubleBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                        room.DoubleBedCount = null;
                }

                if (requestJson.TryGetProperty("queenBedCount", out var queenBedCountElement))
                {
                    if (queenBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        room.QueenBedCount = queenBedCountElement.GetInt32();
                    else if (queenBedCountElement.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(queenBedCountElement.GetString(), out int queenBedCount))
                        room.QueenBedCount = queenBedCount;
                    else if (queenBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                        room.QueenBedCount = null;
                }

                if (requestJson.TryGetProperty("kingBedCount", out var kingBedCountElement))
                {
                    if (kingBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        room.KingBedCount = kingBedCountElement.GetInt32();
                    else if (kingBedCountElement.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(kingBedCountElement.GetString(), out int kingBedCount))
                        room.KingBedCount = kingBedCount;
                    else if (kingBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                        room.KingBedCount = null;
                }

                if (requestJson.TryGetProperty("sofaBedCount", out var sofaBedCountElement))
                {
                    if (sofaBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                        room.SofaBedCount = sofaBedCountElement.GetInt32();
                    else if (sofaBedCountElement.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(sofaBedCountElement.GetString(), out int sofaBedCount))
                        room.SofaBedCount = sofaBedCount;
                    else if (sofaBedCountElement.ValueKind == System.Text.Json.JsonValueKind.Null)
                        room.SofaBedCount = null;
                }

                // Handle room amenities selection
                if (requestJson.TryGetProperty("selectedAmenities", out var selectedAmenitiesElement) && selectedAmenitiesElement.ValueKind == JsonValueKind.Array)
                {
                    var selectedAmenityIds = selectedAmenitiesElement
                        .EnumerateArray()
                        .Select(e =>
                        {
                            if (e.ValueKind == JsonValueKind.Number) return e.GetInt32();
                            if (e.ValueKind == JsonValueKind.String && int.TryParse(e.GetString(), out var parsed)) return parsed;
                            return 0;
                        })
                        .Where(x => x > 0)
                        .Distinct()
                        .ToList();

                    var existingMappings = await _context.RoomAmenityMappings
                        .Where(m => m.RoomId == id && m.IsActive)
                        .ToListAsync();

                    var existingAmenityIds = existingMappings
                        .Select(m => m.AmenityId)
                        .Distinct()
                        .ToList();

                    // Soft-delete removed amenities
                    foreach (var mapping in existingMappings.Where(m => !selectedAmenityIds.Contains(m.AmenityId)))
                    {
                        mapping.IsActive = false;
                        mapping.UpdatedAt = DateTime.UtcNow;
                    }

                    // Add new mappings
                    var now = DateTime.UtcNow;
                    foreach (var amenityId in selectedAmenityIds.Where(x => !existingAmenityIds.Contains(x)))
                    {
                        _context.RoomAmenityMappings.Add(new RoomAmenityMapping
                        {
                            RoomId = id,
                            AmenityId = amenityId,
                            IsIncluded = true,
                            AdditionalCharge = 0,
                            Notes = "",
                            IsActive = true,
                            CreatedAt = now,
                            UpdatedAt = now
                        });
                    }

                    // Update comma-separated features string on Room
                    var names = await _context.RoomAmenities
                        .Where(a => selectedAmenityIds.Contains(a.Id) && a.IsActive)
                        .OrderBy(a => a.AmenityName)
                        .Select(a => a.AmenityName)
                        .ToListAsync();

                    room.Features = names.Count == 0 ? null : string.Join(", ", names);
                }

                room.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Room updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room");
                return StatusCode(500, new { success = false, message = "Error updating room" });
            }
        }

        [HttpDelete("rooms/{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            try
            {
                var room = await _context.Rooms.FindAsync(id);
                if (room == null)
                    return NotFound(new { success = false, message = "Room not found" });

                // Check if the room has any active reservations
                var hasActiveReservations = await _context.Reservations
                    .AnyAsync(r => r.RoomId == id && 
                                 (r.Status == "Confirmed" || r.Status == "CheckedIn"));

                if (hasActiveReservations)
                {
                    return BadRequest(new { success = false, message = "Cannot delete room with active reservations" });
                }

                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Room deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room");
                return StatusCode(500, new { success = false, message = "Error deleting room" });
            }
        }

        // ROOM BLOCKED ENDPOINTS
        [HttpGet("roomblocked")]
        public async Task<IActionResult> GetRoomBlocked([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.RoomBlocked
                    .Include(rb => rb.Hotel)
                    .Include(rb => rb.RoomType)
                    .Include(rb => rb.Room)
                    .Where(rb => rb.IsActive);

                var totalCount = await query.CountAsync();
                var blockedRooms = await query
                    .OrderByDescending(rb => rb.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(rb => new
                    {
                        id = rb.Id,
                        hotelId = rb.HotelId,
                        hotelName = rb.Hotel.HotelName,
                        roomTypeId = rb.RoomTypeId,
                        roomTypeName = rb.RoomType.Name,
                        roomId = rb.RoomId,
                        roomNumber = rb.Room.RoomNumber,
                        blockStartDate = rb.BlockStartDate,
                        blockEndDate = rb.BlockEndDate,
                        blockReason = rb.BlockReason,
                        blockType = rb.BlockType,
                        blockedBy = rb.BlockedBy,
                        blockNotes = rb.BlockNotes,
                        isActive = rb.IsActive,
                        createdAt = rb.CreatedAt,
                        isCurrentlyBlocked = DateTime.Now >= rb.BlockStartDate && DateTime.Now <= rb.BlockEndDate,
                        isFutureBlock = DateTime.Now < rb.BlockStartDate
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = blockedRooms, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving blocked rooms");
                return StatusCode(500, new { success = false, message = "Error retrieving blocked rooms" });
            }
        }

        [HttpGet("roomblocked/{id}")]
        public async Task<IActionResult> GetRoomBlocked(int id)
        {
            try
            {
                var blocked = await _context.RoomBlocked
                    .Include(rb => rb.Hotel)
                    .Include(rb => rb.RoomType)
                    .Include(rb => rb.Room)
                    .Where(rb => rb.Id == id && rb.IsActive)
                    .Select(rb => new
                    {
                        id = rb.Id,
                        hotelId = rb.HotelId,
                        hotelName = rb.Hotel.HotelName,
                        roomTypeId = rb.RoomTypeId,
                        roomTypeName = rb.RoomType.Name,
                        roomId = rb.RoomId,
                        roomNumber = rb.Room.RoomNumber,
                        blockStartDate = rb.BlockStartDate,
                        blockEndDate = rb.BlockEndDate,
                        blockReason = rb.BlockReason,
                        blockType = rb.BlockType,
                        blockedBy = rb.BlockedBy,
                        blockNotes = rb.BlockNotes,
                        isActive = rb.IsActive,
                        createdAt = rb.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                if (blocked == null)
                    return NotFound(new { success = false, message = "Room block not found" });

                return Ok(new { success = true, data = blocked });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room block");
                return StatusCode(500, new { success = false, message = "Error retrieving room block" });
            }
        }

        [HttpPost("roomblocked")]
        public async Task<IActionResult> CreateRoomBlocked([FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                // Parse required fields
                if (!requestJson.TryGetProperty("hotelId", out var hotelIdElement) ||
                    !requestJson.TryGetProperty("roomTypeId", out var roomTypeIdElement) ||
                    !requestJson.TryGetProperty("roomId", out var roomIdElement) ||
                    !requestJson.TryGetProperty("blockStartDate", out var startDateElement) ||
                    !requestJson.TryGetProperty("blockEndDate", out var endDateElement) ||
                    !requestJson.TryGetProperty("blockReason", out var reasonElement) ||
                    !requestJson.TryGetProperty("blockType", out var typeElement) ||
                    !requestJson.TryGetProperty("blockedBy", out var blockedByElement))
                {
                    return BadRequest(new { success = false, message = "Missing required fields" });
                }

                int hotelId = 0;
                int roomTypeId = 0;
                int roomId = 0;

                if (hotelIdElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    int.TryParse(hotelIdElement.GetString(), out hotelId);
                else if (hotelIdElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    hotelId = hotelIdElement.GetInt32();

                if (roomTypeIdElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    int.TryParse(roomTypeIdElement.GetString(), out roomTypeId);
                else if (roomTypeIdElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    roomTypeId = roomTypeIdElement.GetInt32();

                if (roomIdElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    int.TryParse(roomIdElement.GetString(), out roomId);
                else if (roomIdElement.ValueKind == System.Text.Json.JsonValueKind.Number)
                    roomId = roomIdElement.GetInt32();

                var blockReason = reasonElement.GetString();
                var blockType = typeElement.GetString();
                var blockedBy = blockedByElement.GetString();

                if (hotelId <= 0 || roomTypeId <= 0 || roomId <= 0)
                {
                    return BadRequest(new { success = false, message = "Hotel, Room Type, and Room are required" });
                }

                if (!DateTime.TryParse(startDateElement.GetString(), out DateTime startDate) ||
                    !DateTime.TryParse(endDateElement.GetString(), out DateTime endDate))
                {
                    return BadRequest(new { success = false, message = "Invalid date format" });
                }

                if (endDate <= startDate)
                {
                    return BadRequest(new { success = false, message = "End date must be after start date" });
                }

                // Check for overlapping blocks
                var hasOverlap = await _context.RoomBlocked
                    .AnyAsync(rb => rb.RoomId == roomId && rb.IsActive &&
                                  ((startDate >= rb.BlockStartDate && startDate <= rb.BlockEndDate) ||
                                   (endDate >= rb.BlockStartDate && endDate <= rb.BlockEndDate) ||
                                   (startDate <= rb.BlockStartDate && endDate >= rb.BlockEndDate)));

                if (hasOverlap)
                {
                    return BadRequest(new { success = false, message = "Room is already blocked for the selected period" });
                }

                var roomBlocked = new RoomBlocked
                {
                    HotelId = hotelId,
                    RoomTypeId = roomTypeId,
                    RoomId = roomId,
                    BlockStartDate = startDate,
                    BlockEndDate = endDate,
                    BlockReason = blockReason,
                    BlockType = blockType,
                    BlockedBy = blockedBy,
                    BlockNotes = requestJson.TryGetProperty("blockNotes", out var notesElement) ? notesElement.GetString() : null,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = blockedBy
                };

                _context.RoomBlocked.Add(roomBlocked);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Room blocked successfully", id = roomBlocked.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error blocking room. Payload: {Payload}", requestJson.ToString());
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("roomblocked/{id}")]
        public async Task<IActionResult> UpdateRoomBlocked(int id, [FromBody] System.Text.Json.JsonElement requestJson)
        {
            try
            {
                var roomBlocked = await _context.RoomBlocked.FindAsync(id);
                if (roomBlocked == null || !roomBlocked.IsActive)
                    return NotFound(new { success = false, message = "Room block not found" });

                // Parse and update fields
                if (requestJson.TryGetProperty("blockStartDate", out var startDateElement) &&
                    DateTime.TryParse(startDateElement.GetString(), out DateTime startDate))
                {
                    roomBlocked.BlockStartDate = startDate;
                }

                if (requestJson.TryGetProperty("blockEndDate", out var endDateElement) &&
                    DateTime.TryParse(endDateElement.GetString(), out DateTime endDate))
                {
                    roomBlocked.BlockEndDate = endDate;
                }

                if (roomBlocked.BlockEndDate <= roomBlocked.BlockStartDate)
                {
                    return BadRequest(new { success = false, message = "End date must be after start date" });
                }

                // Check for overlapping blocks (excluding current block)
                var hasOverlap = await _context.RoomBlocked
                    .AnyAsync(rb => rb.RoomId == roomBlocked.RoomId && rb.IsActive && rb.Id != id &&
                                  ((roomBlocked.BlockStartDate >= rb.BlockStartDate && roomBlocked.BlockStartDate <= rb.BlockEndDate) ||
                                   (roomBlocked.BlockEndDate >= rb.BlockStartDate && roomBlocked.BlockEndDate <= rb.BlockEndDate) ||
                                   (roomBlocked.BlockStartDate <= rb.BlockStartDate && roomBlocked.BlockEndDate >= rb.BlockEndDate)));

                if (hasOverlap)
                {
                    return BadRequest(new { success = false, message = "Room is already blocked for the selected period" });
                }

                if (requestJson.TryGetProperty("blockReason", out var reasonElement))
                    roomBlocked.BlockReason = reasonElement.GetString();

                if (requestJson.TryGetProperty("blockType", out var typeElement))
                    roomBlocked.BlockType = typeElement.GetString();

                if (requestJson.TryGetProperty("blockedBy", out var blockedByElement))
                    roomBlocked.BlockedBy = blockedByElement.GetString();

                if (requestJson.TryGetProperty("blockNotes", out var notesElement))
                    roomBlocked.BlockNotes = notesElement.GetString();

                roomBlocked.UpdatedAt = DateTime.UtcNow;
                roomBlocked.UpdatedBy = roomBlocked.BlockedBy;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Room block updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room block");
                return StatusCode(500, new { success = false, message = "Error updating room block" });
            }
        }

        [HttpDelete("roomblocked/{id}")]
        public async Task<IActionResult> DeleteRoomBlocked(int id)
        {
            try
            {
                var roomBlocked = await _context.RoomBlocked.FindAsync(id);
                if (roomBlocked == null || !roomBlocked.IsActive)
                    return NotFound(new { success = false, message = "Room block not found" });

                // Soft delete
                roomBlocked.IsActive = false;
                roomBlocked.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Room block deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room block");
                return StatusCode(500, new { success = false, message = "Error deleting room block" });
            }
        }

        // Helper endpoints for dropdowns
        [HttpGet("roomblocked/hotels")]
        public async Task<IActionResult> GetHotelsForBlocking()
        {
            try
            {
                var hotels = await _context.Hotels
                    .Where(h => h.IsActive)
                    .Select(h => new { id = h.Id, name = h.HotelName })
                    .ToListAsync();

                return Ok(new { success = true, data = hotels });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving hotels");
                return StatusCode(500, new { success = false, message = "Error retrieving hotels" });
            }
        }

        [HttpGet("roomblocked/roomtypes/{hotelId}")]
        public async Task<IActionResult> GetRoomTypesForBlocking(int hotelId)
        {
            try
            {
                var query = _context.RoomTypes.AsQueryable();
                query = query.Where(rt => rt.IsActive);

                // hotelId <= 0 means: ALL hotels
                if (hotelId > 0)
                {
                    query = query.Where(rt => rt.HotelId == hotelId);
                }

                var roomTypes = await query
                    .Select(rt => new { 
                        id = rt.Id, 
                        name = rt.Name,
                        totalRooms = _context.Rooms.Count(r => r.RoomTypeId == rt.Id && r.IsActive)
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = roomTypes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room types");
                return StatusCode(500, new { success = false, message = "Error retrieving room types" });
            }
        }

        [HttpGet("roomblocked/rooms/{hotelId}/{roomTypeId}")]
        public async Task<IActionResult> GetRoomsForBlocking(int hotelId, int roomTypeId)
        {
            try
            {
                var rooms = await _context.Rooms
                    .Where(r => r.RoomTypeId == roomTypeId && r.IsActive)
                    .Select(r => new { 
                        id = r.Id, 
                        roomNumber = r.RoomNumber,
                        isCurrentlyBlocked = _context.RoomBlocked.Any(rb => rb.RoomId == r.Id && rb.IsActive &&
                                                                           DateTime.Now >= rb.BlockStartDate && DateTime.Now <= rb.BlockEndDate)
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = rooms });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving rooms");
                return StatusCode(500, new { success = false, message = "Error retrieving rooms" });
            }
        }
    }
}
