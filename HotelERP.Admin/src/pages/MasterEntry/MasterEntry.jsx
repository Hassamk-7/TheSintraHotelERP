import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BuildingOfficeIcon,
  MapIcon,
  CurrencyDollarIcon,
  CubeIcon,
  KeyIcon,
  TruckIcon,
  UserGroupIcon,
  UserIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline'

const masterEntryItems = [
  { name: 'Hotel', href: '/master-hotel', icon: BuildingOfficeIcon, description: 'Manage hotel basic information' },
  { name: 'Hotel Plan Master', href: '/hotel-plan-master', icon: MapIcon, description: 'Configure hotel floor plans' },
  { name: 'Currency Master', href: '/currency-master', icon: CurrencyDollarIcon, description: 'Setup currency configurations' },
  
  { name: 'ID Type', href: '/id-type', icon: KeyIcon, description: 'Configure ID document types' },
  { name: 'Supplier Master', href: '/supplier-master', icon: TruckIcon, description: 'Manage supplier information' },
  { name: 'Guest', href: '/master-guest', icon: UserGroupIcon, description: 'Guest master data management' },
  
  { name: 'Hall', href: '/hall', icon: BuildingOfficeIcon, description: 'Manage hall and event spaces' },
  { name: 'Garden', href: '/garden', icon: MapIcon, description: 'Configure garden areas' },
  { name: 'Delivery Person Master', href: '/delivery-person', icon: TruckIcon, description: 'Manage delivery personnel' },
  { name: 'Item Master', href: '/item-master', icon: CubeIcon, description: 'Inventory item master data' },
  { name: 'Other Charges', href: '/other-charges', icon: CurrencyDollarIcon, description: 'Configure miscellaneous charges' },
  { name: 'Table Master', href: '/table-master', icon: CubeIcon, description: 'Restaurant table management' },

  { name: 'Menu Category Master', href: '/menu-category-master', icon: ClipboardDocumentListIcon, description: 'Manage menu categories (Appetizers, Beverages, etc.)' },
  { name: 'Menu Cuisine Master', href: '/menu-cuisine-master', icon: DocumentChartBarIcon, description: 'Manage cuisines (Pakistani, Chinese, etc.)' },
  
]

const MasterEntry = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = masterEntryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">System Configuration</h1>
        <p className="text-blue-100 text-lg">
          Configure and manage all master data for your hotel management system
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search master entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Master Entry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-3 group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-200">
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  )
}

export default MasterEntry;
