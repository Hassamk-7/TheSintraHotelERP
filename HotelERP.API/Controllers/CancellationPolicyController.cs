using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CancellationPolicyController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<CancellationPolicyController> _logger;

        public CancellationPolicyController(HotelDbContext context, ILogger<CancellationPolicyController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/cancellationpolicy/hotel/{hotelId}
        [HttpGet("hotel/{hotelId}")]
        public async Task<IActionResult> GetPoliciesByHotel(int hotelId)
        {
            try
            {
                var policies = await _context.CancellationPolicies
                    .Where(p => p.HotelId == hotelId && p.IsActive)
                    .Include(p => p.RatePlanPolicies)
                    .OrderByDescending(p => p.Priority)
                    .ThenBy(p => p.Name)
                    .ToListAsync();

                var dtos = policies.Select(p => new CancellationPolicyListDto
                {
                    Id = p.Id,
                    Code = p.Code,
                    Description = p.Description,
                    Name = p.Name,
                    IsRefundable = p.IsRefundable,
                    FreeCancelText = p.FreeCancellationHours.HasValue ? $"{p.FreeCancellationHours}h" : "—",
                    PenaltyText = p.PenaltyAfterDeadline ?? "—",
                    NoShowText = p.NoShowPenalty ?? "—",
                    EarlyDepText = p.EarlyDeparturePenalty ?? "—",
                    UsedByRatePlans = string.Join(", ", p.RatePlanPolicies.Select(rp => rp.Plan?.Name ?? "Unknown")),
                    IsActive = p.IsActive,
                    Status = p.IsActive ? "Active" : "Inactive"
                }).ToList();

                return Ok(new { success = true, data = dtos });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching cancellation policies for hotel {HotelId}", hotelId);
                return StatusCode(500, new { success = false, message = "Error fetching policies" });
            }
        }

        // GET: api/cancellationpolicy/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPolicy(int id)
        {
            try
            {
                var policy = await _context.CancellationPolicies
                    .Include(p => p.RatePlanPolicies)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (policy == null)
                    return NotFound(new { success = false, message = "Policy not found" });

                var dto = new CancellationPolicyDto
                {
                    Id = policy.Id,
                    HotelId = policy.HotelId,
                    Code = policy.Code,
                    Name = policy.Name,
                    Description = policy.Description,
                    IsRefundable = policy.IsRefundable,
                    FreeCancellationHours = policy.FreeCancellationHours,
                    PenaltyAfterDeadline = policy.PenaltyAfterDeadline,
                    PenaltyAppliesToDate = policy.PenaltyAppliesToDate,
                    NoShowPenalty = policy.NoShowPenalty,
                    EarlyDeparturePenalty = policy.EarlyDeparturePenalty,
                    Timezone = policy.Timezone,
                    Priority = policy.Priority,
                    Source = policy.Source,
                    DisplayTextDefault = policy.DisplayTextDefault,
                    DisplayTextWebsite = policy.DisplayTextWebsite,
                    DisplayTextBookingCom = policy.DisplayTextBookingCom,
                    DisplayTextExpedia = policy.DisplayTextExpedia,
                    DisplayTextOTA = policy.DisplayTextOTA,
                    AppliesAllChannels = policy.AppliesAllChannels,
                    IsActive = policy.IsActive,
                    CreatedAt = policy.CreatedAt,
                    UpdatedAt = policy.UpdatedAt
                };

                return Ok(new { success = true, data = dto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching policy {Id}", id);
                return StatusCode(500, new { success = false, message = "Error fetching policy" });
            }
        }

        // POST: api/cancellationpolicy
        [HttpPost]
        public async Task<IActionResult> CreatePolicy([FromBody] CancellationPolicyCreateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check for duplicate code
                var exists = await _context.CancellationPolicies
                    .AnyAsync(p => p.HotelId == dto.HotelId && p.Code == dto.Code);

                if (exists)
                    return BadRequest(new { success = false, message = "Policy code already exists" });

                var policy = new CancellationPolicy
                {
                    HotelId = dto.HotelId,
                    Code = dto.Code,
                    Name = dto.Name,
                    Description = dto.Description,
                    IsRefundable = dto.IsRefundable,
                    FreeCancellationHours = dto.FreeCancellationHours,
                    PenaltyAfterDeadline = dto.PenaltyAfterDeadline,
                    PenaltyAppliesToDate = dto.PenaltyAppliesToDate,
                    NoShowPenalty = dto.NoShowPenalty,
                    EarlyDeparturePenalty = dto.EarlyDeparturePenalty,
                    Timezone = dto.Timezone,
                    Priority = dto.Priority,
                    Source = dto.Source,
                    DisplayTextDefault = dto.DisplayTextDefault,
                    DisplayTextWebsite = dto.DisplayTextWebsite,
                    DisplayTextBookingCom = dto.DisplayTextBookingCom,
                    DisplayTextExpedia = dto.DisplayTextExpedia,
                    DisplayTextOTA = dto.DisplayTextOTA,
                    AppliesAllChannels = dto.AppliesAllChannels,
                    IsActive = true
                };

                _context.CancellationPolicies.Add(policy);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Cancellation policy created: {Code}", policy.Code);

                return Ok(new { success = true, data = policy, message = "Policy created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating cancellation policy");
                return StatusCode(500, new { success = false, message = "Error creating policy" });
            }
        }

        // PUT: api/cancellationpolicy/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePolicy(int id, [FromBody] CancellationPolicyUpdateDto dto)
        {
            try
            {
                var policy = await _context.CancellationPolicies.FindAsync(id);
                if (policy == null)
                    return NotFound(new { success = false, message = "Policy not found" });

                policy.Code = dto.Code;
                policy.Name = dto.Name;
                policy.Description = dto.Description;
                policy.IsRefundable = dto.IsRefundable;
                policy.FreeCancellationHours = dto.FreeCancellationHours;
                policy.PenaltyAfterDeadline = dto.PenaltyAfterDeadline;
                policy.PenaltyAppliesToDate = dto.PenaltyAppliesToDate;
                policy.NoShowPenalty = dto.NoShowPenalty;
                policy.EarlyDeparturePenalty = dto.EarlyDeparturePenalty;
                policy.Timezone = dto.Timezone;
                policy.Priority = dto.Priority;
                policy.DisplayTextDefault = dto.DisplayTextDefault;
                policy.DisplayTextWebsite = dto.DisplayTextWebsite;
                policy.DisplayTextBookingCom = dto.DisplayTextBookingCom;
                policy.DisplayTextExpedia = dto.DisplayTextExpedia;
                policy.DisplayTextOTA = dto.DisplayTextOTA;
                policy.AppliesAllChannels = dto.AppliesAllChannels;
                policy.IsActive = dto.IsActive;
                policy.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Cancellation policy updated: {Code}", policy.Code);

                return Ok(new { success = true, data = policy, message = "Policy updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating policy {Id}", id);
                return StatusCode(500, new { success = false, message = "Error updating policy" });
            }
        }

        // DELETE: api/cancellationpolicy/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePolicy(int id)
        {
            try
            {
                var policy = await _context.CancellationPolicies.FindAsync(id);
                if (policy == null)
                    return NotFound(new { success = false, message = "Policy not found" });

                // Check if policy is linked to rate plans
                var linkedPlans = await _context.RatePlanCancellationPolicies
                    .Where(rp => rp.CancellationPolicyId == id)
                    .CountAsync();

                if (linkedPlans > 0)
                    return BadRequest(new { success = false, message = $"Cannot delete policy linked to {linkedPlans} rate plan(s)" });

                _context.CancellationPolicies.Remove(policy);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Cancellation policy deleted: {Code}", policy.Code);

                return Ok(new { success = true, message = "Policy deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting policy {Id}", id);
                return StatusCode(500, new { success = false, message = "Error deleting policy" });
            }
        }

        // POST: api/cancellationpolicy/{policyId}/link-plan
        [HttpPost("{policyId}/link-plan")]
        public async Task<IActionResult> LinkPlan(int policyId, [FromBody] RatePlanCancellationPolicyCreateDto dto)
        {
            try
            {
                var policy = await _context.CancellationPolicies.FindAsync(policyId);
                if (policy == null)
                    return NotFound(new { success = false, message = "Policy not found" });

                var plan = await _context.Plans.FindAsync(dto.PlanId);
                if (plan == null)
                    return NotFound(new { success = false, message = "Plan not found" });

                // Check if already linked
                var existing = await _context.RatePlanCancellationPolicies
                    .AnyAsync(rp => rp.PlanId == dto.PlanId && rp.CancellationPolicyId == policyId);

                if (existing)
                    return BadRequest(new { success = false, message = "Policy already linked to this plan" });

                var link = new RatePlanCancellationPolicy
                {
                    PlanId = dto.PlanId,
                    CancellationPolicyId = policyId,
                    Priority = dto.Priority
                };

                _context.RatePlanCancellationPolicies.Add(link);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Cancellation policy {PolicyId} linked to plan {PlanId}", policyId, dto.PlanId);

                return Ok(new { success = true, message = "Policy linked to plan successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error linking policy to plan");
                return StatusCode(500, new { success = false, message = "Error linking policy" });
            }
        }

        // DELETE: api/cancellationpolicy/{policyId}/unlink-plan/{planId}
        [HttpDelete("{policyId}/unlink-plan/{planId}")]
        public async Task<IActionResult> UnlinkPlan(int policyId, int planId)
        {
            try
            {
                var link = await _context.RatePlanCancellationPolicies
                    .FirstOrDefaultAsync(rp => rp.CancellationPolicyId == policyId && rp.PlanId == planId);

                if (link == null)
                    return NotFound(new { success = false, message = "Link not found" });

                _context.RatePlanCancellationPolicies.Remove(link);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Cancellation policy {PolicyId} unlinked from plan {PlanId}", policyId, planId);

                return Ok(new { success = true, message = "Policy unlinked from plan successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error unlinking policy from plan");
                return StatusCode(500, new { success = false, message = "Error unlinking policy" });
            }
        }

        // GET: api/cancellationpolicy/plan/{planId}
        [HttpGet("plan/{planId}")]
        public async Task<IActionResult> GetPoliciesByPlan(int planId)
        {
            try
            {
                var policies = await _context.RatePlanCancellationPolicies
                    .Where(rp => rp.PlanId == planId)
                    .Include(rp => rp.CancellationPolicy)
                    .OrderByDescending(rp => rp.Priority)
                    .Select(rp => new RatePlanCancellationPolicyDto
                    {
                        Id = rp.Id,
                        PlanId = rp.PlanId,
                        CancellationPolicyId = rp.CancellationPolicyId,
                        PolicyCode = rp.CancellationPolicy.Code,
                        PolicyName = rp.CancellationPolicy.Name,
                        Priority = rp.Priority
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = policies });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching policies for plan {PlanId}", planId);
                return StatusCode(500, new { success = false, message = "Error fetching policies" });
            }
        }

    }
}
