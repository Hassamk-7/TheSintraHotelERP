using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelERP.API.Data;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Controllers
{
    public class GuestFoliosController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<GuestFoliosController> _logger;

        public GuestFoliosController(HotelDbContext context, ILogger<GuestFoliosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/guestfolios
        [HttpGet]
        public async Task<IActionResult> GetGuestFolios(
            [FromQuery] int? checkInId = null,
            [FromQuery] int? guestId = null,
            [FromQuery] string? roomNumber = null,
            [FromQuery] int? folioIndex = null)
        {
            try
            {
                if (checkInId.HasValue && checkInId.Value > 0)
                {
                    await EnsureDefaultFolioEntriesAsync(checkInId.Value);
                }

                var query = _context.GuestFolios
                    .Include(gf => gf.CheckIn)
                        .ThenInclude(c => c.Guest)
                    .Include(gf => gf.CheckIn)
                        .ThenInclude(c => c.Room)
                    .Where(gf => !gf.IsReversed)
                    .AsQueryable();

                if (checkInId.HasValue)
                    query = query.Where(gf => gf.CheckInId == checkInId.Value);
                if (guestId.HasValue)
                    query = query.Where(gf => gf.GuestId == guestId.Value);
                if (!string.IsNullOrEmpty(roomNumber))
                    query = query.Where(gf => gf.RoomNumber == roomNumber);
                if (folioIndex.HasValue)
                    query = query.Where(gf => gf.FolioIndex == folioIndex.Value);

                var folios = await query
                    .OrderByDescending(gf => gf.TransactionDate)
                    .ThenByDescending(gf => gf.Id)
                    .Select(gf => new
                    {
                        gf.Id,
                        gf.FolioNumber,
                        gf.InvoiceNumber,
                        gf.CheckInId,
                        gf.ReservationId,
                        gf.GuestId,
                        gf.Source,
                        gf.RoomNumber,
                        gf.FolioIndex,
                        gf.TransactionDate,
                        gf.Description,
                        gf.TransactionType,
                        gf.ChargeItemCode,
                        gf.PaymentAccountCode,
                        gf.Quantity,
                        gf.Amount,
                        gf.TaxAmount,
                        gf.TotalAmount,
                        gf.PaidAmount,
                        gf.DueAmount,
                        gf.Balance,
                        gf.IsReversed,
                        gf.ReversedFromId,
                        gf.Reference,
                        gf.PostedBy,
                        gf.Remarks,
                        gf.Memo,
                        gf.CreatedAt,
                        GuestName = gf.CheckIn != null && gf.CheckIn.Guest != null ? gf.CheckIn.Guest.FullName : null,
                        RoomNo = gf.CheckIn != null && gf.CheckIn.Room != null ? gf.CheckIn.Room.RoomNumber : gf.RoomNumber
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = folios, count = folios.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching guest folios");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        private async Task EnsureDefaultFolioEntriesAsync(int checkInId)
        {
            var checkIn = await _context.CheckInMasters
                .Include(c => c.Room)
                .FirstOrDefaultAsync(c => c.Id == checkInId);

            if (checkIn == null)
                return;

            await DeduplicateAutoSeededEntriesAsync(checkIn);

            var existing = await _context.GuestFolios
                .Where(gf => gf.CheckInId == checkInId && !gf.IsReversed)
                .ToListAsync();

            var anyRoomRent = existing.Any(f =>
                f.TransactionType == "Charge" &&
                ((f.Reference ?? string.Empty) == "CHECKIN_ROOM_RENT" ||
                 (f.ChargeItemCode ?? string.Empty).StartsWith("101") ||
                 string.Equals((f.Description ?? string.Empty).Trim(), "Room Rent", StringComparison.OrdinalIgnoreCase)));

            var anyAdvance = existing.Any(f =>
                f.TransactionType == "Receipt" &&
                ((f.Reference ?? string.Empty) == "CHECKIN_ADVANCE" ||
                 string.Equals((f.Description ?? string.Empty).Trim(), "Advance Paid", StringComparison.OrdinalIgnoreCase)));

            var createdAny = false;

            var nextFolioSequence = await _context.GuestFolios.CountAsync() + 1;
            var nextInvoiceSequence = await _context.GuestFolios
                .Where(f => f.TransactionType == "Charge")
                .CountAsync() + 1;

            if (!anyRoomRent)
            {
                var roomRentAmount = checkIn.TotalAmount > 0 ? checkIn.TotalAmount : checkIn.RoomRate;
                if (roomRentAmount > 0)
                {
                    var folio = new GuestFolio
                    {
                        FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{nextFolioSequence:D4}",
                        InvoiceNumber = $"AR-{nextInvoiceSequence:D6}",
                        CheckInId = checkInId,
                        ReservationId = checkIn.ReservationId.HasValue && checkIn.ReservationId.Value > 0 ? checkIn.ReservationId : null,
                        GuestId = checkIn.GuestId > 0 ? checkIn.GuestId : null,
                        Source = "System",
                        RoomNumber = checkIn.Room?.RoomNumber ?? string.Empty,
                        FolioIndex = 1,
                        TransactionDate = checkIn.CheckInDate,
                        Description = "Room Rent",
                        TransactionType = "Charge",
                        ChargeItemCode = "101-Room Rent",
                        Quantity = 1,
                        Amount = roomRentAmount,
                        TaxAmount = 0,
                        TotalAmount = roomRentAmount,
                        PaidAmount = 0,
                        DueAmount = roomRentAmount,
                        Balance = roomRentAmount,
                        IsActive = true,
                        Reference = "CHECKIN_ROOM_RENT",
                        PostedBy = "system",
                        Remarks = string.Empty,
                        Memo = string.Empty,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.GuestFolios.Add(folio);
                    createdAny = true;
                    nextFolioSequence += 1;
                    nextInvoiceSequence += 1;
                }
            }

            if (!anyAdvance && checkIn.AdvancePaid > 0)
            {
                var folio = new GuestFolio
                {
                    FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{nextFolioSequence:D4}",
                    CheckInId = checkInId,
                    ReservationId = checkIn.ReservationId.HasValue && checkIn.ReservationId.Value > 0 ? checkIn.ReservationId : null,
                    GuestId = checkIn.GuestId > 0 ? checkIn.GuestId : null,
                    Source = "System",
                    RoomNumber = checkIn.Room?.RoomNumber ?? string.Empty,
                    FolioIndex = 1,
                    TransactionDate = checkIn.CheckInDate,
                    Description = "Advance Paid",
                    TransactionType = "Receipt",
                    PaymentAccountCode = "10005-Cash in Hand-Sale",
                    Amount = checkIn.AdvancePaid,
                    TaxAmount = 0,
                    TotalAmount = checkIn.AdvancePaid,
                    PaidAmount = checkIn.AdvancePaid,
                    DueAmount = 0,
                    Balance = -checkIn.AdvancePaid,
                    IsActive = true,
                    Reference = "CHECKIN_ADVANCE",
                    PostedBy = "system",
                    Remarks = string.Empty,
                    Memo = string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.GuestFolios.Add(folio);
                createdAny = true;
                nextFolioSequence += 1;
            }

            if (createdAny)
            {
                await _context.SaveChangesAsync();
            }

            await DeduplicateAutoSeededEntriesAsync(checkIn);
        }

        private async Task DeduplicateAutoSeededEntriesAsync(CheckInMaster checkIn)
        {
            var now = DateTime.UtcNow;

            var roomRentCandidates = await _context.GuestFolios
                .Where(f => f.CheckInId == checkIn.Id && !f.IsReversed)
                .Where(f => f.TransactionType == "Charge")
                .Where(f =>
                    (f.Reference ?? string.Empty) == "CHECKIN_ROOM_RENT" ||
                    ((f.ChargeItemCode ?? string.Empty).StartsWith("101") &&
                     string.Equals((f.Description ?? string.Empty).Trim(), "Room Rent", StringComparison.OrdinalIgnoreCase) &&
                     f.TransactionDate.Date == checkIn.CheckInDate.Date))
                .OrderBy(f => f.Id)
                .ToListAsync();

            var advanceCandidates = await _context.GuestFolios
                .Where(f => f.CheckInId == checkIn.Id && !f.IsReversed)
                .Where(f => f.TransactionType == "Receipt")
                .Where(f =>
                    (f.Reference ?? string.Empty) == "CHECKIN_ADVANCE" ||
                    (string.Equals((f.Description ?? string.Empty).Trim(), "Advance Paid", StringComparison.OrdinalIgnoreCase) &&
                     f.TransactionDate.Date == checkIn.CheckInDate.Date &&
                     f.Amount == checkIn.AdvancePaid))
                .OrderBy(f => f.Id)
                .ToListAsync();

            var checkoutPaymentCandidates = await _context.GuestFolios
                .Where(f => f.CheckInId == checkIn.Id && !f.IsReversed)
                .Where(f => f.TransactionType == "Receipt")
                .Where(f =>
                    (f.Reference ?? string.Empty) == "CHECKOUT_PAYMENT" ||
                    (string.Equals((f.Description ?? string.Empty).Trim(), "Check-Out Payment", StringComparison.OrdinalIgnoreCase) &&
                     string.Equals((f.Source ?? string.Empty).Trim(), "System", StringComparison.OrdinalIgnoreCase)))
                .OrderBy(f => f.Id)
                .ToListAsync();

            var changed = false;

            if (roomRentCandidates.Count > 1)
            {
                var keep = roomRentCandidates[0];
                foreach (var dup in roomRentCandidates.Skip(1))
                {
                    dup.IsReversed = true;
                    dup.ReversedFromId = keep.Id;
                    dup.UpdatedAt = now;
                }

                changed = true;
            }

            if (advanceCandidates.Count > 1)
            {
                var keep = advanceCandidates[0];
                foreach (var dup in advanceCandidates.Skip(1))
                {
                    dup.IsReversed = true;
                    dup.ReversedFromId = keep.Id;
                    dup.UpdatedAt = now;
                }

                changed = true;
            }

            if (checkoutPaymentCandidates.Count > 1)
            {
                var keep = checkoutPaymentCandidates[0];
                foreach (var dup in checkoutPaymentCandidates.Skip(1))
                {
                    dup.IsReversed = true;
                    dup.ReversedFromId = keep.Id;
                    dup.UpdatedAt = now;
                }

                changed = true;
            }

            if (changed)
            {
                await _context.SaveChangesAsync();
            }
        }

        // GET: api/guestfolios/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGuestFolio(int id)
        {
            try
            {
                var folio = await _context.GuestFolios
                    .Include(gf => gf.CheckIn).ThenInclude(c => c.Guest)
                    .Include(gf => gf.CheckIn).ThenInclude(c => c.Room)
                    .FirstOrDefaultAsync(gf => gf.Id == id);

                if (folio == null)
                    return NotFound(new { success = false, message = "Guest folio not found" });

                return Ok(new { success = true, data = folio });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching guest folio {id}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/guestfolios/bill/{checkInId}
        [HttpGet("bill/{checkInId}")]
        public async Task<IActionResult> GetFolioBill(int checkInId, [FromQuery] int folioIndex = 0)
        {
            try
            {
                await EnsureDefaultFolioEntriesAsync(checkInId);

                var checkIn = await _context.CheckInMasters
                    .Include(c => c.Guest)
                    .Include(c => c.Room)
                    .Include(c => c.Reservation)
                    .FirstOrDefaultAsync(c => c.Id == checkInId);

                if (checkIn == null)
                    return NotFound(new { success = false, message = "Check-in not found" });

                var query = _context.GuestFolios
                    .Where(gf => gf.CheckInId == checkInId && !gf.IsReversed);

                if (folioIndex > 0)
                    query = query.Where(gf => gf.FolioIndex == folioIndex);

                var transactions = await query
                    .OrderBy(gf => gf.TransactionDate)
                    .ThenBy(gf => gf.Id)
                    .ToListAsync();

                var charges = transactions.Where(t => t.TransactionType == "Charge").ToList();
                var receipts = transactions.Where(t => t.TransactionType == "Receipt").ToList();

                var totalAmount = charges.Sum(c => c.Amount);
                var totalTax = charges.Sum(c => c.TaxAmount);
                var totalWithTax = charges.Sum(c => c.TotalAmount);
                var totalPaid = receipts.Sum(r => r.Amount);
                var balance = totalWithTax - totalPaid;

                // Get hotel info
                var hotel = await _context.Hotels.FirstOrDefaultAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        Hotel = hotel != null ? new
                        {
                            hotel.HotelName,
                            hotel.Address,
                            hotel.PhoneNumber,
                            hotel.Email,
                            hotel.LogoPath,
                            hotel.GSTNumber
                        } : null,
                        CheckIn = new
                        {
                            checkIn.Id,
                            checkIn.CheckInNumber,
                            checkIn.CheckInDate,
                            checkIn.ExpectedCheckOutDate,
                            checkIn.RoomRate,
                            checkIn.NumberOfGuests,
                            GuestName = checkIn.Guest?.FullName,
                            GuestPhone = checkIn.Guest?.PhoneNumber,
                            GuestEmail = checkIn.Guest?.Email,
                            GuestCompany = checkIn.Guest?.Company,
                            RoomNumber = checkIn.Room?.RoomNumber,
                            ReservationId = checkIn.ReservationId
                        },
                        Transactions = transactions.Select(t => new
                        {
                            t.Id,
                            t.FolioNumber,
                            t.InvoiceNumber,
                            t.Source,
                            t.RoomNumber,
                            t.FolioIndex,
                            t.TransactionDate,
                            t.Description,
                            t.TransactionType,
                            t.ChargeItemCode,
                            t.PaymentAccountCode,
                            t.Quantity,
                            t.Amount,
                            t.TaxAmount,
                            t.TotalAmount,
                            t.PaidAmount,
                            t.DueAmount,
                            t.PostedBy,
                            t.CreatedAt
                        }),
                        Summary = new
                        {
                            TotalAmount = totalAmount,
                            TotalTax = totalTax,
                            TotalWithTax = totalWithTax,
                            TotalPaid = totalPaid,
                            Balance = balance,
                            Status = balance <= 0 ? "Paid" : (totalPaid > 0 ? "Partial" : "Pending")
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching folio bill for check-in {checkInId}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/guestfolios/charge
        [HttpPost("charge")]
        public async Task<IActionResult> PostCharge([FromBody] FolioChargeRequest request)
        {
            try
            {
                var checkIn = await _context.CheckInMasters
                    .Include(c => c.Guest)
                    .Include(c => c.Room)
                    .FirstOrDefaultAsync(c => c.Id == request.CheckInId);

                if (checkIn == null)
                    return NotFound(new { success = false, message = "Check-in not found" });

                var folioCount = await _context.GuestFolios.CountAsync();
                var invoiceCount = await _context.GuestFolios
                    .Where(f => f.TransactionType == "Charge")
                    .CountAsync();

                var total = (request.Amount * request.Quantity) + request.TaxAmount;

                var folio = new GuestFolio
                {
                    FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{(folioCount + 1):D4}",
                    InvoiceNumber = $"AR-{(invoiceCount + 1):D6}",
                    CheckInId = request.CheckInId,
                    ReservationId = checkIn.ReservationId > 0 ? checkIn.ReservationId : null,
                    GuestId = checkIn.GuestId > 0 ? checkIn.GuestId : null,
                    Source = request.Source,
                    RoomNumber = checkIn.Room?.RoomNumber ?? request.RoomNumber,
                    FolioIndex = request.FolioIndex > 0 ? request.FolioIndex : 1,
                    TransactionDate = request.TransactionDate != default ? request.TransactionDate : DateTime.Now,
                    Description = request.Description,
                    TransactionType = "Charge",
                    ChargeItemCode = request.ChargeItemCode,
                    Quantity = request.Quantity > 0 ? request.Quantity : 1,
                    Amount = request.Amount,
                    TaxAmount = request.TaxAmount,
                    TotalAmount = total,
                    PaidAmount = 0,
                    DueAmount = total,
                    Balance = total,
                    IsActive = true,
                    Reference = request.Reference ?? "",
                    PostedBy = request.PostedBy ?? "admin",
                    Remarks = request.Remarks ?? "",
                    Memo = request.Memo ?? "",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.GuestFolios.Add(folio);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Charge posted successfully", data = folio });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error posting charge");
                var innerMsg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { success = false, message = innerMsg });
            }
        }

        // POST: api/guestfolios/receipt
        [HttpPost("receipt")]
        public async Task<IActionResult> PostReceipt([FromBody] FolioReceiptRequest request)
        {
            try
            {
                var checkIn = await _context.CheckInMasters
                    .Include(c => c.Guest)
                    .Include(c => c.Room)
                    .FirstOrDefaultAsync(c => c.Id == request.CheckInId);

                if (checkIn == null)
                    return NotFound(new { success = false, message = "Check-in not found" });

                var folioCount = await _context.GuestFolios.CountAsync();

                var folio = new GuestFolio
                {
                    FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{(folioCount + 1):D4}",
                    CheckInId = request.CheckInId,
                    ReservationId = checkIn.ReservationId > 0 ? checkIn.ReservationId : null,
                    GuestId = checkIn.GuestId > 0 ? checkIn.GuestId : null,
                    Source = request.Source,
                    RoomNumber = checkIn.Room?.RoomNumber ?? request.RoomNumber,
                    FolioIndex = request.FolioIndex > 0 ? request.FolioIndex : 1,
                    TransactionDate = request.TransactionDate != default ? request.TransactionDate : DateTime.Now,
                    Description = request.Description ?? $"Payment - {request.PaymentAccountCode}",
                    TransactionType = "Receipt",
                    PaymentAccountCode = request.PaymentAccountCode,
                    Amount = request.Amount,
                    TaxAmount = 0,
                    TotalAmount = request.Amount,
                    PaidAmount = request.Amount,
                    DueAmount = 0,
                    Balance = -request.Amount,
                    IsActive = true,
                    Reference = request.Reference ?? "",
                    PostedBy = request.PostedBy ?? "admin",
                    Memo = request.Memo ?? "",
                    Remarks = request.Remarks ?? "",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.GuestFolios.Add(folio);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Receipt posted successfully", data = folio });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error posting receipt");
                var innerMsg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { success = false, message = innerMsg });
            }
        }

        // POST: api/guestfolios/{id}/reverse
        [HttpPost("{id}/reverse")]
        public async Task<IActionResult> ReverseTransaction(int id)
        {
            try
            {
                var original = await _context.GuestFolios.FindAsync(id);
                if (original == null)
                    return NotFound(new { success = false, message = "Transaction not found" });

                if (original.IsReversed)
                    return BadRequest(new { success = false, message = "Transaction already reversed" });

                original.IsReversed = true;
                original.UpdatedAt = DateTime.UtcNow;

                var folioCount = await _context.GuestFolios.CountAsync();

                var reversal = new GuestFolio
                {
                    FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{(folioCount + 1):D4}",
                    InvoiceNumber = original.InvoiceNumber,
                    CheckInId = original.CheckInId,
                    ReservationId = original.ReservationId,
                    GuestId = original.GuestId,
                    Source = original.Source,
                    RoomNumber = original.RoomNumber,
                    FolioIndex = original.FolioIndex,
                    TransactionDate = DateTime.Now,
                    Description = $"REVERSAL - {original.Description}",
                    TransactionType = "Reverse",
                    ChargeItemCode = original.ChargeItemCode,
                    PaymentAccountCode = original.PaymentAccountCode,
                    Quantity = original.Quantity,
                    Amount = -original.Amount,
                    TaxAmount = -original.TaxAmount,
                    TotalAmount = -original.TotalAmount,
                    PaidAmount = -original.PaidAmount,
                    DueAmount = 0,
                    Balance = -original.Balance,
                    IsReversed = true,
                    ReversedFromId = original.Id,
                    IsActive = true,
                    Reference = "",
                    Memo = "",
                    PostedBy = "admin",
                    Remarks = $"Reversal of {original.FolioNumber}",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.GuestFolios.Add(reversal);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Transaction reversed successfully", data = reversal });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error reversing transaction {id}");
                var innerMsg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { success = false, message = innerMsg });
            }
        }

        // POST: api/guestfolios/transfer
        [HttpPost("transfer")]
        public async Task<IActionResult> TransferBalance([FromBody] FolioTransferRequest request)
        {
            try
            {
                var sourceCheckIn = await _context.CheckInMasters
                    .Include(c => c.Room)
                    .FirstOrDefaultAsync(c => c.Id == request.FromCheckInId);
                var targetCheckIn = await _context.CheckInMasters
                    .Include(c => c.Room)
                    .FirstOrDefaultAsync(c => c.Id == request.ToCheckInId);

                if (sourceCheckIn == null || targetCheckIn == null)
                    return NotFound(new { success = false, message = "Source or target check-in not found" });

                var folioCount = await _context.GuestFolios.CountAsync();

                // Debit from source
                var debit = new GuestFolio
                {
                    FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{(folioCount + 1):D4}",
                    CheckInId = request.FromCheckInId,
                    GuestId = sourceCheckIn.GuestId > 0 ? sourceCheckIn.GuestId : null,
                    RoomNumber = sourceCheckIn.Room?.RoomNumber,
                    FolioIndex = request.FolioIndex,
                    TransactionDate = DateTime.Now,
                    Description = $"Balance Transfer to Room {targetCheckIn.Room?.RoomNumber}",
                    TransactionType = "Receipt",
                    PaymentAccountCode = "10004-Balances Transfer",
                    Amount = request.Amount,
                    TotalAmount = request.Amount,
                    PaidAmount = request.Amount,
                    Balance = -request.Amount,
                    IsActive = true,
                    Reference = "",
                    Memo = "",
                    Remarks = "",
                    PostedBy = request.PostedBy ?? "admin",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Credit to target
                var credit = new GuestFolio
                {
                    FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{(folioCount + 2):D4}",
                    CheckInId = request.ToCheckInId,
                    GuestId = targetCheckIn.GuestId > 0 ? targetCheckIn.GuestId : null,
                    RoomNumber = targetCheckIn.Room?.RoomNumber,
                    FolioIndex = request.FolioIndex,
                    TransactionDate = DateTime.Now,
                    Description = $"Balance Transfer from Room {sourceCheckIn.Room?.RoomNumber}",
                    TransactionType = "Charge",
                    ChargeItemCode = "10004-Balances Transfer",
                    Amount = request.Amount,
                    TotalAmount = request.Amount,
                    DueAmount = request.Amount,
                    Balance = request.Amount,
                    IsActive = true,
                    Reference = "",
                    Memo = "",
                    Remarks = "",
                    PostedBy = request.PostedBy ?? "admin",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.GuestFolios.AddRange(debit, credit);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Balance transferred successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error transferring balance");
                var innerMsg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { success = false, message = innerMsg });
            }
        }

        // GET: api/guestfolios/active-checkins
        [HttpGet("active-checkins")]
        public async Task<IActionResult> GetActiveCheckIns()
        {
            try
            {
                var checkIns = await _context.CheckInMasters
                    .Include(c => c.Guest)
                    .Include(c => c.Room)
                    .Where(c => c.Status == "Active" || c.Status == "CheckedIn" || c.Status == "CheckedOut")
                    .OrderByDescending(c => c.CheckInDate)
                    .Select(c => new
                    {
                        c.Id,
                        c.CheckInNumber,
                        c.CheckInDate,
                        c.ExpectedCheckOutDate,
                        c.RoomRate,
                        c.TotalAmount,
                        c.AdvancePaid,
                        c.GuestId,
                        c.ReservationId,
                        GuestName = c.Guest != null ? c.Guest.FullName : "Unknown",
                        GuestPhone = c.Guest != null ? c.Guest.PhoneNumber : null,
                        GuestEmail = c.Guest != null ? c.Guest.Email : null,
                        GuestCompany = c.Guest != null ? c.Guest.Company : null,
                        RoomNumber = c.Room != null ? c.Room.RoomNumber : "N/A",
                        RoomId = c.RoomId
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = checkIns });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching active check-ins");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ==================== Charge Items ====================

        // GET: api/guestfolios/charge-items
        [HttpGet("charge-items")]
        public async Task<IActionResult> GetChargeItems()
        {
            try
            {
                var items = await _context.FolioChargeItems
                    .Where(i => i.IsActive)
                    .OrderBy(i => i.SortOrder)
                    .ThenBy(i => i.Code)
                    .ToListAsync();

                // Seed defaults if empty
                if (!items.Any())
                {
                    await SeedChargeItems();
                    items = await _context.FolioChargeItems.Where(i => i.IsActive).OrderBy(i => i.SortOrder).ToListAsync();
                }

                return Ok(new { success = true, data = items });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching charge items");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/guestfolios/payment-accounts
        [HttpGet("payment-accounts")]
        public async Task<IActionResult> GetPaymentAccounts()
        {
            try
            {
                var accounts = await _context.FolioPaymentAccounts
                    .Where(a => a.IsActive)
                    .OrderBy(a => a.SortOrder)
                    .ThenBy(a => a.Code)
                    .ToListAsync();

                // Seed defaults if empty
                if (!accounts.Any())
                {
                    await SeedPaymentAccounts();
                    accounts = await _context.FolioPaymentAccounts.Where(a => a.IsActive).OrderBy(a => a.SortOrder).ToListAsync();
                }

                return Ok(new { success = true, data = accounts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payment accounts");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/guestfolios/summary/{checkInId}
        [HttpGet("summary/{checkInId}")]
        public async Task<IActionResult> GetFolioSummary(int checkInId)
        {
            try
            {
                await EnsureDefaultFolioEntriesAsync(checkInId);

                var folios = await _context.GuestFolios
                    .Where(gf => gf.CheckInId == checkInId && !gf.IsReversed)
                    .ToListAsync();

                var charges = folios.Where(f => f.TransactionType == "Charge").ToList();
                var receipts = folios.Where(f => f.TransactionType == "Receipt").ToList();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        TotalCharges = charges.Sum(f => f.Amount),
                        TotalTax = charges.Sum(f => f.TaxAmount),
                        TotalWithTax = charges.Sum(f => f.TotalAmount),
                        TotalPaid = receipts.Sum(f => f.Amount),
                        Balance = charges.Sum(f => f.TotalAmount) - receipts.Sum(f => f.Amount),
                        TotalTransactions = folios.Count
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching folio summary for check-in {checkInId}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ==================== Seed Helpers ====================

        private async Task SeedChargeItems()
        {
            var items = new List<FolioChargeItem>
            {
                new() { Code = "101", Name = "Room Rent", SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new() { Code = "102", Name = "Cancellation Revenue", SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new() { Code = "103", Name = "No-Show Revenue", SortOrder = 3, CreatedAt = DateTime.UtcNow },
                new() { Code = "110", Name = "Laundry", SortOrder = 4, CreatedAt = DateTime.UtcNow },
                new() { Code = "116", Name = "Telephone", SortOrder = 5, CreatedAt = DateTime.UtcNow },
                new() { Code = "135", Name = "Tips", SortOrder = 6, CreatedAt = DateTime.UtcNow },
                new() { Code = "141", Name = "Room Service", SortOrder = 7, CreatedAt = DateTime.UtcNow },
                new() { Code = "180", Name = "Minibar", SortOrder = 8, CreatedAt = DateTime.UtcNow },
                new() { Code = "181", Name = "Rent A Car", SortOrder = 9, CreatedAt = DateTime.UtcNow },
                new() { Code = "182", Name = "Miscellaneous", SortOrder = 10, CreatedAt = DateTime.UtcNow },
                new() { Code = "183", Name = "Board Room Revenue", SortOrder = 11, CreatedAt = DateTime.UtcNow },
                new() { Code = "184", Name = "Linen Damages", SortOrder = 12, CreatedAt = DateTime.UtcNow },
                new() { Code = "185", Name = "Electrical Damages", SortOrder = 13, CreatedAt = DateTime.UtcNow },
                new() { Code = "186", Name = "Furniture Damages", SortOrder = 14, CreatedAt = DateTime.UtcNow },
                new() { Code = "187", Name = "Food Transfer", SortOrder = 15, CreatedAt = DateTime.UtcNow },
                new() { Code = "188", Name = "Mattress Sale", SortOrder = 16, CreatedAt = DateTime.UtcNow },
                new() { Code = "190", Name = "Revenue from NO show and cancellation", SortOrder = 17, CreatedAt = DateTime.UtcNow },
                new() { Code = "900", Name = "City Ledger Billing", SortOrder = 18, CreatedAt = DateTime.UtcNow }
            };
            _context.FolioChargeItems.AddRange(items);
            await _context.SaveChangesAsync();
        }

        private async Task SeedPaymentAccounts()
        {
            var accounts = new List<FolioPaymentAccount>
            {
                new() { Code = "10001", Name = "Credit Cards H.O", AccountType = "Card", SortOrder = 1, CreatedAt = DateTime.UtcNow },
                new() { Code = "10002", Name = "Credit Cards", AccountType = "Card", SortOrder = 2, CreatedAt = DateTime.UtcNow },
                new() { Code = "10003", Name = "Online Credit Cards (IPG)", AccountType = "Card", SortOrder = 3, CreatedAt = DateTime.UtcNow },
                new() { Code = "10004", Name = "Balances Transfer", AccountType = "Transfer", SortOrder = 4, CreatedAt = DateTime.UtcNow },
                new() { Code = "10005", Name = "Cash in Hand-Sale", AccountType = "Cash", SortOrder = 5, CreatedAt = DateTime.UtcNow },
                new() { Code = "10006", Name = "Cash in Hand-Imprest", AccountType = "Cash", SortOrder = 6, CreatedAt = DateTime.UtcNow },
                new() { Code = "10007", Name = "Cash In Hand-Karma & Kale", AccountType = "Cash", SortOrder = 7, CreatedAt = DateTime.UtcNow },
                new() { Code = "10008", Name = "Askari Bank A/c", AccountType = "Bank", SortOrder = 8, CreatedAt = DateTime.UtcNow },
                new() { Code = "10009", Name = "UBL Imprest A/c", AccountType = "Bank", SortOrder = 9, CreatedAt = DateTime.UtcNow },
                new() { Code = "10010", Name = "Deposited in MCB", AccountType = "Bank", SortOrder = 10, CreatedAt = DateTime.UtcNow },
                new() { Code = "10011", Name = "IMPREST Cash (NEW)", AccountType = "Cash", SortOrder = 11, CreatedAt = DateTime.UtcNow },
                new() { Code = "10016", Name = "Cash CAFE", AccountType = "Cash", SortOrder = 12, CreatedAt = DateTime.UtcNow },
                new() { Code = "10017", Name = "Cash FDO", AccountType = "Cash", SortOrder = 13, CreatedAt = DateTime.UtcNow }
            };
            _context.FolioPaymentAccounts.AddRange(accounts);
            await _context.SaveChangesAsync();
        }
    }

    // ==================== Request DTOs ====================

    public class FolioChargeRequest
    {
        public int CheckInId { get; set; }
        public string? ChargeItemCode { get; set; }
        public string? Description { get; set; }
        public string? Source { get; set; }
        public string? RoomNumber { get; set; }
        public int FolioIndex { get; set; } = 1;
        public DateTime TransactionDate { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal Amount { get; set; }
        public decimal TaxAmount { get; set; }
        public string? Reference { get; set; }
        public string? PostedBy { get; set; }
        public string? Remarks { get; set; }
        public string? Memo { get; set; }
    }

    public class FolioReceiptRequest
    {
        public int CheckInId { get; set; }
        public string? PaymentAccountCode { get; set; }
        public string? Description { get; set; }
        public string? Source { get; set; }
        public string? RoomNumber { get; set; }
        public int FolioIndex { get; set; } = 1;
        public DateTime TransactionDate { get; set; }
        public decimal Amount { get; set; }
        public string? Reference { get; set; }
        public string? PostedBy { get; set; }
        public string? Memo { get; set; }
        public string? Remarks { get; set; }
    }

    public class FolioTransferRequest
    {
        public int FromCheckInId { get; set; }
        public int ToCheckInId { get; set; }
        public decimal Amount { get; set; }
        public int FolioIndex { get; set; } = 1;
        public string? PostedBy { get; set; }
    }
}
