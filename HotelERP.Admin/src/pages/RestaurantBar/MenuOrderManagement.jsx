import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  PrinterIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const MenuOrderManagement = () => {
  const [selectedTable, setSelectedTable] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestId, setGuestId] = useState(null)
  const [guestSearch, setGuestSearch] = useState('')
  const [guestSearchResults, setGuestSearchResults] = useState([])
  const [selectedCheckInId, setSelectedCheckInId] = useState('')
  const [activeCheckIns, setActiveCheckIns] = useState([])
  const [rooms, setRooms] = useState([])
  const [hotels, setHotels] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('')
  const [filterByRestaurant, setFilterByRestaurant] = useState(false)
  const [orderItems, setOrderItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [menuShowType, setMenuShowType] = useState('all')
  const [orderType, setOrderType] = useState('Dine-in')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [roomId, setRoomId] = useState('')
  const [selectedHotelId, setSelectedHotelId] = useState(() => {
    const v = localStorage.getItem('selectedHotelId')
    return v ? Number(v) : null
  })
  const [posTaxPercent, setPosTaxPercent] = useState(10)
  const [posServicePercent, setPosServicePercent] = useState(5)
  const [lastOrderId, setLastOrderId] = useState(null)
  const [lastReceiptData, setLastReceiptData] = useState(null)

  const buildReceiptHtml = ({ orderId, items, subTotal, taxAmount, serviceCharge, totalAmount }) => {
    const now = new Date()
    const orderTypeLabel = orderType || 'Dine-in'
    const tableLabel = orderTypeLabel === 'Dine-in' ? (tables.find(t => String(t.id) === String(selectedTable))?.tableNumber || selectedTable || '-') : '-'
    const checkInLabel = selectedCheckInId ? `CheckIn #${selectedCheckInId}` : ''
    const guestLabel = guestName || 'Walk-in'

    const rows = (items || []).map(i => {
      const qty = Number(i.quantity || 0)
      const price = Number(i.price || 0)
      const line = qty * price
      return `
        <tr>
          <td class="name">${String(i.name || '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>
          <td class="qty">${qty}</td>
          <td class="amt">${line.toFixed(0)}</td>
        </tr>
        <tr>
          <td class="muted" colspan="3">${price.toFixed(0)} each</td>
        </tr>
      `
    }).join('')

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Receipt #${orderId}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 12px; 
              margin: 0; 
              padding: 10px; 
              width: 80mm; 
              background: white;
            }
            .center { text-align: center; }
            .title { font-weight: 700; font-size: 16px; margin: 8px 0; }
            .muted { color: #666; font-size: 11px; }
            .hr { border-top: 1px dashed #000; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; margin: 0 auto; }
            td { vertical-align: top; padding: 2px 0; }
            .name { width: 60%; }
            .qty { width: 10%; text-align: right; }
            .amt { width: 30%; text-align: right; }
            .totals td { padding-top: 3px; }
            .bold { font-weight: 700; }
            img { 
              max-width: 50mm; 
              height: auto; 
              display: block;
              margin: 0 auto 10px auto;
            }
            @media print {
              body { padding: 5mm; }
            }
          </style>
        </head>
        <body>
          <div class="center">
            <img src="/logo.png" alt="Hotel Logo" onerror="this.style.display='none'" />
            <div class="title">Hotel ERP</div>
            <div class="muted">Restaurant Receipt</div>
          </div>

          <div class="hr"></div>
          <div><span class="bold">Invoice:</span> #${orderId}</div>
          <div><span class="bold">Date:</span> ${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>
          <div><span class="bold">Type:</span> ${orderTypeLabel}</div>
          <div><span class="bold">Table:</span> ${tableLabel}</div>
          <div><span class="bold">Guest:</span> ${String(guestLabel).replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</div>
          ${checkInLabel ? `<div><span class="bold">${checkInLabel}</span></div>` : ''}
          <div class="hr"></div>

          <table>
            <tr class="bold">
              <td class="name">Item</td>
              <td class="qty">Qty</td>
              <td class="amt">Amt</td>
            </tr>
            ${rows}
          </table>

          <div class="hr"></div>
          <table class="totals">
            <tr><td>Subtotal</td><td class="amt">${Number(subTotal || 0).toFixed(0)}</td></tr>
            <tr><td>Tax (${posTaxPercent}%)</td><td class="amt">${Number(taxAmount || 0).toFixed(0)}</td></tr>
            <tr><td>Service (${posServicePercent}%)</td><td class="amt">${Number(serviceCharge || 0).toFixed(0)}</td></tr>
            <tr class="bold"><td>Total</td><td class="amt">${Number(totalAmount || 0).toFixed(0)}</td></tr>
          </table>

          <div class="hr"></div>
          <div class="center muted">Thank you for your visit</div>
          <script>
            window.onload = () => {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `
  }

  const printThermalReceipt = (data) => {
    try {
      if (!data || !data.items || data.items.length === 0) {
        setError('Cannot print: No items in receipt')
        return
      }
      const html = buildReceiptHtml(data)
      const w = window.open('', '_blank', 'width=400,height=700')
      if (!w) {
        setError('Popup blocked. Please allow popups to print receipt.')
        return
      }
      w.document.open()
      w.document.write(html)
      w.document.close()
    } catch (e) {
      console.error('Print receipt error:', e)
      setError(`Print failed: ${e.message}`)
    }
  }

  const downloadReceiptPdf = async (data) => {
    try {
      if (!data || !data.items || data.items.length === 0) {
        setError('Cannot generate PDF: No items in receipt')
        return
      }

      const html = buildReceiptHtml(data)
      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.left = '-10000px'
      iframe.style.top = '0'
      iframe.style.width = '80mm'
      iframe.style.height = '297mm'
      document.body.appendChild(iframe)

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      iframeDoc.open()
      iframeDoc.write(html)
      iframeDoc.close()

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500))

      const receiptBody = iframeDoc.body
      const canvas = await html2canvas(receiptBody, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ unit: 'mm', format: [80, 297] })

      const imgWidth = 80
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`receipt_${data.orderId}.pdf`)
      
      document.body.removeChild(iframe)
      setSuccess('PDF downloaded successfully!')
    } catch (e) {
      console.error('PDF generation failed', e)
      setError(`Failed to generate PDF: ${e.message}`)
    }
  }
  
  // API Data states
  const [tables, setTables] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load data on component mount
  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    if (!selectedHotelId) return
    fetchRooms()
    fetchActiveCheckIns()
  }, [selectedHotelId])

  useEffect(() => {
    fetchHotels()
  }, [])

  useEffect(() => {
    fetchTablesAndMenu()
  }, [selectedRestaurantId])

  useEffect(() => {
    if (selectedHotelId) {
      localStorage.setItem('selectedHotelId', String(selectedHotelId))
    }
  }, [selectedHotelId])

  const fetchHotels = async () => {
    try {
      const res = await axios.get('/Hotels')
      if (res.data?.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : []
        setHotels(list)

        if (!selectedHotelId && list.length > 0) {
          const firstId = list[0]?.id ?? list[0]?.Id
          if (firstId !== undefined && firstId !== null && String(firstId) !== '') {
            setSelectedHotelId(Number(firstId))
            localStorage.setItem('selectedHotelId', String(firstId))
          }
        }
      } else {
        setHotels([])
      }
    } catch (e) {
      setHotels([])
    }
  }

  const fetchRooms = async () => {
    try {
      if (!selectedHotelId) return
      const res = await axios.get(`/rooms?hotelId=${selectedHotelId}`)
      if (res.data?.success) setRooms(res.data.data || [])
    } catch (e) {
      setRooms([])
    }
  }

  const getCartQtyForItem = (itemId) => {
    return orderItems.reduce((sum, i) => sum + (i.id === itemId ? Number(i.quantity || 0) : 0), 0)
  }

  const getRemainingStockForItem = (item) => {
    const stock = Number(item?.stock)
    if (!Number.isFinite(stock) || stock < 0) return null
    const inCart = getCartQtyForItem(item.id)
    const remaining = stock - inCart
    return remaining < 0 ? 0 : remaining
  }

  const isDrinkItem = (item) => String(item?.id ?? '').startsWith('drink_')

  const filteredMenuItems = menuItems
    .filter(item => {
      if (menuShowType === 'food') return !isDrinkItem(item)
      if (menuShowType === 'drinks') return isDrinkItem(item)
      return true
    })
    .filter(item => {
      if (!selectedRestaurantId) return true
      // drinks have no restaurantId and should still be visible for all restaurants
      if (isDrinkItem(item)) return true
      return String(item.restaurantId ?? '') === String(selectedRestaurantId)
    })
    .filter(item => {
      if (selectedCategory === 'All') return true
      return String(item.category ?? '') === String(selectedCategory)
    })

  const categories = ['All', ...Array.from(new Set(filteredMenuItems.map(i => i.category || 'Other')))]

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('/RestaurantLocation')
      if (Array.isArray(res.data)) {
        const normalized = res.data.map(r => ({
          ...r,
          restaurantID: r.restaurantID ?? r.restaurantId ?? r.id,
          name: r.name ?? r.restaurantName ?? r.restaurant ?? ''
        }))

        // Prevent duplicates: only add a single "All Restaurants" option at the top
        setRestaurants([
          { restaurantID: '', name: 'All Restaurants' },
          ...normalized.filter(r => String(r.restaurantID ?? '') !== '')
        ])
        if (!selectedRestaurantId) setSelectedRestaurantId('')
      }
    } catch (e) {
      setRestaurants([])
    }
  }

  const fetchActiveCheckIns = async () => {
    try {
      // Use the paged check-ins endpoint because it includes GuestId and nested Guest/Room details.
      // /checkins/active does NOT return GuestId, which breaks auto-fill.
      const res = await axios.get('/checkins?status=Active&page=1&pageSize=200')
      if (res.data?.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : []
        const mapped = list.map(ci => {
          const id = ci.id ?? ci.Id
          const checkInNumber = ci.checkInNumber ?? ci.CheckInNumber ?? ''
          const guestId = ci.guestId ?? ci.GuestId ?? ci.guest?.id ?? ci.Guest?.Id ?? null
          const guestName = ci.guestName ?? ci.GuestName ?? ci.guest?.fullName ?? ci.Guest?.FullName ?? ''
          const roomNumber = ci.roomNumber ?? ci.RoomNumber ?? ci.room?.roomNumber ?? ci.Room?.RoomNumber ?? ''
          return {
            id,
            checkInNumber,
            guestId,
            guestName,
            roomNumber
          }
        }).filter(x => x.id !== undefined && x.id !== null)
        setActiveCheckIns(mapped)
      }
    } catch (e) {
      setActiveCheckIns([])
    }
  }

  useEffect(() => {
    const q = guestSearch.trim()
    if (!q || q.length < 2) {
      setGuestSearchResults([])
      return
    }

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`/guests?search=${encodeURIComponent(q)}&page=1&pageSize=10`)
        if (res.data?.success) {
          setGuestSearchResults(res.data.data || [])
        } else {
          setGuestSearchResults([])
        }
      } catch (e) {
        setGuestSearchResults([])
      }
    }, 300)

    return () => clearTimeout(t)
  }, [guestSearch])

  const clearGuestSelection = () => {
    setGuestId(null)
    setGuestName('')
    setGuestSearch('')
    setGuestSearchResults([])
    setSelectedCheckInId('')
  }

  const applyGuestFromCheckIn = (checkInId) => {
    const ci = activeCheckIns.find(x => String(x.id) === String(checkInId))
    if (!ci) return
    setSelectedCheckInId(String(ci.id))
    setGuestName(ci.guestName || '')
    setGuestId(ci.guestId ? Number(ci.guestId) : null)

    if (orderType === 'Room Service') {
      const room = rooms.find(r => String(r.roomNumber) === String(ci.roomNumber))
      if (room?.id) setRoomId(String(room.id))
    }
  }

  // Fetch tables and menu items - PURE API CALLS
  const fetchTablesAndMenu = async () => {
    try {
      setLoading(true)
      setError('')

      const hotelQuery = selectedHotelId ? `?hotelId=${selectedHotelId}` : ''
      
      const [tablesRes, menuRes, drinksMastersRes, drinksPricingsRes] = await Promise.all([
        axios.get(`/tables${hotelQuery}`),
        axios.get('/MenuItem'),
        axios.get('/DrinksMasters'),
        axios.get('/DrinksPricings')
      ])
      
      if (tablesRes.data?.success) setTables(tablesRes.data.data)
      const rawMenu = Array.isArray(menuRes.data) ? menuRes.data : []
      const mapped = (rawMenu || []).map(mi => ({
        id: mi.menuItemID ?? mi.menuItemId ?? mi.id ?? mi.menuId ?? mi.menuID,
        restaurantId: mi.restaurantID ?? mi.restaurantId ?? mi.restaurantID_FK ?? mi.restaurant ?? mi.restaurant_id ?? null,
        name: mi.name ?? '',
        description: mi.description ?? '',
        price: mi.price ?? 0,
        category: mi.category ?? 'Other',
        preparationTime: 0,
        isVegetarian: Boolean(mi.isVegetarian),
        isSpicy: Boolean(mi.isSpicy)
      }))

      const rawMasters = drinksMastersRes?.data?.success ? (drinksMastersRes.data.data || []) : []
      const masters = (rawMasters || []).map(d => ({
        id: d.id ?? d.Id,
        name: d.name ?? d.Name ?? '',
        code: d.code ?? d.Code ?? '',
        description: d.description ?? d.Description ?? '',
        category: d.category ?? d.Category ?? '',
        basePrice: Number(d.price ?? d.Price ?? 0)
      })).filter(d => d.id !== undefined && d.id !== null)

      const rawPricings = drinksPricingsRes?.data?.success ? (drinksPricingsRes.data.data || []) : []
      const pricings = (rawPricings || []).map(p => ({
        id: p.id ?? p.Id,
        drinkMasterId: p.drinksMasterId ?? p.DrinksMasterId,
        quantity: p.quantity ?? p.Quantity ?? '',
        price: Number(p.price ?? p.Price ?? 0),
        itemMasterId: p.itemMasterId ?? p.ItemMasterId
      })).filter(p => p.id !== undefined && p.id !== null)

      // Map stock from ItemMasters if possible
      const uniqueItemMasterIds = Array.from(new Set(pricings.map(p => p.itemMasterId).filter(x => x !== undefined && x !== null)))
      let itemMastersById = {}
      let itemMastersArray = []
      // Even if pricing rows don't have ItemMasterId, we still fetch ItemMasters so we can fallback-match by name.
      if (uniqueItemMasterIds.length || masters.length) {
        try {
          const itemRes = await axios.get('/ItemMasters', { params: { page: 1, pageSize: 5000, search: '' } })
          if (itemRes.data?.success) {
            const list = Array.isArray(itemRes.data.data) ? itemRes.data.data : []
            itemMastersArray = list;
            itemMastersById = Object.fromEntries(list.map(im => [Number(im.id ?? im.Id), im]))
          }
        } catch {
          itemMastersById = {}
        }
      }

      const mappedDrinks = masters.flatMap(m => {
        const drinkId = Number(m.id)
        const base = {
          restaurantId: null,
          barItemId: drinkId,
          description: m.description ?? '',
          category: m.category ? `Drink - ${m.category}` : 'Drink',
          preparationTime: 0,
          isVegetarian: false,
          isSpicy: false,
          isActive: true
        }

        const sizes = pricings.filter(p => Number(p.drinkMasterId) === drinkId)
        if (sizes.length === 0) {
          return [{
            ...base,
            id: `drink_${drinkId}`,
            name: m.name,
            price: Number(m.basePrice ?? 0),
            drinksPricingId: null,
            stock: null
          }]
        }

        return sizes.map(s => {
          let linkedItem = s.itemMasterId ? itemMastersById[Number(s.itemMasterId)] : null;
          if (!linkedItem && Array.isArray(itemMastersArray)) {
            const drinkName = String(m.name ?? '').trim()
            const qty = String(s.quantity ?? '').trim()
            const expectedName = qty ? `${drinkName} (${qty})` : drinkName

            // Prefer exact match to the backend's ItemMaster naming convention
            linkedItem =
              itemMastersArray.find(im => String(im.name ?? im.Name ?? '').trim().toLowerCase() === expectedName.toLowerCase()) ||
              // Fallback: contains match by expected name (still relatively strict)
              itemMastersArray.find(im => String(im.name ?? im.Name ?? '').toLowerCase().includes(expectedName.toLowerCase())) ||
              // Final fallback: contains match by drink name only
              itemMastersArray.find(im => String(im.name ?? im.Name ?? '').toLowerCase().includes(drinkName.toLowerCase())) ||
              null;
          }
          const rawStock = linkedItem ? Number(
            linkedItem.currentStock ??
            linkedItem.CurrentStock ??
            linkedItem.stockQuantity ??
            linkedItem.StockQuantity) : null
          const finalStock = Number.isFinite(rawStock) ? rawStock : null
          return {
            ...base,
            id: `drink_${drinkId}_${s.id}`,
            name: `${m.name} (${s.quantity})`,
            price: Number(s.price ?? 0),
            drinksPricingId: Number(s.id),
            stock: finalStock
          }
        })
      })

      const merged = [...mapped, ...mappedDrinks]
      const uniqueById = Array.from(new Map(merged.map(x => [String(x.id), x])).values())

      // Store full list; filtering is applied at render-time based on selectedRestaurantId
      setMenuItems(uniqueById)
      
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load tables and menu items')
      setTables([])
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  // Add item to order
  const addToOrder = (item) => {
    const normalizedId = item?.id
    if (normalizedId === undefined || normalizedId === null || normalizedId === '') return

    const remaining = getRemainingStockForItem(item)
    if (remaining !== null && remaining <= 0) {
      setError('Insufficient stock. Available: 0')
      return
    }

    const existing = orderItems.find(i => i.id === item.id)
    if (existing) {
      const nextQty = Number(existing.quantity || 0) + 1
      const maxStock = Number(item.stock)
      if (Number.isFinite(maxStock) && maxStock >= 0 && nextQty > maxStock) {
        const available = getRemainingStockForItem(item)
        setError(`Insufficient stock. Available: ${available ?? maxStock}`)
        return
      }
      setOrderItems(orderItems.map(i =>
        i.id === item.id
          ? {
              ...i,
              quantity: nextQty,
              total: nextQty * Number(i.price || 0)
            }
          : i
      ))
    } else {
      const price = Number(item.price || 0)
      const maxStock = Number(item.stock)
      if (Number.isFinite(maxStock) && maxStock >= 0 && 1 > maxStock) {
        setError(`Insufficient stock. Available: ${maxStock}`)
        return
      }
      setOrderItems([...orderItems, { ...item, price, quantity: 1, total: price }])
    }
  }

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(itemId)
    } else {
      const current = orderItems.find(i => i.id === itemId)
      const maxStock = Number(current?.stock)
      if (Number.isFinite(maxStock) && maxStock >= 0 && Number(newQuantity || 0) > maxStock) {
        const available = typeof current === 'object' && current ? getRemainingStockForItem(current) : maxStock
        setError(`Insufficient stock. Available: ${available ?? maxStock}`)
        return
      }
      setOrderItems(orderItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity: Number(newQuantity || 0),
              total: Number(newQuantity || 0) * Number(item.price || 0)
            }
          : item
      ))
    }
  }

  // Remove item from order
  const removeFromOrder = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId))
  }

  // Calculate totals
  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => {
      const line = Number(item?.price || 0) * Number(item?.quantity || 0)
      return sum + (Number.isFinite(line) ? line : 0)
    }, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * (posTaxPercent / 100)
  }

  const calculateServiceCharge = () => {
    return calculateSubtotal() * (posServicePercent / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateServiceCharge()
  }

  const normalizeMoney = (v) => {
    const n = Number(v)
    if (Number.isNaN(n)) return 0
    return Math.round(n * 100) / 100
  }

  // Submit order - PURE API CALL
  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      setError('Please add items to the order')
      return
    }

    const computedSubTotal = normalizeMoney(calculateSubtotal())
    const computedTax = normalizeMoney(computedSubTotal * (posTaxPercent / 100))
    const computedService = normalizeMoney(computedSubTotal * (posServicePercent / 100))
    const computedTotal = normalizeMoney(computedSubTotal + computedTax + computedService)

    if (computedTotal <= 0) {
      setError('Total amount must be greater than 0')
      return
    }

    if (orderType === 'Dine-in' && !selectedTable) {
      setError('Please select a table for dine-in orders')
      return
    }

    if (orderType === 'Room Service' && !roomId) {
      setError('Please enter a room id for room service orders')
      return
    }

    if (orderType === 'Delivery' && !deliveryAddress.trim()) {
      setError('Please enter a delivery address')
      return
    }

    try {
      setLoading(true)
      const orderData = {
        hotelId: selectedHotelId,
        tableId: orderType === 'Dine-in' ? Number(selectedTable) : null,
        roomId: orderType === 'Room Service' ? Number(roomId) : null,
        guestId: guestId ? Number(guestId) : null,
        checkInId: selectedCheckInId ? Number(selectedCheckInId) : null,
        orderType: orderType,
        guestName: guestName || null,
        specialInstructions: [guestName ? `Guest: ${guestName}` : null, orderType === 'Delivery' ? `Address: ${deliveryAddress}` : null]
          .filter(Boolean)
          .join(' | '),
        subTotal: computedSubTotal,
        taxAmount: computedTax,
        serviceCharge: computedService,
        totalAmount: computedTotal,
        status: 'Pending',
        paymentStatus: 'Pending'
      }

      const response = await axios.post('/RestaurantBar/restaurant-orders', orderData)
      
      const createdOrderId = response.data?.data?.id
      if (!response.data?.success || !createdOrderId) {
        setError('Failed to place order')
        return
      }

      for (const item of orderItems) {
        const itemIdStr = String(item.id)
        const isDrink = itemIdStr.startsWith('drink_')
        const barItemId = isDrink ? Number(item.barItemId ?? String(itemIdStr.split('_')[1])) : null
        const menuItemId = !isDrink ? Number(item.id) : null

        const payload = {
          orderId: createdOrderId,
          menuItemId: Number.isFinite(menuItemId) ? menuItemId : null,
          barItemId: Number.isFinite(barItemId) ? barItemId : null,
          drinksPricingId: isDrink && item.drinksPricingId ? Number(item.drinksPricingId) : null,
          quantity: item.quantity,
          unitPrice: item.price
        }

        if (import.meta.env.MODE === 'development') {
          console.log('[PlaceOrder] posting order item', {
            name: item.name,
            rawId: item.id,
            isDrink,
            payload
          })
        }

        await axios.post('/RestaurantBar/order-items', payload)
      }

      // Refresh menu data to reflect stock deduction
      await fetchTablesAndMenu()

      // Save receipt data BEFORE resetting form (so items are preserved)
      const receiptData = {
        orderId: createdOrderId,
        items: orderItems.map(i => ({ ...i })), // clone items
        subTotal: computedSubTotal,
        taxAmount: computedTax,
        serviceCharge: computedService,
        totalAmount: computedTotal
      }

      setLastOrderId(createdOrderId)
      setLastReceiptData(receiptData)
      setError('') // Clear any previous errors
      setSuccess(`Order placed successfully! (Order #${createdOrderId})`)

      // Auto-print thermal receipt (80mm)
      setTimeout(() => printThermalReceipt(receiptData), 300)

      // Reset form
      setOrderItems([])
      setSelectedTable('')
      clearGuestSelection()
      setDeliveryAddress('')
      setRoomId('')
    } catch (err) {
      console.error('Error placing order:', err)
      const apiMsg = err.response?.data?.message || 'Failed to place order'
      setError(apiMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseBill = async () => {
    if (!lastOrderId) {
      setError('No recent order to close')
      return
    }
    try {
      setLoading(true)
      const res = await axios.put(`/RestaurantBar/restaurant-orders/${lastOrderId}/status`, 'Completed')
      if (res.data?.success) {
        setSuccess('Bill closed successfully')
        setLastOrderId(null)
        fetchTablesAndMenu()
      } else {
        setError('Failed to close bill')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close bill')
    } finally {
      setLoading(false)
    }
  }

  // Filter menu items by category
  const [menuSearch, setMenuSearch] = useState('')
  const [quickAddSearch, setQuickAddSearch] = useState('')
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  const quickAddResults = (() => {
    const q = quickAddSearch.trim().toLowerCase()
    if (!q) return []
    const baseList = (menuItems || []).filter(i => {
      if (menuShowType === 'food') return !isDrinkItem(i)
      if (menuShowType === 'drinks') return isDrinkItem(i)
      return true
    })
    return baseList
      .filter(i => {
        const name = String(i.name || '').toLowerCase()
        const category = String(i.category || '').toLowerCase()
        const desc = String(i.description || '').toLowerCase()
        return name.includes(q) || category.includes(q) || desc.includes(q)
      })
      .slice(0, 8)
  })()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingCartIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Menu Order Management</h1>
              <p className="text-gray-600">Take orders and manage restaurant menu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Menu Items</h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setMenuShowType('all')}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${menuShowType === 'all' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuShowType('food')}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${menuShowType === 'food' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    Food Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuShowType('drinks')}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${menuShowType === 'drinks' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    Drinks Only
                  </button>
                </div>
                <select
                  value={selectedRestaurantId}
                  onChange={(e) => {
                    setSelectedRestaurantId(e.target.value)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {restaurants.map(r => (
                    <option key={String(r.restaurantID)} value={String(r.restaurantID)}>{r.name}</option>
                  ))}
                </select>
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={filterByRestaurant}
                    onChange={(e) => setFilterByRestaurant(e.target.checked)}
                  />
                  <span>Filter by restaurant</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Search menu items..."
                />
              </div>

              <div className="mt-3">
                <div className="relative">
                  <input
                    type="text"
                    value={quickAddSearch}
                    onChange={(e) => {
                      setQuickAddSearch(e.target.value)
                      setQuickAddOpen(true)
                    }}
                    onFocus={() => setQuickAddOpen(true)}
                    onBlur={() => setTimeout(() => setQuickAddOpen(false), 150)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Quick add (search name/category/description)..."
                  />

                  {quickAddOpen && quickAddResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {quickAddResults.map(mi => (
                        <button
                          key={String(mi.id)}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            addToOrder(mi)
                            setQuickAddSearch('')
                            setQuickAddOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <div className="text-sm font-medium text-gray-900">{mi.name}</div>
                          <div className="text-xs text-gray-500">{mi.category} • Rs {Number(mi.price || 0).toLocaleString()}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {filteredMenuItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No menu items available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMenuItems
                    .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
                    .filter(item => item.name.toLowerCase().includes(menuSearch.toLowerCase()))
                    .map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                            <div className="flex items-center space-x-2 mb-2">
                              {!isDrinkItem(item) && item.isVegetarian && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Vegetarian</span>
                              )}
                              {!isDrinkItem(item) && item.isSpicy && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Spicy</span>
                              )}
                              {isDrinkItem(item) && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Active</span>
                              )}
                            </div>

                            {isDrinkItem(item) && getRemainingStockForItem(item) !== null && (
                              <div className="text-xs text-gray-600">
                                Stock: {getRemainingStockForItem(item)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold text-green-600">Rs {item.price?.toLocaleString()}</p>
                              <p className="text-xs text-gray-500 flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {item.preparationTime} min
                              </p>
                            </div>
                            <button
                              onClick={() => addToOrder(item)}
                              disabled={isDrinkItem(item) && getRemainingStockForItem(item) !== null && getRemainingStockForItem(item) <= 0}
                              className="ml-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                            >
                              <PlusIcon className="h-4 w-4" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Dine-in">Dine-in</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Room Service">Room Service</option>
                  </select>
                </div>
              </div>

              {/* Table and Guest Selection */}
              <div className="space-y-4 mb-6">
                {orderType === 'Dine-in' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Table</label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a table</option>
                    {tables.map(table => (
                      <option key={table.id} value={table.id}>
                        {table.tableNumber} - {table.location} ({table.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {orderType === 'Delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter delivery address"
                    />
                  </div>
                )}

                {orderType === 'Room Service' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Id</label>
                    <input
                      type="number"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter room id"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter guest name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Search</label>
                  <input
                    type="text"
                    value={guestSearch}
                    onChange={(e) => setGuestSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search guest (name/phone/email)"
                  />
                  {guestSearchResults.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg max-h-44 overflow-y-auto">
                      {guestSearchResults.map(g => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setGuestId(g.id)
                            setGuestName(g.fullName || '')
                            setSelectedCheckInId('')
                            setGuestSearchResults([])
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <div className="text-sm font-medium text-gray-900">{g.fullName}</div>
                          <div className="text-xs text-gray-500">{g.phoneNumber || ''}{g.email ? ` • ${g.email}` : ''}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Active Check-In (Auto-fill)</label>
                  <select
                    value={selectedCheckInId}
                    onChange={(e) => {
                      const v = e.target.value
                      if (!v) {
                        setSelectedCheckInId('')
                        return
                      }
                      applyGuestFromCheckIn(v)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select active check-in</option>
                    {activeCheckIns.map(ci => (
                      <option key={ci.id} value={ci.id}>
                        {ci.checkInNumber} - {ci.guestName} (Room {ci.roomNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {(guestId || selectedCheckInId || guestName) && (
                  <button
                    type="button"
                    onClick={clearGuestSelection}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
                  >
                    Clear Guest Selection
                  </button>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {orderItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No items in order</p>
                ) : (
                  orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Rs {item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromOrder(item.id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Order Totals */}
              {orderItems.length > 0 && (
                <div className="space-y-2 mb-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>Rs {calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({posTaxPercent}%):</span>
                    <span>Rs {calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Charge ({posServicePercent}%):</span>
                    <span>Rs {calculateServiceCharge().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>Rs {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSubmitOrder}
                  disabled={loading || orderItems.length === 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CurrencyDollarIcon className="h-5 w-5" />
                  <span>Place Order</span>
                </button>

                {lastOrderId && (
                  <div className="space-y-3">
                    <button
                      onClick={handleCloseBill}
                      disabled={loading}
                      className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Close Bill (Order #{lastOrderId})</span>
                    </button>

                    <button
                      onClick={() => lastReceiptData && printThermalReceipt(lastReceiptData)}
                      disabled={loading || !lastReceiptData}
                      className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <PrinterIcon className="h-5 w-5" />
                      <span>Print Receipt</span>
                    </button>

                    <button
                      onClick={() => lastReceiptData && downloadReceiptPdf(lastReceiptData)}
                      disabled={loading || !lastReceiptData}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    setOrderItems([])
                    setSelectedTable('')
                    setGuestName('')
                    setError('')
                    setSuccess('')
                  }}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Clear Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuOrderManagement;
