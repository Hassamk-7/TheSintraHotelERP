-- ============================================================================
-- INSERT 10 SAMPLE CANCELLATION POLICIES
-- ============================================================================
-- Run this script in SQL Server Management Studio against your HotelERP database
-- 
-- IMPORTANT: Replace HotelId = 1 with your actual hotel ID
-- To find your hotel ID, run: SELECT Id, HotelName FROM Hotels;
-- ============================================================================

-- Check existing policies (optional)
-- SELECT COUNT(*) as ExistingPolicies FROM CancellationPolicies WHERE HotelId = 1;

INSERT INTO [dbo].[CancellationPolicies] 
(HotelId, Code, Name, Description, IsRefundable, FreeCancellationHours, PenaltyAfterDeadline, 
 PenaltyAppliesToDate, NoShowPenalty, EarlyDeparturePenalty, Timezone, Priority, Source, 
 DisplayTextDefault, DisplayTextWebsite, DisplayTextBookingCom, DisplayTextExpedia, DisplayTextOTA, 
 AppliesAllChannels, IsActive, CreatedAt)
VALUES

-- 1. Free Cancel 48 Hours
(1, 'CAN48', 'Free Cancel 48 Hours', 'Free cancellation up to 48 hours before arrival', 
 1, 48, '1 night', 'Arrival date', '1 night', NULL, 'UTC', 10, 'manual',
 'Free cancellation until 48 hours before arrival. After deadline: 1 night charge.',
 'Cancel free up to 48 hours before check-in. After that: 1 night penalty.',
 'Free cancellation 48 hours before arrival. After: 1 night penalty.',
 'Free cancellation 48 hours before arrival. After: 1 night penalty.',
 'Free cancellation 48 hours before arrival. After: 1 night penalty.',
 1, 1, GETUTCDATE()),

-- 2. Free Cancel 72 Hours
(1, 'CAN72', 'Free Cancel 72 Hours', 'Free cancellation up to 72 hours before arrival',
 1, 72, '1 night', 'Arrival date', '1 night', NULL, 'UTC', 20, 'manual',
 'Free cancellation until 72 hours before arrival. After deadline: 1 night charge.',
 'Cancel free up to 72 hours before check-in. After that: 1 night penalty.',
 'Free cancellation 72 hours before arrival. After: 1 night penalty.',
 'Free cancellation 72 hours before arrival. After: 1 night penalty.',
 'Free cancellation 72 hours before arrival. After: 1 night penalty.',
 1, 1, GETUTCDATE()),

-- 3. Non-Refundable
(1, 'NRF100', 'Non-Refundable', 'Non-refundable rate - no cancellation allowed',
 0, NULL, '100%', 'Booking date', '100%', NULL, 'UTC', 5, 'manual',
 'Non-refundable rate. No cancellations allowed.',
 'Non-refundable rate. No cancellations permitted.',
 'Non-refundable rate. No cancellations allowed.',
 'Non-refundable rate. No cancellations allowed.',
 'Non-refundable rate. No cancellations allowed.',
 1, 1, GETUTCDATE()),

-- 4. Corporate 72 Hours
(1, 'CORP72', 'Corporate 72 Hours', 'Corporate rate with 72 hours free cancellation',
 1, 72, '50%', 'Arrival date', '50%', NULL, 'UTC', 50, 'manual',
 'Corporate rate: Free cancellation 72 hours before arrival. After: 50% penalty.',
 'Corporate: Free cancel 72h before arrival. After: 50% penalty.',
 'Corporate: Free cancel 72h before arrival. After: 50% penalty.',
 'Corporate: Free cancel 72h before arrival. After: 50% penalty.',
 'Corporate: Free cancel 72h before arrival. After: 50% penalty.',
 1, 1, GETUTCDATE()),

-- 5. Flexible Rate
(1, 'FLEX', 'Flexible Rate', 'Most flexible cancellation policy',
 1, 24, '50%', 'Arrival date', '1 night', NULL, 'UTC', 30, 'manual',
 'Flexible rate: Free cancellation 24 hours before arrival. After: 50% penalty.',
 'Flexible: Free cancel 24h before arrival. After: 50% penalty.',
 'Flexible: Free cancel 24h before arrival. After: 50% penalty.',
 'Flexible: Free cancel 24h before arrival. After: 50% penalty.',
 'Flexible: Free cancel 24h before arrival. After: 50% penalty.',
 1, 1, GETUTCDATE()),

-- 6. Standard Rate
(1, 'STD', 'Standard Rate', 'Standard cancellation policy',
 1, 48, '1 night', 'Arrival date', '1 night', '1 night', 'UTC', 15, 'manual',
 'Standard rate: Free cancellation 48 hours before arrival. After: 1 night penalty.',
 'Standard: Free cancel 48h before arrival. After: 1 night penalty.',
 'Standard: Free cancel 48h before arrival. After: 1 night penalty.',
 'Standard: Free cancel 48h before arrival. After: 1 night penalty.',
 'Standard: Free cancel 48h before arrival. After: 1 night penalty.',
 1, 1, GETUTCDATE()),

-- 7. Premium Rate
(1, 'PREM', 'Premium Rate', 'Premium accommodation with flexible cancellation',
 1, 96, '1 night', 'Arrival date', '2 nights', NULL, 'UTC', 40, 'manual',
 'Premium rate: Free cancellation 96 hours before arrival. After: 1 night penalty.',
 'Premium: Free cancel 96h before arrival. After: 1 night penalty.',
 'Premium: Free cancel 96h before arrival. After: 1 night penalty.',
 'Premium: Free cancel 96h before arrival. After: 1 night penalty.',
 'Premium: Free cancel 96h before arrival. After: 1 night penalty.',
 1, 1, GETUTCDATE()),

-- 8. Budget Rate
(1, 'BUDG', 'Budget Rate', 'Budget rate with limited cancellation',
 1, 24, '100%', 'Arrival date', '100%', NULL, 'UTC', 8, 'manual',
 'Budget rate: Free cancellation 24 hours before arrival. After: 100% penalty.',
 'Budget: Free cancel 24h before arrival. After: 100% penalty.',
 'Budget: Free cancel 24h before arrival. After: 100% penalty.',
 'Budget: Free cancel 24h before arrival. After: 100% penalty.',
 'Budget: Free cancel 24h before arrival. After: 100% penalty.',
 1, 1, GETUTCDATE()),

-- 9. Group Rate
(1, 'GRP', 'Group Rate', 'Group booking cancellation policy',
 1, 120, '2 nights', 'Arrival date', '3 nights', NULL, 'UTC', 60, 'manual',
 'Group rate: Free cancellation 120 hours before arrival. After: 2 nights penalty.',
 'Group: Free cancel 120h before arrival. After: 2 nights penalty.',
 'Group: Free cancel 120h before arrival. After: 2 nights penalty.',
 'Group: Free cancel 120h before arrival. After: 2 nights penalty.',
 'Group: Free cancel 120h before arrival. After: 2 nights penalty.',
 1, 1, GETUTCDATE()),

-- 10. Last Minute Rate
(1, 'LAST', 'Last Minute Rate', 'Last minute bookings with strict cancellation',
 1, 6, '100%', 'Booking date', '100%', NULL, 'UTC', 3, 'manual',
 'Last minute rate: Free cancellation 6 hours before arrival. After: 100% penalty.',
 'Last minute: Free cancel 6h before arrival. After: 100% penalty.',
 'Last minute: Free cancel 6h before arrival. After: 100% penalty.',
 'Last minute: Free cancel 6h before arrival. After: 100% penalty.',
 'Last minute: Free cancel 6h before arrival. After: 100% penalty.',
 1, 1, GETUTCDATE());

-- ============================================================================
-- VERIFY INSERTION
-- ============================================================================
-- Run these queries to verify the data was inserted correctly:

-- View all inserted policies
SELECT 
    Id,
    Code,
    Name,
    IsRefundable,
    FreeCancellationHours,
    PenaltyAfterDeadline,
    NoShowPenalty,
    Priority,
    IsActive,
    CreatedAt
FROM [dbo].[CancellationPolicies]
WHERE HotelId = 1
ORDER BY Priority DESC, Name;

-- Count total policies
SELECT COUNT(*) as TotalPolicies FROM [dbo].[CancellationPolicies] WHERE HotelId = 1;

-- ============================================================================
-- DELETE ALL POLICIES (if needed to reset)
-- ============================================================================
-- DELETE FROM [dbo].[CancellationPolicies] WHERE HotelId = 1 AND Code IN ('CAN48', 'CAN72', 'NRF100', 'CORP72', 'FLEX', 'STD', 'PREM', 'BUDG', 'GRP', 'LAST');
