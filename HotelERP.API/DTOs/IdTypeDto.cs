using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class CreateIdTypeDto
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

    public class UpdateIdTypeDto : CreateIdTypeDto
    {
    }

    public class IdTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public bool IsRequired { get; set; }
        public string Country { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
