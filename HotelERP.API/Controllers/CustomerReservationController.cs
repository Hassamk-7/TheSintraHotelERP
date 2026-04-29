using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs.CustomerWebsite;
using HotelERP.API.Services;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerReservationController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly IEmailService _emailService;
        private readonly BookLogicService _bookLogic;
        private readonly ILogger<CustomerReservationController> _logger;

        public CustomerReservationController(HotelDbContext context, IEmailService emailService, BookLogicService bookLogic, ILogger<CustomerReservationController> logger)
        {
            _context = context;
            _emailService = emailService;
            _bookLogic = bookLogic;
            _logger = logger;
        }

        private async Task<string> GenerateGuestIdAsync()
        {
            var lastGuest = await _context.Guests
                .OrderByDescending(g => g.Id)
                .FirstOrDefaultAsync();

            if (lastGuest != null && !string.IsNullOrWhiteSpace(lastGuest.GuestId) && lastGuest.GuestId.StartsWith("G"))
            {
                var suffix = lastGuest.GuestId.Substring(1);
                if (int.TryParse(suffix, out var lastNumber))
                {
                    return $"G{(lastNumber + 1):D6}";
                }
            }

            return $"G{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
        }

        private static bool IsRateBookable(RoomRates? rate, DateTime checkInDate, DateTime checkOutDate, out string restrictionMessage)
        {
            restrictionMessage = string.Empty;
            if (rate == null)
            {
                return true;
            }

            var arrival = checkInDate.Date;
            var departure = checkOutDate.Date;
            var validFrom = rate.EffectiveFrom.Date;
            var validTo = rate.EffectiveTo.Date;
            var nights = (departure - arrival).Days;

            if (nights <= 0)
            {
                restrictionMessage = "Invalid date range";
                return false;
            }

            if (arrival < validFrom || departure > validTo)
            {
                restrictionMessage = $"Rate is valid only from {validFrom:yyyy-MM-dd} to {validTo:yyyy-MM-dd}";
                return false;
            }

            if (rate.MinStay.HasValue && nights < rate.MinStay.Value)
            {
                restrictionMessage = $"Minimum stay is {rate.MinStay.Value} night(s)";
                return false;
            }

            if (rate.MaxStay.HasValue && nights > rate.MaxStay.Value)
            {
                restrictionMessage = $"Maximum stay is {rate.MaxStay.Value} night(s)";
                return false;
            }

            if (rate.ClosedToArrival && arrival != validFrom)
            {
                restrictionMessage = $"Arrival allowed only on {validFrom:yyyy-MM-dd}";
                return false;
            }

            if (rate.ClosedToDeparture && departure != validTo)
            {
                restrictionMessage = $"Departure allowed only on {validTo:yyyy-MM-dd}";
                return false;
            }

            return true;
        }

        private static string NormalizePaymentMethod(string? paymentMethod)
        {
            var value = (paymentMethod ?? string.Empty).Trim().ToLowerInvariant();
            return value switch
            {
                "online-payment" => "Online Payment",
                "credit-card" => "Online Payment",
                "pay-at-hotel" => "Pay at Hotel",
                _ => string.IsNullOrWhiteSpace(paymentMethod) ? "Pay at Hotel" : paymentMethod!
            };
        }

        // POST: api/CustomerReservation/create
        [HttpPost("create")]
        public async Task<ActionResult<ReservationResponseDto>> CreateReservation([FromBody] CreateReservationDto request)
        {
            try
            {
                // Validate dates
                if (request.CheckOutDate <= request.CheckInDate)
                {
                    return BadRequest("Check-out date must be after check-in date");
                }

                if (request.SelectedRooms == null || !request.SelectedRooms.Any())
                {
                    return BadRequest("No rooms selected");
                }

                // Create or find guest
                var incomingEmail = (request.Email ?? string.Empty).Trim();
                if (string.IsNullOrWhiteSpace(incomingEmail))
                {
                    return BadRequest("Email is required");
                }

                var incomingEmailLower = incomingEmail.ToLower();

                var guest = await _context.Guests
                    .FirstOrDefaultAsync(g => g.Email != null && g.Email.Trim().ToLower() == incomingEmailLower);

                var incomingFirstName = (request.FirstName ?? string.Empty).Trim();
                var incomingLastName = (request.LastName ?? string.Empty).Trim();
                var incomingFullName = $"{incomingFirstName} {incomingLastName}".Trim();
                var incomingPhoneNumber = (request.PhoneNumber ?? string.Empty).Trim();
                var incomingAddress = (request.Address ?? string.Empty).Trim();
                var incomingCity = (request.City ?? string.Empty).Trim();
                var incomingCountry = (request.Country ?? string.Empty).Trim();
                var incomingPostalCode = (request.PostalCode ?? string.Empty).Trim();
                var incomingIdType = (request.IdType ?? string.Empty).Trim();
                var incomingIdNumber = (request.IdNumber ?? string.Empty).Trim();
                var incomingNotes = string.Join(" | ", new[]
                {
                    (request.SpecialRequests ?? string.Empty).Trim(),
                    (request.Notes ?? string.Empty).Trim()
                }.Where(x => !string.IsNullOrWhiteSpace(x)));

                if (guest == null)
                {
                    var guestId = await GenerateGuestIdAsync();

                    guest = new Guest
                    {
                        GuestId = guestId,
                        FullName = incomingFullName,
                        Email = incomingEmail,
                        PhoneNumber = incomingPhoneNumber,
                        Address = incomingAddress,
                        City = incomingCity,
                        Country = string.IsNullOrWhiteSpace(incomingCountry) ? "Pakistan" : incomingCountry,
                        PostalCode = incomingPostalCode,
                        IdType = incomingIdType,
                        IdNumber = incomingIdNumber,
                        Company = string.IsNullOrWhiteSpace(request.Company) ? "" : request.Company.Trim(),
                        Notes = incomingNotes,
                        Gender = string.IsNullOrWhiteSpace(request.Gender) ? null : request.Gender.Trim(),
                        DateOfBirth = request.DateOfBirth,
                        EmergencyContact = string.IsNullOrWhiteSpace(request.EmergencyContact) ? null : request.EmergencyContact.Trim(),
                        EmergencyPhone = string.IsNullOrWhiteSpace(request.EmergencyPhone) ? null : request.EmergencyPhone.Trim(),
                        Nationality = string.IsNullOrWhiteSpace(request.Nationality) ? null : request.Nationality.Trim(),
                        Occupation = string.IsNullOrWhiteSpace(request.Occupation) ? null : request.Occupation.Trim(),
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Guests.Add(guest);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    guest.FullName = incomingFullName;
                    guest.Email = incomingEmail;
                    guest.PhoneNumber = incomingPhoneNumber;
                    guest.Address = incomingAddress;
                    guest.City = incomingCity;
                    guest.Country = string.IsNullOrWhiteSpace(incomingCountry) ? guest.Country : incomingCountry;
                    guest.PostalCode = incomingPostalCode;
                    guest.IdType = incomingIdType;
                    guest.IdNumber = incomingIdNumber;
                    guest.Notes = incomingNotes;
                    guest.Company = string.IsNullOrWhiteSpace(request.Company) ? guest.Company : request.Company.Trim();
                    guest.Gender = string.IsNullOrWhiteSpace(request.Gender) ? guest.Gender : request.Gender.Trim();
                    guest.DateOfBirth = request.DateOfBirth ?? guest.DateOfBirth;
                    guest.EmergencyContact = string.IsNullOrWhiteSpace(request.EmergencyContact) ? guest.EmergencyContact : request.EmergencyContact.Trim();
                    guest.EmergencyPhone = string.IsNullOrWhiteSpace(request.EmergencyPhone) ? guest.EmergencyPhone : request.EmergencyPhone.Trim();
                    guest.Nationality = string.IsNullOrWhiteSpace(request.Nationality) ? guest.Nationality : request.Nationality.Trim();
                    guest.Occupation = string.IsNullOrWhiteSpace(request.Occupation) ? guest.Occupation : request.Occupation.Trim();

                    guest.IsActive = true;
                    guest.UpdatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();
                }

                // Upsert GuestRegistration by email as well (FrontOffice guest registration table)
                if (!string.IsNullOrWhiteSpace(incomingEmail))
                {
                    var existingRegistration = await _context.GuestRegistrations
                        .FirstOrDefaultAsync(gr => gr.Email != null && gr.Email.Trim().ToLower() == incomingEmailLower);

                    var incomingGender = (guest?.Gender ?? string.Empty).Trim();

                    if (existingRegistration == null)
                    {
                        var reg = new GuestRegistration
                        {
                            RegistrationNumber = $"REG{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}",
                            RegistrationDate = DateTime.UtcNow,
                            FirstName = incomingFirstName,
                            LastName = incomingLastName,
                            PhoneNumber = incomingPhoneNumber,
                            Email = incomingEmail,
                            Address = incomingAddress,
                            City = incomingCity,
                            Country = incomingCountry,
                            IdType = incomingIdType,
                            IdNumber = incomingIdNumber,
                            Gender = string.IsNullOrWhiteSpace(incomingGender) ? string.Empty : incomingGender,
                            Nationality = string.Empty,
                            Company = string.Empty,
                            Purpose = string.Empty,
                            RegisteredBy = "Website",
                            Remarks = incomingNotes,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                        };

                        _context.GuestRegistrations.Add(reg);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        existingRegistration.FirstName = incomingFirstName;
                        existingRegistration.LastName = incomingLastName;
                        existingRegistration.PhoneNumber = incomingPhoneNumber;
                        existingRegistration.Email = incomingEmail;
                        existingRegistration.Address = incomingAddress;
                        existingRegistration.City = incomingCity;
                        existingRegistration.Country = incomingCountry;
                        existingRegistration.IdType = incomingIdType;
                        existingRegistration.IdNumber = incomingIdNumber;

                        // DB requires Gender to be non-null. Website form doesn't collect it, so keep existing.
                        if (existingRegistration.Gender == null) existingRegistration.Gender = string.Empty;
                        if (!string.IsNullOrWhiteSpace(incomingGender)) existingRegistration.Gender = incomingGender;

                        if (existingRegistration.Nationality == null) existingRegistration.Nationality = string.Empty;
                        if (existingRegistration.Company == null) existingRegistration.Company = string.Empty;
                        if (existingRegistration.Purpose == null) existingRegistration.Purpose = string.Empty;
                        if (existingRegistration.Remarks == null) existingRegistration.Remarks = string.Empty;
                        existingRegistration.Remarks = incomingNotes;

                        existingRegistration.RegisteredBy = "Website";
                        existingRegistration.IsActive = true;
                        existingRegistration.RegistrationDate = DateTime.UtcNow;
                        existingRegistration.UpdatedAt = DateTime.UtcNow;

                        await _context.SaveChangesAsync();
                    }
                }

                // Calculate nights
                var nights = (request.CheckOutDate - request.CheckInDate).Days;

                if (nights <= 0)
                {
                    return BadRequest("Invalid date range");
                }

                // Generate reservation number
                var reservationNumber = $"LH{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";

                // Get booked room IDs for the date range
                var bookedRoomIds = await _context.Reservations
                    .Where(r => r.RoomId != null &&
                               r.Status != "Cancelled" &&
                               ((r.CheckInDate >= request.CheckInDate && r.CheckInDate < request.CheckOutDate) ||
                                (r.CheckOutDate > request.CheckInDate && r.CheckOutDate <= request.CheckOutDate) ||
                                (r.CheckInDate <= request.CheckInDate && r.CheckOutDate >= request.CheckOutDate)))
                    .Select(r => r.RoomId)
                    .ToListAsync();

                var reservedRooms = new List<ReservedRoomDto>();
                var createdReservations = new List<Reservation>();
                decimal subtotalBeforeTax = 0;
                decimal totalTax = 0;
                decimal totalWithTax = 0;

                DiscountVoucher? appliedVoucher = null;
                if (request.VoucherId.HasValue || !string.IsNullOrWhiteSpace(request.VoucherCode) || !string.IsNullOrWhiteSpace(request.CouponCode))
                {
                    var voucherCode = !string.IsNullOrWhiteSpace(request.VoucherCode) ? request.VoucherCode.Trim() : request.CouponCode.Trim();
                    var today = DateTime.UtcNow.Date;
                    appliedVoucher = await _context.DiscountVouchers
                        .FirstOrDefaultAsync(v => v.IsActive
                            && v.Status == "Active"
                            && (!request.VoucherId.HasValue || v.Id == request.VoucherId.Value)
                            && (string.IsNullOrWhiteSpace(voucherCode) || v.VoucherCode == voucherCode)
                            && v.StartDate.Date <= today
                            && v.EndDate.Date >= today);
                }

                // Preload active taxes for the selected room types, scoped by hotel
                var selectedRoomTypeIds = request.SelectedRooms
                    .Where(r => r.RoomTypeId > 0)
                    .Select(r => r.RoomTypeId)
                    .Distinct()
                    .ToList();

                var roomTypeHotelMap = await _context.RoomTypes
                    .Where(rt => selectedRoomTypeIds.Contains(rt.Id))
                    .Select(rt => new { rt.Id, rt.HotelId })
                    .ToDictionaryAsync(x => x.Id, x => x.HotelId ?? 0);

                var roomTaxes = await _context.RoomTaxes
                    .Where(rt => selectedRoomTypeIds.Contains(rt.RoomTypeId) && rt.IsActive)
                    .ToListAsync();

                var roomTaxesLookup = roomTaxes
                    .Where(rt => roomTypeHotelMap.TryGetValue(rt.RoomTypeId, out var hid) && rt.HotelId == hid)
                    .GroupBy(rt => rt.RoomTypeId)
                    .ToDictionary(g => g.Key, g => g.ToList());

                // Process each selected room type
                foreach (var selectedRoom in request.SelectedRooms)
                {
                    // Find room type by ID or name
                    RoomType? roomType = null;
                    if (selectedRoom.RoomTypeId > 0)
                    {
                        roomType = await _context.RoomTypes.FindAsync(selectedRoom.RoomTypeId);
                    }
                    else if (!string.IsNullOrEmpty(selectedRoom.RoomTypeName))
                    {
                        roomType = await _context.RoomTypes
                            .FirstOrDefaultAsync(rt => rt.Name == selectedRoom.RoomTypeName);
                    }

                    if (roomType == null)
                    {
                        return BadRequest($"Room type '{selectedRoom.RoomTypeName}' not found");
                    }

                    var applicableRate = await _context.RoomRates
                        .Where(r => r.IsActive && r.RoomTypeId == roomType.Id)
                        .Where(r => request.CheckInDate.Date >= r.EffectiveFrom.Date && request.CheckOutDate.Date <= r.EffectiveTo.Date)
                        .OrderBy(r => r.EffectiveFrom)
                        .ThenBy(r => r.Id)
                        .FirstOrDefaultAsync();

                    if (!IsRateBookable(applicableRate, request.CheckInDate, request.CheckOutDate, out var restrictionMessage))
                    {
                        return BadRequest($"{roomType.Name}: {restrictionMessage}");
                    }

                    // Exclude rooms that are blocked for the requested date range
                    var blockedRoomIds = await _context.RoomBlocked
                        .Where(rb => rb.IsActive &&
                                    rb.RoomId != 0 &&
                                    rb.RoomTypeId == roomType.Id &&
                                    ((rb.BlockStartDate >= request.CheckInDate && rb.BlockStartDate < request.CheckOutDate) ||
                                     (rb.BlockEndDate > request.CheckInDate && rb.BlockEndDate <= request.CheckOutDate) ||
                                     (rb.BlockStartDate <= request.CheckInDate && rb.BlockEndDate >= request.CheckOutDate)))
                        .Select(rb => rb.RoomId)
                        .ToListAsync();

                    // Find available rooms for this room type
                    var availableRooms = await _context.Rooms
                        .Include(r => r.RoomType)
                        .Where(r => r.RoomTypeId == roomType.Id &&
                                   r.IsActive == true &&
                                   r.Status == "Available" &&
                                   !bookedRoomIds.Contains(r.Id) &&
                                   !blockedRoomIds.Contains(r.Id))
                        .Take(selectedRoom.Quantity)
                        .ToListAsync();

                    if (availableRooms.Count < selectedRoom.Quantity)
                    {
                        return BadRequest($"Only {availableRooms.Count} rooms available for {selectedRoom.RoomTypeName} (some rooms may be booked or blocked for the selected dates)");
                    }

                    // Create reservation for each room
                    foreach (var room in availableRooms)
                    {
                        // Prefer the client-selected rate from the last step; fall back to the room type base price
                        // NOTE: Website sends BasePrice as nightly base (plan included) and also sends TaxAmount/TotalWithTax (nightly).
                        // To prevent mismatches/double totals, prefer client nightly totals if present.
                        var clientNightlyTotalWithTax = selectedRoom.TotalWithTax > 0 ? selectedRoom.TotalWithTax : 0;
                        var clientNightlyTax = selectedRoom.TaxAmount > 0 ? selectedRoom.TaxAmount : 0;
                        var clientNightlyBase = (clientNightlyTotalWithTax > 0)
                            ? Math.Max(0, clientNightlyTotalWithTax - clientNightlyTax)
                            : 0;

                        var roomRate = clientNightlyBase > 0
                            ? clientNightlyBase
                            : (selectedRoom.BasePrice > 0 ? selectedRoom.BasePrice : (room.RoomType?.BasePrice ?? 0));

                        var roomSubtotal = roomRate * nights;
                        
                        // Calculate tax based on RoomTax table (per room type)
                        int? roomTypeId = room.RoomType?.Id 
                            ?? (int?)room.RoomTypeId 
                            ?? (selectedRoom.RoomTypeId > 0 ? selectedRoom.RoomTypeId : (int?)null);
                        var hotelIdForRoomType = room.RoomType?.HotelId ?? (roomTypeId.HasValue ? roomTypeHotelMap.GetValueOrDefault(roomTypeId.Value, 0) : 0);
                        decimal roomTaxAmount = 0;
                        if (roomTypeId > 0 && hotelIdForRoomType > 0 && roomTaxesLookup.TryGetValue(roomTypeId.Value, out var roomTaxesForType))
                        {
                            foreach (var tax in roomTaxesForType)
                            {
                                if (string.Equals(tax.TaxType, "percentage", StringComparison.OrdinalIgnoreCase))
                                {
                                    roomTaxAmount += roomSubtotal * (tax.TaxValue / 100m);
                                }
                                else
                                {
                                    roomTaxAmount += tax.TaxValue;
                                }
                            }
                        }

                        // If RoomTaxes are not configured/matched, fall back to client-provided tax.
                        // Client tax is nightly; convert to stay tax.
                        if (roomTaxAmount <= 0 && clientNightlyTax > 0)
                        {
                            roomTaxAmount = clientNightlyTax * nights;
                        }

                        var roomTotalWithTax = roomSubtotal + roomTaxAmount;
                        subtotalBeforeTax += roomSubtotal;
                        totalTax += roomTaxAmount;
                        totalWithTax += roomTotalWithTax;

                        var normalizedPaymentMethod = NormalizePaymentMethod(request.PaymentMethod);

                        var reservation = new Reservation
                        {
                            ReservationNumber = reservationNumber,
                            HotelId = request.HotelId
                                ?? room.RoomType?.HotelId
                                ?? (int?)roomType.HotelId,
                            RoomTypeId = request.RoomTypeId
                                ?? room.RoomType?.Id
                                ?? (int?)roomType.Id
                                ?? (selectedRoom.RoomTypeId > 0 ? (int?)selectedRoom.RoomTypeId : null),
                            GuestId = guest.Id,
                            RoomId = room.Id,
                            CheckInDate = request.CheckInDate,
                            CheckOutDate = request.CheckOutDate,
                            NumberOfAdults = request.NumberOfAdults,
                            NumberOfChildren = request.NumberOfChildren,
                            Status = "Confirmed",
                            SpecialRequests = request.SpecialRequests ?? "",
                            BookingSource = string.IsNullOrWhiteSpace(request.BookingSource) ? "Website" : request.BookingSource,
                            RoomRate = roomRate,
                            NumberOfRooms = request.NumberOfRooms > 0 ? request.NumberOfRooms : request.SelectedRooms.Sum(r => Math.Max(1, r.Quantity)),
                            Nights = request.Nights > 0 ? request.Nights : nights,
                            PaymentMethod = normalizedPaymentMethod,
                            PaymentAccount = string.IsNullOrWhiteSpace(request.PaymentAccount) ? null : request.PaymentAccount,
                            RatePlanId = !string.IsNullOrWhiteSpace(request.RatePlanId)
                                ? request.RatePlanId
                                : (selectedRoom.PlanId.HasValue ? selectedRoom.PlanId.Value.ToString() : null),
                            Company = string.IsNullOrWhiteSpace(request.Company) ? null : request.Company,
                            ComingFrom = string.IsNullOrWhiteSpace(request.ComingFrom) ? null : request.ComingFrom,
                            Discount = 0,
                            AdvanceAmount = 0,
                            GuestName2 = string.IsNullOrWhiteSpace(request.GuestName2) ? null : request.GuestName2,
                            GuestName3 = string.IsNullOrWhiteSpace(request.GuestName3) ? null : request.GuestName3,
                            GroupId = string.IsNullOrWhiteSpace(request.GroupId) ? null : request.GroupId,
                            Source = string.IsNullOrWhiteSpace(request.Source) ? "Website" : request.Source,
                            Market = string.IsNullOrWhiteSpace(request.Market) ? "Online" : request.Market,
                            Region = string.IsNullOrWhiteSpace(request.Region) ? null : request.Region,
                            Industry = string.IsNullOrWhiteSpace(request.Industry) ? null : request.Industry,
                            Purpose = string.IsNullOrWhiteSpace(request.Purpose) ? null : request.Purpose,
                            ReferenceCompany = string.IsNullOrWhiteSpace(request.ReferenceCompany) ? null : request.ReferenceCompany,
                            ReservationMadeBy = string.IsNullOrWhiteSpace(request.ReservationMadeBy) ? guest.FullName : request.ReservationMadeBy,
                            Pickup = request.Pickup,
                            PickupStation = string.IsNullOrWhiteSpace(request.PickupStation) ? null : request.PickupStation,
                            PickupCarrier = string.IsNullOrWhiteSpace(request.PickupCarrier) ? null : request.PickupCarrier,
                            PickupTime = !string.IsNullOrWhiteSpace(request.PickupTime) ? request.PickupTime : (!string.IsNullOrWhiteSpace(request.ArrivalTime) ? request.ArrivalTime : null),
                            DropOff = request.DropOff,
                            DropStation = string.IsNullOrWhiteSpace(request.DropStation) ? null : request.DropStation,
                            BTCFolio = string.IsNullOrWhiteSpace(request.BTCFolio) ? null : request.BTCFolio,
                            Folio1 = string.IsNullOrWhiteSpace(request.Folio1) ? null : request.Folio1,
                            Folio2 = string.IsNullOrWhiteSpace(request.Folio2) ? null : request.Folio2,
                            Folio3 = string.IsNullOrWhiteSpace(request.Folio3) ? null : request.Folio3,
                            BTCComments = string.IsNullOrWhiteSpace(request.BTCComments) ? null : request.BTCComments,
                            BtcId = string.IsNullOrWhiteSpace(request.BtcId) ? null : request.BtcId,
                            Complimentary = request.Complimentary,
                            Newspaper = string.IsNullOrWhiteSpace(request.Newspaper) ? null : request.Newspaper,
                            Meals = string.IsNullOrWhiteSpace(request.Meals) ? (string.IsNullOrWhiteSpace(selectedRoom.PlanName) ? null : selectedRoom.PlanName) : request.Meals,
                            VIPStatus = string.IsNullOrWhiteSpace(request.VIPStatus) ? null : request.VIPStatus,
                            ReservationNotes = string.IsNullOrWhiteSpace(request.ReservationNotes) ? null : request.ReservationNotes,
                            CheckinNotes = !string.IsNullOrWhiteSpace(request.CheckinNotes) ? request.CheckinNotes : (!string.IsNullOrWhiteSpace(request.ArrivalTime) ? $"Arrival Time: {request.ArrivalTime}" : null),
                            NoPost = request.NoPost,
                            EnteredBy = string.IsNullOrWhiteSpace(request.EnteredBy) ? "Website" : request.EnteredBy,
                            InclusivePrivileges = string.IsNullOrWhiteSpace(request.InclusivePrivileges) ? null : request.InclusivePrivileges,
                            TotalAmount = roomTotalWithTax,
                            TotalPaid = 0,
                            PaymentStatus = "Pending",
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow
                        };

                        _context.Reservations.Add(reservation);
                        createdReservations.Add(reservation);

                        reservedRooms.Add(new ReservedRoomDto
                        {
                            RoomTypeName = room.RoomType?.Name ?? selectedRoom.RoomTypeName,
                            RoomNumber = room.RoomNumber ?? "",
                            PricePerNight = roomRate
                        });
                    }
                }

                decimal calculatedDiscount = Math.Max(0, request.DiscountAmount);
                if (appliedVoucher != null)
                {
                    var roomTypeMatched = request.SelectedRooms.Any(r => r.RoomTypeId == appliedVoucher.RoomTypeId);
                    var usageAllowed = !appliedVoucher.MaxUsageCount.HasValue || appliedVoucher.UsedCount < appliedVoucher.MaxUsageCount.Value;
                    if (roomTypeMatched && usageAllowed && totalWithTax >= (appliedVoucher.MinimumAmount ?? 0))
                    {
                        if (string.Equals(appliedVoucher.DiscountType, "Percentage", StringComparison.OrdinalIgnoreCase))
                        {
                            calculatedDiscount = totalWithTax * ((appliedVoucher.DiscountPercentage ?? 0) / 100m);
                        }
                        else
                        {
                            calculatedDiscount = appliedVoucher.DiscountAmount;
                        }

                        if (appliedVoucher.MaximumDiscount.HasValue && appliedVoucher.MaximumDiscount.Value > 0)
                        {
                            calculatedDiscount = Math.Min(calculatedDiscount, appliedVoucher.MaximumDiscount.Value);
                        }

                        calculatedDiscount = Math.Min(calculatedDiscount, totalWithTax);
                        appliedVoucher.UsedCount += 1;
                    }
                }

                totalWithTax = Math.Max(0, totalWithTax - calculatedDiscount);

                var normalizedRequestPaymentMethod = NormalizePaymentMethod(request.PaymentMethod);
                var isOnlinePayment = string.Equals(request.PaymentMethod, "online-payment", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(request.PaymentMethod, "credit-card", StringComparison.OrdinalIgnoreCase);
                var requestedAdvance = request.AdvanceAmount > 0 ? request.AdvanceAmount : 0;
                var depositAmount = isOnlinePayment
                    ? totalWithTax
                    : (requestedAdvance > 0 ? Math.Min(requestedAdvance, totalWithTax) : Math.Round(totalWithTax * 0.25m, 2));
                var effectivePaymentStatus = isOnlinePayment ? "Paid" : (depositAmount > 0 ? "Partial" : "Pending");

                if (createdReservations.Any())
                {
                    var perReservationDiscount = Math.Round(calculatedDiscount / createdReservations.Count, 2);
                    var discountAssigned = 0m;
                    var paidAssigned = 0m;

                    for (var i = 0; i < createdReservations.Count; i++)
                    {
                        var reservation = createdReservations[i];
                        var currentDiscount = i == createdReservations.Count - 1
                            ? (calculatedDiscount - discountAssigned)
                            : perReservationDiscount;
                        discountAssigned += currentDiscount;
                        reservation.Discount = Math.Max(0, currentDiscount);
                        reservation.TotalAmount = Math.Max(0, reservation.TotalAmount - reservation.Discount);

                        var proportionalPaid = totalWithTax <= 0
                            ? 0
                            : Math.Round((reservation.TotalAmount / totalWithTax) * depositAmount, 2);
                        var currentPaid = i == createdReservations.Count - 1
                            ? Math.Max(0, depositAmount - paidAssigned)
                            : proportionalPaid;
                        paidAssigned += currentPaid;

                        reservation.TotalPaid = currentPaid;
                        reservation.AdvanceAmount = currentPaid;
                        reservation.PaymentMethod = normalizedRequestPaymentMethod;
                        reservation.PaymentStatus = effectivePaymentStatus;
                    }
                }

                await _context.SaveChangesAsync();

                // Auto-push availability to BookLogic for each created reservation
                foreach (var res in createdReservations)
                {
                    if (res.RoomId.HasValue)
                    {
                        try
                        {
                            await _bookLogic.NotifyBookLogicAvailability(res.Id);
                            await _bookLogic.SendReservationToBookLogic(res.Id);
                        }
                        catch (Exception ex2)
                        {
                            _logger.LogWarning(ex2, "Failed to auto-push to BookLogic for reservation {Id}", res.Id);
                        }
                    }
                }

                // Calculate totals
                var taxAmount = totalTax;
                var totalAmount = totalWithTax;
                
                // Determine payment status
                bool isFullyPaid = isOnlinePayment;

                // Get hotel details
                var hotel = await _context.Hotels.FirstOrDefaultAsync();

                // Return response
                var response = new ReservationResponseDto
                {
                    ReservationId = 0, // Multiple reservations
                    ReservationNumber = reservationNumber,
                    Status = "Confirmed",
                    CheckInDate = request.CheckInDate,
                    CheckOutDate = request.CheckOutDate,
                    NumberOfNights = nights,
                    Rooms = reservedRooms,
                    NumberOfAdults = request.NumberOfAdults,
                    NumberOfChildren = request.NumberOfChildren,
                    Subtotal = subtotalBeforeTax,
                    TaxAmount = taxAmount,
                    TotalAmount = totalAmount,
                    TotalPaid = depositAmount,
                    PaymentStatus = effectivePaymentStatus,
                    GuestName = $"{guest.FirstName} {guest.LastName}",
                    GuestEmail = guest.Email ?? "",
                    GuestPhone = guest.PhoneNumber ?? "",
                    GuestAddress = guest.Address ?? "",
                    GuestCity = guest.City ?? "",
                    GuestCountry = guest.Country ?? "",
                    SpecialRequests = request.SpecialRequests ?? "",
                    HotelName = hotel?.HotelName ?? "LuxuryHotel",
                    HotelAddress = hotel?.Address ?? "",
                    HotelPhone = hotel?.PhoneNumber ?? "",
                    CreatedAt = DateTime.UtcNow
                };

                // Send confirmation email
                if (hotel != null)
                {
                    await _emailService.SendBookingConfirmationEmail(
                        response,
                        hotel.HotelName ?? "Hotel ERP",
                        hotel.Address ?? "",
                        hotel.PhoneNumber ?? ""
                    );
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log detailed error information
                var errorDetails = new
                {
                    Message = ex.Message,
                    InnerException = ex.InnerException?.Message,
                    InnerInnerException = ex.InnerException?.InnerException?.Message,
                    StackTrace = ex.StackTrace
                };
                
                Console.WriteLine($"Error creating reservation: {System.Text.Json.JsonSerializer.Serialize(errorDetails)}");
                
                return StatusCode(500, $"Internal server error: {ex.Message}. Inner: {ex.InnerException?.Message}");
            }
        }

        // GET: api/CustomerReservation/{reservationNumber}
        [HttpGet("{reservationNumber}")]
        public async Task<ActionResult<ReservationResponseDto>> GetReservation(string reservationNumber)
        {
            var reservations = await _context.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                .ThenInclude(r => r.RoomType)
                .Where(r => r.ReservationNumber == reservationNumber)
                .ToListAsync();

            if (!reservations.Any())
            {
                return NotFound("Reservation not found");
            }

            var firstReservation = reservations.First();
            var nights = (firstReservation.CheckOutDate - firstReservation.CheckInDate).Days;

            var rooms = reservations.Select(r => new ReservedRoomDto
            {
                RoomTypeName = r.Room?.RoomType?.Name ?? "",
                RoomNumber = r.Room?.RoomNumber ?? "",
                PricePerNight = r.Room?.RoomType?.BasePrice ?? 0
            }).ToList();

            var subtotal = reservations.Sum(r => r.TotalAmount);
            var taxRate = 0.16m;
            var taxAmount = subtotal * taxRate / (1 + taxRate);
            var actualSubtotal = subtotal - taxAmount;

            var hotel = await _context.Hotels.FirstOrDefaultAsync();

            var response = new ReservationResponseDto
            {
                ReservationId = firstReservation.Id,
                ReservationNumber = firstReservation.ReservationNumber,
                Status = firstReservation.Status,
                CheckInDate = firstReservation.CheckInDate,
                CheckOutDate = firstReservation.CheckOutDate,
                NumberOfNights = nights,
                Rooms = rooms,
                NumberOfAdults = firstReservation.NumberOfAdults,
                NumberOfChildren = firstReservation.NumberOfChildren,
                Subtotal = actualSubtotal,
                TaxAmount = taxAmount,
                TotalAmount = subtotal,
                TotalPaid = reservations.Sum(r => r.TotalPaid),
                PaymentStatus = firstReservation.PaymentStatus,
                GuestName = $"{firstReservation.Guest?.FirstName} {firstReservation.Guest?.LastName}",
                GuestEmail = firstReservation.Guest?.Email ?? "",
                GuestPhone = firstReservation.Guest?.PhoneNumber ?? "",
                GuestAddress = firstReservation.Guest?.Address ?? "",
                GuestCity = firstReservation.Guest?.City ?? "",
                GuestCountry = firstReservation.Guest?.Country ?? "",
                SpecialRequests = firstReservation.SpecialRequests ?? "",
                HotelName = hotel?.HotelName ?? "LuxuryHotel",
                HotelAddress = hotel?.Address ?? "",
                HotelPhone = hotel?.PhoneNumber ?? "",
                CreatedAt = firstReservation.CreatedAt
            };

            return Ok(response);
        }
    }
}
