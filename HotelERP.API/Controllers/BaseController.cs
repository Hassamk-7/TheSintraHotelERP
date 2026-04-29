using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelERP.API.Controllers
{
    // [Authorize] // Temporarily disabled for testing
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase
    {
        protected string UserId => User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        protected string UserEmail => User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        protected string UserRole => User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        protected string UserName => User.Identity.Name;
        
        protected IActionResult HandleError(string errorMessage, int statusCode = 400)
        {
            return StatusCode(statusCode, new { message = errorMessage });
        }
        
        protected IActionResult HandleSuccess(object data = null, string message = null)
        {
            return Ok(new 
            { 
                success = true, 
                data,
                message 
            });
        }
        
        protected IActionResult HandleCreated(object data = null, string message = null)
        {
            return StatusCode(201, new 
            { 
                success = true, 
                data,
                message = message ?? "Resource created successfully"
            });
        }
        
        protected IActionResult HandleNotFound(string message = "The requested resource was not found")
        {
            return NotFound(new { message });
        }
        
        protected IActionResult HandleUnauthorized(string message = "You are not authorized to access this resource")
        {
            return Unauthorized(new { message });
        }
    }
}
