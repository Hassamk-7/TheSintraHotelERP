using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class PlanDto : BaseDto
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

        public bool IsBreakfastIncluded { get; set; }
        public bool IsLunchIncluded { get; set; }
        public bool IsDinnerIncluded { get; set; }
        public bool IsActive { get; set; }

        [StringLength(500)]
        public string TermsAndConditions { get; set; }
    }

    public class PlanCreateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        public bool IsBreakfastIncluded { get; set; } = false;
        public bool IsLunchIncluded { get; set; } = false;
        public bool IsDinnerIncluded { get; set; } = false;
        public bool IsActive { get; set; } = true;

        [StringLength(500)]
        public string TermsAndConditions { get; set; }
    }
}
