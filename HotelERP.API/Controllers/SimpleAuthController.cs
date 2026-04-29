using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using HotelERP.API.Models;
using HotelERP.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HotelERP.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class SimpleAuthController : ControllerBase
    {
        private readonly ILogger<SimpleAuthController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtService _jwtService;

        public SimpleAuthController(
            ILogger<SimpleAuthController> logger,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IJwtService jwtService)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] SimpleLoginDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid request data", errors = ModelState });
                }

                var normalizedEmail = model.Email.Trim();
                var user = await _userManager.FindByEmailAsync(normalizedEmail)
                           ?? await _userManager.FindByNameAsync(normalizedEmail);

                if (user == null)
                {
                    _logger.LogWarning("Login failed. User not found for {Email}", normalizedEmail);
                    return Unauthorized(new { success = false, message = "Invalid email or password" });
                }

                var passwordResult = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                if (!passwordResult.Succeeded)
                {
                    _logger.LogWarning("Login failed. Invalid password for {Email}", normalizedEmail);
                    return Unauthorized(new { success = false, message = "Invalid email or password" });
                }

                var roles = await _userManager.GetRolesAsync(user);
                var token = _jwtService.GenerateJwtToken(user, roles);
                var refreshToken = _jwtService.GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
                user.LastLoginDate = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);

                return Ok(new
                {
                    success = true,
                    message = "Login successful",
                    token,
                    refreshToken,
                    expiration = DateTime.UtcNow.AddMinutes(1440),
                    user = await BuildUserResponseAsync(user, roles)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login process");
                return StatusCode(500, new { success = false, message = "Internal server error during login", error = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest model)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(model.RefreshToken))
                {
                    return BadRequest(new { success = false, message = "Refresh token is required" });
                }

                var user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == model.RefreshToken);
                if (user == null || user.RefreshTokenExpiryTime == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                {
                    return Unauthorized(new { success = false, message = "Invalid or expired refresh token" });
                }

                var roles = await _userManager.GetRolesAsync(user);
                var newToken = _jwtService.GenerateJwtToken(user, roles);
                var newRefreshToken = _jwtService.GenerateRefreshToken();

                user.RefreshToken = newRefreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
                await _userManager.UpdateAsync(user);

                return Ok(new
                {
                    success = true,
                    token = newToken,
                    refreshToken = newRefreshToken,
                    expiration = DateTime.UtcNow.AddMinutes(1440),
                    user = await BuildUserResponseAsync(user, roles)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new { success = false, message = "Internal server error during token refresh" });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { success = false, message = "User not authenticated" });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new { success = true, user = await BuildUserResponseAsync(user, roles) });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrWhiteSpace(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null)
                {
                    user.RefreshToken = null;
                    user.RefreshTokenExpiryTime = null;
                    await _userManager.UpdateAsync(user);
                }
            }

            return Ok(new { success = true, message = "Logged out successfully" });
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "Auth API is working!", timestamp = DateTime.UtcNow });
        }

        private async Task<object> BuildUserResponseAsync(ApplicationUser user, IList<string> roles)
        {
            var claims = await _userManager.GetClaimsAsync(user);
            var department = claims.FirstOrDefault(c => c.Type == "department")?.Value;
            var permissions = new HashSet<string>(claims.Where(c => c.Type == "permission").Select(c => c.Value), StringComparer.OrdinalIgnoreCase);

            foreach (var roleName in roles)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role == null) continue;

                var roleClaims = await _roleManager.GetClaimsAsync(role);
                foreach (var permission in roleClaims.Where(c => c.Type == "permission").Select(c => c.Value))
                {
                    permissions.Add(permission);
                }
            }

            return new
            {
                id = user.Id,
                email = user.Email,
                userName = user.UserName,
                firstName = user.FirstName,
                lastName = user.LastName,
                fullName = user.FullName,
                phoneNumber = user.PhoneNumber,
                department,
                roles,
                permissions = permissions.OrderBy(x => x).ToList(),
                lastLoginDate = user.LastLoginDate,
                isActive = user.LockoutEnabled == false || user.LockoutEnd == null || user.LockoutEnd <= DateTimeOffset.UtcNow
            };
        }
    }

    public class SimpleLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
