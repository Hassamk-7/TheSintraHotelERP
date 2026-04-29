using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class DrinksPricing : BaseEntity
    {
        public int DrinksMasterId { get; set; }

        [StringLength(100)]
        public string DrinkName { get; set; }

        [StringLength(20)]
        public string DrinkCode { get; set; }

        [Required]
        [StringLength(50)]
        public string Quantity { get; set; }

        public int? ItemMasterId { get; set; }

        public decimal Price { get; set; }

        public decimal CostPrice { get; set; }

        [StringLength(50)]
        public string? PriceCategory { get; set; }

        public bool IsHappyHourPrice { get; set; }

        public decimal HappyHourPrice { get; set; }

        public DateTime? EffectiveFrom { get; set; }

        public DateTime? EffectiveTo { get; set; }
    }

    public class ExpenseTypeMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string Category { get; set; }

        public bool IsTaxDeductible { get; set; }

        public bool RequiresApproval { get; set; }

        [StringLength(100)]
        public string ApprovalLevel { get; set; }

        public int DisplayOrder { get; set; }
    }

    public class ExpensesMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string ExpenseTitle { get; set; }

        [Required]
        [StringLength(20)]
        public string ExpenseCode { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public decimal Amount { get; set; }

        [StringLength(50)]
        public string ExpenseType { get; set; }

        [StringLength(50)]
        public string Category { get; set; }

        public DateTime ExpenseDate { get; set; }

        [StringLength(100)]
        public string ApprovedBy { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        [StringLength(200)]
        public string ReceiptPath { get; set; }
    }

    public class TaxMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string TaxName { get; set; }

        [Required]
        [StringLength(20)]
        public string TaxCode { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public decimal TaxRate { get; set; }

        [StringLength(50)]
        public string TaxType { get; set; }

        [StringLength(100)]
        public string ApplicableTo { get; set; }

        public bool IsInclusive { get; set; }

        public bool IsActive { get; set; }

        public DateTime EffectiveFrom { get; set; }

        public DateTime? EffectiveTo { get; set; }
    }

    public class GuestMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(20)]
        public string GuestCode { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(50)]
        public string IdType { get; set; }

        [StringLength(50)]
        public string IdNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(20)]
        public string Gender { get; set; }

        [StringLength(50)]
        public string Nationality { get; set; }

        [StringLength(100)]
        public string Company { get; set; }

        [StringLength(50)]
        public string GuestType { get; set; }
    }

    public class RoomMaster : BaseEntity
    {
        [Required]
        [StringLength(20)]
        public string RoomNumber { get; set; }

        [Required]
        [StringLength(20)]
        public string RoomCode { get; set; }

        [StringLength(50)]
        public string RoomType { get; set; }

        public int FloorNumber { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        public decimal BaseRate { get; set; }

        public int MaxOccupancy { get; set; }

        public bool HasBalcony { get; set; }

        public bool HasSeaView { get; set; }

        public bool HasCityView { get; set; }

        [StringLength(500)]
        public string Amenities { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public DateTime? LastMaintenance { get; set; }

        public DateTime? NextMaintenance { get; set; }
    }
}
