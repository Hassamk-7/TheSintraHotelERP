using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class RoomTypeDto : BaseDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        [Range(1, 20)]
        public int MaxOccupancy { get; set; }

        public List<string> Amenities { get; set; } = new List<string>();
    }

    public class RoomTypeCreateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        [Range(1, 20)]
        public int MaxOccupancy { get; set; }

        public List<string> Amenities { get; set; } = new List<string>();
    }

    public class RoomTypeUpdateDto
    {
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? BasePrice { get; set; }

        [Range(1, 20)]
        public int? MaxOccupancy { get; set; }

        public List<string> Amenities { get; set; }
    }

    public class RoomDto : BaseDto
    {
        [Required]
        [StringLength(20)]
        public string RoomNumber { get; set; }

        public int RoomTypeId { get; set; }
        public RoomTypeDto RoomType { get; set; }

        [Range(1, 100)]
        public int FloorNumber { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        [Range(1, 10)]
        public int MaxAdults { get; set; }

        [Range(0, 10)]
        public int MaxChildren { get; set; }

        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public List<string> Features { get; set; } = new List<string>();
        public List<RoomImageDto> Images { get; set; } = new List<RoomImageDto>();
    }

    public class RoomCreateDto
    {
        [Required]
        [StringLength(20)]
        public string RoomNumber { get; set; }

        [Required]
        public int RoomTypeId { get; set; }

        [Range(1, 100)]
        public int FloorNumber { get; set; } = 1;

        [StringLength(50)]
        public string Status { get; set; } = "Available";

        [Range(1, 10)]
        public int MaxAdults { get; set; } = 2;

        [Range(0, 10)]
        public int MaxChildren { get; set; } = 2;

        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public List<string> Features { get; set; } = new List<string>();
    }

    public class RoomImageDto : BaseDto
    {
        public int RoomId { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }
        public string Caption { get; set; }
    }
}
