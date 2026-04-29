using HotelERP.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Data
{
    public static class SeedData
    {
        public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            string[] roleNames = { "Admin", "Manager", "Receptionist", "Housekeeping", "RestaurantStaff", "User" };

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }
        }

        public static async Task SeedAdminUser(UserManager<ApplicationUser> userManager)
        {
            var adminEmail = "admin@hotelerp.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "User",
                    EmailConfirmed = true
                };

                var createAdmin = await userManager.CreateAsync(admin, "Admin@123");
                if (createAdmin.Succeeded)
                {
                    // Check if Admin role exists before adding user to role
                    var roleExists = await userManager.IsInRoleAsync(admin, "Admin");
                    if (!roleExists)
                    {
                        await userManager.AddToRoleAsync(admin, "Admin");
                    }
                }
                else
                {
                    // Log the errors for debugging
                    var errors = string.Join(", ", createAdmin.Errors.Select(e => e.Description));
                    Console.WriteLine($"Failed to create admin user: {errors}");
                }
            }
        }

        public static async Task SeedRoomTypes(HotelDbContext context)
        {
            if (!await context.RoomTypes.AnyAsync())
            {
                var roomTypes = new List<RoomType>
                {
                    new RoomType { Name = "Standard", Description = "Standard room with basic amenities", BasePrice = 100, MaxOccupancy = 2 },
                    new RoomType { Name = "Deluxe", Description = "Spacious room with additional amenities", BasePrice = 150, MaxOccupancy = 2 },
                    new RoomType { Name = "Suite", Description = "Luxury suite with separate living area", BasePrice = 250, MaxOccupancy = 4 },
                    new RoomType { Name = "Executive", Description = "Executive room with work desk and premium amenities", BasePrice = 200, MaxOccupancy = 2 },
                    new RoomType { Name = "Family", Description = "Large room suitable for families", BasePrice = 180, MaxOccupancy = 4 }
                };

                await context.RoomTypes.AddRangeAsync(roomTypes);
                await context.SaveChangesAsync();
            }
        }

        public static async Task SeedPlans(HotelDbContext context)
        {
            if (!await context.Plans.AnyAsync())
            {
                var plans = new List<Plan>
                {
                    new Plan { Name = "Room Only", Code = "RO", Description = "Accommodation only, no meals included", BasePrice = 0, IsBreakfastIncluded = false, IsLunchIncluded = false, IsDinnerIncluded = false, IsActive = true },
                    new Plan { Name = "Bed & Breakfast", Code = "BB", Description = "Accommodation with breakfast included", BasePrice = 15, IsBreakfastIncluded = true, IsLunchIncluded = false, IsDinnerIncluded = false, IsActive = true },
                    new Plan { Name = "Half Board", Code = "HB", Description = "Accommodation with breakfast and dinner included", BasePrice = 30, IsBreakfastIncluded = true, IsLunchIncluded = false, IsDinnerIncluded = true, IsActive = true },
                    new Plan { Name = "Full Board", Code = "FB", Description = "Accommodation with all meals included", BasePrice = 45, IsBreakfastIncluded = true, IsLunchIncluded = true, IsDinnerIncluded = true, IsActive = true },
                    new Plan { Name = "All Inclusive", Code = "AI", Description = "All meals, snacks, and selected beverages included", BasePrice = 75, IsBreakfastIncluded = true, IsLunchIncluded = true, IsDinnerIncluded = true, IsActive = true }
                };

                await context.Plans.AddRangeAsync(plans);
                await context.SaveChangesAsync();
            }
        }

        public static async Task SeedExpenseTypes(HotelDbContext context)
        {
            if (!await context.ExpenseTypes.AnyAsync())
            {
                var expenseTypes = new List<ExpenseType>
                {
                    new ExpenseType { Name = "Utilities", Description = "Electricity, water, gas, etc." },
                    new ExpenseType { Name = "Salaries", Description = "Staff salaries and wages" },
                    new ExpenseType { Name = "Maintenance", Description = "Building and equipment maintenance" },
                    new ExpenseType { Name = "Supplies", Description = "Office and cleaning supplies" },
                    new ExpenseType { Name = "Marketing", Description = "Advertising and promotional expenses" },
                    new ExpenseType { Name = "Food & Beverage", Description = "Restaurant and bar supplies" },
                    new ExpenseType { Name = "Housekeeping", Description = "Linens, toiletries, and cleaning products" },
                    new ExpenseType { Name = "Insurance", Description = "Property and liability insurance" },
                    new ExpenseType { Name = "Taxes", Description = "Property and business taxes" },
                    new ExpenseType { Name = "Other", Description = "Miscellaneous expenses" }
                };

                await context.ExpenseTypes.AddRangeAsync(expenseTypes);
                await context.SaveChangesAsync();
            }
        }

        public static async Task SeedDishCategories(HotelDbContext context)
        {
            if (!await context.DishCategories.AnyAsync())
            {
                var categories = new List<DishCategory>
                {
                    new DishCategory { Name = "Starters", Description = "Appetizers and small plates" },
                    new DishCategory { Name = "Main Course", Description = "Main dishes" },
                    new DishCategory { Name = "Desserts", Description = "Sweet treats and desserts" },
                    new DishCategory { Name = "Beverages", Description = "Drinks and beverages" },
                    new DishCategory { Name = "Breakfast", Description = "Breakfast items" },
                    new DishCategory { Name = "Salads", Description = "Fresh salads" },
                    new DishCategory { Name = "Soups", Description = "Hot and cold soups" },
                    new DishCategory { Name = "Sides", Description = "Side dishes" },
                    new DishCategory { Name = "Specials", Description = "Chef's specials" }
                };

                await context.DishCategories.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }
        }
    }
}
