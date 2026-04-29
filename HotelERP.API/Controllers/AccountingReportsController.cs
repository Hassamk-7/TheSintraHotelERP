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
    public class AccountingReportsController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<AccountingReportsController> _logger;

        public AccountingReportsController(HotelDbContext context, ILogger<AccountingReportsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/AccountingReports/trial-balance
        [HttpGet("trial-balance")]
        public async Task<IActionResult> GetTrialBalance([FromQuery] DateTime? asOfDate = null)
        {
            try
            {
                var reportDate = asOfDate ?? DateTime.UtcNow;
                var accounts = await _context.ChartOfAccounts
                    .Where(a => a.IsActive && a.AllowPosting)
                    .OrderBy(a => a.AccountCode)
                    .ToListAsync();

                var trialBalanceData = new List<object>();
                decimal totalDebit = 0;
                decimal totalCredit = 0;

                foreach (var account in accounts)
                {
                    var transactions = await _context.JournalEntryLines
                        .Include(l => l.JournalEntry)
                        .Where(l => l.AccountCode == account.AccountCode &&
                                   l.JournalEntry.Status == "Posted" &&
                                   l.JournalEntry.EntryDate <= reportDate)
                        .ToListAsync();

                    var debitSum = transactions.Sum(t => t.DebitAmount);
                    var creditSum = transactions.Sum(t => t.CreditAmount);
                    var balance = debitSum - creditSum + account.OpeningBalance;

                    if (balance != 0 || debitSum != 0 || creditSum != 0)
                    {
                        var debitBalance = balance > 0 ? balance : 0;
                        var creditBalance = balance < 0 ? Math.Abs(balance) : 0;

                        trialBalanceData.Add(new
                        {
                            account.AccountCode,
                            account.AccountName,
                            account.AccountType,
                            OpeningBalance = account.OpeningBalance,
                            DebitAmount = debitSum,
                            CreditAmount = creditSum,
                            DebitBalance = debitBalance,
                            CreditBalance = creditBalance
                        });

                        totalDebit += debitBalance;
                        totalCredit += creditBalance;
                    }
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        AsOfDate = reportDate,
                        Accounts = trialBalanceData,
                        TotalDebit = totalDebit,
                        TotalCredit = totalCredit,
                        IsBalanced = Math.Abs(totalDebit - totalCredit) < 0.01m
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating trial balance");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/AccountingReports/profit-loss
        [HttpGet("profit-loss")]
        public async Task<IActionResult> GetProfitLoss(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string departmentCode = "")
        {
            try
            {
                var startDate = fromDate ?? new DateTime(DateTime.UtcNow.Year, 1, 1);
                var endDate = toDate ?? DateTime.UtcNow;

                var query = _context.JournalEntryLines
                    .Include(l => l.JournalEntry)
                    .Where(l => l.JournalEntry.Status == "Posted" &&
                               l.JournalEntry.EntryDate >= startDate &&
                               l.JournalEntry.EntryDate <= endDate);

                if (!string.IsNullOrEmpty(departmentCode))
                {
                    query = query.Where(l => l.DepartmentCode == departmentCode);
                }

                var transactions = await query.ToListAsync();

                // Revenue accounts (4000-4999)
                var revenueAccounts = await _context.ChartOfAccounts
                    .Where(a => a.IsActive && a.AccountType == "Revenue")
                    .OrderBy(a => a.AccountCode)
                    .ToListAsync();

                var revenues = new List<object>();
                decimal totalRevenue = 0;

                foreach (var account in revenueAccounts)
                {
                    var accountTransactions = transactions.Where(t => t.AccountCode == account.AccountCode);
                    var amount = accountTransactions.Sum(t => t.CreditAmount - t.DebitAmount);

                    if (amount != 0)
                    {
                        revenues.Add(new
                        {
                            account.AccountCode,
                            account.AccountName,
                            account.DepartmentCode,
                            account.DepartmentName,
                            Amount = amount
                        });
                        totalRevenue += amount;
                    }
                }

                // Expense accounts (5000-7999)
                var expenseAccounts = await _context.ChartOfAccounts
                    .Where(a => a.IsActive && a.AccountType == "Expense")
                    .OrderBy(a => a.AccountCode)
                    .ToListAsync();

                var expenses = new List<object>();
                decimal totalExpense = 0;

                foreach (var account in expenseAccounts)
                {
                    var accountTransactions = transactions.Where(t => t.AccountCode == account.AccountCode);
                    var amount = accountTransactions.Sum(t => t.DebitAmount - t.CreditAmount);

                    if (amount != 0)
                    {
                        expenses.Add(new
                        {
                            account.AccountCode,
                            account.AccountName,
                            account.DepartmentCode,
                            account.DepartmentName,
                            account.AccountCategory,
                            Amount = amount
                        });
                        totalExpense += amount;
                    }
                }

                var netProfit = totalRevenue - totalExpense;

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        FromDate = startDate,
                        ToDate = endDate,
                        DepartmentCode = departmentCode,
                        Revenue = new
                        {
                            Accounts = revenues,
                            Total = totalRevenue
                        },
                        Expenses = new
                        {
                            Accounts = expenses,
                            Total = totalExpense
                        },
                        NetProfit = netProfit,
                        NetProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating P&L report");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/AccountingReports/balance-sheet
        [HttpGet("balance-sheet")]
        public async Task<IActionResult> GetBalanceSheet([FromQuery] DateTime? asOfDate = null)
        {
            try
            {
                var reportDate = asOfDate ?? DateTime.UtcNow;

                var transactions = await _context.JournalEntryLines
                    .Include(l => l.JournalEntry)
                    .Where(l => l.JournalEntry.Status == "Posted" &&
                               l.JournalEntry.EntryDate <= reportDate)
                    .ToListAsync();

                // Assets
                var assetAccounts = await _context.ChartOfAccounts
                    .Where(a => a.IsActive && a.AccountType == "Asset" && a.AllowPosting)
                    .OrderBy(a => a.AccountCode)
                    .ToListAsync();

                var assets = new List<object>();
                decimal totalAssets = 0;

                foreach (var account in assetAccounts)
                {
                    var accountTransactions = transactions.Where(t => t.AccountCode == account.AccountCode);
                    var balance = accountTransactions.Sum(t => t.DebitAmount - t.CreditAmount) + account.OpeningBalance;

                    if (balance != 0)
                    {
                        assets.Add(new
                        {
                            account.AccountCode,
                            account.AccountName,
                            account.AccountCategory,
                            Balance = balance
                        });
                        totalAssets += balance;
                    }
                }

                // Liabilities
                var liabilityAccounts = await _context.ChartOfAccounts
                    .Where(a => a.IsActive && a.AccountType == "Liability" && a.AllowPosting)
                    .OrderBy(a => a.AccountCode)
                    .ToListAsync();

                var liabilities = new List<object>();
                decimal totalLiabilities = 0;

                foreach (var account in liabilityAccounts)
                {
                    var accountTransactions = transactions.Where(t => t.AccountCode == account.AccountCode);
                    var balance = accountTransactions.Sum(t => t.CreditAmount - t.DebitAmount) + account.OpeningBalance;

                    if (balance != 0)
                    {
                        liabilities.Add(new
                        {
                            account.AccountCode,
                            account.AccountName,
                            account.AccountCategory,
                            Balance = balance
                        });
                        totalLiabilities += balance;
                    }
                }

                // Equity
                var equityAccounts = await _context.ChartOfAccounts
                    .Where(a => a.IsActive && a.AccountType == "Equity" && a.AllowPosting)
                    .OrderBy(a => a.AccountCode)
                    .ToListAsync();

                var equity = new List<object>();
                decimal totalEquity = 0;

                foreach (var account in equityAccounts)
                {
                    var accountTransactions = transactions.Where(t => t.AccountCode == account.AccountCode);
                    var balance = accountTransactions.Sum(t => t.CreditAmount - t.DebitAmount) + account.OpeningBalance;

                    if (balance != 0)
                    {
                        equity.Add(new
                        {
                            account.AccountCode,
                            account.AccountName,
                            Balance = balance
                        });
                        totalEquity += balance;
                    }
                }

                var totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        AsOfDate = reportDate,
                        Assets = new
                        {
                            Accounts = assets,
                            Total = totalAssets
                        },
                        Liabilities = new
                        {
                            Accounts = liabilities,
                            Total = totalLiabilities
                        },
                        Equity = new
                        {
                            Accounts = equity,
                            Total = totalEquity
                        },
                        TotalLiabilitiesAndEquity = totalLiabilitiesAndEquity,
                        IsBalanced = Math.Abs(totalAssets - totalLiabilitiesAndEquity) < 0.01m
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating balance sheet");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/AccountingReports/department-pl
        [HttpGet("department-pl")]
        public async Task<IActionResult> GetDepartmentPL(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var startDate = fromDate ?? new DateTime(DateTime.UtcNow.Year, 1, 1);
                var endDate = toDate ?? DateTime.UtcNow;

                var transactions = await _context.JournalEntryLines
                    .Include(l => l.JournalEntry)
                    .Where(l => l.JournalEntry.Status == "Posted" &&
                               l.JournalEntry.EntryDate >= startDate &&
                               l.JournalEntry.EntryDate <= endDate &&
                               !string.IsNullOrEmpty(l.DepartmentCode))
                    .ToListAsync();

                var departments = transactions
                    .Select(t => new { t.DepartmentCode, t.DepartmentName })
                    .Distinct()
                    .OrderBy(d => d.DepartmentCode)
                    .ToList();

                var departmentResults = new List<object>();

                foreach (var dept in departments)
                {
                    var deptTransactions = transactions.Where(t => t.DepartmentCode == dept.DepartmentCode);

                    var revenue = deptTransactions
                        .Where(t => t.AccountCode.StartsWith("4"))
                        .Sum(t => t.CreditAmount - t.DebitAmount);

                    var expenses = deptTransactions
                        .Where(t => t.AccountCode.StartsWith("5") || t.AccountCode.StartsWith("6") || t.AccountCode.StartsWith("7"))
                        .Sum(t => t.DebitAmount - t.CreditAmount);

                    var netProfit = revenue - expenses;

                    departmentResults.Add(new
                    {
                        dept.DepartmentCode,
                        dept.DepartmentName,
                        Revenue = revenue,
                        Expenses = expenses,
                        NetProfit = netProfit,
                        ProfitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        FromDate = startDate,
                        ToDate = endDate,
                        Departments = departmentResults,
                        TotalRevenue = departmentResults.Sum(d => (decimal)((dynamic)d).Revenue),
                        TotalExpenses = departmentResults.Sum(d => (decimal)((dynamic)d).Expenses),
                        TotalNetProfit = departmentResults.Sum(d => (decimal)((dynamic)d).NetProfit)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating department P&L");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/AccountingReports/general-ledger
        [HttpGet("general-ledger")]
        public async Task<IActionResult> GetGeneralLedger(
            [FromQuery] string accountCode,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                if (string.IsNullOrEmpty(accountCode))
                {
                    return BadRequest(new { success = false, message = "Account code is required" });
                }

                var account = await _context.ChartOfAccounts
                    .FirstOrDefaultAsync(a => a.AccountCode == accountCode);

                if (account == null)
                {
                    return NotFound(new { success = false, message = "Account not found" });
                }

                var startDate = fromDate ?? new DateTime(DateTime.UtcNow.Year, 1, 1);
                var endDate = toDate ?? DateTime.UtcNow;

                var transactions = await _context.JournalEntryLines
                    .Include(l => l.JournalEntry)
                    .Where(l => l.AccountCode == accountCode &&
                               l.JournalEntry.Status == "Posted" &&
                               l.JournalEntry.EntryDate >= startDate &&
                               l.JournalEntry.EntryDate <= endDate)
                    .OrderBy(l => l.JournalEntry.EntryDate)
                    .ThenBy(l => l.JournalEntry.Id)
                    .Select(l => new
                    {
                        l.JournalEntry.EntryDate,
                        l.JournalEntry.JournalNumber,
                        l.Description,
                        l.Reference,
                        l.DebitAmount,
                        l.CreditAmount,
                        l.JournalEntry.Status
                    })
                    .ToListAsync();

                decimal runningBalance = account.OpeningBalance;
                var ledgerEntries = new List<object>();

                foreach (var txn in transactions)
                {
                    runningBalance += txn.DebitAmount - txn.CreditAmount;
                    ledgerEntries.Add(new
                    {
                        txn.EntryDate,
                        txn.JournalNumber,
                        txn.Description,
                        txn.Reference,
                        txn.DebitAmount,
                        txn.CreditAmount,
                        Balance = runningBalance
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        Account = new
                        {
                            account.AccountCode,
                            account.AccountName,
                            account.AccountType,
                            account.OpeningBalance
                        },
                        FromDate = startDate,
                        ToDate = endDate,
                        Transactions = ledgerEntries,
                        OpeningBalance = account.OpeningBalance,
                        ClosingBalance = runningBalance
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating general ledger");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/AccountingReports/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var currentMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                var nextMonth = currentMonth.AddMonths(1);

                var monthTransactions = await _context.JournalEntryLines
                    .Include(l => l.JournalEntry)
                    .Where(l => l.JournalEntry.Status == "Posted" &&
                               l.JournalEntry.EntryDate >= currentMonth &&
                               l.JournalEntry.EntryDate < nextMonth)
                    .ToListAsync();

                var monthRevenue = monthTransactions
                    .Where(t => t.AccountCode.StartsWith("4"))
                    .Sum(t => t.CreditAmount - t.DebitAmount);

                var monthExpenses = monthTransactions
                    .Where(t => t.AccountCode.StartsWith("5") || t.AccountCode.StartsWith("6") || t.AccountCode.StartsWith("7"))
                    .Sum(t => t.DebitAmount - t.CreditAmount);

                var totalAssets = await _context.JournalEntryLines
                    .Include(l => l.JournalEntry)
                    .Where(l => l.JournalEntry.Status == "Posted" && l.AccountCode.StartsWith("1"))
                    .SumAsync(t => t.DebitAmount - t.CreditAmount);

                var totalLiabilities = await _context.JournalEntryLines
                    .Include(l => l.JournalEntry)
                    .Where(l => l.JournalEntry.Status == "Posted" && l.AccountCode.StartsWith("2"))
                    .SumAsync(t => t.CreditAmount - t.DebitAmount);

                var pendingEntries = await _context.JournalEntries
                    .Where(j => j.Status == "Draft" && j.IsActive)
                    .CountAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        CurrentMonth = new
                        {
                            Revenue = monthRevenue,
                            Expenses = monthExpenses,
                            NetProfit = monthRevenue - monthExpenses
                        },
                        TotalAssets = totalAssets,
                        TotalLiabilities = totalLiabilities,
                        NetWorth = totalAssets - totalLiabilities,
                        PendingEntries = pendingEntries
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating dashboard");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
