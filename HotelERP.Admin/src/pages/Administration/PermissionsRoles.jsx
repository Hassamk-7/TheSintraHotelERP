import { useState } from 'react'
import {
  ShieldCheckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  KeyIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useEffect } from 'react'
import axios from '../../utils/axios.js'

const initialRoleForm = {
  name: '',
  description: '',
  permissions: []
}

const initialPermissionForm = {
  module: '',
  permission: '',
  description: ''
}

const PermissionsRoles = () => {
  const [activeTab, setActiveTab] = useState('roles')
  const [searchTerm, setSearchTerm] = useState('')
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [roleForm, setRoleForm] = useState(initialRoleForm)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [editingPermission, setEditingPermission] = useState(null)
  const [permissionForm, setPermissionForm] = useState(initialPermissionForm)

  const loadData = async (search = '') => {
    try {
      setLoading(true)
      setError('')
      const [rolesRes, permissionsRes] = await Promise.all([
        axios.get('/admin/roles', { params: search ? { search } : {} }),
        axios.get('/admin/roles/permissions')
      ])

      setRoles(Array.isArray(rolesRes?.data?.data) ? rolesRes.data.data : [])
      setPermissions(Array.isArray(permissionsRes?.data?.data) ? permissionsRes.data.data : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load roles and permissions')
      setRoles([])
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSavePermission = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      if (editingPermission) {
        await axios.put(`/admin/roles/permissions/${editingPermission.id}`, permissionForm)
        setSuccess('Permission updated successfully')
      } else {
        await axios.post('/admin/roles/permissions', permissionForm)
        setSuccess('Permission created successfully')
      }

      closePermissionModal()
      await loadData(searchTerm)
    } catch (err) {
      const details = err.response?.data?.errors
      const normalizedDetails = details && !Array.isArray(details)
        ? Object.values(details).flat().filter(Boolean)
        : details

      setError(Array.isArray(normalizedDetails) ? normalizedDetails.join(', ') : (err.response?.data?.message || 'Failed to save permission'))
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredRoles = roles.filter(role =>
    (role.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openCreateRole = () => {
    setEditingRole(null)
    setRoleForm(initialRoleForm)
    setShowRoleModal(true)
  }

  const openEditRole = (role) => {
    setEditingRole(role)
    setRoleForm({
      name: role.name || '',
      description: role.description || '',
      permissions: Array.isArray(role.permissions) ? role.permissions : []
    })
    setShowRoleModal(true)
  }

  const closeRoleModal = () => {
    setShowRoleModal(false)
    setEditingRole(null)
    setRoleForm(initialRoleForm)
  }

  const openCreatePermission = () => {
    setEditingPermission(null)
    setPermissionForm(initialPermissionForm)
    setShowPermissionModal(true)
  }

  const openEditPermission = (permission) => {
    setEditingPermission(permission)
    setPermissionForm({
      module: permission.module || '',
      permission: permission.permission || '',
      description: permission.description || ''
    })
    setShowPermissionModal(true)
  }

  const closePermissionModal = () => {
    setShowPermissionModal(false)
    setEditingPermission(null)
    setPermissionForm(initialPermissionForm)
  }

  const togglePermission = (permissionKey) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(item => item !== permissionKey)
        : [...prev.permissions, permissionKey]
    }))
  }

  const handleSaveRole = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      if (editingRole) {
        await axios.put(`/admin/roles/${editingRole.id}`, roleForm)
        setSuccess('Role updated successfully')
      } else {
        await axios.post('/admin/roles', roleForm)
        setSuccess('Role created successfully')
      }

      closeRoleModal()
      await loadData(searchTerm)
    } catch (err) {
      const details = err.response?.data?.errors
      setError(Array.isArray(details) ? details.join(', ') : (err.response?.data?.message || 'Failed to save role'))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRole = async (role) => {
    const confirmed = window.confirm(`Delete role ${role.name}?`)
    if (!confirmed) return

    try {
      setError('')
      setSuccess('')
      await axios.delete(`/admin/roles/${role.id}`)
      setSuccess('Role deleted successfully')
      await loadData(searchTerm)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete role')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Permissions & Roles</h1>
            <p className="text-emerald-100">Manage dynamic user roles, permission claims, and access control</p>
          </div>
          <ShieldCheckIcon className="h-12 w-12 text-emerald-200" />
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
            <div className="bg-emerald-100 rounded-lg p-3">
              <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
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
              <p className="text-sm font-medium text-gray-600">Permissions</p>
              <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <ShieldCheckIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admin Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.filter(r => r.name.includes('Admin')).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Roles Management
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Permissions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'roles' && (
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search roles..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button onClick={openCreateRole} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Create Role
                </button>
              </div>

              {/* Roles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center text-gray-500 py-10">Loading roles...</div>
                ) : filteredRoles.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 py-10">No roles found</div>
                ) : filteredRoles.map((role) => (
                  <div key={role.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-3 h-3 rounded-full bg-${role.color}-500`}></div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600" onClick={() => openEditRole(role)}>
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600" onClick={() => handleDeleteRole(role)}>
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{role.userCount} users</span>
                      <span className="text-sm text-gray-500">
                        {role.permissions.includes('all') ? 'All' : role.permissions.length} permissions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">System Permissions</h3>
                <button onClick={openCreatePermission} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Add Permission
                </button>
              </div>

              {/* Permissions Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Module
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">Loading permissions...</td>
                      </tr>
                    ) : permissions.map((perm) => (
                      <tr key={perm.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{perm.module}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            {perm.permission}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {perm.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900" onClick={() => openEditPermission(perm)}>
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editingRole ? 'Edit Role' : 'Create Role'}</h2>
                <p className="text-sm text-gray-500">Assign permission claims that drive dynamic menu and feature access</p>
              </div>
              <button onClick={closeRoleModal} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="px-4 py-3 border border-gray-300 rounded-xl" placeholder="Role Name" value={roleForm.name} onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))} required />
                <input className="px-4 py-3 border border-gray-300 rounded-xl" placeholder="Description" value={roleForm.description} onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Permission Assignment</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[26rem] overflow-y-auto pr-1">
                  {permissions.map(permission => (
                    <label key={permission.id} className={`flex items-start gap-3 px-4 py-3 border rounded-xl cursor-pointer ${roleForm.permissions.includes(permission.permission) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                      <input type="checkbox" checked={roleForm.permissions.includes(permission.permission)} onChange={() => togglePermission(permission.permission)} className="mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{permission.module}</p>
                        <p className="text-xs text-emerald-700 font-medium">{permission.permission}</p>
                        <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeRoleModal} className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white disabled:opacity-50">
                  {saving ? 'Saving...' : (editingRole ? 'Update Role' : 'Create Role')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editingPermission ? 'Edit Permission' : 'Create Permission'}</h2>
                <p className="text-sm text-gray-500">Manage the permission catalog used by role assignment</p>
              </div>
              <button onClick={closePermissionModal} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSavePermission} className="p-6 space-y-4">
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                placeholder="Module"
                value={permissionForm.module}
                onChange={(e) => setPermissionForm(prev => ({ ...prev, module: e.target.value }))}
                required
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                placeholder="Permission Key"
                value={permissionForm.permission}
                onChange={(e) => setPermissionForm(prev => ({ ...prev, permission: e.target.value }))}
                required
              />
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl min-h-[120px]"
                placeholder="Description"
                value={permissionForm.description}
                onChange={(e) => setPermissionForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closePermissionModal} className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white disabled:opacity-50">
                  {saving ? 'Saving...' : (editingPermission ? 'Update Permission' : 'Create Permission')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PermissionsRoles;
