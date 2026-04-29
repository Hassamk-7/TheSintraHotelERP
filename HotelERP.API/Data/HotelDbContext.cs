using Microsoft.EntityFrameworkCore;
using HotelERP.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace HotelERP.API.Data
{
    public class HotelDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
    {
        public HotelDbContext(DbContextOptions<HotelDbContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            // Suppress pending migration warning
            optionsBuilder.ConfigureWarnings(warnings => 
                warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        }

        // Master Entry
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<IdType> IdTypes { get; set; }
        public DbSet<FoodCategory> FoodCategories { get; set; }
        public DbSet<MenuCategoryMaster> MenuCategoryMasters { get; set; }
        public DbSet<MenuCuisineMaster> MenuCuisineMasters { get; set; }
        public DbSet<ItemMaster> ItemMasters { get; set; }
        public DbSet<ExtraBed> ExtraBeds { get; set; }
        public DbSet<ExtraPerson> ExtraPersons { get; set; }
        public DbSet<HallMaster> HallMasters { get; set; }
        public DbSet<GardenMaster> GardenMasters { get; set; }
        public DbSet<DeliveryPersonMaster> DeliveryPersonMasters { get; set; }
        public DbSet<OtherCharges> OtherCharges { get; set; }
        public DbSet<TableMaster> TableMasters { get; set; }
        public DbSet<KitchenSection> KitchenSections { get; set; }
        public DbSet<MenuItemMaster> MenuItemMasters { get; set; }
        public DbSet<DrinksCategory> DrinksCategories { get; set; }
        public DbSet<LaundryMaster> LaundryMasters { get; set; }
        public DbSet<DrinksQuantity> DrinksQuantities { get; set; }
        public DbSet<DrinksMaster> DrinksMasters { get; set; }
        public DbSet<DrinksPricing> DrinksPricings { get; set; }
        public DbSet<ExpenseTypeMaster> ExpenseTypeMasters { get; set; }
        public DbSet<ExpensesMaster> ExpensesMasters { get; set; }
        public DbSet<TaxMaster> TaxMasters { get; set; }
        public DbSet<GuestMaster> GuestMasters { get; set; }
        public DbSet<RoomMaster> RoomMasters { get; set; }

        // Front Office
        public DbSet<ReservationMaster> ReservationMasters { get; set; }
        public DbSet<CheckInMaster> CheckInMasters { get; set; }
        public DbSet<CheckOutMaster> CheckOutMasters { get; set; }
        public DbSet<RoomStatusMaster> RoomStatusMasters { get; set; }
        public DbSet<GuestRegistration> GuestRegistrations { get; set; }
        public DbSet<WalkInGuest> WalkInGuests { get; set; }
        public DbSet<GuestHistory> GuestHistories { get; set; }
        public DbSet<RoomTransfer> RoomTransfers { get; set; }
        public DbSet<GuestFolio> GuestFolios { get; set; }
        public DbSet<FolioChargeItem> FolioChargeItems { get; set; }
        public DbSet<FolioPaymentAccount> FolioPaymentAccounts { get; set; }
        public DbSet<CheckInWithID> CheckInWithIDs { get; set; }
        public DbSet<CheckOutWithID> CheckOutWithIDs { get; set; }
        public DbSet<DiscountVoucher> DiscountVouchers { get; set; }

        // Restaurant & Bar
        public DbSet<MenuManagement> MenuManagements { get; set; }
        public DbSet<RestaurantOrder> RestaurantOrders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<TableManagement> TableManagements { get; set; }
        public DbSet<RestaurantTableReservation> RestaurantTableReservations { get; set; }
        public DbSet<KitchenDisplay> KitchenDisplays { get; set; }
        public DbSet<BarManagement> BarManagements { get; set; }
        public DbSet<RoomService> RoomServices { get; set; }

        // Housekeeping
        public DbSet<HousekeepingRoomStatus> HousekeepingRoomStatuses { get; set; }
        public DbSet<CleaningSchedule> CleaningSchedules { get; set; }
        public DbSet<MaintenanceRequest> MaintenanceRequests { get; set; }
        public DbSet<LostAndFound> LostAndFounds { get; set; }
        public DbSet<HousekeepingLaundry> HousekeepingLaundries { get; set; }

        // Accounting
        public DbSet<GuestAccount> GuestAccounts { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<DayBook> DayBooks { get; set; }
        public DbSet<SupplierLedger> SupplierLedgers { get; set; }
        public DbSet<GeneralLedger> GeneralLedgers { get; set; }
        public DbSet<TrialBalance> TrialBalances { get; set; }
        public DbSet<StockAccounting> StockAccountings { get; set; }
        public DbSet<GuestBill> GuestBills { get; set; }
        public DbSet<ChartOfAccount> ChartOfAccounts { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<JournalEntryLine> JournalEntryLines { get; set; }
        public DbSet<PMSAccountMapping> PMSAccountMappings { get; set; }
        public DbSet<FiscalYear> FiscalYears { get; set; }
        public DbSet<AccountingPeriod> AccountingPeriods { get; set; }
        public DbSet<AccountBalance> AccountBalances { get; set; }
        public DbSet<BankReconciliation> BankReconciliations { get; set; }
        public DbSet<BankReconciliationLine> BankReconciliationLines { get; set; }

        // Inventory
        public DbSet<StockManagement> StockManagements { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
        public DbSet<StockAlert> StockAlerts { get; set; }
        public DbSet<InventoryReport> InventoryReports { get; set; }

        // Settings
        public DbSet<SystemSetting> SystemSettings { get; set; }

        // Human Resources & Payroll
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeAttendance> EmployeeAttendances { get; set; }
        public DbSet<EmployeePayment> EmployeePayments { get; set; }
        public DbSet<PayrollAdvance> PayrollAdvances { get; set; }
        public DbSet<LeaveManagement> LeaveManagements { get; set; }
        public DbSet<PerformanceReview> PerformanceReviews { get; set; }
        public DbSet<TrainingProgram> TrainingPrograms { get; set; }

        // Rooms Management
        public DbSet<RoomRates> RoomRates { get; set; }
        public DbSet<RoomAmenities> RoomAmenities { get; set; }
        public DbSet<RoomAmenityMapping> RoomAmenityMappings { get; set; }
        public DbSet<RoomTax> RoomTaxes { get; set; }
        public DbSet<RoomBlocked> RoomBlocked { get; set; }
        public DbSet<FloorManagement> FloorManagements { get; set; }
        public DbSet<Block> Blocks { get; set; }
        public DbSet<BlockFloor> BlockFloors { get; set; }
        public DbSet<RoomTypeAmenityMapping> RoomTypeAmenityMappings { get; set; }
        public DbSet<RoomTypeImage> RoomTypeImages { get; set; }
        public DbSet<RoomGallery> RoomGalleries { get; set; }
        
        // Gallery & Restaurant Management
        public DbSet<RestaurantLocation> Restaurants { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<GalleryCategory> GalleryCategories { get; set; }
        public DbSet<GalleryItem> GalleryItems { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }

        // Blog Management
        public DbSet<BlogCategory> BlogCategories { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<BlogContent> BlogContents { get; set; }
        public DbSet<BlogImage> BlogImages { get; set; }
        public DbSet<BlogTag> BlogTags { get; set; }
        public DbSet<BlogTagMapping> BlogTagMappings { get; set; }

        // Guest Services
        public DbSet<ConciergeServices> ConciergeServices { get; set; }
        public DbSet<SpaWellness> SpaWellnesses { get; set; }
        public DbSet<EventManagement> EventManagements { get; set; }
        public DbSet<Transportation> Transportations { get; set; }
        public DbSet<TourTravel> TourTravels { get; set; }
        public DbSet<GuestFeedbackService> GuestFeedbackServices { get; set; }

        // Marketing & CRM
        public DbSet<CustomerDatabase> CustomerDatabases { get; set; }
        public DbSet<LoyaltyProgram> LoyaltyPrograms { get; set; }
        public DbSet<MarketingCampaign> MarketingCampaigns { get; set; }
        public DbSet<GuestCommunication> GuestCommunications { get; set; }
        public DbSet<ReviewsManagement> ReviewsManagements { get; set; }
        public DbSet<SocialMediaManagement> SocialMediaManagements { get; set; }

        // Additional entities (avoid duplicates)
        public DbSet<Guest> Guests { get; set; }
        public DbSet<GuestDocs> GuestDocuments { get; set; }
        public DbSet<GuestLedger> GuestLedgers { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Plan> Plans { get; set; }
        public DbSet<PlanRoomType> PlanRoomTypes { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<ReservationDetail> ReservationDetails { get; set; }
        public DbSet<ReservationPayment> ReservationPayments { get; set; }
        public DbSet<CheckIn> CheckIns { get; set; }
        public DbSet<CheckOut> CheckOuts { get; set; }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<DishCategory> DishCategories { get; set; }
        public DbSet<RestaurantOrderedProduct> RestaurantOrderedProducts { get; set; }
        public DbSet<RestaurantBillingInfo> RestaurantBillingInfos { get; set; }
        public DbSet<RestaurantTable> RestaurantTables { get; set; }
        public DbSet<InventoryCategory> InventoryCategories { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<PurchaseItem> PurchaseItems { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Designation> Designations { get; set; }
        public DbSet<EmployeeDocument> EmployeeDocuments { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<ExpenseType> ExpenseTypes { get; set; }
        public DbSet<CompanyContact> CompanyContacts { get; set; }
        public DbSet<EmailSetting> EmailSettings { get; set; }
        public DbSet<SMSSetting> SMSSettings { get; set; }

        // Night Audit Module
        public DbSet<NightAuditLog> NightAuditLogs { get; set; }
        public DbSet<NightAuditCharges> NightAuditCharges { get; set; }
        public DbSet<NightAuditPayments> NightAuditPayments { get; set; }
        public DbSet<NightAuditRoomStatus> NightAuditRoomStatus { get; set; }
        public DbSet<NightAuditVariances> NightAuditVariances { get; set; }
        public DbSet<NightAuditRevenueSummary> NightAuditRevenueSummaries { get; set; }

        // Channel Manager (BookLogic)
        public DbSet<ChannelManagerSetting> ChannelManagerSettings { get; set; }
        public DbSet<ChannelManagerRoomMapping> ChannelManagerRoomMappings { get; set; }
        public DbSet<ChannelManagerRateMapping> ChannelManagerRateMappings { get; set; }
        public DbSet<ChannelManagerLog> ChannelManagerLogs { get; set; }
        public DbSet<ChannelManagerReservation> ChannelManagerReservations { get; set; }

        // Cancellation Policies
        public DbSet<CancellationPolicy> CancellationPolicies { get; set; }
        public DbSet<RatePlanCancellationPolicy> RatePlanCancellationPolicies { get; set; }
        public DbSet<CancellationPenaltyPosting> CancellationPenaltyPostings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure Blog table names to match existing database
            modelBuilder.Entity<BlogContent>().ToTable("BlogContent");
            modelBuilder.Entity<BlogImage>().ToTable("BlogImages");
            modelBuilder.Entity<BlogTagMapping>().ToTable("BlogTagMapping");
            
            // Configure relationships and constraints
            modelBuilder.Entity<Guest>()
                .HasMany(g => g.Reservations)
                .WithOne(r => r.Guest)
                .HasForeignKey(r => r.GuestId);
                
            modelBuilder.Entity<Room>()
                .HasOne(r => r.RoomType)
                .WithMany(rt => rt.Rooms)
                .HasForeignKey(r => r.RoomTypeId);

            modelBuilder.Entity<Hotel>()
                .HasOne(h => h.CityNavigation)
                .WithMany()
                .HasForeignKey(h => h.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoomType>()
                .HasOne(rt => rt.Hotel)
                .WithMany()
                .HasForeignKey(rt => rt.HotelId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Configure Dish relationships
            modelBuilder.Entity<Dish>()
                .HasOne(d => d.Category)
                .WithMany(c => c.Dishes)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Configure RestaurantOrder relationships
            modelBuilder.Entity<RestaurantOrder>()
                .HasOne(ro => ro.Room)
                .WithMany()
                .HasForeignKey(ro => ro.RoomId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<RestaurantOrder>()
                .HasOne(ro => ro.Table)
                .WithMany(t => t.Orders)
                .HasForeignKey(ro => ro.TableId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Configure RestaurantOrderedProduct relationships
            modelBuilder.Entity<RestaurantOrderedProduct>()
                .HasOne(op => op.Order)
                .WithMany(o => o.OrderedProducts)
                .HasForeignKey(op => op.OrderId);
                
            modelBuilder.Entity<RestaurantOrderedProduct>()
                .HasOne(op => op.Dish)
                .WithMany(d => d.OrderedProducts)
                .HasForeignKey(op => op.DishId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Configure KitchenDisplay relationships to avoid cascade conflicts
            modelBuilder.Entity<KitchenDisplay>()
                .HasOne(kd => kd.Order)
                .WithMany()
                .HasForeignKey(kd => kd.OrderId)
                .OnDelete(DeleteBehavior.NoAction);
                
            modelBuilder.Entity<KitchenDisplay>()
                .HasOne(kd => kd.OrderItem)
                .WithMany()
                .HasForeignKey(kd => kd.OrderItemId)
                .OnDelete(DeleteBehavior.NoAction);
                
            // Configure RoomTransfer relationships to avoid cascade conflicts
            modelBuilder.Entity<RoomTransfer>()
                .HasOne(rt => rt.FromRoom)
                .WithMany()
                .HasForeignKey(rt => rt.FromRoomId)
                .OnDelete(DeleteBehavior.NoAction);
                
            modelBuilder.Entity<RoomTransfer>()
                .HasOne(rt => rt.ToRoom)
                .WithMany()
                .HasForeignKey(rt => rt.ToRoomId)
                .OnDelete(DeleteBehavior.NoAction);
                
            // Configure CheckIn relationships
            modelBuilder.Entity<CheckInMaster>()
                .HasOne(c => c.Room)
                .WithMany()
                .HasForeignKey(c => c.RoomId)
                .OnDelete(DeleteBehavior.NoAction);
                
            modelBuilder.Entity<CheckInMaster>()
                .HasOne(c => c.Guest)
                .WithMany()
                .HasForeignKey(c => c.GuestId)
                .OnDelete(DeleteBehavior.NoAction);
                
            // Configure CheckOut relationships
            modelBuilder.Entity<CheckOutMaster>()
                .HasOne(co => co.CheckIn)
                .WithMany()
                .HasForeignKey(co => co.CheckInId)
                .OnDelete(DeleteBehavior.NoAction);
                
            modelBuilder.Entity<Reservation>()
                .HasMany(r => r.Details)
                .WithOne(d => d.Reservation)
                .HasForeignKey(d => d.ReservationId);
                
            // Configure decimal precision for all financial fields
            modelBuilder.Entity<Reservation>()
                .Property(r => r.TotalAmount)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<Reservation>()
                .Property(r => r.TotalPaid)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Reservation>()
                .Property(r => r.RoomRate)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Reservation>()
                .Property(r => r.Discount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Reservation>()
                .Property(r => r.FBCredits)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Reservation>()
                .Property(r => r.AdvanceAmount)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<ReservationDetail>()
                .Property(rd => rd.Rate)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<ReservationDetail>()
                .Property(rd => rd.TotalAmount)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<ReservationPayment>()
                .Property(rp => rp.Amount)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<RestaurantBillingInfo>()
                .Property(rbi => rbi.Amount)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<RestaurantOrderedProduct>()
                .Property(rop => rop.UnitPrice)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<RestaurantOrderedProduct>()
                .Property(rop => rop.TotalPrice)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<Room>()
                .Property(r => r.BasePrice)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<RoomType>()
                .Property(rt => rt.BasePrice)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<PurchaseItem>()
                .Property(pi => pi.UnitPrice)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<Dish>()
                .Property(d => d.Price)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<InventoryItem>()
                .Property(ii => ii.CostPrice)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<InventoryItem>()
                .Property(ii => ii.SellingPrice)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<Expense>()
                .Property(e => e.Amount)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<EmployeePayment>()
                .Property(ep => ep.BasicSalary)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<EmployeePayment>()
                .Property(ep => ep.Allowances)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<EmployeePayment>()
                .Property(ep => ep.Deductions)
                .HasPrecision(18, 2);
                
            modelBuilder.Entity<EmployeePayment>()
                .Property(ep => ep.NetSalary)
                .HasPrecision(18, 2);

            // Configure decimal precision for all financial fields to fix EF warnings
            ConfigureDecimalPrecision(modelBuilder);

            // Channel Manager – prevent multiple cascade paths on RateMappings
            modelBuilder.Entity<ChannelManagerRateMapping>()
                .HasOne(rm => rm.ChannelManagerSetting)
                .WithMany()
                .HasForeignKey(rm => rm.ChannelManagerSettingId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ChannelManagerRateMapping>()
                .HasOne(rm => rm.RoomMapping)
                .WithMany()
                .HasForeignKey(rm => rm.ChannelManagerRoomMappingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChannelManagerRateMapping>()
                .Property(rm => rm.ExternalRateId)
                .HasMaxLength(50);

            modelBuilder.Entity<ChannelManagerReservation>()
                .Property(r => r.TotalAmount)
                .HasPrecision(18, 2);

            // Add other configurations as needed
            
            // Seed initial data if needed
            // SeedData.Seed(modelBuilder);
        }

        private void ConfigureDecimalPrecision(ModelBuilder modelBuilder)
        {
            // Bar Management
            modelBuilder.Entity<BarManagement>()
                .Property(e => e.AlcoholContent).HasPrecision(5, 2);
            modelBuilder.Entity<BarManagement>()
                .Property(e => e.CostPrice).HasPrecision(18, 2);
            modelBuilder.Entity<BarManagement>()
                .Property(e => e.HappyHourPrice).HasPrecision(18, 2);
            modelBuilder.Entity<BarManagement>()
                .Property(e => e.Price).HasPrecision(18, 2);

            // Check In/Out entities
            modelBuilder.Entity<CheckInMaster>()
                .Property(e => e.Discount).HasPrecision(18, 2);
            modelBuilder.Entity<CheckInMaster>()
                .Property(e => e.FBCredits).HasPrecision(18, 2);
            modelBuilder.Entity<CheckInMaster>()
                .Property(e => e.AdvancePaid).HasPrecision(18, 2);
            modelBuilder.Entity<CheckInMaster>()
                .Property(e => e.RoomRate).HasPrecision(18, 2);
            modelBuilder.Entity<CheckInMaster>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);

            modelBuilder.Entity<CheckInWithID>()
                .Property(e => e.RoomRate).HasPrecision(18, 2);
            modelBuilder.Entity<CheckInWithID>()
                .Property(e => e.SecurityDeposit).HasPrecision(18, 2);

            modelBuilder.Entity<CheckOut>()
                .Property(e => e.Balance).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOut>()
                .Property(e => e.TotalBill).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOut>()
                .Property(e => e.TotalPaid).HasPrecision(18, 2);

            modelBuilder.Entity<CheckOutMaster>()
                .Property(e => e.Balance).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutMaster>()
                .Property(e => e.LateCheckOutCharges).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutMaster>()
                .Property(e => e.RoomCharges).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutMaster>()
                .Property(e => e.ServiceCharges).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutMaster>()
                .Property(e => e.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutMaster>()
                .Property(e => e.TotalBill).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutMaster>()
                .Property(e => e.TotalPaid).HasPrecision(18, 2);

            modelBuilder.Entity<CheckOutWithID>()
                .Property(e => e.Balance).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutWithID>()
                .Property(e => e.LateCheckOutCharges).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutWithID>()
                .Property(e => e.RoomCharges).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutWithID>()
                .Property(e => e.SecurityDepositRefund).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutWithID>()
                .Property(e => e.ServiceCharges).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutWithID>()
                .Property(e => e.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutWithID>()
                .Property(e => e.TotalBill).HasPrecision(18, 2);
            modelBuilder.Entity<CheckOutWithID>()
                .Property(e => e.TotalPaid).HasPrecision(18, 2);

            // Service entities
            modelBuilder.Entity<ConciergeServices>()
                .Property(e => e.ServiceCharge).HasPrecision(18, 2);

            modelBuilder.Entity<Currency>()
                .Property(e => e.ExchangeRate).HasPrecision(18, 6);

            modelBuilder.Entity<CustomerDatabase>()
                .Property(e => e.AverageSpending).HasPrecision(18, 2);
            modelBuilder.Entity<CustomerDatabase>()
                .Property(e => e.TotalSpent).HasPrecision(18, 2);

            // Accounting entities
            modelBuilder.Entity<DayBook>()
                .Property(e => e.CreditAmount).HasPrecision(18, 2);
            modelBuilder.Entity<DayBook>()
                .Property(e => e.DebitAmount).HasPrecision(18, 2);

            modelBuilder.Entity<ChartOfAccount>()
                .Property(e => e.OpeningBalance).HasPrecision(18, 2);

            modelBuilder.Entity<JournalEntry>()
                .Property(e => e.TotalDebit).HasPrecision(18, 2);
            modelBuilder.Entity<JournalEntry>()
                .Property(e => e.TotalCredit).HasPrecision(18, 2);

            modelBuilder.Entity<JournalEntryLine>()
                .Property(e => e.DebitAmount).HasPrecision(18, 2);
            modelBuilder.Entity<JournalEntryLine>()
                .Property(e => e.CreditAmount).HasPrecision(18, 2);
            modelBuilder.Entity<JournalEntryLine>()
                .Property(e => e.TaxAmount).HasPrecision(18, 2);

            modelBuilder.Entity<AccountBalance>()
                .Property(e => e.OpeningDebit).HasPrecision(18, 2);
            modelBuilder.Entity<AccountBalance>()
                .Property(e => e.OpeningCredit).HasPrecision(18, 2);
            modelBuilder.Entity<AccountBalance>()
                .Property(e => e.OpeningBalance).HasPrecision(18, 2);
            modelBuilder.Entity<AccountBalance>()
                .Property(e => e.PeriodDebit).HasPrecision(18, 2);
            modelBuilder.Entity<AccountBalance>()
                .Property(e => e.PeriodCredit).HasPrecision(18, 2);
            modelBuilder.Entity<AccountBalance>()
                .Property(e => e.ClosingDebit).HasPrecision(18, 2);
            modelBuilder.Entity<AccountBalance>()
                .Property(e => e.ClosingCredit).HasPrecision(18, 2);
            modelBuilder.Entity<AccountBalance>()
                .Property(e => e.ClosingBalance).HasPrecision(18, 2);

            modelBuilder.Entity<BankReconciliation>()
                .Property(e => e.StatementBalance).HasPrecision(18, 2);
            modelBuilder.Entity<BankReconciliation>()
                .Property(e => e.BookBalance).HasPrecision(18, 2);
            modelBuilder.Entity<BankReconciliation>()
                .Property(e => e.Difference).HasPrecision(18, 2);

            modelBuilder.Entity<BankReconciliationLine>()
                .Property(e => e.DebitAmount).HasPrecision(18, 2);
            modelBuilder.Entity<BankReconciliationLine>()
                .Property(e => e.CreditAmount).HasPrecision(18, 2);

            modelBuilder.Entity<DeliveryPersonMaster>()
                .Property(e => e.DeliveryChargePerKm).HasPrecision(18, 2);

            // Drinks entities
            modelBuilder.Entity<DrinksMaster>()
                .Property(e => e.Price).HasPrecision(18, 2);
            modelBuilder.Entity<DrinksMaster>()
                .Property(e => e.AlcoholContent).HasPrecision(5, 2);

            modelBuilder.Entity<DrinksPricing>()
                .Property(e => e.CostPrice).HasPrecision(18, 2);
            modelBuilder.Entity<DrinksPricing>()
                .Property(e => e.HappyHourPrice).HasPrecision(18, 2);
            modelBuilder.Entity<DrinksPricing>()
                .Property(e => e.Price).HasPrecision(18, 2);

            modelBuilder.Entity<DrinksQuantity>()
                .Property(e => e.Volume).HasPrecision(10, 3);

            // Employee entities
            modelBuilder.Entity<Employee>()
                .Property(e => e.BasicSalary).HasPrecision(18, 2);

            modelBuilder.Entity<EmployeeAttendance>()
                .Property(e => e.OvertimeHours).HasPrecision(8, 2);
            modelBuilder.Entity<EmployeeAttendance>()
                .Property(e => e.WorkingHours).HasPrecision(8, 2);

            modelBuilder.Entity<EmployeePayment>()
                .Property(e => e.Bonus).HasPrecision(18, 2);
            modelBuilder.Entity<EmployeePayment>()
                .Property(e => e.GrossSalary).HasPrecision(18, 2);
            modelBuilder.Entity<EmployeePayment>()
                .Property(e => e.OtherDeductions).HasPrecision(18, 2);
            modelBuilder.Entity<EmployeePayment>()
                .Property(e => e.OvertimeAmount).HasPrecision(18, 2);
            modelBuilder.Entity<EmployeePayment>()
                .Property(e => e.ProvidentFund).HasPrecision(18, 2);
            modelBuilder.Entity<EmployeePayment>()
                .Property(e => e.TaxDeduction).HasPrecision(18, 2);

            // Event and service entities
            modelBuilder.Entity<EventManagement>()
                .Property(e => e.AdvancePaid).HasPrecision(18, 2);
            modelBuilder.Entity<EventManagement>()
                .Property(e => e.CateringCharge).HasPrecision(18, 2);
            modelBuilder.Entity<EventManagement>()
                .Property(e => e.DecorationCharge).HasPrecision(18, 2);
            modelBuilder.Entity<EventManagement>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<EventManagement>()
                .Property(e => e.VenueCharge).HasPrecision(18, 2);

            modelBuilder.Entity<ExpensesMaster>()
                .Property(e => e.Amount).HasPrecision(18, 2);

            modelBuilder.Entity<ExtraBed>()
                .Property(e => e.ChargePerNight).HasPrecision(18, 2);

            modelBuilder.Entity<ExtraPerson>()
                .Property(e => e.ChargePerNight).HasPrecision(18, 2);

            // Garden and Hall entities
            modelBuilder.Entity<GardenMaster>()
                .Property(e => e.DailyRate).HasPrecision(18, 2);
            modelBuilder.Entity<GardenMaster>()
                .Property(e => e.HourlyRate).HasPrecision(18, 2);

            modelBuilder.Entity<HallMaster>()
                .Property(e => e.DailyRate).HasPrecision(18, 2);
            modelBuilder.Entity<HallMaster>()
                .Property(e => e.HourlyRate).HasPrecision(18, 2);

            // Ledger entities
            modelBuilder.Entity<GeneralLedger>()
                .Property(e => e.Balance).HasPrecision(18, 2);
            modelBuilder.Entity<GeneralLedger>()
                .Property(e => e.CreditAmount).HasPrecision(18, 2);
            modelBuilder.Entity<GeneralLedger>()
                .Property(e => e.DebitAmount).HasPrecision(18, 2);

            modelBuilder.Entity<GuestAccount>()
                .Property(e => e.Balance).HasPrecision(18, 2);
            modelBuilder.Entity<GuestAccount>()
                .Property(e => e.CreditAmount).HasPrecision(18, 2);
            modelBuilder.Entity<GuestAccount>()
                .Property(e => e.DebitAmount).HasPrecision(18, 2);

            modelBuilder.Entity<GuestFolio>()
                .Property(e => e.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<GuestFolio>()
                .Property(e => e.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<GuestFolio>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<GuestFolio>()
                .Property(e => e.PaidAmount).HasPrecision(18, 2);
            modelBuilder.Entity<GuestFolio>()
                .Property(e => e.DueAmount).HasPrecision(18, 2);
            modelBuilder.Entity<GuestFolio>()
                .Property(e => e.Balance).HasPrecision(18, 2);

            modelBuilder.Entity<FolioChargeItem>()
                .Property(e => e.DefaultPrice).HasPrecision(18, 2);
            modelBuilder.Entity<FolioChargeItem>()
                .Property(e => e.TaxPercentage).HasPrecision(5, 2);

            // GuestFolio navigation - avoid cascade
            modelBuilder.Entity<GuestFolio>()
                .HasOne(gf => gf.Guest)
                .WithMany()
                .HasForeignKey(gf => gf.GuestId)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<GuestFolio>()
                .HasOne(gf => gf.Reservation)
                .WithMany()
                .HasForeignKey(gf => gf.ReservationId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<GuestHistory>()
                .Property(e => e.AmountPaid).HasPrecision(18, 2);
            modelBuilder.Entity<GuestHistory>()
                .Property(e => e.TotalBill).HasPrecision(18, 2);

            modelBuilder.Entity<GuestLedger>()
                .Property(e => e.Balance).HasPrecision(18, 2);
            modelBuilder.Entity<GuestLedger>()
                .Property(e => e.Credit).HasPrecision(18, 2);
            modelBuilder.Entity<GuestLedger>()
                .Property(e => e.Debit).HasPrecision(18, 2);

            // Housekeeping entities
            modelBuilder.Entity<HousekeepingLaundry>()
                .Property(e => e.ExpressCharge).HasPrecision(18, 2);
            modelBuilder.Entity<HousekeepingLaundry>()
                .Property(e => e.ServiceCharge).HasPrecision(18, 2);
            modelBuilder.Entity<HousekeepingLaundry>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<HousekeepingLaundry>()
                .Property(e => e.TotalWeight).HasPrecision(10, 2);

            // Item and Menu entities
            modelBuilder.Entity<ItemMaster>()
                .Property(e => e.PurchasePrice).HasPrecision(18, 2);
            modelBuilder.Entity<ItemMaster>()
                .Property(e => e.SalePrice).HasPrecision(18, 2);

            modelBuilder.Entity<LaundryMaster>()
                .Property(e => e.ExpressCharge).HasPrecision(18, 2);
            modelBuilder.Entity<LaundryMaster>()
                .Property(e => e.Price).HasPrecision(18, 2);

            modelBuilder.Entity<LoyaltyProgram>()
                .Property(e => e.TotalSpending).HasPrecision(18, 2);

            modelBuilder.Entity<MaintenanceRequest>()
                .Property(e => e.ActualCost).HasPrecision(18, 2);
            modelBuilder.Entity<MaintenanceRequest>()
                .Property(e => e.EstimatedCost).HasPrecision(18, 2);

            modelBuilder.Entity<MarketingCampaign>()
                .Property(e => e.ActualCost).HasPrecision(18, 2);
            modelBuilder.Entity<MarketingCampaign>()
                .Property(e => e.Budget).HasPrecision(18, 2);
            modelBuilder.Entity<MarketingCampaign>()
                .Property(e => e.ConversionRate).HasPrecision(5, 4);
            modelBuilder.Entity<MarketingCampaign>()
                .Property(e => e.ROI).HasPrecision(8, 4);

            modelBuilder.Entity<MenuItemMaster>()
                .Property(e => e.Price).HasPrecision(18, 2);

            modelBuilder.Entity<MenuManagement>()
                .Property(e => e.CostPrice).HasPrecision(18, 2);
            modelBuilder.Entity<MenuManagement>()
                .Property(e => e.Price).HasPrecision(18, 2);

            // Order entities
            modelBuilder.Entity<OrderItem>()
                .Property(e => e.TotalPrice).HasPrecision(18, 2);
            modelBuilder.Entity<OrderItem>()
                .Property(e => e.UnitPrice).HasPrecision(18, 2);

            modelBuilder.Entity<OtherCharges>()
                .Property(e => e.Amount).HasPrecision(18, 2);

            modelBuilder.Entity<Payment>()
                .Property(e => e.Amount).HasPrecision(18, 2);

            // Payroll entities
            modelBuilder.Entity<PayrollAdvance>()
                .Property(e => e.ApprovedAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PayrollAdvance>()
                .Property(e => e.MonthlyDeduction).HasPrecision(18, 2);
            modelBuilder.Entity<PayrollAdvance>()
                .Property(e => e.OutstandingAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PayrollAdvance>()
                .Property(e => e.RequestedAmount).HasPrecision(18, 2);

            // Purchase entities
            modelBuilder.Entity<PurchaseItem>()
                .Property(e => e.Quantity).HasPrecision(10, 3);
            modelBuilder.Entity<PurchaseItem>()
                .Property(e => e.ReceivedQuantity).HasPrecision(10, 3);
            modelBuilder.Entity<PurchaseItem>()
                .Property(e => e.TotalPrice).HasPrecision(18, 2);

            modelBuilder.Entity<PurchaseOrder>()
                .Property(e => e.SubTotal).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseOrder>()
                .Property(e => e.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseOrder>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);

            modelBuilder.Entity<PurchaseOrderItem>()
                .Property(e => e.PendingQuantity).HasPrecision(10, 3);
            modelBuilder.Entity<PurchaseOrderItem>()
                .Property(e => e.Quantity).HasPrecision(10, 3);
            modelBuilder.Entity<PurchaseOrderItem>()
                .Property(e => e.ReceivedQuantity).HasPrecision(10, 3);
            modelBuilder.Entity<PurchaseOrderItem>()
                .Property(e => e.TotalPrice).HasPrecision(18, 2);
            modelBuilder.Entity<PurchaseOrderItem>()
                .Property(e => e.UnitPrice).HasPrecision(18, 2);

            // Reservation entities
            modelBuilder.Entity<ReservationMaster>()
                .Property(e => e.AdvanceAmount).HasPrecision(18, 2);
            modelBuilder.Entity<ReservationMaster>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);

            // Hotel entities
            modelBuilder.Entity<Hotel>()
                .Property(e => e.Latitude).HasPrecision(18, 6);
            modelBuilder.Entity<Hotel>()
                .Property(e => e.Longitude).HasPrecision(18, 6);

            // Room entities
            modelBuilder.Entity<Room>()
                .Property(e => e.RoomSize).HasPrecision(10, 2);
            modelBuilder.Entity<RoomAmenities>()
                .Property(e => e.ChargeAmount).HasPrecision(18, 2);

            modelBuilder.Entity<RoomAmenityMapping>()
                .Property(e => e.AdditionalCharge).HasPrecision(18, 2);

            modelBuilder.Entity<RoomMaster>()
                .Property(e => e.BaseRate).HasPrecision(18, 2);

            modelBuilder.Entity<RoomRates>()
                .Property(e => e.BaseRate).HasPrecision(18, 2);
            modelBuilder.Entity<RoomRates>()
                .Property(e => e.DiscountRate).HasPrecision(18, 2);
            modelBuilder.Entity<RoomRates>()
                .Property(e => e.RateMonWed).HasPrecision(18, 2);
            modelBuilder.Entity<RoomRates>()
                .Property(e => e.RateThuFri).HasPrecision(18, 2);
            modelBuilder.Entity<RoomRates>()
                .Property(e => e.RateSatSun).HasPrecision(18, 2);
            modelBuilder.Entity<RoomRates>()
                .Property(e => e.SeasonalRate).HasPrecision(18, 2);
            modelBuilder.Entity<RoomRates>()
                .Property(e => e.TaxPercentage).HasPrecision(5, 2);
            modelBuilder.Entity<RoomRates>()
                .Property(e => e.WeekendRate).HasPrecision(18, 2);

            modelBuilder.Entity<RoomService>()
                .Property(e => e.DeliveryCharge).HasPrecision(18, 2);

            modelBuilder.Entity<RoomTransfer>()
                .Property(e => e.AdditionalCharges).HasPrecision(18, 2);

            modelBuilder.Entity<RestaurantTableReservation>()
                .Property(e => e.AdvanceAmount).HasPrecision(18, 2);

            modelBuilder.Entity<RoomType>()
                .Property(e => e.BaseRate).HasPrecision(18, 2);
            modelBuilder.Entity<RoomType>()
                .Property(e => e.ChildRate).HasPrecision(18, 2);
            modelBuilder.Entity<RoomType>()
                .Property(e => e.ExtraBedRate).HasPrecision(18, 2);

            modelBuilder.Entity<RoomTypeAmenityMapping>()
                .Property(e => e.AdditionalCharge).HasPrecision(18, 2);

            // Room Type Image relationships
            modelBuilder.Entity<RoomTypeImage>()
                .HasOne(rti => rti.RoomType)
                .WithMany(rt => rt.Images)
                .HasForeignKey(rti => rti.RoomTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Room Gallery relationships
            modelBuilder.Entity<RoomGallery>()
                .HasOne(rg => rg.RoomType)
                .WithMany()
                .HasForeignKey(rg => rg.RoomTypeID)
                .OnDelete(DeleteBehavior.Cascade);

            // Restaurant & Gallery relationships
            modelBuilder.Entity<MenuItem>()
                .HasOne(mi => mi.Restaurant)
                .WithMany(r => r.MenuItems)
                .HasForeignKey(mi => mi.RestaurantID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GalleryItem>()
                .HasOne(gi => gi.Category)
                .WithMany(gc => gc.GalleryItems)
                .HasForeignKey(gi => gi.CategoryID)
                .OnDelete(DeleteBehavior.Cascade);

            // Social Media and Services
            modelBuilder.Entity<SocialMediaManagement>()
                .Property(e => e.EngagementRate).HasPrecision(5, 4);

            modelBuilder.Entity<SpaWellness>()
                .Property(e => e.ServicePrice).HasPrecision(18, 2);

            // Stock entities
            modelBuilder.Entity<StockAccounting>()
                .Property(e => e.Quantity).HasPrecision(10, 3);
            modelBuilder.Entity<StockAccounting>()
                .Property(e => e.StockBalance).HasPrecision(10, 3);
            modelBuilder.Entity<StockAccounting>()
                .Property(e => e.StockValue).HasPrecision(18, 2);
            modelBuilder.Entity<StockAccounting>()
                .Property(e => e.TotalValue).HasPrecision(18, 2);
            modelBuilder.Entity<StockAccounting>()
                .Property(e => e.UnitPrice).HasPrecision(18, 2);

            modelBuilder.Entity<StockAlert>()
                .Property(e => e.CurrentStock).HasPrecision(10, 3);
            modelBuilder.Entity<StockAlert>()
                .Property(e => e.MinimumLevel).HasPrecision(10, 3);

            modelBuilder.Entity<StockManagement>()
                .Property(e => e.Quantity).HasPrecision(10, 3);
            modelBuilder.Entity<StockManagement>()
                .Property(e => e.StockBalance).HasPrecision(10, 3);
            modelBuilder.Entity<StockManagement>()
                .Property(e => e.TotalValue).HasPrecision(18, 2);
            modelBuilder.Entity<StockManagement>()
                .Property(e => e.UnitPrice).HasPrecision(18, 2);

            // Supplier entities
            modelBuilder.Entity<SupplierLedger>()
                .Property(e => e.Balance).HasPrecision(18, 2);
            modelBuilder.Entity<SupplierLedger>()
                .Property(e => e.CreditAmount).HasPrecision(18, 2);
            modelBuilder.Entity<SupplierLedger>()
                .Property(e => e.DebitAmount).HasPrecision(18, 2);

            modelBuilder.Entity<TableMaster>()
                .Property(e => e.MinOrderAmount).HasPrecision(18, 2);

            modelBuilder.Entity<TaxMaster>()
                .Property(e => e.TaxRate).HasPrecision(5, 2);

            // Tour and Travel entities
            modelBuilder.Entity<TourTravel>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<TourTravel>()
                .Property(e => e.TourPrice).HasPrecision(18, 2);

            modelBuilder.Entity<TrainingProgram>()
                .Property(e => e.TrainingCost).HasPrecision(18, 2);

            modelBuilder.Entity<Transportation>()
                .Property(e => e.ServiceCharge).HasPrecision(18, 2);

            // Trial Balance
            modelBuilder.Entity<TrialBalance>()
                .Property(e => e.ClosingBalance).HasPrecision(18, 2);
            modelBuilder.Entity<TrialBalance>()
                .Property(e => e.CreditAmount).HasPrecision(18, 2);
            modelBuilder.Entity<TrialBalance>()
                .Property(e => e.DebitAmount).HasPrecision(18, 2);
            modelBuilder.Entity<TrialBalance>()
                .Property(e => e.OpeningBalance).HasPrecision(18, 2);

            modelBuilder.Entity<Voucher>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);

            // Night Audit entities
            modelBuilder.Entity<NightAuditLog>()
                .Property(e => e.TotalCharges).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditLog>()
                .Property(e => e.TotalPayments).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditLog>()
                .Property(e => e.VarianceAmount).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditLog>()
                .Property(e => e.OccupancyPercentage).HasPrecision(5, 2);
            modelBuilder.Entity<NightAuditLog>()
                .Property(e => e.ADR).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditLog>()
                .Property(e => e.RevPAR).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditLog>()
                .Property(e => e.RoomRevenue).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditLog>()
                .Property(e => e.ExtraRevenue).HasPrecision(18, 2);

            modelBuilder.Entity<NightAuditCharges>()
                .Property(e => e.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditCharges>()
                .Property(e => e.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditCharges>()
                .Property(e => e.ServiceCharge).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditCharges>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);

            modelBuilder.Entity<NightAuditPayments>()
                .Property(e => e.Amount).HasPrecision(18, 2);

            modelBuilder.Entity<NightAuditRoomStatus>()
                .Property(e => e.RateAmount).HasPrecision(18, 2);

            modelBuilder.Entity<NightAuditVariances>()
                .Property(e => e.Amount).HasPrecision(18, 2);

            modelBuilder.Entity<NightAuditRevenueSummary>()
                .Property(e => e.GrossRevenue).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditRevenueSummary>()
                .Property(e => e.TaxAmount).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditRevenueSummary>()
                .Property(e => e.ServiceCharge).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditRevenueSummary>()
                .Property(e => e.NetRevenue).HasPrecision(18, 2);
            modelBuilder.Entity<NightAuditRevenueSummary>()
                .Property(e => e.Percentage).HasPrecision(5, 2);

            modelBuilder.Entity<WalkInGuest>()
                .Property(e => e.RoomRate).HasPrecision(18, 2);
            modelBuilder.Entity<WalkInGuest>()
                .Property(e => e.TotalAmount).HasPrecision(18, 2);
        }
    }
}
