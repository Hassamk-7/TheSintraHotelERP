using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class HallMaster : BaseEntity
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
        public string HallType { get; set; }

        public bool HasAC { get; set; }

        public bool HasProjector { get; set; }

        public bool HasSoundSystem { get; set; }

        [StringLength(500)]
        public string Amenities { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }

        public bool IsAvailable { get; set; }
    }
}
