using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for testing
    public class RoomTypeImageController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<RoomTypeImageController> _logger;

        public RoomTypeImageController(
            HotelDbContext context,
            IWebHostEnvironment environment,
            ILogger<RoomTypeImageController> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        // Helper method to generate full URLs based on current request
        private string GetFullUrl(string relativePath)
        {
            if (string.IsNullOrEmpty(relativePath))
                return null;

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";
            return $"{baseUrl}{relativePath}";
        }

        // Helper method to convert RoomTypeImage to response with full URLs
        private object ConvertToResponse(RoomTypeImage image)
        {
            return new
            {
                id = image.Id,
                roomTypeId = image.RoomTypeId,
                imagePath = GetFullUrl(image.ImagePath),
                thumbnailPath = GetFullUrl(image.ThumbnailPath),
                compressedPath = GetFullUrl(image.CompressedPath),
                originalFileName = image.OriginalFileName,
                title = image.Title,
                description = image.Description,
                altText = image.AltText,
                fileSizeBytes = image.FileSizeBytes,
                width = image.Width,
                height = image.Height,
                mimeType = image.MimeType,
                displayOrder = image.DisplayOrder,
                isPrimary = image.IsPrimary,
                isActive = image.IsActive,
                uploadedAt = image.UploadedAt,
                uploadedBy = image.UploadedBy,
                roomType = image.RoomType
            };
        }

        // GET: api/RoomTypeImage
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomTypeImage>>> GetRoomTypeImages()
        {
            try
            {
                var images = await _context.RoomTypeImages
                    .Where(rti => rti.IsActive == true)
                    .OrderBy(rti => rti.RoomTypeId)
                    .ThenBy(rti => rti.DisplayOrder)
                    .ToListAsync();

                var response = images.Select(ConvertToResponse).ToList();
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room type images");
                return StatusCode(500, "Internal server error occurred while retrieving room type images");
            }
        }

        // GET: api/RoomTypeImage/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomTypeImage>> GetRoomTypeImage(int id)
        {
            try
            {
                var image = await _context.RoomTypeImages
                    .Include(rti => rti.RoomType)
                    .FirstOrDefaultAsync(rti => rti.Id == id);

                if (image == null)
                {
                    return NotFound($"Room type image with ID {id} not found");
                }

                return Ok(ConvertToResponse(image));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room type image with ID {Id}", id);
                return StatusCode(500, "Internal server error occurred while retrieving room type image");
            }
        }

        // GET: api/RoomTypeImage/roomtype/5
        [HttpGet("roomtype/{roomTypeId}")]
        public async Task<ActionResult<IEnumerable<RoomTypeImage>>> GetRoomTypeImagesByRoomType(int roomTypeId)
        {
            try
            {
                var images = await _context.RoomTypeImages
                    .Where(rti => rti.RoomTypeId == roomTypeId && rti.IsActive == true)
                    .OrderBy(rti => rti.DisplayOrder)
                    .ThenBy(rti => rti.UploadedAt)
                    .ToListAsync();

                var response = images.Select(ConvertToResponse).ToList();
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving room type images for room type ID {RoomTypeId}", roomTypeId);
                return StatusCode(500, "Internal server error occurred while retrieving room type images");
            }
        }

        // POST: api/RoomTypeImage/upload
        [HttpPost("upload")]
        public async Task<ActionResult<RoomTypeImage>> UploadRoomTypeImage([FromForm] RoomTypeImageUploadDto uploadDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate room type exists
                var roomType = await _context.RoomTypes.FindAsync(uploadDto.RoomTypeId);
                if (roomType == null)
                {
                    return BadRequest($"Room type with ID {uploadDto.RoomTypeId} not found");
                }

                // Validate file
                if (uploadDto.ImageFile == null || uploadDto.ImageFile.Length == 0)
                {
                    return BadRequest("No image file provided");
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var fileExtension = Path.GetExtension(uploadDto.ImageFile.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Only JPG, PNG, and WebP images are allowed");
                }

                // Validate file size (max 10MB)
                if (uploadDto.ImageFile.Length > 10 * 1024 * 1024)
                {
                    return BadRequest("File size cannot exceed 10MB");
                }

                // Create upload directory
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "roomtypes");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Process and save image
                using (var imageStream = uploadDto.ImageFile.OpenReadStream())
                using (var image = await Image.LoadAsync(imageStream))
                {
                    // Get original dimensions
                    var originalWidth = image.Width;
                    var originalHeight = image.Height;

                    // Save original (compressed)
                    var originalPath = Path.Combine(uploadsPath, $"original_{fileName}");
                    await image.SaveAsync(originalPath, new JpegEncoder { Quality = 90 });

                    // Create thumbnail (300x200)
                    var thumbnailPath = Path.Combine(uploadsPath, $"thumb_{fileName}");
                    using (var thumbnail = image.Clone(ctx => ctx.Resize(new ResizeOptions
                    {
                        Size = new Size(300, 200),
                        Mode = ResizeMode.Crop,
                        Position = AnchorPositionMode.Center
                    })))
                    {
                        await thumbnail.SaveAsync(thumbnailPath, new JpegEncoder { Quality = 85 });
                    }

                    // Create compressed version (max 1200x800)
                    var compressedPath = Path.Combine(uploadsPath, $"compressed_{fileName}");
                    var maxWidth = 1200;
                    var maxHeight = 800;

                    if (originalWidth > maxWidth || originalHeight > maxHeight)
                    {
                        using (var compressed = image.Clone(ctx => ctx.Resize(new ResizeOptions
                        {
                            Size = new Size(maxWidth, maxHeight),
                            Mode = ResizeMode.Max
                        })))
                        {
                            await compressed.SaveAsync(compressedPath, new JpegEncoder { Quality = 80 });
                        }
                    }
                    else
                    {
                        // If image is already small enough, just compress it
                        await image.SaveAsync(compressedPath, new JpegEncoder { Quality = 80 });
                    }

                    // Create database record
                    var roomTypeImage = new RoomTypeImage
                    {
                        RoomTypeId = uploadDto.RoomTypeId,
                        ImagePath = $"/uploads/roomtypes/{fileName}",
                        OriginalFileName = uploadDto.ImageFile.FileName,
                        Title = uploadDto.Title,
                        Description = uploadDto.Description,
                        AltText = uploadDto.AltText ?? uploadDto.Title ?? uploadDto.ImageFile.FileName,
                        FileSizeBytes = uploadDto.ImageFile.Length,
                        Width = originalWidth,
                        Height = originalHeight,
                        MimeType = uploadDto.ImageFile.ContentType,
                        DisplayOrder = uploadDto.DisplayOrder,
                        IsPrimary = uploadDto.IsPrimary,
                        IsActive = true,
                        UploadedAt = DateTime.UtcNow,
                        UploadedBy = User?.Identity?.Name ?? "System",
                        ThumbnailPath = $"/uploads/roomtypes/thumb_{fileName}",
                        CompressedPath = $"/uploads/roomtypes/compressed_{fileName}"
                    };

                    _context.RoomTypeImages.Add(roomTypeImage);
                    await _context.SaveChangesAsync();

                    // If this is set as primary, update other images for this room type
                    if (uploadDto.IsPrimary)
                    {
                        await SetPrimaryImage(roomTypeImage.Id, uploadDto.RoomTypeId);
                    }

                    return CreatedAtAction(nameof(GetRoomTypeImage), new { id = roomTypeImage.Id }, ConvertToResponse(roomTypeImage));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading room type image");
                return StatusCode(500, "Internal server error occurred while uploading image");
            }
        }

        // PUT: api/RoomTypeImage/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomTypeImage(int id, RoomTypeImageUpdateDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var image = await _context.RoomTypeImages.FindAsync(id);
                if (image == null)
                {
                    return NotFound($"Room type image with ID {id} not found");
                }

                // Update properties
                image.Title = updateDto.Title;
                image.Description = updateDto.Description;
                image.AltText = updateDto.AltText;
                image.DisplayOrder = updateDto.DisplayOrder;
                image.IsPrimary = updateDto.IsPrimary;
                image.IsActive = updateDto.IsActive;
                image.UpdatedAt = DateTime.UtcNow;
                image.UpdatedBy = User?.Identity?.Name ?? "System";

                _context.Entry(image).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // If this is set as primary, update other images for this room type
                if (updateDto.IsPrimary)
                {
                    await SetPrimaryImage(id, image.RoomTypeId);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room type image with ID {Id}", id);
                return StatusCode(500, "Internal server error occurred while updating image");
            }
        }

        // DELETE: api/RoomTypeImage/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomTypeImage(int id)
        {
            try
            {
                var image = await _context.RoomTypeImages.FindAsync(id);
                if (image == null)
                {
                    return NotFound($"Room type image with ID {id} not found");
                }

                // Delete physical files
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "roomtypes");
                var imageName = Path.GetFileName(image.ImagePath);
                
                var filesToDelete = new[]
                {
                    Path.Combine(uploadsPath, imageName),
                    Path.Combine(uploadsPath, $"original_{imageName}"),
                    Path.Combine(uploadsPath, Path.GetFileName(image.ThumbnailPath ?? "")),
                    Path.Combine(uploadsPath, Path.GetFileName(image.CompressedPath ?? ""))
                };

                foreach (var file in filesToDelete)
                {
                    if (!string.IsNullOrEmpty(file) && System.IO.File.Exists(file))
                    {
                        try
                        {
                            System.IO.File.Delete(file);
                        }
                        catch (Exception fileEx)
                        {
                            _logger.LogWarning(fileEx, "Could not delete file {FilePath}", file);
                        }
                    }
                }

                // Remove from database
                _context.RoomTypeImages.Remove(image);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room type image with ID {Id}", id);
                return StatusCode(500, "Internal server error occurred while deleting image");
            }
        }

        // POST: api/RoomTypeImage/5/set-primary
        [HttpPost("{id}/set-primary")]
        public async Task<IActionResult> SetAsPrimary(int id)
        {
            try
            {
                var image = await _context.RoomTypeImages.FindAsync(id);
                if (image == null)
                {
                    return NotFound($"Room type image with ID {id} not found");
                }

                await SetPrimaryImage(id, image.RoomTypeId);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting primary image with ID {Id}", id);
                return StatusCode(500, "Internal server error occurred while setting primary image");
            }
        }

        // POST: api/RoomTypeImage/reorder
        [HttpPost("reorder")]
        public async Task<IActionResult> ReorderImages([FromBody] List<ImageReorderDto> reorderData)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                foreach (var item in reorderData)
                {
                    var image = await _context.RoomTypeImages.FindAsync(item.Id);
                    if (image != null)
                    {
                        image.DisplayOrder = item.DisplayOrder;
                        image.UpdatedAt = DateTime.UtcNow;
                        image.UpdatedBy = User?.Identity?.Name ?? "System";
                    }
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reordering images");
                return StatusCode(500, "Internal server error occurred while reordering images");
            }
        }

        private async Task SetPrimaryImage(int primaryImageId, int roomTypeId)
        {
            // Set all other images for this room type as non-primary
            var otherImages = await _context.RoomTypeImages
                .Where(rti => rti.RoomTypeId == roomTypeId && rti.Id != primaryImageId)
                .ToListAsync();

            foreach (var otherImage in otherImages)
            {
                otherImage.IsPrimary = false;
                otherImage.UpdatedAt = DateTime.UtcNow;
                otherImage.UpdatedBy = User?.Identity?.Name ?? "System";
            }

            // Set the selected image as primary
            var primaryImage = await _context.RoomTypeImages.FindAsync(primaryImageId);
            if (primaryImage != null)
            {
                primaryImage.IsPrimary = true;
                primaryImage.UpdatedAt = DateTime.UtcNow;
                primaryImage.UpdatedBy = User?.Identity?.Name ?? "System";
            }

            await _context.SaveChangesAsync();
        }
    }

    // DTOs for image operations
    public class RoomTypeImageUploadDto
    {
        [Required]
        public int RoomTypeId { get; set; }

        [Required]
        public IFormFile ImageFile { get; set; }

        [StringLength(100)]
        public string? Title { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? AltText { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsPrimary { get; set; } = false;
    }

    public class RoomTypeImageUpdateDto
    {
        [StringLength(100)]
        public string? Title { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? AltText { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsPrimary { get; set; } = false;

        public bool IsActive { get; set; } = true;
    }

    public class ImageReorderDto
    {
        public int Id { get; set; }
        public int DisplayOrder { get; set; }
    }
}
