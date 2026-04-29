using System;
using System.ComponentModel.DataAnnotations;

namespace HotelERP.API.Models
{
    public class CustomerDatabase : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string CustomerCode { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(100)]
        public string Country { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(20)]
        public string Gender { get; set; }

        [StringLength(50)]
        public string MaritalStatus { get; set; }

        [StringLength(100)]
        public string Occupation { get; set; }

        [StringLength(50)]
        public string IncomeRange { get; set; }

        [StringLength(500)]
        public string Preferences { get; set; }

        [StringLength(500)]
        public string Interests { get; set; }

        public DateTime FirstVisit { get; set; }

        public DateTime? LastVisit { get; set; }

        public int TotalVisits { get; set; }

        public decimal TotalSpent { get; set; }

        public decimal AverageSpending { get; set; }

        [StringLength(50)]
        public string CustomerSegment { get; set; } // VIP, Regular, Occasional, New

        [StringLength(50)]
        public string PreferredCommunication { get; set; } // Email, SMS, Phone, Mail

        public bool OptInMarketing { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }

    public class LoyaltyProgram : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string MembershipNumber { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        [StringLength(50)]
        public string ProgramTier { get; set; } // Bronze, Silver, Gold, Platinum

        [Required]
        public DateTime JoinDate { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public int CurrentPoints { get; set; }

        public int LifetimePoints { get; set; }

        public int RedeemedPoints { get; set; }

        public decimal TotalSpending { get; set; }

        public int StaysCompleted { get; set; }

        public int NightsStayed { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Active, Inactive, Suspended, Expired

        public DateTime? LastActivity { get; set; }

        public DateTime? NextTierDate { get; set; }

        public int PointsToNextTier { get; set; }

        [StringLength(500)]
        public string Benefits { get; set; }

        [StringLength(500)]
        public string SpecialOffers { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation properties
        public virtual CustomerDatabase Customer { get; set; }
    }

    public class MarketingCampaign : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string CampaignCode { get; set; }

        [Required]
        [StringLength(200)]
        public string CampaignName { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(50)]
        public string CampaignType { get; set; } // Email, SMS, Social Media, Print, Radio, TV

        [StringLength(100)]
        public string TargetAudience { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public decimal Budget { get; set; }

        public decimal ActualCost { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Planning, Active, Paused, Completed, Cancelled

        public int TargetReach { get; set; }

        public int ActualReach { get; set; }

        public int Impressions { get; set; }

        public int Clicks { get; set; }

        public int Conversions { get; set; }

        public decimal ConversionRate { get; set; }

        public decimal ROI { get; set; }

        [StringLength(100)]
        public string CampaignManager { get; set; }

        [StringLength(500)]
        public string Objectives { get; set; }

        [StringLength(500)]
        public string Results { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }

    public class GuestCommunication : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string CommunicationNumber { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        [StringLength(50)]
        public string CommunicationType { get; set; } // Email, SMS, Phone, Letter, In-Person

        [Required]
        [StringLength(100)]
        public string Subject { get; set; }

        [Required]
        [StringLength(1000)]
        public string Message { get; set; }

        [Required]
        public DateTime SentDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Sent, Delivered, Read, Replied, Failed

        public DateTime? DeliveredDate { get; set; }

        public DateTime? ReadDate { get; set; }

        public DateTime? ReplyDate { get; set; }

        [StringLength(1000)]
        public string ReplyMessage { get; set; }

        [StringLength(50)]
        public string Priority { get; set; } // Low, Medium, High, Urgent

        [StringLength(100)]
        public string SentBy { get; set; }

        [StringLength(50)]
        public string Purpose { get; set; } // Marketing, Service, Complaint, Information, Follow-up

        public int? CampaignId { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation properties
        public virtual CustomerDatabase Customer { get; set; }
        public virtual MarketingCampaign Campaign { get; set; }
    }

    public class ReviewsManagement : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string ReviewNumber { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        [StringLength(100)]
        public string ReviewSource { get; set; } // Google, TripAdvisor, Booking.com, Facebook, Internal

        [Required]
        public DateTime ReviewDate { get; set; }

        public int OverallRating { get; set; } // 1-5 scale

        [StringLength(200)]
        public string ReviewTitle { get; set; }

        [Required]
        [StringLength(2000)]
        public string ReviewText { get; set; }

        [StringLength(50)]
        public string ReviewType { get; set; } // Positive, Negative, Neutral

        [StringLength(50)]
        public string Status { get; set; } // New, Reviewed, Responded, Resolved

        public DateTime? ResponseDate { get; set; }

        [StringLength(1000)]
        public string ManagementResponse { get; set; }

        [StringLength(100)]
        public string RespondedBy { get; set; }

        public bool IsPublic { get; set; }

        public bool IsVerified { get; set; }

        public int HelpfulVotes { get; set; }

        [StringLength(500)]
        public string ActionsTaken { get; set; }

        [StringLength(500)]
        public string InternalNotes { get; set; }

        // Navigation properties
        public virtual CustomerDatabase Customer { get; set; }
    }

    public class SocialMediaManagement : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string PostNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string Platform { get; set; } // Facebook, Instagram, Twitter, LinkedIn, YouTube

        [Required]
        [StringLength(200)]
        public string PostTitle { get; set; }

        [Required]
        [StringLength(2000)]
        public string PostContent { get; set; }

        [StringLength(50)]
        public string PostType { get; set; } // Text, Image, Video, Link, Event

        [Required]
        public DateTime ScheduledDate { get; set; }

        public DateTime? PublishedDate { get; set; }

        [StringLength(50)]
        public string Status { get; set; } // Draft, Scheduled, Published, Failed

        public int Likes { get; set; }

        public int Shares { get; set; }

        public int Comments { get; set; }

        public int Reach { get; set; }

        public int Impressions { get; set; }

        public int Clicks { get; set; }

        public decimal EngagementRate { get; set; }

        [StringLength(500)]
        public string Hashtags { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }

        [StringLength(200)]
        public string VideoPath { get; set; }

        [StringLength(100)]
        public string CreatedBy { get; set; }

        [StringLength(100)]
        public string ApprovedBy { get; set; }

        public DateTime? ApprovalDate { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }
}
