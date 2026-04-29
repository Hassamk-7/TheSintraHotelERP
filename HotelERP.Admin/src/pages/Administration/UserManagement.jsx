import { useState } from 'react'
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useEffect } from 'react'
import axios from '../../utils/axios.js'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  phoneNumber: '',
  department: '',
  password: '',
  roles: [],
  isActive: true
}

const UserManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [resetUser, setResetUser] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [resetPassword, setResetPassword] = useState('')

  const loadData = async (search = '') => {
    try {
      setLoading(true)
      setError('')
      const [usersRes, rolesRes] = await Promise.all([
        axios.get('/admin/users', { params: search ? { search } : {} }),
        axios.get('/admin/roles')
      ])

      setUsers(Array.isArray(usersRes?.data?.data) ? usersRes.data.data : [])
      setRoles(Array.isArray(rolesRes?.data?.data) ? rolesRes.data.data : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user management data')
      setUsers([])
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase()
    return (user.name || '').toLowerCase().includes(term)
      || (user.email || '').toLowerCase().includes(term)
      || (user.department || '').toLowerCase().includes(term)
  })

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData(initialForm)
    setShowForm(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      userName: user.userName || '',
      phoneNumber: user.phoneNumber || '',
      department: user.department || '',
      password: '',
      roles: Array.isArray(user.roles) ? user.roles : [],
      isActive: !!user.isActive
    })
    setShowForm(true)
  }

  const closeFormModal = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData(initialForm)
  }

  const toggleRole = (roleName) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter(role => role !== roleName)
        : [...prev.roles, roleName]
    }))
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        userName: formData.userName,
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        roles: formData.roles,
        isActive: formData.isActive,
        ...(editingUser ? {} : { password: formData.password })
      }

      if (editingUser) {
        await axios.put(`/admin/users/${editingUser.id}`, payload)
        setSuccess('User updated successfully')
      } else {
        await axios.post('/admin/users', payload)
        setSuccess('User created successfully')
      }

      closeFormModal()
      await loadData(searchTerm)
    } catch (err) {
      const details = err.response?.data?.errors
      setError(Array.isArray(details) ? details.join(', ') : (err.response?.data?.message || 'Failed to save user'))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(`Delete user ${user.name || user.email}?`)
    if (!confirmed) return

    try {
      setError('')
      setSuccess('')
      await axios.delete(`/admin/users/${user.id}`)
      setSuccess('User deleted successfully')
      await loadData(searchTerm)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const openResetModal = (user) => {
    setResetUser(user)
    setResetPassword('')
    setShowResetModal(true)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!resetUser) return

    try {
      setSaving(true)
      setError('')
      setSuccess('')
      await axios.post(`/admin/users/${resetUser.id}/reset-password`, { newPassword: resetPassword })
      setSuccess('Password reset successfully')
      setShowResetModal(false)
      setResetUser(null)
      setResetPassword('')
    } catch (err) {
      const details = err.response?.data?.errors
      setError(Array.isArray(details) ? details.join(', ') : (err.response?.data?.message || 'Failed to reset password'))
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (value) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[1.5rem] p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold mb-2">User Management</h1>
            <p className="text-indigo-100 text-sm sm:text-base">Manage system users, roles, passwords, and access permissions</p>
          </div>
          <UserGroupIcon className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-200 shrink-0" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">{error}</div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl">{success}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <KeyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => (u.roles || []).some(role => String(role).toLowerCase().includes('admin'))).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(users.map(u => u.department)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 rounded-2xl hover:from-indigo-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto font-medium"
        >
          <PlusIcon className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[780px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No users found</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {(user.name || user.email || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name || user.email}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{(user.roles || []).join(', ') || 'No Role'}</div>
                    <div className="text-sm text-gray-500">{user.department || 'No Department'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900" onClick={() => openEditModal(user)}>
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" onClick={() => openResetModal(user)}>
                        <KeyIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(user)}>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editingUser ? 'Edit User' : 'Add User'}</h2>
                <p className="text-sm text-gray-500">Manage account profile, status, and role assignment</p>
              </div>
              <button onClick={closeFormModal} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="px-4 py-3 border border-gray-300 rounded-xl" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} required />
                <input className="px-4 py-3 border border-gray-300 rounded-xl" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} />
                <input className="px-4 py-3 border border-gray-300 rounded-xl" type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} required />
                <input className="px-4 py-3 border border-gray-300 rounded-xl" placeholder="Username" value={formData.userName} onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))} />
                <input className="px-4 py-3 border border-gray-300 rounded-xl" placeholder="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))} />
                <input className="px-4 py-3 border border-gray-300 rounded-xl" placeholder="Department" value={formData.department} onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))} />
                {!editingUser && (
                  <input className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2" type="password" placeholder="Temporary Password" value={formData.password} onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} required />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Assign Roles</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roles.map(role => (
                    <label key={role.id} className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer ${formData.roles.includes(role.name) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                      <input type="checkbox" checked={formData.roles.includes(role.name)} onChange={() => toggleRole(role.name)} />
                      <div>
                        <p className="font-medium text-gray-900">{role.name}</p>
                        <p className="text-xs text-gray-500">{role.description || 'No description'}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} />
                Keep this user active
              </label>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeFormModal} className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white disabled:opacity-50">
                  {saving ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetModal && resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
                <p className="text-sm text-gray-500">Set a new password for {resetUser.name || resetUser.email}</p>
              </div>
              <button onClick={() => setShowResetModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-6">
              <input className="w-full px-4 py-3 border border-gray-300 rounded-xl" type="password" placeholder="Enter new password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowResetModal(false)} className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-50">
                  {saving ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement;
