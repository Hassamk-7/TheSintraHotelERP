using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class RoomTypeImageDto
    {
        public int Id { get; set; }
        public int RoomTypeId { get; set; }
        public string ImagePath { get; set; }
        public string OriginalFileName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AltText { get; set; }
        public long FileSizeBytes { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string MimeType { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        public DateTime UploadedAt { get; set; }
        public string UploadedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public string ThumbnailPath { get; set; }
        public string CompressedPath { get; set; }
    }

    public class RoomTypeImageUploadDto
    {
        [Required]
        public int RoomTypeId { get; set; }
        
        [Required]
        public IFormFile ImageFile { get; set; }
        
        public string Title { get; set; }
        public string Description { get; set; }
        public string AltText { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsPrimary { get; set; } = false;
    }

    public class RoomTypeImageUpdateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string AltText { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
    }
}
