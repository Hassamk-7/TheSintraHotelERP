using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace HotelERP.API.Services
{
    public interface ICheckoutInvoiceService
    {
        byte[] GeneratePdf(CheckoutInvoiceModel model);
        string GenerateEmailHtml(CheckoutInvoiceModel model);
    }

    public class CheckoutInvoiceService : ICheckoutInvoiceService
    {
        public byte[] GeneratePdf(CheckoutInvoiceModel model)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(28);
                    page.Size(PageSizes.A4);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header().Column(column =>
                    {
                        column.Item().Text(model.HotelName).FontSize(20).Bold().FontColor(Colors.Blue.Darken3);
                        column.Item().Text("Front Office Check-Out Invoice").FontSize(12).SemiBold().FontColor(Colors.Grey.Darken2);
                        column.Item().PaddingTop(6).Row(row =>
                        {
                            row.RelativeItem().Column(left =>
                            {
                                left.Item().Text($"Guest: {model.GuestName}");
                                left.Item().Text($"Room: {model.RoomNumber} / {model.RoomType}");
                                left.Item().Text($"Reservation #: {model.ReservationNumber}");
                                left.Item().Text($"Contact: {model.GuestEmailOrPhone}");
                            });

                            row.RelativeItem().AlignRight().Column(right =>
                            {
                                right.Item().AlignRight().Text($"Invoice #: {model.InvoiceNumber}").Bold();
                                right.Item().AlignRight().Text($"Invoice Date: {model.InvoiceDate:dd MMM yyyy hh:mm tt}");
                                right.Item().AlignRight().Text($"Check-In: {model.CheckInDate:dd MMM yyyy}");
                                right.Item().AlignRight().Text($"Check-Out: {model.CheckOutDate:dd MMM yyyy}");
                            });
                        });
                    });

                    page.Content().PaddingVertical(18).Column(column =>
                    {
                        column.Spacing(14);

                        column.Item().Row(row =>
                        {
                            row.RelativeItem().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(12).Column(card =>
                            {
                                card.Item().Text("Stay Summary").Bold();
                                card.Item().PaddingTop(6).Text($"Nights: {model.StayNights}");
                                card.Item().Text($"Rate / Night: {model.CurrencySymbol}{model.RatePerNight:N2}");
                                card.Item().Text($"Payment Status: {model.PaymentStatus}");
                            });

                            row.ConstantItem(14);

                            row.RelativeItem().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(12).Column(card =>
                            {
                                card.Item().Text("Payment Overview").Bold();
                                card.Item().PaddingTop(6).Text($"Advance Paid: {model.CurrencySymbol}{model.AdvancePaid:N2}");
                                card.Item().Text($"Paid Now: {model.CurrencySymbol}{model.PaidNow:N2}");
                                card.Item().Text($"Total Paid: {model.CurrencySymbol}{model.TotalPaid:N2}");
                                card.Item().Text($"Balance: {model.CurrencySymbol}{model.Balance:N2}").Bold();
                            });
                        });

                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(4);
                                columns.RelativeColumn(1);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Background(Colors.Grey.Lighten3).Padding(8).Text("Description").Bold();
                                header.Cell().Background(Colors.Grey.Lighten3).Padding(8).AlignRight().Text("Amount").Bold();
                            });

                            foreach (var item in model.LineItems)
                            {
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten3).Padding(8).Text(item.Description);
                                table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten3).Padding(8).AlignRight().Text($"{model.CurrencySymbol}{item.Amount:N2}");
                            }
                        });

                        column.Item().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(12).Column(payments =>
                        {
                            payments.Item().Text("Payment Breakdown").Bold();
                            payments.Item().PaddingTop(6);

                            if (model.PaymentLines.Count == 0)
                            {
                                payments.Item().Text("No payment lines recorded.");
                            }
                            else
                            {
                                foreach (var payment in model.PaymentLines)
                                {
                                    payments.Item().Row(row =>
                                    {
                                        row.RelativeItem().Column(left =>
                                        {
                                            left.Item().Text(payment.Method).SemiBold();
                                            left.Item().Text(string.IsNullOrWhiteSpace(payment.Reference) ? "No reference provided" : payment.Reference).FontSize(9).FontColor(Colors.Grey.Darken1);
                                        });
                                        row.ConstantItem(120).AlignRight().Text($"{model.CurrencySymbol}{payment.Amount:N2}").SemiBold();
                                    });
                                }
                            }
                        });

                        column.Item().AlignRight().Width(220).Border(1).BorderColor(Colors.Blue.Lighten2).Background(Colors.Blue.Lighten5).Padding(14).Column(total =>
                        {
                            total.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Total Bill").SemiBold();
                                row.ConstantItem(90).AlignRight().Text($"{model.CurrencySymbol}{model.TotalBill:N2}").SemiBold();
                            });
                            total.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Total Paid").SemiBold();
                                row.ConstantItem(90).AlignRight().Text($"{model.CurrencySymbol}{model.TotalPaid:N2}").SemiBold();
                            });
                            total.Item().PaddingTop(8).Row(row =>
                            {
                                row.RelativeItem().Text("Balance Due").Bold().FontSize(13);
                                row.ConstantItem(90).AlignRight().Text($"{model.CurrencySymbol}{model.Balance:N2}").Bold().FontSize(13);
                            });
                        });
                    });

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.Span("Generated by The Sintra Hotel PMS");
                    });
                });
            }).GeneratePdf();
        }

        public string GenerateEmailHtml(CheckoutInvoiceModel model)
        {
            var items = string.Join(string.Empty, model.LineItems.Select(item =>
                $"<tr><td style='padding:8px;border-bottom:1px solid #e2e8f0'>{item.Description}</td><td style='padding:8px;border-bottom:1px solid #e2e8f0;text-align:right'>{model.CurrencySymbol}{item.Amount:N2}</td></tr>"));

            var payments = model.PaymentLines.Count == 0
                ? "<p style='color:#64748b'>No payment lines recorded.</p>"
                : string.Join(string.Empty, model.PaymentLines.Select(payment =>
                    $"<div style='display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e2e8f0'><div><div style='font-weight:600'>{payment.Method}</div><div style='font-size:12px;color:#64748b'>{(string.IsNullOrWhiteSpace(payment.Reference) ? "No reference provided" : payment.Reference)}</div></div><div style='font-weight:600'>{model.CurrencySymbol}{payment.Amount:N2}</div></div>"));

            return $@"<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><title>Checkout Invoice</title></head>
<body style='font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a'>
  <div style='max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden'>
    <div style='background:#0f172a;color:#ffffff;padding:24px'>
      <h1 style='margin:0;font-size:28px'>{model.HotelName}</h1>
      <p style='margin:8px 0 0 0;color:#cbd5e1'>Front Office Check-Out Invoice</p>
    </div>
    <div style='padding:24px'>
      <div style='display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap'>
        <div>
          <div><strong>Guest:</strong> {model.GuestName}</div>
          <div><strong>Room:</strong> {model.RoomNumber} / {model.RoomType}</div>
          <div><strong>Reservation #:</strong> {model.ReservationNumber}</div>
        </div>
        <div>
          <div><strong>Invoice #:</strong> {model.InvoiceNumber}</div>
          <div><strong>Invoice Date:</strong> {model.InvoiceDate:dd MMM yyyy hh:mm tt}</div>
          <div><strong>Balance Due:</strong> {model.CurrencySymbol}{model.Balance:N2}</div>
        </div>
      </div>
      <table style='width:100%;margin-top:24px;border-collapse:collapse'>
        <thead>
          <tr style='background:#f1f5f9'>
            <th style='padding:10px;text-align:left'>Description</th>
            <th style='padding:10px;text-align:right'>Amount</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
      <div style='margin-top:24px'>
        <h3 style='margin-bottom:12px'>Payment Breakdown</h3>
        {payments}
      </div>
    </div>
  </div>
</body>
</html>";
        }
    }

    public class CheckoutInvoiceModel
    {
        public int? HotelId { get; set; }
        public string HotelName { get; set; } = "The Sintra Hotel";
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public string ReservationNumber { get; set; } = string.Empty;
        public string GuestName { get; set; } = string.Empty;
        public string GuestEmailOrPhone { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int StayNights { get; set; }
        public decimal RatePerNight { get; set; }
        public decimal AdvancePaid { get; set; }
        public decimal PaidNow { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal TotalBill { get; set; }
        public decimal Balance { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string CurrencySymbol { get; set; } = "Rs. ";
        public List<CheckoutInvoiceLineItem> LineItems { get; set; } = new();
        public List<CheckoutInvoicePaymentLine> PaymentLines { get; set; } = new();
    }

    public class CheckoutInvoiceLineItem
    {
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class CheckoutInvoicePaymentLine
    {
        public string Method { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Reference { get; set; } = string.Empty;
    }
}
