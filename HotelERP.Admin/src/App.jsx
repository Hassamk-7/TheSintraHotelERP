import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Inventory from './pages/Inventory/Inventory'
import MasterEntry from './pages/MasterEntry/MasterEntry'
import HotelMaster from './pages/MasterEntry/HotelMaster'
import RoomTypeMaster from './pages/MasterEntry/RoomTypeMaster'
import CurrencyMaster from './pages/MasterEntry/CurrencyMaster'
import SupplierMaster from './pages/MasterEntry/SupplierMaster'
import GuestMaster from './pages/MasterEntry/GuestMaster'
import FoodCategoryMaster from './pages/MasterEntry/FoodCategoryMaster'
import ItemMaster from './pages/MasterEntry/ItemMaster'
import RoomMaster from './pages/MasterEntry/RoomMaster'
import IDTypeMaster from './pages/MasterEntry/IDTypeMaster'
import ExtraBedMaster from './pages/MasterEntry/ExtraBedMaster'
import ExtraPersonMaster from './pages/MasterEntry/ExtraPersonMaster'
import HallMaster from './pages/MasterEntry/HallMaster'
import GardenMaster from './pages/MasterEntry/GardenMaster'
import DeliveryPersonMaster from './pages/MasterEntry/DeliveryPersonMaster'
import OtherChargesMaster from './pages/MasterEntry/OtherChargesMaster'
import TableMaster from './pages/MasterEntry/TableMaster'
import KitchenSectionMaster from './pages/MasterEntry/KitchenSectionMaster'
import MenuItemMaster from './pages/MasterEntry/MenuItemMaster'
import MenuCategoryMaster from './pages/MasterEntry/MenuCategoryMaster'
import MenuCuisineMaster from './pages/MasterEntry/MenuCuisineMaster'
import DrinksCategory from './pages/MasterEntry/DrinksCategory'
import LaundryMaster from './pages/MasterEntry/LaundryMaster'
import DrinksQuantity from './pages/MasterEntry/DrinksQuantity'
import DrinksMaster from './pages/MasterEntry/DrinksMaster'
import DrinksPricing from './pages/MasterEntry/DrinksPricing.jsx';
import InventoryCategoryMaster from './pages/Inventory/InventoryCategoryMaster.jsx';
import ExpenseType from './pages/MasterEntry/ExpenseType'
import ExpensesMaster from './pages/MasterEntry/ExpensesMaster'
import TaxMaster from './pages/MasterEntry/TaxMaster'
import GuestRegistration from './pages/FrontOffice/GuestRegistration'
import WalkInGuests from './pages/FrontOffice/WalkInGuests'
import GuestHistory from './pages/FrontOffice/GuestHistory'
import RoomTransfer from './pages/FrontOffice/RoomTransfer'
import GuestFolio from './pages/FrontOffice/GuestFolio'
import CheckInWithID from './pages/FrontOffice/CheckInWithID'
import CheckOutWithID from './pages/FrontOffice/CheckOutWithID'
import HotelPlanMaster from './pages/RoomsManagement/HotelPlanMaster'
import ArrivalDeparture from './pages/FrontOffice/ArrivalDeparture'
import DiscountVoucherManagement from './pages/FrontOffice/VoucherManagement'
import RoomTypes from './pages/RoomTypes/RoomTypesMinimal.jsx'
import RoomTypeImages from './pages/RoomTypes/RoomTypeImages'
import RoomTypeImagesList from './pages/RoomTypes/RoomTypeImagesList'
import RoomGallery from './pages/RoomsManagement/RoomGallery'
import RoomGalleryList from './pages/RoomsManagement/RoomGalleryList'
import RoomGalleryManage from './pages/RoomsManagement/RoomGalleryManage'

// Front Gallery & Restaurant Components
import GalleryCategories from './pages/FrontGallery/GalleryCategories'
import GalleryItems from './pages/FrontGallery/GalleryItems'
import RestaurantManage from './pages/FrontRestaurant/RestaurantManage'
import MenuItemManage from './pages/FrontRestaurant/MenuItemManage'
import ContactMessages from './pages/ContactMessages/ContactMessages'

// Blog Management Components
import BlogManage from './pages/Blogs/BlogManage'
import BlogFormNew from './pages/Blogs/BlogFormNew'
import BlogCategoryManage from './pages/Blogs/BlogCategoryManage'
import Rooms from './pages/Rooms/Rooms'
import RoomRates from './pages/Rooms/RoomRates'
import RoomAmenities from './pages/Rooms/RoomAmenities'
import FloorManagement from './pages/Rooms/FloorManagement'
// Dynamic RoomsManagement Components
import RoomsManagementRooms from './pages/RoomsManagement/Rooms'
import RoomsManagementRoomRates from './pages/RoomsManagement/RoomRates'
import RoomsManagementRoomAmenities from './pages/RoomsManagement/RoomAmenities'
import RoomsManagementFloorManagement from './pages/RoomsManagement/FloorManagement'
import BlockFloorManagement from './pages/RoomsManagement/BlockFloorManagement'
import RoomTax from './pages/RoomsManagement/RoomTax'
import RoomBlocked from './pages/RoomsManagement/RoomBlocked'
import HousekeepingRoomStatus from './pages/Housekeeping/HousekeepingRoomStatus'
import CleaningSchedule from './pages/Housekeeping/CleaningSchedule'
import MaintenanceRequests from './pages/Housekeeping/MaintenanceRequests'
import LostAndFound from './pages/Housekeeping/LostAndFound'
import LaundryManagement from './pages/Housekeeping/LaundryManagement_Working'
import RestaurantDashboard from './pages/RestaurantBar/RestaurantDashboard'
import MenuManagement from './pages/RestaurantBar/MenuManagement'
import TableReservation from './pages/RestaurantBar/TableReservation'
import MenuOrderManagement from './pages/RestaurantBar/MenuOrderManagement'
import KitchenDisplay from './pages/RestaurantBar/KitchenDisplay'
import BarManagement from './pages/RestaurantBar/BarManagement'
import RoomService from './pages/RestaurantBar/RoomService'
import FrontOffice from './pages/FrontOffice/FrontOffice'
import Reservations from './pages/FrontOffice/Reservations'
import CheckInModern from './pages/FrontOffice/CheckInModern'
import CheckOut from './pages/FrontOffice/CheckOut'
import RoomStatus from './pages/FrontOffice/RoomStatus'
import RoomsManagement from './pages/Rooms/RoomsManagement'
import Housekeeping from './pages/Housekeeping/Housekeeping'
import RestaurantBar from './pages/RestaurantBar/RestaurantBar'
import Accounting from './pages/Accounting/Accounting'
import InventoryManagement from './pages/Inventory/InventoryManagement'
import HumanResources from './pages/HumanResources/HumanResources'
import ConciergeServices from './pages/GuestServices/ConciergeServices'
import SpaWellness from './pages/GuestServices/SpaWellness'
import EventManagement from './pages/GuestServices/EventManagement'
import Transportation from './pages/GuestServices/Transportation'
import ToursTravel from './pages/GuestServices/ToursTravel'
import GuestFeedback from './pages/GuestServices/GuestFeedback'

// Night Audit Components
import NightAudit from './pages/NightAudit/NightAudit'

// Channel Manager Components
import ChannelManager from './pages/ChannelManager/ChannelManager'

// Policies Components
import CancellationPolicyManager from './pages/Policies/CancellationPolicyManager'

// Calendar Components
import Calendar from './pages/Calendar'

// Payroll Components
import EmployeeRegistration from './pages/Payroll/EmployeeRegistration'
import PayrollAttendance from './pages/Payroll/PayrollAttendance'
import PayrollAdvance from './pages/Payroll/PayrollAdvance'
import PayrollManagement from './pages/Payroll/PayrollManagement'

// Search Records Components (existing ones)
import EmployeeSearch from './pages/SearchRecords/EmployeeSearch'
import SupplierSearch from './pages/SearchRecords/SupplierSearch'
import EmployeeAttendanceSearch from './pages/SearchRecords/EmployeeAttendanceSearch'
import EmployeePaymentSearch from './pages/SearchRecords/EmployeePaymentSearch'
import SupplierPaymentSearch from './pages/SearchRecords/SupplierPaymentSearch'
import AdvanceEntrySearch from './pages/SearchRecords/AdvanceEntrySearch'
import CurrentAdvanceSearch from './pages/SearchRecords/CurrentAdvanceSearch'
import GuestLedgerSearch from './pages/SearchRecords/GuestLedgerSearch'
import CurrentBalanceSearch from './pages/SearchRecords/CurrentBalanceSearch'
import DeductionSearch from './pages/SearchRecords/DeductionSearch'
import CheckInOutSearch from './pages/SearchRecords/CheckInOutSearch'
import CheckOutSearch from './pages/SearchRecords/CheckOutSearch'
import RoomReservationSearch from './pages/SearchRecords/RoomReservationSearch'
import GuestsSearch from './pages/SearchRecords/GuestsSearch'
import RoomOrdersSearch from './pages/SearchRecords/RoomOrdersSearch'
import PurchasedInventorySearch from './pages/SearchRecords/PurchasedInventorySearch'
import DrinksStockSearch from './pages/SearchRecords/DrinksStockSearch'
import HallGardenReservationSearch from './pages/SearchRecords/HallGardenReservationSearch'
import RestaurantBillingSearch from './pages/SearchRecords/RestaurantBillingSearch'
import MostOrderedFoodsSearch from './pages/SearchRecords/MostOrderedFoodsSearch'
import LaundryBillingSearch from './pages/SearchRecords/LaundryBillingSearch'

// Reports Components (existing ones only)
import FoodDrinksMenuReport from './pages/Reports/FoodDrinksMenuReport'
import DrinksStockReport from './pages/Reports/DrinksStockReport'
import GuestProfileReport from './pages/Reports/GuestProfileReport'
import PurchasedInventoryReport from './pages/Reports/PurchasedInventoryReport'
import CreditorsDebtorsReport from './pages/Reports/CreditorsDebtorsReport'
import ReservationReport from './pages/Reports/ReservationReport'
import CheckInReport from './pages/Reports/CheckInReport'
import CheckOutReport from './pages/Reports/CheckOutReport'
import CheckInOutReport from './pages/Reports/CheckInOutReport'
import RoomServicesReport from './pages/Reports/RoomServicesReport'
import RestaurantBillingReport from './pages/Reports/RestaurantBillingReport'
import LaundryBillingReport from './pages/Reports/LaundryBillingReport'
import RestaurantBillingWOTReport from './pages/Reports/RestaurantBillingWOTReport'
import AdvanceEntryReport from './pages/Reports/AdvanceEntryReport'
import CurrentPayrollAdvanceReport from './pages/Reports/CurrentPayrollAdvanceReport'
import DeductionReport from './pages/Reports/DeductionReport'
import EmployeePaymentReport from './pages/Reports/EmployeePaymentReport'
import SalarySlipReport from './pages/Reports/SalarySlipReport'
import RoomBillReport from './pages/Reports/RoomBillReport'

// Accounting Components
import AccountsReceivable from './pages/Accounting/AccountsReceivable'
import AccountsPayable from './pages/Accounting/AccountsPayable'
import GuestBilling from './pages/Accounting/GuestBilling'
import GuestAccount from './pages/Accounting/GuestAccount'
import PurchasedInventoryAcc from './pages/Accounting/PurchasedInventory'
import AccountingVoucherManagement from './pages/Accounting/VoucherManagement'
import PaymentManagement from './pages/Accounting/PaymentManagement'
import PurchaseDaybook from './pages/Accounting/PurchaseDaybook'
import Daybook from './pages/Accounting/Daybook'
import SupplierLedger from './pages/Accounting/SupplierLedger'
import GuestLedger from './pages/Accounting/GuestLedger'
import GeneralLedger from './pages/Accounting/GeneralLedger'
import TrialBalance from './pages/Accounting/TrialBalance'
import TaxManagement from './pages/Accounting/TaxManagement'
import FinancialReports from './pages/Accounting/FinancialReports'
import LaundryBilling from './pages/Accounting/LaundryBilling'
import AccountingDashboard from './pages/Accounting/AccountingDashboard'
import ChartOfAccounts from './pages/Accounting/ChartOfAccounts'
import JournalEntries from './pages/Accounting/JournalEntries'
import PMSAccountMapping from './pages/Accounting/PMSAccountMapping'
import AccountingReports from './pages/Accounting/Reports'

// Inventory Components
import StockManagement from './pages/Inventory/StockManagement'
import PurchaseOrders from './pages/Inventory/PurchaseOrders'
import InventorySuppliers from './pages/Inventory/Suppliers'
import StockAlerts from './pages/Inventory/StockAlerts'
import InventoryReports from './pages/Inventory/InventoryReports'

// Human Resources Components
import EmployeeManagement from './pages/HumanResources/EmployeeManagement'
import EmployeeManagementDynamic from './pages/HumanResources/EmployeeManagementDynamic'
import DepartmentManagement from './pages/HumanResources/DepartmentManagement'
import DesignationManagement from './pages/HumanResources/DesignationManagement'
import Attendance from './pages/HumanResources/Attendance'
import Payroll from './pages/HumanResources/Payroll'
import LeaveManagement from './pages/HumanResources/LeaveManagement'
import LeaveManagementModule from './pages/HumanResources/LeaveManagementModule'
import Performance from './pages/HumanResources/Performance'
import Training from './pages/HumanResources/Training'

// Marketing & CRM Components
import CustomerDatabase from './pages/MarketingCRM/CustomerDatabase'
import LoyaltyProgram from './pages/MarketingCRM/LoyaltyProgram'
import MarketingCampaigns from './pages/MarketingCRM/MarketingCampaigns'

// Facilities & Maintenance Components
import FacilityManagement from './pages/FacilitiesMaintenance/FacilityManagement'
import PreventiveMaintenance from './pages/FacilitiesMaintenance/PreventiveMaintenance'
import AssetManagement from './pages/FacilitiesMaintenance/AssetManagement'

// Business Intelligence Components
import AnalyticsDashboard from './pages/BusinessIntelligence/AnalyticsDashboard'
import PerformanceMetrics from './pages/BusinessIntelligence/PerformanceMetrics'

// Administration Components
import SystemSettings from './pages/Administration/SystemSettings'
import UserManagement from './pages/Administration/UserManagement'
import PermissionsRoles from './pages/Administration/PermissionsRoles'
import AuditLogs from './pages/Administration/AuditLogs'

import ProtectedRoute from './components/Auth/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router basename="/admin">
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="inventory" element={<Inventory />} />
<Route path="inventory-category-master" element={<InventoryCategoryMaster />} />
                        
                        {/* Master Entry Routes */}
                        <Route path="master-entry" element={<MasterEntry />} />
                        <Route path="master-hotel" element={<HotelMaster />} />
                        <Route path="currency-master" element={<CurrencyMaster />} />
                        <Route path="supplier-master" element={<SupplierMaster />} />
                        <Route path="master-guest" element={<GuestMaster />} />
                        <Route path="food-category" element={<FoodCategoryMaster />} />
                        <Route path="item-master" element={<ItemMaster />} />
                        <Route path="id-type" element={<IDTypeMaster />} />
                        <Route path="hall" element={<HallMaster />} />
                        <Route path="garden" element={<GardenMaster />} />
                        <Route path="delivery-person" element={<DeliveryPersonMaster />} />
                        <Route path="other-charges" element={<OtherChargesMaster />} />
                        <Route path="table-master" element={<TableMaster />} />
                        <Route path="kitchen-section" element={<KitchenSectionMaster />} />
                        <Route path="menu-item-master" element={<MenuItemMaster />} />
                        <Route path="menu-category-master" element={<MenuCategoryMaster />} />
                        <Route path="menu-cuisine-master" element={<MenuCuisineMaster />} />
                        <Route path="drinks-category" element={<DrinksCategory />} />
                        <Route path="laundry-master" element={<LaundryMaster />} />
                        <Route path="drinks-quantity" element={<DrinksQuantity />} />
                        <Route path="drinks-master" element={<DrinksMaster />} />
                        <Route path="drinks-pricing" element={<DrinksPricing />} />
                        <Route path="expense-type" element={<ExpenseType />} />
                        <Route path="expenses-master" element={<ExpensesMaster />} />
                        <Route path="tax-master" element={<TaxMaster />} />
                        
                        {/* Front Office Routes */}
                        <Route path="front-office" element={<FrontOffice />} />
                        <Route path="reservations" element={<Reservations />} />
                        <Route path="check-in" element={<CheckInModern />} />
                        <Route path="check-out" element={<CheckOut />} />
                        <Route path="room-status" element={<RoomStatus />} />
                        <Route path="guest-registration" element={<GuestRegistration />} />
                        <Route path="walk-in-guests" element={<WalkInGuests />} />
                        <Route path="guest-history" element={<GuestHistory />} />
                        <Route path="room-transfer" element={<RoomTransfer />} />
                        <Route path="guest-folio" element={<GuestFolio />} />
                        <Route path="check-in-with-id" element={<CheckInWithID />} />
                        <Route path="check-out-with-id" element={<CheckOutWithID />} />
                        <Route path="hotel-plan-master" element={<HotelPlanMaster />} />
                        
                        {/* Rooms Management Routes */}
                        <Route path="rooms-management" element={<RoomsManagement />} />
                        <Route path="rooms-management/room-types" element={<RoomTypes />} />
                        <Route path="rooms-management/room-type-images" element={<RoomTypeImagesList />} />
                        <Route path="rooms-management/room-types/:roomTypeId/images" element={<RoomTypeImages />} />
                        <Route path="rooms-management/rooms" element={<RoomsManagementRooms />} />
                        <Route path="rooms-management/room-rates" element={<RoomsManagementRoomRates />} />
                        <Route path="rooms-management/room-amenities" element={<RoomsManagementRoomAmenities />} />
                        <Route path="rooms-management/floor-management" element={<RoomsManagementFloorManagement />} />
                        <Route path="rooms-management/block-floor-management" element={<BlockFloorManagement />} />
                        <Route path="rooms-management/room-tax" element={<RoomTax />} />
                        <Route path="rooms-management/room-blocked" element={<RoomBlocked />} />
                        
                        {/* Front Gallery Routes */}
                        <Route path="front-gallery" element={<GalleryCategories />} />
                        <Route path="front-gallery/items/:categoryId" element={<GalleryItems />} />
                        
                        {/* Front Restaurant Routes */}
                        <Route path="front-restaurant" element={<RestaurantManage />} />
                        <Route path="front-restaurant/menu/:restaurantId" element={<MenuItemManage />} />
                        
                        {/* Contact Messages Route */}
                        <Route path="contact-messages" element={<ContactMessages />} />
                        
                        {/* Blog Management Routes */}
                        <Route path="blogs" element={<BlogManage />} />
                        <Route path="blogs/new" element={<BlogFormNew />} />
                        <Route path="blogs/edit/:id" element={<BlogFormNew />} />
                        <Route path="blogs/categories" element={<BlogCategoryManage />} />
                        
                        <Route path="/arrival-departure-report" element={<ArrivalDeparture />} />
                        <Route path="/voucher-management" element={<DiscountVoucherManagement />} />
                        <Route path="/channel-manager" element={<ChannelManager />} />
                        <Route path="/cancellation-policies" element={<CancellationPolicyManager />} />
                        {/* Legacy Routes (keep for backward compatibility) */}
                        <Route path="/room-types" element={<RoomTypes />} />
                        <Route path="/room-type-images" element={<RoomTypeImagesList />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/room-rates" element={<RoomRates />} />
                        <Route path="/room-amenities" element={<RoomAmenities />} />
                        <Route path="/floor-management" element={<FloorManagement />} />
                        
                        {/* Housekeeping Routes */}
                        <Route path="/housekeeping" element={<Housekeeping />} />
                        <Route path="/housekeeping-room-status" element={<HousekeepingRoomStatus />} />
                        <Route path="/cleaning-schedule" element={<CleaningSchedule />} />
                        <Route path="/maintenance-requests" element={<MaintenanceRequests />} />
                        <Route path="/lost-and-found" element={<LostAndFound />} />
                        <Route path="/laundry-management" element={<LaundryManagement />} />
                        
                        {/* Restaurant & Bar Routes */}
                        <Route path="/restaurant-bar" element={<RestaurantBar />} />
                        <Route path="/menu-management" element={<RestaurantDashboard />} />
                        <Route path="/restaurant-menu-items" element={<MenuManagement />} />
                        <Route path="/restaurant-orders" element={<MenuOrderManagement />} />
                        <Route path="/table-management" element={<TableReservation />} />
                        <Route path="/kitchen-display" element={<KitchenDisplay />} />
                        <Route path="/bar-management" element={<BarManagement />} />
                        <Route path="/room-service" element={<RoomService />} />
                        
                        {/* Accounting Routes */}
                        <Route path="/accounting" element={<Accounting />} />
                        <Route path="/guest-billing" element={<GuestBilling />} />
                        <Route path="/accounting-check-in" element={<GuestBilling />} />
                        <Route path="/accounting-stock" element={<PurchasedInventoryAcc />} />
                        <Route path="/accounting-order" element={<PurchaseOrders />} />
                        <Route path="/laundry-billing" element={<LaundryBilling />} />
                        <Route path="/guest-account-add" element={<GuestAccount />} />
                        <Route path="/guest-account-refund" element={<GuestAccount />} />
                        <Route path="/purchased-inventory" element={<PurchasedInventoryAcc />} />
                        <Route path="/voucher" element={<AccountingVoucherManagement />} />
                        <Route path="/payment" element={<PaymentManagement />} />
                        <Route path="/purchase-daybook" element={<PurchaseDaybook />} />
                        <Route path="/daybook" element={<Daybook />} />
                        <Route path="/supplier-ledger" element={<SupplierLedger />} />
                        <Route path="/guest-ledger" element={<GuestLedger />} />
                        <Route path="/general-ledger" element={<GeneralLedger />} />
                        <Route path="/trial-balance" element={<TrialBalance />} />
                        <Route path="/accounting/dashboard" element={<AccountingDashboard />} />
                        <Route path="/accounting/chart-of-accounts" element={<ChartOfAccounts />} />
                        <Route path="/accounting/journal-entries" element={<JournalEntries />} />
                        <Route path="/accounting/pms-account-mapping" element={<PMSAccountMapping />} />
                        <Route path="/accounting/reports" element={<AccountingReports />} />
                        
                        {/* Night Audit Routes */}
                        <Route path="/night-audit" element={<NightAudit />} />
                        
                        {/* Calendar Routes */}
                        <Route path="/calendar/*" element={<Calendar />} />
                        
                        {/* Inventory Routes */}
                        <Route path="/inventory-management" element={<InventoryManagement />} />
                        <Route path="/stock-management" element={<StockManagement />} />
                        <Route path="/purchase-orders" element={<PurchaseOrders />} />
                        <Route path="/suppliers" element={<InventorySuppliers />} />
                        <Route path="/stock-alerts" element={<StockAlerts />} />
                        <Route path="/inventory-reports" element={<InventoryReports />} />
                        
                        {/* Payroll Routes */}
                        <Route path="/payroll-registration" element={<EmployeeRegistration />} />
                        <Route path="/payroll-attendance" element={<PayrollAttendance />} />
                        <Route path="/payroll-advance" element={<PayrollAdvance />} />
                        <Route path="/payroll-main" element={<PayrollManagement />} />
                        
                        {/* Human Resources Routes */}
                        <Route path="/human-resources" element={<HumanResources />} />
                        <Route path="/employees" element={<EmployeeManagement />} />
                        <Route path="/departments" element={<DepartmentManagement />} />
                        <Route path="/designations" element={<DesignationManagement />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/payroll" element={<Payroll />} />
                        <Route path="/leave-management" element={<LeaveManagementModule />} />
                        <Route path="/performance" element={<Performance />} />
                        <Route path="/training" element={<Training />} />
                        
                        {/* Search Records Routes */}
                        <Route path="/search-employees" element={<EmployeeSearch />} />
                        <Route path="/search-suppliers" element={<SupplierSearch />} />
                        <Route path="/search-attendance-1" element={<EmployeeAttendanceSearch />} />
                        <Route path="/search-attendance-2" element={<EmployeeAttendanceSearch />} />
                        <Route path="/search-payment-1" element={<EmployeePaymentSearch />} />
                        <Route path="/search-payment-2" element={<EmployeePaymentSearch />} />
                        <Route path="/search-supplier-payment" element={<SupplierPaymentSearch />} />
                        <Route path="/search-advance-entry" element={<AdvanceEntrySearch />} />
                        <Route path="/search-current-advance" element={<CurrentAdvanceSearch />} />
                        <Route path="/search-guest-ledger" element={<GuestLedgerSearch />} />
                        <Route path="/search-current-balance" element={<CurrentBalanceSearch />} />
                        <Route path="/search-deduction" element={<DeductionSearch />} />
                        <Route path="/search-check-in" element={<CheckInOutSearch />} />
                        <Route path="/search-check-out" element={<CheckOutSearch />} />
                        <Route path="/search-room-reservation" element={<RoomReservationSearch />} />
                        <Route path="/search-guests" element={<GuestsSearch />} />
                        <Route path="/search-room-orders" element={<RoomOrdersSearch />} />
                        <Route path="/search-purchased-inventory" element={<PurchasedInventorySearch />} />
                        <Route path="/search-drinks-stock" element={<DrinksStockSearch />} />
                        <Route path="/search-hall-garden" element={<HallGardenReservationSearch />} />
                        <Route path="/search-restaurant-billing" element={<RestaurantBillingSearch />} />
                        <Route path="/search-most-ordered" element={<MostOrderedFoodsSearch />} />
                        <Route path="/search-laundry-billing" element={<LaundryBillingSearch />} />
                        
                        {/* Reports Routes */}
                        <Route path="/reports-food-menu" element={<FoodDrinksMenuReport />} />
                        <Route path="/reports-drinks-menu" element={<FoodDrinksMenuReport />} />
                        <Route path="/reports-drinks-stock-in" element={<DrinksStockReport />} />
                        <Route path="/reports-drinks-stock-out" element={<DrinksStockReport />} />
                        <Route path="/reports-guest-profile" element={<GuestProfileReport />} />
                        <Route path="/reports-purchased-inventory" element={<PurchasedInventoryReport />} />
                        <Route path="/reports-creditors" element={<CreditorsDebtorsReport />} />
                        <Route path="/reports-debtors" element={<CreditorsDebtorsReport />} />
                        <Route path="/reports-garden-reservation" element={<ReservationReport />} />
                        <Route path="/reports-hall-reservation" element={<ReservationReport />} />
                        <Route path="/reports-room-reservation" element={<ReservationReport />} />
                        <Route path="/reports-check-in" element={<CheckInReport />} />
                        <Route path="/reports-check-out" element={<CheckOutReport />} />
                        <Route path="/reports-check-in-id" element={<CheckInOutReport />} />
                        <Route path="/reports-check-out-id" element={<CheckInOutReport />} />
                        <Route path="/reports-room-services" element={<RoomServicesReport />} />
                        <Route path="/reports-restaurant-billing" element={<RestaurantBillingReport />} />
                        <Route path="/reports-laundry-billing" element={<LaundryBillingReport />} />
                        <Route path="/reports-restaurant-wot" element={<RestaurantBillingWOTReport />} />
                        <Route path="/reports-advance-entry" element={<AdvanceEntryReport />} />
                        <Route path="/reports-payroll-advance" element={<CurrentPayrollAdvanceReport />} />
                        <Route path="/reports-deduction" element={<DeductionReport />} />
                        <Route path="/reports-employee-payment" element={<EmployeePaymentReport />} />
                        <Route path="/reports-salary-slip" element={<SalarySlipReport />} />
                        <Route path="/reports-room-bill" element={<RoomBillReport />} />
                        
                        {/* Guest Services Routes */}
                        <Route path="/concierge" element={<ConciergeServices />} />
                        <Route path="/spa-wellness" element={<SpaWellness />} />
                        <Route path="/events" element={<EventManagement />} />
                        <Route path="/transportation" element={<Transportation />} />
                        <Route path="/tours" element={<ToursTravel />} />
                        <Route path="/feedback" element={<GuestFeedback />} />
                        
                        {/* Marketing & CRM Routes */}
                        <Route path="/customer-database" element={<CustomerDatabase />} />
                        <Route path="/loyalty-program" element={<LoyaltyProgram />} />
                        <Route path="/marketing-campaigns" element={<MarketingCampaigns />} />
                        <Route path="/guest-communications" element={<CustomerDatabase />} />
                        <Route path="/reviews" element={<CustomerDatabase />} />
                        <Route path="/social-media" element={<CustomerDatabase />} />
                        
                        {/* Facilities & Maintenance Routes */}
                        <Route path="/facility-management" element={<FacilityManagement />} />
                        <Route path="/preventive-maintenance" element={<PreventiveMaintenance />} />
                        <Route path="/work-orders" element={<FacilityManagement />} />
                        <Route path="/asset-management" element={<AssetManagement />} />
                        <Route path="/energy-management" element={<FacilityManagement />} />
                        <Route path="/security-systems" element={<FacilityManagement />} />
                        
                        {/* Business Intelligence Routes */}
                        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                        <Route path="/performance-metrics" element={<PerformanceMetrics />} />
                        <Route path="/forecasting" element={<AnalyticsDashboard />} />
                        <Route path="/competitor-analysis" element={<AnalyticsDashboard />} />
                        <Route path="/market-research" element={<AnalyticsDashboard />} />
                        <Route path="/business-reports" element={<AnalyticsDashboard />} />
                        
                        {/* Administration Routes */}
                        <Route path="/system-settings" element={<SystemSettings />} />
                        <Route path="/user-management" element={<UserManagement />} />
                        <Route path="/permissions" element={<PermissionsRoles />} />
                        <Route path="/backup-restore" element={<SystemSettings />} />
                        <Route path="/audit-logs" element={<AuditLogs />} />
                        <Route path="/system-maintenance" element={<SystemSettings />} />
                        <Route path="/license-management" element={<SystemSettings />} />
                        <Route path="/integrations" element={<SystemSettings />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
