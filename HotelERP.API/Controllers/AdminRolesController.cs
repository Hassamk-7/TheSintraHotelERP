using System.ComponentModel.DataAnnotations;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/admin/roles")]
    [Authorize]
    public class AdminRolesController : ControllerBase
    {
        private static readonly List<PermissionCatalogItem> PermissionCatalog = new()
        {
            new(1, "dashboard.view", "Dashboard", "View dashboard and analytics"),
            new(2, "system-settings.manage", "System Settings", "Manage global system settings"),
            new(3, "users.view", "User Management", "View system users"),
            new(4, "users.manage", "User Management", "Create, update, and remove users"),
            new(5, "users.reset-password", "User Management", "Reset user passwords"),
            new(6, "roles.view", "Permissions & Roles", "View roles and permissions"),
            new(7, "roles.manage", "Permissions & Roles", "Create and update roles and permissions"),
            new(8, "audit.view", "Audit Logs", "View user and system activity logs"),
            new(9, "hotel.manage", "System Configuration", "Manage hotel master settings"),
            new(10, "currency.manage", "System Configuration", "Manage currencies"),
            new(11, "gallery.manage", "Front Gallery", "Manage website gallery content"),
            new(12, "restaurant.manage", "Front Restaurant", "Manage website restaurant content"),
            new(13, "front-office.manage", "Front Office", "Manage reservations, check-in, and check-out"),
            new(14, "rooms.manage", "Rooms Management", "Manage rooms, room types, and rates"),
            new(15, "blogs.manage", "Blog Management", "Manage blogs and categories"),
            new(16, "housekeeping.manage", "Housekeeping", "Manage housekeeping operations"),
            new(17, "accounting.manage", "Accounting", "Manage accounting operations"),
            new(18, "night-audit.manage", "Night Audit", "Run night audit and review reports"),
            new(19, "contact-messages.view", "Front Office", "View contact messages")
        };
        private static readonly object PermissionCatalogLock = new();

        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<HotelERP.API.Models.ApplicationUser> _userManager;

        public AdminRolesController(
            RoleManager<IdentityRole> roleManager,
            UserManager<HotelERP.API.Models.ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles([FromQuery] string? search = null)
        {
            var query = _roleManager.Roles.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(r => (r.Name ?? string.Empty).ToLower().Contains(term));
            }

            var roles = await query.OrderBy(r => r.Name).ToListAsync();
            var result = new List<object>();

            foreach (var role in roles)
            {
                result.Add(await BuildRoleDtoAsync(role));
            }

            return Ok(new { success = true, data = result });
        }

        [HttpGet("permissions")]
        public IActionResult GetPermissions()
        {
            return Ok(new
            {
                success = true,
                data = PermissionCatalog
                    .OrderBy(item => item.Module)
                    .ThenBy(item => item.Permission)
                    .Select(item => new
                    {
                        id = item.Id,
                        module = item.Module,
                        permission = item.Permission,
                        description = item.Description
                    })
            });
        }

        [HttpPost("permissions")]
        public IActionResult CreatePermission([FromBody] PermissionCatalogRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid permission data", errors = ModelState });
            }

            var normalizedPermission = NormalizePermissionKey(request.Permission);
            lock (PermissionCatalogLock)
            {
                if (PermissionCatalog.Any(item => item.Permission.Equals(normalizedPermission, StringComparison.OrdinalIgnoreCase)))
                {
                    return BadRequest(new { success = false, message = "Permission already exists" });
                }

                var nextId = PermissionCatalog.Count == 0 ? 1 : PermissionCatalog.Max(item => item.Id) + 1;
                var permission = new PermissionCatalogItem(
                    nextId,
                    normalizedPermission,
                    request.Module.Trim(),
                    request.Description.Trim());

                PermissionCatalog.Add(permission);

                return StatusCode(201, new
                {
                    success = true,
                    message = "Permission created successfully",
                    data = new
                    {
                        id = permission.Id,
                        module = permission.Module,
                        permission = permission.Permission,
                        description = permission.Description
                    }
                });
            }
        }

        [HttpPut("permissions/{id:int}")]
        public IActionResult UpdatePermission(int id, [FromBody] PermissionCatalogRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid permission data", errors = ModelState });
            }

            var normalizedPermission = NormalizePermissionKey(request.Permission);
            lock (PermissionCatalogLock)
            {
                var index = PermissionCatalog.FindIndex(item => item.Id == id);
                if (index < 0)
                {
                    return NotFound(new { success = false, message = "Permission not found" });
                }

                if (PermissionCatalog.Any(item => item.Id != id && item.Permission.Equals(normalizedPermission, StringComparison.OrdinalIgnoreCase)))
                {
                    return BadRequest(new { success = false, message = "Permission already exists" });
                }

                var updated = new PermissionCatalogItem(
                    id,
                    normalizedPermission,
                    request.Module.Trim(),
                    request.Description.Trim());

                var previousPermission = PermissionCatalog[index].Permission;
                PermissionCatalog[index] = updated;

                if (!string.Equals(previousPermission, normalizedPermission, StringComparison.OrdinalIgnoreCase))
                {
                    UpdateRolePermissionClaims(previousPermission, normalizedPermission);
                }

                return Ok(new
                {
                    success = true,
                    message = "Permission updated successfully",
                    data = new
                    {
                        id = updated.Id,
                        module = updated.Module,
                        permission = updated.Permission,
                        description = updated.Description
                    }
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] RoleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid role data", errors = ModelState });
            }

            var roleName = request.Name.Trim();
            if (await _roleManager.RoleExistsAsync(roleName))
            {
                return BadRequest(new { success = false, message = "Role already exists" });
            }

            var role = new IdentityRole(roleName);
            var createResult = await _roleManager.CreateAsync(role);
            if (!createResult.Succeeded)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to create role",
                    errors = createResult.Errors.Select(e => e.Description)
                });
            }

            await SyncRoleClaimsAsync(role, request.Description, request.Permissions);
            return StatusCode(201, new { success = true, data = await BuildRoleDtoAsync(role), message = "Role created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(string id, [FromBody] RoleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid role data", errors = ModelState });
            }

            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound(new { success = false, message = "Role not found" });
            }

            var newName = request.Name.Trim();
            var existingRole = await _roleManager.FindByNameAsync(newName);
            if (existingRole != null && existingRole.Id != id)
            {
                return BadRequest(new { success = false, message = "Role name already exists" });
            }

            role.Name = newName;
            role.NormalizedName = newName.ToUpperInvariant();
            var updateResult = await _roleManager.UpdateAsync(role);
            if (!updateResult.Succeeded)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to update role",
                    errors = updateResult.Errors.Select(e => e.Description)
                });
            }

            await SyncRoleClaimsAsync(role, request.Description, request.Permissions);
            return Ok(new { success = true, data = await BuildRoleDtoAsync(role), message = "Role updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound(new { success = false, message = "Role not found" });
            }

            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);
            if (usersInRole.Count > 0)
            {
                return BadRequest(new { success = false, message = "Cannot delete a role that is assigned to users" });
            }

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to delete role",
                    errors = result.Errors.Select(e => e.Description)
                });
            }

            return Ok(new { success = true, message = "Role deleted successfully" });
        }

        private async Task SyncRoleClaimsAsync(IdentityRole role, string? description, IEnumerable<string>? permissions)
        {
            var existingClaims = await _roleManager.GetClaimsAsync(role);
            var managedClaims = existingClaims.Where(c => c.Type == "description" || c.Type == "permission").ToList();
            if (managedClaims.Count > 0)
            {
                foreach (var claim in managedClaims)
                {
                    await _roleManager.RemoveClaimAsync(role, claim);
                }
            }

            if (!string.IsNullOrWhiteSpace(description))
            {
                await _roleManager.AddClaimAsync(role, new System.Security.Claims.Claim("description", description.Trim()));
            }

            var permissionList = (permissions ?? Array.Empty<string>())
                .Where(p => !string.IsNullOrWhiteSpace(p))
                .Select(p => p.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            foreach (var permission in permissionList)
            {
                await _roleManager.AddClaimAsync(role, new System.Security.Claims.Claim("permission", permission));
            }
        }

        private async Task<object> BuildRoleDtoAsync(IdentityRole role)
        {
            var claims = await _roleManager.GetClaimsAsync(role);
            var permissions = claims.Where(c => c.Type == "permission").Select(c => c.Value).Distinct().OrderBy(x => x).ToList();
            var description = claims.FirstOrDefault(c => c.Type == "description")?.Value;
            var users = await _userManager.GetUsersInRoleAsync(role.Name!);

            return new
            {
                id = role.Id,
                name = role.Name,
                description,
                userCount = users.Count,
                permissions,
                color = ResolveColor(role.Name ?? string.Empty)
            };
        }

        private static string ResolveColor(string roleName)
        {
            var normalized = roleName.ToLowerInvariant();
            if (normalized.Contains("admin")) return "red";
            if (normalized.Contains("manager")) return "blue";
            if (normalized.Contains("front")) return "green";
            if (normalized.Contains("housekeeping")) return "yellow";
            return "gray";
        }

        private static string NormalizePermissionKey(string value)
        {
            var trimmed = value.Trim();
            if (string.IsNullOrWhiteSpace(trimmed))
            {
                return string.Empty;
            }

            var normalized = trimmed
                .Replace(" ", "-", StringComparison.Ordinal)
                .Replace("_", "-", StringComparison.Ordinal)
                .ToLower(CultureInfo.InvariantCulture);

            return normalized;
        }

        private void UpdateRolePermissionClaims(string oldPermission, string newPermission)
        {
            var roles = _roleManager.Roles.ToList();

            foreach (var role in roles)
            {
                var claims = _roleManager.GetClaimsAsync(role).GetAwaiter().GetResult();
                var matchingClaims = claims
                    .Where(c => c.Type == "permission" && string.Equals(c.Value, oldPermission, StringComparison.OrdinalIgnoreCase))
                    .ToList();

                foreach (var claim in matchingClaims)
                {
                    _roleManager.RemoveClaimAsync(role, claim).GetAwaiter().GetResult();
                }

                if (matchingClaims.Count > 0)
                {
                    _roleManager.AddClaimAsync(role, new System.Security.Claims.Claim("permission", newPermission)).GetAwaiter().GetResult();
                }
            }
        }

        private sealed record PermissionCatalogItem(int Id, string Permission, string Module, string Description);
    }

    public class RoleRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public List<string> Permissions { get; set; } = new();
    }

    public class PermissionCatalogRequest
    {
        [Required]
        public string Module { get; set; } = string.Empty;

        [Required]
        public string Permission { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;
    }
}
