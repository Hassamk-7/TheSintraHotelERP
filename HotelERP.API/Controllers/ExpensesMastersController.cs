using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    public class ExpensesMastersController : BaseController
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<ExpensesMastersController> _logger;

        public ExpensesMastersController(HotelDbContext context, ILogger<ExpensesMastersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetExpenses()
        {
            try
            {
                var expenses = await _context.ExpensesMasters.Where(e => e.IsActive).ToListAsync();
                return HandleSuccess(expenses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving expenses");
                return HandleError("An error occurred while retrieving expenses");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] ExpensesMaster expense)
        {
            if (!ModelState.IsValid)
            {
                return HandleError("Invalid expense data");
            }

            try
            {
                expense.IsActive = true;
                _context.ExpensesMasters.Add(expense);
                await _context.SaveChangesAsync();

                return HandleCreated(expense, "Expense created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating expense");
                return HandleError("An error occurred while creating the expense");
            }
        }
    }
}
