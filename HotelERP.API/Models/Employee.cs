using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class Employee : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string EmployeeId { get; set; }

        // Alias for EmployeeId to match PayrollHRController expectations
        public string EmployeeCode 
        { 
            get => EmployeeId; 
            set => EmployeeId = value; 
        }

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
        
        // Alias for Designation to match PayrollHRController
        public string Position 
        { 
            get => Designation; 
            set => Designation = value; 
        }

        [StringLength(100)]
        public string Department { get; set; }

        public int? DepartmentId { get; set; }

        public int? DesignationId { get; set; }

        public DateTime? JoiningDate { get; set; }

        public DateTime? TerminationDate { get; set; }

        [StringLength(50)]
        public string EmploymentType { get; set; } // Full-time, Part-time, Contract, etc.

        // Basic salary property
        public decimal BasicSalary { get; set; }

        [StringLength(500)]
        public string EmergencyContactName { get; set; }
        
        // Alias for EmergencyContactName to match PayrollHRController
        public string EmergencyContact 
        { 
            get => EmergencyContactName; 
            set => EmergencyContactName = value; 
        }

        [StringLength(50)]
        public string EmergencyContactPhone { get; set; }
        
        // Alias for EmergencyContactPhone to match PayrollHRController
        public string EmergencyPhone 
        { 
            get => EmergencyContactPhone; 
            set => EmergencyContactPhone = value; 
        }

        [StringLength(200)]
        public string EmergencyContactRelation { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Active, On Leave, Terminated, etc.

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation properties
        public virtual ICollection<EmployeeDocument> Documents { get; set; }
        public virtual ICollection<EmployeeAttendance> Attendances { get; set; }
        public virtual ICollection<EmployeePayment> Payments { get; set; }
        public virtual ICollection<EmployeeLeave> Leaves { get; set; }
    }

    public class EmployeeDocument : BaseEntity
    {
        public int EmployeeId { get; set; }
        public string DocumentType { get; set; } // ID Proof, Address Proof, Qualification, etc.
        public string DocumentNumber { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string DocumentPath { get; set; }
        public string Notes { get; set; }

        // Navigation property
        public virtual Employee Employee { get; set; }
    }

    public class EmployeeAttendance : BaseEntity
    {
        public int EmployeeId { get; set; }
        public DateTime AttendanceDate { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string Status { get; set; } = string.Empty; // Present, Absent, Half Day, Leave, Holiday
        public decimal? WorkingHours { get; set; }
        public decimal? OvertimeHours { get; set; }
        public string Notes { get; set; }

        // Navigation property
        public virtual Employee Employee { get; set; }
    }

    public class EmployeePayment : BaseEntity
    {
        public int EmployeeId { get; set; }
        public string PaymentType { get; set; } = string.Empty; // Salary, Bonus, Advance, Deduction, etc.
        public string PaymentMethod { get; set; } = string.Empty; // Bank Transfer, Cash, Check, etc.
        public DateTime PaymentDate { get; set; }
        public string PeriodFrom { get; set; } = string.Empty;
        public string PeriodTo { get; set; } = string.Empty;
        public decimal BasicSalary { get; set; }
        public decimal Allowances { get; set; }
        public decimal Deductions { get; set; }
        public decimal OvertimeAmount { get; set; }
        public decimal Bonus { get; set; }
        public decimal NetSalary { get; set; }
        public string Status { get; set; } = string.Empty; // Pending, Paid, Cancelled
        public string Notes { get; set; }

        // Additional properties for PayrollHRController compatibility
        public int PaymentMonth { get; set; }
        public int PaymentYear { get; set; }
        public decimal GrossSalary { get; set; }
        public decimal TaxDeduction { get; set; }
        public decimal ProvidentFund { get; set; }
        public decimal OtherDeductions { get; set; }

        // Navigation property
        public virtual Employee Employee { get; set; }
    }

    public class EmployeeLeave : BaseEntity
    {
        public int EmployeeId { get; set; }
        public string LeaveType { get; set; } // Annual, Sick, Maternity, Paternity, Unpaid, etc.
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int NumberOfDays { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; } // Pending, Approved, Rejected, Cancelled
        public string ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string Notes { get; set; }

        // Navigation property
        public virtual Employee Employee { get; set; }
    }
}
