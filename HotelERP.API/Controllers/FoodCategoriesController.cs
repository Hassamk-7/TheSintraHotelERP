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
    // [Authorize] // Temporarily disabled for testing
    public class FoodCategoriesController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<FoodCategoriesController> _logger;

        public FoodCategoriesController(HotelDbContext context, ILogger<FoodCategoriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/foodcategories
        [HttpGet]
        public async Task<IActionResult> GetFoodCategories([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "", [FromQuery] string type = "", [FromQuery] string cuisine = "")
        {
            try
            {
                var query = _context.FoodCategories.Where(f => f.IsActive);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(f => f.Name.Contains(search) || 
                                           f.Code.Contains(search) ||
                                           f.Description.Contains(search));
                }

                if (!string.IsNullOrEmpty(type))
                {
                    query = query.Where(f => f.Type == type);
                }

                if (!string.IsNullOrEmpty(cuisine))
                {
                    query = query.Where(f => f.Cuisine == cuisine);
                }

                var totalCount = await query.CountAsync();
                var foodCategories = await query
                    .OrderBy(f => f.DisplayOrder)
                    .ThenBy(f => f.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(f => new FoodCategoryDto
                    {
                        Id = f.Id,
                        Name = f.Name,
                        Code = f.Code,
                        Description = f.Description,
                        Type = f.Type,
                        IsVegetarian = f.IsVegetarian,
                        IsHalal = f.IsHalal,
                        Cuisine = f.Cuisine,
                        DisplayOrder = f.DisplayOrder,
                        ColorCode = f.ColorCode,
                        ImagePath = f.ImagePath,
                        IsActive = f.IsActive,
                        CreatedAt = f.CreatedAt,
                        UpdatedAt = f.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new { 
                    success = true, 
                    data = foodCategories, 
                    totalCount, 
                    page, 
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving food categories");
                return StatusCode(500, new { success = false, message = "Error retrieving food categories" });
            }
        }

        // GET: api/foodcategories/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFoodCategory(int id)
        {
            try
            {
                var foodCategory = await _context.FoodCategories
                    .Where(f => f.Id == id && f.IsActive)
                    .Select(f => new FoodCategoryDto
                    {
                        Id = f.Id,
                        Name = f.Name,
                        Code = f.Code,
                        Description = f.Description,
                        Type = f.Type,
                        IsVegetarian = f.IsVegetarian,
                        IsHalal = f.IsHalal,
                        Cuisine = f.Cuisine,
                        DisplayOrder = f.DisplayOrder,
                        ColorCode = f.ColorCode,
                        ImagePath = f.ImagePath,
                        IsActive = f.IsActive,
                        CreatedAt = f.CreatedAt,
                        UpdatedAt = f.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (foodCategory == null)
                {
                    return NotFound(new { success = false, message = "Food category not found" });
                }

                return Ok(new { success = true, data = foodCategory });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving food category with ID {FoodCategoryId}", id);
                return StatusCode(500, new { success = false, message = "Error retrieving food category" });
            }
        }

        // POST: api/foodcategories
        [HttpPost]
        public async Task<IActionResult> CreateFoodCategory([FromBody] CreateFoodCategoryDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });
                }

                // Check if code already exists
                var existingCategory = await _context.FoodCategories
                    .AnyAsync(f => f.Code == dto.Code && f.IsActive);

                if (existingCategory)
                {
                    return BadRequest(new { success = false, message = "Food category code already exists" });
                }

                var foodCategory = new FoodCategory
                {
                    Name = dto.Name,
                    Code = dto.Code.ToUpper(),
                    Description = dto.Description ?? "",
                    Type = dto.Type ?? "Main Course",
                    IsVegetarian = dto.IsVegetarian,
                    IsHalal = dto.IsHalal,
                    Cuisine = dto.Cuisine ?? "Pakistani",
                    DisplayOrder = dto.DisplayOrder,
                    ColorCode = dto.ColorCode ?? "#3B82F6",
                    ImagePath = dto.ImagePath ?? "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.FoodCategories.Add(foodCategory);
                await _context.SaveChangesAsync();

                var foodCategoryDto = new FoodCategoryDto
                {
                    Id = foodCategory.Id,
                    Name = foodCategory.Name,
                    Code = foodCategory.Code,
                    Description = foodCategory.Description,
                    Type = foodCategory.Type,
                    IsVegetarian = foodCategory.IsVegetarian,
                    IsHalal = foodCategory.IsHalal,
                    Cuisine = foodCategory.Cuisine,
                    DisplayOrder = foodCategory.DisplayOrder,
                    ColorCode = foodCategory.ColorCode,
                    ImagePath = foodCategory.ImagePath,
                    IsActive = foodCategory.IsActive,
                    CreatedAt = foodCategory.CreatedAt,
                    UpdatedAt = foodCategory.UpdatedAt
                };

                return CreatedAtAction(nameof(GetFoodCategory), new { id = foodCategory.Id },
                    new { success = true, data = foodCategoryDto, message = "Food category created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating food category");
                return StatusCode(500, new { success = false, message = "Error creating food category", error = ex.Message });
            }
        }

        // PUT: api/foodcategories/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFoodCategory(int id, [FromBody] UpdateFoodCategoryDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });
                }

                var foodCategory = await _context.FoodCategories.FindAsync(id);
                if (foodCategory == null || !foodCategory.IsActive)
                {
                    return NotFound(new { success = false, message = "Food category not found" });
                }

                // Check if code already exists (excluding current category)
                var existingCategory = await _context.FoodCategories
                    .AnyAsync(f => f.Code == dto.Code && f.Id != id && f.IsActive);

                if (existingCategory)
                {
                    return BadRequest(new { success = false, message = "Food category code already exists" });
                }

                // Update properties
                foodCategory.Name = dto.Name;
                foodCategory.Code = dto.Code.ToUpper();
                foodCategory.Description = dto.Description ?? "";
                foodCategory.Type = dto.Type ?? "Main Course";
                foodCategory.IsVegetarian = dto.IsVegetarian;
                foodCategory.IsHalal = dto.IsHalal;
                foodCategory.Cuisine = dto.Cuisine ?? "Pakistani";
                foodCategory.DisplayOrder = dto.DisplayOrder;
                foodCategory.ColorCode = dto.ColorCode ?? "#3B82F6";
                foodCategory.ImagePath = dto.ImagePath ?? "";
                foodCategory.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Food category updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating food category with ID {FoodCategoryId}", id);
                return StatusCode(500, new { success = false, message = "Error updating food category" });
            }
        }

        // DELETE: api/foodcategories/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFoodCategory(int id)
        {
            try
            {
                var foodCategory = await _context.FoodCategories.FindAsync(id);
                if (foodCategory == null || !foodCategory.IsActive)
                {
                    return NotFound(new { success = false, message = "Food category not found" });
                }

                // Soft delete
                foodCategory.IsActive = false;
                foodCategory.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Food category deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting food category with ID {FoodCategoryId}", id);
                return StatusCode(500, new { success = false, message = "Error deleting food category" });
            }
        }
    }
}
