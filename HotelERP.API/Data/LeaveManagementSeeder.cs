using HotelERP.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace HotelERP.API.Data
{
    public static class LeaveManagementSeeder
    {
        public static void SeedLeaveData(HotelDbContext context)
        {
            // Check if data already exists
            if (context.LeaveManagements.Any())
            {
                return;
            }

            // Create 15 mock leave records
            var leaves = new List<LeaveManagement>
            {
                new LeaveManagement
                {
                    LeaveNumber = "LV-001",
                    EmployeeId = 1,
                    LeaveType = "Annual",
                    FromDate = new DateTime(2025, 1, 15),
                    ToDate = new DateTime(2025, 1, 20),
                    TotalDays = 6,
                    Reason = "Personal vacation",
                    Status = "Approved",
                    ApprovedBy = "Manager 1",
                    ApprovalDate = new DateTime(2024, 12, 20),
                    ApprovalRemarks = "Approved for vacation",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-002",
                    EmployeeId = 2,
                    LeaveType = "Sick",
                    FromDate = new DateTime(2025, 1, 10),
                    ToDate = new DateTime(2025, 1, 12),
                    TotalDays = 3,
                    Reason = "Medical treatment",
                    Status = "Approved",
                    ApprovedBy = "Manager 2",
                    ApprovalDate = new DateTime(2024, 12, 18),
                    ApprovalRemarks = "Approved for medical reasons",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-003",
                    EmployeeId = 3,
                    LeaveType = "Annual",
                    FromDate = new DateTime(2025, 2, 1),
                    ToDate = new DateTime(2025, 2, 10),
                    TotalDays = 10,
                    Reason = "Family visit",
                    Status = "Pending",
                    ApprovedBy = "",
                    ApprovalDate = null,
                    ApprovalRemarks = "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-004",
                    EmployeeId = 4,
                    LeaveType = "Maternity",
                    FromDate = new DateTime(2025, 3, 1),
                    ToDate = new DateTime(2025, 5, 31),
                    TotalDays = 92,
                    Reason = "Maternity leave",
                    Status = "Approved",
                    ApprovedBy = "HR Manager",
                    ApprovalDate = new DateTime(2024, 12, 15),
                    ApprovalRemarks = "Approved for maternity leave",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-005",
                    EmployeeId = 5,
                    LeaveType = "Casual",
                    FromDate = new DateTime(2025, 1, 25),
                    ToDate = new DateTime(2025, 1, 26),
                    TotalDays = 2,
                    Reason = "Personal work",
                    Status = "Pending",
                    ApprovedBy = "",
                    ApprovalDate = null,
                    ApprovalRemarks = "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-006",
                    EmployeeId = 6,
                    LeaveType = "Sick",
                    FromDate = new DateTime(2025, 1, 5),
                    ToDate = new DateTime(2025, 1, 7),
                    TotalDays = 3,
                    Reason = "Fever and cold",
                    Status = "Approved",
                    ApprovedBy = "Manager 1",
                    ApprovalDate = new DateTime(2024, 12, 22),
                    ApprovalRemarks = "Approved for sick leave",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-007",
                    EmployeeId = 7,
                    LeaveType = "Annual",
                    FromDate = new DateTime(2025, 2, 15),
                    ToDate = new DateTime(2025, 2, 25),
                    TotalDays = 11,
                    Reason = "Holiday trip",
                    Status = "Rejected",
                    ApprovedBy = "Manager 2",
                    ApprovalDate = new DateTime(2024, 12, 19),
                    ApprovalRemarks = "Rejected due to operational requirements",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-008",
                    EmployeeId = 8,
                    LeaveType = "Emergency",
                    FromDate = new DateTime(2025, 1, 8),
                    ToDate = new DateTime(2025, 1, 9),
                    TotalDays = 2,
                    Reason = "Family emergency",
                    Status = "Approved",
                    ApprovedBy = "Manager 1",
                    ApprovalDate = new DateTime(2024, 12, 21),
                    ApprovalRemarks = "Approved for emergency leave",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-009",
                    EmployeeId = 9,
                    LeaveType = "Annual",
                    FromDate = new DateTime(2025, 3, 10),
                    ToDate = new DateTime(2025, 3, 20),
                    TotalDays = 11,
                    Reason = "Vacation",
                    Status = "Pending",
                    ApprovedBy = "",
                    ApprovalDate = null,
                    ApprovalRemarks = "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-010",
                    EmployeeId = 10,
                    LeaveType = "Casual",
                    FromDate = new DateTime(2025, 1, 30),
                    ToDate = new DateTime(2025, 1, 31),
                    TotalDays = 2,
                    Reason = "Personal appointment",
                    Status = "Approved",
                    ApprovedBy = "Manager 2",
                    ApprovalDate = new DateTime(2024, 12, 23),
                    ApprovalRemarks = "Approved for personal appointment",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-011",
                    EmployeeId = 11,
                    LeaveType = "Sick",
                    FromDate = new DateTime(2025, 2, 5),
                    ToDate = new DateTime(2025, 2, 7),
                    TotalDays = 3,
                    Reason = "Dental treatment",
                    Status = "Pending",
                    ApprovedBy = "",
                    ApprovalDate = null,
                    ApprovalRemarks = "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-012",
                    EmployeeId = 12,
                    LeaveType = "Annual",
                    FromDate = new DateTime(2025, 4, 1),
                    ToDate = new DateTime(2025, 4, 15),
                    TotalDays = 15,
                    Reason = "Extended vacation",
                    Status = "Approved",
                    ApprovedBy = "HR Manager",
                    ApprovalDate = new DateTime(2024, 12, 10),
                    ApprovalRemarks = "Approved for extended vacation",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-013",
                    EmployeeId = 13,
                    LeaveType = "Casual",
                    FromDate = new DateTime(2025, 2, 20),
                    ToDate = new DateTime(2025, 2, 21),
                    TotalDays = 2,
                    Reason = "Personal work",
                    Status = "Approved",
                    ApprovedBy = "Manager 1",
                    ApprovalDate = new DateTime(2024, 12, 20),
                    ApprovalRemarks = "Approved for personal work",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-014",
                    EmployeeId = 14,
                    LeaveType = "Emergency",
                    FromDate = new DateTime(2025, 1, 12),
                    ToDate = new DateTime(2025, 1, 13),
                    TotalDays = 2,
                    Reason = "Family matter",
                    Status = "Approved",
                    ApprovedBy = "Manager 2",
                    ApprovalDate = new DateTime(2024, 12, 21),
                    ApprovalRemarks = "Approved for emergency leave",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new LeaveManagement
                {
                    LeaveNumber = "LV-015",
                    EmployeeId = 15,
                    LeaveType = "Annual",
                    FromDate = new DateTime(2025, 5, 1),
                    ToDate = new DateTime(2025, 5, 10),
                    TotalDays = 10,
                    Reason = "Summer vacation",
                    Status = "Pending",
                    ApprovedBy = "",
                    ApprovalDate = null,
                    ApprovalRemarks = "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.LeaveManagements.AddRange(leaves);
            context.SaveChanges();
        }
    }
}
