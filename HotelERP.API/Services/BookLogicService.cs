using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using HotelERP.API.Data;
using HotelERP.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HotelERP.API.Services
{
    public class BookLogicSettings
    {
        public string BaseUrl { get; set; } = "";
        public string SendReservationUrl { get; set; } = "";
        public string HotelListUrl { get; set; } = "";
        public string HotelInfoUrl { get; set; } = "";
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string HotelCode { get; set; } = "";
        public int ChannelId { get; set; }
        public bool IsProduction { get; set; }
        public int DefaultMinStay { get; set; } = 1;
        public int DefaultAdvanceBookingDays { get; set; }
        public int DefaultClosedOnArrival { get; set; }
        public int DefaultClosedOnDeparture { get; set; }
    }

    public class BookLogicService
    {
        private readonly HttpClient _httpClient;
        private readonly HotelDbContext _context;
        private readonly ILogger<BookLogicService> _logger;
        private readonly BookLogicSettings _settings;

        public BookLogicService(
            HttpClient httpClient,
            HotelDbContext context,
            ILogger<BookLogicService> logger,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _context = context;
            _logger = logger;
            _settings = new BookLogicSettings();
            configuration.GetSection("BookLogic").Bind(_settings);
        }

        // â”€â”€â”€ Helper: Get effective settings (DB override or appsettings) â”€â”€â”€
        private async Task<BookLogicSettings> GetEffectiveSettings()
        {
            var dbSetting = await _context.ChannelManagerSettings
                .FirstOrDefaultAsync(s => s.Provider == "BookLogic" && s.IsActive);

            if (dbSetting != null)
            {
                return new BookLogicSettings
                {
                    BaseUrl = !string.IsNullOrEmpty(dbSetting.BaseUrl) ? dbSetting.BaseUrl : _settings.BaseUrl,
                    SendReservationUrl = !string.IsNullOrEmpty(dbSetting.SendReservationUrl) ? dbSetting.SendReservationUrl : _settings.SendReservationUrl,
                    HotelListUrl = !string.IsNullOrEmpty(dbSetting.HotelListUrl) ? dbSetting.HotelListUrl : _settings.HotelListUrl,
                    HotelInfoUrl = !string.IsNullOrEmpty(dbSetting.HotelInfoUrl) ? dbSetting.HotelInfoUrl : _settings.HotelInfoUrl,
                    Username = !string.IsNullOrEmpty(dbSetting.Username) ? dbSetting.Username : _settings.Username,
                    Password = !string.IsNullOrEmpty(dbSetting.Password) ? dbSetting.Password : _settings.Password,
                    HotelCode = !string.IsNullOrEmpty(dbSetting.HotelCode) ? dbSetting.HotelCode : _settings.HotelCode,
                    ChannelId = dbSetting.ChannelId > 0 ? dbSetting.ChannelId : _settings.ChannelId,
                    IsProduction = dbSetting.IsProduction,
                    DefaultMinStay = dbSetting.DefaultMinStay > 0 ? dbSetting.DefaultMinStay : 1,
                    DefaultAdvanceBookingDays = dbSetting.DefaultAdvanceBookingDays,
                    DefaultClosedOnArrival = dbSetting.DefaultClosedOnArrival,
                    DefaultClosedOnDeparture = dbSetting.DefaultClosedOnDeparture
                };
            }

            return _settings;
        }

        // â”€â”€â”€ Helper: Parse dd/MM/yyyy date from BookLogic â”€â”€â”€
        private DateTime? ParseBLDate(string? dateStr)
        {
            if (string.IsNullOrWhiteSpace(dateStr)) return null;
            if (DateTime.TryParseExact(dateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var d))
                return d;
            if (DateTime.TryParse(dateStr, out var d2))
                return d2;
            return null;
        }

        // â”€â”€â”€ Helper: Send XML request and log â”€â”€â”€
        private async Task<(bool Success, string ResponseBody, int StatusCode, long DurationMs)> SendXmlRequest(
            string url, string xmlBody, string action, string direction = "Outbound",
            string? externalReservationId = null, string? externalRoomId = null)
        {
            var sw = Stopwatch.StartNew();
            int statusCode = 0;
            string responseBody = "";
            bool success = false;

            try
            {
                var content = new StringContent(xmlBody, Encoding.UTF8, "application/xml");
                var response = await _httpClient.PostAsync(url, content);
                statusCode = (int)response.StatusCode;
                responseBody = await response.Content.ReadAsStringAsync();
                sw.Stop();

                success = response.IsSuccessStatusCode;

                var log = new ChannelManagerLog
                {
                    Action = action,
                    Direction = direction,
                    Status = success ? "Success" : "Failed",
                    RequestPayload = xmlBody,
                    ResponsePayload = responseBody.Length > 4000 ? responseBody.Substring(0, 4000) : responseBody,
                    HttpStatusCode = statusCode,
                    DurationMs = sw.ElapsedMilliseconds,
                    ExternalReservationId = externalReservationId,
                    ExternalRoomId = externalRoomId,
                    Timestamp = DateTime.UtcNow
                };

                _context.ChannelManagerLogs.Add(log);
                await _context.SaveChangesAsync();

                return (success, responseBody, statusCode, sw.ElapsedMilliseconds);
            }
            catch (Exception ex)
            {
                sw.Stop();
                _logger.LogError(ex, "BookLogic API call failed: {Action}", action);

                var log = new ChannelManagerLog
                {
                    Action = action,
                    Direction = direction,
                    Status = "Failed",
                    RequestPayload = xmlBody,
                    ErrorMessage = ex.Message,
                    HttpStatusCode = statusCode,
                    DurationMs = sw.ElapsedMilliseconds,
                    Timestamp = DateTime.UtcNow
                };

                _context.ChannelManagerLogs.Add(log);
                await _context.SaveChangesAsync();

                return (false, ex.Message, statusCode, sw.ElapsedMilliseconds);
            }
        }

        // â”€â”€â”€ Helper: Send JSON request and log â”€â”€â”€
        private async Task<(bool Success, string ResponseBody, int StatusCode, long DurationMs)> SendJsonRequest(
            string url, string jsonBody, string action, string direction = "Outbound")
        {
            var sw = Stopwatch.StartNew();
            int statusCode = 0;
            string responseBody = "";
            bool success = false;

            try
            {
                var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(url, content);
                statusCode = (int)response.StatusCode;
                responseBody = await response.Content.ReadAsStringAsync();
                sw.Stop();

                success = response.IsSuccessStatusCode;

                var log = new ChannelManagerLog
                {
                    Action = action,
                    Direction = direction,
                    Status = success ? "Success" : "Failed",
                    RequestPayload = jsonBody.Length > 4000 ? jsonBody.Substring(0, 4000) : jsonBody,
                    ResponsePayload = responseBody.Length > 4000 ? responseBody.Substring(0, 4000) : responseBody,
                    HttpStatusCode = statusCode,
                    DurationMs = sw.ElapsedMilliseconds,
                    Timestamp = DateTime.UtcNow
                };

                _context.ChannelManagerLogs.Add(log);
                await _context.SaveChangesAsync();

                return (success, responseBody, statusCode, sw.ElapsedMilliseconds);
            }
            catch (Exception ex)
            {
                sw.Stop();
                _logger.LogError(ex, "BookLogic JSON API call failed: {Action}", action);

                var log = new ChannelManagerLog
                {
                    Action = action,
                    Direction = direction,
                    Status = "Failed",
                    RequestPayload = jsonBody.Length > 4000 ? jsonBody.Substring(0, 4000) : jsonBody,
                    ErrorMessage = ex.Message,
                    HttpStatusCode = statusCode,
                    DurationMs = sw.ElapsedMilliseconds,
                    Timestamp = DateTime.UtcNow
                };

                _context.ChannelManagerLogs.Add(log);
                await _context.SaveChangesAsync();

                return (false, ex.Message, statusCode, sw.ElapsedMilliseconds);
            }
        }

        // â”€â”€â”€ Helper: Normalize date to dd/MM/yyyy for BookLogic XML â”€â”€â”€
        private string NormalizeDateForBL(string date)
        {
            if (string.IsNullOrWhiteSpace(date)) return date;
            // Already dd/MM/yyyy
            if (date.Length == 10 && date[2] == '/' && date[5] == '/') return date;
            // Convert yyyy-MM-dd â†’ dd/MM/yyyy
            if (DateTime.TryParse(date, out var dt))
                return dt.ToString("dd/MM/yyyy");
            return date;
        }

        private IQueryable<Reservation> GetBlockingReservationsQuery()
        {
            return _context.Reservations.Where(r =>
                r.RoomId.HasValue &&
                r.Status != "Cancelled" &&
                r.Status != "CheckedOut" &&
                r.Status != "NoShow");
        }

        private async Task<List<int>> GetReservedRoomIdsForDateRange(DateTime checkIn, DateTime checkOut)
        {
            return await GetBlockingReservationsQuery()
                .Where(r => r.CheckInDate < checkOut && r.CheckOutDate > checkIn)
                .Select(r => r.RoomId!.Value)
                .Distinct()
                .ToListAsync();
        }

        private async Task<List<Room>> GetAvailableRoomsForDateRange(int roomTypeId, DateTime checkIn, DateTime checkOut)
        {
            var reservedRoomIds = await GetReservedRoomIdsForDateRange(checkIn, checkOut);

            return await _context.Rooms
                .Where(r => r.RoomTypeId == roomTypeId
                         && r.IsActive
                         && r.Status == "Available"
                         && !reservedRoomIds.Contains(r.Id))
                .OrderBy(r => r.RoomNumber)
                .ToListAsync();
        }

        private async Task<int> GetAvailableRoomCountForDateRange(int roomTypeId, DateTime checkIn, DateTime checkOut)
        {
            var availableRooms = await GetAvailableRoomsForDateRange(roomTypeId, checkIn, checkOut);
            return availableRooms.Count;
        }

        private async Task<RoomType?> GetReservationRoomType(Reservation reservation)
        {
            if (reservation.Room?.RoomType != null)
                return reservation.Room.RoomType;

            if (reservation.RoomTypeId.HasValue)
                return await _context.Set<RoomType>().FirstOrDefaultAsync(rt => rt.Id == reservation.RoomTypeId.Value);

            if (reservation.RoomId.HasValue)
            {
                var room = await _context.Rooms
                    .Include(r => r.RoomType)
                    .FirstOrDefaultAsync(r => r.Id == reservation.RoomId.Value);
                return room?.RoomType;
            }

            return null;
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 1. TEST CONNECTION â€” Uses rooms-inventory as connectivity test
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message)> TestConnection()
        {
            var settings = await GetEffectiveSettings();

            var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<RoomsInventoryRQ>
    <RequestorID>
        <directions>{settings.Username}</directions>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
</RoomsInventoryRQ>";

            var (success, responseBody, statusCode, durationMs) = await SendXmlRequest(
                settings.BaseUrl, xml, "TestConnection");

            if (success && responseBody.Contains("RoomsInventoryRS"))
                return (true, $"Connection successful ({durationMs}ms). Hotel: {settings.HotelCode}");

            return (false, $"Connection failed (HTTP {statusCode}): {responseBody}");
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 2. ROOMS INVENTORY â€” Get rooms, rates, availabilities
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message, List<object> Rooms)> GetRoomsInventory()
        {
            var settings = await GetEffectiveSettings();

            var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<RoomsInventoryRQ>
    <RequestorID>
        <directions>{settings.Username}</directions>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
</RoomsInventoryRQ>";

            var (success, responseBody, statusCode, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "RoomsInventory");

            var rooms = new List<object>();
            if (success)
            {
                try
                {
                    var doc = XDocument.Parse(responseBody);
                    var roomTypes = doc.Descendants("RoomType");
                    foreach (var rt in roomTypes)
                    {
                        var rates = rt.Descendants("Rate").Select(r => new
                        {
                            rateCode = r.Attribute("Code")?.Value,
                            rateName = r.Value?.Trim(),
                            meal = r.Attribute("Meal")?.Value
                        }).ToList();

                        var availabilities = rt.Descendants("Availability").Select(a => new
                        {
                            availabilityCode = a.Attribute("Code")?.Value,
                            availabilityName = a.Value?.Trim()
                        }).ToList();

                        rooms.Add(new
                        {
                            roomCode = rt.Attribute("Code")?.Value,
                            roomName = rt.Element("Name")?.Value?.Trim(),
                            description = rt.Element("Description")?.Value?.Trim(),
                            defaultOccupancy = rt.Attribute("DefaultOccupancy")?.Value,
                            rates,
                            availabilities
                        });
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to parse rooms inventory XML");
                }
            }

            return (success, success ? $"Found {rooms.Count} room types" : $"Failed (HTTP {statusCode}): {responseBody}", rooms);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 3. ALLOTMENT LIST â€” Get allotment info for a room
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message, string RawResponse)> GetAllotmentList(
            string roomId, string fromDate, string toDate)
        {
            fromDate = NormalizeDateForBL(fromDate);
            toDate = NormalizeDateForBL(toDate);
            var settings = await GetEffectiveSettings();

            var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<AllotmentListRQ>
    <RequestorID>
        <directions>{settings.Username}</directions>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
    <fromd>{fromDate}</fromd>
    <tod>{toDate}</tod>
    <RmId>{roomId}</RmId>
</AllotmentListRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "AllotmentList", externalRoomId: roomId);

            return (success, success ? "Allotment list retrieved" : $"Failed: {responseBody}", responseBody);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 4. AVAILABILITY UPDATE â€” Push availability to BookLogic
        //    Matches exact Postman format: <availabilityUpdateRQ>
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message)> UpdateAvailability(
            string roomId, string fromDate, string toDate,
            int allotment, int stopSales = 0, int minStay = 1,
            int advanceBookingDays = 0, int closedOnArrival = 0, int closedOnDeparture = 0)
        {
            fromDate = NormalizeDateForBL(fromDate);
            toDate = NormalizeDateForBL(toDate);
            var settings = await GetEffectiveSettings();

            var xml = $@"<availabilityUpdateRQ>
    <RequestorID>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <allotInfo>
        <hotelCode>{settings.HotelCode}</hotelCode>
        <roomId>{roomId}</roomId>
        <fromd>{fromDate}</fromd>
        <tod>{toDate}</tod>
        <initAllot>{allotment}</initAllot>
        <MinStay>{minStay}</MinStay>
        <advanceBookingDays>{advanceBookingDays}</advanceBookingDays>
        <stopsales>{stopSales}</stopsales>
        <closedOnarrival>{closedOnArrival}</closedOnarrival>
        <closedOndeparture>{closedOnDeparture}</closedOndeparture>
    </allotInfo>
</availabilityUpdateRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "AvailabilityUpdate", externalRoomId: roomId);

            if (success && responseBody.Contains("successfully"))
            {
                var dbSetting = await _context.ChannelManagerSettings
                    .FirstOrDefaultAsync(s => s.Provider == "BookLogic" && s.IsActive);
                if (dbSetting != null)
                {
                    dbSetting.LastAvailabilitySync = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
                return (true, "Availability updated successfully");
            }

            return (false, $"Failed to update availability: {responseBody}");
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 5. SYNC AVAILABILITY FOR ALL MAPPED ROOMS
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message, int SuccessCount, int FailCount)> SyncAllAvailability(
            string fromDate, string toDate)
        {
            fromDate = NormalizeDateForBL(fromDate);
            toDate = NormalizeDateForBL(toDate);
            var settings = await GetEffectiveSettings();
            var mappings = await _context.ChannelManagerRoomMappings
                .Include(m => m.LocalRoomType)
                .Where(m => m.IsActive)
                .ToListAsync();

            if (!mappings.Any())
                return (false, "No room mappings found. Please map rooms first.", 0, 0);

            int successCount = 0;
            int failCount = 0;

            foreach (var mapping in mappings)
            {
                var parsedFromDate = DateTime.ParseExact(fromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var parsedToDate = DateTime.ParseExact(toDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var availableCount = await GetAvailableRoomCountForDateRange(mapping.LocalRoomTypeId, parsedFromDate, parsedToDate);
                var stopSales = availableCount <= 0 ? 1 : 0;

                var result = await UpdateAvailability(
                    mapping.ExternalRoomId,
                    fromDate,
                    toDate,
                    availableCount,
                    stopSales,
                    settings.DefaultMinStay,
                    settings.DefaultAdvanceBookingDays,
                    settings.DefaultClosedOnArrival,
                    settings.DefaultClosedOnDeparture);

                if (result.Success)
                    successCount++;
                else
                    failCount++;
            }

            return (successCount > 0,
                $"Synced {successCount} rooms, {failCount} failed",
                successCount, failCount);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 6. RATE LIST â€” Get rates for a room
        //    Matches exact Postman format: <RateListRQ>
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message, string RawResponse)> GetRateList(
            string roomId, string fromDate, string toDate)
        {
            fromDate = NormalizeDateForBL(fromDate);
            toDate = NormalizeDateForBL(toDate);
            var settings = await GetEffectiveSettings();

            var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<RateListRQ>
    <RequestorID>
        <directions>{settings.Username}</directions>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
    <fromd>{fromDate}</fromd>
    <tod>{toDate}</tod>
    <RmId>{roomId}</RmId>
</RateListRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "RateList", externalRoomId: roomId);

            return (success, success ? "Rate list retrieved" : $"Failed: {responseBody}", responseBody);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 7. RATE UPDATE â€” Push rates to BookLogic
        //    Matches exact Postman format: <RateUpdateRQ> with combinations
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message)> UpdateRate(
            string rateId, string fromDate, string toDate,
            List<RateCombination> combinations,
            int freeCancel = 0, int closeout = 0, int partialUpdate = 1)
        {
            fromDate = NormalizeDateForBL(fromDate);
            toDate = NormalizeDateForBL(toDate);
            var settings = await GetEffectiveSettings();

            var combXml = new StringBuilder();
            foreach (var c in combinations)
            {
                combXml.AppendLine($@"            <combination>
                <adult>{c.Adult}</adult>
                <childA>{c.ChildA}</childA>
                <childB>{c.ChildB}</childB>
                <infant>{c.Infant}</infant>
                <price>{c.Price:F2}</price>
                <MinStay>{c.MinStay}</MinStay>
            </combination>");
            }

            var xml = $@"<RateUpdateRQ>
    <RequestorID>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <rateInfo>
        <hotelCode>{settings.HotelCode}</hotelCode>
        <rateId>{rateId}</rateId>
        <fromd>{fromDate}</fromd>
        <tod>{toDate}</tod>
        <freeCancel>{freeCancel}</freeCancel>
        <closeout>{closeout}</closeout>
        <partialUpdate>{partialUpdate}</partialUpdate>
        <combinations>
{combXml}        </combinations>
    </rateInfo>
</RateUpdateRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "RateUpdate");

            if (success && responseBody.Contains("successfully"))
            {
                var dbSetting = await _context.ChannelManagerSettings
                    .FirstOrDefaultAsync(s => s.Provider == "BookLogic" && s.IsActive);
                if (dbSetting != null)
                {
                    dbSetting.LastRateSync = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
                return (true, "Rates successfully exported");
            }

            return (false, $"Failed to update rate: {responseBody}");
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 8. RATE INFO â€” Get rate details with date-wise combinations
        //    Matches exact Postman format: <RateInfoRQ>
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message, string RawResponse)> GetRateInfo(
            string rateId, string fromDate, string toDate)
        {
            fromDate = NormalizeDateForBL(fromDate);
            toDate = NormalizeDateForBL(toDate);
            var settings = await GetEffectiveSettings();

            var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<RateInfoRQ>
    <RequestorID>
        <directions>{settings.Username}</directions>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
    <RateID>{rateId}</RateID>
    <fromd>{fromDate}</fromd>
    <tod>{toDate}</tod>
</RateInfoRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "RateInfo");

            return (success, success ? "Rate info retrieved" : $"Failed: {responseBody}", responseBody);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 9. AVAILABILITY INFO â€” Get current availability per date
        //    Matches exact Postman format: <AvailabilityInfoRQ>
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message, string RawResponse)> GetAvailabilityInfo(
            string allotmentId, string fromDate, string toDate)
        {
            fromDate = NormalizeDateForBL(fromDate);
            toDate = NormalizeDateForBL(toDate);
            var settings = await GetEffectiveSettings();

            var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<AvailabilityInfoRQ>
    <RequestorID>
        <directions>{settings.Username}</directions>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
    <alc>{allotmentId}</alc>
    <fromd>{fromDate}</fromd>
    <tod>{toDate}</tod>
</AvailabilityInfoRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "AvailabilityInfo", externalRoomId: allotmentId);

            return (success, success ? "Availability info retrieved" : $"Failed: {responseBody}", responseBody);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 10. PAYMENT POLICIES
        //     Matches exact Postman format: <PaymentPoliciesRQ>
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string RawResponse)> GetPaymentPolicies()
        {
            var settings = await GetEffectiveSettings();

            var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<PaymentPoliciesRQ>
    <RequestorID>
        <directions>{settings.Username}</directions>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
</PaymentPoliciesRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "PaymentPolicies");

            return (success, responseBody);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 11. CANCEL POLICIES
        //     Matches exact Postman format: <cancelpoliciesRQ>
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string RawResponse)> GetCancelPolicies()
        {
            var settings = await GetEffectiveSettings();

            var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<cancelpoliciesRQ>
    <RequestorID>
        <directions>{settings.Username}</directions>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
</cancelpoliciesRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "CancelPolicies");

            return (success, responseBody);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 12. GET RESERVATIONS â€” Pull reservations from BookLogic
        //     Matches exact Postman format: <GetReservationsRQ>
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message, List<ChannelManagerReservation> Reservations)> GetReservations(
            string? fromDate = null, string? toDate = null)
        {
            var settings = await GetEffectiveSettings();

            var from = fromDate ?? DateTime.UtcNow.AddMonths(-1).ToString("dd/MM/yyyy");
            var to = toDate ?? DateTime.UtcNow.AddMonths(2).ToString("dd/MM/yyyy");

            var xml = $@"<GetReservationsRQ>
    <RequestorID>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
    <fromd>{from}</fromd>
    <tod>{to}</tod>
</GetReservationsRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "GetReservations", "Inbound");

            var reservations = new List<ChannelManagerReservation>();

            if (success)
            {
                try
                {
                    var doc = XDocument.Parse(responseBody);
                    var bookingElements = doc.Descendants("Booking");

                    var settingId = (await _context.ChannelManagerSettings
                        .FirstOrDefaultAsync(s => s.Provider == "BookLogic" && s.IsActive))?.Id ?? 0;

                    foreach (var booking in bookingElements)
                    {
                        var pnrId = booking.Element("PnrID")?.Value;
                        if (string.IsNullOrEmpty(pnrId)) continue;

                        var checkInDate = ParseBLDate(booking.Element("Checkin")?.Value);
                        var checkOutDate = ParseBLDate(booking.Element("Checkout")?.Value);

                        var rmName = booking.Element("rmName");
                        var externalRoomId = rmName?.Attribute("id")?.Value;
                        var externalRoomName = rmName?.Value?.Trim();

                        // Skip if already exists
                        var exists = await _context.ChannelManagerReservations
                            .AnyAsync(r => r.ExternalReservationId == pnrId
                                        && r.ExternalRoomId == externalRoomId
                                        && r.CheckInDate == checkInDate
                                        && r.CheckOutDate == checkOutDate);
                        if (exists) continue;

                        // Parse guest info from <CL> element
                        var cl = booking.Element("CL");
                        var firstName = cl?.Element("FirstName")?.Value?.Trim();
                        var lastName = cl?.Element("LastName")?.Value?.Trim();
                        var email = cl?.Element("Email")?.Value?.Trim();
                        var phone = cl?.Element("Tel")?.Value?.Trim();
                        var countryCode = cl?.Element("Country")?.Attribute("code")?.Value;

                        var reservation = new ChannelManagerReservation
                        {
                            ChannelManagerSettingId = settingId,
                            ExternalReservationId = pnrId,
                            ExternalBookingId = booking.Attribute("reservationId")?.Value,
                            ExternalStatus = booking.Element("Status")?.Value ?? "NEW",
                            SyncType = booking.Element("syncType")?.Value ?? "NEW",
                            GuestFirstName = firstName,
                            GuestLastName = lastName,
                            GuestEmail = email,
                            GuestPhone = phone,
                            GuestCountryCode = countryCode,
                            ExternalRoomId = externalRoomId,
                            ExternalRoomName = externalRoomName,
                            ExternalRateId = booking.Element("rate")?.Attribute("id")?.Value,
                            ExternalRateName = booking.Element("rate")?.Value?.Trim(),
                            CheckInDate = checkInDate,
                            CheckOutDate = checkOutDate,
                            Adults = int.TryParse(booking.Element("Adult")?.Value, out var a) ? a : 1,
                            Children = (int.TryParse(booking.Element("ChildB")?.Value, out var cb) ? cb : 0)
                                     + (int.TryParse(booking.Element("ChildA")?.Value, out var ca) ? ca : 0),
                            TotalAmount = decimal.TryParse(booking.Element("Total")?.Value, out var t) ? t : 0,
                            CurrencyCode = booking.Element("Currency")?.Value,
                            PaymentType = booking.Element("Status")?.Value == "CF" ? "H" : "H",
                            Remarks = booking.Element("Remarks")?.Value,
                            TravelAgentName = booking.Element("TravelagentName")?.Value?.Trim(),
                            LeaderName = booking.Element("Leader")?.Value?.Trim(),
                            RawPayload = booking.ToString(),
                            ReceivedAt = DateTime.UtcNow
                        };

                        _context.ChannelManagerReservations.Add(reservation);
                        reservations.Add(reservation);
                    }

                    if (reservations.Any())
                        await _context.SaveChangesAsync();

                    // Update last sync time
                    var dbSetting = await _context.ChannelManagerSettings
                        .FirstOrDefaultAsync(s => s.Provider == "BookLogic" && s.IsActive);
                    if (dbSetting != null)
                    {
                        dbSetting.LastReservationSync = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to parse reservations XML");
                }
            }

            return (success,
                success ? $"Retrieved {reservations.Count} new reservations" : $"Failed: {responseBody}",
                reservations);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 13. MARK SEND â€” Acknowledge reservation receipt
        //     Matches exact Postman format: <markSendRQ>
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message)> MarkReservationAsSent(string pnrId, int srvNum = 1)
        {
            var settings = await GetEffectiveSettings();

            var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<markSendRQ>
    <RequestorID>
        <directions>{settings.Username}</directions>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
    <PnrID>{pnrId}</PnrID>
    <SrvNum>{srvNum}</SrvNum>
</markSendRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "MarkSend", externalReservationId: pnrId);

            if (success && responseBody.Contains("successfully"))
            {
                // Mark ALL CM reservation records with this PNR as sent
                var cmResList = await _context.ChannelManagerReservations
                    .Where(r => r.ExternalReservationId == pnrId)
                    .ToListAsync();
                foreach (var cmr in cmResList)
                {
                    cmr.IsMarkedAsSent = true;
                }
                if (cmResList.Any())
                    await _context.SaveChangesAsync();
                return (true, "Reservation successfully marked as send.");
            }

            return (false, $"Failed to mark reservation: {responseBody}");
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 14. SYNC BOOKING â€” Check for new bookings
        //     Matches exact Postman format: <syncBookingRQ>
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message, string RawResponse)> SyncBooking()
        {
            var settings = await GetEffectiveSettings();

            var xml = $@"<syncBookingRQ>
    <RequestorID>
        <UserName>{settings.Username}</UserName>
        <Password>{settings.Password}</Password>
    </RequestorID>
    <hotelCode>{settings.HotelCode}</hotelCode>
</syncBookingRQ>";

            var (success, responseBody, _, _) = await SendXmlRequest(
                settings.BaseUrl, xml, "SyncBooking");

            return (success,
                success ? "Sync booking completed" : $"Failed: {responseBody}",
                responseBody);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 15. PROCESS RESERVATION â€” Convert CM reservation to local
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message)> ProcessReservation(int channelManagerReservationId)
        {
            var cmRes = await _context.ChannelManagerReservations.FirstOrDefaultAsync(r => r.Id == channelManagerReservationId);
            if (cmRes == null) return (false, "Channel manager reservation not found");

            // If already processed, update the existing local reservation with correct room/hotel mapping
            if (cmRes.IsProcessed && cmRes.LocalReservationId.HasValue)
            {
                return await ReprocessReservation(cmRes);
            }

            try
            {
                // Find or create guest
                var guest = await _context.Guests
                    .FirstOrDefaultAsync(g => g.Email == cmRes.GuestEmail && cmRes.GuestEmail != null && cmRes.GuestEmail != "");

                if (guest == null)
                {
                    // Generate unique GuestId
                    var lastGuest = await _context.Guests.OrderByDescending(g => g.Id).FirstOrDefaultAsync();
                    var guestSeq = (lastGuest?.Id ?? 0) + 1;
                    var guestIdStr = $"BL-{guestSeq:D5}";

                    guest = new Guest
                    {
                        GuestId = guestIdStr,
                        FullName = $"{cmRes.GuestFirstName} {cmRes.GuestLastName}".Trim(),
                        Email = cmRes.GuestEmail ?? "",
                        PhoneNumber = cmRes.GuestPhone ?? "",
                        Country = cmRes.GuestCountryCode ?? "",
                        Nationality = cmRes.GuestCountryCode ?? "",
                        Company = "",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Guests.Add(guest);
                    await _context.SaveChangesAsync();
                }

                // Find room mapping and assign available room
                var checkIn = cmRes.CheckInDate ?? DateTime.Today;
                var checkOut = cmRes.CheckOutDate ?? DateTime.Today.AddDays(1);
                if (checkOut <= checkIn)
                    checkOut = checkIn.AddDays(1);

                Room? room = null;
                RoomType? roomType = null;
                if (!string.IsNullOrEmpty(cmRes.ExternalRoomId))
                {
                    var mapping = await _context.ChannelManagerRoomMappings
                        .Include(m => m.LocalRoomType)
                        .FirstOrDefaultAsync(m => m.ExternalRoomId == cmRes.ExternalRoomId && m.IsActive);

                    if (mapping != null)
                    {
                        roomType = mapping.LocalRoomType;
                        room = (await GetAvailableRoomsForDateRange(mapping.LocalRoomTypeId, checkIn, checkOut))
                            .FirstOrDefault();
                    }
                }

                // Generate reservation number
                var lastRes = await _context.Reservations
                    .OrderByDescending(r => r.Id)
                    .FirstOrDefaultAsync();
                var nextNum = (lastRes?.Id ?? 0) + 1;
                var resNumber = $"BL-{DateTime.Now:yyMMdd}-{nextNum:D4}";

                var nights = (checkOut - checkIn).Days;
                if (nights <= 0) nights = 1;
                var dailyRate = nights > 0 ? Math.Round(cmRes.TotalAmount / nights, 2) : cmRes.TotalAmount;

                var reservation = new Reservation
                {
                    ReservationNumber = resNumber,
                    GuestId = guest.Id,
                    RoomId = room?.Id,
                    RoomTypeId = roomType?.Id ?? room?.RoomTypeId,
                    HotelId = roomType?.HotelId,
                    CheckInDate = checkIn,
                    CheckOutDate = checkOut,
                    NumberOfAdults = cmRes.Adults,
                    NumberOfChildren = cmRes.Children,
                    NumberOfRooms = 1,
                    Nights = nights,
                    RoomRate = dailyRate,
                    TotalAmount = cmRes.TotalAmount,
                    Status = cmRes.ExternalStatus == "CX" ? "Cancelled" : "Confirmed",
                    PaymentStatus = cmRes.PaymentType == "C" ? "Paid" : "Pending",
                    SpecialRequests = cmRes.Remarks,
                    BookingSource = "BookLogic",
                    Source = "Online",
                    Market = "OTA",
                    ReferenceCompany = cmRes.TravelAgentName,
                    ReservationNotes = $"BookLogic PNR: {cmRes.ExternalReservationId}, Rate: {cmRes.ExternalRateName}",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();

                // Update room status if assigned
                if (room != null)
                {
                    room.Status = "Reserved";
                    await _context.SaveChangesAsync();
                }

                // Update CM reservation
                cmRes.LocalReservationId = reservation.Id;
                cmRes.IsProcessed = true;
                cmRes.ProcessedAt = DateTime.UtcNow;
                cmRes.ProcessingNotes = $"Created local reservation {resNumber}";
                await _context.SaveChangesAsync();

                // Mark as sent on BookLogic
                await MarkReservationAsSent(cmRes.ExternalReservationId);

                // Auto-push availability to BookLogic to block calendar
                if (room != null)
                {
                    try { await NotifyBookLogicAvailability(reservation.Id); }
                    catch (Exception ex2) { _logger.LogWarning(ex2, "Failed to auto-push availability after processing CM reservation"); }
                }

                return (true, $"Reservation {resNumber} created successfully from BookLogic booking {cmRes.ExternalReservationId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process CM reservation {Id}", channelManagerReservationId);
                cmRes.ProcessingNotes = $"Error: {ex.Message}";
                await _context.SaveChangesAsync();
                return (false, $"Failed to process reservation: {ex.Message}");
            }
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 15b. REPROCESS â€” Update existing local reservation with correct room/hotel mapping
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        private async Task<(bool Success, string Message)> ReprocessReservation(ChannelManagerReservation cmRes)
        {
            try
            {
                var reservation = await _context.Reservations.FindAsync(cmRes.LocalReservationId);
                if (reservation == null) return (false, $"Local reservation {cmRes.LocalReservationId} not found");

                Room? room = null;
                RoomType? roomType = null;
                if (!string.IsNullOrEmpty(cmRes.ExternalRoomId))
                {
                    var mapping = await _context.ChannelManagerRoomMappings
                        .Include(m => m.LocalRoomType)
                        .FirstOrDefaultAsync(m => m.ExternalRoomId == cmRes.ExternalRoomId && m.IsActive);

                    if (mapping != null)
                    {
                        roomType = mapping.LocalRoomType;
                        var checkIn = reservation.CheckInDate;
                        var checkOut = reservation.CheckOutDate <= reservation.CheckInDate
                            ? reservation.CheckInDate.AddDays(1)
                            : reservation.CheckOutDate;

                        // Try to find an available room; if current room is already assigned keep it
                        room = reservation.RoomId.HasValue
                            ? await _context.Rooms.FindAsync(reservation.RoomId)
                            : (await GetAvailableRoomsForDateRange(mapping.LocalRoomTypeId, checkIn, checkOut)).FirstOrDefault();

                        if (room != null && reservation.RoomId.HasValue)
                        {
                            var currentRoomBlocked = await GetBlockingReservationsQuery()
                                .AnyAsync(r => r.Id != reservation.Id
                                            && r.RoomId == room.Id
                                            && r.CheckInDate < checkOut
                                            && r.CheckOutDate > checkIn);

                            if (currentRoomBlocked)
                            {
                                room = (await GetAvailableRoomsForDateRange(mapping.LocalRoomTypeId, checkIn, checkOut))
                                    .FirstOrDefault(r => r.Id != reservation.RoomId.Value);
                            }
                        }
                    }
                }

                if (roomType == null)
                    return (false, "Room mapping not found for external room ID: " + cmRes.ExternalRoomId);

                reservation.RoomTypeId = roomType.Id;
                reservation.HotelId = roomType.HotelId;
                reservation.RoomId = room?.Id;
                reservation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                if (room != null && room.Status == "Available")
                {
                    room.Status = "Reserved";
                    await _context.SaveChangesAsync();
                }

                cmRes.ProcessingNotes = $"Re-processed: assigned RoomType={roomType.Name}, Hotel={roomType.HotelId}, Room={room?.Id}";
                cmRes.ProcessedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Auto-push availability
                if (room != null)
                {
                    try { await NotifyBookLogicAvailability(reservation.Id); }
                    catch (Exception ex2) { _logger.LogWarning(ex2, "Failed to auto-push availability after re-processing"); }
                }

                return (true, $"Reservation {reservation.ReservationNumber} re-processed: RoomType={roomType.Name}, HotelId={roomType.HotelId}, RoomId={room?.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to re-process CM reservation {Id}", cmRes.Id);
                return (false, $"Failed to re-process: {ex.Message}");
            }
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 16. NOTIFY BOOKLOGIC AVAILABILITY â€” Auto-push when local
        //     reservation is created/cancelled to block/unblock calendar
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message)> NotifyBookLogicAvailability(int reservationId, bool isCancellation = false)
        {
            try
            {
                var settings = await GetEffectiveSettings();
                var reservation = await _context.Reservations
                    .Include(r => r.Room)
                        .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync(r => r.Id == reservationId);

                if (reservation == null)
                    return (false, "Reservation not found");

                var roomType = await GetReservationRoomType(reservation);
                if (roomType == null)
                    return (false, "Reservation room type not found");

                // Find room mapping for this room type
                var roomMapping = await _context.ChannelManagerRoomMappings
                    .FirstOrDefaultAsync(m => m.LocalRoomTypeId == roomType.Id && m.IsActive);

                if (roomMapping == null)
                    return (false, "No BookLogic room mapping found for this room type");

                // Count available rooms of this type
                var checkOut = reservation.CheckOutDate <= reservation.CheckInDate
                    ? reservation.CheckInDate.AddDays(1)
                    : reservation.CheckOutDate;
                var availableCount = await GetAvailableRoomCountForDateRange(roomType.Id, reservation.CheckInDate, checkOut);
                var stopSales = availableCount <= 0 ? 1 : 0;

                // Push availability update to BookLogic
                var fromDate = reservation.CheckInDate.ToString("dd/MM/yyyy");
                var toDate = checkOut.ToString("dd/MM/yyyy");

                var result = await UpdateAvailability(
                    roomMapping.ExternalRoomId,
                    fromDate,
                    toDate,
                    availableCount,
                    stopSales,
                    settings.DefaultMinStay,
                    settings.DefaultAdvanceBookingDays,
                    settings.DefaultClosedOnArrival,
                    settings.DefaultClosedOnDeparture);

                _logger.LogInformation(
                    "BookLogic availability notification for reservation {ResId}: {Action} - Available={Count} - {Result}",
                    reservationId, isCancellation ? "Cancellation" : "New Booking", availableCount, result.Message);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to notify BookLogic availability for reservation {Id}", reservationId);
                return (false, $"Failed to notify BookLogic: {ex.Message}");
            }
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        // 17. SEND RESERVATION (JSON API v5.3) â€” Push to BookLogic CRS
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        public async Task<(bool Success, string Message)> SendReservationToBookLogic(int localReservationId)
        {
            return await PushReservationToBookLogic(localReservationId, "SendReservation", "N");
        }

        private async Task<(Reservation? Reservation, ChannelManagerReservation? ChannelReservation, ChannelManagerRoomMapping? RoomMapping, ChannelManagerRateMapping? RateMapping, string Message)> LoadOutboundReservationContext(int localReservationId)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                    .ThenInclude(r => r.RoomType)
                .FirstOrDefaultAsync(r => r.Id == localReservationId);

            if (reservation == null)
                return (null, null, null, null, "Reservation not found");

            var roomType = await GetReservationRoomType(reservation);
            if (roomType == null)
                return (reservation, null, null, null, "Reservation room mapping data not found");

            var channelReservation = await _context.ChannelManagerReservations
                .Where(r => r.LocalReservationId == localReservationId)
                .OrderByDescending(r => r.Id)
                .FirstOrDefaultAsync();

            var roomMapping = await _context.ChannelManagerRoomMappings
                .FirstOrDefaultAsync(m => m.LocalRoomTypeId == roomType.Id && m.IsActive);

            if (roomMapping == null)
                return (reservation, channelReservation, null, null, $"No active BookLogic room mapping found for local room type '{roomType.Name}' (Id: {roomType.Id}).");

            ChannelManagerRateMapping? rateMapping = null;
            if (!string.IsNullOrWhiteSpace(reservation.RatePlanId) && int.TryParse(reservation.RatePlanId, out var localRoomRateId))
            {
                rateMapping = await _context.ChannelManagerRateMappings
                    .FirstOrDefaultAsync(m => m.ChannelManagerRoomMappingId == roomMapping.Id && m.LocalRoomRateId == localRoomRateId && m.IsActive);
            }

            rateMapping ??= await _context.ChannelManagerRateMappings
                .FirstOrDefaultAsync(m => m.ChannelManagerRoomMappingId == roomMapping.Id && m.IsActive && m.LocalRoomRateId == null);

            rateMapping ??= await _context.ChannelManagerRateMappings
                .FirstOrDefaultAsync(m => m.ChannelManagerRoomMappingId == roomMapping.Id && m.IsActive);

            if (rateMapping == null)
            {
                var rateHint = !string.IsNullOrWhiteSpace(reservation.RatePlanId)
                    ? $" for local rate/plan '{reservation.RatePlanId}'"
                    : string.Empty;
                return (reservation, channelReservation, roomMapping, null, $"No active BookLogic rate mapping found for local room type '{roomType.Name}'{rateHint}. Please create a rate mapping before sending this reservation.");
            }

            return (reservation, channelReservation, roomMapping, rateMapping, string.Empty);
        }

        private async Task<string> BuildOutboundReservationPayload(int localReservationId, string statusCode)
        {
            var settings = await GetEffectiveSettings();
            var (reservation, channelReservation, roomMapping, rateMapping, message) = await LoadOutboundReservationContext(localReservationId);

            if (reservation == null || roomMapping == null || rateMapping == null)
                throw new InvalidOperationException(message);

            var externalRoomId = roomMapping.ExternalRoomId;
            var externalRoomName = roomMapping.ExternalRoomName ?? reservation.Room?.RoomType?.Name ?? "Room";
            var externalRateId = rateMapping.ExternalRateId;
            var externalReservationId = !string.IsNullOrWhiteSpace(channelReservation?.ExternalBookingId)
                ? channelReservation!.ExternalBookingId!
                : !string.IsNullOrWhiteSpace(channelReservation?.ExternalReservationId)
                    ? channelReservation!.ExternalReservationId!
                    : reservation.ReservationNumber;

            var nights = (reservation.CheckOutDate - reservation.CheckInDate).Days;
            if (nights <= 0) nights = 1;
            var dailyRate = nights > 0 ? Math.Round(reservation.TotalAmount / nights, 2) : reservation.TotalAmount;

            var dailyPrices = new List<string>();
            for (int i = 0; i < nights; i++)
            {
                var date = reservation.CheckInDate.AddDays(i);
                dailyPrices.Add($@"{{""date"":""{date:yyyy-MM-dd}"",""price"":{dailyRate}}}");
            }

            var guestFullName = reservation.Guest?.FullName ?? "Guest";
            var guestNames = guestFullName.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
            var firstName = guestNames.Length > 0 ? guestNames[0] : "Guest";
            var lastName = guestNames.Length > 1 ? guestNames[1] : firstName;
            var currencyCode = string.IsNullOrWhiteSpace(rateMapping.CurrencyCode) ? "PKR" : rateMapping.CurrencyCode!;
            var paymentType = reservation.PaymentStatus == "Paid" ? "C" : "H";

            return $@"{{
  ""channelId"": {settings.ChannelId},
  ""username"": ""{settings.Username}"",
  ""password"": ""{settings.Password}"",
  ""reservations"": [{{
    ""reservationId"": ""{externalReservationId}"",
    ""hotelCode"": ""{settings.HotelCode}"",
    ""hotelName"": ""Grow Tech"",
    ""currencyCode"": ""{currencyCode}"",
    ""time"": ""{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}"",
    ""total"": {reservation.TotalAmount},
    ""status"": ""{statusCode}"",
    ""paymentType"": ""{paymentType}"",
    ""client"": {{
      ""firstName"": ""{firstName}"",
      ""lastName"": ""{lastName}"",
      ""countryCode"": ""{reservation.Guest?.Country ?? reservation.Guest?.Nationality ?? "PK"}"",
      ""email"": ""{reservation.Guest?.Email ?? ""}"",
      ""phone"": ""{reservation.Guest?.PhoneNumber ?? ""}""
    }},
    ""rooms"": [{{
      ""id"": ""{externalRoomId}"",
      ""name"": ""{externalRoomName}"",
      ""adult"": {reservation.NumberOfAdults},
      ""childB"": 0,
      ""childA"": {reservation.NumberOfChildren},
      ""infant"": 0,
      ""checkInDate"": ""{reservation.CheckInDate:yyyy-MM-dd}"",
      ""checkOutDate"": ""{reservation.CheckOutDate:yyyy-MM-dd}"",
      ""total"": {reservation.TotalAmount},
      ""currencyCode"": ""{currencyCode}"",
      ""guests"": [{{
        ""firstName"": ""{firstName}"",
        ""lastName"": ""{lastName}"",
        ""type"": ""ADULT""
      }}],
      ""rate"": {{
        ""id"": ""{externalRateId}"",
        ""dailyPrices"": [{string.Join(",", dailyPrices)}]
      }}
    }}]
  }}]
}}";
        }

        private async Task<(bool Success, string Message)> PushReservationToBookLogic(int localReservationId, string action, string statusCode)
        {
            var settings = await GetEffectiveSettings();

            if (string.IsNullOrWhiteSpace(settings.SendReservationUrl))
            {
                return (false, "BookLogic outbound reservation URL is not configured. Please set the confirmed CRS reservation sync endpoint in Channel Manager settings before using Send PMS or Update PMS.");
            }

            if (settings.ChannelId <= 0)
            {
                return (false, "BookLogic outbound channel ID is not configured. The shared BookLogic emails confirm hotelCode, username, password, and external-pms endpoint, but do not confirm a CRS channelId. Please enter the official BookLogic CRS channelId in Channel Manager settings before using Send PMS or Update PMS.");
            }

            var payload = await BuildOutboundReservationPayload(localReservationId, statusCode);
            var (httpSuccess, responseBody, _, _) = await SendJsonRequest(
                settings.SendReservationUrl, payload, action);

            var actualSuccess = httpSuccess && responseBody.Contains("\"successful\":true", StringComparison.OrdinalIgnoreCase);
            if (httpSuccess && !actualSuccess)
                _logger.LogWarning("{Action} HTTP 200 but body indicates failure: {Body}", action, responseBody);

            return (actualSuccess,
                actualSuccess
                    ? $"Reservation {action} synced to BookLogic successfully"
                    : $"BookLogic CRS response: {responseBody} (Url: {settings.SendReservationUrl}, ChannelId: {settings.ChannelId}, HotelCode: {settings.HotelCode})");
        }

        public async Task<(bool Success, string Message)> UpdateReservationInBookLogic(int localReservationId)
        {
            return await PushReservationToBookLogic(localReservationId, "UpdateReservation", "M");
        }

        public async Task<(bool Success, string Message)> CancelReservationInBookLogic(int localReservationId)
        {
            return await PushReservationToBookLogic(localReservationId, "CancelReservation", "C");
        }

        // DTO for rate update combinations
        public class RateCombination
        {
            public int Adult { get; set; } = 1;
            public int ChildA { get; set; }
            public int ChildB { get; set; }
            public int Infant { get; set; }
            public decimal Price { get; set; }
            public int MinStay { get; set; }
        }
    }
}

