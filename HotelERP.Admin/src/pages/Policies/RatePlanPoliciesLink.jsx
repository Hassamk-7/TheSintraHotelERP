import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import {
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const RatePlanPoliciesLink = ({ ratePlanId, onClose }) => {
  const [policies, setPolicies] = useState([])
  const [linkedPolicies, setLinkedPolicies] = useState([])
  const [selectedPolicyId, setSelectedPolicyId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hotelId, setHotelId] = useState('')

  useEffect(() => {
    if (ratePlanId) {
      fetchRatePlanData()
      fetchLinkedPolicies()
    }
  }, [ratePlanId])

  const fetchRatePlanData = async () => {
    try {
      const response = await axios.get(`/rateplan/${ratePlanId}`)
      if (response.data.success) {
        setHotelId(response.data.data.hotelId)
        fetchAvailablePolicies(response.data.data.hotelId)
      }
    } catch (err) {
      console.error('Error fetching rate plan:', err)
    }
  }

  const fetchAvailablePolicies = async (hId) => {
    try {
      const response = await axios.get(`/cancellationpolicy/hotel/${hId}`)
      if (response.data.success) {
        setPolicies(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching policies:', err)
    }
  }

  const fetchLinkedPolicies = async () => {
    try {
      const response = await axios.get(`/cancellationpolicy/rateplan/${ratePlanId}`)
      if (response.data.success) {
        setLinkedPolicies(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching linked policies:', err)
    }
  }

  const handleLinkPolicy = async () => {
    if (!selectedPolicyId) {
      setError('Please select a policy')
      return
    }

    try {
      setLoading(true)
      await axios.post(`/cancellationpolicy/${selectedPolicyId}/link-rateplan`, {
        ratePlanId: parseInt(ratePlanId),
        priority: 0
      })
      setSuccess('Policy linked successfully')
      setSelectedPolicyId('')
      fetchLinkedPolicies()
    } catch (err) {
      console.error('Error linking policy:', err)
      setError(err.response?.data?.message || 'Failed to link policy')
    } finally {
      setLoading(false)
    }
  }

  const handleUnlinkPolicy = async (policyId) => {
    if (!window.confirm('Remove this policy from the rate plan?')) return

    try {
      setLoading(true)
      await axios.delete(`/cancellationpolicy/${policyId}/unlink-rateplan/${ratePlanId}`)
      setSuccess('Policy unlinked successfully')
      fetchLinkedPolicies()
    } catch (err) {
      console.error('Error unlinking policy:', err)
      setError(err.response?.data?.message || 'Failed to unlink policy')
    } finally {
      setLoading(false)
    }
  }

  const availablePoliciesForLink = policies.filter(
    p => !linkedPolicies.some(lp => lp.cancellationPolicyId === p.id)
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Link Cancellation Policies</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* Link New Policy */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3">Add Policy</h3>
            <div className="flex gap-2">
              <select
                value={selectedPolicyId}
                onChange={(e) => setSelectedPolicyId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">-- Select Policy --</option>
                {availablePoliciesForLink.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleLinkPolicy}
                disabled={loading || !selectedPolicyId}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Link</span>
              </button>
            </div>
          </div>

          {/* Linked Policies */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Linked Policies</h3>
            {linkedPolicies.length === 0 ? (
              <p className="text-gray-500 text-sm">No policies linked yet</p>
            ) : (
              <div className="space-y-2">
                {linkedPolicies.map(link => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{link.policyCode} - {link.policyName}</p>
                      <p className="text-xs text-gray-500">Priority: {link.priority}</p>
                    </div>
                    <button
                      onClick={() => handleUnlinkPolicy(link.cancellationPolicyId)}
                      className="text-red-600 hover:text-red-900"
                      title="Remove"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You can link multiple cancellation policies to a rate plan. 
              The policy with the highest priority will be used for penalty calculations.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatePlanPoliciesLink
