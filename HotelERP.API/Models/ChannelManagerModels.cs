using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelERP.API.Models
{
    /// <summary>
    /// Stores channel manager connection settings per hotel
    /// </summary>
    public class ChannelManagerSetting : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Provider { get; set; } = "BookLogic"; // BookLogic, Booking.com, etc.

        [Required]
        [StringLength(200)]
        public string BaseUrl { get; set; }

        [StringLength(200)]
        public string? SendReservationUrl { get; set; }

        [StringLength(200)]
        public string? HotelListUrl { get; set; }

        [StringLength(200)]
        public string? HotelInfoUrl { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; }

        [Required]
        [StringLength(100)]
        public string Password { get; set; }

        [Required]
        [StringLength(50)]
        public string HotelCode { get; set; }

        public int ChannelId { get; set; }

        public bool IsProduction { get; set; }

        public bool IsActive { get; set; } = true;

        public bool AutoSyncAvailability { get; set; }

        public bool AutoPullReservations { get; set; }

        public bool AutoProcessReservations { get; set; }

        public int SyncIntervalMinutes { get; set; } = 5;

        public DateTime? LastAvailabilitySync { get; set; }

        public DateTime? LastReservationSync { get; set; }

        public DateTime? LastRateSync { get; set; }
    }

    /// <summary>
    /// Maps local ERP rooms to BookLogic room IDs
    /// </summary>
    public class ChannelManagerRoomMapping : BaseEntity
    {
        public int ChannelManagerSettingId { get; set; }

        [ForeignKey("ChannelManagerSettingId")]
        public virtual ChannelManagerSetting ChannelManagerSetting { get; set; }

        public int LocalRoomTypeId { get; set; }

        [ForeignKey("LocalRoomTypeId")]
        public virtual RoomType LocalRoomType { get; set; }

        [Required]
        [StringLength(50)]
        public string ExternalRoomId { get; set; }

        [StringLength(200)]
        public string? ExternalRoomName { get; set; }

        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// Maps local ERP rate plans to BookLogic rate IDs
    /// </summary>
    public class ChannelManagerRateMapping : BaseEntity
    {
        public int ChannelManagerSettingId { get; set; }

        [ForeignKey("ChannelManagerSettingId")]
        public virtual ChannelManagerSetting ChannelManagerSetting { get; set; }

        public int? LocalRoomRateId { get; set; }

        public int ChannelManagerRoomMappingId { get; set; }

        [ForeignKey("ChannelManagerRoomMappingId")]
        public virtual ChannelManagerRoomMapping RoomMapping { get; set; }

        [Required]
        [StringLength(50)]
        public string ExternalRateId { get; set; }

        [StringLength(200)]
        public string? ExternalRateName { get; set; }

        [StringLength(10)]
        public string? CurrencyCode { get; set; }

        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// Logs all channel manager API interactions for auditing
    /// </summary>
    public class ChannelManagerLog : BaseEntity
    {
        public int? ChannelManagerSettingId { get; set; }

        [ForeignKey("ChannelManagerSettingId")]
        public virtual ChannelManagerSetting? ChannelManagerSetting { get; set; }

        [Required]
        [StringLength(50)]
        public string Action { get; set; } // AvailabilityUpdate, GetReservations, MarkSend, RateUpdate, SyncBooking, etc.

        [Required]
        [StringLength(10)]
        public string Direction { get; set; } // Outbound, Inbound

        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Success, Failed

        public string? RequestPayload { get; set; }

        public string? ResponsePayload { get; set; }

        [StringLength(500)]
        public string? ErrorMessage { get; set; }

        public int? HttpStatusCode { get; set; }

        public long? DurationMs { get; set; }

        [StringLength(100)]
        public string? ExternalReservationId { get; set; }

        [StringLength(100)]
        public string? ExternalRoomId { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Stores reservations received from channel manager
    /// </summary>
    public class ChannelManagerReservation : BaseEntity
    {
        public int ChannelManagerSettingId { get; set; }

        [ForeignKey("ChannelManagerSettingId")]
        public virtual ChannelManagerSetting ChannelManagerSetting { get; set; }

        [Required]
        [StringLength(100)]
        public string ExternalReservationId { get; set; } // PnrID from BookLogic

        [StringLength(50)]
        public string? ExternalBookingId { get; set; } // reservationId attribute from BookLogic

        [StringLength(20)]
        public string? SyncType { get; set; } // NEW, MODIFIED, CANCELLED

        [StringLength(50)]
        public string? ExternalStatus { get; set; } // CF, CX, etc.

        public int? LocalReservationId { get; set; }

        [ForeignKey("LocalReservationId")]
        public virtual Reservation? LocalReservation { get; set; }

        [StringLength(100)]
        public string? GuestFirstName { get; set; }

        [StringLength(100)]
        public string? GuestLastName { get; set; }

        [StringLength(200)]
        public string? GuestEmail { get; set; }

        [StringLength(50)]
        public string? GuestPhone { get; set; }

        [StringLength(10)]
        public string? GuestCountryCode { get; set; }

        [StringLength(50)]
        public string? ExternalRoomId { get; set; }

        [StringLength(200)]
        public string? ExternalRoomName { get; set; }

        [StringLength(50)]
        public string? ExternalRateId { get; set; }

        [StringLength(200)]
        public string? ExternalRateName { get; set; }

        [StringLength(200)]
        public string? TravelAgentName { get; set; }

        [StringLength(200)]
        public string? LeaderName { get; set; }

        public DateTime? CheckInDate { get; set; }

        public DateTime? CheckOutDate { get; set; }

        public int Adults { get; set; } = 1;

        public int Children { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [StringLength(10)]
        public string? CurrencyCode { get; set; }

        [StringLength(10)]
        public string? PaymentType { get; set; } // H = Hotel Collect, C = Channel Collect

        [StringLength(500)]
        public string? Remarks { get; set; }

        public string? RawPayload { get; set; }

        public bool IsMarkedAsSent { get; set; }

        public bool IsProcessed { get; set; }

        [StringLength(500)]
        public string? ProcessingNotes { get; set; }

        public DateTime ReceivedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ProcessedAt { get; set; }
    }
}
