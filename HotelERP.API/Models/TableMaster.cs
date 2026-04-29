using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class TableMaster : BaseEntity
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
        public string Location { get; set; } // Main Hall, Garden, VIP Section, etc.

        [StringLength(50)]
        public string TableType { get; set; } // Regular, VIP, Outdoor, Private, etc.

        [StringLength(50)]
        public string Shape { get; set; } // Round, Square, Rectangular, etc.

        [StringLength(500)]
        public string Description { get; set; }

        public bool IsReservable { get; set; } = true;

        public bool HasView { get; set; } // Garden view, city view, etc.

        [StringLength(200)]
        public string Features { get; set; } // Comma-separated features

        public decimal MinOrderAmount { get; set; } = 0;

        [StringLength(50)]
        public string Status { get; set; } = "Available"; // Available, Occupied, Reserved, Maintenance

        public int FloorNumber { get; set; } = 1;
    }
}
