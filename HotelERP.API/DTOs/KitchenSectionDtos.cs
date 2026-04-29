using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class KitchenSectionDto : BaseDto
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

        [StringLength(100)]
        public string ResponsibleChef { get; set; }

        [StringLength(500)]
        public string Specialties { get; set; }

        public int DisplayOrder { get; set; }
    }

    public class KitchenSectionCreateDto
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

        [StringLength(100)]
        public string ResponsibleChef { get; set; }

        [StringLength(500)]
        public string Specialties { get; set; }

        public int DisplayOrder { get; set; } = 0;
    }

    public class KitchenSectionUpdateDto
    {
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string SectionType { get; set; }

        [StringLength(100)]
        public string ResponsibleChef { get; set; }

        [StringLength(500)]
        public string Specialties { get; set; }

        public int? DisplayOrder { get; set; }
    }
}
