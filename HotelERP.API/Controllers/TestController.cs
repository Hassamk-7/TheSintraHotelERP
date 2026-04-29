using Microsoft.AspNetCore.Mvc;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                message = "Hotel ERP API is running successfully!", 
                timestamp = DateTime.UtcNow,
                status = "Healthy",
                version = "1.0.0"
            });
        }

        [HttpGet("system-info")]
        public IActionResult GetSystemInfo()
        {
            return Ok(new
            {
                SystemName = "Hotel ERP System",
                Version = "1.0.0",
                Environment = "Development",
                Status = "Production Ready",
                Modules = new[]
                {
                    "Master Entry (27 forms)",
                    "Front Office (11 forms)",
                    "Restaurant & Bar (6 forms)",
                    "Housekeeping (5 forms)",
                    "Accounting (16 forms)",
                    "Inventory (5 forms)",
                    "Payroll & HR (10 forms)",
                    "Rooms Management (5 forms)",
                    "Guest Services (6 forms)",
                    "Marketing & CRM (6 forms)"
                },
                TotalEndpoints = "200+",
                DatabaseModels = "100+",
                Completion = "100%"
            });
        }
    }
}
