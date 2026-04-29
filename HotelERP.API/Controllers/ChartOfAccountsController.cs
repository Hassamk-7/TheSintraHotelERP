using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ChartOfAccountsController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<ChartOfAccountsController> _logger;

        public ChartOfAccountsController(HotelDbContext context, ILogger<ChartOfAccountsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/ChartOfAccounts
        [HttpGet]
        public async Task<IActionResult> GetChartOfAccounts(
            [FromQuery] int page = 1,
            [FromQuery] int perPage = 50,
            [FromQuery] string search = "",
            [FromQuery] string accountType = "",
            [FromQuery] string departmentCode = "",
            [FromQuery] bool? allowPosting = null)
        {
            try
            {
                var query = _context.ChartOfAccounts.Where(a => a.IsActive);

                // Search filter
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(a =>
                        a.AccountCode.Contains(search) ||
                        a.AccountName.Contains(search) ||
                        a.Description.Contains(search));
                }

                // Account type filter
                if (!string.IsNullOrEmpty(accountType))
                {
                    query = query.Where(a => a.AccountType == accountType);
                }

                // Department filter
                if (!string.IsNullOrEmpty(departmentCode))
                {
                    query = query.Where(a => a.DepartmentCode == departmentCode);
                }

                // Allow posting filter
                if (allowPosting.HasValue)
                {
                    query = query.Where(a => a.AllowPosting == allowPosting.Value);
                }

                var totalRecords = await query.CountAsync();

                var accounts = await query
                    .OrderBy(a => a.DisplayOrder)
                    .ThenBy(a => a.AccountCode)
                    .Skip((page - 1) * perPage)
                    .Take(perPage)
                    .Select(a => new
                    {
                        a.Id,
                        a.AccountCode,
                        a.AccountName,
                        a.AccountType,
                        a.AccountCategory,
                        a.AccountSubCategory,
                        a.DepartmentCode,
                        a.DepartmentName,
                        a.ParentAccountCode,
                        a.Level,
                        a.IsGroup,
                        a.AllowPosting,
                        a.OpeningBalance,
                        a.BalanceType,
                        a.IsSystemAccount,
                        a.Description,
                        a.IsTaxable,
                        a.IsReconcilable,
                        a.DisplayOrder,
                        a.IsActive,
                        a.CreatedAt,
                        a.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = accounts,
                    pagination = new
                    {
                        page,
                        perPage,
                        totalRecords,
                        totalPages = (int)Math.Ceiling(totalRecords / (double)perPage)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching chart of accounts");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/ChartOfAccounts/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChartOfAccount(int id)
        {
            try
            {
                var account = await _context.ChartOfAccounts
                    .Where(a => a.Id == id)
                    .Select(a => new
                    {
                        a.Id,
                        a.AccountCode,
                        a.AccountName,
                        a.AccountType,
                        a.AccountCategory,
                        a.AccountSubCategory,
                        a.DepartmentCode,
                        a.DepartmentName,
                        a.PropertyCode,
                        a.PropertyName,
                        a.CompanyCode,
                        a.ParentAccountCode,
                        a.Level,
                        a.IsGroup,
                        a.AllowPosting,
                        a.OpeningBalance,
                        a.BalanceType,
                        a.IsSystemAccount,
                        a.Description,
                        a.TaxCode,
                        a.IsTaxable,
                        a.CurrencyCode,
                        a.IsReconcilable,
                        a.CostCenter,
                        a.DisplayOrder,
                        a.Notes,
                        a.IsActive,
                        a.CreatedAt,
                        a.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (account == null)
                {
                    return NotFound(new { success = false, message = "Account not found" });
                }

                return Ok(new { success = true, data = account });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching account {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/ChartOfAccounts/hierarchy
        [HttpGet("hierarchy")]
        public async Task<IActionResult> GetAccountHierarchy([FromQuery] string accountType = "")
        {
            try
            {
                var query = _context.ChartOfAccounts.Where(a => a.IsActive);

                if (!string.IsNullOrEmpty(accountType))
                {
                    query = query.Where(a => a.AccountType == accountType);
                }

                var accounts = await query
                    .OrderBy(a => a.DisplayOrder)
                    .ThenBy(a => a.AccountCode)
                    .Select(a => new
                    {
                        a.Id,
                        a.AccountCode,
                        a.AccountName,
                        a.AccountType,
                        a.ParentAccountCode,
                        a.Level,
                        a.IsGroup,
                        a.AllowPosting,
                        a.BalanceType,
                        a.DepartmentCode,
                        a.DepartmentName
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = accounts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching account hierarchy");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/ChartOfAccounts/posting-accounts
        [HttpGet("posting-accounts")]
        public async Task<IActionResult> GetPostingAccounts()
        {
            try
            {
                var accounts = await _context.ChartOfAccounts
                    .Where(a => a.IsActive && a.AllowPosting)
                    .OrderBy(a => a.AccountCode)
                    .Select(a => new
                    {
                        a.Id,
                        a.AccountCode,
                        a.AccountName,
                        a.AccountType,
                        a.BalanceType,
                        a.DepartmentCode,
                        a.DepartmentName
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = accounts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching posting accounts");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/ChartOfAccounts
        [HttpPost]
        public async Task<IActionResult> CreateChartOfAccount([FromBody] ChartOfAccountRequest request)
        {
            try
            {
                // Check if account code already exists
                if (await _context.ChartOfAccounts.AnyAsync(a => a.AccountCode == request.AccountCode))
                {
                    return BadRequest(new { success = false, message = "Account code already exists" });
                }

                var account = new ChartOfAccount
                {
                    AccountCode = request.AccountCode,
                    AccountName = request.AccountName,
                    AccountType = request.AccountType,
                    AccountCategory = request.AccountCategory,
                    AccountSubCategory = request.AccountSubCategory,
                    DepartmentCode = request.DepartmentCode,
                    DepartmentName = request.DepartmentName,
                    PropertyCode = request.PropertyCode,
                    PropertyName = request.PropertyName,
                    CompanyCode = request.CompanyCode,
                    ParentAccountCode = request.ParentAccountCode,
                    Level = request.Level,
                    IsGroup = request.IsGroup,
                    AllowPosting = request.AllowPosting,
                    OpeningBalance = request.OpeningBalance,
                    BalanceType = request.BalanceType,
                    IsSystemAccount = false,
                    Description = request.Description,
                    TaxCode = request.TaxCode,
                    IsTaxable = request.IsTaxable,
                    CurrencyCode = request.CurrencyCode ?? "PKR",
                    IsReconcilable = request.IsReconcilable,
                    CostCenter = request.CostCenter,
                    DisplayOrder = request.DisplayOrder,
                    Notes = request.Notes,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ChartOfAccounts.Add(account);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetChartOfAccount), new { id = account.Id },
                    new { success = true, data = account, message = "Account created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating account");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // PUT: api/ChartOfAccounts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChartOfAccount(int id, [FromBody] ChartOfAccountRequest request)
        {
            try
            {
                var account = await _context.ChartOfAccounts.FindAsync(id);
                if (account == null)
                {
                    return NotFound(new { success = false, message = "Account not found" });
                }

                // Check if trying to modify system account
                if (account.IsSystemAccount && request.AccountCode != account.AccountCode)
                {
                    return BadRequest(new { success = false, message = "Cannot modify system account code" });
                }

                // Check if new account code already exists
                if (request.AccountCode != account.AccountCode &&
                    await _context.ChartOfAccounts.AnyAsync(a => a.AccountCode == request.AccountCode))
                {
                    return BadRequest(new { success = false, message = "Account code already exists" });
                }

                account.AccountCode = request.AccountCode;
                account.AccountName = request.AccountName;
                account.AccountType = request.AccountType;
                account.AccountCategory = request.AccountCategory;
                account.AccountSubCategory = request.AccountSubCategory;
                account.DepartmentCode = request.DepartmentCode;
                account.DepartmentName = request.DepartmentName;
                account.PropertyCode = request.PropertyCode;
                account.PropertyName = request.PropertyName;
                account.CompanyCode = request.CompanyCode;
                account.ParentAccountCode = request.ParentAccountCode;
                account.Level = request.Level;
                account.IsGroup = request.IsGroup;
                account.AllowPosting = request.AllowPosting;
                account.OpeningBalance = request.OpeningBalance;
                account.BalanceType = request.BalanceType;
                account.Description = request.Description;
                account.TaxCode = request.TaxCode;
                account.IsTaxable = request.IsTaxable;
                account.CurrencyCode = request.CurrencyCode ?? "PKR";
                account.IsReconcilable = request.IsReconcilable;
                account.CostCenter = request.CostCenter;
                account.DisplayOrder = request.DisplayOrder;
                account.Notes = request.Notes;
                account.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = account, message = "Account updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating account {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/ChartOfAccounts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChartOfAccount(int id)
        {
            try
            {
                var account = await _context.ChartOfAccounts.FindAsync(id);
                if (account == null)
                {
                    return NotFound(new { success = false, message = "Account not found" });
                }

                if (account.IsSystemAccount)
                {
                    return BadRequest(new { success = false, message = "Cannot delete system account" });
                }

                // Check if account has transactions
                var hasTransactions = await _context.JournalEntryLines
                    .AnyAsync(l => l.AccountCode == account.AccountCode);

                if (hasTransactions)
                {
                    return BadRequest(new { success = false, message = "Cannot delete account with transactions. Please deactivate instead." });
                }

                account.IsActive = false;
                account.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Account deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting account {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/ChartOfAccounts/seed
        [HttpPost("seed")]
        public async Task<IActionResult> SeedChartOfAccounts()
        {
            try
            {
                ChartOfAccountsSeedData.SeedChartOfAccounts(_context);
                ChartOfAccountsSeedData.SeedPMSAccountMappings(_context);
                ChartOfAccountsSeedData.SeedFiscalYear(_context);

                return Ok(new { success = true, message = "Chart of Accounts seeded successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding chart of accounts");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    // Request DTO
    public class ChartOfAccountRequest
    {
        public string AccountCode { get; set; }
        public string AccountName { get; set; }
        public string AccountType { get; set; }
        public string AccountCategory { get; set; }
        public string AccountSubCategory { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentName { get; set; }
        public string PropertyCode { get; set; }
        public string PropertyName { get; set; }
        public string CompanyCode { get; set; }
        public string ParentAccountCode { get; set; }
        public int Level { get; set; }
        public bool IsGroup { get; set; }
        public bool AllowPosting { get; set; }
        public decimal OpeningBalance { get; set; }
        public string BalanceType { get; set; }
        public string Description { get; set; }
        public string TaxCode { get; set; }
        public bool IsTaxable { get; set; }
        public string CurrencyCode { get; set; }
        public bool IsReconcilable { get; set; }
        public string CostCenter { get; set; }
        public int DisplayOrder { get; set; }
        public string Notes { get; set; }
    }
}
