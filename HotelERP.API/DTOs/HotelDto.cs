using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class CreateHotelDto
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

        public int TotalRooms { get; set; } = 0;

        public int TotalFloors { get; set; } = 0;

        public DateTime? EstablishedDate { get; set; }

        [StringLength(20)]
        public string StarRating { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

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
    }

    public class UpdateHotelDto : CreateHotelDto
    {
    }

    public class HotelDto
    {
        public int Id { get; set; }
        public string HotelName { get; set; }
        public string HotelCode { get; set; }
        public string Address { get; set; }
        public int? CityId { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string FaxNumber { get; set; }
        public string GSTNumber { get; set; }
        public string PANNumber { get; set; }
        public string LicenseNumber { get; set; }
        public string ManagerName { get; set; }
        public string ManagerPhone { get; set; }
        public string ManagerEmail { get; set; }
        public int TotalRooms { get; set; }
        public int TotalFloors { get; set; }
        public DateTime EstablishedDate { get; set; }
        public string StarRating { get; set; }
        public string Description { get; set; }
        public string LogoPath { get; set; }
        public bool IsMainBranch { get; set; }
        public string Currency { get; set; }
        public string CheckInTime { get; set; }
        public string CheckOutTime { get; set; }
        public string TimeZone { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
