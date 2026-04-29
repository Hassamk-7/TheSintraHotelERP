using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    [Table("GuestBills")]
    public class GuestBill
    {
        [Key]
        public int Id { get; set; }

        public int? CheckInId { get; set; }
        public int? CheckOutId { get; set; }
        public int? ReservationId { get; set; }
        public int? GuestId { get; set; }

        [StringLength(100)]
        public string? GuestName { get; set; }

        [StringLength(10)]
        public string? RoomNumber { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CheckInDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CheckOutDate { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? RoomCharges { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? RestaurantCharges { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? LaundryCharges { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? OtherCharges { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Discount { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? TaxRate { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Subtotal { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? TaxAmount { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? TotalAmount { get; set; }

        [StringLength(50)]
        public string? PaymentMethod { get; set; }

        [StringLength(20)]
        public string? Status { get; set; }

        [StringLength(20)]
        public string? RecordType { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BillDate { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;

        // Computed column - BillNumber is calculated in database
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string? BillNumber { get; set; }

        // Navigation properties
        [ForeignKey("CheckInId")]
        public virtual CheckInMaster? CheckIn { get; set; }

        [ForeignKey("ReservationId")]
        public virtual Reservation? Reservation { get; set; }

        [ForeignKey("GuestId")]
        public virtual Guest? Guest { get; set; }
    }
}
