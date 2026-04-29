using System;
using System.Collections.Generic;

namespace HotelERP.API.DTOs
{
    public class PurchaseOrderDTO
    {
        public int Id { get; set; }
        public string PONumber { get; set; }
        public int SupplierId { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public string Status { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderedBy { get; set; }
        public string ApprovedBy { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string Terms { get; set; }
        public string Remarks { get; set; }
        public bool IsActive { get; set; }
        public List<PurchaseOrderItemDTO> Items { get; set; } = new List<PurchaseOrderItemDTO>();
    }

    public class PurchaseOrderItemDTO
    {
        public int Id { get; set; }
        public int PurchaseOrderId { get; set; }
        public int ItemId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal ReceivedQuantity { get; set; }
        public decimal PendingQuantity { get; set; }
        public string Specifications { get; set; }
        public string Remarks { get; set; }
    }
}
