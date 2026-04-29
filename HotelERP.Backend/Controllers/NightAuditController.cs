using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.Backend.Data;
using HotelERP.Backend.Models.NightAudit;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NightAuditController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<NightAuditController> _logger;

        public NightAuditController(ApplicationDbContext context, ILogger<NightAuditController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // =============================================
        // MAIN AUDIT OPERATIONS
        // =============================================

        /// <summary>
        /// Get current day audit status and summary
        /// </summary>
        [HttpGet("current")]
        public async Task<ActionResult<object>> GetCurrentAudit()
        {
            try
            {
                var currentDate = DateTime.Today;
                
                var audit = await _context.NightAuditLogs
                    .Include(a => a.Charges)
                    .Include(a => a.Payments)
                    .Include(a => a.RoomStatuses)
                    .FirstOrDefaultAsync(a => a.BusinessDate.Date == currentDate);

                if (audit == null)
                {
                    // Create new audit record for today
                    audit = new NightAuditLog
                    {
                        BusinessDate = currentDate,
                        Status = "Pending",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    };

                    _context.NightAuditLogs.Add(audit);
                    await _context.SaveChangesAsync();
                }

                // Calculate real-time metrics
                var metrics = await CalculateAuditMetrics(audit.AuditId);

                var result = new
                {
                    auditId = audit.AuditId,
                    businessDate = audit.BusinessDate,
                    status = audit.Status,
                    auditStartTime = audit.AuditStartTime,
                    auditEndTime = audit.AuditEndTime,
                    completedBy = audit.CompletedBy,
                    notes = audit.Notes,
                    metrics = metrics,
                    lastUpdated = audit.UpdatedAt
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current audit");
                return StatusCode(500, new { message = "Error retrieving current audit", error = ex.Message });
            }
        }

        /// <summary>
        /// Start night audit process
        /// </summary>
        [HttpPost("start")]
        public async Task<ActionResult<object>> StartAudit([FromBody] StartAuditRequest request)
        {
            try
            {
                var currentDate = DateTime.Today;
                
                var audit = await _context.NightAuditLogs
                    .FirstOrDefaultAsync(a => a.BusinessDate.Date == currentDate);

                if (audit == null)
                {
                    return BadRequest(new { message = "No audit record found for today" });
                }

                if (audit.Status != "Pending")
                {
                    return BadRequest(new { message = $"Audit is already {audit.Status.ToLower()}" });
                }

                // Update audit status
                audit.Status = "Running";
                audit.AuditStartTime = DateTime.Now;
                audit.UpdatedAt = DateTime.Now;

                // Auto-post daily charges
                await AutoPostDailyCharges(audit.AuditId);

                // Calculate metrics
                var metrics = await CalculateAuditMetrics(audit.AuditId);

                // Update audit with calculated values
                audit.TotalCharges = metrics.TotalCharges;
                audit.TotalPayments = metrics.TotalPayments;
                audit.VarianceAmount = metrics.VarianceAmount;
                audit.RoomCount = metrics.RoomCount;
                audit.OccupiedRooms = metrics.OccupiedRooms;
                audit.OccupancyPercentage = metrics.OccupancyPercentage;
                audit.ADR = metrics.ADR;
                audit.RevPAR = metrics.RevPAR;
                audit.RoomRevenue = metrics.RoomRevenue;
                audit.ExtraRevenue = metrics.ExtraRevenue;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Night audit started successfully", auditId = audit.AuditId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting audit");
                return StatusCode(500, new { message = "Error starting audit", error = ex.Message });
            }
        }

        /// <summary>
        /// Complete night audit process
        /// </summary>
        [HttpPost("complete")]
        public async Task<ActionResult<object>> CompleteAudit([FromBody] CompleteAuditRequest request)
        {
            try
            {
                var audit = await _context.NightAuditLogs
                    .FirstOrDefaultAsync(a => a.AuditId == request.AuditId);

                if (audit == null)
                {
                    return NotFound(new { message = "Audit record not found" });
                }

                if (audit.Status != "Running")
                {
                    return BadRequest(new { message = $"Cannot complete audit with status: {audit.Status}" });
                }

                // Final calculations and validations
                var metrics = await CalculateAuditMetrics(audit.AuditId);

                // Generate summary reports
                await GenerateRevenueSummary(audit.AuditId);

                // Update audit status
                audit.Status = "Completed";
                audit.AuditEndTime = DateTime.Now;
                audit.CompletedBy = request.CompletedBy;
                audit.Notes = request.Notes;
                audit.UpdatedAt = DateTime.Now;

                // Update final metrics
                audit.TotalCharges = metrics.TotalCharges;
                audit.TotalPayments = metrics.TotalPayments;
                audit.VarianceAmount = metrics.VarianceAmount;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Night audit completed successfully", auditId = audit.AuditId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing audit");
                return StatusCode(500, new { message = "Error completing audit", error = ex.Message });
            }
        }

        // =============================================
        // CHARGES MANAGEMENT
        // =============================================

        /// <summary>
        /// Get charges for specific audit
        /// </summary>
        [HttpGet("{auditId}/charges")]
        public async Task<ActionResult<IEnumerable<NightAuditCharges>>> GetCharges(int auditId)
        {
            try
            {
                var charges = await _context.NightAuditCharges
                    .Where(c => c.AuditId == auditId)
                    .OrderBy(c => c.PostedTime)
                    .ToListAsync();

                return Ok(charges);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting charges for audit {AuditId}", auditId);
                return StatusCode(500, new { message = "Error retrieving charges", error = ex.Message });
            }
        }

        /// <summary>
        /// Add manual charge
        /// </summary>
        [HttpPost("{auditId}/charges")]
        public async Task<ActionResult<NightAuditCharges>> AddCharge(int auditId, [FromBody] AddChargeRequest request)
        {
            try
            {
                var audit = await _context.NightAuditLogs.FindAsync(auditId);
                if (audit == null)
                {
                    return NotFound(new { message = "Audit not found" });
                }

                var charge = new NightAuditCharges
                {
                    AuditId = auditId,
                    BusinessDate = audit.BusinessDate,
                    ReservationId = request.ReservationId,
                    GuestId = request.GuestId,
                    RoomNumber = request.RoomNumber,
                    GuestName = request.GuestName,
                    ChargeType = request.ChargeType,
                    Description = request.Description,
                    Amount = request.Amount,
                    TaxAmount = request.TaxAmount,
                    ServiceCharge = request.ServiceCharge,
                    TotalAmount = request.Amount + request.TaxAmount + request.ServiceCharge,
                    DepartmentCode = request.DepartmentCode,
                    DepartmentName = request.DepartmentName,
                    PostedBy = request.PostedBy,
                    PostedTime = DateTime.Now,
                    Status = "Posted",
                    CreatedAt = DateTime.Now
                };

                _context.NightAuditCharges.Add(charge);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCharges), new { auditId }, charge);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding charge");
                return StatusCode(500, new { message = "Error adding charge", error = ex.Message });
            }
        }

        // =============================================
        // PAYMENTS MANAGEMENT
        // =============================================

        /// <summary>
        /// Get payments for specific audit
        /// </summary>
        [HttpGet("{auditId}/payments")]
        public async Task<ActionResult<IEnumerable<NightAuditPayments>>> GetPayments(int auditId)
        {
            try
            {
                var payments = await _context.NightAuditPayments
                    .Where(p => p.AuditId == auditId)
                    .OrderBy(p => p.ProcessedTime)
                    .ToListAsync();

                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payments for audit {AuditId}", auditId);
                return StatusCode(500, new { message = "Error retrieving payments", error = ex.Message });
            }
        }

        /// <summary>
        /// Add manual payment
        /// </summary>
        [HttpPost("{auditId}/payments")]
        public async Task<ActionResult<NightAuditPayments>> AddPayment(int auditId, [FromBody] AddPaymentRequest request)
        {
            try
            {
                var audit = await _context.NightAuditLogs.FindAsync(auditId);
                if (audit == null)
                {
                    return NotFound(new { message = "Audit not found" });
                }

                var payment = new NightAuditPayments
                {
                    AuditId = auditId,
                    BusinessDate = audit.BusinessDate,
                    ReservationId = request.ReservationId,
                    GuestId = request.GuestId,
                    GuestName = request.GuestName,
                    RoomNumber = request.RoomNumber,
                    PaymentMethod = request.PaymentMethod,
                    Amount = request.Amount,
                    CurrencyCode = request.CurrencyCode ?? "PKR",
                    ReferenceNumber = request.ReferenceNumber,
                    CardType = request.CardType,
                    ProcessedBy = request.ProcessedBy,
                    ProcessedTime = DateTime.Now,
                    Status = "Completed",
                    CreatedAt = DateTime.Now
                };

                _context.NightAuditPayments.Add(payment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPayments), new { auditId }, payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding payment");
                return StatusCode(500, new { message = "Error adding payment", error = ex.Message });
            }
        }

        // =============================================
        // REPORTING ENDPOINTS
        // =============================================

        /// <summary>
        /// Get revenue report for audit
        /// </summary>
        [HttpGet("{auditId}/reports/revenue")]
        public async Task<ActionResult<object>> GetRevenueReport(int auditId)
        {
            try
            {
                var charges = await _context.NightAuditCharges
                    .Where(c => c.AuditId == auditId && c.Status == "Posted")
                    .GroupBy(c => new { c.DepartmentCode, c.DepartmentName })
                    .Select(g => new
                    {
                        departmentCode = g.Key.DepartmentCode,
                        departmentName = g.Key.DepartmentName,
                        grossRevenue = g.Sum(c => c.Amount),
                        taxAmount = g.Sum(c => c.TaxAmount),
                        serviceCharge = g.Sum(c => c.ServiceCharge),
                        netRevenue = g.Sum(c => c.TotalAmount),
                        transactionCount = g.Count()
                    })
                    .ToListAsync();

                var totalRevenue = charges.Sum(c => c.netRevenue);

                var breakdown = charges.Select(c => new
                {
                    department = c.departmentName,
                    amount = c.netRevenue,
                    percentage = totalRevenue > 0 ? Math.Round((c.netRevenue / totalRevenue) * 100, 1) : 0
                }).ToList();

                var result = new
                {
                    totalRevenue = totalRevenue,
                    roomRevenue = charges.Where(c => c.departmentCode == "ROOM").Sum(c => c.netRevenue),
                    extraRevenue = charges.Where(c => c.departmentCode != "ROOM").Sum(c => c.netRevenue),
                    breakdown = breakdown,
                    details = charges
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating revenue report");
                return StatusCode(500, new { message = "Error generating revenue report", error = ex.Message });
            }
        }

        /// <summary>
        /// Get occupancy report for audit
        /// </summary>
        [HttpGet("{auditId}/reports/occupancy")]
        public async Task<ActionResult<object>> GetOccupancyReport(int auditId)
        {
            try
            {
                var roomStatuses = await _context.NightAuditRoomStatus
                    .Where(r => r.AuditId == auditId)
                    .GroupBy(r => r.RoomType)
                    .Select(g => new
                    {
                        roomType = g.Key,
                        totalRooms = g.Count(),
                        occupiedRooms = g.Count(r => r.Status == "Occupied"),
                        vacantRooms = g.Count(r => r.Status == "Vacant"),
                        oooRooms = g.Count(r => r.Status == "OOO"),
                        averageRate = g.Where(r => r.Status == "Occupied").Average(r => (double?)r.RateAmount) ?? 0,
                        roomRevenue = g.Where(r => r.Status == "Occupied").Sum(r => r.RateAmount)
                    })
                    .ToListAsync();

                var totalRooms = roomStatuses.Sum(r => r.totalRooms);
                var totalOccupied = roomStatuses.Sum(r => r.occupiedRooms);
                var occupancyPercentage = totalRooms > 0 ? Math.Round((decimal)totalOccupied / totalRooms * 100, 2) : 0;
                var totalRevenue = roomStatuses.Sum(r => r.roomRevenue);
                var adr = totalOccupied > 0 ? totalRevenue / totalOccupied : 0;
                var revpar = totalRooms > 0 ? totalRevenue / totalRooms : 0;

                var result = new
                {
                    totalRooms = totalRooms,
                    occupiedRooms = totalOccupied,
                    vacantRooms = roomStatuses.Sum(r => r.vacantRooms),
                    outOfOrderRooms = roomStatuses.Sum(r => r.oooRooms),
                    occupancyPercentage = occupancyPercentage,
                    adr = Math.Round(adr, 2),
                    revpar = Math.Round(revpar, 2),
                    roomTypes = roomStatuses.Select(r => new
                    {
                        type = r.roomType,
                        total = r.totalRooms,
                        occupied = r.occupiedRooms,
                        occupancyPercentage = r.totalRooms > 0 ? Math.Round((decimal)r.occupiedRooms / r.totalRooms * 100, 1) : 0,
                        rate = Math.Round((decimal)r.averageRate, 2),
                        revenue = r.roomRevenue
                    })
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating occupancy report");
                return StatusCode(500, new { message = "Error generating occupancy report", error = ex.Message });
            }
        }

        /// <summary>
        /// Get cashier report for audit
        /// </summary>
        [HttpGet("{auditId}/reports/cashier")]
        public async Task<ActionResult<object>> GetCashierReport(int auditId)
        {
            try
            {
                var payments = await _context.NightAuditPayments
                    .Where(p => p.AuditId == auditId && p.Status == "Completed")
                    .GroupBy(p => p.PaymentMethod)
                    .Select(g => new
                    {
                        method = g.Key,
                        amount = g.Sum(p => p.Amount),
                        transactions = g.Count(),
                        averageTransaction = g.Average(p => p.Amount)
                    })
                    .ToListAsync();

                var totalPayments = payments.Sum(p => p.amount);

                var paymentBreakdown = payments.Select(p => new
                {
                    method = p.method,
                    amount = p.amount,
                    percentage = totalPayments > 0 ? Math.Round((p.amount / totalPayments) * 100, 1) : 0,
                    transactions = p.transactions,
                    averageTransaction = Math.Round(p.averageTransaction, 2)
                }).ToList();

                var result = new
                {
                    totalPayments = totalPayments,
                    cash = payments.Where(p => p.method == "Cash").Sum(p => p.amount),
                    creditCard = payments.Where(p => p.method == "Credit Card").Sum(p => p.amount),
                    bankTransfer = payments.Where(p => p.method == "Bank Transfer").Sum(p => p.amount),
                    paymentBreakdown = paymentBreakdown
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating cashier report");
                return StatusCode(500, new { message = "Error generating cashier report", error = ex.Message });
            }
        }

        /// <summary>
        /// Get audit trail for audit
        /// </summary>
        [HttpGet("{auditId}/reports/audit-trail")]
        public async Task<ActionResult<object>> GetAuditTrail(int auditId)
        {
            try
            {
                var charges = await _context.NightAuditCharges
                    .Where(c => c.AuditId == auditId)
                    .Select(c => new
                    {
                        id = c.ChargeId,
                        time = c.PostedTime.ToString("HH:mm"),
                        action = $"{c.ChargeType} Charge Posted",
                        user = c.PostedBy,
                        details = c.Description,
                        amount = c.TotalAmount
                    })
                    .ToListAsync();

                var payments = await _context.NightAuditPayments
                    .Where(p => p.AuditId == auditId)
                    .Select(p => new
                    {
                        id = p.PaymentId + 10000, // Offset to avoid ID conflicts
                        time = p.ProcessedTime.ToString("HH:mm"),
                        action = "Payment Received",
                        user = p.ProcessedBy,
                        details = $"{p.PaymentMethod} payment for {p.GuestName}",
                        amount = p.Amount
                    })
                    .ToListAsync();

                var auditTrail = charges.Concat(payments)
                    .OrderBy(a => a.time)
                    .ToList();

                return Ok(auditTrail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating audit trail");
                return StatusCode(500, new { message = "Error generating audit trail", error = ex.Message });
            }
        }

        // =============================================
        // PRIVATE HELPER METHODS
        // =============================================

        private async Task<AuditMetrics> CalculateAuditMetrics(int auditId)
        {
            var charges = await _context.NightAuditCharges
                .Where(c => c.AuditId == auditId && c.Status == "Posted")
                .ToListAsync();

            var payments = await _context.NightAuditPayments
                .Where(p => p.AuditId == auditId && p.Status == "Completed")
                .ToListAsync();

            var roomStatuses = await _context.NightAuditRoomStatus
                .Where(r => r.AuditId == auditId)
                .ToListAsync();

            var totalCharges = charges.Sum(c => c.TotalAmount);
            var totalPayments = payments.Sum(p => p.Amount);
            var varianceAmount = totalPayments - totalCharges;

            var totalRooms = roomStatuses.Count;
            var occupiedRooms = roomStatuses.Count(r => r.Status == "Occupied");
            var occupancyPercentage = totalRooms > 0 ? Math.Round((decimal)occupiedRooms / totalRooms * 100, 2) : 0;

            var roomRevenue = charges.Where(c => c.ChargeType == "Room").Sum(c => c.TotalAmount);
            var extraRevenue = charges.Where(c => c.ChargeType != "Room").Sum(c => c.TotalAmount);

            var adr = occupiedRooms > 0 ? roomRevenue / occupiedRooms : 0;
            var revpar = totalRooms > 0 ? roomRevenue / totalRooms : 0;

            return new AuditMetrics
            {
                TotalCharges = totalCharges,
                TotalPayments = totalPayments,
                VarianceAmount = varianceAmount,
                RoomCount = totalRooms,
                OccupiedRooms = occupiedRooms,
                OccupancyPercentage = occupancyPercentage,
                ADR = Math.Round(adr, 2),
                RevPAR = Math.Round(revpar, 2),
                RoomRevenue = roomRevenue,
                ExtraRevenue = extraRevenue
            };
        }

        private async Task AutoPostDailyCharges(int auditId)
        {
            // This would typically integrate with your reservation/room management system
            // For now, we'll use the existing sample data from the database
            
            var audit = await _context.NightAuditLogs.FindAsync(auditId);
            if (audit == null) return;

            // Check if charges already posted for this audit
            var existingCharges = await _context.NightAuditCharges
                .AnyAsync(c => c.AuditId == auditId);

            if (existingCharges) return; // Already posted

            // Auto-post would happen here - for demo, we'll use existing data
            _logger.LogInformation("Auto-posting daily charges for audit {AuditId}", auditId);
        }

        private async Task GenerateRevenueSummary(int auditId)
        {
            // Generate and save revenue summary
            var charges = await _context.NightAuditCharges
                .Where(c => c.AuditId == auditId && c.Status == "Posted")
                .GroupBy(c => new { c.DepartmentCode, c.DepartmentName })
                .ToListAsync();

            foreach (var group in charges)
            {
                var summary = new NightAuditRevenueSummary
                {
                    AuditId = auditId,
                    BusinessDate = DateTime.Today,
                    DepartmentCode = group.Key.DepartmentCode ?? "OTHER",
                    DepartmentName = group.Key.DepartmentName ?? "Other",
                    GrossRevenue = group.Sum(c => c.Amount),
                    TaxAmount = group.Sum(c => c.TaxAmount),
                    ServiceCharge = group.Sum(c => c.ServiceCharge),
                    NetRevenue = group.Sum(c => c.TotalAmount),
                    TransactionCount = group.Count(),
                    CreatedAt = DateTime.Now
                };

                _context.NightAuditRevenueSummaries.Add(summary);
            }

            await _context.SaveChangesAsync();
        }
    }

    // =============================================
    // REQUEST/RESPONSE MODELS
    // =============================================

    public class StartAuditRequest
    {
        [Required]
        public string StartedBy { get; set; } = string.Empty;
    }

    public class CompleteAuditRequest
    {
        [Required]
        public int AuditId { get; set; }
        
        [Required]
        public string CompletedBy { get; set; } = string.Empty;
        
        public string? Notes { get; set; }
    }

    public class AddChargeRequest
    {
        public int? ReservationId { get; set; }
        public int? GuestId { get; set; }
        public string? RoomNumber { get; set; }
        public string? GuestName { get; set; }
        
        [Required]
        public string ChargeType { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public decimal Amount { get; set; }
        
        public decimal TaxAmount { get; set; } = 0;
        public decimal ServiceCharge { get; set; } = 0;
        public string? DepartmentCode { get; set; }
        public string? DepartmentName { get; set; }
        
        [Required]
        public string PostedBy { get; set; } = string.Empty;
    }

    public class AddPaymentRequest
    {
        public int? ReservationId { get; set; }
        public int? GuestId { get; set; }
        public string? GuestName { get; set; }
        public string? RoomNumber { get; set; }
        
        [Required]
        public string PaymentMethod { get; set; } = string.Empty;
        
        [Required]
        public decimal Amount { get; set; }
        
        public string? CurrencyCode { get; set; } = "PKR";
        public string? ReferenceNumber { get; set; }
        public string? CardType { get; set; }
        
        [Required]
        public string ProcessedBy { get; set; } = string.Empty;
    }

    public class AuditMetrics
    {
        public decimal TotalCharges { get; set; }
        public decimal TotalPayments { get; set; }
        public decimal VarianceAmount { get; set; }
        public int RoomCount { get; set; }
        public int OccupiedRooms { get; set; }
        public decimal OccupancyPercentage { get; set; }
        public decimal ADR { get; set; }
        public decimal RevPAR { get; set; }
        public decimal RoomRevenue { get; set; }
        public decimal ExtraRevenue { get; set; }
    }
}
