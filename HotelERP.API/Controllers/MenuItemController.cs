using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public MenuItemController(HotelDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/MenuItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems()
        {
            return await _context.MenuItems
                .Include(m => m.Restaurant)
                .Where(m => m.IsActive)
                .OrderBy(m => m.DisplayOrder)
                .ToListAsync();
        }

        // GET: api/MenuItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItem>> GetMenuItem(int id)
        {
            var menuItem = await _context.MenuItems
                .Include(m => m.Restaurant)
                .FirstOrDefaultAsync(m => m.MenuItemID == id);

            if (menuItem == null)
            {
                return NotFound();
            }

            return menuItem;
        }

        // GET: api/MenuItem/ByRestaurant/1
        [HttpGet("ByRestaurant/{restaurantId}")]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItemsByRestaurant(int restaurantId)
        {
            return await _context.MenuItems
                .Where(m => m.RestaurantID == restaurantId && m.IsActive)
                .OrderBy(m => m.DisplayOrder)
                .ToListAsync();
        }

        // GET: api/MenuItem/ByCategory/Appetizers
        [HttpGet("ByCategory/{category}")]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItemsByCategory(string category)
        {
            return await _context.MenuItems
                .Include(m => m.Restaurant)
                .Where(m => m.Category == category && m.IsActive)
                .OrderBy(m => m.DisplayOrder)
                .ToListAsync();
        }

        // GET: api/MenuItem/ByCuisine/Pakistani
        [HttpGet("ByCuisine/{cuisine}")]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItemsByCuisine(string cuisine)
        {
            return await _context.MenuItems
                .Include(m => m.Restaurant)
                .Where(m => m.Cuisine == cuisine && m.IsActive)
                .OrderBy(m => m.DisplayOrder)
                .ToListAsync();
        }

        // POST: api/MenuItem
        [HttpPost]
        public async Task<ActionResult<MenuItem>> PostMenuItem([FromForm] MenuItemUploadDto dto)
        {
            try
            {
                string imagePath = null;

                if (dto.ImageFile != null && dto.ImageFile.Length > 0)
                {
                    // Validate file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                    var extension = Path.GetExtension(dto.ImageFile.FileName).ToLowerInvariant();
                    
                    if (!allowedExtensions.Contains(extension))
                    {
                        return BadRequest("Invalid file type. Only image files are allowed.");
                    }

                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "Gallery", "MenuItems");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = $"{Guid.NewGuid()}{extension}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.ImageFile.CopyToAsync(stream);
                    }

                    imagePath = $"/Gallery/MenuItems/{fileName}";
                }

                var menuItem = new MenuItem
                {
                    RestaurantID = dto.RestaurantID,
                    Name = dto.Name,
                    Description = dto.Description,
                    ImagePath = imagePath,
                    Price = dto.Price,
                    Rating = dto.Rating ?? 4.5M,
                    Category = dto.Category,
                    Cuisine = dto.Cuisine,
                    IsSpicy = dto.IsSpicy,
                    IsVegetarian = dto.IsVegetarian,
                    IsAvailable = true,
                    DisplayOrder = dto.DisplayOrder,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };

                _context.MenuItems.Add(menuItem);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMenuItem), new { id = menuItem.MenuItemID }, menuItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/MenuItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMenuItem(int id, [FromForm] MenuItemUploadDto dto)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }

            try
            {
                if (dto.ImageFile != null && dto.ImageFile.Length > 0)
                {
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                    var extension = Path.GetExtension(dto.ImageFile.FileName).ToLowerInvariant();
                    
                    if (!allowedExtensions.Contains(extension))
                    {
                        return BadRequest("Invalid file type. Only image files are allowed.");
                    }

                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "Gallery", "MenuItems");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = $"{Guid.NewGuid()}{extension}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.ImageFile.CopyToAsync(stream);
                    }

                    menuItem.ImagePath = $"/Gallery/MenuItems/{fileName}";
                }

                menuItem.RestaurantID = dto.RestaurantID;
                menuItem.Name = dto.Name;
                menuItem.Description = dto.Description;
                menuItem.Price = dto.Price;
                menuItem.Rating = dto.Rating ?? menuItem.Rating;
                menuItem.Category = dto.Category;
                menuItem.Cuisine = dto.Cuisine;
                menuItem.IsSpicy = dto.IsSpicy;
                menuItem.IsVegetarian = dto.IsVegetarian;
                menuItem.DisplayOrder = dto.DisplayOrder;
                menuItem.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/MenuItem/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }

            menuItem.IsActive = false;
            menuItem.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/MenuItem/ToggleAvailability/5
        [HttpPost("ToggleAvailability/{id}")]
        public async Task<IActionResult> ToggleAvailability(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }

            menuItem.IsAvailable = !menuItem.IsAvailable;
            menuItem.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class MenuItemUploadDto
    {
        public int RestaurantID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile ImageFile { get; set; }
        public decimal Price { get; set; }
        public decimal? Rating { get; set; }
        public string Category { get; set; }
        public string Cuisine { get; set; }
        public bool IsSpicy { get; set; }
        public bool IsVegetarian { get; set; }
        public int DisplayOrder { get; set; }
    }
}
