using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UploadController> _logger;

        public UploadController(IWebHostEnvironment environment, ILogger<UploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        // POST: api/Upload/image
        [HttpPost("image")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string folder = "Blogs")
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded" });
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { message = "Invalid file type. Only images are allowed." });
                }

                // Validate file size (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File size exceeds 5MB limit" });
                }

                // Create upload directory if it doesn't exist
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "Uploads", folder);
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the relative path
                var relativePath = $"/Uploads/{folder}/{fileName}";
                
                _logger.LogInformation($"Image uploaded successfully: {relativePath}");

                return Ok(new
                {
                    success = true,
                    message = "Image uploaded successfully",
                    filePath = relativePath,
                    path = relativePath,
                    url = $"{Request.Scheme}://{Request.Host}{relativePath}",
                    fileName = fileName
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image");
                return StatusCode(500, new { message = "Error uploading image", error = ex.Message });
            }
        }

        // DELETE: api/Upload/image
        [HttpDelete("image")]
        [AllowAnonymous]
        public IActionResult DeleteImage([FromQuery] string path)
        {
            try
            {
                if (string.IsNullOrEmpty(path))
                {
                    return BadRequest(new { message = "Image path is required" });
                }

                // Remove leading slash if present
                path = path.TrimStart('/');

                var filePath = Path.Combine(_environment.WebRootPath, path);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound(new { message = "Image not found" });
                }

                System.IO.File.Delete(filePath);

                _logger.LogInformation($"Image deleted successfully: {path}");

                return Ok(new { success = true, message = "Image deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image");
                return StatusCode(500, new { message = "Error deleting image", error = ex.Message });
            }
        }
    }
}
