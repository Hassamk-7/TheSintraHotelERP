using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class RestaurantLocation
    {
        [Key]
        public int RestaurantID { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string Location { get; set; } // Islamabad, Lahore, Karachi

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(500)]
        public string ImagePath { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 4.5M;

        [StringLength(50)]
        public string PhoneNumber { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(200)]
        public string OpeningHours { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; } = true;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        // Navigation property
        public virtual ICollection<MenuItem> MenuItems { get; set; }
    }

    public class MenuItem
    {
        [Key]
        public int MenuItemID { get; set; }

        public int RestaurantID { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(500)]
        public string ImagePath { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 4.5M;

        [StringLength(100)]
        public string Category { get; set; } // Appetizers, Main Course, Desserts, Beverages

        [StringLength(100)]
        public string Cuisine { get; set; } // Pakistani, Continental, Chinese, Italian, Thai

        public bool IsSpicy { get; set; }

        public bool IsVegetarian { get; set; }

        public bool IsAvailable { get; set; } = true;

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; } = true;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        // Navigation property
        [ForeignKey("RestaurantID")]
        public virtual RestaurantLocation Restaurant { get; set; }
    }

    public class GalleryCategory
    {
        [Key]
        public int CategoryID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } // Rooms & Suites, Facilities, Restaurant, etc.

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(200)]
        public string Subtitle { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; } = true;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        [StringLength(500)]
        public string ThumbnailPath { get; set; }

        // Navigation property
        public virtual ICollection<GalleryItem> GalleryItems { get; set; }
    }

    public class GalleryItem
    {
        [Key]
        public int GalleryItemID { get; set; }

        public int CategoryID { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(200)]
        public string Subtitle { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        [StringLength(500)]
        public string ImagePath { get; set; }

        public bool IsMainImage { get; set; } // Only one main image per category

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; } = true;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        [StringLength(500)]
        public string ThumbnailPath { get; set; }

        // Navigation property
        [ForeignKey("CategoryID")]
        public virtual GalleryCategory Category { get; set; }
    }
}
