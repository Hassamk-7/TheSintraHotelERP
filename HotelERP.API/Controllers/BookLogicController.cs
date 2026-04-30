using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookLogicController : ControllerBase
    {
        private readonly BookLogicService _bookLogic;
        private readonly HotelDbContext _context;
        private readonly ILogger<BookLogicController> _logger;
        private readonly IConfiguration _configuration;

        public BookLogicController(
            BookLogicService bookLogic,
            HotelDbContext context,
            ILogger<BookLogicController> logger,
            IConfiguration configuration)
        {
            _bookLogic = bookLogic;
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        // â”€â”€â”€ CONNECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            var (success, message) = await _bookLogic.TestConnection();
            return Ok(new { success, message });
        }

        // â”€â”€â”€ SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("settings")]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _context.ChannelManagerSettings
                .Where(s => s.Provider == "BookLogic")
                .Select(s => new
                {
                    s.Id,
                    s.Provider,
                    s.BaseUrl,
                    s.SendReservationUrl,
                    s.HotelListUrl,
                    s.HotelInfoUrl,
                    s.Username,
                    s.HotelCode,
                    s.ChannelId,
                    s.IsProduction,
                    s.IsActive,
                    s.AutoSyncAvailability,
                    s.AutoPullReservations,
                    s.AutoProcessReservations,
                    s.SyncIntervalMinutes,
                    s.DefaultMinStay,
                    s.DefaultAdvanceBookingDays,
                    s.DefaultClosedOnArrival,
                    s.DefaultClosedOnDeparture,
                    s.LastAvailabilitySync,
                    s.LastReservationSync,
                    s.LastRateSync,
                    s.CreatedAt,
                    s.UpdatedAt
                })
                .FirstOrDefaultAsync();

            // Fallback to appsettings.json if no DB record
            if (settings == null)
            {
                var cfg = _configuration.GetSection("BookLogic");
                if (cfg.Exists())
                {
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            id = 0,
                            provider = "BookLogic",
                            baseUrl = cfg["BaseUrl"] ?? "",
                            sendReservationUrl = cfg["SendReservationUrl"] ?? "",
                            hotelListUrl = cfg["HotelListUrl"] ?? "",
                            hotelInfoUrl = cfg["HotelInfoUrl"] ?? "",
                            username = cfg["Username"] ?? "",
                            hotelCode = cfg["HotelCode"] ?? "",
                            channelId = int.TryParse(cfg["ChannelId"], out var cid) ? cid : 0,
                            isProduction = bool.TryParse(cfg["IsProduction"], out var ip) && ip,
                            isActive = true,
                            autoSyncAvailability = false,
                            autoPullReservations = false,
                            autoProcessReservations = false,
                            syncIntervalMinutes = 30,
                            defaultMinStay = 1,
                            defaultAdvanceBookingDays = 0,
                            defaultClosedOnArrival = 0,
                            defaultClosedOnDeparture = 0,
                            source = "appsettings"
                        }
                    });
                }
            }

            return Ok(new { success = true, data = settings });
        }

        [HttpPost("settings")]
        public async Task<IActionResult> SaveSettings([FromBody] ChannelManagerSettingDto dto)
        {
            try
            {
                var existing = await _context.ChannelManagerSettings
                    .FirstOrDefaultAsync(s => s.Provider == "BookLogic");

                if (existing != null)
                {
                    existing.BaseUrl = dto.BaseUrl;
                    existing.SendReservationUrl = dto.SendReservationUrl;
                    existing.HotelListUrl = dto.HotelListUrl;
                    existing.HotelInfoUrl = dto.HotelInfoUrl;
                    existing.Username = dto.Username;
                    if (!string.IsNullOrEmpty(dto.Password))
                        existing.Password = dto.Password;
                    existing.HotelCode = dto.HotelCode;
                    existing.ChannelId = dto.ChannelId;
                    existing.IsProduction = dto.IsProduction;
                    existing.IsActive = dto.IsActive;
                    existing.AutoSyncAvailability = dto.AutoSyncAvailability;
                    existing.AutoPullReservations = dto.AutoPullReservations;
                    existing.AutoProcessReservations = dto.AutoProcessReservations;
                    existing.SyncIntervalMinutes = dto.SyncIntervalMinutes;
                    existing.DefaultMinStay = dto.DefaultMinStay;
                    existing.DefaultAdvanceBookingDays = dto.DefaultAdvanceBookingDays;
                    existing.DefaultClosedOnArrival = dto.DefaultClosedOnArrival;
                    existing.DefaultClosedOnDeparture = dto.DefaultClosedOnDeparture;
                    existing.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    var setting = new ChannelManagerSetting
                    {
                        Provider = "BookLogic",
                        BaseUrl = dto.BaseUrl,
                        SendReservationUrl = dto.SendReservationUrl,
                        HotelListUrl = dto.HotelListUrl,
                        HotelInfoUrl = dto.HotelInfoUrl,
                        Username = dto.Username,
                        Password = dto.Password ?? "",
                        HotelCode = dto.HotelCode,
                        ChannelId = dto.ChannelId,
                        IsProduction = dto.IsProduction,
                        IsActive = dto.IsActive,
                        AutoSyncAvailability = dto.AutoSyncAvailability,
                        AutoPullReservations = dto.AutoPullReservations,
                        AutoProcessReservations = dto.AutoProcessReservations,
                        SyncIntervalMinutes = dto.SyncIntervalMinutes,
                        DefaultMinStay = dto.DefaultMinStay,
                        DefaultAdvanceBookingDays = dto.DefaultAdvanceBookingDays,
                        DefaultClosedOnArrival = dto.DefaultClosedOnArrival,
                        DefaultClosedOnDeparture = dto.DefaultClosedOnDeparture,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.ChannelManagerSettings.Add(setting);
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Settings saved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving BookLogic settings");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // â”€â”€â”€ ROOM MAPPINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("local-room-rates")]
        public async Task<IActionResult> GetLocalRoomRates()
        {
            var rates = await _context.Set<RoomRates>()
                .Include(r => r.RoomType)
                .OrderBy(r => r.RoomType.Name)
                .ThenBy(r => r.RateName)
                .Select(r => new
                {
                    r.Id,
                    r.RoomTypeId,
                    roomTypeName = r.RoomType.Name,
                    r.RateCode,
                    r.RateName,
                    r.BaseRate,
                    r.Currency,
                    displayName = string.IsNullOrWhiteSpace(r.RateCode)
                        ? $"{r.RoomType.Name} - {r.RateName}"
                        : $"{r.RoomType.Name} - {r.RateName} ({r.RateCode})"
                })
                .ToListAsync();

            return Ok(new { success = true, data = rates });
        }

        [HttpGet("room-mappings")]
        public async Task<IActionResult> GetRoomMappings()
        {
            var mappings = await _context.ChannelManagerRoomMappings
                .Include(m => m.LocalRoomType)
                .Where(m => m.ChannelManagerSetting.Provider == "BookLogic")
                .Select(m => new
                {
                    m.Id,
                    m.ChannelManagerSettingId,
                    m.LocalRoomTypeId,
                    LocalRoomTypeName = m.LocalRoomType.Name,
                    m.ExternalRoomId,
                    m.ExternalRoomName,
                    m.IsActive,
                    m.CreatedAt
                })
                .ToListAsync();

            return Ok(new { success = true, data = mappings });
        }

        [HttpPost("room-mappings")]
        public async Task<IActionResult> SaveRoomMapping([FromBody] RoomMappingDto dto)
        {
            try
            {
                var settingId = await GetOrCreateSettingId();
                if (settingId == 0)
                    return BadRequest(new { success = false, message = "Please configure BookLogic settings first" });

                if (dto.Id > 0)
                {
                    var existing = await _context.ChannelManagerRoomMappings.FindAsync(dto.Id);
                    if (existing != null)
                    {
                        existing.LocalRoomTypeId = dto.LocalRoomTypeId;
                        existing.ExternalRoomId = dto.ExternalRoomId;
                        existing.ExternalRoomName = dto.ExternalRoomName;
                        existing.IsActive = dto.IsActive;
                        existing.UpdatedAt = DateTime.UtcNow;
                    }
                }
                else
                {
                    var mapping = new ChannelManagerRoomMapping
                    {
                        ChannelManagerSettingId = settingId,
                        LocalRoomTypeId = dto.LocalRoomTypeId,
                        ExternalRoomId = dto.ExternalRoomId,
                        ExternalRoomName = dto.ExternalRoomName,
                        IsActive = dto.IsActive,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.ChannelManagerRoomMappings.Add(mapping);
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Room mapping saved" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("room-mappings/{id}")]
        public async Task<IActionResult> DeleteRoomMapping(int id)
        {
            var mapping = await _context.ChannelManagerRoomMappings.FindAsync(id);
            if (mapping == null)
                return NotFound(new { success = false, message = "Mapping not found" });

            _context.ChannelManagerRoomMappings.Remove(mapping);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Room mapping deleted" });
        }

        // â”€â”€â”€ RATE MAPPINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("rate-mappings")]
        public async Task<IActionResult> GetRateMappings()
        {
            var mappings = await _context.ChannelManagerRateMappings
                .Include(m => m.RoomMapping)
                    .ThenInclude(rm => rm.LocalRoomType)
                .Where(m => m.RoomMapping.ChannelManagerSetting.Provider == "BookLogic")
                .Select(m => new
                {
                    m.Id,
                    m.ChannelManagerRoomMappingId,
                    RoomMappingName = m.RoomMapping.ExternalRoomName,
                    LocalRoomTypeName = m.RoomMapping.LocalRoomType.Name,
                    m.LocalRoomRateId,
                    m.ExternalRateId,
                    m.ExternalRateName,
                    m.CurrencyCode,
                    m.IsActive,
                    m.CreatedAt
                })
                .ToListAsync();

            return Ok(new { success = true, data = mappings });
        }

        [HttpPost("rate-mappings")]
        public async Task<IActionResult> SaveRateMapping([FromBody] RateMappingDto dto)
        {
            try
            {
                if (dto.ChannelManagerRoomMappingId <= 0)
                    return BadRequest(new { success = false, message = "Please select a room mapping" });
                if (string.IsNullOrWhiteSpace(dto.ExternalRateId))
                    return BadRequest(new { success = false, message = "External Rate ID is required" });

                if (dto.Id > 0)
                {
                    var existing = await _context.ChannelManagerRateMappings.FindAsync(dto.Id);
                    if (existing != null)
                    {
                        existing.ChannelManagerRoomMappingId = dto.ChannelManagerRoomMappingId;
                        existing.LocalRoomRateId = dto.LocalRoomRateId;
                        existing.ExternalRateId = dto.ExternalRateId;
                        existing.ExternalRateName = dto.ExternalRateName;
                        existing.CurrencyCode = dto.CurrencyCode;
                        existing.IsActive = dto.IsActive;
                        existing.UpdatedAt = DateTime.UtcNow;
                    }
                }
                else
                {
                    var settingId = await GetOrCreateSettingId();
                    if (settingId == 0)
                        return BadRequest(new { success = false, message = "Please configure BookLogic settings first" });

                    var mapping = new ChannelManagerRateMapping
                    {
                        ChannelManagerSettingId = settingId,
                        ChannelManagerRoomMappingId = dto.ChannelManagerRoomMappingId,
                        LocalRoomRateId = dto.LocalRoomRateId,
                        ExternalRateId = dto.ExternalRateId,
                        ExternalRateName = dto.ExternalRateName,
                        CurrencyCode = dto.CurrencyCode,
                        IsActive = dto.IsActive,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.ChannelManagerRateMappings.Add(mapping);
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Rate mapping saved" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving rate mapping");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("rate-mappings/{id}")]
        public async Task<IActionResult> DeleteRateMapping(int id)
        {
            var mapping = await _context.ChannelManagerRateMappings.FindAsync(id);
            if (mapping == null)
                return NotFound(new { success = false, message = "Mapping not found" });

            _context.ChannelManagerRateMappings.Remove(mapping);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Rate mapping deleted" });
        }

        // â”€â”€â”€ ROOMS INVENTORY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("rooms-inventory")]
        public async Task<IActionResult> GetRoomsInventory()
        {
            var (success, message, rooms) = await _bookLogic.GetRoomsInventory();
            return Ok(new { success, message, data = rooms });
        }

        // â”€â”€â”€ AVAILABILITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("availability-info")]
        public async Task<IActionResult> GetAvailabilityInfo(
            [FromQuery] string allotmentId, [FromQuery] string fromDate, [FromQuery] string toDate)
        {
            var (success, message, raw) = await _bookLogic.GetAvailabilityInfo(allotmentId, fromDate, toDate);
            return Ok(new { success, message, data = raw });
        }

        [HttpGet("allotment-list")]
        public async Task<IActionResult> GetAllotmentList(
            [FromQuery] string roomId, [FromQuery] string fromDate, [FromQuery] string toDate)
        {
            var (success, message, raw) = await _bookLogic.GetAllotmentList(roomId, fromDate, toDate);
            return Ok(new { success, message, data = raw });
        }

        [HttpPost("availability-update")]
        public async Task<IActionResult> UpdateAvailability([FromBody] AvailabilityUpdateDto dto)
        {
            var (success, message) = await _bookLogic.UpdateAvailability(
                dto.RoomId, dto.FromDate, dto.ToDate, dto.Allotment,
                dto.StopSales, dto.MinStay, dto.AdvanceBookingDays,
                dto.ClosedOnArrival, dto.ClosedOnDeparture);
            return Ok(new { success, message });
        }

        [HttpPost("sync-all-availability")]
        public async Task<IActionResult> SyncAllAvailability([FromBody] DateRangeDto dto)
        {
            var (success, message, successCount, failCount) =
                await _bookLogic.SyncAllAvailability(dto.FromDate, dto.ToDate);
            return Ok(new { success, message, successCount, failCount });
        }

        // â”€â”€â”€ RATES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("rate-list")]
        public async Task<IActionResult> GetRateList(
            [FromQuery] string roomId, [FromQuery] string fromDate, [FromQuery] string toDate)
        {
            var (success, message, raw) = await _bookLogic.GetRateList(roomId, fromDate, toDate);
            return Ok(new { success, message, data = raw });
        }

        [HttpGet("rate-info")]
        public async Task<IActionResult> GetRateInfo(
            [FromQuery] string rateId, [FromQuery] string fromDate, [FromQuery] string toDate)
        {
            var (success, message, raw) = await _bookLogic.GetRateInfo(rateId, fromDate, toDate);
            return Ok(new { success, message, data = raw });
        }

        [HttpPost("rate-update")]
        public async Task<IActionResult> UpdateRate([FromBody] RateUpdateDto dto)
        {
            var combinations = dto.Combinations ?? new List<BookLogicService.RateCombination>();
            if (!combinations.Any())
            {
                combinations.Add(new BookLogicService.RateCombination
                {
                    Adult = dto.Adults > 0 ? dto.Adults : 1,
                    ChildA = dto.ChildA,
                    ChildB = dto.ChildB,
                    Infant = dto.Infant,
                    Price = dto.Price,
                    MinStay = dto.MinStay
                });
            }

            var (success, message) = await _bookLogic.UpdateRate(
                dto.RateId, dto.FromDate, dto.ToDate, combinations,
                dto.FreeCancel, dto.Closeout, dto.PartialUpdate);
            return Ok(new { success, message });
        }

        // â”€â”€â”€ RESERVATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpPost("pull-reservations")]
        public async Task<IActionResult> PullReservations([FromBody] DateRangeDto? dto = null)
        {
            var (success, message, reservations) = await _bookLogic.GetReservations(
                dto?.FromDate, dto?.ToDate);
            return Ok(new
            {
                success,
                message,
                data = reservations.Select(r => new
                {
                    r.Id,
                    r.ExternalReservationId,
                    r.ExternalBookingId,
                    r.ExternalStatus,
                    r.SyncType,
                    r.GuestFirstName,
                    r.GuestLastName,
                    r.GuestEmail,
                    r.GuestPhone,
                    r.ExternalRoomId,
                    r.ExternalRoomName,
                    r.ExternalRateId,
                    r.ExternalRateName,
                    r.TravelAgentName,
                    r.LeaderName,
                    r.CheckInDate,
                    r.CheckOutDate,
                    r.Adults,
                    r.Children,
                    r.TotalAmount,
                    r.CurrencyCode,
                    r.IsProcessed,
                    r.IsMarkedAsSent,
                    r.ReceivedAt
                })
            });
        }

        [HttpGet("reservations")]
        public async Task<IActionResult> GetChannelReservations(
            [FromQuery] bool? processed = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var query = _context.ChannelManagerReservations
                .OrderByDescending(r => r.ReceivedAt)
                .AsQueryable();

            if (processed.HasValue)
                query = query.Where(r => r.IsProcessed == processed.Value);

            var total = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new
                {
                    r.Id,
                    r.ExternalReservationId,
                    r.ExternalBookingId,
                    r.ExternalStatus,
                    r.SyncType,
                    r.GuestFirstName,
                    r.GuestLastName,
                    r.GuestEmail,
                    r.GuestPhone,
                    r.GuestCountryCode,
                    r.ExternalRoomId,
                    r.ExternalRoomName,
                    r.ExternalRateId,
                    r.ExternalRateName,
                    r.TravelAgentName,
                    r.LeaderName,
                    r.CheckInDate,
                    r.CheckOutDate,
                    r.Adults,
                    r.Children,
                    r.TotalAmount,
                    r.CurrencyCode,
                    r.PaymentType,
                    r.Remarks,
                    r.IsMarkedAsSent,
                    r.IsProcessed,
                    r.LocalReservationId,
                    r.ProcessingNotes,
                    r.ReceivedAt,
                    r.ProcessedAt
                })
                .ToListAsync();

            return Ok(new { success = true, data = items, total, page, pageSize });
        }

        [HttpPost("process-reservation/{id}")]
        public async Task<IActionResult> ProcessReservation(int id)
        {
            var (success, message) = await _bookLogic.ProcessReservation(id);
            return Ok(new { success, message });
        }

        [HttpPost("process-all-reservations")]
        public async Task<IActionResult> ProcessAllReservations()
        {
            var unprocessed = await _context.ChannelManagerReservations
                .Where(r => !r.IsProcessed)
                .OrderBy(r => r.Id)
                .Select(r => r.Id)
                .ToListAsync();

            if (!unprocessed.Any())
                return Ok(new { success = true, message = "No unprocessed reservations", processed = 0, failed = 0 });

            int processed = 0, failed = 0;
            var errors = new List<string>();
            foreach (var id in unprocessed)
            {
                var (success, message) = await _bookLogic.ProcessReservation(id);
                if (success) processed++;
                else { failed++; errors.Add($"#{id}: {message}"); }
            }

            return Ok(new
            {
                success = failed == 0,
                message = $"Processed {processed}, failed {failed} of {unprocessed.Count} reservations",
                processed,
                failed,
                errors
            });
        }

        [HttpPost("mark-send/{pnrId}")]
        public async Task<IActionResult> MarkSend(string pnrId)
        {
            var (success, message) = await _bookLogic.MarkReservationAsSent(pnrId);
            return Ok(new { success, message });
        }

        [HttpPost("sync-booking")]
        public async Task<IActionResult> SyncBooking()
        {
            var (success, message, raw) = await _bookLogic.SyncBooking();
            return Ok(new { success, message, data = raw });
        }

        [HttpPost("send-reservation/{reservationId}")]
        public async Task<IActionResult> SendReservation(int reservationId)
        {
            var (success, message) = await _bookLogic.SendReservationToBookLogic(reservationId);
            return Ok(new { success, message });
        }

        [HttpPost("update-reservation/{reservationId}")]
        public async Task<IActionResult> UpdateReservation(int reservationId)
        {
            var (success, message) = await _bookLogic.UpdateReservationInBookLogic(reservationId);
            return Ok(new { success, message });
        }

        [HttpPost("cancel-reservation/{reservationId}")]
        public async Task<IActionResult> CancelReservation(int reservationId)
        {
            var (success, message) = await _bookLogic.CancelReservationInBookLogic(reservationId);
            return Ok(new { success, message });
        }

        // â”€â”€â”€ POLICIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("payment-policies")]
        public async Task<IActionResult> GetPaymentPolicies()
        {
            var (success, raw) = await _bookLogic.GetPaymentPolicies();
            return Ok(new { success, data = raw });
        }

        [HttpGet("cancel-policies")]
        public async Task<IActionResult> GetCancelPolicies()
        {
            var (success, raw) = await _bookLogic.GetCancelPolicies();
            return Ok(new { success, data = raw });
        }

        // â”€â”€â”€ LOGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs(
            [FromQuery] string? action = null,
            [FromQuery] string? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            var query = _context.ChannelManagerLogs
                .OrderByDescending(l => l.Timestamp)
                .AsQueryable();

            if (!string.IsNullOrEmpty(action))
                query = query.Where(l => l.Action == action);
            if (!string.IsNullOrEmpty(status))
                query = query.Where(l => l.Status == status);

            var total = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(l => new
                {
                    l.Id,
                    l.Action,
                    l.Direction,
                    l.Status,
                    l.HttpStatusCode,
                    l.DurationMs,
                    l.ErrorMessage,
                    l.ExternalReservationId,
                    l.ExternalRoomId,
                    l.Timestamp,
                    RequestPreview = l.RequestPayload != null && l.RequestPayload.Length > 200
                        ? l.RequestPayload.Substring(0, 200) + "..."
                        : l.RequestPayload,
                    ResponsePreview = l.ResponsePayload != null && l.ResponsePayload.Length > 200
                        ? l.ResponsePayload.Substring(0, 200) + "..."
                        : l.ResponsePayload
                })
                .ToListAsync();

            return Ok(new { success = true, data = items, total, page, pageSize });
        }

        [HttpDelete("logs/clear")]
        public async Task<IActionResult> ClearLogs([FromQuery] int? keepDays = 7)
        {
            var cutoff = DateTime.UtcNow.AddDays(-(keepDays ?? 7));
            var oldLogs = await _context.ChannelManagerLogs
                .Where(l => l.Timestamp < cutoff)
                .ToListAsync();

            if (!oldLogs.Any())
                return Ok(new { success = true, message = "No old logs to clear", deleted = 0 });

            _context.ChannelManagerLogs.RemoveRange(oldLogs);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = $"Cleared {oldLogs.Count} logs older than {keepDays} days", deleted = oldLogs.Count });
        }

        [HttpGet("logs/{id}")]
        public async Task<IActionResult> GetLogDetail(int id)
        {
            var log = await _context.ChannelManagerLogs
                .Where(l => l.Id == id)
                .Select(l => new
                {
                    l.Id,
                    l.Action,
                    l.Direction,
                    l.Status,
                    l.RequestPayload,
                    l.ResponsePayload,
                    l.ErrorMessage,
                    l.HttpStatusCode,
                    l.DurationMs,
                    l.ExternalReservationId,
                    l.ExternalRoomId,
                    l.Timestamp
                })
                .FirstOrDefaultAsync();

            if (log == null)
                return NotFound(new { success = false, message = "Log not found" });

            return Ok(new { success = true, data = log });
        }

        // â”€â”€â”€ DASHBOARD OVERVIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var settings = await _context.ChannelManagerSettings
                .FirstOrDefaultAsync(s => s.Provider == "BookLogic" && s.IsActive);

            var hasAppsettingsConfig = false;
            string? fallbackHotelCode = null;
            if (settings == null)
            {
                var cfg = _configuration.GetSection("BookLogic");
                hasAppsettingsConfig = cfg.Exists() && !string.IsNullOrEmpty(cfg["BaseUrl"]);
                fallbackHotelCode = cfg["HotelCode"];
            }

            var isConfigured = settings != null || hasAppsettingsConfig;
            var isActive = settings?.IsActive ?? hasAppsettingsConfig;

            var totalMappedRooms = await _context.ChannelManagerRoomMappings
                .CountAsync(m => m.IsActive);
            var totalMappedRates = await _context.ChannelManagerRateMappings
                .CountAsync(m => m.IsActive);
            var totalReservations = await _context.ChannelManagerReservations.CountAsync();
            var pendingReservations = await _context.ChannelManagerReservations
                .CountAsync(r => !r.IsProcessed);
            var todayLogs = await _context.ChannelManagerLogs
                .CountAsync(l => l.Timestamp >= DateTime.UtcNow.Date);
            var failedLogs = await _context.ChannelManagerLogs
                .CountAsync(l => l.Status == "Failed" && l.Timestamp >= DateTime.UtcNow.Date);

            var recentLogs = await _context.ChannelManagerLogs
                .OrderByDescending(l => l.Timestamp)
                .Take(5)
                .Select(l => new
                {
                    l.Id,
                    l.Action,
                    l.Status,
                    l.DurationMs,
                    l.Timestamp
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = new
                {
                    isConfigured,
                    isActive,
                    hotelCode = settings?.HotelCode ?? fallbackHotelCode,
                    isProduction = settings?.IsProduction ?? false,
                    lastAvailabilitySync = settings?.LastAvailabilitySync,
                    lastReservationSync = settings?.LastReservationSync,
                    lastRateSync = settings?.LastRateSync,
                    totalMappedRooms,
                    totalMappedRates,
                    totalReservations,
                    pendingReservations,
                    todayApiCalls = todayLogs,
                    todayFailedCalls = failedLogs,
                    recentLogs
                }
            });
        }

        [HttpGet("configuration-audit")]
        public async Task<IActionResult> GetConfigurationAudit()
        {
            var activeSetting = await _context.ChannelManagerSettings
                .FirstOrDefaultAsync(s => s.Provider == "BookLogic" && s.IsActive);

            var roomTypes = await _context.RoomTypes
                .OrderBy(rt => rt.Name)
                .Select(rt => new
                {
                    rt.Id,
                    rt.Name
                })
                .ToListAsync();

            var roomMappings = await _context.ChannelManagerRoomMappings
                .Where(m => m.IsActive)
                .Select(m => new
                {
                    m.Id,
                    m.LocalRoomTypeId,
                    m.ExternalRoomId,
                    m.ExternalRoomName
                })
                .ToListAsync();

            var localRoomRates = await _context.Set<RoomRates>()
                .OrderBy(r => r.RoomTypeId)
                .ThenBy(r => r.RateName)
                .Select(r => new
                {
                    r.Id,
                    r.RoomTypeId,
                    r.RateName,
                    r.RateCode,
                    r.Currency
                })
                .ToListAsync();

            var rateMappings = await _context.ChannelManagerRateMappings
                .Where(m => m.IsActive)
                .Select(m => new
                {
                    m.Id,
                    m.ChannelManagerRoomMappingId,
                    m.LocalRoomRateId,
                    m.ExternalRateId,
                    m.ExternalRateName,
                    m.CurrencyCode
                })
                .ToListAsync();

            var unmappedRoomTypes = roomTypes
                .Where(rt => !roomMappings.Any(rm => rm.LocalRoomTypeId == rt.Id))
                .Select(rt => new
                {
                    rt.Id,
                    rt.Name
                })
                .ToList();

            var roomRateCoverage = roomTypes.Select(rt =>
            {
                var roomMapping = roomMappings.FirstOrDefault(rm => rm.LocalRoomTypeId == rt.Id);
                var ratesForRoomType = localRoomRates.Where(r => r.RoomTypeId == rt.Id).ToList();

                if (roomMapping == null)
                {
                    return new
                    {
                        roomTypeId = rt.Id,
                        roomTypeName = rt.Name,
                        hasRoomMapping = false,
                        externalRoomId = (string?)null,
                        externalRoomName = (string?)null,
                        hasAnyRateMapping = false,
                        missingRates = ratesForRoomType.Select(r => new
                        {
                            r.Id,
                            r.RateName,
                            r.RateCode,
                            r.Currency
                        }).ToList()
                    };
                }

                var rateMappingsForRoom = rateMappings
                    .Where(rm => rm.ChannelManagerRoomMappingId == roomMapping.Id)
                    .ToList();

                var hasDefaultRateMapping = rateMappingsForRoom.Any(rm => rm.LocalRoomRateId == null);
                var missingRates = ratesForRoomType
                    .Where(r => !rateMappingsForRoom.Any(rm => rm.LocalRoomRateId == r.Id) && !hasDefaultRateMapping)
                    .Select(r => new
                    {
                        r.Id,
                        r.RateName,
                        r.RateCode,
                        r.Currency
                    })
                    .ToList();

                return new
                {
                    roomTypeId = rt.Id,
                    roomTypeName = rt.Name,
                    hasRoomMapping = true,
                    externalRoomId = roomMapping.ExternalRoomId,
                    externalRoomName = roomMapping.ExternalRoomName,
                    hasAnyRateMapping = rateMappingsForRoom.Any(),
                    missingRates
                };
            }).ToList();

            var missingRateCoverage = roomRateCoverage
                .Where(x => x.hasRoomMapping && x.missingRates.Any())
                .ToList();

            return Ok(new
            {
                success = true,
                data = new
                {
                    settings = new
                    {
                        hasActiveSettings = activeSetting != null,
                        hotelCode = activeSetting?.HotelCode,
                        baseUrl = activeSetting?.BaseUrl,
                        sendReservationUrl = activeSetting?.SendReservationUrl,
                        channelId = activeSetting?.ChannelId ?? 0,
                        outboundReservationReady = activeSetting != null
                            && !string.IsNullOrWhiteSpace(activeSetting.SendReservationUrl)
                            && activeSetting.ChannelId > 0
                    },
                    summary = new
                    {
                        totalRoomTypes = roomTypes.Count,
                        totalLocalRates = localRoomRates.Count,
                        totalMappedRooms = roomMappings.Count,
                        totalMappedRates = rateMappings.Count,
                        unmappedRoomTypeCount = unmappedRoomTypes.Count,
                        roomTypesMissingRateCoverageCount = missingRateCoverage.Count
                    },
                    unmappedRoomTypes,
                    roomRateCoverage
                }
            });
        }

        // â”€â”€â”€ HELPER: Get or auto-create settings from appsettings.json â”€â”€

        private async Task<int> GetOrCreateSettingId()
        {
            var settingId = await _context.ChannelManagerSettings
                .Where(s => s.Provider == "BookLogic" && s.IsActive)
                .Select(s => s.Id)
                .FirstOrDefaultAsync();

            if (settingId > 0) return settingId;

            var cfg = _configuration.GetSection("BookLogic");
            if (!cfg.Exists() || string.IsNullOrEmpty(cfg["BaseUrl"])) return 0;

            var setting = new ChannelManagerSetting
            {
                Provider = "BookLogic",
                BaseUrl = cfg["BaseUrl"] ?? "",
                SendReservationUrl = cfg["SendReservationUrl"],
                HotelListUrl = cfg["HotelListUrl"],
                HotelInfoUrl = cfg["HotelInfoUrl"],
                Username = cfg["Username"] ?? "",
                Password = cfg["Password"] ?? "",
                HotelCode = cfg["HotelCode"] ?? "",
                ChannelId = int.TryParse(cfg["ChannelId"], out var cid) ? cid : 0,
                IsProduction = bool.TryParse(cfg["IsProduction"], out var ip) && ip,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.ChannelManagerSettings.Add(setting);
            await _context.SaveChangesAsync();
            return setting.Id;
        }

        // â”€â”€â”€ DTOs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        public class ChannelManagerSettingDto
        {
            public string BaseUrl { get; set; } = "";
            public string? SendReservationUrl { get; set; }
            public string? HotelListUrl { get; set; }
            public string? HotelInfoUrl { get; set; }
            public string Username { get; set; } = "";
            public string? Password { get; set; }
            public string HotelCode { get; set; } = "";
            public int ChannelId { get; set; }
            public bool IsProduction { get; set; }
            public bool IsActive { get; set; } = true;
            public bool AutoSyncAvailability { get; set; }
            public bool AutoPullReservations { get; set; }
            public bool AutoProcessReservations { get; set; }
            public int SyncIntervalMinutes { get; set; } = 30;
            public int DefaultMinStay { get; set; } = 1;
            public int DefaultAdvanceBookingDays { get; set; }
            public int DefaultClosedOnArrival { get; set; }
            public int DefaultClosedOnDeparture { get; set; }
        }

        public class RoomMappingDto
        {
            public int Id { get; set; }
            public int LocalRoomTypeId { get; set; }
            public string ExternalRoomId { get; set; } = "";
            public string? ExternalRoomName { get; set; }
            public bool IsActive { get; set; } = true;
        }

        public class RateMappingDto
        {
            public int Id { get; set; }
            public int ChannelManagerRoomMappingId { get; set; }
            public int? LocalRoomRateId { get; set; }
            public string ExternalRateId { get; set; } = "";
            public string? ExternalRateName { get; set; }
            public string? CurrencyCode { get; set; }
            public bool IsActive { get; set; } = true;
        }

        public class AvailabilityUpdateDto
        {
            public string RoomId { get; set; } = "";
            public string FromDate { get; set; } = "";
            public string ToDate { get; set; } = "";
            public int Allotment { get; set; }
            public int StopSales { get; set; }
            public int MinStay { get; set; } = 1;
            public int AdvanceBookingDays { get; set; }
            public int ClosedOnArrival { get; set; }
            public int ClosedOnDeparture { get; set; }
        }

        public class RateUpdateDto
        {
            public string RateId { get; set; } = "";
            public string FromDate { get; set; } = "";
            public string ToDate { get; set; } = "";
            public decimal Price { get; set; }
            public int Adults { get; set; } = 1;
            public int ChildB { get; set; }
            public int ChildA { get; set; }
            public int Infant { get; set; }
            public int MinStay { get; set; }
            public int FreeCancel { get; set; }
            public int Closeout { get; set; }
            public int PartialUpdate { get; set; } = 1;
            public List<BookLogicService.RateCombination>? Combinations { get; set; }
        }

        public class DateRangeDto
        {
            public string FromDate { get; set; } = "";
            public string ToDate { get; set; } = "";
        }
    }
}

