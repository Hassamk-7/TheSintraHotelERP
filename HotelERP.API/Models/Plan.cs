using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    public class Plan : BaseEntity
    {
        [Required]
        public int HotelId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal BasePrice { get; set; }

        public bool StopSell { get; set; }

        public DateTime? ValidFrom { get; set; }

        public DateTime? ValidTo { get; set; }

        public bool ClosedToArrival { get; set; }

        public DateTime? ClosedToArrivalValidFrom { get; set; }

        public DateTime? ClosedToArrivalValidTo { get; set; }

        public bool ClosedToDeparture { get; set; }

        public DateTime? ClosedToDepartureValidFrom { get; set; }

        public DateTime? ClosedToDepartureValidTo { get; set; }

        [StringLength(30)]
        public string? PriceAdjustmentType { get; set; }

        [StringLength(30)]
        public string? PriceDifferenceType { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? PriceDifferenceValue { get; set; }

        public bool IsBreakfastIncluded { get; set; }
        public bool IsLunchIncluded { get; set; }
        public bool IsDinnerIncluded { get; set; }
        public bool IsActive { get; set; } = true;

        [StringLength(500)]
        public string TermsAndConditions { get; set; }

        // Navigation properties
        [ForeignKey("HotelId")]
        public virtual Hotel? Hotel { get; set; }

        public virtual ICollection<PlanRoomType> PlanRoomTypes { get; set; } = new List<PlanRoomType>();
    }

    public class PlanRoomType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlanId { get; set; }

        [Required]
        public int RoomTypeId { get; set; }

        [ForeignKey("PlanId")]
        public virtual Plan? Plan { get; set; }

        [ForeignKey("RoomTypeId")]
        public virtual RoomType? RoomType { get; set; }
    }
}
