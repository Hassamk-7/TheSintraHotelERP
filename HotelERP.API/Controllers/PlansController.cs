using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System.Text.Json;
using System.Globalization;

namespace HotelERP.API.Controllers
{
    // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
    public class PlansController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<PlansController> _logger;

        public PlansController(HotelDbContext context, ILogger<PlansController> logger)
        {
            _context = context;
            _logger = logger;
        }

        private static DateTime? ParseNullableDate(JsonElement element)
        {
            if (element.ValueKind == JsonValueKind.Null || element.ValueKind == JsonValueKind.Undefined)
            {
                return null;
            }

            if (element.ValueKind == JsonValueKind.String)
            {
                var value = element.GetString();
                if (string.IsNullOrWhiteSpace(value))
                {
                    return null;
                }

                if (DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var parsed))
                {
                    return parsed.Date;
                }
            }

            if (element.ValueKind == JsonValueKind.Number && element.TryGetInt64(out var unixValue))
            {
                try
                {
                    return DateTimeOffset.FromUnixTimeMilliseconds(unixValue).Date;
                }
                catch
                {
                    return null;
                }
            }

            return null;
        }

        private static decimal? ParseNullableDecimal(JsonElement element)
        {
            if (element.ValueKind == JsonValueKind.Null || element.ValueKind == JsonValueKind.Undefined)
            {
                return null;
            }

            if (element.ValueKind == JsonValueKind.Number)
            {
                return element.GetDecimal();
            }

            if (element.ValueKind == JsonValueKind.String && decimal.TryParse(element.GetString(), out var parsed))
            {
                return parsed;
            }

            return null;
        }

        private static bool ParseBool(JsonElement element, bool fallback = false)
        {
            if (element.ValueKind == JsonValueKind.True) return true;
            if (element.ValueKind == JsonValueKind.False) return false;
            if (element.ValueKind == JsonValueKind.String && bool.TryParse(element.GetString(), out var parsed)) return parsed;
            return fallback;
        }

        private static bool IsWithinDateRange(DateTime targetDate, DateTime? from, DateTime? to)
        {
            var compareDate = targetDate.Date;
            var dateFrom = from?.Date;
            var dateTo = to?.Date;

            if (dateFrom.HasValue && compareDate < dateFrom.Value)
            {
                return false;
            }

            if (dateTo.HasValue && compareDate > dateTo.Value)
            {
                return false;
            }

            return true;
        }

        private static bool IsPlanApplicableForStay(Plan plan, DateTime checkInDate, DateTime? checkOutDate)
        {
            if (!plan.IsActive || plan.StopSell)
            {
                return false;
            }

            if (!IsWithinDateRange(checkInDate, plan.ValidFrom, plan.ValidTo))
            {
                return false;
            }

            if (plan.ClosedToArrival && IsWithinDateRange(checkInDate, plan.ClosedToArrivalValidFrom, plan.ClosedToArrivalValidTo))
            {
                return false;
            }

            if (checkOutDate.HasValue && plan.ClosedToDeparture && IsWithinDateRange(checkOutDate.Value, plan.ClosedToDepartureValidFrom, plan.ClosedToDepartureValidTo))
            {
                return false;
            }

            return true;
        }

        // GET: api/plans
        [HttpGet]
        public async Task<IActionResult> GetPlans([FromQuery] int? hotelId = null, [FromQuery] int? roomTypeId = null)
        {
            try
            {
                var query = _context.Plans
                    .AsNoTracking()
                    .Include(p => p.Hotel)
                    .Include(p => p.PlanRoomTypes)
                        .ThenInclude(prt => prt.RoomType)
                    .Where(p => p.IsActive);

                if (hotelId.HasValue && hotelId.Value > 0)
                {
                    query = query.Where(p => p.HotelId == hotelId.Value);
                }

                if (roomTypeId.HasValue && roomTypeId.Value > 0)
                {
                    query = query.Where(p => p.PlanRoomTypes.Any(x => x.RoomTypeId == roomTypeId.Value));
                }

                var cancellationPolicies = _context.CancellationPolicies.AsNoTracking();

                var plans = await query
                    .OrderBy(p => p.BasePrice)
                    .Select(p => new
                    {
                        id = p.Id,
                        hotelId = p.HotelId,
                        hotelName = p.Hotel != null ? p.Hotel.HotelName : "",
                        name = p.Name,
                        code = p.Code,
                        description = p.Description,
                        basePrice = p.BasePrice,
                        stopSell = p.StopSell,
                        validFrom = p.ValidFrom,
                        validTo = p.ValidTo,
                        closedToArrival = p.ClosedToArrival,
                        closedToArrivalValidFrom = p.ClosedToArrivalValidFrom,
                        closedToArrivalValidTo = p.ClosedToArrivalValidTo,
                        closedToDeparture = p.ClosedToDeparture,
                        closedToDepartureValidFrom = p.ClosedToDepartureValidFrom,
                        closedToDepartureValidTo = p.ClosedToDepartureValidTo,
                        priceAdjustmentType = p.PriceAdjustmentType,
                        priceDifferenceType = p.PriceDifferenceType,
                        priceDifferenceValue = p.PriceDifferenceValue,
                        isBreakfastIncluded = p.IsBreakfastIncluded,
                        isLunchIncluded = p.IsLunchIncluded,
                        isDinnerIncluded = p.IsDinnerIncluded,
                        termsAndConditions = p.TermsAndConditions,
                        cancellationPolicyCode = p.TermsAndConditions,
                        cancellationPolicyDescription = cancellationPolicies
                            .Where(cp => cp.HotelId == p.HotelId && cp.Code == p.TermsAndConditions)
                            .Select(cp => cp.Description)
                            .FirstOrDefault(),
                        isActive = p.IsActive,
                        createdAt = p.CreatedAt,
                        updatedAt = p.UpdatedAt,
                        roomTypeIds = p.PlanRoomTypes.Select(x => x.RoomTypeId).ToList(),
                        roomTypes = p.PlanRoomTypes.Select(x => new
                        {
                            id = x.RoomTypeId,
                            name = x.RoomType != null ? x.RoomType.Name : ""
                        }).ToList()
                    })
                    .ToListAsync();

                return HandleSuccess(plans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving hotel plans");
                return HandleError("An error occurred while retrieving hotel plans");
            }
        }

        // GET: api/plans/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlan(int id)
        {
            try
            {
                var cancellationPolicies = _context.CancellationPolicies.AsNoTracking();

                var plan = await _context.Plans
                    .AsNoTracking()
                    .Include(p => p.Hotel)
                    .Include(p => p.PlanRoomTypes)
                        .ThenInclude(prt => prt.RoomType)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (plan == null)
                {
                    return HandleNotFound("Hotel plan not found");
                }

                return HandleSuccess(new
                {
                    id = plan.Id,
                    hotelId = plan.HotelId,
                    hotelName = plan.Hotel != null ? plan.Hotel.HotelName : "",
                    name = plan.Name,
                    code = plan.Code,
                    description = plan.Description,
                    basePrice = plan.BasePrice,
                    stopSell = plan.StopSell,
                    validFrom = plan.ValidFrom,
                    validTo = plan.ValidTo,
                    closedToArrival = plan.ClosedToArrival,
                    closedToArrivalValidFrom = plan.ClosedToArrivalValidFrom,
                    closedToArrivalValidTo = plan.ClosedToArrivalValidTo,
                    closedToDeparture = plan.ClosedToDeparture,
                    closedToDepartureValidFrom = plan.ClosedToDepartureValidFrom,
                    closedToDepartureValidTo = plan.ClosedToDepartureValidTo,
                    priceAdjustmentType = plan.PriceAdjustmentType,
                    priceDifferenceType = plan.PriceDifferenceType,
                    priceDifferenceValue = plan.PriceDifferenceValue,
                    isBreakfastIncluded = plan.IsBreakfastIncluded,
                    isLunchIncluded = plan.IsLunchIncluded,
                    isDinnerIncluded = plan.IsDinnerIncluded,
                    termsAndConditions = plan.TermsAndConditions,
                    cancellationPolicyCode = plan.TermsAndConditions,
                    cancellationPolicyDescription = cancellationPolicies
                        .Where(cp => cp.HotelId == plan.HotelId && cp.Code == plan.TermsAndConditions)
                        .Select(cp => cp.Description)
                        .FirstOrDefault(),
                    isActive = plan.IsActive,
                    createdAt = plan.CreatedAt,
                    updatedAt = plan.UpdatedAt,
                    roomTypeIds = plan.PlanRoomTypes.Select(x => x.RoomTypeId).ToList(),
                    roomTypes = plan.PlanRoomTypes.Select(x => new
                    {
                        id = x.RoomTypeId,
                        name = x.RoomType != null ? x.RoomType.Name : ""
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving hotel plan with ID: {id}");
                return HandleError($"An error occurred while retrieving hotel plan with ID: {id}");
            }
        }

        // GET: api/plans/applicable?hotelId=1&roomTypeId=2
        [HttpGet("applicable")]
        public async Task<IActionResult> GetApplicablePlans([FromQuery] int hotelId, [FromQuery] int roomTypeId, [FromQuery] DateTime? checkInDate = null, [FromQuery] DateTime? checkOutDate = null)
        {
            if (hotelId <= 0 || roomTypeId <= 0)
            {
                return HandleError("hotelId and roomTypeId are required");
            }

            try
            {
                var cancellationPolicies = _context.CancellationPolicies.AsNoTracking();

                var plans = await _context.Plans
                    .AsNoTracking()
                    .Include(p => p.PlanRoomTypes)
                    .Where(p => p.IsActive && p.HotelId == hotelId)
                    .Where(p => p.PlanRoomTypes.Any(x => x.RoomTypeId == roomTypeId))
                    .ToListAsync();

                var targetCheckInDate = (checkInDate ?? DateTime.Today).Date;
                var targetCheckOutDate = checkOutDate?.Date;

                var applicablePlans = plans
                    .Where(p => IsPlanApplicableForStay(p, targetCheckInDate, targetCheckOutDate))
                    .OrderBy(p => p.BasePrice)
                    .Select(p => new
                    {
                        id = p.Id,
                        hotelId = p.HotelId,
                        name = p.Name,
                        code = p.Code,
                        description = p.Description,
                        basePrice = p.BasePrice,
                        stopSell = p.StopSell,
                        validFrom = p.ValidFrom,
                        validTo = p.ValidTo,
                        closedToArrival = p.ClosedToArrival,
                        closedToArrivalValidFrom = p.ClosedToArrivalValidFrom,
                        closedToArrivalValidTo = p.ClosedToArrivalValidTo,
                        closedToDeparture = p.ClosedToDeparture,
                        closedToDepartureValidFrom = p.ClosedToDepartureValidFrom,
                        closedToDepartureValidTo = p.ClosedToDepartureValidTo,
                        priceAdjustmentType = p.PriceAdjustmentType,
                        priceDifferenceType = p.PriceDifferenceType,
                        priceDifferenceValue = p.PriceDifferenceValue,
                        termsAndConditions = p.TermsAndConditions,
                        cancellationPolicyCode = p.TermsAndConditions,
                        cancellationPolicyDescription = cancellationPolicies
                            .Where(cp => cp.HotelId == p.HotelId && cp.Code == p.TermsAndConditions)
                            .Select(cp => cp.Description)
                            .FirstOrDefault(),
                        isBreakfastIncluded = p.IsBreakfastIncluded,
                        isLunchIncluded = p.IsLunchIncluded,
                        isDinnerIncluded = p.IsDinnerIncluded,
                        isActive = p.IsActive
                    })
                    .ToList();

                return HandleSuccess(applicablePlans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving applicable hotel plans");
                return HandleError("An error occurred while retrieving applicable hotel plans");
            }
        }

        // POST: api/plans
        [HttpPost]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> CreatePlan([FromBody] JsonElement requestJson)
        {
            try
            {
                string name = requestJson.TryGetProperty("name", out var nEl) ? (nEl.GetString() ?? "") : "";
                string code = requestJson.TryGetProperty("code", out var cEl) ? (cEl.GetString() ?? "") : "";
                string description = requestJson.TryGetProperty("description", out var dEl) ? (dEl.GetString() ?? "") : "";
                string terms = requestJson.TryGetProperty("termsAndConditions", out var tEl) ? (tEl.GetString() ?? "") : "";
                string priceAdjustmentType = requestJson.TryGetProperty("priceAdjustmentType", out var patEl) ? (patEl.GetString() ?? "") : "";
                string priceDifferenceType = requestJson.TryGetProperty("priceDifferenceType", out var pdtEl) ? (pdtEl.GetString() ?? "") : "";
                decimal basePrice = 0;
                if (requestJson.TryGetProperty("basePrice", out var bpEl))
                {
                    if (bpEl.ValueKind == JsonValueKind.Number) basePrice = bpEl.GetDecimal();
                    else decimal.TryParse(bpEl.GetString() ?? "0", out basePrice);
                }

                decimal? priceDifferenceValue = null;
                if (requestJson.TryGetProperty("priceDifferenceValue", out var pdvEl))
                {
                    priceDifferenceValue = ParseNullableDecimal(pdvEl);
                }

                DateTime? ctaValidFrom = null;
                if (requestJson.TryGetProperty("closedToArrivalValidFrom", out var ctaVfEl))
                {
                    ctaValidFrom = ParseNullableDate(ctaVfEl);
                }

                DateTime? ctaValidTo = null;
                if (requestJson.TryGetProperty("closedToArrivalValidTo", out var ctaVtEl))
                {
                    ctaValidTo = ParseNullableDate(ctaVtEl);
                }

                DateTime? ctdValidFrom = null;
                if (requestJson.TryGetProperty("closedToDepartureValidFrom", out var ctdVfEl))
                {
                    ctdValidFrom = ParseNullableDate(ctdVfEl);
                }

                DateTime? ctdValidTo = null;
                if (requestJson.TryGetProperty("closedToDepartureValidTo", out var ctdVtEl))
                {
                    ctdValidTo = ParseNullableDate(ctdVtEl);
                }

                DateTime? validFrom = null;
                if (requestJson.TryGetProperty("validFrom", out var vfEl))
                {
                    validFrom = ParseNullableDate(vfEl);
                }

                DateTime? validTo = null;
                if (requestJson.TryGetProperty("validTo", out var vtEl))
                {
                    validTo = ParseNullableDate(vtEl);
                }

                int hotelId = 0;
                if (requestJson.TryGetProperty("hotelId", out var hEl))
                {
                    if (hEl.ValueKind == JsonValueKind.Number) hotelId = hEl.GetInt32();
                    else int.TryParse(hEl.GetString(), out hotelId);
                }

                bool isBreakfast = requestJson.TryGetProperty("isBreakfastIncluded", out var bEl) && ParseBool(bEl);
                bool isLunch = requestJson.TryGetProperty("isLunchIncluded", out var lEl) && ParseBool(lEl);
                bool isDinner = requestJson.TryGetProperty("isDinnerIncluded", out var diEl) && ParseBool(diEl);
                bool isActive = !(requestJson.TryGetProperty("isActive", out var iaEl) && !ParseBool(iaEl, true));
                bool stopSell = requestJson.TryGetProperty("stopSell", out var ssEl) && ParseBool(ssEl);
                bool closedToArrival = requestJson.TryGetProperty("closedToArrival", out var ctaEl) && ParseBool(ctaEl);
                bool closedToDeparture = requestJson.TryGetProperty("closedToDeparture", out var ctdEl) && ParseBool(ctdEl);

                var roomTypeIds = new List<int>();
                if (requestJson.TryGetProperty("roomTypeIds", out var rtIdsEl) && rtIdsEl.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in rtIdsEl.EnumerateArray())
                    {
                        if (item.ValueKind == JsonValueKind.Number) roomTypeIds.Add(item.GetInt32());
                        else if (int.TryParse(item.GetString(), out var parsed)) roomTypeIds.Add(parsed);
                    }
                }

                if (hotelId <= 0)
                {
                    return HandleError("Hotel is required");
                }

                if (string.IsNullOrWhiteSpace(name))
                {
                    return HandleError("Plan name is required");
                }

                if (validFrom.HasValue && validTo.HasValue && validFrom.Value.Date > validTo.Value.Date)
                {
                    return HandleError("Valid From cannot be later than Valid To");
                }

                if (ctaValidFrom.HasValue && ctaValidTo.HasValue && ctaValidFrom.Value.Date > ctaValidTo.Value.Date)
                {
                    return HandleError("CTA Valid From cannot be later than CTA Valid To");
                }

                if (ctdValidFrom.HasValue && ctdValidTo.HasValue && ctdValidFrom.Value.Date > ctdValidTo.Value.Date)
                {
                    return HandleError("CTD Valid From cannot be later than CTD Valid To");
                }

                if (!roomTypeIds.Any())
                {
                    return HandleError("At least one room type is required");
                }

                var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == hotelId && h.IsActive);
                if (!hotelExists)
                {
                    return HandleError("Invalid hotel selected");
                }

                var validRoomTypeIds = await _context.RoomTypes
                    .Where(rt => rt.IsActive && rt.HotelId == hotelId && roomTypeIds.Contains(rt.Id))
                    .Select(rt => rt.Id)
                    .ToListAsync();

                if (validRoomTypeIds.Count != roomTypeIds.Distinct().Count())
                {
                    return HandleError("One or more room types are invalid for the selected hotel");
                }

                var plan = new Plan
                {
                    HotelId = hotelId,
                    Name = name,
                    Code = code,
                    Description = description,
                    BasePrice = basePrice,
                    StopSell = stopSell,
                    ValidFrom = validFrom,
                    ValidTo = validTo,
                    ClosedToArrival = closedToArrival,
                    ClosedToArrivalValidFrom = ctaValidFrom,
                    ClosedToArrivalValidTo = ctaValidTo,
                    ClosedToDeparture = closedToDeparture,
                    ClosedToDepartureValidFrom = ctdValidFrom,
                    ClosedToDepartureValidTo = ctdValidTo,
                    PriceAdjustmentType = string.IsNullOrWhiteSpace(priceAdjustmentType) ? null : priceAdjustmentType,
                    PriceDifferenceType = string.IsNullOrWhiteSpace(priceDifferenceType) ? null : priceDifferenceType,
                    PriceDifferenceValue = priceDifferenceValue,
                    TermsAndConditions = terms,
                    IsBreakfastIncluded = isBreakfast,
                    IsLunchIncluded = isLunch,
                    IsDinnerIncluded = isDinner,
                    IsActive = isActive
                };

                foreach (var rtId in validRoomTypeIds.Distinct())
                {
                    plan.PlanRoomTypes.Add(new PlanRoomType { RoomTypeId = rtId });
                }

                _context.Plans.Add(plan);
                await _context.SaveChangesAsync();

                return HandleCreated(new { id = plan.Id }, "Hotel plan created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating hotel plan");
                return HandleError("An error occurred while creating the hotel plan");
            }
        }

        // PUT: api/plans/5
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin,Manager")] // Temporarily disabled for testing
        public async Task<IActionResult> UpdatePlan(int id, [FromBody] JsonElement requestJson)
        {
            try
            {
                var existingPlan = await _context.Plans
                    .Include(p => p.PlanRoomTypes)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (existingPlan == null)
                {
                    return HandleNotFound("Hotel plan not found");
                }

                string name = requestJson.TryGetProperty("name", out var nEl) ? (nEl.GetString() ?? "") : existingPlan.Name;
                string code = requestJson.TryGetProperty("code", out var cEl) ? (cEl.GetString() ?? "") : existingPlan.Code;
                string description = requestJson.TryGetProperty("description", out var dEl) ? (dEl.GetString() ?? "") : existingPlan.Description;
                string terms = requestJson.TryGetProperty("termsAndConditions", out var tEl) ? (tEl.GetString() ?? "") : existingPlan.TermsAndConditions;
                string priceAdjustmentType = requestJson.TryGetProperty("priceAdjustmentType", out var patEl) ? (patEl.GetString() ?? "") : (existingPlan.PriceAdjustmentType ?? "");
                string priceDifferenceType = requestJson.TryGetProperty("priceDifferenceType", out var pdtEl) ? (pdtEl.GetString() ?? "") : (existingPlan.PriceDifferenceType ?? "");

                decimal basePrice = existingPlan.BasePrice;
                if (requestJson.TryGetProperty("basePrice", out var bpEl))
                {
                    if (bpEl.ValueKind == JsonValueKind.Number) basePrice = bpEl.GetDecimal();
                    else decimal.TryParse(bpEl.GetString() ?? "0", out basePrice);
                }

                decimal? priceDifferenceValue = existingPlan.PriceDifferenceValue;
                if (requestJson.TryGetProperty("priceDifferenceValue", out var pdvEl))
                {
                    priceDifferenceValue = ParseNullableDecimal(pdvEl);
                }

                DateTime? ctaValidFrom = existingPlan.ClosedToArrivalValidFrom;
                if (requestJson.TryGetProperty("closedToArrivalValidFrom", out var ctaVfEl))
                {
                    ctaValidFrom = ParseNullableDate(ctaVfEl);
                }

                DateTime? ctaValidTo = existingPlan.ClosedToArrivalValidTo;
                if (requestJson.TryGetProperty("closedToArrivalValidTo", out var ctaVtEl))
                {
                    ctaValidTo = ParseNullableDate(ctaVtEl);
                }

                DateTime? ctdValidFrom = existingPlan.ClosedToDepartureValidFrom;
                if (requestJson.TryGetProperty("closedToDepartureValidFrom", out var ctdVfEl))
                {
                    ctdValidFrom = ParseNullableDate(ctdVfEl);
                }

                DateTime? ctdValidTo = existingPlan.ClosedToDepartureValidTo;
                if (requestJson.TryGetProperty("closedToDepartureValidTo", out var ctdVtEl))
                {
                    ctdValidTo = ParseNullableDate(ctdVtEl);
                }

                DateTime? validFrom = existingPlan.ValidFrom;
                if (requestJson.TryGetProperty("validFrom", out var vfEl))
                {
                    validFrom = ParseNullableDate(vfEl);
                }

                DateTime? validTo = existingPlan.ValidTo;
                if (requestJson.TryGetProperty("validTo", out var vtEl))
                {
                    validTo = ParseNullableDate(vtEl);
                }

                int hotelId = existingPlan.HotelId;
                if (requestJson.TryGetProperty("hotelId", out var hEl))
                {
                    if (hEl.ValueKind == JsonValueKind.Number) hotelId = hEl.GetInt32();
                    else int.TryParse(hEl.GetString(), out hotelId);
                }

                bool isBreakfast = requestJson.TryGetProperty("isBreakfastIncluded", out var bEl) ? ParseBool(bEl, existingPlan.IsBreakfastIncluded) : existingPlan.IsBreakfastIncluded;
                bool isLunch = requestJson.TryGetProperty("isLunchIncluded", out var lEl) ? ParseBool(lEl, existingPlan.IsLunchIncluded) : existingPlan.IsLunchIncluded;
                bool isDinner = requestJson.TryGetProperty("isDinnerIncluded", out var diEl) ? ParseBool(diEl, existingPlan.IsDinnerIncluded) : existingPlan.IsDinnerIncluded;
                bool isActive = requestJson.TryGetProperty("isActive", out var iaEl) ? ParseBool(iaEl, existingPlan.IsActive) : existingPlan.IsActive;
                bool stopSell = requestJson.TryGetProperty("stopSell", out var ssEl) ? ParseBool(ssEl, existingPlan.StopSell) : existingPlan.StopSell;
                bool closedToArrival = requestJson.TryGetProperty("closedToArrival", out var ctaEl) ? ParseBool(ctaEl, existingPlan.ClosedToArrival) : existingPlan.ClosedToArrival;
                bool closedToDeparture = requestJson.TryGetProperty("closedToDeparture", out var ctdEl) ? ParseBool(ctdEl, existingPlan.ClosedToDeparture) : existingPlan.ClosedToDeparture;

                var roomTypeIds = new List<int>();
                if (requestJson.TryGetProperty("roomTypeIds", out var rtIdsEl) && rtIdsEl.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in rtIdsEl.EnumerateArray())
                    {
                        if (item.ValueKind == JsonValueKind.Number) roomTypeIds.Add(item.GetInt32());
                        else if (int.TryParse(item.GetString(), out var parsed)) roomTypeIds.Add(parsed);
                    }
                }

                if (hotelId <= 0)
                {
                    return HandleError("Hotel is required");
                }

                if (string.IsNullOrWhiteSpace(name))
                {
                    return HandleError("Plan name is required");
                }

                if (validFrom.HasValue && validTo.HasValue && validFrom.Value.Date > validTo.Value.Date)
                {
                    return HandleError("Valid From cannot be later than Valid To");
                }

                if (ctaValidFrom.HasValue && ctaValidTo.HasValue && ctaValidFrom.Value.Date > ctaValidTo.Value.Date)
                {
                    return HandleError("CTA Valid From cannot be later than CTA Valid To");
                }

                if (ctdValidFrom.HasValue && ctdValidTo.HasValue && ctdValidFrom.Value.Date > ctdValidTo.Value.Date)
                {
                    return HandleError("CTD Valid From cannot be later than CTD Valid To");
                }

                if (!roomTypeIds.Any())
                {
                    return HandleError("At least one room type is required");
                }

                var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == hotelId && h.IsActive);
                if (!hotelExists)
                {
                    return HandleError("Invalid hotel selected");
                }

                var validRoomTypeIds = await _context.RoomTypes
                    .Where(rt => rt.IsActive && rt.HotelId == hotelId && roomTypeIds.Contains(rt.Id))
                    .Select(rt => rt.Id)
                    .ToListAsync();

                if (validRoomTypeIds.Count != roomTypeIds.Distinct().Count())
                {
                    return HandleError("One or more room types are invalid for the selected hotel");
                }

                existingPlan.HotelId = hotelId;
                existingPlan.Name = name;
                existingPlan.Code = code;
                existingPlan.Description = description;
                existingPlan.BasePrice = basePrice;
                existingPlan.StopSell = stopSell;
                existingPlan.ValidFrom = validFrom;
                existingPlan.ValidTo = validTo;
                existingPlan.ClosedToArrival = closedToArrival;
                existingPlan.ClosedToArrivalValidFrom = ctaValidFrom;
                existingPlan.ClosedToArrivalValidTo = ctaValidTo;
                existingPlan.ClosedToDeparture = closedToDeparture;
                existingPlan.ClosedToDepartureValidFrom = ctdValidFrom;
                existingPlan.ClosedToDepartureValidTo = ctdValidTo;
                existingPlan.PriceAdjustmentType = string.IsNullOrWhiteSpace(priceAdjustmentType) ? null : priceAdjustmentType;
                existingPlan.PriceDifferenceType = string.IsNullOrWhiteSpace(priceDifferenceType) ? null : priceDifferenceType;
                existingPlan.PriceDifferenceValue = priceDifferenceValue;
                existingPlan.IsBreakfastIncluded = isBreakfast;
                existingPlan.IsLunchIncluded = isLunch;
                existingPlan.IsDinnerIncluded = isDinner;
                existingPlan.TermsAndConditions = terms;
                existingPlan.IsActive = isActive;
                existingPlan.UpdatedAt = DateTime.UtcNow;

                existingPlan.PlanRoomTypes.Clear();
                foreach (var rtId in validRoomTypeIds.Distinct())
                {
                    existingPlan.PlanRoomTypes.Add(new PlanRoomType { PlanId = existingPlan.Id, RoomTypeId = rtId });
                }

                await _context.SaveChangesAsync();

                return HandleSuccess(existingPlan, "Hotel plan updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating hotel plan with ID: {id}");
                return HandleError($"An error occurred while updating hotel plan with ID: {id}");
            }
        }

        // DELETE: api/plans/5
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Temporarily disabled for testing
        public async Task<IActionResult> DeletePlan(int id)
        {
            try
            {
                var plan = await _context.Plans.FindAsync(id);
                if (plan == null)
                {
                    return HandleNotFound("Hotel plan not found");
                }

                _context.Plans.Remove(plan);
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Hotel plan deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting hotel plan with ID: {id}");
                return HandleError($"An error occurred while deleting hotel plan with ID: {id}");
            }
        }
    }
}
