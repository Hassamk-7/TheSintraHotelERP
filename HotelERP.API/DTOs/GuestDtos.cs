using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class GuestDto : BaseDto
    {
        [Required]
        [StringLength(100)]
        public string GuestId { get; set; }

        [Required]
        [StringLength(200)]
        public string FullName { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(50)]
        public string PhoneNumber { get; set; }

        [StringLength(10)]
        public string Gender { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(100)]
        public string IdType { get; set; }

        [StringLength(50)]
        public string IdNumber { get; set; }

        public byte[] IdProof { get; set; }

        [StringLength(200)]
        public string Company { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        [StringLength(100)]
        public string Nationality { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(200)]
        public string Occupation { get; set; }

        [StringLength(200)]
        public string EmergencyContact { get; set; }

        [StringLength(50)]
        public string EmergencyPhone { get; set; }
    }

    public class GuestCreateDto
    {
        [Required]
        [StringLength(200)]
        public string FullName { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(50)]
        public string PhoneNumber { get; set; }

        [StringLength(10)]
        public string Gender { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(100)]
        public string IdType { get; set; }

        [StringLength(50)]
        public string IdNumber { get; set; }

        public byte[] IdProof { get; set; }

        [StringLength(200)]
        public string Company { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }

    public class GuestUpdateDto
    {
        [StringLength(200)]
        public string FullName { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(50)]
        public string PhoneNumber { get; set; }

        [StringLength(10)]
        public string Gender { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(100)]
        public string IdType { get; set; }

        [StringLength(50)]
        public string IdNumber { get; set; }

        public byte[] IdProof { get; set; }

        [StringLength(200)]
        public string Company { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }

    public class GuestDocumentDto : BaseDto
    {
        public int GuestId { get; set; }
        public string DocumentType { get; set; }
        public string DocumentNumber { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string DocumentPath { get; set; }
        public string Notes { get; set; }
    }

    public class GuestLedgerDto : BaseDto
    {
        public int GuestId { get; set; }
        public DateTime TransactionDate { get; set; }
        public string TransactionType { get; set; }
        public string Description { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public decimal Balance { get; set; }
        public string Reference { get; set; }
        public string Notes { get; set; }
    }

    public class CreateGuestDto
    {
        [Required]
        [StringLength(200)]
        public string FullName { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(50)]
        public string? PhoneNumber { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(100)]
        public string? IdType { get; set; }

        [StringLength(50)]
        public string? IdNumber { get; set; }

        public string? IdProof { get; set; }

        [StringLength(200)]
        public string? Company { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(100)]
        public string? Nationality { get; set; }

        [StringLength(200)]
        public string? Occupation { get; set; }

        [StringLength(200)]
        public string? EmergencyContact { get; set; }

        [StringLength(50)]
        public string? EmergencyPhone { get; set; }
    }

    public class UpdateGuestDto
    {
        [Required]
        [StringLength(200)]
        public string FullName { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(50)]
        public string? PhoneNumber { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(100)]
        public string? IdType { get; set; }

        [StringLength(50)]
        public string? IdNumber { get; set; }

        public string? IdProof { get; set; }

        [StringLength(200)]
        public string? Company { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(100)]
        public string? Nationality { get; set; }

        [StringLength(200)]
        public string? Occupation { get; set; }

        [StringLength(200)]
        public string? EmergencyContact { get; set; }

        [StringLength(50)]
        public string? EmergencyPhone { get; set; }
    }

    public class GuestMasterDto
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(20)]
        public string GuestCode { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(20)]
        public string Gender { get; set; }

        [StringLength(50)]
        public string Nationality { get; set; }

        [StringLength(50)]
        public string IdType { get; set; }

        [StringLength(50)]
        public string IdNumber { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        [StringLength(100)]
        public string Company { get; set; }

        [StringLength(50)]
        public string GuestType { get; set; }
    }
}
