using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    [Table("RoomGallery")]
    public class RoomGallery
    {
        [Key]
        public int RoomGalleryID { get; set; }

        [Required]
        [Column("RoomTypeID")]
        public int RoomTypeID { get; set; }

        [Required]
        [StringLength(255)]
        public string ImageName { get; set; }

        [Required]
        [StringLength(500)]
        public string ImagePath { get; set; }

        [StringLength(200)]
        public string ImageTitle { get; set; }

        [StringLength(1000)]
        public string ImageDescription { get; set; }

        [StringLength(100)]
        public string Category { get; set; } // 'Rooms & Suites', 'Restaurant', 'Facilities', 'Exterior'

        public int DisplayOrder { get; set; } = 0;

        public bool IsMainImage { get; set; } = false;

        public bool IsActive { get; set; } = true;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        // Additional fields for Restaurant support
        [StringLength(100)]
        public string Location { get; set; } // e.g., 'Islamabad', 'Lahore', 'Karachi'

        [Column(TypeName = "decimal(3,2)")]
        public decimal? Rating { get; set; } // 1-5 rating

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Price { get; set; } // For restaurant menu items

        public bool? IsSpicy { get; set; } // For restaurant items

        public bool? IsVegetarian { get; set; } // For restaurant items

        [StringLength(100)]
        public string Cuisine { get; set; } // e.g., 'Pakistani', 'Continental', 'Chinese'

        [StringLength(100)]
        public string SubCategory { get; set; } // e.g., 'Appetizers', 'Main Course', 'Desserts'

        // Navigation property - References RoomTypes table with ID column
        [ForeignKey("RoomTypeID")]
        public virtual RoomType RoomType { get; set; }
    }
}
