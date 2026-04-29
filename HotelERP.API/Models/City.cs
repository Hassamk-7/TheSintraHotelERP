using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class City
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Province { get; set; }

        [StringLength(100)]
        public string? Country { get; set; } = "Pakistan";

        public bool IsActive { get; set; } = true;
    }
}
