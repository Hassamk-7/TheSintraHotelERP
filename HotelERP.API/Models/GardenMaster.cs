using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class GardenMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public int Capacity { get; set; }

        public decimal HourlyRate { get; set; }

        public decimal DailyRate { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string GardenType { get; set; }

        public bool HasGazebo { get; set; }

        public bool HasLighting { get; set; }

        public bool HasWaterFeature { get; set; }

        [StringLength(500)]
        public string Features { get; set; }

        public bool IsAvailable { get; set; }
    }

    public class DeliveryPersonMaster : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        [StringLength(50)]
        public string VehicleType { get; set; }

        [StringLength(50)]
        public string VehicleNumber { get; set; }

        [StringLength(50)]
        public string LicenseNumber { get; set; }

        public bool IsAvailable { get; set; }

        public decimal DeliveryChargePerKm { get; set; }

        [StringLength(100)]
        public string? WorkingArea { get; set; }
    }

    public class OtherCharges : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Code { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public decimal Amount { get; set; }

        [StringLength(50)]
        public string? ChargeType { get; set; }

        [StringLength(50)]
        public string? ApplicableTo { get; set; }

        public bool IsTaxable { get; set; }

        public bool IsOptional { get; set; }

        public int DisplayOrder { get; set; }
    }

    public class KitchenSection : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string SectionType { get; set; }

        public bool IsActive { get; set; }

        [StringLength(100)]
        public string ResponsibleChef { get; set; }

        [StringLength(500)]
        public string Specialties { get; set; }

        public int DisplayOrder { get; set; }
    }
}
