using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;
using HotelERP.API.Services;
using System.IO.Compression;
using System.Text;
using System.Text.Json;

namespace HotelERP.API.Controllers
{
    // [Authorize] // Temporarily disabled for testing
    public class CheckOutsController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CheckOutsController> _logger;
        private readonly IEmailService _emailService;
        private readonly ICheckoutInvoiceService _checkoutInvoiceService;

        public CheckOutsController(
            HotelDbContext context,
            ILogger<CheckOutsController> logger,
            IEmailService emailService,
            ICheckoutInvoiceService checkoutInvoiceService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
            _checkoutInvoiceService = checkoutInvoiceService;
        }

        private static readonly JsonSerializerOptions DraftJsonOptions = new(JsonSerializerDefaults.Web)
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        // GET: api/checkouts
        [HttpGet]
        public async Task<IActionResult> GetCheckOuts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null)
        {
            try
            {
                var query = _context.CheckOutMasters
                    .Include(c => c.CheckIn)
                        .ThenInclude(ci => ci.Guest)
                    .Include(c => c.CheckIn)
                        .ThenInclude(ci => ci.Room)
                            .ThenInclude(room => room.RoomType)
                    .Include(c => c.CheckIn)
                        .ThenInclude(ci => ci.Reservation)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(c => c.PaymentStatus == status);
                }

                var totalCount = await query.CountAsync();
                var checkOuts = await query
                    .OrderByDescending(c => c.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new
                    {
                        Id = c.Id,
                        CheckOutNumber = c.CheckOutNumber,
                        CheckInId = c.CheckInId,
                        CheckOutDate = c.CheckOutDate,
                        RoomCharges = c.RoomCharges,
                        ServiceCharges = c.ServiceCharges,
                        TaxAmount = c.TaxAmount,
                        TotalBill = c.TotalBill,
                        TotalPaid = c.TotalPaid,
                        Balance = c.Balance,
                        PaymentMethod = c.PaymentMethod,
                        PaymentStatus = c.PaymentStatus,
                        CheckedOutBy = c.CheckedOutBy,
                        Remarks = c.Remarks,
                        LateCheckOut = c.LateCheckOut,
                        LateCheckOutCharges = c.LateCheckOutCharges,
                        CreatedAt = c.CreatedAt,
                        CheckIn = c.CheckIn != null ? new
                        {
                            Id = c.CheckIn.Id,
                            CheckInNumber = c.CheckIn.CheckInNumber,
                            ReservationId = c.CheckIn.ReservationId,
                            ReservationNumber = c.CheckIn.Reservation != null ? c.CheckIn.Reservation.ReservationNumber : null,
                            CheckInDate = c.CheckIn.CheckInDate,
                            ExpectedCheckOutDate = c.CheckIn.ExpectedCheckOutDate,
                            AdvancePaid = c.CheckIn.AdvancePaid,
                            Guest = c.CheckIn.Guest != null ? new
                            {
                                Id = c.CheckIn.Guest.Id,
                                FullName = c.CheckIn.Guest.FullName,
                                Phone = c.CheckIn.Guest.PhoneNumber,
                                Email = c.CheckIn.Guest.Email
                            } : null,
                            Room = c.CheckIn.Room != null ? new
                            {
                                Id = c.CheckIn.Room.Id,
                                RoomNumber = c.CheckIn.Room.RoomNumber,
                                FloorNumber = c.CheckIn.Room.FloorNumber,
                                HotelId = c.CheckIn.Room.RoomType != null ? c.CheckIn.Room.RoomType.HotelId : null,
                                RoomType = c.CheckIn.Room.RoomType != null ? new
                                {
                                    Id = c.CheckIn.Room.RoomType.Id,
                                    Name = c.CheckIn.Room.RoomType.Name,
                                    TypeName = c.CheckIn.Room.RoomType.Name
                                } : null
                            } : null
                        } : null
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = checkOuts,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching check-outs");
                return StatusCode(500, new { success = false, message = "Error fetching check-outs" });
            }
        }

        [HttpGet("drafts")]
        public async Task<IActionResult> GetDrafts()
        {
            try
            {
                var settings = await _context.SystemSettings
                    .Where(s => s.IsActive && s.Category == "CheckoutDraft")
                    .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
                    .ToListAsync();

                var drafts = settings
                    .Select(setting => DeserializeDraft(setting.SettingValue))
                    .Where(draft => draft != null)
                    .ToList();

                return Ok(new { success = true, data = drafts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching checkout drafts");
                return StatusCode(500, new { success = false, message = "Error fetching checkout drafts" });
            }
        }

        [HttpPost("drafts")]
        public async Task<IActionResult> SaveDraft([FromBody] CheckOutDraftEnvelope draft)
        {
            try
            {
                if (draft == null || string.IsNullOrWhiteSpace(draft.DraftId))
                {
                    return BadRequest(new { success = false, message = "Draft payload is required" });
                }

                draft.SavedAt = DateTime.UtcNow;
                var key = $"CHECKOUT_DRAFT_{draft.DraftId}";
                var serialized = JsonSerializer.Serialize(draft, DraftJsonOptions);
                var compressed = CompressString(serialized);

                var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.SettingKey == key);
                if (setting == null)
                {
                    setting = new SystemSetting
                    {
                        SettingKey = key,
                        SettingValue = compressed,
                        Description = $"Checkout draft for {draft.GuestName}",
                        Category = "CheckoutDraft",
                        DataType = "Json",
                        IsEncrypted = false,
                        IsUserEditable = false,
                        CreatedBy = "system",
                        UpdatedBy = "system",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsActive = true
                    };
                    _context.SystemSettings.Add(setting);
                }
                else
                {
                    setting.SettingValue = compressed;
                    setting.Description = $"Checkout draft for {draft.GuestName}";
                    setting.UpdatedAt = DateTime.UtcNow;
                    setting.UpdatedBy = "system";
                    setting.IsActive = true;
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = draft, message = "Draft saved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving checkout draft");
                return StatusCode(500, new { success = false, message = "Error saving checkout draft" });
            }
        }

        [HttpDelete("drafts/{draftId}")]
        public async Task<IActionResult> DeleteDraft(string draftId)
        {
            try
            {
                var key = $"CHECKOUT_DRAFT_{draftId}";
                var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.SettingKey == key && s.Category == "CheckoutDraft");
                if (setting == null)
                {
                    return NotFound(new { success = false, message = "Draft not found" });
                }

                _context.SystemSettings.Remove(setting);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Draft deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting checkout draft {DraftId}", draftId);
                return StatusCode(500, new { success = false, message = "Error deleting checkout draft" });
            }
        }

        // GET: api/checkouts/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCheckOut(int id)
        {
            try
            {
                var checkOut = await _context.CheckOutMasters
                    .Include(c => c.CheckIn)
                        .ThenInclude(ci => ci.Guest)
                    .Include(c => c.CheckIn)
                        .ThenInclude(ci => ci.Room)
                    .Where(c => c.Id == id)
                    .Select(c => new
                    {
                        Id = c.Id,
                        CheckOutNumber = c.CheckOutNumber,
                        CheckInId = c.CheckInId,
                        CheckOutDate = c.CheckOutDate,
                        RoomCharges = c.RoomCharges,
                        ServiceCharges = c.ServiceCharges,
                        TaxAmount = c.TaxAmount,
                        TotalBill = c.TotalBill,
                        TotalPaid = c.TotalPaid,
                        Balance = c.Balance,
                        PaymentMethod = c.PaymentMethod,
                        PaymentStatus = c.PaymentStatus,
                        CheckedOutBy = c.CheckedOutBy,
                        Remarks = c.Remarks,
                        LateCheckOut = c.LateCheckOut,
                        LateCheckOutCharges = c.LateCheckOutCharges,
                        CreatedAt = c.CreatedAt,
                        CheckIn = c.CheckIn != null ? new
                        {
                            Id = c.CheckIn.Id,
                            CheckInNumber = c.CheckIn.CheckInNumber,
                            CheckInDate = c.CheckIn.CheckInDate,
                            ExpectedCheckOutDate = c.CheckIn.ExpectedCheckOutDate,
                            AdvancePaid = c.CheckIn.AdvancePaid,
                            Guest = c.CheckIn.Guest != null ? new
                            {
                                Id = c.CheckIn.Guest.Id,
                                FullName = c.CheckIn.Guest.FullName,
                                Phone = c.CheckIn.Guest.PhoneNumber,
                                Email = c.CheckIn.Guest.Email
                            } : null,
                            Room = c.CheckIn.Room != null ? new
                            {
                                Id = c.CheckIn.Room.Id,
                                RoomNumber = c.CheckIn.Room.RoomNumber,
                                FloorNumber = c.CheckIn.Room.FloorNumber
                            } : null
                        } : null
                    })
                    .FirstOrDefaultAsync();

                if (checkOut == null)
                {
                    return NotFound(new { success = false, message = "Check-out not found" });
                }

                return Ok(new { success = true, data = checkOut });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching check-out {Id}", id);
                return StatusCode(500, new { success = false, message = "Error fetching check-out" });
            }
        }

        // POST: api/checkouts/quick-checkout
        [HttpPost("quick-checkout/{checkInId}")]
        public async Task<IActionResult> QuickCheckOut(int checkInId)
        {
            try
            {
                // Verify CheckIn exists
                var checkIn = await _context.CheckInMasters
                    .Include(ci => ci.Room)
                    .FirstOrDefaultAsync(ci => ci.Id == checkInId);
                
                if (checkIn == null)
                {
                    return BadRequest(new { success = false, message = $"Check-in with ID {checkInId} not found" });
                }

                if (checkIn.Status == "CheckedOut")
                {
                    return BadRequest(new { success = false, message = "Guest has already been checked out" });
                }

                // Generate check-out number
                var lastCheckOut = await _context.CheckOutMasters
                    .OrderByDescending(c => c.Id)
                    .FirstOrDefaultAsync();
                
                var nextNumber = (lastCheckOut?.Id ?? 0) + 1;
                var checkOutNumber = $"CO{nextNumber:D6}";

                // Create checkout record with fixed values (no JSON parsing)
                var checkOut = new CheckOutMaster
                {
                    CheckOutNumber = checkOutNumber,
                    CheckInId = checkInId,
                    CheckOutDate = DateTime.UtcNow,
                    RoomCharges = 5000.00m,
                    ServiceCharges = 500.00m,
                    TaxAmount = 550.00m,
                    TotalBill = 6050.00m,
                    TotalPaid = 6050.00m,
                    Balance = 0.00m,
                    LateCheckOutCharges = 0.00m,
                    PaymentMethod = "Cash",
                    PaymentStatus = "Paid",
                    CheckedOutBy = "Reception Staff",
                    Remarks = "Simple checkout via API",
                    LateCheckOut = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null,
                    IsActive = true
                };

                // Update check-in and room status
                checkIn.Status = "CheckedOut";
                if (checkIn.Room != null)
                {
                    checkIn.Room.Status = "Available";
                }

                // ✅ Update related Reservation record when quick checkout is processed
                if (checkIn.ReservationId.HasValue)
                {
                    var reservation = await _context.Reservations
                        .FirstOrDefaultAsync(r => r.Id == checkIn.ReservationId.Value);
                    
                    if (reservation != null)
                    {
                        // Update reservation status and payment details
                        reservation.Status = "Paid";
                        reservation.PaymentStatus = "Paid";
                        reservation.TotalPaid = checkOut.TotalPaid;
                        
                        _logger.LogInformation("Updated Reservation {ReservationId} via QuickCheckOut: Status=Paid, PaymentStatus=Paid, TotalPaid={TotalPaid}", 
                            reservation.Id, checkOut.TotalPaid);
                    }
                }

                _context.CheckOutMasters.Add(checkOut);
                await _context.SaveChangesAsync();

                var response = new
                {
                    Id = checkOut.Id,
                    CheckOutNumber = checkOut.CheckOutNumber,
                    CheckInId = checkOut.CheckInId,
                    CheckOutDate = checkOut.CheckOutDate,
                    TotalBill = checkOut.TotalBill,
                    PaymentStatus = checkOut.PaymentStatus
                };

                return Ok(new { success = true, data = response, message = "Check-out completed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in simple checkout");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // GET: api/checkouts/test-checkout/{checkInId} - Ultra simple test endpoint
        [HttpGet("test-checkout/{checkInId}")]
        public async Task<IActionResult> TestCheckOut(int checkInId)
        {
            try
            {
                // Just return success for now to test routing
                return Ok(new { 
                    success = true, 
                    message = $"Test endpoint working for CheckInId: {checkInId}",
                    checkInId = checkInId
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // POST: api/checkouts
        [HttpPost]
        public async Task<IActionResult> CreateCheckOut([FromBody] CheckOutRequest request)
        {
            try
            {
                // Extract data from request
                int checkInId = request.checkInId;
                _logger.LogInformation("Received check-out request for CheckInId: {CheckInId}", checkInId);

                // Verify CheckIn exists
                var checkIn = await _context.CheckInMasters
                    .Include(ci => ci.Room)
                    .FirstOrDefaultAsync(ci => ci.Id == checkInId);
                
                if (checkIn == null)
                {
                    return BadRequest(new { success = false, message = $"Check-in with ID {checkInId} not found" });
                }

                if (checkIn.Status == "CheckedOut")
                {
                    return BadRequest(new { success = false, message = "Guest has already been checked out" });
                }

                var validationError = ValidateCheckoutPayment(request, checkIn.AdvancePaid);
                if (!string.IsNullOrWhiteSpace(validationError))
                {
                    return BadRequest(new { success = false, message = validationError });
                }

                // Create CheckOut entity from DTO
                _logger.LogInformation("Creating check-out for CheckInId: {CheckInId}", checkInId);
                
                // Generate check-out number FIRST
                var lastCheckOut = await _context.CheckOutMasters
                    .OrderByDescending(c => c.Id)
                    .FirstOrDefaultAsync();
                
                var nextNumber = (lastCheckOut?.Id ?? 0) + 1;
                var checkOutNumber = $"CO{nextNumber:D6}";

                var checkOut = new CheckOutMaster
                {
                    CheckOutNumber = checkOutNumber,
                    CheckInId = checkInId,
                    CheckOutDate = DateTime.Parse(request.checkOutDate),
                    RoomCharges = request.roomCharges,
                    ServiceCharges = request.serviceCharges,
                    TaxAmount = request.taxAmount,
                    TotalBill = request.totalBill,
                    TotalPaid = request.totalPaid,
                    Balance = request.balance,
                    LateCheckOutCharges = request.lateCheckOutCharges,
                    PaymentMethod = request.paymentMethod,
                    PaymentStatus = request.paymentStatus,
                    CheckedOutBy = request.checkedOutBy,
                    Remarks = request.remarks,
                    LateCheckOut = request.lateCheckOut,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null,
                    IsActive = true
                };

                // CheckOut number already set above

                // Update check-in status
                checkIn.Status = "CheckedOut";

                // Update room status to Available
                if (checkIn.Room != null)
                {
                    checkIn.Room.Status = "Available";
                }

                await SyncFolioWithCheckOutAsync(checkIn, checkOut);

                // ✅ Update related Reservation record when checkout is processed
                if (checkIn.ReservationId.HasValue)
                {
                    var reservation = await _context.Reservations
                        .FirstOrDefaultAsync(r => r.Id == checkIn.ReservationId.Value);
                    
                    if (reservation != null)
                    {
                        // Update reservation status and payment details
                        reservation.Status = "Paid";
                        reservation.PaymentStatus = "Paid";
                        reservation.TotalPaid = checkOut.TotalPaid;
                        
                        _logger.LogInformation("Updated Reservation {ReservationId}: Status=Paid, PaymentStatus=Paid, TotalPaid={TotalPaid}", 
                            reservation.Id, checkOut.TotalPaid);
                    }
                }

                _logger.LogInformation("About to save check-out to database...");
                _logger.LogInformation("CheckOut data: Number={Number}, CheckInId={CheckInId}, Date={Date}", 
                    checkOut.CheckOutNumber, checkOut.CheckInId, checkOut.CheckOutDate);
                
                _context.CheckOutMasters.Add(checkOut);
                
                try
                {
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Check-out created successfully with ID: {CheckOutId}", checkOut.Id);
                }
                catch (Exception saveEx)
                {
                    _logger.LogError(saveEx, "Database save failed. Full exception: {Exception}", saveEx.ToString());
                    _logger.LogError("Inner exception: {InnerException}", saveEx.InnerException?.ToString());
                    throw new Exception($"Database save failed: {saveEx.InnerException?.Message ?? saveEx.Message}");
                }

                // Return simplified response
                var response = new
                {
                    Id = checkOut.Id,
                    CheckOutNumber = checkOut.CheckOutNumber,
                    CheckInId = checkOut.CheckInId,
                    CheckOutDate = checkOut.CheckOutDate,
                    TotalBill = checkOut.TotalBill,
                    TotalPaid = checkOut.TotalPaid,
                    Balance = checkOut.Balance,
                    PaymentStatus = checkOut.PaymentStatus
                };

                return CreatedAtAction(nameof(GetCheckOut), new { id = checkOut.Id }, 
                    new { success = true, data = response, message = "Check-out created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating check-out: {Error}", ex.Message);
                return BadRequest(new { success = false, message = $"Error creating check-out: {ex.Message}" });
            }
        }

        // PUT: api/checkouts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCheckOut(int id, [FromBody] CheckOutMaster checkOut)
        {
            if (id != checkOut.Id)
            {
                return BadRequest(new { success = false, message = "ID mismatch" });
            }

            try
            {
                checkOut.UpdatedAt = DateTime.UtcNow;
                _context.Entry(checkOut).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                var checkIn = await _context.CheckInMasters
                    .Include(ci => ci.Room)
                    .FirstOrDefaultAsync(ci => ci.Id == checkOut.CheckInId);

                if (checkIn != null)
                {
                    await SyncFolioWithCheckOutAsync(checkIn, checkOut);
                }

                return Ok(new { success = true, data = checkOut, message = "Check-out updated successfully" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await CheckOutExists(id))
                {
                    return NotFound(new { success = false, message = "Check-out not found" });
                }
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating check-out {Id}", id);
                return StatusCode(500, new { success = false, message = "Error updating check-out" });
            }
        }

        private async Task SyncFolioWithCheckOutAsync(CheckInMaster checkIn, CheckOutMaster checkOut)
        {
            var folios = await _context.GuestFolios
                .Where(gf => gf.CheckInId == checkIn.Id && !gf.IsReversed)
                .OrderBy(gf => gf.Id)
                .ToListAsync();

            var now = DateTime.UtcNow;

            var nextFolioSequence = await _context.GuestFolios.CountAsync() + 1;
            var nextInvoiceSequence = await _context.GuestFolios
                .Where(f => f.TransactionType == "Charge")
                .CountAsync() + 1;

            GuestFolio? roomRent = folios
                .FirstOrDefault(f => (f.Reference ?? string.Empty) == "CHECKIN_ROOM_RENT")
                ?? folios.FirstOrDefault(f => f.TransactionType == "Charge" && (f.ChargeItemCode ?? string.Empty).StartsWith("101"));

            if (roomRent == null)
            {
                roomRent = new GuestFolio
                {
                    FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{nextFolioSequence:D4}",
                    InvoiceNumber = $"AR-{nextInvoiceSequence:D6}",
                    CheckInId = checkIn.Id,
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
                    Reference = "CHECKIN_ROOM_RENT",
                    PostedBy = "system",
                    Remarks = string.Empty,
                    Memo = string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.GuestFolios.Add(roomRent);
                folios.Add(roomRent);
                nextFolioSequence += 1;
                nextInvoiceSequence += 1;
            }

            roomRent.Amount = checkOut.RoomCharges;
            roomRent.TaxAmount = checkOut.TaxAmount;
            roomRent.TotalAmount = checkOut.RoomCharges + checkOut.TaxAmount;
            roomRent.PaidAmount = 0;
            roomRent.DueAmount = roomRent.TotalAmount;
            roomRent.Balance = roomRent.TotalAmount;
            roomRent.UpdatedAt = now;

            var advanceCandidates = folios
                .Where(f => f.TransactionType == "Receipt")
                .Where(f =>
                    (f.Reference ?? string.Empty) == "CHECKIN_ADVANCE" ||
                    string.Equals((f.Description ?? string.Empty).Trim(), "Advance Paid", StringComparison.OrdinalIgnoreCase))
                .OrderBy(f => f.Id)
                .ToList();

            if (advanceCandidates.Count > 1)
            {
                var keep = advanceCandidates[0];
                foreach (var dup in advanceCandidates.Skip(1))
                {
                    dup.IsReversed = true;
                    dup.ReversedFromId = keep.Id;
                    dup.UpdatedAt = now;
                }

                folios = folios.Where(f => !f.IsReversed).OrderBy(f => f.Id).ToList();
                advanceCandidates = advanceCandidates.Where(f => !f.IsReversed).OrderBy(f => f.Id).ToList();
            }

            var advanceReceipt = advanceCandidates.FirstOrDefault();
            if (advanceReceipt == null && checkIn.AdvancePaid > 0)
            {
                var receipt = new GuestFolio
                {
                    FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{nextFolioSequence:D4}",
                    CheckInId = checkIn.Id,
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
                    CreatedAt = now,
                    UpdatedAt = now
                };

                _context.GuestFolios.Add(receipt);
                folios.Add(receipt);
                nextFolioSequence += 1;
            }

            if (checkOut.ServiceCharges > 0)
            {
                var service = folios.FirstOrDefault(f => f.TransactionType == "Charge" && (f.Reference ?? string.Empty) == "CHECKOUT_SERVICE_CHARGES");
                if (service == null)
                {
                    service = new GuestFolio
                    {
                        FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{nextFolioSequence:D4}",
                        InvoiceNumber = $"AR-{nextInvoiceSequence:D6}",
                        CheckInId = checkIn.Id,
                        ReservationId = checkIn.ReservationId.HasValue && checkIn.ReservationId.Value > 0 ? checkIn.ReservationId : null,
                        GuestId = checkIn.GuestId > 0 ? checkIn.GuestId : null,
                        Source = "System",
                        RoomNumber = checkIn.Room?.RoomNumber ?? string.Empty,
                        FolioIndex = 1,
                        TransactionDate = checkOut.CheckOutDate,
                        Description = "Service Charges",
                        TransactionType = "Charge",
                        ChargeItemCode = "182-Miscellaneous",
                        Quantity = 1,
                        Reference = "CHECKOUT_SERVICE_CHARGES",
                        PostedBy = "system",
                        Remarks = string.Empty,
                        Memo = string.Empty,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsActive = true
                    };

                    _context.GuestFolios.Add(service);
                    folios.Add(service);
                    nextFolioSequence += 1;
                    nextInvoiceSequence += 1;
                }

                service.Amount = checkOut.ServiceCharges;
                service.TaxAmount = 0;
                service.TotalAmount = checkOut.ServiceCharges;
                service.PaidAmount = 0;
                service.DueAmount = service.TotalAmount;
                service.Balance = service.TotalAmount;
                service.UpdatedAt = DateTime.UtcNow;
            }

            if (checkOut.LateCheckOutCharges > 0)
            {
                var late = folios.FirstOrDefault(f => f.TransactionType == "Charge" && (f.Reference ?? string.Empty) == "CHECKOUT_LATE_CHARGES");
                if (late == null)
                {
                    late = new GuestFolio
                    {
                        FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{nextFolioSequence:D4}",
                        InvoiceNumber = $"AR-{nextInvoiceSequence:D6}",
                        CheckInId = checkIn.Id,
                        ReservationId = checkIn.ReservationId.HasValue && checkIn.ReservationId.Value > 0 ? checkIn.ReservationId : null,
                        GuestId = checkIn.GuestId > 0 ? checkIn.GuestId : null,
                        Source = "System",
                        RoomNumber = checkIn.Room?.RoomNumber ?? string.Empty,
                        FolioIndex = 1,
                        TransactionDate = checkOut.CheckOutDate,
                        Description = "Late Check-Out Charges",
                        TransactionType = "Charge",
                        ChargeItemCode = "182-Miscellaneous",
                        Quantity = 1,
                        Reference = "CHECKOUT_LATE_CHARGES",
                        PostedBy = "system",
                        Remarks = string.Empty,
                        Memo = string.Empty,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsActive = true
                    };

                    _context.GuestFolios.Add(late);
                    folios.Add(late);
                    nextFolioSequence += 1;
                    nextInvoiceSequence += 1;
                }

                late.Amount = checkOut.LateCheckOutCharges;
                late.TaxAmount = 0;
                late.TotalAmount = checkOut.LateCheckOutCharges;
                late.PaidAmount = 0;
                late.DueAmount = late.TotalAmount;
                late.Balance = late.TotalAmount;
                late.UpdatedAt = DateTime.UtcNow;
            }

            var checkoutPaidNow = checkOut.TotalPaid - checkIn.AdvancePaid;
            if (checkoutPaidNow < 0) checkoutPaidNow = 0;

            var paymentCandidates = folios
                .Where(f => f.TransactionType == "Receipt")
                .Where(f =>
                    (f.Reference ?? string.Empty) == "CHECKOUT_PAYMENT" ||
                    string.Equals((f.Description ?? string.Empty).Trim(), "Check-Out Payment", StringComparison.OrdinalIgnoreCase))
                .OrderBy(f => f.Id)
                .ToList();

            if (paymentCandidates.Count > 1)
            {
                var keep = paymentCandidates[0];
                foreach (var dup in paymentCandidates.Skip(1))
                {
                    dup.IsReversed = true;
                    dup.ReversedFromId = keep.Id;
                    dup.UpdatedAt = now;
                }

                folios = folios.Where(f => !f.IsReversed).OrderBy(f => f.Id).ToList();
                paymentCandidates = paymentCandidates.Where(f => !f.IsReversed).OrderBy(f => f.Id).ToList();
            }

            if (checkoutPaidNow <= 0)
            {
                foreach (var p in paymentCandidates)
                {
                    p.IsReversed = true;
                    p.ReversedFromId = null;
                    p.UpdatedAt = now;
                }
            }
            else
            {
                var payment = paymentCandidates.FirstOrDefault();
                if (payment == null)
                {
                    payment = new GuestFolio
                    {
                        FolioNumber = $"GF-{DateTime.Now:yyyyMMdd}-{nextFolioSequence:D4}",
                        CheckInId = checkIn.Id,
                        ReservationId = checkIn.ReservationId.HasValue && checkIn.ReservationId.Value > 0 ? checkIn.ReservationId : null,
                        GuestId = checkIn.GuestId > 0 ? checkIn.GuestId : null,
                        Source = "System",
                        RoomNumber = checkIn.Room?.RoomNumber ?? string.Empty,
                        FolioIndex = 1,
                        TransactionDate = checkOut.CheckOutDate,
                        Description = "Check-Out Payment",
                        TransactionType = "Receipt",
                        PaymentAccountCode = MapPaymentAccountCode(checkOut.PaymentMethod),
                        IsActive = true,
                        Reference = "CHECKOUT_PAYMENT",
                        PostedBy = "system",
                        Remarks = string.Empty,
                        Memo = string.Empty,
                        CreatedAt = now,
                        UpdatedAt = now
                    };

                    _context.GuestFolios.Add(payment);
                    folios.Add(payment);
                }

                payment.IsReversed = false;
                payment.ReversedFromId = null;
                payment.Amount = checkoutPaidNow;
                payment.TaxAmount = 0;
                payment.TotalAmount = checkoutPaidNow;
                payment.PaidAmount = checkoutPaidNow;
                payment.DueAmount = 0;
                payment.Balance = -checkoutPaidNow;
                payment.PaymentAccountCode = MapPaymentAccountCode(checkOut.PaymentMethod);
                payment.UpdatedAt = now;
            }

            await _context.SaveChangesAsync();
        }

        private static string MapPaymentAccountCode(string? paymentMethod)
        {
            var method = (paymentMethod ?? string.Empty).Trim().ToLowerInvariant();
            if (method.Contains("credit")) return "10002-Credit Cards";
            if (method.Contains("debit")) return "10002-Credit Cards";
            if (method.Contains("bank")) return "10008-Askari Bank A/c";
            if (method.Contains("upi")) return "10003-Online Credit Cards (IPG)";
            return "10005-Cash in Hand-Sale";
        }

        // DELETE: api/checkouts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCheckOut(int id)
        {
            try
            {
                var checkOut = await _context.CheckOutMasters.FindAsync(id);
                if (checkOut == null)
                {
                    return NotFound(new { success = false, message = "Check-out not found" });
                }

                _context.CheckOutMasters.Remove(checkOut);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Check-out deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting check-out {Id}", id);
                return StatusCode(500, new { success = false, message = "Error deleting check-out" });
            }
        }

        // GET: api/checkouts/pending-payment
        [HttpGet("pending-payment")]
        public async Task<IActionResult> GetPendingPayments()
        {
            try
            {
                var pendingPayments = await _context.CheckOutMasters
                    .Include(c => c.CheckIn)
                        .ThenInclude(ci => ci.Guest)
                    .Include(c => c.CheckIn)
                        .ThenInclude(ci => ci.Room)
                    .Where(c => c.PaymentStatus == "Pending" || c.PaymentStatus == "Partial")
                    .Select(c => new
                    {
                        Id = c.Id,
                        CheckOutNumber = c.CheckOutNumber,
                        GuestName = c.CheckIn.Guest.FullName,
                        RoomNumber = c.CheckIn.Room.RoomNumber,
                        CheckOutDate = c.CheckOutDate,
                        TotalBill = c.TotalBill,
                        TotalPaid = c.TotalPaid,
                        Balance = c.Balance,
                        PaymentStatus = c.PaymentStatus
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = pendingPayments });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching pending payments");
                return StatusCode(500, new { success = false, message = "Error fetching pending payments" });
            }
        }

        [HttpPost("invoice-preview/pdf")]
        public async Task<IActionResult> GenerateInvoicePreviewPdf([FromBody] CheckOutRequest request)
        {
            try
            {
                var model = await BuildInvoiceModelAsync(request, null);
                if (model == null)
                {
                    return BadRequest(new { success = false, message = "Unable to build invoice preview" });
                }

                var pdfBytes = _checkoutInvoiceService.GeneratePdf(model);
                return File(pdfBytes, "application/pdf", $"checkout-invoice-{model.InvoiceNumber}.pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating checkout invoice preview PDF");
                return StatusCode(500, new { success = false, message = "Error generating invoice PDF" });
            }
        }

        [HttpPost("invoice-preview/email")]
        public async Task<IActionResult> EmailInvoicePreview([FromBody] CheckoutInvoiceEmailRequest request)
        {
            try
            {
                var model = await BuildInvoiceModelAsync(request.Checkout, request.InvoiceNumber);
                if (model == null)
                {
                    return BadRequest(new { success = false, message = "Unable to build invoice preview" });
                }

                var toEmail = request.Email;
                if (string.IsNullOrWhiteSpace(toEmail))
                {
                    return BadRequest(new { success = false, message = "Recipient email is required" });
                }

                var pdfBytes = _checkoutInvoiceService.GeneratePdf(model);
                var htmlBody = _checkoutInvoiceService.GenerateEmailHtml(model);
                await _emailService.SendCheckoutInvoiceEmailAsync(
                    toEmail,
                    model.GuestName,
                    $"Check-Out Invoice - {model.InvoiceNumber}",
                    htmlBody,
                    pdfBytes,
                    $"checkout-invoice-{model.InvoiceNumber}.pdf");

                return Ok(new { success = true, message = "Invoice email sent successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error emailing checkout invoice preview");
                return StatusCode(500, new { success = false, message = "Error sending invoice email" });
            }
        }

        private async Task<bool> CheckOutExists(int id)
        {
            return await _context.CheckOutMasters.AnyAsync(e => e.Id == id);
        }

        private string? ValidateCheckoutPayment(CheckOutRequest request, decimal advancePaid)
        {
            var requiredPayNow = Math.Max(request.totalBill - advancePaid, 0);
            var paymentLines = request.paymentLines ?? new List<CheckOutPaymentLineRequest>();
            var paymentLineTotal = paymentLines.Sum(line => line.amount);
            var expectedTotalPaid = advancePaid + paymentLineTotal;
            var expectedBalance = request.totalBill - expectedTotalPaid;

            if (requiredPayNow == 0 && paymentLineTotal == 0)
            {
                return null;
            }

            if (Math.Abs(paymentLineTotal - requiredPayNow) > 0.01m)
            {
                return $"Split payments must exactly match the required payable amount of {requiredPayNow:N2}.";
            }

            if (Math.Abs(request.totalPaid - expectedTotalPaid) > 0.01m)
            {
                return "Total paid does not match the sum of advance and split payment lines.";
            }

            if (Math.Abs(request.balance - expectedBalance) > 0.01m)
            {
                return "Balance is not aligned with the current payment breakdown.";
            }

            if (paymentLines.Any(line => string.IsNullOrWhiteSpace(line.method) || line.amount <= 0))
            {
                return "Each split payment line must include a valid payment method and amount.";
            }

            return null;
        }

        private async Task<CheckoutInvoiceModel?> BuildInvoiceModelAsync(CheckOutRequest request, string? invoiceNumber)
        {
            var checkIn = await _context.CheckInMasters
                .Include(ci => ci.Reservation)
                .Include(ci => ci.Guest)
                .Include(ci => ci.Room)
                    .ThenInclude(room => room.RoomType)
                .FirstOrDefaultAsync(ci => ci.Id == request.checkInId);

            if (checkIn == null)
            {
                return null;
            }

            var parsedCheckOutDate = DateTime.TryParse(request.checkOutDate, out var checkOutDate)
                ? checkOutDate
                : DateTime.UtcNow;
            var stayNights = Math.Max((parsedCheckOutDate.Date - checkIn.CheckInDate.Date).Days, 0);
            var paidNow = Math.Max(request.totalPaid - checkIn.AdvancePaid, 0);
            var ratePerNight = stayNights > 0 ? request.roomCharges / stayNights : request.roomCharges;
            var hotelId = checkIn.Room?.RoomType?.HotelId;
            var hotel = hotelId.HasValue
                ? await _context.Hotels.FirstOrDefaultAsync(h => h.Id == hotelId.Value)
                : await _context.Hotels.OrderByDescending(h => h.IsMainBranch).ThenBy(h => h.HotelName).FirstOrDefaultAsync();
            var model = new CheckoutInvoiceModel
            {
                HotelId = hotel?.Id,
                HotelName = string.IsNullOrWhiteSpace(hotel?.HotelName) ? "Hotel ERP" : hotel.HotelName,
                InvoiceNumber = string.IsNullOrWhiteSpace(invoiceNumber) ? $"CO-PREVIEW-{DateTime.UtcNow:yyyyMMddHHmmss}" : invoiceNumber,
                InvoiceDate = DateTime.UtcNow,
                ReservationNumber = checkIn.Reservation?.ReservationNumber ?? checkIn.CheckInNumber ?? $"CHK-{checkIn.Id}",
                GuestName = checkIn.Guest?.FullName ?? "Guest",
                GuestEmailOrPhone = checkIn.Guest?.Email ?? checkIn.Guest?.PhoneNumber ?? string.Empty,
                RoomNumber = checkIn.Room?.RoomNumber ?? "N/A",
                RoomType = checkIn.Room?.RoomType?.Name ?? "Standard Room",
                CheckInDate = checkIn.CheckInDate,
                CheckOutDate = parsedCheckOutDate,
                StayNights = stayNights,
                RatePerNight = ratePerNight,
                AdvancePaid = checkIn.AdvancePaid,
                PaidNow = paidNow,
                TotalPaid = request.totalPaid,
                TotalBill = request.totalBill,
                Balance = request.balance,
                PaymentStatus = request.paymentStatus,
                LineItems = new List<CheckoutInvoiceLineItem>
                {
                    new() { Description = "Room Charges", Amount = request.roomCharges },
                    new() { Description = "Service Charges", Amount = request.serviceCharges },
                    new() { Description = "Tax Amount", Amount = request.taxAmount },
                    new() { Description = "Late Check-Out Charges", Amount = request.lateCheckOut ? request.lateCheckOutCharges : 0 }
                },
                PaymentLines = (request.paymentLines ?? new List<CheckOutPaymentLineRequest>())
                    .Where(line => line.amount > 0)
                    .Select(line => new CheckoutInvoicePaymentLine
                    {
                        Method = line.method,
                        Amount = line.amount,
                        Reference = line.reference ?? string.Empty
                    })
                    .ToList()
            };

            return model;
        }

        private static string CompressString(string value)
        {
            var bytes = Encoding.UTF8.GetBytes(value);
            using var output = new MemoryStream();
            using (var gzip = new GZipStream(output, CompressionLevel.Optimal))
            {
                gzip.Write(bytes, 0, bytes.Length);
            }

            return Convert.ToBase64String(output.ToArray());
        }

        private static CheckOutDraftEnvelope? DeserializeDraft(string value)
        {
            try
            {
                var compressedBytes = Convert.FromBase64String(value);
                using var input = new MemoryStream(compressedBytes);
                using var gzip = new GZipStream(input, CompressionMode.Decompress);
                using var reader = new StreamReader(gzip, Encoding.UTF8);
                var json = reader.ReadToEnd();
                return JsonSerializer.Deserialize<CheckOutDraftEnvelope>(json, DraftJsonOptions);
            }
            catch
            {
                return null;
            }
        }
    }

    public class CheckOutRequest
    {
        public int checkInId { get; set; }
        public string checkOutDate { get; set; } = string.Empty;
        public decimal roomCharges { get; set; }
        public decimal serviceCharges { get; set; }
        public decimal taxAmount { get; set; }
        public decimal totalBill { get; set; }
        public decimal totalPaid { get; set; }
        public decimal balance { get; set; }
        public decimal lateCheckOutCharges { get; set; }
        public string paymentMethod { get; set; } = string.Empty;
        public string paymentStatus { get; set; } = string.Empty;
        public string checkedOutBy { get; set; } = string.Empty;
        public string remarks { get; set; } = string.Empty;
        public bool lateCheckOut { get; set; }
        public List<CheckOutPaymentLineRequest>? paymentLines { get; set; }
    }

    public class CheckOutPaymentLineRequest
    {
        public string method { get; set; } = string.Empty;
        public decimal amount { get; set; }
        public string? reference { get; set; }
    }

    public class CheckoutInvoiceEmailRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? InvoiceNumber { get; set; }
        public CheckOutRequest Checkout { get; set; } = new();
    }

    public class CheckOutDraftEnvelope
    {
        public string DraftId { get; set; } = string.Empty;
        public DateTime SavedAt { get; set; }
        public string GuestName { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public string SelectedCheckInId { get; set; } = string.Empty;
        public CheckOutDraftFormData FormData { get; set; } = new();
        public List<CheckOutDraftAdjustment> Adjustments { get; set; } = new();
        public List<CheckOutPaymentLineRequest> PaymentLines { get; set; } = new();
    }

    public class CheckOutDraftFormData
    {
        public string checkInId { get; set; } = string.Empty;
        public string checkOutDate { get; set; } = string.Empty;
        public string roomCharges { get; set; } = string.Empty;
        public string serviceCharges { get; set; } = string.Empty;
        public string taxAmount { get; set; } = string.Empty;
        public string totalBill { get; set; } = string.Empty;
        public string advancePaid { get; set; } = string.Empty;
        public string paidNow { get; set; } = string.Empty;
        public string totalPaid { get; set; } = string.Empty;
        public string balance { get; set; } = string.Empty;
        public string paymentMethod { get; set; } = string.Empty;
        public string paymentStatus { get; set; } = string.Empty;
        public string checkedOutBy { get; set; } = string.Empty;
        public string remarks { get; set; } = string.Empty;
        public bool lateCheckOut { get; set; }
        public string lateCheckOutCharges { get; set; } = string.Empty;
    }

    public class CheckOutDraftAdjustment
    {
        public string Type { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
