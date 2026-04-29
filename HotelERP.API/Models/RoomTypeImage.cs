using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class RoomTypeImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int RoomTypeId { get; set; }

        [ForeignKey("RoomTypeId")]
        public virtual RoomType? RoomType { get; set; }

        [StringLength(255)]
        public string? ImagePath { get; set; }

        [StringLength(255)]
        public string? OriginalFileName { get; set; }

        [StringLength(100)]
        public string? Title { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? AltText { get; set; }

        public long? FileSizeBytes { get; set; }

        public int? Width { get; set; }

        public int? Height { get; set; }

        [StringLength(50)]
        public string? MimeType { get; set; }

        public int? DisplayOrder { get; set; } = 0;

        public bool? IsPrimary { get; set; } = false;

        public bool? IsActive { get; set; } = true;

        public DateTime? UploadedAt { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string? UploadedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [StringLength(100)]
        public string? UpdatedBy { get; set; }

        // Thumbnail and compressed versions
        [StringLength(255)]
        public string? ThumbnailPath { get; set; }

        [StringLength(255)]
        public string? CompressedPath { get; set; }
    }
}
