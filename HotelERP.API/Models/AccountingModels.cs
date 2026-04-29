using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class GuestAccount : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string AccountNumber { get; set; }

        [Required]
        public int GuestId { get; set; }

        public int? CheckInId { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }

        [StringLength(100)]
        public string Description { get; set; }

        [StringLength(50)]
        public string TransactionType { get; set; } // Charge, Payment, Refund, Adjustment

        public decimal DebitAmount { get; set; }

        public decimal CreditAmount { get; set; }

        public decimal Balance { get; set; }

        [StringLength(50)]
        public string Reference { get; set; }

        [StringLength(100)]
        public string PostedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual Guest Guest { get; set; }
        public virtual CheckInMaster CheckIn { get; set; }
    }

    public class Payment : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string PaymentNumber { get; set; }

        [Required]
        public int GuestId { get; set; }

        public int? CheckInId { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        public decimal Amount { get; set; }

        [StringLength(50)]
        public string PaymentMethod { get; set; } // Cash, Card, Bank Transfer, Cheque

        [StringLength(50)]
        public string PaymentType { get; set; } // Advance, Settlement, Partial

        [StringLength(100)]
        public string Reference { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Pending, Cleared, Cancelled

        [StringLength(100)]
        public string ReceivedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Card/Bank specific fields
        [StringLength(50)]
        public string CardNumber { get; set; }

        [StringLength(100)]
        public string BankName { get; set; }

        [StringLength(50)]
        public string ChequeNumber { get; set; }

        // Navigation properties
        public virtual Guest Guest { get; set; }
        public virtual CheckInMaster CheckIn { get; set; }
    }

    public class Voucher : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string VoucherNumber { get; set; }

        [Required]
        public DateTime VoucherDate { get; set; }

        [StringLength(50)]
        public string VoucherType { get; set; } // Payment, Receipt, Journal, Contra

        [StringLength(500)]
        public string Description { get; set; }

        public decimal TotalAmount { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Draft, Posted, Cancelled

        [StringLength(100)]
        public string PreparedBy { get; set; }

        [StringLength(100)]
        public string ApprovedBy { get; set; }

        public DateTime? ApprovalDate { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }
    }

    public class DayBook : BaseEntity
    {
        [Required]
        public DateTime TransactionDate { get; set; }

        [Required]
        [StringLength(50)]
        public string TransactionNumber { get; set; }

        [StringLength(100)]
        public string Description { get; set; }

        [StringLength(50)]
        public string TransactionType { get; set; }

        [StringLength(100)]
        public string AccountHead { get; set; }

        public decimal DebitAmount { get; set; }

        public decimal CreditAmount { get; set; }

        [StringLength(50)]
        public string Reference { get; set; }

        [StringLength(100)]
        public string PostedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }
    }

    public class SupplierLedger : BaseEntity
    {
        [Required]
        public int SupplierId { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }

        [StringLength(100)]
        public string Description { get; set; }

        [StringLength(50)]
        public string TransactionType { get; set; } // Purchase, Payment, Return, Adjustment

        public decimal DebitAmount { get; set; }

        public decimal CreditAmount { get; set; }

        public decimal Balance { get; set; }

        [StringLength(50)]
        public string Reference { get; set; }

        [StringLength(100)]
        public string PostedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual Supplier Supplier { get; set; }
    }

    public class GeneralLedger : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string AccountCode { get; set; }

        [Required]
        [StringLength(200)]
        public string AccountName { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }

        [StringLength(100)]
        public string Description { get; set; }

        public decimal DebitAmount { get; set; }

        public decimal CreditAmount { get; set; }

        public decimal Balance { get; set; }

        [StringLength(50)]
        public string Reference { get; set; }

        [StringLength(100)]
        public string PostedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }
    }

    public class TrialBalance : BaseEntity
    {
        [Required]
        public DateTime BalanceDate { get; set; }

        [Required]
        [StringLength(100)]
        public string AccountCode { get; set; }

        [Required]
        [StringLength(200)]
        public string AccountName { get; set; }

        [StringLength(50)]
        public string AccountType { get; set; } // Asset, Liability, Income, Expense

        public decimal OpeningBalance { get; set; }

        public decimal DebitAmount { get; set; }

        public decimal CreditAmount { get; set; }

        public decimal ClosingBalance { get; set; }

        [StringLength(100)]
        public string PreparedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }
    }

    public class StockAccounting : BaseEntity
    {
        [Required]
        public int ItemId { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }

        [StringLength(50)]
        public string TransactionType { get; set; } // Purchase, Issue, Return, Adjustment

        public decimal Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalValue { get; set; }

        public decimal StockBalance { get; set; }

        public decimal StockValue { get; set; }

        [StringLength(50)]
        public string Reference { get; set; }

        [StringLength(100)]
        public string PostedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual ItemMaster Item { get; set; }
    }
}
