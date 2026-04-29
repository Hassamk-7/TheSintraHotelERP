using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class ExtraBed : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public decimal ChargePerNight { get; set; }

        [StringLength(50)]
        public string BedType { get; set; }

        [StringLength(50)]
        public string Size { get; set; }

        public int MaxAge { get; set; }

        public int MinAge { get; set; }

        public bool IsAvailable { get; set; }

        [StringLength(100)]
        public string ApplicableRoomTypes { get; set; }

        public int DisplayOrder { get; set; }
    }
}
