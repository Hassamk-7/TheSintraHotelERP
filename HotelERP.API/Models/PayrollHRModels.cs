using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class PayrollAdvance : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string AdvanceNumber { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime RequestDate { get; set; }

        public decimal RequestedAmount { get; set; }

        public decimal ApprovedAmount { get; set; }

        [StringLength(500)]
        public string Purpose { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Pending, Approved, Rejected, Paid

        [StringLength(100)]
        public string ApprovedBy { get; set; }

        public DateTime? ApprovalDate { get; set; }

        public DateTime? PaymentDate { get; set; }

        public decimal OutstandingAmount { get; set; }

        public int InstallmentMonths { get; set; }

        public decimal MonthlyDeduction { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual Employee Employee { get; set; }
    }

    public class LeaveManagement : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string LeaveNumber { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        [StringLength(50)]
        public string LeaveType { get; set; } // Annual, Sick, Casual, Emergency, Maternity

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        public int TotalDays { get; set; }

        [StringLength(500)]
        public string Reason { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Pending, Approved, Rejected

        [StringLength(100)]
        public string ApprovedBy { get; set; }

        public DateTime? ApprovalDate { get; set; }

        [StringLength(500)]
        public string ApprovalRemarks { get; set; }

        // Navigation properties
        public virtual Employee Employee { get; set; }
    }

    public class PerformanceReview : BaseEntity
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime ReviewDate { get; set; }

        [Required]
        [StringLength(50)]
        public string ReviewPeriod { get; set; } // Quarterly, Half-Yearly, Annual

        public int OverallRating { get; set; } // 1-5 scale

        public int QualityRating { get; set; }

        public int ProductivityRating { get; set; }

        public int TeamworkRating { get; set; }

        public int CommunicationRating { get; set; }

        [StringLength(500)]
        public string Strengths { get; set; }

        [StringLength(500)]
        public string AreasForImprovement { get; set; }

        [StringLength(500)]
        public string Goals { get; set; }

        [StringLength(100)]
        public string ReviewedBy { get; set; }

        [StringLength(500)]
        public string EmployeeComments { get; set; }

        // Navigation properties
        public virtual Employee Employee { get; set; }
    }

    public class TrainingProgram : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string ProgramName { get; set; }

        [Required]
        [StringLength(20)]
        public string ProgramCode { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string TrainingType { get; set; } // Skills, Compliance, Leadership, Technical

        [StringLength(100)]
        public string Trainer { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int Duration { get; set; } // in hours

        public int MaxParticipants { get; set; }

        public decimal TrainingCost { get; set; }

        [StringLength(100)]
        public string Venue { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Scheduled, Ongoing, Completed, Cancelled

        [StringLength(500)]
        public string Prerequisites { get; set; }

        [StringLength(500)]
        public string Objectives { get; set; }
    }
}
