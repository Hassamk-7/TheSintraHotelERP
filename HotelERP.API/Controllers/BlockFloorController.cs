using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlockFloorController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly ILogger<BlockFloorController> _logger;

        public BlockFloorController(HotelDbContext context, ILogger<BlockFloorController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/blockfloor/hotel/{hotelId} - Get complete hierarchy
        [HttpGet("hotel/{hotelId}")]
        public async Task<IActionResult> GetHotelBlockFloorHierarchy(int hotelId)
        {
            try
            {
                var hotel = await _context.Hotels.FindAsync(hotelId);
                if (hotel == null)
                    return NotFound(new { success = false, message = "Hotel not found" });

                var blocks = await _context.Blocks
                    .Where(b => b.HotelId == hotelId && b.IsActive)
                    .Include(b => b.Floors.Where(f => f.IsActive))
                    .ThenInclude(f => f.RoomType)
                    .Include(b => b.Floors.Where(f => f.IsActive))
                    .ThenInclude(f => f.Rooms)
                    .ThenInclude(r => r.RoomType)
                    .OrderBy(b => b.BlockName)
                    .ToListAsync();

                var blockDtos = blocks.Select(b => 
                {
                    var floorsList = b.Floors.Select(f => 
                    {
                        var roomsInFloor = f.Rooms.Where(r => !r.BlockFloorId.HasValue || r.BlockFloorId == f.Id).ToList();
                        var totalRooms = roomsInFloor.Count;
                        var availableRooms = roomsInFloor.Count(r => r.Status == "Available");
                        var occupiedRooms = roomsInFloor.Count(r => r.Status == "Occupied");
                        var outOfOrderRooms = roomsInFloor.Count(r => r.Status == "Out of Order");

                        return new BlockFloorWithRoomsDto
                        {
                            Id = f.Id,
                            RoomTypeId = f.RoomTypeId,
                            RoomTypeName = f.RoomType?.Name,
                            FloorNumber = f.FloorNumber,
                            FloorName = f.FloorName,
                            Description = f.Description,
                            TotalRooms = totalRooms,
                            AvailableRooms = availableRooms,
                            OccupiedRooms = occupiedRooms,
                            OutOfOrderRooms = outOfOrderRooms,
                            FloorManager = f.FloorManager,
                            IsActive = f.IsActive,
                            Rooms = roomsInFloor.Select(r => new RoomInFloorDto
                            {
                                Id = r.Id,
                                RoomNumber = r.RoomNumber,
                                RoomTypeId = r.RoomTypeId,
                                RoomTypeName = r.RoomType?.Name,
                                Status = r.Status,
                                MaxAdults = r.MaxAdults,
                                MaxChildren = r.MaxChildren,
                                BasePrice = r.BasePrice
                            }).ToList()
                        };
                    }).OrderBy(f => f.FloorNumber).ToList();

                    var totalBlockRooms = floorsList.Sum(f => f.TotalRooms);

                    return new BlockWithFloorsDto
                    {
                        Id = b.Id,
                        BlockName = b.BlockName,
                        BlockCode = b.BlockCode,
                        Description = b.Description,
                        TotalFloors = b.TotalFloors,
                        TotalRooms = totalBlockRooms,
                        BlockManager = b.BlockManager,
                        IsActive = b.IsActive,
                        Floors = floorsList
                    };
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = new BlockFloorHierarchyDto
                    {
                        HotelId = hotelId,
                        HotelName = hotel.HotelName,
                        Blocks = blockDtos
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching block-floor hierarchy for hotel {HotelId}", hotelId);
                return StatusCode(500, new { success = false, message = "Error fetching hierarchy" });
            }
        }

        // GET: api/blockfloor/block/{blockId}
        [HttpGet("block/{blockId}")]
        public async Task<IActionResult> GetBlockWithFloors(int blockId)
        {
            try
            {
                var block = await _context.Blocks
                    .Where(b => b.Id == blockId)
                    .Include(b => b.Floors.Where(f => f.IsActive))
                    .ThenInclude(f => f.Rooms)
                    .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync();

                if (block == null)
                    return NotFound(new { success = false, message = "Block not found" });

                var blockDto = new BlockWithFloorsDto
                {
                    Id = block.Id,
                    BlockName = block.BlockName,
                    BlockCode = block.BlockCode,
                    Description = block.Description,
                    TotalFloors = block.TotalFloors,
                    TotalRooms = block.TotalRooms,
                    BlockManager = block.BlockManager,
                    IsActive = block.IsActive,
                    Floors = block.Floors.Select(f => new BlockFloorWithRoomsDto
                    {
                        Id = f.Id,
                        FloorNumber = f.FloorNumber,
                        FloorName = f.FloorName,
                        Description = f.Description,
                        TotalRooms = f.TotalRooms,
                        AvailableRooms = f.AvailableRooms,
                        OccupiedRooms = f.OccupiedRooms,
                        OutOfOrderRooms = f.OutOfOrderRooms,
                        FloorManager = f.FloorManager,
                        IsActive = f.IsActive,
                        Rooms = f.Rooms.Select(r => new RoomInFloorDto
                        {
                            Id = r.Id,
                            RoomNumber = r.RoomNumber,
                            RoomTypeId = r.RoomTypeId,
                            RoomTypeName = r.RoomType?.Name,
                            Status = r.Status,
                            MaxAdults = r.MaxAdults,
                            MaxChildren = r.MaxChildren,
                            BasePrice = r.BasePrice
                        }).ToList()
                    }).OrderBy(f => f.FloorNumber).ToList()
                };

                return Ok(new { success = true, data = blockDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching block {BlockId}", blockId);
                return StatusCode(500, new { success = false, message = "Error fetching block" });
            }
        }

        // POST: api/blockfloor/block - Create Block
        [HttpPost("block")]
        public async Task<IActionResult> CreateBlock([FromBody] BlockCreateDto dto)
        {
            try
            {
                var hotel = await _context.Hotels.FindAsync(dto.HotelId);
                if (hotel == null)
                    return BadRequest(new { success = false, message = "Hotel not found" });

                var block = new Block
                {
                    HotelId = dto.HotelId,
                    BlockName = dto.BlockName,
                    BlockCode = dto.BlockCode,
                    Description = dto.Description,
                    BlockManager = dto.BlockManager,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Blocks.Add(block);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Block created: {BlockName} in Hotel {HotelId}", block.BlockName, dto.HotelId);

                return CreatedAtAction(nameof(GetBlockWithFloors), new { blockId = block.Id },
                    new { success = true, data = block, message = "Block created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating block");
                return StatusCode(500, new { success = false, message = "Error creating block" });
            }
        }

        // PUT: api/blockfloor/block/{id}
        [HttpPut("block/{id}")]
        public async Task<IActionResult> UpdateBlock(int id, [FromBody] BlockUpdateDto dto)
        {
            try
            {
                var block = await _context.Blocks.FindAsync(id);
                if (block == null)
                    return NotFound(new { success = false, message = "Block not found" });

                block.BlockName = dto.BlockName;
                block.BlockCode = dto.BlockCode;
                block.Description = dto.Description;
                block.BlockManager = dto.BlockManager;
                block.IsActive = dto.IsActive;
                block.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Block updated: {BlockName}", block.BlockName);

                return Ok(new { success = true, data = block, message = "Block updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating block {Id}", id);
                return StatusCode(500, new { success = false, message = "Error updating block" });
            }
        }

        // DELETE: api/blockfloor/block/{id}
        [HttpDelete("block/{id}")]
        public async Task<IActionResult> DeleteBlock(int id)
        {
            try
            {
                var block = await _context.Blocks
                    .Include(b => b.Floors)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (block == null)
                    return NotFound(new { success = false, message = "Block not found" });

                if (block.Floors.Any())
                    return BadRequest(new { success = false, message = "Cannot delete block with existing floors" });

                _context.Blocks.Remove(block);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Block deleted: {BlockName}", block.BlockName);

                return Ok(new { success = true, message = "Block deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting block {Id}", id);
                return StatusCode(500, new { success = false, message = "Error deleting block" });
            }
        }

        // POST: api/blockfloor/floor - Create Floor
        [HttpPost("floor")]
        public async Task<IActionResult> CreateFloor([FromBody] BlockFloorCreateDto dto)
        {
            try
            {
                var block = await _context.Blocks.FindAsync(dto.BlockId);
                if (block == null)
                    return BadRequest(new { success = false, message = "Block not found" });

                // Validate RoomType if provided
                if (dto.RoomTypeId.HasValue)
                {
                    var roomType = await _context.RoomTypes.FindAsync(dto.RoomTypeId);
                    if (roomType == null)
                        return BadRequest(new { success = false, message = "Room type not found" });
                }

                var floor = new BlockFloor
                {
                    BlockId = dto.BlockId,
                    RoomTypeId = dto.RoomTypeId,
                    FloorNumber = dto.FloorNumber,
                    FloorName = dto.FloorName,
                    Description = dto.Description,
                    FloorManager = dto.FloorManager,
                    HousekeepingSupervisor = dto.HousekeepingSupervisor,
                    HasElevatorAccess = dto.HasElevatorAccess,
                    HasFireExit = dto.HasFireExit,
                    SafetyFeatures = dto.SafetyFeatures,
                    SpecialFeatures = dto.SpecialFeatures,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.BlockFloors.Add(floor);
                block.TotalFloors++;
                await _context.SaveChangesAsync();

                _logger.LogInformation("Floor created: {FloorName} in Block {BlockId}", floor.FloorName, dto.BlockId);

                return CreatedAtAction(nameof(GetFloorWithRooms), new { floorId = floor.Id },
                    new { success = true, data = floor, message = "Floor created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating floor");
                return StatusCode(500, new { success = false, message = "Error creating floor" });
            }
        }

        // GET: api/blockfloor/floor/{floorId}
        [HttpGet("floor/{floorId}")]
        public async Task<IActionResult> GetFloorWithRooms(int floorId)
        {
            try
            {
                var floor = await _context.BlockFloors
                    .Where(f => f.Id == floorId)
                    .Include(f => f.RoomType)
                    .Include(f => f.Rooms)
                    .ThenInclude(r => r.RoomType)
                    .FirstOrDefaultAsync();

                if (floor == null)
                    return NotFound(new { success = false, message = "Floor not found" });

                var floorDto = new BlockFloorWithRoomsDto
                {
                    Id = floor.Id,
                    RoomTypeId = floor.RoomTypeId,
                    RoomTypeName = floor.RoomType?.Name,
                    FloorNumber = floor.FloorNumber,
                    FloorName = floor.FloorName,
                    Description = floor.Description,
                    TotalRooms = floor.TotalRooms,
                    AvailableRooms = floor.AvailableRooms,
                    OccupiedRooms = floor.OccupiedRooms,
                    OutOfOrderRooms = floor.OutOfOrderRooms,
                    FloorManager = floor.FloorManager,
                    IsActive = floor.IsActive,
                    Rooms = floor.Rooms.Select(r => new RoomInFloorDto
                    {
                        Id = r.Id,
                        RoomNumber = r.RoomNumber,
                        RoomTypeId = r.RoomTypeId,
                        RoomTypeName = r.RoomType?.Name,
                        Status = r.Status,
                        MaxAdults = r.MaxAdults,
                        MaxChildren = r.MaxChildren,
                        BasePrice = r.BasePrice
                    }).ToList()
                };

                return Ok(new { success = true, data = floorDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching floor {FloorId}", floorId);
                return StatusCode(500, new { success = false, message = "Error fetching floor" });
            }
        }

        // PUT: api/blockfloor/floor/{id}
        [HttpPut("floor/{id}")]
        public async Task<IActionResult> UpdateFloor(int id, [FromBody] BlockFloorUpdateDto dto)
        {
            try
            {
                var floor = await _context.BlockFloors.FindAsync(id);
                if (floor == null)
                    return NotFound(new { success = false, message = "Floor not found" });

                // Validate RoomType if provided
                if (dto.RoomTypeId.HasValue && dto.RoomTypeId != floor.RoomTypeId)
                {
                    var roomType = await _context.RoomTypes.FindAsync(dto.RoomTypeId);
                    if (roomType == null)
                        return BadRequest(new { success = false, message = "Room type not found" });
                }

                floor.RoomTypeId = dto.RoomTypeId;
                floor.FloorNumber = dto.FloorNumber;
                floor.FloorName = dto.FloorName;
                floor.Description = dto.Description;
                floor.FloorManager = dto.FloorManager;
                floor.HousekeepingSupervisor = dto.HousekeepingSupervisor;
                floor.HasElevatorAccess = dto.HasElevatorAccess;
                floor.HasFireExit = dto.HasFireExit;
                floor.SafetyFeatures = dto.SafetyFeatures;
                floor.SpecialFeatures = dto.SpecialFeatures;
                floor.IsActive = dto.IsActive;
                floor.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Floor updated: {FloorName}", floor.FloorName);

                return Ok(new { success = true, data = floor, message = "Floor updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating floor {Id}", id);
                return StatusCode(500, new { success = false, message = "Error updating floor" });
            }
        }

        // DELETE: api/blockfloor/floor/{id}
        [HttpDelete("floor/{id}")]
        public async Task<IActionResult> DeleteFloor(int id)
        {
            try
            {
                var floor = await _context.BlockFloors
                    .Include(f => f.Rooms)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (floor == null)
                    return NotFound(new { success = false, message = "Floor not found" });

                if (floor.Rooms.Any())
                    return BadRequest(new { success = false, message = "Cannot delete floor with existing rooms" });

                var block = await _context.Blocks.FindAsync(floor.BlockId);
                if (block != null)
                {
                    block.TotalFloors--;
                }

                _context.BlockFloors.Remove(floor);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Floor deleted: {FloorName}", floor.FloorName);

                return Ok(new { success = true, message = "Floor deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting floor {Id}", id);
                return StatusCode(500, new { success = false, message = "Error deleting floor" });
            }
        }
    }
}
