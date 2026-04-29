using HotelERP.API.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelERP.API.Services;

public class BookLogicBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<BookLogicBackgroundService> _logger;
    private Timer? _timer;

    public BookLogicBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<BookLogicBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("BookLogic Background Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await PullReservationsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in BookLogic background service");
            }

            // Wait for configured interval (default 30 minutes)
            var interval = GetSyncInterval();
            _logger.LogInformation("Next reservation pull in {Minutes} minutes", interval);
            await Task.Delay(TimeSpan.FromMinutes(interval), stoppingToken);
        }
    }

    private async Task PullReservationsAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<HotelDbContext>();
        var bookLogicService = scope.ServiceProvider.GetRequiredService<BookLogicService>();

        // Check if auto-pull is enabled
        var settings = await context.ChannelManagerSettings
            .FirstOrDefaultAsync(s => s.Provider == "BookLogic" && s.IsActive);

        if (settings == null || !settings.AutoPullReservations)
        {
            _logger.LogInformation("Auto-pull reservations is disabled, skipping");
            return;
        }

        _logger.LogInformation("Starting automatic reservation pull from BookLogic");

        try
        {
            // Pull reservations
            var (success, message, reservations) = await bookLogicService.GetReservations();

            if (success && reservations?.Any() == true)
            {
                _logger.LogInformation("Pulled {Count} reservations from BookLogic", reservations.Count);

                foreach (var reservation in reservations)
                {
                    _logger.LogInformation("New reservation: {PNR} / Room {RoomId} - {Guest}",
                        reservation.ExternalReservationId,
                        reservation.ExternalRoomId,
                        $"{reservation.GuestFirstName} {reservation.GuestLastName}");
                }

                // Auto-process if enabled
                if (settings.AutoProcessReservations)
                {
                    await AutoProcessReservationsAsync(reservations.Select(r => r.Id).ToList(), bookLogicService);
                }

                // Update last sync timestamp
                settings.LastReservationSync = DateTime.UtcNow;
                await context.SaveChangesAsync();
            }
            else if (success)
            {
                _logger.LogInformation("No new reservations from BookLogic");
            }
            else
            {
                _logger.LogWarning("Failed to pull reservations: {Message}", message);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error pulling reservations from BookLogic");
        }
    }

    private async Task AutoProcessReservationsAsync(List<int> reservationIds, BookLogicService bookLogicService)
    {
        if (!reservationIds.Any())
            return;

        _logger.LogInformation("Auto-processing {Count} newly pulled reservations", reservationIds.Count);

        foreach (var reservationId in reservationIds)
        {
            try
            {
                var (success, message) = await bookLogicService.ProcessReservation(reservationId);
                if (success)
                {
                    _logger.LogInformation("Auto-processed reservation record {ReservationId}", reservationId);
                }
                else
                {
                    _logger.LogWarning("Failed to auto-process reservation record {ReservationId}: {Message}",
                        reservationId, message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error auto-processing reservation record {ReservationId}",
                    reservationId);
            }
        }
    }

    private int GetSyncInterval()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<HotelDbContext>();

        var settings = context.ChannelManagerSettings
            .FirstOrDefault(s => s.Provider == "BookLogic" && s.IsActive);

        return settings?.SyncIntervalMinutes ?? 30; // Default 30 minutes
    }

    public override Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("BookLogic Background Service stopped");
        _timer?.Dispose();
        return base.StopAsync(stoppingToken);
    }
}
