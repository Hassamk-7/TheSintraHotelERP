using AutoMapper;
using HotelERP.API.DTOs;
using HotelERP.API.Models;

namespace HotelERP.API.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Guest mappings
            CreateMap<Guest, GuestDto>();
            CreateMap<GuestCreateDto, Guest>();
            CreateMap<GuestUpdateDto, Guest>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            
            CreateMap<GuestDocs, GuestDocumentDto>();
            CreateMap<GuestLedger, GuestLedgerDto>();

            // Room mappings
            CreateMap<RoomType, RoomTypeDto>();
            CreateMap<RoomTypeCreateDto, RoomType>();
            CreateMap<RoomTypeDto, RoomType>();

            CreateMap<Room, RoomDto>()
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Features) ? src.Features.Split(',', StringSplitOptions.RemoveEmptyEntries) : new string[0]));
                
            CreateMap<RoomCreateDto, Room>()
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => string.Join(",", src.Features ?? new List<string>())));

            CreateMap<RoomImage, RoomImageDto>();

            // Reservation mappings
            CreateMap<Reservation, ReservationDto>();
            CreateMap<ReservationCreateDto, Reservation>();
            
            CreateMap<ReservationDetail, ReservationDetailDto>();
            CreateMap<ReservationDetailCreateDto, ReservationDetail>();
            
            CreateMap<ReservationPayment, ReservationPaymentDto>();
            CreateMap<ReservationPaymentCreateDto, ReservationPayment>();
            
            CreateMap<CheckIn, CheckInDto>();
            CreateMap<CheckOut, CheckOutDto>();

            // Employee mappings
            CreateMap<Employee, EmployeeDto>();
            CreateMap<EmployeeCreateDto, Employee>();
            CreateMap<EmployeeUpdateDto, Employee>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            
            CreateMap<EmployeeDocument, EmployeeDocumentDto>();
            CreateMap<EmployeeAttendance, EmployeeAttendanceDto>();
            CreateMap<EmployeePayment, EmployeePaymentDto>();
            CreateMap<EmployeeLeave, EmployeeLeaveDto>();

            // Restaurant mappings
            CreateMap<Dish, DishDto>();
            CreateMap<DishCreateDto, Dish>();
            
            CreateMap<RestaurantOrder, RestaurantOrderDto>();
            CreateMap<RestaurantOrderCreateDto, RestaurantOrder>();
            
            CreateMap<RestaurantOrderedProduct, RestaurantOrderedProductDto>();
            CreateMap<RestaurantOrderedProductCreateDto, RestaurantOrderedProduct>();
            
            CreateMap<RestaurantBillingInfo, RestaurantBillingInfoDto>();
            // CreateMap<RestaurantTable, RestaurantTableDto>();

            // Inventory mappings
            CreateMap<InventoryItem, InventoryItemDto>();
            CreateMap<InventoryItemCreateDto, InventoryItem>();
            
            CreateMap<StockMovement, StockMovementDto>();
            CreateMap<Supplier, SupplierDto>();
            CreateMap<Purchase, PurchaseDto>();
            CreateMap<PurchaseItem, PurchaseItemDto>();

            // Plan mappings
            CreateMap<Plan, PlanDto>();
            CreateMap<PlanCreateDto, Plan>();
        }
    }
}
