using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<SuppliersController> _logger;

        public SuppliersController(HotelDbContext context, ILogger<SuppliersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/suppliers
        [HttpGet]
        public async Task<IActionResult> GetSuppliers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            try
            {
                var query = _context.Suppliers.Where(s => s.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(s => s.Name.Contains(search) || 
                                           s.ContactPerson.Contains(search) ||
                                           s.Email.Contains(search) ||
                                           s.Phone.Contains(search));
                }

                var totalCount = await query.CountAsync();
                var suppliers = await query
                    .OrderBy(s => s.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(s => new
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Code = s.Code,
                        ContactPerson = s.ContactPerson,
                        Phone = s.Phone,
                        Mobile = s.Mobile,
                        Email = s.Email,
                        Address = s.Address,
                        City = s.City,
                        Country = s.Country,
                        TaxNumber = s.TaxNumber,
                        Notes = s.Notes,
                        IsActive = s.IsActive,
                        CreatedAt = s.CreatedAt,
                        UpdatedAt = s.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { 
                    success = true, 
                    data = suppliers, 
                    totalCount, 
                    page, 
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving suppliers");
                return StatusCode(500, new { success = false, message = "Error retrieving suppliers" });
            }
        }

        // GET: api/suppliers/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSupplier(int id)
        {
            try
            {
                var supplier = await _context.Suppliers.FindAsync(id);

                if (supplier == null)
                {
                    return NotFound(new { success = false, message = "Supplier not found" });
                }

                return Ok(new { 
                    success = true, 
                    data = new
                    {
                        Id = supplier.Id,
                        Name = supplier.Name,
                        Code = supplier.Code,
                        ContactPerson = supplier.ContactPerson,
                        Phone = supplier.Phone,
                        Mobile = supplier.Mobile,
                        Email = supplier.Email,
                        Address = supplier.Address,
                        City = supplier.City,
                        Country = supplier.Country,
                        TaxNumber = supplier.TaxNumber,
                        Notes = supplier.Notes,
                        IsActive = supplier.IsActive,
                        CreatedAt = supplier.CreatedAt,
                        UpdatedAt = supplier.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving supplier with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error retrieving supplier" });
            }
        }

        // POST: api/suppliers
        [HttpPost]
        public async Task<IActionResult> CreateSupplier([FromBody] SupplierDto supplierDto)
        {
            try
            {
                var supplier = new Supplier
                {
                    Name = supplierDto.Name,
                    Code = supplierDto.Code,
                    ContactPerson = supplierDto.ContactPerson,
                    Phone = supplierDto.Phone,
                    Mobile = supplierDto.Mobile,
                    Email = supplierDto.Email,
                    Address = supplierDto.Address,
                    City = supplierDto.City,
                    Country = supplierDto.Country,
                    TaxNumber = supplierDto.TaxNumber,
                    Notes = supplierDto.Notes,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Suppliers.Add(supplier);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, 
                    new { success = true, message = "Supplier created successfully", data = supplier });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating supplier");
                return StatusCode(500, new { success = false, message = "Error creating supplier" });
            }
        }

        // PUT: api/suppliers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupplier(int id, [FromBody] SupplierDto supplierDto)
        {
            try
            {
                var supplier = await _context.Suppliers.FindAsync(id);

                if (supplier == null)
                {
                    return NotFound(new { success = false, message = "Supplier not found" });
                }

                supplier.Name = supplierDto.Name;
                supplier.Code = supplierDto.Code;
                supplier.ContactPerson = supplierDto.ContactPerson;
                supplier.Phone = supplierDto.Phone;
                supplier.Mobile = supplierDto.Mobile;
                supplier.Email = supplierDto.Email;
                supplier.Address = supplierDto.Address;
                supplier.City = supplierDto.City;
                supplier.Country = supplierDto.Country;
                supplier.TaxNumber = supplierDto.TaxNumber;
                supplier.Notes = supplierDto.Notes;
                supplier.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Supplier updated successfully", data = supplier });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating supplier with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error updating supplier" });
            }
        }

        // DELETE: api/suppliers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            try
            {
                var supplier = await _context.Suppliers.FindAsync(id);

                if (supplier == null)
                {
                    return NotFound(new { success = false, message = "Supplier not found" });
                }

                supplier.IsActive = false;
                supplier.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Supplier deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting supplier with ID: {id}");
                return StatusCode(500, new { success = false, message = "Error deleting supplier" });
            }
        }
    }
}

