using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class DishCategory : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        // Navigation property
        public virtual ICollection<Dish> Dishes { get; set; } = new List<Dish>();
    }
}
