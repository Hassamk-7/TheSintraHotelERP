using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class CompanyContact : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string CompanyName { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string State { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(20)]
        public string PostalCode { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [StringLength(20)]
        public string Mobile { get; set; }

        [StringLength(20)]
        public string Fax { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(200)]
        public string Website { get; set; }

        [StringLength(50)]
        public string TaxNumber { get; set; }

        [StringLength(50)]
        public string RegistrationNumber { get; set; }

        [StringLength(100)]
        public string ContactPerson { get; set; }

        [StringLength(100)]
        public string ContactPersonTitle { get; set; }

        [StringLength(20)]
        public string ContactPersonPhone { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string ContactPersonEmail { get; set; }

        [StringLength(255)]
        public string LogoPath { get; set; }

        [StringLength(50)]
        public string Currency { get; set; } = "USD";

        [StringLength(50)]
        public string TimeZone { get; set; }

        [StringLength(10)]
        public string DateFormat { get; set; } = "MM/dd/yyyy";

        [StringLength(10)]
        public string TimeFormat { get; set; } = "HH:mm";

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }
    }

    public class EmailSetting : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string SmtpServer { get; set; }

        [Required]
        public int SmtpPort { get; set; } = 587;

        [Required]
        [StringLength(100)]
        public string Username { get; set; }

        [Required]
        [StringLength(255)]
        public string Password { get; set; } // Should be encrypted

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string FromEmail { get; set; }

        [StringLength(100)]
        public string FromName { get; set; }

        public bool EnableSsl { get; set; } = true;

        public bool UseDefaultCredentials { get; set; } = false;

        [StringLength(50)]
        public string AuthenticationMethod { get; set; } = "Login";

        [Range(1, 300)]
        public int TimeoutSeconds { get; set; } = 30;

        public bool IsDefault { get; set; } = false;

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }
    }

    public class SMSSetting : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string ProviderName { get; set; } // Twilio, AWS SNS, etc.

        [Required]
        [StringLength(255)]
        public string ApiKey { get; set; }

        [StringLength(255)]
        public string ApiSecret { get; set; }

        [StringLength(100)]
        public string ApiUrl { get; set; }

        [StringLength(20)]
        public string FromNumber { get; set; }

        [StringLength(50)]
        public string AccountSid { get; set; } // For Twilio

        [StringLength(255)]
        public string AuthToken { get; set; } // For Twilio

        [StringLength(100)]
        public string Region { get; set; } // For AWS SNS

        public bool IsDefault { get; set; } = false;

        [Range(1, 300)]
        public int TimeoutSeconds { get; set; } = 30;

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }
    }

    public class SystemSetting : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string SettingKey { get; set; }

        [Required]
        [StringLength(1000)]
        public string SettingValue { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string Category { get; set; } // General, Email, SMS, Payment, etc.

        [StringLength(50)]
        public string DataType { get; set; } = "String"; // String, Number, Boolean, Date, etc.

        public bool IsEncrypted { get; set; } = false;

        public bool IsUserEditable { get; set; } = true;

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }
    }
}
