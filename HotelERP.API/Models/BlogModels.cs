using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    // Blog Category Model
    public class BlogCategory
    {
        [Key]
        public int CategoryID { get; set; }

        [Required]
        [StringLength(100)]
        public string CategoryName { get; set; }

        [Required]
        [StringLength(100)]
        public string CategorySlug { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        // Navigation property
        public virtual ICollection<Blog> Blogs { get; set; }
    }

    // Blog Model
    public class Blog
    {
        [Key]
        public int BlogID { get; set; }

        [Required]
        [StringLength(500)]
        public string Title { get; set; }

        [Required]
        [StringLength(500)]
        public string Slug { get; set; }

        [StringLength(1000)]
        public string Excerpt { get; set; }

        [StringLength(500)]
        public string FeaturedImage { get; set; }

        [Required]
        public int CategoryID { get; set; }

        [Required]
        [StringLength(200)]
        public string Author { get; set; }

        [Required]
        public DateTime PublishedDate { get; set; } = DateTime.Now;

        [StringLength(50)]
        public string ReadTime { get; set; }

        public bool IsFeatured { get; set; } = false;

        public bool IsPublished { get; set; } = true;

        public int ViewCount { get; set; } = 0;

        [StringLength(200)]
        public string MetaTitle { get; set; }

        [StringLength(500)]
        public string MetaDescription { get; set; }

        [StringLength(500)]
        public string MetaKeywords { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        // Navigation properties
        [ForeignKey("CategoryID")]
        public virtual BlogCategory Category { get; set; }

        public virtual ICollection<BlogContent> Contents { get; set; }
        public virtual ICollection<BlogImage> Images { get; set; }
        public virtual ICollection<BlogTagMapping> TagMappings { get; set; }
    }

    // Blog Content Model
    public class BlogContent
    {
        [Key]
        public int ContentID { get; set; }

        [Required]
        public int BlogID { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string ContentHTML { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string ContentText { get; set; }

        public int SectionOrder { get; set; } = 1;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        // Navigation property
        [ForeignKey("BlogID")]
        public virtual Blog Blog { get; set; }
    }

    // Blog Image Model
    public class BlogImage
    {
        [Key]
        public int ImageID { get; set; }

        [Required]
        public int BlogID { get; set; }

        [Required]
        [StringLength(500)]
        public string ImagePath { get; set; }

        [StringLength(500)]
        public string ImageCaption { get; set; }

        [StringLength(200)]
        public string ImageAlt { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Navigation property
        [ForeignKey("BlogID")]
        public virtual Blog Blog { get; set; }
    }

    // Blog Tag Model
    public class BlogTag
    {
        [Key]
        public int TagID { get; set; }

        [Required]
        [StringLength(100)]
        public string TagName { get; set; }

        [Required]
        [StringLength(100)]
        public string TagSlug { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Navigation property
        public virtual ICollection<BlogTagMapping> TagMappings { get; set; }
    }

    // Blog Tag Mapping Model
    public class BlogTagMapping
    {
        [Key]
        public int MappingID { get; set; }

        [Required]
        public int BlogID { get; set; }

        [Required]
        public int TagID { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("BlogID")]
        public virtual Blog Blog { get; set; }

        [ForeignKey("TagID")]
        public virtual BlogTag Tag { get; set; }
    }

    // DTOs for API responses
    public class BlogListDTO
    {
        public int BlogID { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Excerpt { get; set; }
        public string FeaturedImage { get; set; }
        public string CategoryName { get; set; }
        public int CategoryID { get; set; }
        public string Author { get; set; }
        public DateTime PublishedDate { get; set; }
        public string ReadTime { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsPublished { get; set; }
        public int ViewCount { get; set; }
    }

    public class BlogDetailDTO
    {
        public int BlogID { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Excerpt { get; set; }
        public string FeaturedImage { get; set; }
        public int CategoryID { get; set; }
        public BlogCategory Category { get; set; }
        public string Author { get; set; }
        public DateTime PublishedDate { get; set; }
        public string ReadTime { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsPublished { get; set; }
        public int ViewCount { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public string MetaKeywords { get; set; }
        public string ContentHTML { get; set; }
        public string ContentText { get; set; }
        public List<BlogImage> Images { get; set; }
        public List<string> Tags { get; set; }
    }

    public class BlogCreateUpdateDTO
    {
        public int? BlogID { get; set; }
        [Required]
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Excerpt { get; set; }
        public string FeaturedImage { get; set; }
        [Required]
        public int CategoryID { get; set; }
        [Required]
        public string Author { get; set; }
        public DateTime PublishedDate { get; set; }
        public string ReadTime { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsPublished { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public string MetaKeywords { get; set; }
        public string ContentHTML { get; set; }
        public string ContentText { get; set; }
        public List<string> Tags { get; set; }
    }
}
