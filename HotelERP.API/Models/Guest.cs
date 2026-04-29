using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace HotelERP.API.Models
{
    public class Guest : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string GuestId { get; set; }

        [StringLength(200)]
        public string? FullName { get; set; }
        
        [Required]
        [NotMapped]
        public string FirstName 
        { 
            get => FullName?.Split(' ')[0] ?? FullName ?? ""; 
            set 
            {
                if (!string.IsNullOrEmpty(value))
                {
                    var parts = FullName?.Split(' ') ?? new string[0];
                    if (parts.Length > 1)
                        FullName = value + " " + string.Join(" ", parts.Skip(1));
                    else
                        FullName = value;
                }
            }
        }

        [NotMapped]
        public string? LastName 
        { 
            get => FullName?.Contains(' ') == true ? string.Join(" ", FullName.Split(' ').Skip(1)) : string.Empty; 
            set 
            {
                if (!string.IsNullOrEmpty(value))
                {
                    var firstName = FullName?.Split(' ')[0] ?? string.Empty;
                    FullName = firstName + " " + value;
                }
            }
        }

        [NotMapped]
        public string? Phone 
        { 
            get => PhoneNumber; 
            set => PhoneNumber = value; 
        }

        [StringLength(500)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(20)]
        public string? PostalCode { get; set; }

        [StringLength(50)]
        public string? PhoneNumber { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(100)]
        public string? IdType { get; set; }

        [StringLength(50)]
        public string? IdNumber { get; set; }

        public byte[]? IdProof { get; set; }

        [StringLength(200)]
        public string Company { get; set; } = "";  // Required in database, default to empty string

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(100)]
        public string? Nationality { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(200)]
        public string? Occupation { get; set; }

        [StringLength(200)]
        public string? EmergencyContact { get; set; }

        [StringLength(50)]
        public string? EmergencyPhone { get; set; }

        // Navigation properties
        public virtual ICollection<Reservation> Reservations { get; set; }
        public virtual ICollection<GuestDocs> Documents { get; set; }
        public virtual ICollection<GuestLedger> LedgerEntries { get; set; }
    }

    public class GuestDocs : BaseEntity
    {
        public int GuestId { get; set; }
        public string? DocumentType { get; set; }
        public string? DocumentNumber { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? DocumentPath { get; set; }
        public string? Notes { get; set; }

        // Navigation property
        public virtual Guest Guest { get; set; }
    }

    public class GuestLedger : BaseEntity
    {
        public int GuestId { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
        public string? TransactionType { get; set; } // Payment, Charge, Refund, etc.
        public string? Description { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public decimal Balance { get; set; }
        public string? Reference { get; set; } // Invoice number, receipt number, etc.
        public string? Notes { get; set; }

        // Navigation property
        public virtual Guest Guest { get; set; }
    }
}
