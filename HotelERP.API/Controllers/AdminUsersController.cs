using System.ComponentModel.DataAnnotations;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize]
    public class AdminUsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<AdminUsersController> _logger;

        public AdminUsersController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ILogger<AdminUsersController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] string? search = null)
        {
            var query = _userManager.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(u =>
                    (u.Email ?? string.Empty).ToLower().Contains(term) ||
                    (u.UserName ?? string.Empty).ToLower().Contains(term) ||
                    (u.FirstName ?? string.Empty).ToLower().Contains(term) ||
                    (u.LastName ?? string.Empty).ToLower().Contains(term));
            }

            var users = await query.OrderBy(u => u.FirstName).ThenBy(u => u.LastName).ToListAsync();
            var result = new List<object>();

            foreach (var user in users)
            {
                result.Add(await BuildUserDtoAsync(user));
            }

            return Ok(new { success = true, data = result });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            return Ok(new { success = true, data = await BuildUserDtoAsync(user) });
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid user data", errors = ModelState });
            }

            var email = request.Email.Trim();
            var userName = string.IsNullOrWhiteSpace(request.UserName) ? email : request.UserName.Trim();

            if (await _userManager.FindByEmailAsync(email) != null)
            {
                return BadRequest(new { success = false, message = "Email is already in use" });
            }

            if (await _userManager.FindByNameAsync(userName) != null)
            {
                return BadRequest(new { success = false, message = "Username is already in use" });
            }

            var user = new ApplicationUser
            {
                Email = email,
                UserName = userName,
                FirstName = request.FirstName?.Trim(),
                LastName = request.LastName?.Trim(),
                PhoneNumber = request.PhoneNumber?.Trim(),
                EmailConfirmed = true,
                LockoutEnabled = true,
                LockoutEnd = request.IsActive ? null : DateTimeOffset.MaxValue
            };

            var createResult = await _userManager.CreateAsync(user, request.Password);
            if (!createResult.Succeeded)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to create user",
                    errors = createResult.Errors.Select(e => e.Description)
                });
            }

            await SyncUserClaimsAsync(user, request.Department, DateTime.UtcNow);
            await SyncUserRolesAsync(user, request.Roles);

            _logger.LogInformation("Admin user created: {Email}", email);
            return StatusCode(201, new { success = true, data = await BuildUserDtoAsync(user), message = "User created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid user data", errors = ModelState });
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var email = request.Email.Trim();
            var userName = string.IsNullOrWhiteSpace(request.UserName) ? email : request.UserName.Trim();

            var existingEmailUser = await _userManager.FindByEmailAsync(email);
            if (existingEmailUser != null && existingEmailUser.Id != user.Id)
            {
                return BadRequest(new { success = false, message = "Email is already in use" });
            }

            var existingUsernameUser = await _userManager.FindByNameAsync(userName);
            if (existingUsernameUser != null && existingUsernameUser.Id != user.Id)
            {
                return BadRequest(new { success = false, message = "Username is already in use" });
            }

            user.Email = email;
            user.UserName = userName;
            user.FirstName = request.FirstName?.Trim();
            user.LastName = request.LastName?.Trim();
            user.PhoneNumber = request.PhoneNumber?.Trim();
            user.LockoutEnabled = true;
            user.LockoutEnd = request.IsActive ? null : DateTimeOffset.MaxValue;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to update user",
                    errors = updateResult.Errors.Select(e => e.Description)
                });
            }

            await SyncUserClaimsAsync(user, request.Department, null);
            await SyncUserRolesAsync(user, request.Roles);

            return Ok(new { success = true, data = await BuildUserDtoAsync(user), message = "User updated successfully" });
        }

        [HttpPost("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(string id, [FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid password data", errors = ModelState });
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to reset password",
                    errors = result.Errors.Select(e => e.Description)
                });
            }

            return Ok(new { success = true, message = "Password reset successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to delete user",
                    errors = result.Errors.Select(e => e.Description)
                });
            }

            return Ok(new { success = true, message = "User deleted successfully" });
        }

        [HttpGet("logs/activity")]
        public async Task<IActionResult> GetUserActivityLogs()
        {
            var users = await _userManager.Users
                .OrderByDescending(u => u.LastLoginDate)
                .Take(100)
                .ToListAsync();

            var logs = new List<object>();
            foreach (var user in users)
            {
                var claims = await _userManager.GetClaimsAsync(user);
                logs.Add(new
                {
                    userId = user.Id,
                    userName = user.FullName,
                    email = user.Email,
                    department = claims.FirstOrDefault(c => c.Type == "department")?.Value,
                    lastLoginDate = user.LastLoginDate,
                    createdAt = claims.FirstOrDefault(c => c.Type == "created_at")?.Value,
                    status = user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.UtcNow ? "Inactive" : "Active"
                });
            }

            return Ok(new { success = true, data = logs });
        }

        private async Task SyncUserRolesAsync(ApplicationUser user, IEnumerable<string>? roles)
        {
            var roleList = (roles ?? Array.Empty<string>())
                .Where(r => !string.IsNullOrWhiteSpace(r))
                .Select(r => r.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var role in roleList)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            var existingRoles = await _userManager.GetRolesAsync(user);
            var removeRoles = existingRoles.Where(r => !roleList.Contains(r, StringComparer.OrdinalIgnoreCase)).ToList();
            var addRoles = roleList.Where(r => !existingRoles.Contains(r, StringComparer.OrdinalIgnoreCase)).ToList();

            if (removeRoles.Count > 0)
            {
                await _userManager.RemoveFromRolesAsync(user, removeRoles);
            }

            if (addRoles.Count > 0)
            {
                await _userManager.AddToRolesAsync(user, addRoles);
            }
        }

        private async Task SyncUserClaimsAsync(ApplicationUser user, string? department, DateTime? createdAt)
        {
            var existingClaims = await _userManager.GetClaimsAsync(user);
            var managedClaimTypes = new[] { "department", "created_at" };
            var existingManagedClaims = existingClaims.Where(c => managedClaimTypes.Contains(c.Type)).ToList();
            if (existingManagedClaims.Count > 0)
            {
                await _userManager.RemoveClaimsAsync(user, existingManagedClaims);
            }

            var claimsToAdd = new List<System.Security.Claims.Claim>();
            if (!string.IsNullOrWhiteSpace(department))
            {
                claimsToAdd.Add(new System.Security.Claims.Claim("department", department.Trim()));
            }

            var existingCreatedAt = existingClaims.FirstOrDefault(c => c.Type == "created_at")?.Value;
            if (createdAt.HasValue)
            {
                claimsToAdd.Add(new System.Security.Claims.Claim("created_at", createdAt.Value.ToString("O")));
            }
            else if (!string.IsNullOrWhiteSpace(existingCreatedAt))
            {
                claimsToAdd.Add(new System.Security.Claims.Claim("created_at", existingCreatedAt));
            }

            if (claimsToAdd.Count > 0)
            {
                await _userManager.AddClaimsAsync(user, claimsToAdd);
            }
        }

        private async Task<object> BuildUserDtoAsync(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var claims = await _userManager.GetClaimsAsync(user);
            var department = claims.FirstOrDefault(c => c.Type == "department")?.Value;
            var createdAt = claims.FirstOrDefault(c => c.Type == "created_at")?.Value;
            var rolePermissions = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var roleName in roles)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role == null) continue;
                var permissionClaims = await _roleManager.GetClaimsAsync(role);
                foreach (var claim in permissionClaims.Where(c => c.Type == "permission"))
                {
                    rolePermissions.Add(claim.Value);
                }
            }

            return new
            {
                id = user.Id,
                name = string.Join(" ", new[] { user.FirstName, user.LastName }.Where(x => !string.IsNullOrWhiteSpace(x))).Trim(),
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
                userName = user.UserName,
                phoneNumber = user.PhoneNumber,
                department,
                roles,
                permissions = rolePermissions.OrderBy(x => x).ToList(),
                status = user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.UtcNow ? "Inactive" : "Active",
                isActive = user.LockoutEnd == null || user.LockoutEnd <= DateTimeOffset.UtcNow,
                lastLogin = user.LastLoginDate,
                createdAt = createdAt
            };
        }
    }

    public class CreateUserRequest
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        public string? LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? UserName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Department { get; set; }
        public bool IsActive { get; set; } = true;
        public List<string> Roles { get; set; } = new();

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateUserRequest
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        public string? LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? UserName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Department { get; set; }
        public bool IsActive { get; set; } = true;
        public List<string> Roles { get; set; } = new();
    }

    public class ResetPasswordRequest
    {
        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }
}
