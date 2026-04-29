using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryItemController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public GalleryItemController(HotelDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/GalleryItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GalleryItem>>> GetGalleryItems()
        {
            return await _context.GalleryItems
                .Include(gi => gi.Category)
                .Where(gi => gi.IsActive)
                .OrderBy(gi => gi.DisplayOrder)
                .ToListAsync();
        }

        // GET: api/GalleryItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GalleryItem>> GetGalleryItem(int id)
        {
            var item = await _context.GalleryItems
                .Include(gi => gi.Category)
                .FirstOrDefaultAsync(gi => gi.GalleryItemID == id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // GET: api/GalleryItem/ByCategory/1
        [HttpGet("ByCategory/{categoryId}")]
        public async Task<ActionResult<IEnumerable<GalleryItem>>> GetItemsByCategory(int categoryId)
        {
            return await _context.GalleryItems
                .Where(gi => gi.CategoryID == categoryId && gi.IsActive)
                .OrderBy(gi => gi.DisplayOrder)
                .ToListAsync();
        }

        // POST: api/GalleryItem
        [HttpPost]
        public async Task<ActionResult<GalleryItem>> PostGalleryItem([FromForm] GalleryItemUploadDto dto)
        {
            try
            {
                if (dto.ImageFile == null || dto.ImageFile.Length == 0)
                {
                    return BadRequest("Image file is required");
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(dto.ImageFile.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest("Invalid file type. Only image files are allowed.");
                }

                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "gallery");
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

                // If this is set as main image, unset other main images in the same category
                if (dto.IsMainImage)
                {
                    var otherMainImages = await _context.GalleryItems
                        .Where(gi => gi.CategoryID == dto.CategoryID && gi.IsMainImage)
                        .ToListAsync();

                    foreach (var img in otherMainImages)
                    {
                        img.IsMainImage = false;
                    }
                }

                var galleryItem = new GalleryItem
                {
                    CategoryID = dto.CategoryID,
                    Title = dto.Title,
                    Subtitle = dto.Subtitle,
                    Description = dto.Description,
                    ImagePath = $"/uploads/gallery/{fileName}",
                    IsMainImage = dto.IsMainImage,
                    DisplayOrder = dto.DisplayOrder,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };

                _context.GalleryItems.Add(galleryItem);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetGalleryItem), new { id = galleryItem.GalleryItemID }, galleryItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/GalleryItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGalleryItem(int id, [FromForm] GalleryItemUploadDto dto)
        {
            var item = await _context.GalleryItems.FindAsync(id);
            if (item == null)
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

                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "gallery");
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

                    item.ImagePath = $"/uploads/gallery/{fileName}";
                }

                // If this is set as main image, unset other main images in the same category
                if (dto.IsMainImage && !item.IsMainImage)
                {
                    var otherMainImages = await _context.GalleryItems
                        .Where(gi => gi.CategoryID == dto.CategoryID && gi.IsMainImage && gi.GalleryItemID != id)
                        .ToListAsync();

                    foreach (var img in otherMainImages)
                    {
                        img.IsMainImage = false;
                    }
                }

                item.CategoryID = dto.CategoryID;
                item.Title = dto.Title;
                item.Subtitle = dto.Subtitle;
                item.Description = dto.Description;
                item.IsMainImage = dto.IsMainImage;
                item.DisplayOrder = dto.DisplayOrder;
                item.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/GalleryItem/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGalleryItem(int id)
        {
            var item = await _context.GalleryItems.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            item.IsActive = false;
            item.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/GalleryItem/SetMainImage/5
        [HttpPost("SetMainImage/{id}")]
        public async Task<IActionResult> SetMainImage(int id)
        {
            var item = await _context.GalleryItems.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            // Unset other main images in the same category
            var otherMainImages = await _context.GalleryItems
                .Where(gi => gi.CategoryID == item.CategoryID && gi.IsMainImage && gi.GalleryItemID != id)
                .ToListAsync();

            foreach (var img in otherMainImages)
            {
                img.IsMainImage = false;
            }

            item.IsMainImage = true;
            item.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/GalleryItem/5/set-main (Alternative endpoint for admin panel)
        [HttpPut("{id}/set-main")]
        public async Task<IActionResult> SetMainImageAlt(int id)
        {
            var item = await _context.GalleryItems.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            // Unset other main images in the same category
            var otherMainImages = await _context.GalleryItems
                .Where(gi => gi.CategoryID == item.CategoryID && gi.IsMainImage && gi.GalleryItemID != id)
                .ToListAsync();

            foreach (var img in otherMainImages)
            {
                img.IsMainImage = false;
            }

            item.IsMainImage = true;
            item.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class GalleryItemUploadDto
    {
        public int CategoryID { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public IFormFile ImageFile { get; set; }
        public bool IsMainImage { get; set; }
        public int DisplayOrder { get; set; }
    }
}
