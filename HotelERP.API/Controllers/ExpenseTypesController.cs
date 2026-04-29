using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    public class ExpenseTypesController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<ExpenseTypesController> _logger;

        public ExpenseTypesController(HotelDbContext context, ILogger<ExpenseTypesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetExpenseTypes()
        {
            try
            {
                var types = await _context.ExpenseTypes.Where(e => e.IsActive).ToListAsync();
                return HandleSuccess(types);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving expense types");
                return HandleError("An error occurred while retrieving expense types");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpenseType([FromBody] ExpenseType expenseType)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid expense type data");
            }

            try
            {
                expenseType.IsActive = true;
                _context.ExpenseTypes.Add(expenseType);
                await _context.SaveChangesAsync();

                return HandleCreated(expenseType, "Expense type created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating expense type");
                return HandleError("An error occurred while creating the expense type");
            }
        }
    }
}
