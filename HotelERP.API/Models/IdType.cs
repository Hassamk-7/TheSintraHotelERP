using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class IdType : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public bool IsRequired { get; set; }

        [StringLength(50)]
        public string Country { get; set; }

        public int DisplayOrder { get; set; }
    }
}
