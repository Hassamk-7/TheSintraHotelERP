using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.DTOs
{
    public class CreateHotelMasterDto
    {
        [Required]
        public string HotelName { get; set; } = "";
        
        [Required]
        public string HotelCode { get; set; } = "";
        
        public string Address { get; set; } = "";
        public string City { get; set; } = "";
        public string State { get; set; } = "";
        public string Country { get; set; } = "";
        public string PinCode { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Mobile { get; set; } = "";
        public string Email { get; set; } = "";
        public string Website { get; set; } = "";
        public string Fax { get; set; } = "";
        public string GstNumber { get; set; } = "";
        public string PanNumber { get; set; } = "";
        public string LicenseNumber { get; set; } = "";
        public string Description { get; set; } = "";
        public bool IsActive { get; set; } = true;
    }
}
