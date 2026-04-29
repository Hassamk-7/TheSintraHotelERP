using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class TableDto : BaseDto
    {
        public int? HotelId { get; set; }

        [Required]
        [StringLength(50)]
        public string TableNumber { get; set; }

        [Required]
        [StringLength(20)]
        public string TableCode { get; set; }

        [Range(1, 20)]
        public int Capacity { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string TableType { get; set; }

        [StringLength(50)]
        public string Shape { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public bool IsReservable { get; set; }

        public bool HasView { get; set; }

        public List<string> Features { get; set; } = new List<string>();

        public decimal MinOrderAmount { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        public int FloorNumber { get; set; }
    }

    public class TableCreateDto
    {
        [Required]
        public int? HotelId { get; set; }

        [Required]
        [StringLength(50)]
        public string TableNumber { get; set; }

        [Required]
        [StringLength(20)]
        public string TableCode { get; set; }

        [Range(1, 20)]
        public int Capacity { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string TableType { get; set; }

        [StringLength(50)]
        public string Shape { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public bool IsReservable { get; set; } = true;

        public bool HasView { get; set; }

        public List<string> Features { get; set; } = new List<string>();

        public decimal MinOrderAmount { get; set; } = 0;

        public int FloorNumber { get; set; } = 1;
    }

    public class TableUpdateDto
    {
        public int? HotelId { get; set; }

        [StringLength(50)]
        public string TableNumber { get; set; }

        [StringLength(20)]
        public string TableCode { get; set; }

        [Range(1, 20)]
        public int? Capacity { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(50)]
        public string TableType { get; set; }

        [StringLength(50)]
        public string Shape { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public bool? IsReservable { get; set; }

        public bool? HasView { get; set; }

        public List<string> Features { get; set; }

        public decimal? MinOrderAmount { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        public int? FloorNumber { get; set; }
    }
}
