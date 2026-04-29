using HotelERP.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace HotelERP.API.Data
{
    public static class ChartOfAccountsSeedData
    {
        public static void SeedChartOfAccounts(HotelDbContext context)
        {
            if (context.ChartOfAccounts.Any())
            {
                return; // Already seeded
            }

            var accounts = new List<ChartOfAccount>
            {
                // ========================================
                // ASSETS (1000-1999)
                // ========================================
                
                // Cash & Bank (1000-1099)
                new ChartOfAccount
                {
                    AccountCode = "1000",
                    AccountName = "Cash & Bank",
                    AccountType = "Asset",
                    AccountCategory = "Current Asset",
                    Level = 1,
                    IsGroup = true,
                    AllowPosting = false,
                    IsSystemAccount = true,
                    BalanceType = "Debit",
                    DisplayOrder = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1001",
                    AccountName = "Cash in Hand",
                    AccountType = "Asset",
                    AccountCategory = "Cash",
                    ParentAccountCode = "1000",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Debit",
                    DisplayOrder = 2,
                    IsReconcilable = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1002",
                    AccountName = "Bank Account - Main",
                    AccountType = "Asset",
                    AccountCategory = "Bank",
                    ParentAccountCode = "1000",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Debit",
                    DisplayOrder = 3,
                    IsReconcilable = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1003",
                    AccountName = "Petty Cash",
                    AccountType = "Asset",
                    AccountCategory = "Cash",
                    ParentAccountCode = "1000",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 4,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Accounts Receivable (1100-1199)
                new ChartOfAccount
                {
                    AccountCode = "1100",
                    AccountName = "Accounts Receivable",
                    AccountType = "Asset",
                    AccountCategory = "Current Asset",
                    Level = 1,
                    IsGroup = true,
                    AllowPosting = false,
                    IsSystemAccount = true,
                    BalanceType = "Debit",
                    DisplayOrder = 10,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1101",
                    AccountName = "Guest Receivables",
                    AccountType = "Asset",
                    AccountCategory = "Receivable",
                    ParentAccountCode = "1100",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Debit",
                    DisplayOrder = 11,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1200",
                    AccountName = "Guest Ledger (from PMS)",
                    AccountType = "Asset",
                    AccountCategory = "Receivable",
                    ParentAccountCode = "1100",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Debit",
                    DisplayOrder = 12,
                    Description = "Unpaid guest balances from PMS",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1201",
                    AccountName = "City Ledger",
                    AccountType = "Asset",
                    AccountCategory = "Receivable",
                    ParentAccountCode = "1100",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Debit",
                    DisplayOrder = 13,
                    Description = "Corporate receivables",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Inventory (1300-1399)
                new ChartOfAccount
                {
                    AccountCode = "1300",
                    AccountName = "Inventory",
                    AccountType = "Asset",
                    AccountCategory = "Current Asset",
                    Level = 1,
                    IsGroup = true,
                    AllowPosting = false,
                    IsSystemAccount = true,
                    BalanceType = "Debit",
                    DisplayOrder = 20,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1301",
                    AccountName = "F&B Inventory",
                    AccountType = "Asset",
                    AccountCategory = "Inventory",
                    ParentAccountCode = "1300",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 21,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1302",
                    AccountName = "Minibar Inventory",
                    AccountType = "Asset",
                    AccountCategory = "Inventory",
                    ParentAccountCode = "1300",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 22,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Prepaid & Other Current Assets (1400-1499)
                new ChartOfAccount
                {
                    AccountCode = "1400",
                    AccountName = "Prepaid Expenses",
                    AccountType = "Asset",
                    AccountCategory = "Current Asset",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 30,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Fixed Assets (1500-1699)
                new ChartOfAccount
                {
                    AccountCode = "1500",
                    AccountName = "Fixed Assets",
                    AccountType = "Asset",
                    AccountCategory = "Fixed Asset",
                    Level = 1,
                    IsGroup = true,
                    AllowPosting = false,
                    IsSystemAccount = true,
                    BalanceType = "Debit",
                    DisplayOrder = 40,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1501",
                    AccountName = "Building",
                    AccountType = "Asset",
                    AccountCategory = "Fixed Asset",
                    ParentAccountCode = "1500",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 41,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1502",
                    AccountName = "Furniture & Fixtures",
                    AccountType = "Asset",
                    AccountCategory = "Fixed Asset",
                    ParentAccountCode = "1500",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 42,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1503",
                    AccountName = "Equipment",
                    AccountType = "Asset",
                    AccountCategory = "Fixed Asset",
                    ParentAccountCode = "1500",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 43,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Accumulated Depreciation (1600-1699)
                new ChartOfAccount
                {
                    AccountCode = "1600",
                    AccountName = "Accumulated Depreciation",
                    AccountType = "Asset",
                    AccountCategory = "Fixed Asset",
                    Level = 1,
                    IsGroup = true,
                    AllowPosting = false,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 50,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1601",
                    AccountName = "Accumulated Depreciation - Building",
                    AccountType = "Asset",
                    AccountCategory = "Fixed Asset",
                    ParentAccountCode = "1600",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 51,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "1602",
                    AccountName = "Accumulated Depreciation - Furniture",
                    AccountType = "Asset",
                    AccountCategory = "Fixed Asset",
                    ParentAccountCode = "1600",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 52,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // ========================================
                // LIABILITIES (2000-2999)
                // ========================================
                
                new ChartOfAccount
                {
                    AccountCode = "2000",
                    AccountName = "Accounts Payable",
                    AccountType = "Liability",
                    AccountCategory = "Current Liability",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 100,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "2100",
                    AccountName = "Accrued Expenses",
                    AccountType = "Liability",
                    AccountCategory = "Current Liability",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 110,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "2200",
                    AccountName = "Taxes Payable",
                    AccountType = "Liability",
                    AccountCategory = "Current Liability",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 120,
                    IsTaxable = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "2300",
                    AccountName = "Unearned Revenue (Advance Bookings)",
                    AccountType = "Liability",
                    AccountCategory = "Current Liability",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 130,
                    Description = "Advance deposits from reservations",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "2400",
                    AccountName = "Deposits from Guests",
                    AccountType = "Liability",
                    AccountCategory = "Current Liability",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 140,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // ========================================
                // EQUITY (3000-3999)
                // ========================================
                
                new ChartOfAccount
                {
                    AccountCode = "3000",
                    AccountName = "Owner's Equity",
                    AccountType = "Equity",
                    AccountCategory = "Equity",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 200,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "3100",
                    AccountName = "Retained Earnings",
                    AccountType = "Equity",
                    AccountCategory = "Equity",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 210,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "3200",
                    AccountName = "Current Year Profit",
                    AccountType = "Equity",
                    AccountCategory = "Equity",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 220,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // ========================================
                // REVENUE (4000-4999)
                // ========================================
                
                // Rooms Department Revenue (4000-4099)
                new ChartOfAccount
                {
                    AccountCode = "4000",
                    AccountName = "Room Revenue",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 1,
                    IsGroup = true,
                    AllowPosting = false,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 300,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4001",
                    AccountName = "Room Revenue - Rack Rate",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    ParentAccountCode = "4000",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 301,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4002",
                    AccountName = "Room Revenue - Corporate",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    ParentAccountCode = "4000",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 302,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4003",
                    AccountName = "Room Revenue - OTA",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    ParentAccountCode = "4000",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 303,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4010",
                    AccountName = "Late Checkout Fees",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    ParentAccountCode = "4000",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 310,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4020",
                    AccountName = "No-show / Cancellation Fees",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    ParentAccountCode = "4000",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 2,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 320,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // F&B Department Revenue (4100-4199)
                new ChartOfAccount
                {
                    AccountCode = "4100",
                    AccountName = "Restaurant Revenue",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 400,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4110",
                    AccountName = "Bar Revenue",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = true,
                    BalanceType = "Credit",
                    DisplayOrder = 410,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4120",
                    AccountName = "Banquet Revenue",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 420,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4130",
                    AccountName = "Room Service Revenue",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 430,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Other Departments Revenue (4200-4499)
                new ChartOfAccount
                {
                    AccountCode = "4200",
                    AccountName = "Spa Revenue",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    DepartmentCode = "300",
                    DepartmentName = "Spa",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 500,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4300",
                    AccountName = "Laundry Revenue",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 510,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4400",
                    AccountName = "Mini Bar Revenue",
                    AccountType = "Revenue",
                    AccountCategory = "Operating Revenue",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 520,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "4500",
                    AccountName = "Other Income",
                    AccountType = "Revenue",
                    AccountCategory = "Other Revenue",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Credit",
                    DisplayOrder = 530,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // ========================================
                // COST OF SALES (5000-5999)
                // ========================================
                
                new ChartOfAccount
                {
                    AccountCode = "5000",
                    AccountName = "Food Cost",
                    AccountType = "Expense",
                    AccountCategory = "Cost of Sales",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 600,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "5100",
                    AccountName = "Beverage Cost",
                    AccountType = "Expense",
                    AccountCategory = "Cost of Sales",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 610,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "5200",
                    AccountName = "Mini Bar Cost",
                    AccountType = "Expense",
                    AccountCategory = "Cost of Sales",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 620,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // ========================================
                // OPERATING EXPENSES (6000-7999)
                // ========================================
                
                // Rooms Department Expenses (6000-6099)
                new ChartOfAccount
                {
                    AccountCode = "6000",
                    AccountName = "Housekeeping Salaries",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 700,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "6010",
                    AccountName = "Laundry Expense",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 710,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "6020",
                    AccountName = "Guest Supplies",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 720,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // F&B Expenses (6100-6199)
                new ChartOfAccount
                {
                    AccountCode = "6100",
                    AccountName = "Kitchen Salaries",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 800,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "6110",
                    AccountName = "Restaurant Staff Salaries",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 810,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "6120",
                    AccountName = "Cleaning Supplies - F&B",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 820,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Admin & General (7000-7099)
                new ChartOfAccount
                {
                    AccountCode = "7000",
                    AccountName = "Admin Salaries",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "400",
                    DepartmentName = "Admin",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 900,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "7010",
                    AccountName = "IT Expenses",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "400",
                    DepartmentName = "Admin",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 910,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "7020",
                    AccountName = "Accounting Fees",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "400",
                    DepartmentName = "Admin",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 920,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Sales & Marketing (7100-7199)
                new ChartOfAccount
                {
                    AccountCode = "7100",
                    AccountName = "Advertising",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "400",
                    DepartmentName = "Admin",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 1000,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "7110",
                    AccountName = "OTA Commissions",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 1010,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Maintenance (7200-7299)
                new ChartOfAccount
                {
                    AccountCode = "7200",
                    AccountName = "Repairs & Maintenance",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "400",
                    DepartmentName = "Admin",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 1100,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "7210",
                    AccountName = "Engineering Salaries",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "400",
                    DepartmentName = "Admin",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 1110,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Utilities (7300-7399)
                new ChartOfAccount
                {
                    AccountCode = "7300",
                    AccountName = "Electricity",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "400",
                    DepartmentName = "Admin",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 1200,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "7310",
                    AccountName = "Water",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "400",
                    DepartmentName = "Admin",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 1210,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ChartOfAccount
                {
                    AccountCode = "7320",
                    AccountName = "Gas",
                    AccountType = "Expense",
                    AccountCategory = "Operating Expense",
                    DepartmentCode = "400",
                    DepartmentName = "Admin",
                    Level = 1,
                    IsGroup = false,
                    AllowPosting = true,
                    IsSystemAccount = false,
                    BalanceType = "Debit",
                    DisplayOrder = 1220,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.ChartOfAccounts.AddRange(accounts);
            context.SaveChanges();
        }

        public static void SeedPMSAccountMappings(HotelDbContext context)
        {
            if (context.PMSAccountMappings.Any())
            {
                return; // Already seeded
            }

            var mappings = new List<PMSAccountMapping>
            {
                // Revenue Mappings
                new PMSAccountMapping
                {
                    PMSCode = "RM",
                    PMSDescription = "Room Charge",
                    PMSType = "Revenue",
                    GLAccountCode = "4001",
                    GLAccountName = "Room Revenue - Rack Rate",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PMSAccountMapping
                {
                    PMSCode = "FNB",
                    PMSDescription = "Restaurant Bill",
                    PMSType = "Revenue",
                    GLAccountCode = "4100",
                    GLAccountName = "Restaurant Revenue",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PMSAccountMapping
                {
                    PMSCode = "BAR",
                    PMSDescription = "Bar Bill",
                    PMSType = "Revenue",
                    GLAccountCode = "4110",
                    GLAccountName = "Bar Revenue",
                    DepartmentCode = "200",
                    DepartmentName = "F&B",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PMSAccountMapping
                {
                    PMSCode = "LAUNDRY",
                    PMSDescription = "Laundry Charge",
                    PMSType = "Revenue",
                    GLAccountCode = "4300",
                    GLAccountName = "Laundry Revenue",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PMSAccountMapping
                {
                    PMSCode = "MINIBAR",
                    PMSDescription = "Mini Bar Charge",
                    PMSType = "Revenue",
                    GLAccountCode = "4400",
                    GLAccountName = "Mini Bar Revenue",
                    DepartmentCode = "100",
                    DepartmentName = "Rooms",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Tax Mappings
                new PMSAccountMapping
                {
                    PMSCode = "TAX",
                    PMSDescription = "VAT/Sales Tax",
                    PMSType = "Tax",
                    GLAccountCode = "2200",
                    GLAccountName = "Taxes Payable",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Payment Mappings
                new PMSAccountMapping
                {
                    PMSCode = "CASH",
                    PMSDescription = "Cash Payment",
                    PMSType = "Payment",
                    GLAccountCode = "1001",
                    GLAccountName = "Cash in Hand",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PMSAccountMapping
                {
                    PMSCode = "CARD",
                    PMSDescription = "Credit Card Payment",
                    PMSType = "Payment",
                    GLAccountCode = "1002",
                    GLAccountName = "Bank Account - Main",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PMSAccountMapping
                {
                    PMSCode = "BANK",
                    PMSDescription = "Bank Transfer",
                    PMSType = "Payment",
                    GLAccountCode = "1002",
                    GLAccountName = "Bank Account - Main",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Receivable Mappings
                new PMSAccountMapping
                {
                    PMSCode = "GUEST_LEDGER",
                    PMSDescription = "Guest Ledger Balance",
                    PMSType = "Receivable",
                    GLAccountCode = "1200",
                    GLAccountName = "Guest Ledger (from PMS)",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PMSAccountMapping
                {
                    PMSCode = "CITY_LEDGER",
                    PMSDescription = "City Ledger (Corporate)",
                    PMSType = "Receivable",
                    GLAccountCode = "1201",
                    GLAccountName = "City Ledger",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },

                // Advance/Deposit Mappings
                new PMSAccountMapping
                {
                    PMSCode = "ADVANCE",
                    PMSDescription = "Advance Deposit",
                    PMSType = "Liability",
                    GLAccountCode = "2300",
                    GLAccountName = "Unearned Revenue (Advance Bookings)",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PMSAccountMapping
                {
                    PMSCode = "DEPOSIT",
                    PMSDescription = "Guest Deposit",
                    PMSType = "Liability",
                    GLAccountCode = "2400",
                    GLAccountName = "Deposits from Guests",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.PMSAccountMappings.AddRange(mappings);
            context.SaveChanges();
        }

        public static void SeedFiscalYear(HotelDbContext context)
        {
            if (context.FiscalYears.Any())
            {
                return; // Already seeded
            }

            var currentYear = DateTime.UtcNow.Year;
            var fiscalYear = new FiscalYear
            {
                FiscalYearCode = $"FY{currentYear}",
                FiscalYearName = $"Fiscal Year {currentYear}",
                StartDate = new DateTime(currentYear, 1, 1),
                EndDate = new DateTime(currentYear, 12, 31),
                Status = "Open",
                IsCurrent = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.FiscalYears.Add(fiscalYear);
            context.SaveChanges();

            // Create 12 accounting periods
            var periods = new List<AccountingPeriod>();
            for (int month = 1; month <= 12; month++)
            {
                var startDate = new DateTime(currentYear, month, 1);
                var endDate = startDate.AddMonths(1).AddDays(-1);

                periods.Add(new AccountingPeriod
                {
                    FiscalYearId = fiscalYear.Id,
                    PeriodCode = $"P{month:D2}",
                    PeriodName = startDate.ToString("MMMM yyyy"),
                    PeriodNumber = month,
                    StartDate = startDate,
                    EndDate = endDate,
                    Status = "Open",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                });
            }

            context.AccountingPeriods.AddRange(periods);
            context.SaveChanges();
        }
    }
}
