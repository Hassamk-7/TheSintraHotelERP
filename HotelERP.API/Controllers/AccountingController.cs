using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AccountingController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<AccountingController> _logger;

        public AccountingController(HotelDbContext context, ILogger<AccountingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GUEST ACCOUNT ENDPOINTS
        [HttpGet("guest-accounts")]
        public async Task<IActionResult> GetGuestAccounts([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? guestId = null, [FromQuery] string transactionType = "")
        {
            try
            {
                var query = _context.GuestAccounts.Include(g => g.Guest).Include(g => g.CheckIn).Where(g => g.IsActive);
                
                if (guestId.HasValue)
                    query = query.Where(g => g.GuestId == guestId.Value);
                
                if (!string.IsNullOrEmpty(transactionType))
                    query = query.Where(g => g.TransactionType == transactionType);

                var totalCount = await query.CountAsync();
                var accounts = await query
                    .OrderByDescending(g => g.TransactionDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = accounts, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving guest accounts");
                return StatusCode(500, new { success = false, message = "Error retrieving guest accounts" });
            }
        }

        [HttpPost("guest-accounts")]
        public async Task<IActionResult> CreateGuestAccount([FromBody] GuestAccount account)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                account.AccountNumber = $"GA{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                account.TransactionDate = DateTime.UtcNow;
                
                // Calculate balance based on transaction type
                var previousBalance = await _context.GuestAccounts
                    .Where(g => g.GuestId == account.GuestId && g.IsActive)
                    .OrderByDescending(g => g.TransactionDate)
                    .Select(g => g.Balance)
                    .FirstOrDefaultAsync();

                switch (account.TransactionType?.ToLower())
                {
                    case "charge":
                        account.Balance = previousBalance + account.DebitAmount;
                        break;
                    case "payment":
                        account.Balance = previousBalance - account.CreditAmount;
                        break;
                    case "refund":
                        account.Balance = previousBalance - account.CreditAmount;
                        break;
                    case "adjustment":
                        account.Balance = previousBalance + account.DebitAmount - account.CreditAmount;
                        break;
                    default:
                        account.Balance = previousBalance + account.DebitAmount - account.CreditAmount;
                        break;
                }

                account.IsActive = true;
                account.CreatedAt = DateTime.UtcNow;
                account.UpdatedAt = DateTime.UtcNow;

                _context.GuestAccounts.Add(account);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = account, message = "Guest account transaction created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating guest account");
                return StatusCode(500, new { success = false, message = "Error creating guest account" });
            }
        }

        [HttpGet("guest-accounts/balance/{guestId}")]
        public async Task<IActionResult> GetGuestBalance(int guestId)
        {
            try
            {
                var balance = await _context.GuestAccounts
                    .Where(g => g.GuestId == guestId && g.IsActive)
                    .OrderByDescending(g => g.TransactionDate)
                    .Select(g => g.Balance)
                    .FirstOrDefaultAsync();

                return Ok(new { success = true, data = new { guestId, balance } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving guest balance");
                return StatusCode(500, new { success = false, message = "Error retrieving guest balance" });
            }
        }

        // PAYMENT ENDPOINTS
        [HttpGet("payments")]
        public async Task<IActionResult> GetPayments([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string paymentMethod = "", [FromQuery] string status = "", [FromQuery] int? guestId = null)
        {
            try
            {
                var query = _context.Payments.Include(p => p.Guest).Include(p => p.CheckIn).Where(p => p.IsActive);
                
                if (!string.IsNullOrEmpty(paymentMethod))
                    query = query.Where(p => p.PaymentMethod == paymentMethod);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(p => p.Status == status);
                
                if (guestId.HasValue)
                    query = query.Where(p => p.GuestId == guestId.Value);

                var totalCount = await query.CountAsync();
                var payments = await query
                    .OrderByDescending(p => p.PaymentDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = payments, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving payments");
                return StatusCode(500, new { success = false, message = "Error retrieving payments" });
            }
        }

        [HttpPost("payments")]
        public async Task<IActionResult> CreatePayment([FromBody] Payment payment)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                payment.PaymentNumber = $"PAY{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                payment.PaymentDate = DateTime.UtcNow;
                payment.Status = payment.Status ?? "Pending";
                payment.IsActive = true;
                payment.CreatedAt = DateTime.UtcNow;
                payment.UpdatedAt = DateTime.UtcNow;

                _context.Payments.Add(payment);

                // Create corresponding guest account entry
                var guestAccount = new GuestAccount
                {
                    AccountNumber = $"GA{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}",
                    GuestId = payment.GuestId,
                    CheckInId = payment.CheckInId,
                    TransactionDate = DateTime.UtcNow,
                    Description = $"Payment - {payment.PaymentMethod}",
                    TransactionType = "Payment",
                    CreditAmount = payment.Amount,
                    Reference = payment.PaymentNumber,
                    PostedBy = payment.ReceivedBy,
                    Remarks = payment.Remarks,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Calculate balance
                var previousBalance = await _context.GuestAccounts
                    .Where(g => g.GuestId == payment.GuestId && g.IsActive)
                    .OrderByDescending(g => g.TransactionDate)
                    .Select(g => g.Balance)
                    .FirstOrDefaultAsync();

                guestAccount.Balance = previousBalance - payment.Amount;

                _context.GuestAccounts.Add(guestAccount);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = payment, message = "Payment recorded successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment");
                return StatusCode(500, new { success = false, message = "Error creating payment" });
            }
        }

        // VOUCHER ENDPOINTS
        [HttpGet("vouchers")]
        public async Task<IActionResult> GetVouchers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string voucherType = "", [FromQuery] string status = "")
        {
            try
            {
                var query = _context.Vouchers.Where(v => v.IsActive);
                
                if (!string.IsNullOrEmpty(voucherType))
                    query = query.Where(v => v.VoucherType == voucherType);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(v => v.Status == status);

                var totalCount = await query.CountAsync();
                var vouchers = await query
                    .OrderByDescending(v => v.VoucherDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = vouchers, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving vouchers");
                return StatusCode(500, new { success = false, message = "Error retrieving vouchers" });
            }
        }

        [HttpPost("vouchers")]
        public async Task<IActionResult> CreateVoucher([FromBody] Voucher voucher)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                voucher.VoucherNumber = $"VOU{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                voucher.VoucherDate = DateTime.UtcNow;
                voucher.Status = "Draft";
                voucher.IsActive = true;
                voucher.CreatedAt = DateTime.UtcNow;
                voucher.UpdatedAt = DateTime.UtcNow;

                _context.Vouchers.Add(voucher);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = voucher, message = "Voucher created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating voucher");
                return StatusCode(500, new { success = false, message = "Error creating voucher" });
            }
        }

        [HttpPut("vouchers/{id}/approve")]
        public async Task<IActionResult> ApproveVoucher(int id, [FromBody] string approvedBy)
        {
            try
            {
                var voucher = await _context.Vouchers.FindAsync(id);
                if (voucher == null || !voucher.IsActive)
                    return NotFound(new { success = false, message = "Voucher not found" });

                voucher.Status = "Posted";
                voucher.ApprovedBy = approvedBy;
                voucher.ApprovalDate = DateTime.UtcNow;
                voucher.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Voucher approved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving voucher");
                return StatusCode(500, new { success = false, message = "Error approving voucher" });
            }
        }

        // DAYBOOK ENDPOINTS
        [HttpGet("daybook")]
        public async Task<IActionResult> GetDayBook([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] DateTime? date = null, [FromQuery] string transactionType = "")
        {
            try
            {
                var query = _context.DayBooks.Where(d => d.IsActive);
                
                if (date.HasValue)
                    query = query.Where(d => d.TransactionDate.Date == date.Value.Date);
                
                if (!string.IsNullOrEmpty(transactionType))
                    query = query.Where(d => d.TransactionType == transactionType);

                var totalCount = await query.CountAsync();
                var daybook = await query
                    .OrderByDescending(d => d.TransactionDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = daybook, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving daybook");
                return StatusCode(500, new { success = false, message = "Error retrieving daybook" });
            }
        }

        [HttpPost("daybook")]
        public async Task<IActionResult> CreateDayBookEntry([FromBody] DayBook entry)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                entry.TransactionDate = DateTime.UtcNow;
                entry.IsActive = true;
                entry.CreatedAt = DateTime.UtcNow;
                entry.UpdatedAt = DateTime.UtcNow;

                _context.DayBooks.Add(entry);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = entry, message = "Daybook entry created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating daybook entry");
                return StatusCode(500, new { success = false, message = "Error creating daybook entry" });
            }
        }

        // SUPPLIER LEDGER ENDPOINTS
        [HttpGet("supplier-ledger")]
        public async Task<IActionResult> GetSupplierLedger([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? supplierId = null, [FromQuery] string transactionType = "")
        {
            try
            {
                var query = _context.SupplierLedgers.Include(s => s.Supplier).Where(s => s.IsActive);
                
                if (supplierId.HasValue)
                    query = query.Where(s => s.SupplierId == supplierId.Value);
                
                if (!string.IsNullOrEmpty(transactionType))
                    query = query.Where(s => s.TransactionType == transactionType);

                var totalCount = await query.CountAsync();
                var ledger = await query
                    .OrderByDescending(s => s.TransactionDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = ledger, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving supplier ledger");
                return StatusCode(500, new { success = false, message = "Error retrieving supplier ledger" });
            }
        }

        [HttpPost("supplier-ledger")]
        public async Task<IActionResult> CreateSupplierLedgerEntry([FromBody] SupplierLedger entry)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Calculate balance
                var previousBalance = await _context.SupplierLedgers
                    .Where(s => s.SupplierId == entry.SupplierId && s.IsActive)
                    .OrderByDescending(s => s.TransactionDate)
                    .Select(s => s.Balance)
                    .FirstOrDefaultAsync();

                entry.Balance = previousBalance + entry.DebitAmount - entry.CreditAmount;
                entry.TransactionDate = DateTime.UtcNow;
                entry.IsActive = true;
                entry.CreatedAt = DateTime.UtcNow;
                entry.UpdatedAt = DateTime.UtcNow;

                _context.SupplierLedgers.Add(entry);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = entry, message = "Supplier ledger entry created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating supplier ledger entry");
                return StatusCode(500, new { success = false, message = "Error creating supplier ledger entry" });
            }
        }

        // GENERAL LEDGER ENDPOINTS
        [HttpGet("general-ledger")]
        public async Task<IActionResult> GetGeneralLedger([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string accountCode = "", [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var query = _context.GeneralLedgers.Where(g => g.IsActive);
                
                if (!string.IsNullOrEmpty(accountCode))
                    query = query.Where(g => g.AccountCode == accountCode);
                
                if (fromDate.HasValue)
                    query = query.Where(g => g.TransactionDate >= fromDate.Value);
                
                if (toDate.HasValue)
                    query = query.Where(g => g.TransactionDate <= toDate.Value);

                var totalCount = await query.CountAsync();
                var ledger = await query
                    .OrderBy(g => g.AccountCode)
                    .ThenByDescending(g => g.TransactionDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = ledger, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving general ledger");
                return StatusCode(500, new { success = false, message = "Error retrieving general ledger" });
            }
        }

        [HttpPost("general-ledger")]
        public async Task<IActionResult> CreateGeneralLedgerEntry([FromBody] GeneralLedger entry)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Calculate balance
                var previousBalance = await _context.GeneralLedgers
                    .Where(g => g.AccountCode == entry.AccountCode && g.IsActive)
                    .OrderByDescending(g => g.TransactionDate)
                    .Select(g => g.Balance)
                    .FirstOrDefaultAsync();

                entry.Balance = previousBalance + entry.DebitAmount - entry.CreditAmount;
                entry.TransactionDate = DateTime.UtcNow;
                entry.IsActive = true;
                entry.CreatedAt = DateTime.UtcNow;
                entry.UpdatedAt = DateTime.UtcNow;

                _context.GeneralLedgers.Add(entry);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = entry, message = "General ledger entry created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating general ledger entry");
                return StatusCode(500, new { success = false, message = "Error creating general ledger entry" });
            }
        }

        // TRIAL BALANCE ENDPOINTS
        [HttpGet("trial-balance")]
        public async Task<IActionResult> GetTrialBalance([FromQuery] DateTime? balanceDate = null)
        {
            try
            {
                var query = _context.TrialBalances.Where(t => t.IsActive);
                
                if (balanceDate.HasValue)
                    query = query.Where(t => t.BalanceDate.Date == balanceDate.Value.Date);
                else
                    query = query.Where(t => t.BalanceDate.Date == DateTime.Today);

                var trialBalance = await query
                    .OrderBy(t => t.AccountType)
                    .ThenBy(t => t.AccountCode)
                    .ToListAsync();

                var summary = new
                {
                    TotalDebits = trialBalance.Sum(t => t.DebitAmount),
                    TotalCredits = trialBalance.Sum(t => t.CreditAmount),
                    IsBalanced = trialBalance.Sum(t => t.DebitAmount) == trialBalance.Sum(t => t.CreditAmount)
                };

                return Ok(new { success = true, data = trialBalance, summary });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving trial balance");
                return StatusCode(500, new { success = false, message = "Error retrieving trial balance" });
            }
        }

        [HttpPost("trial-balance/generate")]
        public async Task<IActionResult> GenerateTrialBalance([FromBody] DateTime balanceDate)
        {
            try
            {
                // This would typically involve complex calculations from all ledger accounts
                // For now, we'll create a simple entry
                var trialBalance = new TrialBalance
                {
                    BalanceDate = balanceDate,
                    AccountCode = "SAMPLE",
                    AccountName = "Sample Account",
                    AccountType = "Asset",
                    OpeningBalance = 0,
                    DebitAmount = 0,
                    CreditAmount = 0,
                    ClosingBalance = 0,
                    PreparedBy = "System",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.TrialBalances.Add(trialBalance);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Trial balance generated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating trial balance");
                return StatusCode(500, new { success = false, message = "Error generating trial balance" });
            }
        }

        // STOCK ACCOUNTING ENDPOINTS
        [HttpGet("stock-accounting")]
        public async Task<IActionResult> GetStockAccounting([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? itemId = null, [FromQuery] string transactionType = "")
        {
            try
            {
                var query = _context.StockAccountings.Include(s => s.Item).Where(s => s.IsActive);
                
                if (itemId.HasValue)
                    query = query.Where(s => s.ItemId == itemId.Value);
                
                if (!string.IsNullOrEmpty(transactionType))
                    query = query.Where(s => s.TransactionType == transactionType);

                var totalCount = await query.CountAsync();
                var stockAccounting = await query
                    .OrderByDescending(s => s.TransactionDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = stockAccounting, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving stock accounting");
                return StatusCode(500, new { success = false, message = "Error retrieving stock accounting" });
            }
        }

        [HttpPost("stock-accounting")]
        public async Task<IActionResult> CreateStockAccountingEntry([FromBody] StockAccounting entry)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                entry.TotalValue = entry.Quantity * entry.UnitPrice;
                entry.TransactionDate = DateTime.UtcNow;
                
                // Calculate stock balance and value
                var previousEntry = await _context.StockAccountings
                    .Where(s => s.ItemId == entry.ItemId && s.IsActive)
                    .OrderByDescending(s => s.TransactionDate)
                    .FirstOrDefaultAsync();

                if (previousEntry != null)
                {
                    switch (entry.TransactionType?.ToLower())
                    {
                        case "purchase":
                            entry.StockBalance = previousEntry.StockBalance + entry.Quantity;
                            break;
                        case "issue":
                            entry.StockBalance = previousEntry.StockBalance - entry.Quantity;
                            break;
                        case "return":
                            entry.StockBalance = previousEntry.StockBalance + entry.Quantity;
                            break;
                        case "adjustment":
                            entry.StockBalance = entry.Quantity; // Direct adjustment
                            break;
                        default:
                            entry.StockBalance = previousEntry.StockBalance;
                            break;
                    }
                }
                else
                {
                    entry.StockBalance = entry.Quantity;
                }

                entry.StockValue = entry.StockBalance * entry.UnitPrice;
                entry.IsActive = true;
                entry.CreatedAt = DateTime.UtcNow;
                entry.UpdatedAt = DateTime.UtcNow;

                _context.StockAccountings.Add(entry);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = entry, message = "Stock accounting entry created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating stock accounting entry");
                return StatusCode(500, new { success = false, message = "Error creating stock accounting entry" });
            }
        }

        // ACCOUNTING DASHBOARD SUMMARY
        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetAccountingDashboardSummary()
        {
            try
            {
                var today = DateTime.Today;
                var thisMonth = new DateTime(today.Year, today.Month, 1);

                var summary = new
                {
                    TotalRevenue = await _context.GuestAccounts.Where(g => g.TransactionType == "Charge" && g.TransactionDate >= thisMonth && g.IsActive).SumAsync(g => g.DebitAmount),
                    TotalPayments = await _context.Payments.Where(p => p.PaymentDate >= thisMonth && p.IsActive).SumAsync(p => p.Amount),
                    OutstandingBalance = await _context.GuestAccounts.Where(g => g.IsActive).SumAsync(g => g.Balance),
                    TodayRevenue = await _context.GuestAccounts.Where(g => g.TransactionType == "Charge" && g.TransactionDate.Date == today && g.IsActive).SumAsync(g => g.DebitAmount),
                    TodayPayments = await _context.Payments.Where(p => p.PaymentDate.Date == today && p.IsActive).SumAsync(p => p.Amount),
                    PendingVouchers = await _context.Vouchers.CountAsync(v => v.Status == "Draft" && v.IsActive),
                    TotalSupplierBalance = await _context.SupplierLedgers.Where(s => s.IsActive).SumAsync(s => s.Balance),
                    MonthlyExpenses = await _context.SupplierLedgers.Where(s => s.TransactionType == "Purchase" && s.TransactionDate >= thisMonth && s.IsActive).SumAsync(s => s.DebitAmount)
                };

                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving accounting dashboard summary");
                return StatusCode(500, new { success = false, message = "Error retrieving accounting dashboard summary" });
            }
        }
    }
}
