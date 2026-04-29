using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    // Chart of Accounts Master
    public class ChartOfAccount : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string AccountCode { get; set; } // e.g., 1000, 4000-100, 01-100-ROOMS-4001-00

        [Required]
        [StringLength(200)]
        public string AccountName { get; set; }

        [Required]
        [StringLength(50)]
        public string AccountType { get; set; } // Asset, Liability, Equity, Revenue, Expense

        [StringLength(50)]
        public string AccountCategory { get; set; } // Cash, Receivable, Fixed Asset, etc.

        [StringLength(50)]
        public string AccountSubCategory { get; set; }

        [StringLength(50)]
        public string DepartmentCode { get; set; } // 100=Rooms, 200=F&B, 300=Spa, 400=Admin

        [StringLength(100)]
        public string DepartmentName { get; set; }

        [StringLength(50)]
        public string PropertyCode { get; set; } // For multi-property

        [StringLength(100)]
        public string PropertyName { get; set; }

        [StringLength(50)]
        public string CompanyCode { get; set; } // For multi-company

        public string ParentAccountCode { get; set; } // For hierarchical structure

        public int Level { get; set; } // Account hierarchy level (1=main, 2=sub, 3=detail)

        public bool IsGroup { get; set; } // True if this is a group/parent account

        public bool AllowPosting { get; set; } // False for group accounts, True for detail accounts

        public decimal OpeningBalance { get; set; }

        [StringLength(20)]
        public string BalanceType { get; set; } // Debit, Credit

        public bool IsSystemAccount { get; set; } // Cannot be deleted if true

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(100)]
        public string TaxCode { get; set; }

        public bool IsTaxable { get; set; }

        [StringLength(50)]
        public string CurrencyCode { get; set; } // PKR, USD, etc.

        public bool IsReconcilable { get; set; } // For bank accounts

        [StringLength(100)]
        public string CostCenter { get; set; }

        public int DisplayOrder { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation
        public virtual ICollection<JournalEntryLine> JournalEntryLines { get; set; }
        public virtual ICollection<PMSAccountMapping> PMSMappings { get; set; }
    }

    // Journal Entry Header
    public class JournalEntry : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string JournalNumber { get; set; } // Auto-generated: JE-2026-0001

        [Required]
        public DateTime EntryDate { get; set; }

        [Required]
        [StringLength(50)]
        public string EntryType { get; set; } // Manual, Auto, PMS, Adjustment, Opening, Closing

        [StringLength(50)]
        public string VoucherType { get; set; } // Journal, Payment, Receipt, Contra

        [StringLength(100)]
        public string Reference { get; set; } // PMS reference, invoice number, etc.

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Draft, Posted, Approved, Cancelled, Reversed

        public DateTime? PostedDate { get; set; }

        [StringLength(100)]
        public string PostedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        [StringLength(100)]
        public string ApprovedBy { get; set; }

        public DateTime? ReversedDate { get; set; }

        [StringLength(100)]
        public string ReversedBy { get; set; }

        public int? ReversedFromId { get; set; } // Link to original entry if this is a reversal

        [StringLength(50)]
        public string FiscalYear { get; set; }

        [StringLength(50)]
        public string Period { get; set; } // Month or period number

        [StringLength(100)]
        public string Source { get; set; } // PMS, Manual, System, Import

        [StringLength(100)]
        public string SourceModule { get; set; } // CheckIn, CheckOut, GuestFolio, Restaurant, etc.

        public int? SourceRecordId { get; set; }

        [StringLength(100)]
        public string PreparedBy { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        public decimal TotalDebit { get; set; }

        public decimal TotalCredit { get; set; }

        public bool IsBalanced { get; set; } // TotalDebit == TotalCredit

        [StringLength(100)]
        public string Attachment { get; set; }

        // Navigation
        public virtual ICollection<JournalEntryLine> Lines { get; set; }
    }

    // Journal Entry Lines (Detail)
    public class JournalEntryLine : BaseEntity
    {
        [Required]
        public int JournalEntryId { get; set; }

        public int LineNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string AccountCode { get; set; }

        [StringLength(200)]
        public string AccountName { get; set; } // Denormalized for performance

        [StringLength(500)]
        public string Description { get; set; }

        public decimal DebitAmount { get; set; }

        public decimal CreditAmount { get; set; }

        [StringLength(50)]
        public string DepartmentCode { get; set; }

        [StringLength(100)]
        public string DepartmentName { get; set; }

        [StringLength(100)]
        public string CostCenter { get; set; }

        [StringLength(100)]
        public string Reference { get; set; }

        [StringLength(50)]
        public string TaxCode { get; set; }

        public decimal TaxAmount { get; set; }

        [StringLength(100)]
        public string AnalysisCode { get; set; } // For additional reporting dimensions

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation
        public virtual JournalEntry JournalEntry { get; set; }
        public virtual ChartOfAccount Account { get; set; }
    }

    // PMS to GL Account Mapping
    public class PMSAccountMapping : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string PMSCode { get; set; } // RM, FNB, BAR, TAX, CASH, CARD, etc.

        [Required]
        [StringLength(200)]
        public string PMSDescription { get; set; }

        [Required]
        [StringLength(50)]
        public string PMSType { get; set; } // Revenue, Charge, Payment, Tax

        [Required]
        [StringLength(50)]
        public string GLAccountCode { get; set; }

        [StringLength(200)]
        public string GLAccountName { get; set; }

        [StringLength(50)]
        public string DepartmentCode { get; set; }

        [StringLength(100)]
        public string DepartmentName { get; set; }

        public bool IsActive { get; set; }

        [StringLength(500)]
        public string MappingRule { get; set; } // JSON or description of mapping logic

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation
        public virtual ChartOfAccount GLAccount { get; set; }
    }

    // Fiscal Year Configuration
    public class FiscalYear : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string FiscalYearCode { get; set; } // FY2026, FY2026-27

        [Required]
        [StringLength(100)]
        public string FiscalYearName { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Open, Closed, Locked

        public bool IsCurrent { get; set; }

        public DateTime? ClosedDate { get; set; }

        [StringLength(100)]
        public string ClosedBy { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation
        public virtual ICollection<AccountingPeriod> Periods { get; set; }
    }

    // Accounting Periods (Months)
    public class AccountingPeriod : BaseEntity
    {
        [Required]
        public int FiscalYearId { get; set; }

        [Required]
        [StringLength(50)]
        public string PeriodCode { get; set; } // P01, P02, ... P12

        [Required]
        [StringLength(100)]
        public string PeriodName { get; set; } // January 2026, February 2026

        public int PeriodNumber { get; set; } // 1-12

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Open, Closed, Locked

        public DateTime? ClosedDate { get; set; }

        [StringLength(100)]
        public string ClosedBy { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation
        public virtual FiscalYear FiscalYear { get; set; }
    }

    // Account Balance Cache (for performance)
    public class AccountBalance : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string AccountCode { get; set; }

        [Required]
        public DateTime BalanceDate { get; set; }

        [StringLength(50)]
        public string FiscalYear { get; set; }

        [StringLength(50)]
        public string Period { get; set; }

        public decimal OpeningDebit { get; set; }

        public decimal OpeningCredit { get; set; }

        public decimal OpeningBalance { get; set; }

        public decimal PeriodDebit { get; set; }

        public decimal PeriodCredit { get; set; }

        public decimal ClosingDebit { get; set; }

        public decimal ClosingCredit { get; set; }

        public decimal ClosingBalance { get; set; }

        [StringLength(20)]
        public string BalanceType { get; set; } // Debit, Credit

        public DateTime LastUpdated { get; set; }

        [StringLength(100)]
        public string UpdatedBy { get; set; }
    }

    // Bank Reconciliation
    public class BankReconciliation : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string ReconciliationNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string BankAccountCode { get; set; }

        [StringLength(200)]
        public string BankAccountName { get; set; }

        [Required]
        public DateTime ReconciliationDate { get; set; }

        [Required]
        public DateTime StatementDate { get; set; }

        [StringLength(100)]
        public string StatementNumber { get; set; }

        public decimal StatementBalance { get; set; }

        public decimal BookBalance { get; set; }

        public decimal Difference { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Draft, Completed, Approved

        [StringLength(100)]
        public string PreparedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        [StringLength(100)]
        public string ApprovedBy { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation
        public virtual ICollection<BankReconciliationLine> Lines { get; set; }
    }

    public class BankReconciliationLine : BaseEntity
    {
        [Required]
        public int BankReconciliationId { get; set; }

        public int? JournalEntryLineId { get; set; }

        public DateTime TransactionDate { get; set; }

        [StringLength(100)]
        public string Reference { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public decimal DebitAmount { get; set; }

        public decimal CreditAmount { get; set; }

        public bool IsReconciled { get; set; }

        public DateTime? ReconciledDate { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation
        public virtual BankReconciliation BankReconciliation { get; set; }
        public virtual JournalEntryLine JournalEntryLine { get; set; }
    }
}
