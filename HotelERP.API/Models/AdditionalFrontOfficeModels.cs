using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class GuestHistory : BaseEntity
    {
        [Required]
        public int GuestId { get; set; }

        [Required]
        [StringLength(50)]
        public string VisitNumber { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        [StringLength(50)]
        public string RoomNumber { get; set; }

        [StringLength(50)]
        public string RoomType { get; set; }

        public decimal TotalBill { get; set; }

        public decimal AmountPaid { get; set; }

        [StringLength(50)]
        public string PaymentStatus { get; set; }

        [StringLength(500)]
        public string Feedback { get; set; }

        public int Rating { get; set; }

        [StringLength(100)]
        public string Purpose { get; set; }

        // Navigation properties
        public virtual Guest Guest { get; set; }
    }

    public class RoomTransfer : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string TransferNumber { get; set; }

        [Required]
        public int CheckInId { get; set; }

        [Required]
        public int FromRoomId { get; set; }

        [Required]
        public int ToRoomId { get; set; }

        [Required]
        public DateTime TransferDate { get; set; }

        [StringLength(500)]
        public string Reason { get; set; }

        public decimal AdditionalCharges { get; set; }

        [StringLength(100)]
        public string AuthorizedBy { get; set; }

        [StringLength(100)]
        public string ProcessedBy { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual CheckInMaster CheckIn { get; set; }
        public virtual Room FromRoom { get; set; }
        public virtual Room ToRoom { get; set; }
    }

    public class GuestFolio : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string FolioNumber { get; set; }

        [Required]
        public int CheckInId { get; set; }

        public int? ReservationId { get; set; }
        public int? GuestId { get; set; }

        [StringLength(50)]
        public string InvoiceNumber { get; set; }

        [StringLength(50)]
        public string Source { get; set; }

        [StringLength(20)]
        public string RoomNumber { get; set; }

        public int FolioIndex { get; set; } = 1; // Folio 1, Folio 2, etc.

        [Required]
        public DateTime TransactionDate { get; set; }

        [StringLength(200)]
        public string Description { get; set; }

        [StringLength(50)]
        public string TransactionType { get; set; } // Charge, Receipt, Reverse

        [StringLength(100)]
        public string ChargeItemCode { get; set; } // e.g. 101-Room Rent, 110-Laundry

        [StringLength(100)]
        public string PaymentAccountCode { get; set; } // e.g. 10001-Credit Cards H.O

        public int Quantity { get; set; } = 1;

        public decimal Amount { get; set; }

        public decimal TaxAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal PaidAmount { get; set; }

        public decimal DueAmount { get; set; }

        public decimal Balance { get; set; }

        public bool IsReversed { get; set; }

        public int? ReversedFromId { get; set; }

        [StringLength(50)]
        public string Reference { get; set; }

        [StringLength(100)]
        public string PostedBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        [StringLength(500)]
        public string Memo { get; set; }

        // Navigation properties
        public virtual CheckInMaster CheckIn { get; set; }
        public virtual Reservation Reservation { get; set; }
        public virtual Guest Guest { get; set; }
    }

    public class FolioChargeItem : BaseEntity
    {
        [Required]
        [StringLength(20)]
        public string Code { get; set; } // e.g. 101, 102, 110

        [Required]
        [StringLength(100)]
        public string Name { get; set; } // e.g. Room Rent, Laundry

        [StringLength(200)]
        public string Description { get; set; }

        public decimal DefaultPrice { get; set; }

        public decimal TaxPercentage { get; set; }

        public int SortOrder { get; set; }
    }

    public class FolioPaymentAccount : BaseEntity
    {
        [Required]
        [StringLength(20)]
        public string Code { get; set; } // e.g. 10001, 10002

        [Required]
        [StringLength(150)]
        public string Name { get; set; } // e.g. Credit Cards H.O, Cash

        [StringLength(200)]
        public string Description { get; set; }

        [StringLength(50)]
        public string AccountType { get; set; } // Cash, Card, Bank, Transfer

        public int SortOrder { get; set; }
    }

    public class CheckInWithID : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string CheckInNumber { get; set; }

        [Required]
        [StringLength(100)]
        public string GuestName { get; set; }

        [Required]
        [StringLength(50)]
        public string IdType { get; set; }

        [Required]
        [StringLength(50)]
        public string IdNumber { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        [Required]
        public int RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime ExpectedCheckOutDate { get; set; }

        public int NumberOfGuests { get; set; }

        public decimal RoomRate { get; set; }

        public decimal SecurityDeposit { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        [StringLength(100)]
        public string CheckedInBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
    }

    public class CheckOutWithID : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string CheckOutNumber { get; set; }

        [Required]
        public int CheckInWithIDId { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        public decimal RoomCharges { get; set; }

        public decimal ServiceCharges { get; set; }

        public decimal TaxAmount { get; set; }

        public decimal TotalBill { get; set; }

        public decimal SecurityDepositRefund { get; set; }

        public decimal TotalPaid { get; set; }

        public decimal Balance { get; set; }

        [StringLength(50)]
        public string PaymentMethod { get; set; }

        [StringLength(50)]
        public string PaymentStatus { get; set; }

        [StringLength(100)]
        public string CheckedOutBy { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        public bool LateCheckOut { get; set; }

        public decimal LateCheckOutCharges { get; set; }

        // Navigation properties
        public virtual CheckInWithID CheckInWithID { get; set; }
    }
}
