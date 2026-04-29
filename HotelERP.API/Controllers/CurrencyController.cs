using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;
using System.Linq;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CurrencyController> _logger;

        public CurrencyController(HotelDbContext context, ILogger<CurrencyController> logger)
        {
            _context = context;
            _logger = logger;
        }


        // GET: api/currency
        [HttpGet]
        public async Task<IActionResult> GetCurrencies([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.Currencies.Where(c => c.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(c => c.Name.Contains(search) || 
                                           c.Code.Contains(search) ||
                                           c.Symbol.Contains(search));
                }

                var totalCount = await query.CountAsync();
                var currencies = await query
                    .OrderBy(c => c.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Code = c.Code,
                        Symbol = c.Symbol,
                        ExchangeRate = c.ExchangeRate,
                        IsBaseCurrency = c.IsBaseCurrency,
                        IsActive = c.IsActive,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { 
                    success = true, 
                    data = currencies, 
                    totalCount, 
                    page, 
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving currencies");
                return StatusCode(500, new { success = false, message = "Error retrieving currencies" });
            }
        }

        // GET: api/currency/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCurrency(int id)
        {
            try
            {
                var currency = await _context.Currencies.FindAsync(id);

                if (currency == null)
                {
                    return NotFound(new { success = false, message = "Currency not found" });
                }

                return Ok(new { 
                    success = true, 
                    data = new
                    {
                        Id = currency.Id,
                        Name = currency.Name,
                        Code = currency.Code,
                        Symbol = currency.Symbol,
                        ExchangeRate = currency.ExchangeRate,
                        IsBaseCurrency = currency.IsBaseCurrency,
                        IsActive = currency.IsActive,
                        CreatedAt = currency.CreatedAt,
                        UpdatedAt = currency.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving currency with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error retrieving currency" });
            }
        }

        // POST: api/currency/simple-test
        [HttpPost("simple-test")]
        public IActionResult SimpleTest()
        {
            _logger.LogInformation("Simple POST test called - no parameters");
            return Ok(new { success = true, message = "Simple POST test works!" });
        }

        // POST: api/currency
        [HttpPost]
        public async Task<IActionResult> CreateCurrency([FromBody] CreateCurrencyDto currencyDto)
        {
            _logger.LogInformation("POST /api/currency endpoint called");
            
            try
            {
                if (currencyDto == null)
                {
                    _logger.LogWarning("Received null currencyDto");
                    return BadRequest(new { success = false, message = "Currency data is required" });
                }

                _logger.LogInformation("Received currency data: Name={Name}, Code={Code}, Symbol={Symbol}, ExchangeRate={ExchangeRate}, IsBaseCurrency={IsBaseCurrency}", 
                    currencyDto.Name ?? "NULL", currencyDto.Code ?? "NULL", currencyDto.Symbol ?? "NULL", currencyDto.ExchangeRate, currencyDto.IsBaseCurrency);

                // Validate model state
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    _logger.LogWarning("Model validation failed: {Errors}", string.Join(", ", errors));
                    return BadRequest(new { success = false, message = "Validation failed", errors = errors });
                }

                // Check if currency code already exists
                var existingCurrency = await _context.Currencies
                    .FirstOrDefaultAsync(c => c.Code == currencyDto.Code);

                if (existingCurrency != null)
                {
                    return BadRequest(new { success = false, message = "Currency code already exists" });
                }

                var currency = new Currency
                {
                    Name = currencyDto.Name,
                    Code = currencyDto.Code,
                    Symbol = currencyDto.Symbol,
                    ExchangeRate = currencyDto.ExchangeRate,
                    IsBaseCurrency = currencyDto.IsBaseCurrency,
                    Description = currencyDto.Description,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Currencies.Add(currency);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCurrency), new { id = currency.Id }, 
                    new { success = true, message = "Currency created successfully", data = currency });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating currency: {Message}", ex.Message);
                return StatusCode(500, new { success = false, message = "Error creating currency: " + ex.Message });
            }
        }

        // PUT: api/currency/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCurrency(int id, [FromBody] UpdateCurrencyDto currencyDto)
        {
            try
            {
                var currency = await _context.Currencies.FindAsync(id);

                if (currency == null)
                {
                    return NotFound(new { success = false, message = "Currency not found" });
                }

                // Check if currency code already exists (excluding current currency)
                var existingCurrency = await _context.Currencies
                    .FirstOrDefaultAsync(c => c.Code == currencyDto.Code && c.Id != id);

                if (existingCurrency != null)
                {
                    return BadRequest(new { success = false, message = "Currency code already exists" });
                }

                currency.Name = currencyDto.Name;
                currency.Code = currencyDto.Code;
                currency.Symbol = currencyDto.Symbol;
                currency.ExchangeRate = currencyDto.ExchangeRate;
                currency.IsBaseCurrency = currencyDto.IsBaseCurrency;
                currency.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Currency updated successfully", data = currency });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating currency with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error updating currency" });
            }
        }

        // DELETE: api/currency/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCurrency(int id)
        {
            try
            {
                var currency = await _context.Currencies.FindAsync(id);

                if (currency == null)
                {
                    return NotFound(new { success = false, message = "Currency not found" });
                }

                // Prevent deletion of base currency
                if (currency.IsBaseCurrency)
                {
                    return BadRequest(new { success = false, message = "Cannot delete base currency" });
                }

                currency.IsActive = false;
                currency.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Currency deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting currency with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error deleting currency" });
            }
        }
    }
}
