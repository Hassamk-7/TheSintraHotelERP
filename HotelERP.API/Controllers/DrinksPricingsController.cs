using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System.Text;

namespace HotelERP.API.Controllers
{
    public class DrinksPricingsController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<DrinksPricingsController> _logger;

        public DrinksPricingsController(HotelDbContext context, ILogger<DrinksPricingsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetDrinksPricings()
        {
            try
            {
                var pricings = await _context.DrinksPricings.Where(d => d.IsActive).ToListAsync();
                return HandleSuccess(pricings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving drinks pricings");
                return HandleError("An error occurred while retrieving drinks pricings");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDrinksPricing(int id)
        {
            try
            {
                var pricing = await _context.DrinksPricings.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (pricing == null)
                    return HandleNotFound("Drinks pricing not found");

                return HandleSuccess(pricing);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving drinks pricing");
                return HandleError("An error occurred while retrieving the drinks pricing");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateDrinksPricing([FromBody] DrinksPricing pricing)
        {
            if (!ModelState.IsValid)
            {
                var errs = ModelState
                    .Where(kvp => kvp.Value?.Errors?.Count > 0)
                    .Select(kvp => new { Field = kvp.Key, Errors = kvp.Value!.Errors.Select(e => e.ErrorMessage).ToList() })
                    .ToList();
                _logger.LogWarning("Invalid drinks pricing data. Errors: {@Errors}", errs);
                return HandleError("Invalid drinks pricing data");
            }

            try
            {
                if (pricing.DrinksMasterId <= 0)
                    return HandleError("DrinksMasterId is required");

                var master = await _context.DrinksMasters.FirstOrDefaultAsync(d => d.Id == pricing.DrinksMasterId && d.IsActive);
                if (master == null)
                    return HandleError("Selected drink not found");

                // Always keep name/code in sync for reporting/search convenience
                pricing.DrinkName = master.Name;
                pricing.DrinkCode = master.Code;

                pricing.ItemMasterId = await EnsureItemMasterForPricing(pricing);
                pricing.IsActive = true;
                pricing.CreatedAt = DateTime.UtcNow;
                pricing.UpdatedAt = DateTime.UtcNow;
                _context.DrinksPricings.Add(pricing);
                await _context.SaveChangesAsync();

                return HandleCreated(pricing, "Drinks pricing created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating drinks pricing. Payload={@Payload}", pricing);
                return HandleError($"An error occurred while creating the drinks pricing: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDrinksPricing(int id, [FromBody] DrinksPricing pricing)
        {
            if (!ModelState.IsValid)
            {
                var errs = ModelState
                    .Where(kvp => kvp.Value?.Errors?.Count > 0)
                    .Select(kvp => new { Field = kvp.Key, Errors = kvp.Value!.Errors.Select(e => e.ErrorMessage).ToList() })
                    .ToList();
                _logger.LogWarning("Invalid drinks pricing data (update). Id={Id}. Errors: {@Errors}", id, errs);
                return HandleError("Invalid drinks pricing data");
            }

            try
            {
                var existing = await _context.DrinksPricings.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (existing == null)
                    return HandleNotFound("Drinks pricing not found");

                if (pricing.DrinksMasterId <= 0)
                    return HandleError("DrinksMasterId is required");

                var master = await _context.DrinksMasters.FirstOrDefaultAsync(d => d.Id == pricing.DrinksMasterId && d.IsActive);
                if (master == null)
                    return HandleError("Selected drink not found");

                existing.DrinksMasterId = pricing.DrinksMasterId;
                // Keep name/code in sync with master
                existing.DrinkName = master.Name;
                existing.DrinkCode = master.Code;
                existing.Quantity = pricing.Quantity;
                existing.Price = pricing.Price;
                existing.CostPrice = pricing.CostPrice;
                existing.PriceCategory = pricing.PriceCategory;
                existing.IsHappyHourPrice = pricing.IsHappyHourPrice;
                existing.HappyHourPrice = pricing.HappyHourPrice;
                existing.EffectiveFrom = pricing.EffectiveFrom;
                existing.EffectiveTo = pricing.EffectiveTo;
                existing.UpdatedAt = DateTime.UtcNow;

                existing.ItemMasterId = await EnsureItemMasterForPricing(existing);

                await _context.SaveChangesAsync();
                return HandleSuccess(existing, "Drinks pricing updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating drinks pricing. Id={Id}. Payload={@Payload}", id, pricing);
                return HandleError($"An error occurred while updating the drinks pricing: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDrinksPricing(int id)
        {
            try
            {
                var existing = await _context.DrinksPricings.FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
                if (existing == null)
                    return HandleNotFound("Drinks pricing not found");

                existing.IsActive = false;
                existing.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return HandleSuccess(null, "Drinks pricing deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting drinks pricing");
                return HandleError("An error occurred while deleting the drinks pricing");
            }
        }

        private async Task<int?> EnsureItemMasterForPricing(DrinksPricing pricing)
        {
            if (pricing == null)
                return null;

            var resolvedItem = await ResolveExistingItemMaster(pricing);
            if (resolvedItem != null)
                return resolvedItem.Id;

            var code = await GenerateUniqueItemCode(pricing.DrinkCode, pricing.Quantity);

            var item = new ItemMaster
            {
                Name = BuildItemName(pricing.DrinkName, pricing.Quantity),
                Code = code,
                Category = "Food & Beverage",
                Unit = "Units",
                PurchasePrice = pricing.CostPrice,
                SalePrice = pricing.Price,
                MinStockLevel = 0,
                MaxStockLevel = 0,
                CurrentStock = 0,
                Supplier = string.Empty,
                Brand = string.Empty,
                IsPerishable = false,
                ExpiryDate = null,
                StorageLocation = "Bar",
                Description = string.Empty,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.ItemMasters.Add(item);
            await _context.SaveChangesAsync();

            return item.Id;
        }

        private async Task<ItemMaster> ResolveExistingItemMaster(DrinksPricing pricing)
        {
            if (pricing.ItemMasterId.HasValue)
            {
                var linked = await _context.ItemMasters.FirstOrDefaultAsync(i => i.Id == pricing.ItemMasterId.Value && i.IsActive);
                if (linked != null)
                {
                    linked.Name = BuildItemName(pricing.DrinkName, pricing.Quantity);
                    linked.PurchasePrice = pricing.CostPrice;
                    linked.SalePrice = pricing.Price;
                    linked.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    return linked;
                }
            }

            var expectedName = BuildItemName(pricing.DrinkName, pricing.Quantity);
            var byName = await _context.ItemMasters.FirstOrDefaultAsync(i => i.Name == expectedName && i.IsActive);
            if (byName != null)
            {
                byName.PurchasePrice = pricing.CostPrice;
                byName.SalePrice = pricing.Price;
                byName.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return byName;
            }

            return null;
        }

        private static string BuildItemName(string drinkName, string quantity)
        {
            var safeDrinkName = (drinkName ?? string.Empty).Trim();
            var safeQuantity = (quantity ?? string.Empty).Trim();

            if (string.IsNullOrEmpty(safeQuantity))
                return safeDrinkName;

            return $"{safeDrinkName} ({safeQuantity})";
        }

        private async Task<string> GenerateUniqueItemCode(string drinkCode, string quantity)
        {
            var baseCode = BuildItemCode(drinkCode, quantity);
            if (!await _context.ItemMasters.AnyAsync(i => i.Code == baseCode && i.IsActive))
                return baseCode;

            // Try with short numeric suffix within 20 chars
            for (var i = 1; i <= 99; i++)
            {
                var suffix = i.ToString("D2");
                var candidate = baseCode;
                if (candidate.Length > 18)
                    candidate = candidate.Substring(0, 18);
                candidate = candidate + suffix;

                if (!await _context.ItemMasters.AnyAsync(x => x.Code == candidate && x.IsActive))
                    return candidate;
            }

            // Fallback
            return $"{(drinkCode ?? "ITEM").ToUpperInvariant().Substring(0, Math.Min(18, (drinkCode ?? "ITEM").Length))}{new Random().Next(10, 99)}";
        }

        private static string BuildItemCode(string drinkCode, string quantity)
        {
            var dc = (drinkCode ?? string.Empty).Trim().ToUpperInvariant();
            var q = NormalizeCodePart(quantity);

            if (string.IsNullOrEmpty(dc))
                dc = "DRINK";

            if (string.IsNullOrEmpty(q))
                return dc.Length > 20 ? dc.Substring(0, 20) : dc;

            var remaining = 20 - dc.Length - 1;
            if (remaining <= 0)
                return dc.Length > 20 ? dc.Substring(0, 20) : dc;

            if (q.Length > remaining)
                q = q.Substring(0, remaining);

            return $"{dc}_{q}";
        }

        private static string NormalizeCodePart(string value)
        {
            var v = (value ?? string.Empty).Trim().ToUpperInvariant();
            if (string.IsNullOrEmpty(v))
                return string.Empty;

            var sb = new StringBuilder(v.Length);
            foreach (var ch in v)
            {
                if ((ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9'))
                    sb.Append(ch);
            }

            return sb.ToString();
        }
    }
}
