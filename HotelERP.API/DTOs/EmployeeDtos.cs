using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class EmployeeDto : BaseDto
    {
        [Required]
        [StringLength(50)]
        public string EmployeeId { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [StringLength(100)]
        public string MiddleName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(20)]
        public string Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(20)]
        public string MaritalStatus { get; set; }

        [StringLength(200)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(50)]
        public string PhoneNumber { get; set; }

        [StringLength(50)]
        public string MobileNumber { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string State { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(20)]
        public string PostalCode { get; set; }

        [StringLength(100)]
        public string Designation { get; set; }

        [StringLength(100)]
        public string Department { get; set; }

        public DateTime? JoiningDate { get; set; }

        public DateTime? TerminationDate { get; set; }

        [StringLength(50)]
        public string EmploymentType { get; set; }

        [StringLength(500)]
        public string EmergencyContactName { get; set; }

        [StringLength(50)]
        public string EmergencyContactPhone { get; set; }

        [StringLength(200)]
        public string EmergencyContactRelation { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }

    public class EmployeeCreateDto
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [StringLength(100)]
        public string MiddleName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(20)]
        public string Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(20)]
        public string MaritalStatus { get; set; }

        [StringLength(200)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(50)]
        public string PhoneNumber { get; set; }

        [StringLength(50)]
        public string MobileNumber { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string State { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(20)]
        public string PostalCode { get; set; }

        [StringLength(100)]
        public string Designation { get; set; }

        [StringLength(100)]
        public string Department { get; set; }

        public DateTime? JoiningDate { get; set; }

        [StringLength(50)]
        public string EmploymentType { get; set; } = "Full-time";

        [StringLength(500)]
        public string EmergencyContactName { get; set; }

        [StringLength(50)]
        public string EmergencyContactPhone { get; set; }

        [StringLength(200)]
        public string EmergencyContactRelation { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }

    public class EmployeeUpdateDto
    {
        [StringLength(100)]
        public string FirstName { get; set; }

        [StringLength(100)]
        public string MiddleName { get; set; }

        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(20)]
        public string Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(20)]
        public string MaritalStatus { get; set; }

        [StringLength(200)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(50)]
        public string PhoneNumber { get; set; }

        [StringLength(50)]
        public string MobileNumber { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string State { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(20)]
        public string PostalCode { get; set; }

        [StringLength(100)]
        public string Designation { get; set; }

        [StringLength(100)]
        public string Department { get; set; }

        public DateTime? JoiningDate { get; set; }
        public DateTime? TerminationDate { get; set; }

        [StringLength(50)]
        public string EmploymentType { get; set; }

        [StringLength(500)]
        public string EmergencyContactName { get; set; }

        [StringLength(50)]
        public string EmergencyContactPhone { get; set; }

        [StringLength(200)]
        public string EmergencyContactRelation { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }

    public class EmployeeDocumentDto : BaseDto
    {
        public int EmployeeId { get; set; }
        public string DocumentType { get; set; }
        public string DocumentNumber { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string DocumentPath { get; set; }
        public string Notes { get; set; }
    }

    public class EmployeeAttendanceDto : BaseDto
    {
        public int EmployeeId { get; set; }
        public DateTime AttendanceDate { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string Status { get; set; }
        public decimal? WorkingHours { get; set; }
        public decimal? OvertimeHours { get; set; }
        public string Notes { get; set; }
    }

    public class EmployeePaymentDto : BaseDto
    {
        public int EmployeeId { get; set; }
        public string PaymentType { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PeriodFrom { get; set; }
        public string PeriodTo { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal Allowances { get; set; }
        public decimal Deductions { get; set; }
        public decimal OvertimeAmount { get; set; }
        public decimal Bonus { get; set; }
        public decimal NetSalary { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
    }

    public class EmployeeLeaveDto : BaseDto
    {
        public int EmployeeId { get; set; }
        public string LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int NumberOfDays { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; }
        public string ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string Notes { get; set; }
    }

    public class CreateEmployeeDto
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(50)]
        public string? Phone { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public int DesignationId { get; set; }

        [Required]
        public DateTime HireDate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Salary { get; set; }
    }

    public class UpdateEmployeeDto
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(50)]
        public string? Phone { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public int DesignationId { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Salary { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active";
    }
}
