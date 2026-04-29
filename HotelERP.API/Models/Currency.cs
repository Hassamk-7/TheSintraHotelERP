using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class Currency : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(10)]
        public string Code { get; set; }

        [Required]
        [StringLength(10)]
        public string Symbol { get; set; }

        public decimal ExchangeRate { get; set; }

        public bool IsBaseCurrency { get; set; }

        [StringLength(500)]
        public string Description { get; set; }
    }
}
