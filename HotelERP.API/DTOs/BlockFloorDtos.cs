namespace HotelERP.API.DTOs
{
    public class BlockDto
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public string BlockName { get; set; }
        public string? BlockCode { get; set; }
        public string? Description { get; set; }
        public int TotalFloors { get; set; }
        public int TotalRooms { get; set; }
        public string? BlockManager { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<BlockFloorDto> Floors { get; set; } = new();
    }

    public class BlockCreateDto
    {
        public int HotelId { get; set; }
        public string BlockName { get; set; }
        public string? BlockCode { get; set; }
        public string? Description { get; set; }
        public string? BlockManager { get; set; }
    }

    public class BlockUpdateDto
    {
        public int Id { get; set; }
        public string BlockName { get; set; }
        public string? BlockCode { get; set; }
        public string? Description { get; set; }
        public string? BlockManager { get; set; }
        public bool IsActive { get; set; }
    }

    public class BlockFloorDto
    {
        public int Id { get; set; }
        public int BlockId { get; set; }
        public int? RoomTypeId { get; set; }
        public string? RoomTypeName { get; set; }
        public int FloorNumber { get; set; }
        public string FloorName { get; set; }
        public string? Description { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public int OccupiedRooms { get; set; }
        public int OutOfOrderRooms { get; set; }
        public string? FloorManager { get; set; }
        public string? HousekeepingSupervisor { get; set; }
        public bool HasElevatorAccess { get; set; }
        public bool HasFireExit { get; set; }
        public string? SafetyFeatures { get; set; }
        public string? SpecialFeatures { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<RoomInFloorDto> Rooms { get; set; } = new();
    }

    public class BlockFloorCreateDto
    {
        public int BlockId { get; set; }
        public int? RoomTypeId { get; set; }
        public int FloorNumber { get; set; }
        public string FloorName { get; set; }
        public string? Description { get; set; }
        public string? FloorManager { get; set; }
        public string? HousekeepingSupervisor { get; set; }
        public bool HasElevatorAccess { get; set; }
        public bool HasFireExit { get; set; }
        public string? SafetyFeatures { get; set; }
        public string? SpecialFeatures { get; set; }
    }

    public class BlockFloorUpdateDto
    {
        public int Id { get; set; }
        public int? RoomTypeId { get; set; }
        public int FloorNumber { get; set; }
        public string FloorName { get; set; }
        public string? Description { get; set; }
        public string? FloorManager { get; set; }
        public string? HousekeepingSupervisor { get; set; }
        public bool HasElevatorAccess { get; set; }
        public bool HasFireExit { get; set; }
        public string? SafetyFeatures { get; set; }
        public string? SpecialFeatures { get; set; }
        public bool IsActive { get; set; }
    }

    public class RoomInFloorDto
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; }
        public int RoomTypeId { get; set; }
        public string? RoomTypeName { get; set; }
        public string Status { get; set; }
        public int MaxAdults { get; set; }
        public int MaxChildren { get; set; }
        public decimal BasePrice { get; set; }
    }

    public class BlockFloorHierarchyDto
    {
        public int HotelId { get; set; }
        public string HotelName { get; set; }
        public List<BlockWithFloorsDto> Blocks { get; set; } = new();
    }

    public class BlockWithFloorsDto
    {
        public int Id { get; set; }
        public string BlockName { get; set; }
        public string? BlockCode { get; set; }
        public string? Description { get; set; }
        public int TotalFloors { get; set; }
        public int TotalRooms { get; set; }
        public string? BlockManager { get; set; }
        public bool IsActive { get; set; }
        public List<BlockFloorWithRoomsDto> Floors { get; set; } = new();
    }

    public class BlockFloorWithRoomsDto
    {
        public int Id { get; set; }
        public int? RoomTypeId { get; set; }
        public string? RoomTypeName { get; set; }
        public int FloorNumber { get; set; }
        public string FloorName { get; set; }
        public string? Description { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public int OccupiedRooms { get; set; }
        public int OutOfOrderRooms { get; set; }
        public string? FloorManager { get; set; }
        public bool IsActive { get; set; }
        public List<RoomInFloorDto> Rooms { get; set; } = new();
    }
}
