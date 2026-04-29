using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class CreateCurrencyDto
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

        [Range(0.001, double.MaxValue)]
        public decimal ExchangeRate { get; set; }

        public bool IsBaseCurrency { get; set; }

        [StringLength(500)]
        public string Description { get; set; }
    }

    public class UpdateCurrencyDto : CreateCurrencyDto
    {
    }

    public class CurrencyDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Symbol { get; set; }
        public decimal ExchangeRate { get; set; }
        public bool IsBaseCurrency { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
