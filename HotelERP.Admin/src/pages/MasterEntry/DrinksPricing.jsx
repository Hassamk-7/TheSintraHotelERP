import { useEffect, useMemo, useState } from 'react'
import axios from '../../utils/axios.js'
import {
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'

const DrinksPricing = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    drinksMasterId: '',
    quantitySize: '',
    price: '',
    costPrice: '',
    profitMargin: '',
    isActive: true
  })

  const [pricings, setPricings] = useState([])
  const [drinks, setDrinks] = useState([])
  const [quantityOptions, setQuantityOptions] = useState([])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)

      const [pricingRes, drinksRes, qtyRes] = await Promise.all([
        axios.get('/DrinksPricings'),
        axios.get('/DrinksMasters'),
        axios.get('/DrinksQuantities')
      ])

      const pricingData = pricingRes?.data?.data
      const rawPricings = Array.isArray(pricingData) ? pricingData : []
      const normalizedPricings = rawPricings.map((p) => ({
        ...p,
        id: p.id ?? p.Id,
        drinkName: p.drinkName ?? p.DrinkName,
        drinkCode: p.drinkCode ?? p.DrinkCode,
        quantity: p.quantity ?? p.Quantity,
        price: p.price ?? p.Price,
        costPrice: p.costPrice ?? p.CostPrice,
        itemMasterId: p.itemMasterId ?? p.ItemMasterId,
        isActive: p.isActive ?? p.IsActive
      }))
      setPricings(normalizedPricings)

      const drinksData = drinksRes?.data?.data
      const rawDrinks = Array.isArray(drinksData) ? drinksData : []
      setDrinks(
        rawDrinks.map((d) => ({
          ...d,
          id: d.id ?? d.Id,
          drinkName: d.name ?? d.Name ?? d.drinkName ?? d.DrinkName,
          drinkCode: d.code ?? d.Code ?? d.drinkCode ?? d.DrinkCode
        }))
      )

      const qData = qtyRes?.data?.data
      const qList = Array.isArray(qData) ? qData : []
      setQuantityOptions(
        qList
          .map((q) => q.quantityName || q.quantity || q.name)
          .filter(Boolean)
      )
    } catch (error) {
      console.error('Error loading drinks pricing data:', error)
      setPricings([])
      setDrinks([])
      setQuantityOptions([])
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!String(formData.drinksMasterId || '').trim()) newErrors.drinksMasterId = 'Drink is required'
    if (!formData.quantitySize?.trim()) newErrors.quantitySize = 'Quantity/size is required'

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid selling price is required'
    }

    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = 'Valid cost price is required'
    }

    if (parseFloat(formData.price) <= parseFloat(formData.costPrice)) {
      newErrors.price = 'Selling price must be higher than cost price'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateProfitMargin = (price, costPrice) => {
    if (price && costPrice && parseFloat(price) > 0 && parseFloat(costPrice) > 0) {
      return (((parseFloat(price) - parseFloat(costPrice)) / parseFloat(price)) * 100).toFixed(2)
    }
    return 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        drinksMasterId: Number(formData.drinksMasterId),
        quantity: formData.quantitySize,
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice),
        priceCategory: null,
        isHappyHourPrice: false,
        happyHourPrice: 0,
        effectiveFrom: null,
        effectiveTo: null,
        isActive: formData.isActive !== false
      }

      if (editingId) {
        await axios.put(`/DrinksPricings/${editingId}`, payload)
      } else {
        await axios.post('/DrinksPricings', payload)
      }

      await fetchInitialData()
      handleCancel()
      alert(editingId ? 'Drinks pricing updated successfully!' : 'Drinks pricing created successfully!')
    } catch (error) {
      console.error('Error saving drinks pricing:', error)
      alert(`Error saving drinks pricing: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (pricing) => {
    setFormData({
      drinksMasterId: (pricing.drinksMasterId ?? pricing.DrinksMasterId ?? '').toString(),
      quantitySize: pricing.quantity || '',
      price: (pricing.price ?? '').toString(),
      costPrice: (pricing.costPrice ?? '').toString(),
      profitMargin: calculateProfitMargin(pricing.price, pricing.costPrice).toString(),
      isActive: pricing.isActive !== false
    })
    setEditingId(pricing.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pricing?')) {
      try {
        setLoading(true)
        await axios.delete(`/DrinksPricings/${id}`)
        await fetchInitialData()
        alert('Drinks pricing deleted successfully!')
      } catch (error) {
        console.error('Error deleting drinks pricing:', error)
        alert(`Error deleting drinks pricing: ${error.response?.data?.message || error.message}`)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      drinkName: '',
      drinkCode: '',
      quantitySize: '',
      price: '',
      costPrice: '',
      profitMargin: '',
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const filteredPricings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return pricings

    return pricings.filter((pricing) => {
      const dn = (pricing.drinkName || '').toLowerCase()
      const dc = (pricing.drinkCode || '').toLowerCase()
      const qt = (pricing.quantity || '').toLowerCase()
      return dn.includes(term) || dc.includes(term) || qt.includes(term)
    })
  }, [pricings, searchTerm])

  const avgProfit = useMemo(() => {
    if (!pricings.length) return 0
    const sum = pricings.reduce((acc, p) => {
      const pm = parseFloat(calculateProfitMargin(p.price, p.costPrice))
      return acc + (isNaN(pm) ? 0 : pm)
    }, 0)
    return Math.round(sum / pricings.length)
  }, [pricings])

  const handleDrinkSelect = (drinksMasterId) => {
    setFormData((prev) => ({
      ...prev,
      drinksMasterId
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Drinks Pricing</h1>
            <p className="text-rose-100">Manage drink prices by quantity and size</p>
          </div>
          <CurrencyDollarIcon className="h-12 w-12 text-rose-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-rose-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-rose-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pricings</p>
              <p className="text-2xl font-bold text-gray-900">{pricings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Profit</p>
              <p className="text-2xl font-bold text-gray-900">
                {avgProfit}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ScaleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {pricings.length ? Math.round(pricings.reduce((sum, p) => sum + (p.price || 0), 0) / pricings.length) : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Highest Price</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {pricings.length ? Math.max(...pricings.map(p => p.price || 0)) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pricings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        
        <button
          onClick={() => {
            handleCancel()
            setShowForm(true)
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Pricing
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Drinks Pricing' : 'Add New Drinks Pricing'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Drink Name
                </label>
                <select
                  value={formData.drinksMasterId}
                  onChange={(e) => handleDrinkSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                >
                  <option value="">Select drink</option>
                  {drinks.map((drink) => (
                    <option key={drink.id} value={drink.id}>
                      {drink.drinkName} ({drink.drinkCode})
                    </option>
                  ))}
                </select>
                {errors.drinksMasterId && (
                  <p className="mt-1 text-sm text-red-600">{errors.drinksMasterId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity Size
                </label>
                <select
                  value={formData.quantitySize}
                  onChange={(e) => setFormData({...formData, quantitySize: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                >
                  <option value="">Select size</option>
                  {quantityOptions.map(quantity => (
                    <option key={quantity} value={quantity}>{quantity}</option>
                  ))}
                </select>
                {errors.quantitySize && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantitySize}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cost Price (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => {
                    const newCostPrice = e.target.value
                    setFormData({
                      ...formData, 
                      costPrice: newCostPrice,
                      profitMargin: calculateProfitMargin(formData.price, newCostPrice)
                    })
                  }}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors ${
                    errors.costPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter cost price"
                />
                {errors.costPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.costPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selling Price (Rs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const newPrice = e.target.value
                    setFormData({
                      ...formData, 
                      price: newPrice,
                      profitMargin: calculateProfitMargin(newPrice, formData.costPrice)
                    })
                  }}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter selling price"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profit Margin (%)
                </label>
                <input
                  type="text"
                  value={calculateProfitMargin(formData.price, formData.costPrice)}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="Auto calculated"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pricings List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Drinks Pricing ({filteredPricings.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drink & Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPricings.map((pricing) => (
                <tr key={pricing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pricing.drinkName}</div>
                      <div className="text-sm text-gray-500">{pricing.quantity}</div>
                      {pricing.itemMasterId ? (
                        <div className="text-xs text-gray-400">Stock Item ID: {pricing.itemMasterId}</div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Rs {(pricing.costPrice || 0).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Rs {(pricing.price || 0).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const profitMargin = parseFloat(calculateProfitMargin(pricing.price, pricing.costPrice))
                      return (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profitMargin >= 40 ? 'bg-green-100 text-green-800' :
                      profitMargin >= 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {isNaN(profitMargin) ? 0 : profitMargin}%
                    </span>
                      )
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      pricing.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pricing.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(pricing)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pricing.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPricings.length === 0 && (
            <div className="text-center py-12">
              <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pricings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new pricing.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DrinksPricing;
