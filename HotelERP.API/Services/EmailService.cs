using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using HotelERP.API.DTOs.CustomerWebsite;

namespace HotelERP.API.Services
{
    public interface IEmailService
    {
        Task SendBookingConfirmationEmail(ReservationResponseDto reservation, string hotelName, string hotelAddress, string hotelPhone);
        Task SendContactNotificationAsync(string name, string email, string phone, string subject, string message, string location);
        Task SendCheckoutInvoiceEmailAsync(string toEmail, string guestName, string subject, string htmlBody, byte[] pdfBytes, string pdfFileName);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendBookingConfirmationEmail(ReservationResponseDto reservation, string hotelName, string hotelAddress, string hotelPhone)
        {
            try
            {
                using var smtpClient = BuildSmtpClient();
                using var mailMessage = new MailMessage
                {
                    From = BuildFromAddress(),
                    Subject = $"Booking Confirmation - {reservation.ReservationNumber}",
                    Body = GenerateEmailBody(reservation, hotelName, hotelAddress, hotelPhone),
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(reservation.GuestEmail);

                await smtpClient.SendMailAsync(mailMessage);
                Console.WriteLine($"Booking confirmation email sent to {reservation.GuestEmail}");
            }
            catch (Exception ex)
            {
                // Log error but don't fail the booking
                Console.WriteLine($"Email sending failed: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }

        public async Task SendCheckoutInvoiceEmailAsync(string toEmail, string guestName, string subject, string htmlBody, byte[] pdfBytes, string pdfFileName)
        {
            try
            {
                using var smtpClient = BuildSmtpClient();
                using var mailMessage = new MailMessage
                {
                    From = BuildFromAddress(),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(toEmail);
                if (pdfBytes?.Length > 0)
                {
                    var stream = new MemoryStream(pdfBytes);
                    mailMessage.Attachments.Add(new Attachment(stream, pdfFileName, "application/pdf"));
                }

                await smtpClient.SendMailAsync(mailMessage);
                Console.WriteLine($"Checkout invoice email sent to {toEmail} for {guestName}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Checkout invoice email failed: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        private SmtpClient BuildSmtpClient()
        {
            var smtpHost = _configuration["EmailSettings:SmtpServer"]
                ?? _configuration["EmailSettings:SmtpHost"]
                ?? _configuration["Email:SmtpServer"]
                ?? "smtp.gmail.com";
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]
                ?? _configuration["Email:SmtpPort"]
                ?? "587");
            var smtpUsername = _configuration["EmailSettings:Username"]
                ?? _configuration["EmailSettings:SmtpUsername"]
                ?? _configuration["Email:Username"]
                ?? string.Empty;
            var smtpPassword = _configuration["EmailSettings:Password"]
                ?? _configuration["EmailSettings:SmtpPassword"]
                ?? _configuration["Email:Password"]
                ?? string.Empty;
            var enableSsl = bool.TryParse(_configuration["EmailSettings:EnableSsl"] ?? "true", out var parsedSsl)
                ? parsedSsl
                : true;

            if (string.IsNullOrWhiteSpace(smtpPassword))
            {
                throw new InvalidOperationException("SMTP password is not configured.");
            }

            return new SmtpClient(smtpHost)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = enableSsl,
            };
        }

        private MailAddress BuildFromAddress()
        {
            var fromEmail = _configuration["EmailSettings:SenderEmail"]
                ?? _configuration["EmailSettings:FromEmail"]
                ?? _configuration["Email:FromEmail"]
                ?? "info@clouddevnest.com";
            var fromName = _configuration["EmailSettings:SenderName"]
                ?? _configuration["EmailSettings:FromName"]
                ?? "Hotel ERP System";

            return new MailAddress(fromEmail, fromName);
        }

        private string GenerateEmailBody(ReservationResponseDto reservation, string hotelName, string hotelAddress, string hotelPhone)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Booking Confirmation</title>
</head>
<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>
        <tr>
            <td align='center'>
                <table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                    
                    <!-- Header -->
                    <tr>
                        <td style='background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 30px; text-align: center;'>
                            <h1 style='color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;'>
                                {hotelName}
                            </h1>
                            <p style='color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;'>
                                Booking Confirmation
                            </p>
                        </td>
                    </tr>

                    <!-- Success Message -->
                    <tr>
                        <td style='padding: 30px; text-align: center; background-color: #f0fdf4;'>
                            <div style='background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;'>
                                <span style='color: white; font-size: 30px;'>✓</span>
                            </div>
                            <h2 style='color: #065f46; margin: 0 0 10px 0; font-size: 24px;'>
                                Booking Confirmed!
                            </h2>
                            <p style='color: #059669; margin: 0; font-size: 16px;'>
                                Thank you for choosing {hotelName}
                            </p>
                        </td>
                    </tr>

                    <!-- Reservation Details -->
                    <tr>
                        <td style='padding: 30px;'>
                            <h3 style='color: #1f2937; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;'>
                                Reservation Details
                            </h3>
                            
                            <table width='100%' cellpadding='8' cellspacing='0'>
                                <tr>
                                    <td style='color: #6b7280; font-size: 14px; padding: 8px 0;'>Confirmation Number:</td>
                                    <td style='color: #1f2937; font-weight: bold; font-size: 16px; text-align: right; padding: 8px 0;'>
                                        {reservation.ReservationNumber}
                                    </td>
                                </tr>
                                <tr style='background-color: #f9fafb;'>
                                    <td style='color: #6b7280; font-size: 14px; padding: 8px 10px;'>Guest Name:</td>
                                    <td style='color: #1f2937; font-weight: 600; text-align: right; padding: 8px 10px;'>
                                        {reservation.GuestName}
                                    </td>
                                </tr>
                                <tr>
                                    <td style='color: #6b7280; font-size: 14px; padding: 8px 0;'>Rooms:</td>
                                    <td style='color: #1f2937; font-weight: 600; text-align: right; padding: 8px 0;'>
                                        {string.Join(", ", reservation.Rooms.Select(r => $"{r.RoomTypeName} ({r.RoomNumber})"))}
                                    </td>
                                </tr>
                                <tr>
                                    <td style='color: #6b7280; font-size: 14px; padding: 8px 0;'>Check-in:</td>
                                    <td style='color: #1f2937; font-weight: 600; text-align: right; padding: 8px 0;'>
                                        {reservation.CheckInDate:dddd, MMMM dd, yyyy}
                                    </td>
                                </tr>
                                <tr style='background-color: #f9fafb;'>
                                    <td style='color: #6b7280; font-size: 14px; padding: 8px 10px;'>Check-out:</td>
                                    <td style='color: #1f2937; font-weight: 600; text-align: right; padding: 8px 10px;'>
                                        {reservation.CheckOutDate:dddd, MMMM dd, yyyy}
                                    </td>
                                </tr>
                                <tr>
                                    <td style='color: #6b7280; font-size: 14px; padding: 8px 0;'>Number of Nights:</td>
                                    <td style='color: #1f2937; font-weight: 600; text-align: right; padding: 8px 0;'>
                                        {reservation.NumberOfNights} {(reservation.NumberOfNights == 1 ? "night" : "nights")}
                                    </td>
                                </tr>
                                <tr style='background-color: #f9fafb;'>
                                    <td style='color: #6b7280; font-size: 14px; padding: 8px 10px;'>Guests:</td>
                                    <td style='color: #1f2937; font-weight: 600; text-align: right; padding: 8px 10px;'>
                                        {reservation.NumberOfAdults} Adults, {reservation.NumberOfChildren} Children
                                    </td>
                                </tr>
                                <tr style='border-top: 2px solid #e5e7eb;'>
                                    <td style='color: #1f2937; font-size: 16px; font-weight: bold; padding: 15px 0 8px 0;'>Total Amount:</td>
                                    <td style='color: #2563eb; font-size: 20px; font-weight: bold; text-align: right; padding: 15px 0 8px 0;'>
                                        PKR {reservation.TotalAmount:N0}
                                    </td>
                                </tr>
                                <tr>
                                    <td style='color: #6b7280; font-size: 14px; padding: 0 0 8px 0;'>Payment Status:</td>
                                    <td style='text-align: right; padding: 0 0 8px 0;'>
                                        <span style='background-color: {(reservation.PaymentStatus == "Paid" ? "#10b981" : "#f59e0b")}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;'>
                                            {reservation.PaymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Important Information -->
                    <tr>
                        <td style='padding: 0 30px 30px 30px;'>
                            <div style='background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px;'>
                                <h4 style='color: #1e40af; margin: 0 0 10px 0; font-size: 16px;'>Important Information</h4>
                                <ul style='color: #1e40af; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;'>
                                    <li>Check-in time: 2:00 PM</li>
                                    <li>Check-out time: 12:00 PM</li>
                                    <li>Please bring a valid ID proof at check-in</li>
                                    <li>Early check-in subject to availability</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Hotel Contact -->
                    <tr>
                        <td style='background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;'>
                            <h3 style='color: #1f2937; margin: 0 0 15px 0; font-size: 18px;'>Contact Us</h3>
                            <p style='color: #6b7280; margin: 0 0 8px 0; font-size: 14px;'>
                                <strong style='color: #1f2937;'>Address:</strong> {hotelAddress}
                            </p>
                            <p style='color: #6b7280; margin: 0 0 8px 0; font-size: 14px;'>
                                <strong style='color: #1f2937;'>Phone:</strong> {hotelPhone}
                            </p>
                            <p style='color: #6b7280; margin: 0; font-size: 14px;'>
                                <strong style='color: #1f2937;'>Email:</strong> info@clouddevnest.com
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style='background-color: #1f2937; padding: 20px 30px; text-align: center;'>
                            <p style='color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;'>
                                Thank you for choosing {hotelName}
                            </p>
                            <p style='color: #6b7280; margin: 0; font-size: 12px;'>
                                This is an automated email. Please do not reply to this message.
                            </p>
                            <p style='color: #6b7280; margin: 10px 0 0 0; font-size: 12px;'>
                                © {DateTime.Now.Year} {hotelName}. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
        }

        public async Task SendContactNotificationAsync(string name, string email, string phone, string subject, string message, string location)
        {
            try
            {
                var fromEmail = _configuration["Email:FromEmail"] ?? "info@clouddevnest.com";
                var toEmail = _configuration["Email:ToEmail"] ?? "info@clouddevnest.com";

                using var smtpClient = BuildSmtpClient();
                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, "Hotel Contact Form"),
                    Subject = $"New Contact Message: {subject}",
                    Body = GenerateContactEmailBody(name, email, phone, subject, message, location),
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(toEmail);
                mailMessage.ReplyToList.Add(new MailAddress(email, name));

                await smtpClient.SendMailAsync(mailMessage);
                Console.WriteLine($"Contact notification email sent to {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Contact email sending failed: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        private string GenerateContactEmailBody(string name, string email, string phone, string subject, string message, string location)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>New Contact Message</title>
</head>
<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px;'>
        <tr>
            <td align='center'>
                <table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                    
                    <!-- Header -->
                    <tr>
                        <td style='background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 30px; text-align: center;'>
                            <h1 style='color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;'>
                                New Contact Message
                            </h1>
                            <p style='color: #e9d5ff; margin: 10px 0 0 0; font-size: 14px;'>
                                Received from website contact form
                            </p>
                        </td>
                    </tr>

                    <!-- Message Details -->
                    <tr>
                        <td style='padding: 30px;'>
                            <h3 style='color: #1f2937; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;'>
                                Contact Information
                            </h3>
                            
                            <table width='100%' cellpadding='8' cellspacing='0'>
                                <tr style='background-color: #f9fafb;'>
                                    <td style='color: #6b7280; font-size: 14px; padding: 12px; width: 30%;'><strong>Name:</strong></td>
                                    <td style='color: #1f2937; font-size: 14px; padding: 12px;'>{name}</td>
                                </tr>
                                <tr>
                                    <td style='color: #6b7280; font-size: 14px; padding: 12px;'><strong>Email:</strong></td>
                                    <td style='color: #1f2937; font-size: 14px; padding: 12px;'>
                                        <a href='mailto:{email}' style='color: #7c3aed; text-decoration: none;'>{email}</a>
                                    </td>
                                </tr>
                                <tr style='background-color: #f9fafb;'>
                                    <td style='color: #6b7280; font-size: 14px; padding: 12px;'><strong>Phone:</strong></td>
                                    <td style='color: #1f2937; font-size: 14px; padding: 12px;'>{phone ?? "Not provided"}</td>
                                </tr>
                                <tr>
                                    <td style='color: #6b7280; font-size: 14px; padding: 12px;'><strong>Location:</strong></td>
                                    <td style='color: #1f2937; font-size: 14px; padding: 12px;'>{location ?? "Not specified"}</td>
                                </tr>
                                <tr style='background-color: #f9fafb;'>
                                    <td style='color: #6b7280; font-size: 14px; padding: 12px;'><strong>Subject:</strong></td>
                                    <td style='color: #1f2937; font-size: 14px; padding: 12px; font-weight: 600;'>{subject}</td>
                                </tr>
                            </table>

                            <h3 style='color: #1f2937; margin: 30px 0 15px 0; font-size: 18px;'>
                                Message:
                            </h3>
                            <div style='background-color: #f9fafb; border-left: 4px solid #7c3aed; padding: 20px; border-radius: 4px;'>
                                <p style='color: #374151; margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;'>{message}</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Action Button -->
                    <tr>
                        <td style='padding: 0 30px 30px 30px; text-align: center;'>
                            <a href='mailto:{email}' style='display: inline-block; background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;'>
                                Reply to {name}
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style='background-color: #1f2937; padding: 20px 30px; text-align: center;'>
                            <p style='color: #9ca3af; margin: 0; font-size: 12px;'>
                                This message was sent from the Hotel ERP contact form at {DateTime.Now:dddd, MMMM dd, yyyy h:mm tt}
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
        }
    }
}

