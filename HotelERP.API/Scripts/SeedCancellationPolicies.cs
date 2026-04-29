using System;
using System.Collections.Generic;
using System.Linq;
using HotelERP.API.Data;
using HotelERP.API.Models;

namespace HotelERP.API.Scripts
{
    public class CancellationPolicySeed
    {
        public static void SeedPolicies(HotelDbContext context)
        {
            // Get the first hotel or create one
            var hotel = context.Hotels.FirstOrDefault();
            if (hotel == null)
            {
                Console.WriteLine("No hotels found. Please create a hotel first.");
                return;
            }

            int hotelId = hotel.Id;

            // Check if policies already exist
            if (context.CancellationPolicies.Any(p => p.HotelId == hotelId))
            {
                Console.WriteLine($"Policies already exist for hotel {hotel.HotelName}");
                return;
            }

            var policies = new List<CancellationPolicy>
            {
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "CAN48",
                    Name = "Free Cancel 48 Hours",
                    Description = "Free cancellation up to 48 hours before arrival",
                    IsRefundable = true,
                    FreeCancellationHours = 48,
                    PenaltyAfterDeadline = "1 night",
                    PenaltyAppliesToDate = "Arrival date",
                    NoShowPenalty = "1 night",
                    Timezone = "UTC",
                    Priority = 10,
                    Source = "manual",
                    DisplayTextDefault = "Free cancellation until 48 hours before arrival. After deadline: 1 night charge.",
                    DisplayTextWebsite = "Cancel free up to 48 hours before check-in. After that: 1 night penalty.",
                    DisplayTextBookingCom = "Free cancellation 48 hours before arrival. After: 1 night penalty.",
                    DisplayTextExpedia = "Free cancellation 48 hours before arrival. After: 1 night penalty.",
                    DisplayTextOTA = "Free cancellation 48 hours before arrival. After: 1 night penalty.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "CAN72",
                    Name = "Free Cancel 72 Hours",
                    Description = "Free cancellation up to 72 hours before arrival",
                    IsRefundable = true,
                    FreeCancellationHours = 72,
                    PenaltyAfterDeadline = "1 night",
                    PenaltyAppliesToDate = "Arrival date",
                    NoShowPenalty = "1 night",
                    Timezone = "UTC",
                    Priority = 20,
                    Source = "manual",
                    DisplayTextDefault = "Free cancellation until 72 hours before arrival. After deadline: 1 night charge.",
                    DisplayTextWebsite = "Cancel free up to 72 hours before check-in. After that: 1 night penalty.",
                    DisplayTextBookingCom = "Free cancellation 72 hours before arrival. After: 1 night penalty.",
                    DisplayTextExpedia = "Free cancellation 72 hours before arrival. After: 1 night penalty.",
                    DisplayTextOTA = "Free cancellation 72 hours before arrival. After: 1 night penalty.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "NRF100",
                    Name = "Non-Refundable",
                    Description = "Non-refundable rate - no cancellation allowed",
                    IsRefundable = false,
                    FreeCancellationHours = null,
                    PenaltyAfterDeadline = "100%",
                    PenaltyAppliesToDate = "Booking date",
                    NoShowPenalty = "100%",
                    Timezone = "UTC",
                    Priority = 5,
                    Source = "manual",
                    DisplayTextDefault = "Non-refundable rate. No cancellations allowed.",
                    DisplayTextWebsite = "Non-refundable rate. No cancellations permitted.",
                    DisplayTextBookingCom = "Non-refundable rate. No cancellations allowed.",
                    DisplayTextExpedia = "Non-refundable rate. No cancellations allowed.",
                    DisplayTextOTA = "Non-refundable rate. No cancellations allowed.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "CORP72",
                    Name = "Corporate 72 Hours",
                    Description = "Corporate rate with 72 hours free cancellation",
                    IsRefundable = true,
                    FreeCancellationHours = 72,
                    PenaltyAfterDeadline = "50%",
                    PenaltyAppliesToDate = "Arrival date",
                    NoShowPenalty = "50%",
                    Timezone = "UTC",
                    Priority = 50,
                    Source = "manual",
                    DisplayTextDefault = "Corporate rate: Free cancellation 72 hours before arrival. After: 50% penalty.",
                    DisplayTextWebsite = "Corporate: Free cancel 72h before arrival. After: 50% penalty.",
                    DisplayTextBookingCom = "Corporate: Free cancel 72h before arrival. After: 50% penalty.",
                    DisplayTextExpedia = "Corporate: Free cancel 72h before arrival. After: 50% penalty.",
                    DisplayTextOTA = "Corporate: Free cancel 72h before arrival. After: 50% penalty.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "FLEX",
                    Name = "Flexible Rate",
                    Description = "Most flexible cancellation policy",
                    IsRefundable = true,
                    FreeCancellationHours = 24,
                    PenaltyAfterDeadline = "50%",
                    PenaltyAppliesToDate = "Arrival date",
                    NoShowPenalty = "1 night",
                    Timezone = "UTC",
                    Priority = 30,
                    Source = "manual",
                    DisplayTextDefault = "Flexible rate: Free cancellation 24 hours before arrival. After: 50% penalty.",
                    DisplayTextWebsite = "Flexible: Free cancel 24h before arrival. After: 50% penalty.",
                    DisplayTextBookingCom = "Flexible: Free cancel 24h before arrival. After: 50% penalty.",
                    DisplayTextExpedia = "Flexible: Free cancel 24h before arrival. After: 50% penalty.",
                    DisplayTextOTA = "Flexible: Free cancel 24h before arrival. After: 50% penalty.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "STD",
                    Name = "Standard Rate",
                    Description = "Standard cancellation policy",
                    IsRefundable = true,
                    FreeCancellationHours = 48,
                    PenaltyAfterDeadline = "1 night",
                    PenaltyAppliesToDate = "Arrival date",
                    NoShowPenalty = "1 night",
                    EarlyDeparturePenalty = "1 night",
                    Timezone = "UTC",
                    Priority = 15,
                    Source = "manual",
                    DisplayTextDefault = "Standard rate: Free cancellation 48 hours before arrival. After: 1 night penalty.",
                    DisplayTextWebsite = "Standard: Free cancel 48h before arrival. After: 1 night penalty.",
                    DisplayTextBookingCom = "Standard: Free cancel 48h before arrival. After: 1 night penalty.",
                    DisplayTextExpedia = "Standard: Free cancel 48h before arrival. After: 1 night penalty.",
                    DisplayTextOTA = "Standard: Free cancel 48h before arrival. After: 1 night penalty.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "PREM",
                    Name = "Premium Rate",
                    Description = "Premium accommodation with flexible cancellation",
                    IsRefundable = true,
                    FreeCancellationHours = 96,
                    PenaltyAfterDeadline = "1 night",
                    PenaltyAppliesToDate = "Arrival date",
                    NoShowPenalty = "2 nights",
                    Timezone = "UTC",
                    Priority = 40,
                    Source = "manual",
                    DisplayTextDefault = "Premium rate: Free cancellation 96 hours before arrival. After: 1 night penalty.",
                    DisplayTextWebsite = "Premium: Free cancel 96h before arrival. After: 1 night penalty.",
                    DisplayTextBookingCom = "Premium: Free cancel 96h before arrival. After: 1 night penalty.",
                    DisplayTextExpedia = "Premium: Free cancel 96h before arrival. After: 1 night penalty.",
                    DisplayTextOTA = "Premium: Free cancel 96h before arrival. After: 1 night penalty.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "BUDG",
                    Name = "Budget Rate",
                    Description = "Budget rate with limited cancellation",
                    IsRefundable = true,
                    FreeCancellationHours = 24,
                    PenaltyAfterDeadline = "100%",
                    PenaltyAppliesToDate = "Arrival date",
                    NoShowPenalty = "100%",
                    Timezone = "UTC",
                    Priority = 8,
                    Source = "manual",
                    DisplayTextDefault = "Budget rate: Free cancellation 24 hours before arrival. After: 100% penalty.",
                    DisplayTextWebsite = "Budget: Free cancel 24h before arrival. After: 100% penalty.",
                    DisplayTextBookingCom = "Budget: Free cancel 24h before arrival. After: 100% penalty.",
                    DisplayTextExpedia = "Budget: Free cancel 24h before arrival. After: 100% penalty.",
                    DisplayTextOTA = "Budget: Free cancel 24h before arrival. After: 100% penalty.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "GRP",
                    Name = "Group Rate",
                    Description = "Group booking cancellation policy",
                    IsRefundable = true,
                    FreeCancellationHours = 120,
                    PenaltyAfterDeadline = "2 nights",
                    PenaltyAppliesToDate = "Arrival date",
                    NoShowPenalty = "3 nights",
                    Timezone = "UTC",
                    Priority = 60,
                    Source = "manual",
                    DisplayTextDefault = "Group rate: Free cancellation 120 hours before arrival. After: 2 nights penalty.",
                    DisplayTextWebsite = "Group: Free cancel 120h before arrival. After: 2 nights penalty.",
                    DisplayTextBookingCom = "Group: Free cancel 120h before arrival. After: 2 nights penalty.",
                    DisplayTextExpedia = "Group: Free cancel 120h before arrival. After: 2 nights penalty.",
                    DisplayTextOTA = "Group: Free cancel 120h before arrival. After: 2 nights penalty.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CancellationPolicy
                {
                    HotelId = hotelId,
                    Code = "LAST",
                    Name = "Last Minute Rate",
                    Description = "Last minute bookings with strict cancellation",
                    IsRefundable = true,
                    FreeCancellationHours = 6,
                    PenaltyAfterDeadline = "100%",
                    PenaltyAppliesToDate = "Booking date",
                    NoShowPenalty = "100%",
                    Timezone = "UTC",
                    Priority = 3,
                    Source = "manual",
                    DisplayTextDefault = "Last minute rate: Free cancellation 6 hours before arrival. After: 100% penalty.",
                    DisplayTextWebsite = "Last minute: Free cancel 6h before arrival. After: 100% penalty.",
                    DisplayTextBookingCom = "Last minute: Free cancel 6h before arrival. After: 100% penalty.",
                    DisplayTextExpedia = "Last minute: Free cancel 6h before arrival. After: 100% penalty.",
                    DisplayTextOTA = "Last minute: Free cancel 6h before arrival. After: 100% penalty.",
                    AppliesAllChannels = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.CancellationPolicies.AddRange(policies);
            context.SaveChanges();

            Console.WriteLine($"✅ Successfully seeded {policies.Count} cancellation policies for hotel: {hotel.HotelName}");
        }
    }
}
