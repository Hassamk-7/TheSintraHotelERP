using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VouchersController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<VouchersController> _logger;

        public VouchersController(HotelDbContext context, ILogger<VouchersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/vouchers
        [HttpGet]
        public async Task<IActionResult> GetVouchers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 100,
            [FromQuery] string? search = null,
            [FromQuery] string? status = null)
        {
            try
            {
                var query = _context.DiscountVouchers
                    .Include(v => v.RoomType)
                    .Where(v => v.IsActive)
                    .AsQueryable();

                // Search filter
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(v =>
                        v.VoucherCode.Contains(search) ||
                        v.VoucherName.Contains(search) ||
                        v.Description.Contains(search));
                }

                // Status filter
                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(v => v.Status == status);
                }

                var totalCount = await query.CountAsync();
                var vouchers = await query
                    .OrderByDescending(v => v.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(v => new
                    {
                        v.Id,
                        v.VoucherCode,
                        v.VoucherName,
                        v.Description,
                        v.RoomTypeId,
                        RoomType = v.RoomType != null ? new
                        {
                            v.RoomType.Id,
                            v.RoomType.Name,
                            v.RoomType.BasePrice
                        } : null,
                        v.StartDate,
                        v.EndDate,
                        v.DiscountAmount,
                        v.DiscountType,
                        v.DiscountPercentage,
                        v.MinimumAmount,
                        v.MaximumDiscount,
                        v.MaxUsageCount,
                        v.UsedCount,
                        v.Status,
                        v.ApprovedBy,
                        v.Terms,
                        v.IsActive,
                        v.CreatedAt,
                        v.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = vouchers,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vouchers");
                return StatusCode(500, new { success = false, message = "Error fetching vouchers", error = ex.Message });
            }
        }

        // GET: api/vouchers/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVoucher(int id)
        {
            try
            {
                var voucher = await _context.DiscountVouchers
                    .Include(v => v.RoomType)
                    .Where(v => v.Id == id && v.IsActive)
                    .Select(v => new
                    {
                        v.Id,
                        v.VoucherCode,
                        v.VoucherName,
                        v.Description,
                        v.RoomTypeId,
                        RoomType = v.RoomType != null ? new
                        {
                            v.RoomType.Id,
                            v.RoomType.Name,
                            v.RoomType.BasePrice
                        } : null,
                        v.StartDate,
                        v.EndDate,
                        v.DiscountAmount,
                        v.DiscountType,
                        v.DiscountPercentage,
                        v.MinimumAmount,
                        v.MaximumDiscount,
                        v.MaxUsageCount,
                        v.UsedCount,
                        v.Status,
                        v.ApprovedBy,
                        v.Terms,
                        v.IsActive,
                        v.CreatedAt,
                        v.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (voucher == null)
                {
                    return NotFound(new { success = false, message = "Voucher not found" });
                }

                return Ok(new { success = true, data = voucher });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching voucher {Id}", id);
                return StatusCode(500, new { success = false, message = "Error fetching voucher", error = ex.Message });
            }
        }

        // POST: api/vouchers
        [HttpPost]
        public async Task<IActionResult> CreateVoucher([FromBody] DiscountVoucher voucher)
        {
            try
            {
                // Validate room type exists
                var roomType = await _context.RoomTypes.FindAsync(voucher.RoomTypeId);
                if (roomType == null)
                {
                    return BadRequest(new { success = false, message = "Invalid room type" });
                }

                // Auto-generate voucher code
                var year = DateTime.Now.Year;
                var lastVoucher = await _context.DiscountVouchers
                    .Where(v => v.VoucherCode.StartsWith($"VOUCH-{year}-"))
                    .OrderByDescending(v => v.VoucherCode)
                    .FirstOrDefaultAsync();

                int nextNumber = 1;
                if (lastVoucher != null)
                {
                    var lastCode = lastVoucher.VoucherCode.Split('-').Last();
                    if (int.TryParse(lastCode, out int lastNumber))
                    {
                        nextNumber = lastNumber + 1;
                    }
                }

                voucher.VoucherCode = $"VOUCH-{year}-{nextNumber:D4}";
                voucher.CreatedAt = DateTime.UtcNow;
                voucher.UpdatedAt = DateTime.UtcNow;
                voucher.IsActive = true;
                voucher.UsedCount = 0;

                // Auto-set status based on dates
                var today = DateTime.Today;
                if (voucher.StartDate > today)
                {
                    voucher.Status = "Inactive";
                }
                else if (voucher.EndDate < today)
                {
                    voucher.Status = "Expired";
                }
                else
                {
                    voucher.Status = "Active";
                }

                _context.DiscountVouchers.Add(voucher);
                await _context.SaveChangesAsync();

                var createdVoucher = await _context.DiscountVouchers
                    .Include(v => v.RoomType)
                    .Where(v => v.Id == voucher.Id)
                    .Select(v => new
                    {
                        v.Id,
                        v.VoucherCode,
                        v.VoucherName,
                        v.Description,
                        v.RoomTypeId,
                        RoomType = v.RoomType != null ? new
                        {
                            v.RoomType.Id,
                            v.RoomType.Name,
                            v.RoomType.BasePrice
                        } : null,
                        v.StartDate,
                        v.EndDate,
                        v.DiscountAmount,
                        v.DiscountType,
                        v.DiscountPercentage,
                        v.MinimumAmount,
                        v.MaximumDiscount,
                        v.MaxUsageCount,
                        v.UsedCount,
                        v.Status,
                        v.ApprovedBy,
                        v.Terms,
                        v.IsActive,
                        v.CreatedAt,
                        v.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                return CreatedAtAction(nameof(GetVoucher), new { id = voucher.Id }, new { success = true, data = createdVoucher, message = "Voucher created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating voucher");
                return StatusCode(500, new { success = false, message = "Error creating voucher", error = ex.Message });
            }
        }

        // PUT: api/vouchers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVoucher(int id, [FromBody] DiscountVoucher voucher)
        {
            try
            {
                var existingVoucher = await _context.DiscountVouchers.FindAsync(id);
                if (existingVoucher == null || !existingVoucher.IsActive)
                {
                    return NotFound(new { success = false, message = "Voucher not found" });
                }

                // Validate room type exists
                var roomType = await _context.RoomTypes.FindAsync(voucher.RoomTypeId);
                if (roomType == null)
                {
                    return BadRequest(new { success = false, message = "Invalid room type" });
                }

                // Update fields (keep voucher code unchanged)
                existingVoucher.VoucherName = voucher.VoucherName;
                existingVoucher.Description = voucher.Description;
                existingVoucher.RoomTypeId = voucher.RoomTypeId;
                existingVoucher.StartDate = voucher.StartDate;
                existingVoucher.EndDate = voucher.EndDate;
                existingVoucher.DiscountAmount = voucher.DiscountAmount;
                existingVoucher.DiscountType = voucher.DiscountType;
                existingVoucher.DiscountPercentage = voucher.DiscountPercentage;
                existingVoucher.MinimumAmount = voucher.MinimumAmount;
                existingVoucher.MaximumDiscount = voucher.MaximumDiscount;
                existingVoucher.MaxUsageCount = voucher.MaxUsageCount;
                existingVoucher.ApprovedBy = voucher.ApprovedBy;
                existingVoucher.Terms = voucher.Terms;
                existingVoucher.UpdatedAt = DateTime.UtcNow;

                // Auto-update status based on dates
                var today = DateTime.Today;
                if (existingVoucher.StartDate > today)
                {
                    existingVoucher.Status = "Inactive";
                }
                else if (existingVoucher.EndDate < today)
                {
                    existingVoucher.Status = "Expired";
                }
                else
                {
                    existingVoucher.Status = "Active";
                }

                await _context.SaveChangesAsync();

                var updatedVoucher = await _context.DiscountVouchers
                    .Include(v => v.RoomType)
                    .Where(v => v.Id == id)
                    .Select(v => new
                    {
                        v.Id,
                        v.VoucherCode,
                        v.VoucherName,
                        v.Description,
                        v.RoomTypeId,
                        RoomType = v.RoomType != null ? new
                        {
                            v.RoomType.Id,
                            v.RoomType.Name,
                            v.RoomType.BasePrice
                        } : null,
                        v.StartDate,
                        v.EndDate,
                        v.DiscountAmount,
                        v.DiscountType,
                        v.DiscountPercentage,
                        v.MinimumAmount,
                        v.MaximumDiscount,
                        v.MaxUsageCount,
                        v.UsedCount,
                        v.Status,
                        v.ApprovedBy,
                        v.Terms,
                        v.IsActive,
                        v.CreatedAt,
                        v.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                return Ok(new { success = true, data = updatedVoucher, message = "Voucher updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating voucher {Id}", id);
                return StatusCode(500, new { success = false, message = "Error updating voucher", error = ex.Message });
            }
        }

        // DELETE: api/vouchers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVoucher(int id)
        {
            try
            {
                var voucher = await _context.DiscountVouchers.FindAsync(id);
                if (voucher == null || !voucher.IsActive)
                {
                    return NotFound(new { success = false, message = "Voucher not found" });
                }

                // Soft delete
                voucher.IsActive = false;
                voucher.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Voucher deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting voucher {Id}", id);
                return StatusCode(500, new { success = false, message = "Error deleting voucher", error = ex.Message });
            }
        }

        // GET: api/vouchers/room-types
        [HttpGet("room-types")]
        public async Task<IActionResult> GetRoomTypes()
        {
            try
            {
                var roomTypes = await _context.RoomTypes
                    .Where(rt => rt.IsActive)
                    .Select(rt => new
                    {
                        rt.Id,
                        rt.Name,
                        rt.BasePrice,
                        rt.Description
                    })
                    .OrderBy(rt => rt.Name)
                    .ToListAsync();

                return Ok(new { success = true, data = roomTypes });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching room types");
                return StatusCode(500, new { success = false, message = "Error fetching room types", error = ex.Message });
            }
        }
    }
}
