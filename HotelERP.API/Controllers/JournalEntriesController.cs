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
    public class JournalEntriesController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<JournalEntriesController> _logger;

        public JournalEntriesController(HotelDbContext context, ILogger<JournalEntriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/JournalEntries
        [HttpGet]
        public async Task<IActionResult> GetJournalEntries(
            [FromQuery] int page = 1,
            [FromQuery] int perPage = 50,
            [FromQuery] string search = "",
            [FromQuery] string status = "",
            [FromQuery] string entryType = "",
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var query = _context.JournalEntries
                    .Include(j => j.Lines)
                    .Where(j => j.IsActive);

                // Search filter
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(j =>
                        j.JournalNumber.Contains(search) ||
                        j.Description.Contains(search) ||
                        j.Reference.Contains(search));
                }

                // Status filter
                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(j => j.Status == status);
                }

                // Entry type filter
                if (!string.IsNullOrEmpty(entryType))
                {
                    query = query.Where(j => j.EntryType == entryType);
                }

                // Date range filter
                if (fromDate.HasValue)
                {
                    query = query.Where(j => j.EntryDate >= fromDate.Value);
                }
                if (toDate.HasValue)
                {
                    query = query.Where(j => j.EntryDate <= toDate.Value);
                }

                var totalRecords = await query.CountAsync();

                var entries = await query
                    .OrderByDescending(j => j.EntryDate)
                    .ThenByDescending(j => j.Id)
                    .Skip((page - 1) * perPage)
                    .Take(perPage)
                    .Select(j => new
                    {
                        j.Id,
                        j.JournalNumber,
                        j.EntryDate,
                        j.EntryType,
                        j.VoucherType,
                        j.Reference,
                        j.Description,
                        j.Status,
                        j.TotalDebit,
                        j.TotalCredit,
                        j.IsBalanced,
                        j.PostedDate,
                        j.PostedBy,
                        j.PreparedBy,
                        j.Source,
                        j.SourceModule,
                        LineCount = j.Lines.Count,
                        j.CreatedAt,
                        j.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = entries,
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
                _logger.LogError(ex, "Error fetching journal entries");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // GET: api/JournalEntries/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJournalEntry(int id)
        {
            try
            {
                var entry = await _context.JournalEntries
                    .Include(j => j.Lines)
                    .Where(j => j.Id == id)
                    .Select(j => new
                    {
                        j.Id,
                        j.JournalNumber,
                        j.EntryDate,
                        j.EntryType,
                        j.VoucherType,
                        j.Reference,
                        j.Description,
                        j.Status,
                        j.PostedDate,
                        j.PostedBy,
                        j.ApprovedDate,
                        j.ApprovedBy,
                        j.ReversedDate,
                        j.ReversedBy,
                        j.ReversedFromId,
                        j.FiscalYear,
                        j.Period,
                        j.Source,
                        j.SourceModule,
                        j.SourceRecordId,
                        j.PreparedBy,
                        j.Notes,
                        j.TotalDebit,
                        j.TotalCredit,
                        j.IsBalanced,
                        j.Attachment,
                        Lines = j.Lines.Select(l => new
                        {
                            l.Id,
                            l.LineNumber,
                            l.AccountCode,
                            l.AccountName,
                            l.Description,
                            l.DebitAmount,
                            l.CreditAmount,
                            l.DepartmentCode,
                            l.DepartmentName,
                            l.CostCenter,
                            l.Reference,
                            l.TaxCode,
                            l.TaxAmount,
                            l.AnalysisCode,
                            l.Notes
                        }).OrderBy(l => l.LineNumber).ToList(),
                        j.CreatedAt,
                        j.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (entry == null)
                {
                    return NotFound(new { success = false, message = "Journal entry not found" });
                }

                return Ok(new { success = true, data = entry });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching journal entry {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/JournalEntries
        [HttpPost]
        public async Task<IActionResult> CreateJournalEntry([FromBody] JournalEntryRequest request)
        {
            try
            {
                // Validate that debit equals credit
                var totalDebit = request.Lines.Sum(l => l.DebitAmount);
                var totalCredit = request.Lines.Sum(l => l.CreditAmount);

                if (Math.Abs(totalDebit - totalCredit) > 0.01m)
                {
                    return BadRequest(new { success = false, message = "Journal entry is not balanced. Debit must equal Credit." });
                }

                // Generate journal number
                var lastEntry = await _context.JournalEntries
                    .OrderByDescending(j => j.Id)
                    .FirstOrDefaultAsync();

                var nextNumber = (lastEntry?.Id ?? 0) + 1;
                var journalNumber = $"JE-{DateTime.UtcNow.Year}-{nextNumber:D6}";

                // Get current fiscal year and period
                var currentDate = request.EntryDate ?? DateTime.UtcNow;
                var fiscalYear = await _context.FiscalYears
                    .Where(f => f.IsCurrent && f.StartDate <= currentDate && f.EndDate >= currentDate)
                    .FirstOrDefaultAsync();

                var period = await _context.AccountingPeriods
                    .Where(p => p.FiscalYearId == fiscalYear.Id && p.StartDate <= currentDate && p.EndDate >= currentDate)
                    .FirstOrDefaultAsync();

                var entry = new JournalEntry
                {
                    JournalNumber = journalNumber,
                    EntryDate = currentDate,
                    EntryType = request.EntryType ?? "Manual",
                    VoucherType = request.VoucherType ?? "Journal",
                    Reference = request.Reference,
                    Description = request.Description,
                    Status = "Draft",
                    FiscalYear = fiscalYear?.FiscalYearCode,
                    Period = period?.PeriodCode,
                    Source = request.Source ?? "Manual",
                    SourceModule = request.SourceModule,
                    SourceRecordId = request.SourceRecordId,
                    PreparedBy = request.PreparedBy,
                    Notes = request.Notes,
                    TotalDebit = totalDebit,
                    TotalCredit = totalCredit,
                    IsBalanced = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.JournalEntries.Add(entry);
                await _context.SaveChangesAsync();

                // Add lines
                int lineNumber = 1;
                foreach (var lineRequest in request.Lines)
                {
                    var account = await _context.ChartOfAccounts
                        .FirstOrDefaultAsync(a => a.AccountCode == lineRequest.AccountCode);

                    if (account == null)
                    {
                        return BadRequest(new { success = false, message = $"Account code {lineRequest.AccountCode} not found" });
                    }

                    if (!account.AllowPosting)
                    {
                        return BadRequest(new { success = false, message = $"Account {lineRequest.AccountCode} does not allow posting" });
                    }

                    var line = new JournalEntryLine
                    {
                        JournalEntryId = entry.Id,
                        LineNumber = lineNumber++,
                        AccountCode = lineRequest.AccountCode,
                        AccountName = account.AccountName,
                        Description = lineRequest.Description,
                        DebitAmount = lineRequest.DebitAmount,
                        CreditAmount = lineRequest.CreditAmount,
                        DepartmentCode = lineRequest.DepartmentCode ?? account.DepartmentCode,
                        DepartmentName = lineRequest.DepartmentName ?? account.DepartmentName,
                        CostCenter = lineRequest.CostCenter,
                        Reference = lineRequest.Reference,
                        TaxCode = lineRequest.TaxCode,
                        TaxAmount = lineRequest.TaxAmount,
                        AnalysisCode = lineRequest.AnalysisCode,
                        Notes = lineRequest.Notes,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.JournalEntryLines.Add(line);
                }

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetJournalEntry), new { id = entry.Id },
                    new { success = true, data = entry, message = "Journal entry created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating journal entry");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // PUT: api/JournalEntries/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJournalEntry(int id, [FromBody] JournalEntryRequest request)
        {
            try
            {
                var entry = await _context.JournalEntries
                    .Include(j => j.Lines)
                    .FirstOrDefaultAsync(j => j.Id == id);

                if (entry == null)
                {
                    return NotFound(new { success = false, message = "Journal entry not found" });
                }

                if (entry.Status == "Posted" || entry.Status == "Approved")
                {
                    return BadRequest(new { success = false, message = "Cannot modify posted or approved journal entry" });
                }

                // Validate that debit equals credit
                var totalDebit = request.Lines.Sum(l => l.DebitAmount);
                var totalCredit = request.Lines.Sum(l => l.CreditAmount);

                if (Math.Abs(totalDebit - totalCredit) > 0.01m)
                {
                    return BadRequest(new { success = false, message = "Journal entry is not balanced. Debit must equal Credit." });
                }

                // Update header
                entry.EntryDate = request.EntryDate ?? entry.EntryDate;
                entry.EntryType = request.EntryType ?? entry.EntryType;
                entry.VoucherType = request.VoucherType ?? entry.VoucherType;
                entry.Reference = request.Reference;
                entry.Description = request.Description;
                entry.Notes = request.Notes;
                entry.TotalDebit = totalDebit;
                entry.TotalCredit = totalCredit;
                entry.IsBalanced = true;
                entry.UpdatedAt = DateTime.UtcNow;

                // Delete existing lines
                _context.JournalEntryLines.RemoveRange(entry.Lines);

                // Add new lines
                int lineNumber = 1;
                foreach (var lineRequest in request.Lines)
                {
                    var account = await _context.ChartOfAccounts
                        .FirstOrDefaultAsync(a => a.AccountCode == lineRequest.AccountCode);

                    if (account == null)
                    {
                        return BadRequest(new { success = false, message = $"Account code {lineRequest.AccountCode} not found" });
                    }

                    if (!account.AllowPosting)
                    {
                        return BadRequest(new { success = false, message = $"Account {lineRequest.AccountCode} does not allow posting" });
                    }

                    var line = new JournalEntryLine
                    {
                        JournalEntryId = entry.Id,
                        LineNumber = lineNumber++,
                        AccountCode = lineRequest.AccountCode,
                        AccountName = account.AccountName,
                        Description = lineRequest.Description,
                        DebitAmount = lineRequest.DebitAmount,
                        CreditAmount = lineRequest.CreditAmount,
                        DepartmentCode = lineRequest.DepartmentCode ?? account.DepartmentCode,
                        DepartmentName = lineRequest.DepartmentName ?? account.DepartmentName,
                        CostCenter = lineRequest.CostCenter,
                        Reference = lineRequest.Reference,
                        TaxCode = lineRequest.TaxCode,
                        TaxAmount = lineRequest.TaxAmount,
                        AnalysisCode = lineRequest.AnalysisCode,
                        Notes = lineRequest.Notes,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.JournalEntryLines.Add(line);
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = entry, message = "Journal entry updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating journal entry {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/JournalEntries/5/post
        [HttpPost("{id}/post")]
        public async Task<IActionResult> PostJournalEntry(int id, [FromBody] PostJournalRequest request)
        {
            try
            {
                var entry = await _context.JournalEntries
                    .Include(j => j.Lines)
                    .FirstOrDefaultAsync(j => j.Id == id);

                if (entry == null)
                {
                    return NotFound(new { success = false, message = "Journal entry not found" });
                }

                if (entry.Status == "Posted")
                {
                    return BadRequest(new { success = false, message = "Journal entry is already posted" });
                }

                if (!entry.IsBalanced)
                {
                    return BadRequest(new { success = false, message = "Cannot post unbalanced journal entry" });
                }

                entry.Status = "Posted";
                entry.PostedDate = DateTime.UtcNow;
                entry.PostedBy = request.PostedBy;
                entry.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Update account balances (this would be done in a background job in production)
                await UpdateAccountBalances(entry);

                return Ok(new { success = true, message = "Journal entry posted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error posting journal entry {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/JournalEntries/5/reverse
        [HttpPost("{id}/reverse")]
        public async Task<IActionResult> ReverseJournalEntry(int id, [FromBody] ReverseJournalRequest request)
        {
            try
            {
                var originalEntry = await _context.JournalEntries
                    .Include(j => j.Lines)
                    .FirstOrDefaultAsync(j => j.Id == id);

                if (originalEntry == null)
                {
                    return NotFound(new { success = false, message = "Journal entry not found" });
                }

                if (originalEntry.Status != "Posted")
                {
                    return BadRequest(new { success = false, message = "Can only reverse posted journal entries" });
                }

                // Generate reversal journal number
                var lastEntry = await _context.JournalEntries
                    .OrderByDescending(j => j.Id)
                    .FirstOrDefaultAsync();

                var nextNumber = (lastEntry?.Id ?? 0) + 1;
                var journalNumber = $"JE-{DateTime.UtcNow.Year}-{nextNumber:D6}";

                // Create reversal entry
                var reversalEntry = new JournalEntry
                {
                    JournalNumber = journalNumber,
                    EntryDate = request.ReversalDate ?? DateTime.UtcNow,
                    EntryType = "Reversal",
                    VoucherType = originalEntry.VoucherType,
                    Reference = $"Reversal of {originalEntry.JournalNumber}",
                    Description = $"Reversal: {originalEntry.Description}",
                    Status = "Posted",
                    PostedDate = DateTime.UtcNow,
                    PostedBy = request.ReversedBy,
                    FiscalYear = originalEntry.FiscalYear,
                    Period = originalEntry.Period,
                    Source = "System",
                    SourceModule = "Reversal",
                    PreparedBy = request.ReversedBy,
                    Notes = request.Reason,
                    TotalDebit = originalEntry.TotalCredit,
                    TotalCredit = originalEntry.TotalDebit,
                    IsBalanced = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.JournalEntries.Add(reversalEntry);
                await _context.SaveChangesAsync();

                // Create reversal lines (swap debit and credit)
                int lineNumber = 1;
                foreach (var originalLine in originalEntry.Lines)
                {
                    var reversalLine = new JournalEntryLine
                    {
                        JournalEntryId = reversalEntry.Id,
                        LineNumber = lineNumber++,
                        AccountCode = originalLine.AccountCode,
                        AccountName = originalLine.AccountName,
                        Description = $"Reversal: {originalLine.Description}",
                        DebitAmount = originalLine.CreditAmount,
                        CreditAmount = originalLine.DebitAmount,
                        DepartmentCode = originalLine.DepartmentCode,
                        DepartmentName = originalLine.DepartmentName,
                        CostCenter = originalLine.CostCenter,
                        Reference = originalLine.Reference,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.JournalEntryLines.Add(reversalLine);
                }

                // Mark original as reversed
                originalEntry.Status = "Reversed";
                originalEntry.ReversedDate = DateTime.UtcNow;
                originalEntry.ReversedBy = request.ReversedBy;
                originalEntry.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Update account balances
                await UpdateAccountBalances(reversalEntry);

                return Ok(new { success = true, data = reversalEntry, message = "Journal entry reversed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reversing journal entry {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/JournalEntries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJournalEntry(int id)
        {
            try
            {
                var entry = await _context.JournalEntries.FindAsync(id);
                if (entry == null)
                {
                    return NotFound(new { success = false, message = "Journal entry not found" });
                }

                if (entry.Status == "Posted" || entry.Status == "Approved")
                {
                    return BadRequest(new { success = false, message = "Cannot delete posted or approved journal entry. Please reverse instead." });
                }

                entry.IsActive = false;
                entry.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Journal entry deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting journal entry {Id}", id);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // Helper method to update account balances
        private async Task UpdateAccountBalances(JournalEntry entry)
        {
            // This is a simplified version. In production, this would be more sophisticated
            // and might be handled by a background job or stored procedure
            foreach (var line in entry.Lines)
            {
                var balance = await _context.AccountBalances
                    .FirstOrDefaultAsync(b =>
                        b.AccountCode == line.AccountCode &&
                        b.FiscalYear == entry.FiscalYear &&
                        b.Period == entry.Period);

                if (balance == null)
                {
                    balance = new AccountBalance
                    {
                        AccountCode = line.AccountCode,
                        BalanceDate = entry.EntryDate,
                        FiscalYear = entry.FiscalYear,
                        Period = entry.Period,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.AccountBalances.Add(balance);
                }

                balance.PeriodDebit += line.DebitAmount;
                balance.PeriodCredit += line.CreditAmount;
                balance.ClosingDebit = balance.OpeningDebit + balance.PeriodDebit;
                balance.ClosingCredit = balance.OpeningCredit + balance.PeriodCredit;
                balance.ClosingBalance = balance.ClosingDebit - balance.ClosingCredit;
                balance.LastUpdated = DateTime.UtcNow;
                balance.UpdatedBy = entry.PostedBy;
            }

            await _context.SaveChangesAsync();
        }
    }

    // Request DTOs
    public class JournalEntryRequest
    {
        public DateTime? EntryDate { get; set; }
        public string EntryType { get; set; }
        public string VoucherType { get; set; }
        public string Reference { get; set; }
        public string Description { get; set; }
        public string Source { get; set; }
        public string SourceModule { get; set; }
        public int? SourceRecordId { get; set; }
        public string PreparedBy { get; set; }
        public string Notes { get; set; }
        public List<JournalEntryLineRequest> Lines { get; set; }
    }

    public class JournalEntryLineRequest
    {
        public string AccountCode { get; set; }
        public string Description { get; set; }
        public decimal DebitAmount { get; set; }
        public decimal CreditAmount { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentName { get; set; }
        public string CostCenter { get; set; }
        public string Reference { get; set; }
        public string TaxCode { get; set; }
        public decimal TaxAmount { get; set; }
        public string AnalysisCode { get; set; }
        public string Notes { get; set; }
    }

    public class PostJournalRequest
    {
        public string PostedBy { get; set; }
    }

    public class ReverseJournalRequest
    {
        public DateTime? ReversalDate { get; set; }
        public string ReversedBy { get; set; }
        public string Reason { get; set; }
    }
}
