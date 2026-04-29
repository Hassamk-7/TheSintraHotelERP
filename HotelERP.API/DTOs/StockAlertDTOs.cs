using System;

namespace HotelERP.API.DTOs
{
    public class StockAlertResponseDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string ItemCode { get; set; }
        public string AlertType { get; set; }
        public string Priority { get; set; }
        public decimal CurrentStock { get; set; }
        public decimal MinimumLevel { get; set; }
        public string Status { get; set; }
        public string Supplier { get; set; }
        public string Location { get; set; }
        public string Message { get; set; }
        public string AlertedTo { get; set; }
        public DateTime AlertDate { get; set; }
        public DateTime? ResolvedDate { get; set; }
        public string ResolvedBy { get; set; }
        public string LastUpdated { get; set; }
        public string Remarks { get; set; }
    }

    public class ResolveStockAlertDto
    {
        public string ResolvedBy { get; set; }
        public string Remarks { get; set; }
    }
}
