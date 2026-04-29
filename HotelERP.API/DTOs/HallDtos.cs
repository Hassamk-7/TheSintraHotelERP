using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class HallDto : BaseDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Range(1, 10000)]
        public int Capacity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal HourlyRate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal DailyRate { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string HallType { get; set; }

        public bool HasAC { get; set; }

        public bool HasProjector { get; set; }

        public bool HasSoundSystem { get; set; }

        public List<string> Amenities { get; set; } = new List<string>();

        [StringLength(200)]
        public string ImagePath { get; set; }

        public bool IsAvailable { get; set; }
    }

    public class HallCreateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Range(1, 10000)]
        public int Capacity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal HourlyRate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal DailyRate { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string HallType { get; set; }

        public bool HasAC { get; set; }

        public bool HasProjector { get; set; }

        public bool HasSoundSystem { get; set; }

        public List<string> Amenities { get; set; } = new List<string>();
    }

    public class HallUpdateDto
    {
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Range(1, 10000)]
        public int? Capacity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? HourlyRate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? DailyRate { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string HallType { get; set; }

        public bool? HasAC { get; set; }

        public bool? HasProjector { get; set; }

        public bool? HasSoundSystem { get; set; }

        public List<string> Amenities { get; set; }
    }
}
