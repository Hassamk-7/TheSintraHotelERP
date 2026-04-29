import { useState, useEffect } from 'react'
import axios from '../../utils/axios.js'
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const ContactMessages = () => {
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 })
  const [filter, setFilter] = useState('all') // all, unread, read
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchMessages()
    fetchStats()
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, filter, searchTerm])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/ContactMessage')
      setMessages(response.data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/ContactMessage/stats')
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const filterMessages = () => {
    let filtered = messages

    // Apply read/unread filter
    if (filter === 'unread') {
      filtered = filtered.filter(m => !m.isRead)
    } else if (filter === 'read') {
      filtered = filtered.filter(m => m.isRead)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredMessages(filtered)
  }

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/ContactMessage/${id}/mark-read`)
      fetchMessages()
      fetchStats()
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const handleMarkAsUnread = async (id) => {
    try {
      await axios.put(`/ContactMessage/${id}/mark-unread`)
      fetchMessages()
      fetchStats()
    } catch (err) {
      console.error('Error marking as unread:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return

    try {
      await axios.delete(`/ContactMessage/${id}`)
      fetchMessages()
      fetchStats()
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }

  const handleViewMessage = (message) => {
    setSelectedMessage(message)
    setShowModal(true)
    if (!message.isRead) {
      handleMarkAsRead(message.messageID)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600 mt-2">Manage customer inquiries and messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Messages</p>
              <h3 className="text-4xl font-bold mt-2">{stats.total}</h3>
            </div>
            <EnvelopeIcon className="h-16 w-16 text-purple-300 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Unread Messages</p>
              <h3 className="text-4xl font-bold mt-2">{stats.unread}</h3>
            </div>
            <EnvelopeIcon className="h-16 w-16 text-pink-300 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">Read Messages</p>
              <h3 className="text-4xl font-bold mt-2">{stats.read}</h3>
            </div>
            <EnvelopeOpenIcon className="h-16 w-16 text-cyan-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({stats.unread})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'read'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Search messages by name, email, subject, or message"
            />
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Contact Messages
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <EnvelopeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr key={message.messageID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          message.isRead
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {message.isRead ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {message.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{message.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {message.phone || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{message.subject}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {formatDate(message.createdDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="text-purple-600 hover:text-purple-900"
                          title="View Message"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {message.isRead ? (
                          <button
                            onClick={() => handleMarkAsUnread(message.messageID)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Mark as Unread"
                          >
                            <EnvelopeIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAsRead(message.messageID)}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Read"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(message.messageID)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Message Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-purple-600 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedMessage.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <p className="text-gray-900">{selectedMessage.location || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <p className="text-gray-900 font-semibold">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <strong>Received:</strong> {formatDate(selectedMessage.createdDate)}
                  </div>
                  {selectedMessage.isRead && selectedMessage.readDate && (
                    <div>
                      <strong>Read:</strong> {formatDate(selectedMessage.readDate)}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactMessages
