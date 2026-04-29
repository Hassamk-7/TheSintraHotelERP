using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryCategoryController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public GalleryCategoryController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: api/GalleryCategory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GalleryCategory>>> GetGalleryCategories()
        {
            return await _context.GalleryCategories
                .Include(gc => gc.GalleryItems.Where(gi => gi.IsActive))
                .Where(gc => gc.IsActive)
                .OrderBy(gc => gc.DisplayOrder)
                .ToListAsync();
        }

        // GET: api/GalleryCategory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GalleryCategory>> GetGalleryCategory(int id)
        {
            var category = await _context.GalleryCategories
                .Include(gc => gc.GalleryItems.Where(gi => gi.IsActive))
                .FirstOrDefaultAsync(gc => gc.CategoryID == id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // GET: api/GalleryCategory/ByName/Rooms & Suites
        [HttpGet("ByName/{name}")]
        public async Task<ActionResult<IEnumerable<GalleryCategory>>> GetCategoriesByName(string name)
        {
            return await _context.GalleryCategories
                .Include(gc => gc.GalleryItems.Where(gi => gi.IsActive))
                .Where(gc => gc.Name == name && gc.IsActive)
                .OrderBy(gc => gc.DisplayOrder)
                .ToListAsync();
        }

        // GET: api/GalleryCategory/MainImages
        // Returns only categories with their main image
        [HttpGet("MainImages")]
        public async Task<ActionResult<IEnumerable<object>>> GetMainImages()
        {
            var categories = await _context.GalleryCategories
                .Include(gc => gc.GalleryItems.Where(gi => gi.IsMainImage && gi.IsActive))
                .Where(gc => gc.IsActive && gc.GalleryItems.Any(gi => gi.IsMainImage && gi.IsActive))
                .OrderBy(gc => gc.DisplayOrder)
                .Select(gc => new
                {
                    gc.CategoryID,
                    gc.Name,
                    gc.Title,
                    gc.Subtitle,
                    gc.Description,
                    gc.DisplayOrder,
                    MainImage = gc.GalleryItems.FirstOrDefault(gi => gi.IsMainImage && gi.IsActive)
                })
                .ToListAsync();

            return Ok(categories);
        }

        // POST: api/GalleryCategory
        [HttpPost]
        public async Task<ActionResult<GalleryCategory>> PostGalleryCategory(GalleryCategoryDto dto)
        {
            var category = new GalleryCategory
            {
                Name = dto.Name,
                Title = dto.Title,
                Subtitle = dto.Subtitle,
                Description = dto.Description,
                DisplayOrder = dto.DisplayOrder,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            _context.GalleryCategories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGalleryCategory), new { id = category.CategoryID }, category);
        }

        // PUT: api/GalleryCategory/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGalleryCategory(int id, GalleryCategoryDto dto)
        {
            var category = await _context.GalleryCategories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            category.Name = dto.Name;
            category.Title = dto.Title;
            category.Subtitle = dto.Subtitle;
            category.Description = dto.Description;
            category.DisplayOrder = dto.DisplayOrder;
            category.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/GalleryCategory/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGalleryCategory(int id)
        {
            var category = await _context.GalleryCategories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            category.IsActive = false;
            category.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class GalleryCategoryDto
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public int DisplayOrder { get; set; }
    }
}
