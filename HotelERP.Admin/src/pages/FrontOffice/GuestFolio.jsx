import { useState, useEffect, useCallback } from 'react'
import axios from '../../utils/axios.js'
import jsPDF from 'jspdf'
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PrinterIcon,
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

const GuestFolio = () => {
  // State
  const [activeCheckIns, setActiveCheckIns] = useState([])
  const [selectedCheckIn, setSelectedCheckIn] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [chargeItems, setChargeItems] = useState([])
  const [paymentAccounts, setPaymentAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('charges') // charges, receipts

  // Modal states
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showBillModal, setShowBillModal] = useState(false)

  // Charge form
  const [chargeForm, setChargeForm] = useState({
    chargeItemCode: '',
    description: '',
    source: '',
    quantity: 1,
    amount: '',
    taxAmount: '',
    transactionDate: new Date().toISOString().split('T')[0],
    remarks: ''
  })

  // Receipt form
  const [receiptForm, setReceiptForm] = useState({
    paymentAccountCode: '',
    description: '',
    source: '',
    amount: '',
    memo: '',
    transactionDate: new Date().toISOString().split('T')[0],
    remarks: ''
  })

  // Transfer form
  const [transferForm, setTransferForm] = useState({
    toCheckInId: '',
    amount: ''
  })

  // Bill data
  const [billData, setBillData] = useState(null)

  // Load initial data
  useEffect(() => {
    fetchActiveCheckIns()
    fetchChargeItems()
    fetchPaymentAccounts()
  }, [])

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => { setError(''); setSuccess('') }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const fetchActiveCheckIns = async () => {
    try {
      const res = await axios.get('/guestfolios/active-checkins')
      if (res.data?.success) setActiveCheckIns(res.data.data || [])
    } catch (err) {
      console.error('Error fetching active check-ins:', err)
    }
  }

  const fetchChargeItems = async () => {
    try {
      const res = await axios.get('/guestfolios/charge-items')
      if (res.data?.success) setChargeItems(res.data.data || [])
    } catch (err) {
      console.error('Error fetching charge items:', err)
    }
  }

  const fetchPaymentAccounts = async () => {
    try {
      const res = await axios.get('/guestfolios/payment-accounts')
      if (res.data?.success) setPaymentAccounts(res.data.data || [])
    } catch (err) {
      console.error('Error fetching payment accounts:', err)
    }
  }

  const fetchFolioData = useCallback(async (checkInId) => {
    if (!checkInId) return
    setLoading(true)
    try {
      const [folioRes, summaryRes] = await Promise.all([
        axios.get(`/guestfolios?checkInId=${checkInId}`),
        axios.get(`/guestfolios/summary/${checkInId}`)
      ])
      if (folioRes.data?.success) setTransactions(folioRes.data.data || [])
      if (summaryRes.data?.success) setSummary(summaryRes.data.data)
    } catch (err) {
      console.error('Error fetching folio data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSelectCheckIn = (checkIn) => {
    setSelectedCheckIn(checkIn)
    fetchFolioData(checkIn.id)
  }

  // Post Charge
  const handlePostCharge = async (e) => {
    e.preventDefault()
    if (!selectedCheckIn) return
    if (!chargeForm.amount || parseFloat(chargeForm.amount) <= 0) {
      setError('Amount is required'); return
    }
    if (!chargeForm.chargeItemCode) {
      setError('Please select a charge item'); return
    }

    setLoading(true)
    try {
      const payload = {
        checkInId: selectedCheckIn.id,
        chargeItemCode: chargeForm.chargeItemCode,
        description: chargeForm.description || chargeItems.find(i => `${i.code}-${i.name}` === chargeForm.chargeItemCode)?.name || '',
        source: chargeForm.source,
        quantity: parseInt(chargeForm.quantity) || 1,
        amount: parseFloat(chargeForm.amount),
        taxAmount: parseFloat(chargeForm.taxAmount) || 0,
        transactionDate: chargeForm.transactionDate,
        remarks: chargeForm.remarks
      }
      const res = await axios.post('/guestfolios/charge', payload)
      if (res.data?.success) {
        setSuccess('Charge posted successfully')
        setShowChargeModal(false)
        resetChargeForm()
        fetchFolioData(selectedCheckIn.id)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post charge')
    } finally {
      setLoading(false)
    }
  }

  // Post Receipt
  const handlePostReceipt = async (e) => {
    e.preventDefault()
    if (!selectedCheckIn) return
    if (!receiptForm.amount || parseFloat(receiptForm.amount) <= 0) {
      setError('Amount is required'); return
    }
    if (!receiptForm.paymentAccountCode) {
      setError('Please select a payment account'); return
    }

    setLoading(true)
    try {
      const payload = {
        checkInId: selectedCheckIn.id,
        paymentAccountCode: receiptForm.paymentAccountCode,
        description: receiptForm.description || `Payment - ${receiptForm.paymentAccountCode}`,
        source: receiptForm.source,
        amount: parseFloat(receiptForm.amount),
        memo: receiptForm.memo,
        transactionDate: receiptForm.transactionDate,
        remarks: receiptForm.remarks
      }
      const res = await axios.post('/guestfolios/receipt', payload)
      if (res.data?.success) {
        setSuccess('Receipt posted successfully')
        setShowReceiptModal(false)
        resetReceiptForm()
        fetchFolioData(selectedCheckIn.id)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post receipt')
    } finally {
      setLoading(false)
    }
  }

  // Reverse Transaction
  const handleReverse = async (id) => {
    if (!window.confirm('Are you sure you want to reverse this transaction?')) return
    setLoading(true)
    try {
      const res = await axios.post(`/guestfolios/${id}/reverse`)
      if (res.data?.success) {
        setSuccess('Transaction reversed successfully')
        fetchFolioData(selectedCheckIn.id)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reverse transaction')
    } finally {
      setLoading(false)
    }
  }

  // Transfer Balance
  const handleTransfer = async (e) => {
    e.preventDefault()
    if (!selectedCheckIn || !transferForm.toCheckInId || !transferForm.amount) {
      setError('All fields are required'); return
    }
    setLoading(true)
    try {
      const res = await axios.post('/guestfolios/transfer', {
        fromCheckInId: selectedCheckIn.id,
        toCheckInId: parseInt(transferForm.toCheckInId),
        amount: parseFloat(transferForm.amount)
      })
      if (res.data?.success) {
        setSuccess('Balance transferred successfully')
        setShowTransferModal(false)
        setTransferForm({ toCheckInId: '', amount: '' })
        fetchFolioData(selectedCheckIn.id)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to transfer balance')
    } finally {
      setLoading(false)
    }
  }

  // View / Print Bill
  const handleViewBill = async () => {
    if (!selectedCheckIn) return
    setLoading(true)
    try {
      const res = await axios.get(`/guestfolios/bill/${selectedCheckIn.id}`)
      if (res.data?.success) {
        setBillData(res.data.data)
        setShowBillModal(true)
      }
    } catch (err) {
      setError('Failed to load bill')
    } finally {
      setLoading(false)
    }
  }

  // Generate PDF
  const generatePDF = () => {
    if (!billData) return
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 15

    // Hotel Header
    if (billData.hotel) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(billData.hotel.hotelName || 'Hotel', pageWidth / 2, y, { align: 'center' })
      y += 7
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      if (billData.hotel.address) { doc.text(billData.hotel.address, pageWidth / 2, y, { align: 'center' }); y += 5 }
      if (billData.hotel.phoneNumber) { doc.text(`Tel: ${billData.hotel.phoneNumber}`, pageWidth / 2, y, { align: 'center' }); y += 5 }
      if (billData.hotel.gstNumber) { doc.text(`GST: ${billData.hotel.gstNumber}`, pageWidth / 2, y, { align: 'center' }); y += 5 }
    }

    y += 3
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    doc.line(14, y, pageWidth - 14, y)
    y += 8

    // Title
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('GUEST FOLIO', pageWidth / 2, y, { align: 'center' })
    y += 10

    // Guest Info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const ci = billData.checkIn
    if (ci) {
      doc.text(`Guest: ${ci.guestName || 'N/A'}`, 14, y)
      doc.text(`Room: ${ci.roomNumber || 'N/A'}`, pageWidth - 14, y, { align: 'right' })
      y += 6
      doc.text(`Check-In: ${ci.checkInDate ? new Date(ci.checkInDate).toLocaleDateString() : 'N/A'}`, 14, y)
      doc.text(`Check-Out: ${ci.expectedCheckOutDate ? new Date(ci.expectedCheckOutDate).toLocaleDateString() : 'N/A'}`, pageWidth - 14, y, { align: 'right' })
      y += 6
      if (ci.guestCompany) { doc.text(`Company: ${ci.guestCompany}`, 14, y); y += 6 }
    }

    y += 4
    doc.line(14, y, pageWidth - 14, y)
    y += 6

    // Table Header
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('Date', 14, y)
    doc.text('Description', 45, y)
    doc.text('Type', 120, y)
    doc.text('Amount', pageWidth - 14, y, { align: 'right' })
    y += 4
    doc.line(14, y, pageWidth - 14, y)
    y += 5

    // Transactions
    doc.setFont('helvetica', 'normal')
    const txns = billData.transactions || []
    txns.forEach(t => {
      if (y > 270) { doc.addPage(); y = 20 }
      const dateStr = t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : ''
      doc.text(dateStr, 14, y)
      const desc = (t.description || '').substring(0, 40)
      doc.text(desc, 45, y)
      doc.text(t.transactionType || '', 120, y)
      const amtStr = `PKR ${(t.totalAmount || t.amount || 0).toLocaleString()}`
      doc.text(amtStr, pageWidth - 14, y, { align: 'right' })
      y += 5
    })

    y += 4
    doc.line(14, y, pageWidth - 14, y)
    y += 8

    // Summary
    const s = billData.summary
    if (s) {
      doc.setFont('helvetica', 'bold')
      doc.text('Total Charges:', 120, y)
      doc.text(`PKR ${(s.totalAmount || 0).toLocaleString()}`, pageWidth - 14, y, { align: 'right' })
      y += 6
      doc.text('Tax:', 120, y)
      doc.text(`PKR ${(s.totalTax || 0).toLocaleString()}`, pageWidth - 14, y, { align: 'right' })
      y += 6
      doc.text('Grand Total:', 120, y)
      doc.text(`PKR ${(s.totalWithTax || 0).toLocaleString()}`, pageWidth - 14, y, { align: 'right' })
      y += 6
      doc.text('Total Paid:', 120, y)
      doc.text(`PKR ${(s.totalPaid || 0).toLocaleString()}`, pageWidth - 14, y, { align: 'right' })
      y += 8
      doc.setFontSize(12)
      const bal = s.balance || 0
      doc.text(bal > 0 ? 'Balance Due:' : 'Balance:', 120, y)
      doc.text(`PKR ${Math.abs(bal).toLocaleString()}`, pageWidth - 14, y, { align: 'right' })
    }

    doc.save(`GuestFolio_${selectedCheckIn?.roomNumber || 'bill'}_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const resetChargeForm = () => {
    setChargeForm({
      chargeItemCode: '', description: '', source: '', quantity: 1,
      amount: '', taxAmount: '', transactionDate: new Date().toISOString().split('T')[0], remarks: ''
    })
  }

  const resetReceiptForm = () => {
    setReceiptForm({
      paymentAccountCode: '', description: '', source: '', amount: '',
      memo: '', transactionDate: new Date().toISOString().split('T')[0], remarks: ''
    })
  }

  // Helpers
  const fmt = (n) => `PKR ${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : '-'

  const getStatusBadge = () => {
    if (!summary) return null
    const bal = summary.balance
    if (bal <= 0) return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">PAID</span>
    if (summary.totalPaid > 0) return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">PARTIAL</span>
    return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">DUE</span>
  }

  // Filtered check-ins
  const filteredCheckIns = activeCheckIns.filter(ci =>
    ci.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ci.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ci.checkInNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Separate charges and receipts
  const charges = transactions.filter(t => t.transactionType === 'Charge')
  const receipts = transactions.filter(t => t.transactionType === 'Receipt')

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Guest Folio</h1>
            <p className="text-teal-100 text-sm mt-1">Post charges, receipts, view folio bill & manage guest accounts</p>
          </div>
          <DocumentTextIcon className="h-10 w-10 text-teal-200" />
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
          <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        {/* Left Panel - Guest Selection */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Active Guests</h2>
              <div className="relative mt-2">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guest / room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto divide-y divide-gray-100">
              {filteredCheckIns.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">No active guests found</div>
              ) : (
                filteredCheckIns.map(ci => (
                  <button
                    key={ci.id}
                    onClick={() => handleSelectCheckIn(ci)}
                    className={`w-full text-left p-3 hover:bg-teal-50 transition-colors ${
                      selectedCheckIn?.id === ci.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{ci.guestName}</p>
                        <p className="text-xs text-gray-500">Room {ci.roomNumber} | {ci.checkInNumber}</p>
                      </div>
                      <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                        {ci.roomNumber}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Folio Details */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-4">
          {!selectedCheckIn ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Select a guest to view their folio</p>
              <p className="text-gray-400 text-sm mt-1">Choose from the active guests list on the left</p>
            </div>
          ) : (
            <>
              {/* Guest Info & Summary Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedCheckIn.guestName}</h2>
                    <p className="text-sm text-gray-500">
                      Room {selectedCheckIn.roomNumber} | Check-In: {fmtDate(selectedCheckIn.checkInDate)} | 
                      Expected Out: {fmtDate(selectedCheckIn.expectedCheckOutDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge()}
                  </div>
                </div>

                {/* Summary Cards */}
                {summary && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-600 font-medium">Total Charges</p>
                      <p className="text-lg font-bold text-blue-900">{fmt(summary.totalCharges)}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-orange-600 font-medium">Tax</p>
                      <p className="text-lg font-bold text-orange-900">{fmt(summary.totalTax)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-purple-600 font-medium">Grand Total</p>
                      <p className="text-lg font-bold text-purple-900">{fmt(summary.totalWithTax)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-green-600 font-medium">Paid</p>
                      <p className="text-lg font-bold text-green-900">{fmt(summary.totalPaid)}</p>
                    </div>
                    <div className={`rounded-lg p-3 text-center ${summary.balance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                      <p className={`text-xs font-medium ${summary.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>Balance</p>
                      <p className={`text-lg font-bold ${summary.balance > 0 ? 'text-red-900' : 'text-green-900'}`}>{fmt(summary.balance)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setShowChargeModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center space-x-1.5">
                  <PlusIcon className="h-4 w-4" /><span>Post Charge</span>
                </button>
                <button onClick={() => setShowReceiptModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium flex items-center space-x-1.5">
                  <BanknotesIcon className="h-4 w-4" /><span>Post Receipt</span>
                </button>
                <button onClick={() => setShowTransferModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center space-x-1.5">
                  <ArrowsRightLeftIcon className="h-4 w-4" /><span>Transfer Balance</span>
                </button>
                <button onClick={handleViewBill}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm font-medium flex items-center space-x-1.5">
                  <PrinterIcon className="h-4 w-4" /><span>View Bill</span>
                </button>
                <button onClick={() => fetchFolioData(selectedCheckIn.id)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center space-x-1.5">
                  <ArrowPathIcon className="h-4 w-4" /><span>Refresh</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('charges')}
                    className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                      activeTab === 'charges' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Charges ({charges.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('receipts')}
                    className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                      activeTab === 'receipts' ? 'border-green-600 text-green-600 bg-green-50' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Receipts ({receipts.length})
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    <span className="ml-2 text-gray-500 text-sm">Loading...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            {activeTab === 'charges' ? 'Charge Item' : 'Payment Account'}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                          {activeTab === 'charges' && (
                            <>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Qty</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Tax</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                            </>
                          )}
                          {activeTab === 'receipts' && (
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                          )}
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(activeTab === 'charges' ? charges : receipts).length === 0 ? (
                          <tr>
                            <td colSpan={activeTab === 'charges' ? 9 : 6} className="px-4 py-8 text-center text-gray-400">
                              No {activeTab} found for this guest
                            </td>
                          </tr>
                        ) : (
                          (activeTab === 'charges' ? charges : receipts).map(t => (
                            <tr key={t.id} className={`hover:bg-gray-50 ${t.isReversed ? 'opacity-50 line-through' : ''}`}>
                              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmtDate(t.transactionDate)}</td>
                              <td className="px-4 py-3 text-gray-500 text-xs">{t.invoiceNumber || t.folioNumber}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  activeTab === 'charges' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                                }`}>
                                  {t.chargeItemCode || t.paymentAccountCode || '-'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-800 max-w-[200px] truncate">{t.description}</td>
                              {activeTab === 'charges' && (
                                <>
                                  <td className="px-4 py-3 text-right text-gray-700">{t.quantity}</td>
                                  <td className="px-4 py-3 text-right text-gray-700">{fmt(t.amount)}</td>
                                  <td className="px-4 py-3 text-right text-gray-500">{fmt(t.taxAmount)}</td>
                                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{fmt(t.totalAmount)}</td>
                                </>
                              )}
                              {activeTab === 'receipts' && (
                                <td className="px-4 py-3 text-right font-semibold text-green-700">{fmt(t.amount)}</td>
                              )}
                              <td className="px-4 py-3 text-center">
                                {!t.isReversed && (
                                  <button
                                    onClick={() => handleReverse(t.id)}
                                    className="text-red-500 hover:text-red-700 text-xs font-medium hover:underline"
                                    title="Reverse this transaction"
                                  >
                                    Reverse
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Post Charge Modal */}
      {showChargeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-900">Post Charge</h2>
              <button onClick={() => { setShowChargeModal(false); resetChargeForm() }} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handlePostCharge} className="p-5 space-y-4">
              <div className="bg-teal-50 rounded-lg p-3 text-sm">
                <span className="font-medium text-teal-800">{selectedCheckIn?.guestName}</span>
                <span className="text-teal-600"> - Room {selectedCheckIn?.roomNumber}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Charge Item *</label>
                <select value={chargeForm.chargeItemCode}
                  onChange={(e) => {
                    const val = e.target.value
                    setChargeForm(f => ({ ...f, chargeItemCode: val, description: val.split('-').slice(1).join('-') || '' }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required>
                  <option value="">Select charge item</option>
                  {chargeItems.map(item => (
                    <option key={item.id} value={`${item.code}-${item.name}`}>{item.code} - {item.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" value={chargeForm.description}
                  onChange={(e) => setChargeForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Charge description" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                  <input type="number" min="1" value={chargeForm.quantity}
                    onChange={(e) => setChargeForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR) *</label>
                  <input type="number" min="0" step="0.01" value={chargeForm.amount}
                    onChange={(e) => setChargeForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="0.00" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Amount</label>
                  <input type="number" min="0" step="0.01" value={chargeForm.taxAmount}
                    onChange={(e) => setChargeForm(f => ({ ...f, taxAmount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="0.00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={chargeForm.transactionDate}
                    onChange={(e) => setChargeForm(f => ({ ...f, transactionDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input type="text" value={chargeForm.source}
                    onChange={(e) => setChargeForm(f => ({ ...f, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="e.g. Front Desk" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea value={chargeForm.remarks}
                  onChange={(e) => setChargeForm(f => ({ ...f, remarks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  rows={2} placeholder="Optional remarks" />
              </div>

              {/* Preview */}
              {chargeForm.amount && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Amount:</span><span>{fmt(parseFloat(chargeForm.amount) * (parseInt(chargeForm.quantity) || 1))}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Tax:</span><span>{fmt(parseFloat(chargeForm.taxAmount) || 0)}</span></div>
                  <div className="flex justify-between font-bold border-t mt-1 pt-1"><span>Total:</span><span>{fmt((parseFloat(chargeForm.amount) * (parseInt(chargeForm.quantity) || 1)) + (parseFloat(chargeForm.taxAmount) || 0))}</span></div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button type="button" onClick={() => { setShowChargeModal(false); resetChargeForm() }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Posting...' : 'Post Charge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-900">Post Receipt</h2>
              <button onClick={() => { setShowReceiptModal(false); resetReceiptForm() }} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handlePostReceipt} className="p-5 space-y-4">
              <div className="bg-teal-50 rounded-lg p-3 text-sm">
                <span className="font-medium text-teal-800">{selectedCheckIn?.guestName}</span>
                <span className="text-teal-600"> - Room {selectedCheckIn?.roomNumber}</span>
                {summary && <span className="text-red-600 ml-2 font-medium">Balance: {fmt(summary.balance)}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Account *</label>
                <select value={receiptForm.paymentAccountCode}
                  onChange={(e) => setReceiptForm(f => ({ ...f, paymentAccountCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required>
                  <option value="">Select payment account</option>
                  {paymentAccounts.map(acc => (
                    <option key={acc.id} value={`${acc.code}-${acc.name}`}>{acc.code} - {acc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR) *</label>
                <input type="number" min="0" step="0.01" value={receiptForm.amount}
                  onChange={(e) => setReceiptForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="0.00" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={receiptForm.transactionDate}
                    onChange={(e) => setReceiptForm(f => ({ ...f, transactionDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input type="text" value={receiptForm.source}
                    onChange={(e) => setReceiptForm(f => ({ ...f, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="e.g. Front Desk" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Memo</label>
                <input type="text" value={receiptForm.memo}
                  onChange={(e) => setReceiptForm(f => ({ ...f, memo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Payment reference / memo" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea value={receiptForm.remarks}
                  onChange={(e) => setReceiptForm(f => ({ ...f, remarks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  rows={2} placeholder="Optional remarks" />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button type="button" onClick={() => { setShowReceiptModal(false); resetReceiptForm() }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
                  {loading ? 'Posting...' : 'Post Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Balance Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-900">Transfer Balance</h2>
              <button onClick={() => setShowTransferModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleTransfer} className="p-5 space-y-4">
              <div className="bg-purple-50 rounded-lg p-3 text-sm">
                <span className="font-medium">From:</span> {selectedCheckIn?.guestName} - Room {selectedCheckIn?.roomNumber}
                {summary && <span className="text-red-600 ml-2 font-medium">Balance: {fmt(summary.balance)}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transfer To *</label>
                <select value={transferForm.toCheckInId}
                  onChange={(e) => setTransferForm(f => ({ ...f, toCheckInId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required>
                  <option value="">Select target guest</option>
                  {activeCheckIns.filter(ci => ci.id !== selectedCheckIn?.id).map(ci => (
                    <option key={ci.id} value={ci.id}>{ci.guestName} - Room {ci.roomNumber}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR) *</label>
                <input type="number" min="0" step="0.01" value={transferForm.amount}
                  onChange={(e) => setTransferForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="0.00" required />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button type="button" onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50">
                  {loading ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill View Modal */}
      {showBillModal && billData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-900">Guest Folio Bill</h2>
              <div className="flex items-center space-x-2">
                <button onClick={generatePDF}
                  className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-amber-700 flex items-center space-x-1">
                  <PrinterIcon className="h-4 w-4" /><span>Download PDF</span>
                </button>
                <button onClick={() => setShowBillModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Hotel Header */}
              {billData.hotel && (
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{billData.hotel.hotelName}</h3>
                  {billData.hotel.address && <p className="text-sm text-gray-600">{billData.hotel.address}</p>}
                  {billData.hotel.phoneNumber && <p className="text-sm text-gray-600">Tel: {billData.hotel.phoneNumber}</p>}
                  {billData.hotel.gstNumber && <p className="text-sm text-gray-600">GST: {billData.hotel.gstNumber}</p>}
                </div>
              )}

              <hr className="my-4" />
              <h4 className="text-center text-lg font-bold text-gray-800 mb-4">GUEST FOLIO</h4>

              {/* Guest Info */}
              {billData.checkIn && (
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p><span className="font-medium">Guest:</span> {billData.checkIn.guestName}</p>
                    <p><span className="font-medium">Company:</span> {billData.checkIn.guestCompany || '-'}</p>
                    <p><span className="font-medium">Phone:</span> {billData.checkIn.guestPhone || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p><span className="font-medium">Room:</span> {billData.checkIn.roomNumber}</p>
                    <p><span className="font-medium">Check-In:</span> {fmtDate(billData.checkIn.checkInDate)}</p>
                    <p><span className="font-medium">Check-Out:</span> {fmtDate(billData.checkIn.expectedCheckOutDate)}</p>
                  </div>
                </div>
              )}

              {/* Transactions Table */}
              <table className="w-full text-sm border border-gray-200 mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left border-b">Date</th>
                    <th className="px-3 py-2 text-left border-b">Description</th>
                    <th className="px-3 py-2 text-center border-b">Type</th>
                    <th className="px-3 py-2 text-right border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(billData.transactions || []).map((t, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-3 py-2">{fmtDate(t.transactionDate)}</td>
                      <td className="px-3 py-2">{t.description}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          t.transactionType === 'Charge' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>{t.transactionType}</span>
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {t.transactionType === 'Receipt' ? (
                          <span className="text-green-700">-{fmt(t.amount)}</span>
                        ) : (
                          fmt(t.totalAmount || t.amount)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              {billData.summary && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Total Charges:</span><span className="font-medium">{fmt(billData.summary.totalAmount)}</span></div>
                    <div className="flex justify-between"><span>Tax:</span><span className="font-medium">{fmt(billData.summary.totalTax)}</span></div>
                    <div className="flex justify-between border-t pt-2"><span className="font-semibold">Grand Total:</span><span className="font-bold">{fmt(billData.summary.totalWithTax)}</span></div>
                    <div className="flex justify-between"><span>Total Paid:</span><span className="font-medium text-green-700">{fmt(billData.summary.totalPaid)}</span></div>
                    <div className="flex justify-between border-t pt-2 text-lg">
                      <span className="font-bold">{billData.summary.balance > 0 ? 'Balance Due:' : 'Balance:'}</span>
                      <span className={`font-bold ${billData.summary.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {fmt(Math.abs(billData.summary.balance))}
                      </span>
                    </div>
                    <div className="text-center mt-2">
                      <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                        billData.summary.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        billData.summary.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>{billData.summary.status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestFolio
