using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class Hotel : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string HotelName { get; set; }

        [Required]
        [StringLength(20)]
        public string HotelCode { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        public int? CityId { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string State { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(20)]
        public string PostalCode { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(100)]
        public string Website { get; set; }

        [StringLength(50)]
        public string FaxNumber { get; set; }

        [StringLength(50)]
        public string GSTNumber { get; set; }

        [StringLength(50)]
        public string PANNumber { get; set; }

        [StringLength(50)]
        public string LicenseNumber { get; set; }

        [StringLength(100)]
        public string ManagerName { get; set; }

        [StringLength(20)]
        public string ManagerPhone { get; set; }

        [StringLength(100)]
        public string ManagerEmail { get; set; }

        public int TotalRooms { get; set; }

        public int TotalFloors { get; set; }

        public DateTime EstablishedDate { get; set; }

        [StringLength(20)]
        public string StarRating { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(200)]
        public string LogoPath { get; set; }

        public bool IsMainBranch { get; set; }

        [StringLength(50)]
        public string Currency { get; set; }

        [StringLength(10)]
        public string CheckInTime { get; set; }

        [StringLength(10)]
        public string CheckOutTime { get; set; }

        [StringLength(50)]
        public string TimeZone { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        public virtual City CityNavigation { get; set; }

        // Alias properties for DataSeedingService compatibility
        public string Name 
        { 
            get => HotelName; 
            set => HotelName = value; 
        }

        public string Code 
        { 
            get => HotelCode; 
            set => HotelCode = value; 
        }

        public string Phone 
        { 
            get => PhoneNumber; 
            set => PhoneNumber = value; 
        }
    }
}
