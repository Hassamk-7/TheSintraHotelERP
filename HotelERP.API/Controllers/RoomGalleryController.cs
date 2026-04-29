using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomGalleryController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public RoomGalleryController(HotelDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/RoomGallery
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomGallery>>> GetRoomGalleries()
        {
            return await _context.RoomGalleries
                .Include(rg => rg.RoomType)
                .Where(rg => rg.IsActive)
                .OrderBy(rg => rg.RoomTypeID)
                .ThenBy(rg => rg.DisplayOrder)
                .ToListAsync();
        }

        // GET: api/RoomGallery/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomGallery>> GetRoomGallery(int id)
        {
            var roomGallery = await _context.RoomGalleries
                .Include(rg => rg.RoomType)
                .FirstOrDefaultAsync(rg => rg.RoomGalleryID == id);

            if (roomGallery == null)
            {
                return NotFound();
            }

            return roomGallery;
        }

        // GET: api/RoomGallery/ByRoomType/5
        [HttpGet("ByRoomType/{roomTypeId}")]
        public async Task<ActionResult<IEnumerable<RoomGallery>>> GetByRoomType(int roomTypeId)
        {
            var galleries = await _context.RoomGalleries
                .Where(rg => rg.RoomTypeID == roomTypeId && rg.IsActive)
                .OrderBy(rg => rg.DisplayOrder)
                .ToListAsync();

            return galleries;
        }

        // GET: api/RoomGallery/ByCategory/Restaurant
        [HttpGet("ByCategory/{category}")]
        public async Task<ActionResult<IEnumerable<RoomGallery>>> GetByCategory(string category)
        {
            var galleries = await _context.RoomGalleries
                .Include(rg => rg.RoomType)
                .Where(rg => rg.Category == category && rg.IsActive)
                .OrderBy(rg => rg.DisplayOrder)
                .ToListAsync();

            if (galleries == null || !galleries.Any())
            {
                return NotFound($"No galleries found for category: {category}");
            }

            return galleries;
        }

        // GET: api/RoomGallery/MainImages
        [HttpGet("MainImages")]
        public async Task<ActionResult<IEnumerable<RoomGallery>>> GetMainImages()
        {
            var mainImages = await _context.RoomGalleries
                .Include(rg => rg.RoomType)
                .Where(rg => rg.IsMainImage && rg.IsActive)
                .OrderBy(rg => rg.RoomTypeID)
                .ToListAsync();

            return mainImages;
        }

        // POST: api/RoomGallery
        [HttpPost]
        public async Task<ActionResult<RoomGallery>> PostRoomGallery([FromForm] RoomGalleryUploadDto dto)
        {
            try
            {
                if (dto.ImageFile == null || dto.ImageFile.Length == 0)
                {
                    return BadRequest("Image file is required");
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(dto.ImageFile.FileName).ToLower();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Only image files (jpg, jpeg, png, gif, webp) are allowed");
                }

                // Create Gallery folder structure - MATCH RoomTypeImage structure
                var galleryPath = Path.Combine(_environment.WebRootPath, "gallery", "roomTypes");
                if (!Directory.Exists(galleryPath))
                {
                    Directory.CreateDirectory(galleryPath);
                }

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(galleryPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

                // Create database record
                var roomGallery = new RoomGallery
                {
                    RoomTypeID = dto.RoomTypeID,
                    ImageName = fileName,
                    ImagePath = $"/gallery/roomTypes/{fileName}",
                    ImageTitle = dto.ImageTitle,
                    ImageDescription = dto.ImageDescription,
                    Category = dto.Category,
                    DisplayOrder = dto.DisplayOrder,
                    IsMainImage = dto.IsMainImage,
                    IsActive = true,
                    CreatedBy = User.Identity?.Name ?? "System",
                    CreatedDate = DateTime.Now,
                    // Restaurant-specific fields
                    Location = dto.Location,
                    Rating = dto.Rating,
                    Price = dto.Price,
                    IsSpicy = dto.IsSpicy,
                    IsVegetarian = dto.IsVegetarian,
                    Cuisine = dto.Cuisine,
                    SubCategory = dto.SubCategory
                };

                _context.RoomGalleries.Add(roomGallery);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRoomGallery), new { id = roomGallery.RoomGalleryID }, roomGallery);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/RoomGallery/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoomGallery(int id, [FromForm] RoomGalleryUpdateDto dto)
        {
            var roomGallery = await _context.RoomGalleries.FindAsync(id);
            if (roomGallery == null)
            {
                return NotFound();
            }

            try
            {
                // Update image if new file provided
                if (dto.ImageFile != null && dto.ImageFile.Length > 0)
                {
                    // Validate file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                    var fileExtension = Path.GetExtension(dto.ImageFile.FileName).ToLower();
                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return BadRequest("Only image files (jpg, jpeg, png, gif, webp) are allowed");
                    }

                    // Delete old file
                    var oldFilePath = Path.Combine(_environment.WebRootPath, roomGallery.ImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }

                    // Save new file
                    var galleryPath = Path.Combine(_environment.WebRootPath, "gallery", "roomTypes");
                    var fileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(galleryPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.ImageFile.CopyToAsync(stream);
                    }

                    roomGallery.ImageName = fileName;
                    roomGallery.ImagePath = $"/gallery/roomTypes/{fileName}";
                }

                // Update other fields
                roomGallery.ImageTitle = dto.ImageTitle ?? roomGallery.ImageTitle;
                roomGallery.ImageDescription = dto.ImageDescription ?? roomGallery.ImageDescription;
                roomGallery.Category = dto.Category ?? roomGallery.Category;
                roomGallery.DisplayOrder = dto.DisplayOrder ?? roomGallery.DisplayOrder;
                roomGallery.IsMainImage = dto.IsMainImage ?? roomGallery.IsMainImage;
                roomGallery.ModifiedBy = User.Identity?.Name ?? "System";
                roomGallery.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/RoomGallery/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomGallery(int id)
        {
            var roomGallery = await _context.RoomGalleries.FindAsync(id);
            if (roomGallery == null)
            {
                return NotFound();
            }

            try
            {
                // Delete physical file
                var filePath = Path.Combine(_environment.WebRootPath, roomGallery.ImagePath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                _context.RoomGalleries.Remove(roomGallery);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/RoomGallery/SetMainImage/5
        [HttpPost("SetMainImage/{id}")]
        public async Task<IActionResult> SetMainImage(int id)
        {
            var roomGallery = await _context.RoomGalleries.FindAsync(id);
            if (roomGallery == null)
            {
                return NotFound();
            }

            // Unset other main images for this room type
            var otherMainImages = await _context.RoomGalleries
                .Where(rg => rg.RoomTypeID == roomGallery.RoomTypeID && rg.IsMainImage && rg.RoomGalleryID != id)
                .ToListAsync();

            foreach (var img in otherMainImages)
            {
                img.IsMainImage = false;
            }

            roomGallery.IsMainImage = true;
            roomGallery.ModifiedBy = User.Identity?.Name ?? "System";
            roomGallery.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTOs for file upload
    public class RoomGalleryUploadDto
    {
        public int RoomTypeID { get; set; }
        public IFormFile ImageFile { get; set; }
        public string ImageTitle { get; set; }
        public string ImageDescription { get; set; }
        public string Category { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsMainImage { get; set; }
        
        // Restaurant-specific fields
        public string Location { get; set; }
        public decimal? Rating { get; set; }
        public decimal? Price { get; set; }
        public bool? IsSpicy { get; set; }
        public bool? IsVegetarian { get; set; }
        public string Cuisine { get; set; }
        public string SubCategory { get; set; }
    }

    public class RoomGalleryUpdateDto
    {
        public IFormFile ImageFile { get; set; }
        public string ImageTitle { get; set; }
        public string ImageDescription { get; set; }
        public string Category { get; set; }
        public int? DisplayOrder { get; set; }
        public bool? IsMainImage { get; set; }
    }
}
