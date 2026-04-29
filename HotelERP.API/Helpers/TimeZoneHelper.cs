using System;

namespace HotelERP.API.Helpers
{
    public static class TimeZoneHelper
    {
        // Pakistan Standard Time (UTC+5)
        private static readonly TimeZoneInfo PakistanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Pakistan Standard Time");

        /// <summary>
        /// Gets current Pakistan local time (UTC+5)
        /// </summary>
        public static DateTime GetPakistanTime()
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, PakistanTimeZone);
        }

        /// <summary>
        /// Converts UTC to Pakistan time
        /// </summary>
        public static DateTime ConvertToPakistanTime(DateTime utcTime)
        {
            if (utcTime.Kind != DateTimeKind.Utc)
            {
                utcTime = DateTime.SpecifyKind(utcTime, DateTimeKind.Utc);
            }
            return TimeZoneInfo.ConvertTimeFromUtc(utcTime, PakistanTimeZone);
        }

        /// <summary>
        /// Converts Pakistan time to UTC
        /// </summary>
        public static DateTime ConvertToUtc(DateTime pakistanTime)
        {
            return TimeZoneInfo.ConvertTimeToUtc(pakistanTime, PakistanTimeZone);
        }
    }
}
