using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PayrollHRController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<PayrollHRController> _logger;

        public PayrollHRController(HotelDbContext context, ILogger<PayrollHRController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // EMPLOYEE MANAGEMENT ENDPOINTS
        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "", [FromQuery] string department = "", [FromQuery] string status = "")
        {
            try
            {
                var query = _context.Employees.Where(e => e.IsActive);
                
                if (!string.IsNullOrEmpty(search))
                    query = query.Where(e => e.FirstName.Contains(search) || e.LastName.Contains(search) || e.EmployeeCode.Contains(search));
                
                if (!string.IsNullOrEmpty(department))
                    query = query.Where(e => e.Department == department);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(e => e.Status == status);

                var totalCount = await query.CountAsync();
                var employees = await query
                    .OrderBy(e => e.Department)
                    .ThenBy(e => e.FirstName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = employees, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employees");
                return StatusCode(500, new { success = false, message = "Error retrieving employees" });
            }
        }

        [HttpGet("employees/{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            try
            {
                var employee = await _context.Employees
                    .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

                if (employee == null)
                    return NotFound(new { success = false, message = "Employee not found" });

                return Ok(new { success = true, data = employee });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employee");
                return StatusCode(500, new { success = false, message = "Error retrieving employee" });
            }
        }

        [HttpPost("employees")]
        public async Task<IActionResult> CreateEmployee([FromBody] Employee employee)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if employee code already exists
                var existingEmployee = await _context.Employees.AnyAsync(e => e.EmployeeCode == employee.EmployeeCode && e.IsActive);
                if (existingEmployee)
                    return BadRequest(new { success = false, message = "Employee code already exists" });

                employee.JoiningDate = employee.JoiningDate == default ? DateTime.UtcNow : employee.JoiningDate;
                employee.Status = employee.Status ?? "Active";
                employee.IsActive = true;
                employee.CreatedAt = DateTime.UtcNow;
                employee.UpdatedAt = DateTime.UtcNow;

                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id },
                    new { success = true, data = employee, message = "Employee created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee");
                return StatusCode(500, new { success = false, message = "Error creating employee" });
            }
        }

        [HttpPut("employees/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee employee)
        {
            try
            {
                _logger.LogInformation($"Updating employee {id} with data: EmergencyContactName={employee.EmergencyContactName}, EmergencyContactPhone={employee.EmergencyContactPhone}");
                
                var existingEmployee = await _context.Employees.FindAsync(id);
                if (existingEmployee == null || !existingEmployee.IsActive)
                    return NotFound(new { success = false, message = "Employee not found" });

                // Update all properties
                existingEmployee.EmployeeCode = employee.EmployeeCode ?? existingEmployee.EmployeeCode;
                existingEmployee.FirstName = employee.FirstName ?? existingEmployee.FirstName;
                existingEmployee.MiddleName = employee.MiddleName;
                existingEmployee.LastName = employee.LastName ?? existingEmployee.LastName;
                existingEmployee.Gender = employee.Gender;
                existingEmployee.DateOfBirth = employee.DateOfBirth;
                existingEmployee.MaritalStatus = employee.MaritalStatus;
                existingEmployee.Email = employee.Email ?? existingEmployee.Email;
                existingEmployee.PhoneNumber = employee.PhoneNumber ?? existingEmployee.PhoneNumber;
                existingEmployee.MobileNumber = employee.MobileNumber;
                existingEmployee.Address = employee.Address;
                existingEmployee.City = employee.City;
                existingEmployee.State = employee.State;
                existingEmployee.Country = employee.Country;
                existingEmployee.PostalCode = employee.PostalCode;
                existingEmployee.Designation = employee.Designation;
                existingEmployee.Position = employee.Position ?? existingEmployee.Position;
                existingEmployee.Department = employee.Department ?? existingEmployee.Department;
                existingEmployee.JoiningDate = employee.JoiningDate ?? existingEmployee.JoiningDate;
                existingEmployee.TerminationDate = employee.TerminationDate;
                existingEmployee.EmploymentType = employee.EmploymentType ?? existingEmployee.EmploymentType;
                existingEmployee.BasicSalary = employee.BasicSalary;
                // Use the main properties, not the aliases
                existingEmployee.EmergencyContactName = employee.EmergencyContactName ?? employee.EmergencyContact;
                existingEmployee.EmergencyContactPhone = employee.EmergencyContactPhone ?? employee.EmergencyPhone;
                existingEmployee.EmergencyContactRelation = employee.EmergencyContactRelation;
                existingEmployee.Status = employee.Status ?? existingEmployee.Status;
                existingEmployee.Notes = employee.Notes;
                existingEmployee.DepartmentId = employee.DepartmentId;
                existingEmployee.DesignationId = employee.DesignationId;
                existingEmployee.IsActive = employee.IsActive;
                existingEmployee.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                _logger.LogInformation($"Employee {id} updated successfully. EmergencyContactName={existingEmployee.EmergencyContactName}, EmergencyContactPhone={existingEmployee.EmergencyContactPhone}");
                return Ok(new { success = true, message = "Employee updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee");
                return StatusCode(500, new { success = false, message = "Error updating employee" });
            }
        }

        // EMPLOYEE ATTENDANCE ENDPOINTS
        [HttpGet("employee-attendance")]
        public async Task<IActionResult> GetEmployeeAttendance([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] DateTime? date = null, [FromQuery] int? employeeId = null)
        {
            try
            {
                var query = _context.EmployeeAttendances.Include(a => a.Employee).Where(a => a.IsActive);
                
                if (date.HasValue)
                    query = query.Where(a => a.AttendanceDate.Date == date.Value.Date);
                
                if (employeeId.HasValue)
                    query = query.Where(a => a.EmployeeId == employeeId.Value);

                var totalCount = await query.CountAsync();
                var attendance = await query
                    .OrderByDescending(a => a.AttendanceDate)
                    .ThenBy(a => a.Employee.FirstName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = attendance, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employee attendance");
                return StatusCode(500, new { success = false, message = "Error retrieving employee attendance" });
            }
        }

        [HttpPost("employee-attendance")]
        public async Task<IActionResult> CreateEmployeeAttendance([FromBody] EmployeeAttendance attendance)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if attendance already exists for this employee and date
                var existingAttendance = await _context.EmployeeAttendances
                    .AnyAsync(a => a.EmployeeId == attendance.EmployeeId && 
                                  a.AttendanceDate.Date == attendance.AttendanceDate.Date && 
                                  a.IsActive);
                
                if (existingAttendance)
                    return BadRequest(new { success = false, message = "Attendance already marked for this date" });

                // Calculate working hours if check-in and check-out times are provided
                if (attendance.CheckInTime.HasValue && attendance.CheckOutTime.HasValue)
                {
                    var workingTime = attendance.CheckOutTime.Value - attendance.CheckInTime.Value;
                    attendance.WorkingHours = (decimal)workingTime.TotalHours;
                    
                    // Calculate overtime (assuming 8 hours is standard)
                    if (attendance.WorkingHours > 8)
                        attendance.OvertimeHours = attendance.WorkingHours - 8;
                }

                attendance.Status = attendance.Status ?? "Present";
                attendance.IsActive = true;
                attendance.CreatedAt = DateTime.UtcNow;
                attendance.UpdatedAt = DateTime.UtcNow;

                _context.EmployeeAttendances.Add(attendance);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = attendance, message = "Employee attendance marked successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee attendance");
                return StatusCode(500, new { success = false, message = "Error creating employee attendance" });
            }
        }

        [HttpPut("employee-attendance/{id}")]
        public async Task<IActionResult> UpdateEmployeeAttendance(int id, [FromBody] EmployeeAttendance attendance)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                var existingAttendance = await _context.EmployeeAttendances.FindAsync(id);
                if (existingAttendance == null || !existingAttendance.IsActive)
                    return NotFound(new { success = false, message = "Attendance record not found" });

                // Update properties
                existingAttendance.Status = attendance.Status ?? existingAttendance.Status;
                existingAttendance.CheckInTime = attendance.CheckInTime ?? existingAttendance.CheckInTime;
                existingAttendance.CheckOutTime = attendance.CheckOutTime ?? existingAttendance.CheckOutTime;
                existingAttendance.Notes = attendance.Notes ?? existingAttendance.Notes;

                // Recalculate working hours if check-in and check-out times are provided
                if (existingAttendance.CheckInTime.HasValue && existingAttendance.CheckOutTime.HasValue)
                {
                    var workingTime = existingAttendance.CheckOutTime.Value - existingAttendance.CheckInTime.Value;
                    existingAttendance.WorkingHours = (decimal)workingTime.TotalHours;
                    
                    // Calculate overtime (assuming 8 hours is standard)
                    if (existingAttendance.WorkingHours > 8)
                        existingAttendance.OvertimeHours = existingAttendance.WorkingHours - 8;
                    else
                        existingAttendance.OvertimeHours = 0;
                }
                else
                {
                    existingAttendance.WorkingHours = attendance.WorkingHours ?? 0;
                    existingAttendance.OvertimeHours = attendance.OvertimeHours ?? 0;
                }

                existingAttendance.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, data = existingAttendance, message = "Attendance updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee attendance");
                return StatusCode(500, new { success = false, message = "Error updating employee attendance" });
            }
        }

        // EMPLOYEE PAYMENT ENDPOINTS
        [HttpGet("employee-payments")]
        public async Task<IActionResult> GetEmployeePayments([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? month = null, [FromQuery] int? year = null, [FromQuery] int? employeeId = null)
        {
            try
            {
                var query = _context.EmployeePayments.Include(p => p.Employee).Where(p => p.IsActive);
                
                if (month.HasValue)
                    query = query.Where(p => p.PaymentMonth == month.Value);
                
                if (year.HasValue)
                    query = query.Where(p => p.PaymentYear == year.Value);
                
                if (employeeId.HasValue)
                    query = query.Where(p => p.EmployeeId == employeeId.Value);

                var totalCount = await query.CountAsync();
                var payments = await query
                    .OrderByDescending(p => p.PaymentYear)
                    .ThenByDescending(p => p.PaymentMonth)
                    .ThenBy(p => p.Employee.FirstName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = payments, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employee payments");
                return StatusCode(500, new { success = false, message = "Error retrieving employee payments" });
            }
        }

        [HttpPost("employee-payments")]
        public async Task<IActionResult> CreateEmployeePayment([FromBody] EmployeePayment payment)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                // Check if payment already exists for this employee and month/year
                var existingPayment = await _context.EmployeePayments
                    .AnyAsync(p => p.EmployeeId == payment.EmployeeId && 
                                  p.PaymentMonth == payment.PaymentMonth && 
                                  p.PaymentYear == payment.PaymentYear && 
                                  p.IsActive);
                
                if (existingPayment)
                    return BadRequest(new { success = false, message = "Payment already processed for this month" });

                // Calculate gross salary
                payment.GrossSalary = payment.BasicSalary + payment.Allowances + payment.OvertimeAmount + payment.Bonus;
                
                // Calculate net salary
                payment.NetSalary = payment.GrossSalary - payment.TaxDeduction - payment.ProvidentFund - payment.OtherDeductions;

                payment.PaymentDate = DateTime.UtcNow;
                payment.Status = payment.Status ?? "Pending";
                payment.IsActive = true;
                payment.CreatedAt = DateTime.UtcNow;
                payment.UpdatedAt = DateTime.UtcNow;

                _context.EmployeePayments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = payment, message = "Employee payment processed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee payment");
                return StatusCode(500, new { success = false, message = "Error creating employee payment" });
            }
        }

        // PAYROLL ADVANCE ENDPOINTS
        [HttpGet("payroll-advances")]
        public async Task<IActionResult> GetPayrollAdvances([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "", [FromQuery] int? employeeId = null)
        {
            try
            {
                var query = _context.PayrollAdvances.Include(a => a.Employee).Where(a => a.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(a => a.Status == status);
                
                if (employeeId.HasValue)
                    query = query.Where(a => a.EmployeeId == employeeId.Value);

                var totalCount = await query.CountAsync();
                var advances = await query
                    .OrderByDescending(a => a.RequestDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = advances, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving payroll advances");
                return StatusCode(500, new { success = false, message = "Error retrieving payroll advances" });
            }
        }

        [HttpPost("payroll-advances")]
        public async Task<IActionResult> CreatePayrollAdvance([FromBody] PayrollAdvance advance)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                advance.AdvanceNumber = $"ADV{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                advance.RequestDate = DateTime.UtcNow;
                advance.Status = "Pending";
                advance.OutstandingAmount = advance.RequestedAmount;
                advance.IsActive = true;
                advance.CreatedAt = DateTime.UtcNow;
                advance.UpdatedAt = DateTime.UtcNow;

                _context.PayrollAdvances.Add(advance);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = advance, message = "Payroll advance request created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payroll advance");
                return StatusCode(500, new { success = false, message = "Error creating payroll advance" });
            }
        }

        [HttpPut("payroll-advances/{id}/approve")]
        public async Task<IActionResult> ApprovePayrollAdvance(int id, [FromBody] decimal approvedAmount)
        {
            try
            {
                var advance = await _context.PayrollAdvances.FindAsync(id);
                if (advance == null || !advance.IsActive)
                    return NotFound(new { success = false, message = "Payroll advance not found" });

                advance.ApprovedAmount = approvedAmount;
                advance.Status = "Approved";
                advance.ApprovalDate = DateTime.UtcNow;
                advance.OutstandingAmount = approvedAmount;
                
                // Calculate monthly deduction if installment months specified
                if (advance.InstallmentMonths > 0)
                    advance.MonthlyDeduction = approvedAmount / advance.InstallmentMonths;

                advance.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Payroll advance approved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving payroll advance");
                return StatusCode(500, new { success = false, message = "Error approving payroll advance" });
            }
        }

        // LEAVE MANAGEMENT ENDPOINTS
        [HttpGet("leave-management")]
        public async Task<IActionResult> GetLeaveManagement([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "", [FromQuery] int? employeeId = null)
        {
            try
            {
                var query = _context.LeaveManagements.Include(l => l.Employee).Where(l => l.IsActive);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(l => l.Status == status);
                
                if (employeeId.HasValue)
                    query = query.Where(l => l.EmployeeId == employeeId.Value);

                var totalCount = await query.CountAsync();
                var leaves = await query
                    .OrderByDescending(l => l.FromDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = leaves, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving leave management");
                return StatusCode(500, new { success = false, message = "Error retrieving leave management" });
            }
        }

        [HttpPost("leave-management")]
        public async Task<IActionResult> CreateLeaveManagement([FromBody] LeaveManagement leave)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                leave.LeaveNumber = $"LV{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
                leave.TotalDays = (leave.ToDate - leave.FromDate).Days + 1;
                leave.Status = "Pending";
                leave.IsActive = true;
                leave.CreatedAt = DateTime.UtcNow;
                leave.UpdatedAt = DateTime.UtcNow;

                _context.LeaveManagements.Add(leave);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = leave, message = "Leave application submitted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating leave management");
                return StatusCode(500, new { success = false, message = "Error creating leave management" });
            }
        }

        [HttpPut("leave-management/{id}/approve")]
        public async Task<IActionResult> ApproveLeave(int id, [FromBody] string approvalRemarks)
        {
            try
            {
                var leave = await _context.LeaveManagements.FindAsync(id);
                if (leave == null || !leave.IsActive)
                    return NotFound(new { success = false, message = "Leave application not found" });

                leave.Status = "Approved";
                leave.ApprovalDate = DateTime.UtcNow;
                leave.ApprovalRemarks = approvalRemarks;
                leave.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Leave application approved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving leave");
                return StatusCode(500, new { success = false, message = "Error approving leave" });
            }
        }

        // PERFORMANCE REVIEW ENDPOINTS
        [HttpGet("performance-reviews")]
        public async Task<IActionResult> GetPerformanceReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? employeeId = null)
        {
            try
            {
                var query = _context.PerformanceReviews.Include(r => r.Employee).Where(r => r.IsActive);
                
                if (employeeId.HasValue)
                    query = query.Where(r => r.EmployeeId == employeeId.Value);

                var totalCount = await query.CountAsync();
                var reviews = await query
                    .OrderByDescending(r => r.ReviewDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = reviews, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving performance reviews");
                return StatusCode(500, new { success = false, message = "Error retrieving performance reviews" });
            }
        }

        [HttpPost("performance-reviews")]
        public async Task<IActionResult> CreatePerformanceReview([FromBody] PerformanceReview review)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                review.ReviewDate = DateTime.UtcNow;
                review.IsActive = true;
                review.CreatedAt = DateTime.UtcNow;
                review.UpdatedAt = DateTime.UtcNow;

                _context.PerformanceReviews.Add(review);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = review, message = "Performance review created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating performance review");
                return StatusCode(500, new { success = false, message = "Error creating performance review" });
            }
        }

        // TRAINING PROGRAM ENDPOINTS
        [HttpGet("training-programs")]
        public async Task<IActionResult> GetTrainingPrograms([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string trainingType = "", [FromQuery] string status = "")
        {
            try
            {
                var query = _context.TrainingPrograms.Where(t => t.IsActive);
                
                if (!string.IsNullOrEmpty(trainingType))
                    query = query.Where(t => t.TrainingType == trainingType);
                
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(t => t.Status == status);

                var totalCount = await query.CountAsync();
                var programs = await query
                    .OrderByDescending(t => t.StartDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { success = true, data = programs, totalCount, page, pageSize });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving training programs");
                return StatusCode(500, new { success = false, message = "Error retrieving training programs" });
            }
        }

        [HttpPost("training-programs")]
        public async Task<IActionResult> CreateTrainingProgram([FromBody] TrainingProgram program)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

                program.Status = program.Status ?? "Scheduled";
                program.IsActive = true;
                program.CreatedAt = DateTime.UtcNow;
                program.UpdatedAt = DateTime.UtcNow;

                _context.TrainingPrograms.Add(program);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = program, message = "Training program created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating training program");
                return StatusCode(500, new { success = false, message = "Error creating training program" });
            }
        }

        // DEPARTMENTS AND DESIGNATIONS ENDPOINTS
        [HttpGet("departments")]
        public async Task<IActionResult> GetAllDepartments()
        {
            try
            {
                var departments = await _context.Departments
                    .Where(d => d.IsActive)
                    .OrderBy(d => d.Name)
                    .ToListAsync();

                return Ok(new { success = true, data = departments });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving departments");
                return StatusCode(500, new { success = false, message = "Error retrieving departments" });
            }
        }

        [HttpGet("designations")]
        public async Task<IActionResult> GetAllDesignations([FromQuery] int? departmentId = null)
        {
            try
            {
                var query = _context.Designations.Where(d => d.IsActive);

                if (departmentId.HasValue)
                {
                    query = query.Where(d => d.DepartmentId == departmentId.Value);
                }

                var designations = await query
                    .Include(d => d.Department)
                    .OrderBy(d => d.Title)
                    .ToListAsync();

                return Ok(new { success = true, data = designations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving designations");
                return StatusCode(500, new { success = false, message = "Error retrieving designations" });
            }
        }
    }
}
