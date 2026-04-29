import React, { useState, useEffect, useMemo } from 'react';
import axios from '../../utils/axios.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BuildingStorefrontIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const RestaurantBillingReport = () => {
  const [filters, setFilters] = useState({
    billType: '',
    paymentMethod: '',
    tableType: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' }
  })

  const [billingRecords, setBillingRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceError, setInvoiceError] = useState('')
  const [invoiceData, setInvoiceData] = useState(null)

  const buildReceiptHtml = (inv) => {
    const now = new Date(inv?.orderDate || Date.now())
    const items = inv?.items || []
    const rows = items.map(i => {
      const qty = Number(i.quantity || 0)
      const price = Number(i.unitPrice || 0)
      const line = Number(i.lineTotal || (qty * price) || 0)
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
          <title>Receipt #${inv?.id ?? ''}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 8px; width: 80mm; }
            .center { text-align: center; }
            .title { font-weight: 700; font-size: 14px; margin: 6px 0; }
            .muted { color: #666; font-size: 11px; }
            .hr { border-top: 1px dashed #000; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; }
            td { vertical-align: top; padding: 2px 0; }
            .name { width: 60%; }
            .qty { width: 10%; text-align: right; }
            .amt { width: 30%; text-align: right; }
            .totals td { padding-top: 3px; }
            .bold { font-weight: 700; }
            img { max-width: 60mm; height: auto; }
          </style>
        </head>
        <body>
          <div class="center">
            <img src="/logo.png" alt="Hotel Logo" />
            <div class="title">Hotel ERP</div>
            <div class="muted">Restaurant Receipt</div>
          </div>

          <div class="hr"></div>
          <div><span class="bold">Invoice:</span> #${inv?.id ?? ''}</div>
          <div><span class="bold">Order No:</span> ${inv?.orderNo ?? ''}</div>
          <div><span class="bold">Date:</span> ${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>
          <div><span class="bold">Type:</span> ${inv?.orderType ?? '-'}</div>
          <div><span class="bold">Table:</span> ${inv?.tableNumber ?? '-'}</div>
          <div><span class="bold">Room:</span> ${inv?.roomNumber ?? '-'}</div>
          <div><span class="bold">Guest:</span> ${String(inv?.guestName || 'Walk-in').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</div>
          ${inv?.checkInId ? `<div><span class="bold">CheckIn #${inv.checkInId}</span></div>` : ''}
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
            <tr><td>Subtotal</td><td class="amt">${Number(inv?.subTotal || 0).toFixed(0)}</td></tr>
            <tr><td>Tax</td><td class="amt">${Number(inv?.taxAmount || 0).toFixed(0)}</td></tr>
            <tr><td>Service</td><td class="amt">${Number(inv?.serviceCharge || 0).toFixed(0)}</td></tr>
            <tr class="bold"><td>Total</td><td class="amt">${Number(inv?.totalAmount || 0).toFixed(0)}</td></tr>
          </table>

          <div class="hr"></div>
          <div class="center muted">Thank you for your visit</div>
        </body>
      </html>
    `
  }

  const printInvoice = (inv) => {
    const html = buildReceiptHtml(inv)
    const w = window.open('', '_blank', 'width=400,height=700')
    if (!w) {
      setInvoiceError('Popup blocked. Please allow popups to print receipt.')
      return
    }
    w.document.open()
    w.document.write(html)
    w.document.close()
    w.onload = () => {
      w.focus()
      w.print()
    }
  }

  const downloadInvoicePdf = async (inv) => {
    try {
      const html = buildReceiptHtml(inv)
      const wrap = document.createElement('div')
      wrap.style.position = 'fixed'
      wrap.style.left = '-10000px'
      wrap.style.top = '0'
      wrap.innerHTML = html
      document.body.appendChild(wrap)
      const receiptBody = wrap.querySelector('body')
      const canvas = await html2canvas(receiptBody, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ unit: 'mm', format: [80, 200] })
      const imgWidth = 80
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`restaurant_invoice_${inv?.id ?? 'order'}.pdf`)
      document.body.removeChild(wrap)
    } catch (e) {
      console.error('Invoice PDF generation failed', e)
      setInvoiceError('Failed to generate PDF')
    }
  }

  const openInvoice = async (orderId) => {
    setInvoiceOpen(true)
    setInvoiceLoading(true)
    setInvoiceError('')
    setInvoiceData(null)
    try {
      const resp = await axios.get(`/Reports/restaurant-invoice/${orderId}`)
      const inv = resp?.data?.data
      setInvoiceData(inv)
    } catch (e) {
      console.error('Failed to load invoice', e)
      setInvoiceError(e?.response?.data?.message || 'Failed to load invoice')
    } finally {
      setInvoiceLoading(false)
    }
  }

  const billTypes = ['All Types', 'Dine-in', 'Room Service', 'Takeaway']
  const paymentMethods = ['All Methods', 'Cash', 'Credit Card', 'Corporate Account', 'Room Charge']

  const fetchBilling = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (filters.dateRange.start) params.append('dateFrom', filters.dateRange.start)
      if (filters.dateRange.end) params.append('dateTo', filters.dateRange.end)
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod)

      const res = await axios.get(`/Reports/restaurant-billing-report?${params.toString()}`)
      if (res.data?.success) {
        setBillingRecords(res.data.data || [])
      } else {
        setBillingRecords([])
        setError('Failed to load restaurant billing report')
      }
    } catch (err) {
      console.error('Error loading restaurant billing report:', err)
      setBillingRecords([])
      setError(err.response?.data?.message || 'Failed to load restaurant billing report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBilling()
  }, [filters.dateRange.start, filters.dateRange.end, filters.paymentMethod])

  const filteredRecords = billingRecords.map((o) => {
    const orderDate = o?.orderDate ? new Date(o.orderDate) : null
    const billDate = orderDate && !Number.isNaN(orderDate.getTime()) ? orderDate.toISOString().split('T')[0] : ''
    const billTime = orderDate && !Number.isNaN(orderDate.getTime()) ? orderDate.toLocaleTimeString() : ''

    const billType = o?.orderType || o?.billType || o?.status || ''

    return {
      id: o.id,
      billId: o.orderNo,
      billDate,
      billTime,
      tableNumber: o.tableNumber,
      tableType: o.status,
      guestName: o.guestName,
      guestCount: null,
      waiterName: '',
      items: [],
      itemCount: Number(o?.itemCount) || 0,
      subtotal: o.subTotal || 0,
      discount: 0,
      serviceCharge: o.serviceCharge || 0,
      tax: o.taxAmount || 0,
      totalAmount: o.totalAmount || 0,
      paymentMethod: o.paymentMethod || '',
      paymentStatus: o.paymentStatus || '',
      billType,
      specialRequests: '',
      customerRating: 0,
      feedback: ''
    }
  })

  const getBillTypeColor = (billType) => {
    switch (billType) {
      case 'Dine-in': return 'bg-blue-100 text-blue-800'
      case 'Room Service': return 'bg-green-100 text-green-800'
      case 'Takeaway': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Charged': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    const v = Number(amount)
    if (!Number.isFinite(v)) return 'Rs 0'
    return `Rs ${v.toLocaleString()}`
  }

  const exportReport = () => {
    alert(`Exporting restaurant billing report with ${filteredRecords.length} bills...`)
  }

  const printReport = () => {
    window.print()
  }

  // Calculate statistics
  const totalBills = filteredRecords.length
  const totalRevenue = filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0)
  const averageBillValue = totalBills > 0 ? totalRevenue / totalBills : 0
  const averageRating = filteredRecords.length > 0 ? filteredRecords.reduce((sum, r) => sum + r.customerRating, 0) / filteredRecords.length : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Restaurant Billing Report</h1>
            <p className="text-green-100">Track restaurant sales, payments, and customer satisfaction</p>
          </div>
          <BuildingStorefrontIcon className="h-12 w-12 text-green-200" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading restaurant billing report...</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Report Filters
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={printReport}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bill Type</label>
            <select
              value={filters.billType}
              onChange={(e) => setFilters({...filters, billType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {billTypes.map(type => (
                <option key={type} value={type === 'All Types' ? '' : type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {paymentMethods.map(method => (
                <option key={method} value={method === 'All Methods' ? '' : method}>{method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{totalBills}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <BuildingStorefrontIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Bill Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageBillValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <UserIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">★ {averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Records Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Restaurant Bills ({filteredRecords.length} bills)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest & Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.billId}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {record.billDate} {record.billTime}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBillTypeColor(record.billType)}`}>
                        {record.billType}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{record.tableNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <UserIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.guestName}</div>
                        <div className="text-sm text-gray-500">{record.guestCount ?? '-'} guests</div>
                        <div className="text-sm text-blue-600">By: {record.waiterName}</div>
                        <div className="text-sm text-yellow-600">★ {record.customerRating}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {record.itemCount} items
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">Subtotal: {formatCurrency(record.subtotal)}</div>
                      {record.discount > 0 && (
                        <div className="text-sm text-green-600">Discount: -{formatCurrency(record.discount)}</div>
                      )}
                      <div className="text-sm text-gray-500">Service: {formatCurrency(record.serviceCharge)}</div>
                      <div className="text-sm text-gray-500">Tax: {formatCurrency(record.tax)}</div>
                      <div className="text-sm font-medium text-green-600">Total: {formatCurrency(record.totalAmount)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{record.paymentMethod}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(record.paymentStatus)}`}>
                        {record.paymentStatus}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => openInvoice(record.id)}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoiceOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setInvoiceOpen(false)} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="font-semibold text-gray-900">Restaurant Invoice</div>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setInvoiceOpen(false)}
                  >
                    <XCircleIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-4">
                  {invoiceError && (
                    <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
                      {invoiceError}
                    </div>
                  )}

                  {invoiceLoading && (
                    <div className="text-sm text-gray-600">Loading invoice...</div>
                  )}

                  {!invoiceLoading && invoiceData && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Invoice #</div>
                          <div className="text-lg font-semibold text-gray-900">{invoiceData.id}</div>
                          <div className="text-sm text-gray-600">{invoiceData.guestName}</div>
                          <div className="text-sm text-gray-600">{invoiceData.orderType} {invoiceData.tableNumber ? `• Table ${invoiceData.tableNumber}` : ''}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => printInvoice(invoiceData)}
                            className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-black text-sm flex items-center"
                          >
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Print
                          </button>
                          <button
                            onClick={() => downloadInvoicePdf(invoiceData)}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center"
                          >
                            <DocumentTextIcon className="h-4 w-4 mr-2" />
                            PDF
                          </button>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden">
                        <div className="p-3 bg-gray-50 text-sm font-medium text-gray-700">Items</div>
                        <div className="p-3 space-y-2">
                          {(invoiceData.items || []).map((it) => (
                            <div key={it.id} className="flex items-start justify-between text-sm">
                              <div>
                                <div className="font-medium text-gray-900">{it.name}</div>
                                <div className="text-gray-500">{it.quantity} x {formatCurrency(it.unitPrice)}</div>
                              </div>
                              <div className="font-medium text-gray-900">{formatCurrency(it.lineTotal)}</div>
                            </div>
                          ))}
                          <div className="pt-3 border-t border-gray-200 space-y-1 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(invoiceData.subTotal)}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatCurrency(invoiceData.taxAmount)}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Service</span><span>{formatCurrency(invoiceData.serviceCharge)}</span></div>
                            <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(invoiceData.totalAmount)}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No billing records found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantBillingReport;
