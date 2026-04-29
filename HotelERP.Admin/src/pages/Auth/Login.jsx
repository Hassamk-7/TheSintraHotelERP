import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { EyeIcon, EyeSlashIcon, KeyIcon, EnvelopeIcon, ChevronRightIcon, Cog6ToothIcon, MegaphoneIcon, BanknotesIcon, SparklesIcon, BuildingStorefrontIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const departmentOptions = useMemo(() => ([
    {
      id: 'admin-operations',
      title: 'Admin Operations',
      subtitle: 'System administration and super user access',
      icon: ShieldCheckIcon,
      buttonClass: 'from-red-500 to-red-700 shadow-red-900/30',
      defaultEmail: 'superadmin'
    },
    {
      id: 'operations',
      title: 'Operations',
      subtitle: 'Front office, reservations, and admin access',
      icon: Cog6ToothIcon,
      buttonClass: 'from-blue-500 to-blue-700 shadow-blue-900/30',
      defaultEmail: 'admin'
    },
    {
      id: 'sales',
      title: 'Sales & Marketing',
      subtitle: 'Leads, campaigns, and booking growth',
      icon: MegaphoneIcon,
      buttonClass: 'from-amber-400 to-orange-500 shadow-orange-900/30',
      defaultEmail: 'sales'
    },
    {
      id: 'finance',
      title: 'Finance',
      subtitle: 'Payments, folios, and cash controls',
      icon: BanknotesIcon,
      buttonClass: 'from-green-400 to-emerald-600 shadow-emerald-900/30',
      defaultEmail: 'finance'
    },
    {
      id: 'housekeeping',
      title: 'Housekeeping',
      subtitle: 'Cleaning workflow and room readiness',
      icon: SparklesIcon,
      buttonClass: 'from-violet-400 to-purple-600 shadow-purple-900/30',
      defaultEmail: 'housekeeping'
    },
    {
      id: 'pos',
      title: 'POS',
      subtitle: 'Outlet billing and revenue tracking',
      icon: BuildingStorefrontIcon,
      buttonClass: 'from-cyan-400 to-sky-600 shadow-cyan-900/30',
      defaultEmail: 'sales'
    }
  ]), [])
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [selectedDepartment, setSelectedDepartment] = useState('operations')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const activeDepartment = departmentOptions.find(option => option.id === selectedDepartment) || departmentOptions[0]

  const handleDepartmentSelect = (departmentId) => {
    const department = departmentOptions.find(option => option.id === departmentId)
    setSelectedDepartment(departmentId)

    if (department?.defaultEmail) {
      setFormData(prev => ({
        ...prev,
        email: department.defaultEmail
      }))
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)
    
    if (!result.success) {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_25%)]"></div>
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_45%)]"></div>
        <div className="relative z-10 flex h-full w-full flex-col justify-center px-6 py-6 text-white xl:px-12 2xl:px-14 overflow-y-auto">
          <div className="mx-auto w-full max-w-[540px] rounded-[20px] xl:rounded-[28px] border border-white/10 bg-white/5 px-4 py-4 xl:px-6 xl:py-6 shadow-[0_30px_80px_rgba(15,23,42,0.22)] backdrop-blur-[2px]">
          <div className="mb-3 xl:mb-4 flex items-center gap-2.5 xl:gap-3">
            <img src="/whitelogo.png" alt="The Sintra Hotel" className="h-12 w-12 xl:h-14 xl:w-14 rounded-xl xl:rounded-2xl bg-white/10 p-1.5 object-contain shadow-lg backdrop-blur-sm" />
            <div>
              <div className="text-xl xl:text-2xl font-extrabold tracking-tight">PMS</div>
              <div className="text-[11px] xl:text-xs font-semibold text-blue-100">Hotel Management System</div>
            </div>
          </div>

          <div className="flex max-w-xl flex-col gap-1.5 xl:gap-2">
            {departmentOptions.map(option => {
              const Icon = option.icon
              const isActive = option.id === selectedDepartment

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleDepartmentSelect(option.id)}
                  className={`group flex items-center justify-between rounded-lg xl:rounded-xl bg-gradient-to-r px-2.5 xl:px-4 py-1.5 xl:py-2 text-left shadow-md transition duration-200 hover:scale-[1.01] ${option.buttonClass} ${isActive ? 'ring-2 ring-white/70' : 'opacity-90 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-2.5 xl:gap-3">
                    <div className="flex h-6 w-6 xl:h-8 xl:w-8 items-center justify-center rounded-lg xl:rounded-xl bg-white/15 backdrop-blur-sm flex-shrink-0">
                      <Icon className="h-4 w-4 xl:h-5 xl:w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm xl:text-base font-bold leading-none text-white">{option.title}</div>
                      <div className="mt-0.5 text-[10px] xl:text-[11px] text-white/75 truncate">{option.subtitle}</div>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 xl:h-5 xl:w-5 text-white transition group-hover:translate-x-1 flex-shrink-0" />
                </button>
              )
            })}
          </div>

          <div className="mt-3 max-w-xl rounded-xl border border-white/15 bg-white/10 p-2.5 xl:p-3.5 backdrop-blur-md">
            <div className="text-[10px] xl:text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Selected Access</div>
            <div className="mt-0.5 text-base xl:text-lg font-bold text-white">{activeDepartment.title}</div>
            <p className="mt-0.5 text-[11px] xl:text-xs text-blue-100 leading-4">
              {activeDepartment.subtitle}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] xl:text-xs text-blue-50">
              <div className="rounded-lg xl:rounded-xl bg-white/10 px-3 py-1.5">Users access by role</div>
              <div className="rounded-lg xl:rounded-xl bg-white/10 px-3 py-1.5">Department wise login tabs</div>
            </div>
          </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-40 w-40 translate-x-20 -translate-y-20 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-white/10"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50 px-4 py-4 sm:px-6 lg:px-6 xl:px-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <img src="/whitelogo.png" alt="The Sintra Hotel" className="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-3 rounded-2xl shadow-md object-contain" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">The Sintra Hotel</h2>
            <p className="text-sm text-gray-600 mt-1">PMS - Hotel Management System</p>
          </div>
          
          {/* Mobile Department Selector */}
          <div className="lg:hidden mb-4 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Department</label>
            <select 
              value={selectedDepartment}
              onChange={(e) => handleDepartmentSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {departmentOptions.map(option => (
                <option key={option.id} value={option.id}>{option.title}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder={`${activeDepartment.defaultEmail || 'Enter your email address'}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-center text-sm">
                  <p className="text-blue-800 font-semibold mb-2">Admin Access Information</p>
                  <div className="space-y-1 text-blue-700">
                    <p>Use your authorized admin email and password to access the management portal.</p>
                    <p>Contact the system administrator if you need account creation, role updates, or password reset support.</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <div className="text-center mt-4 sm:mt-6 lg:hidden">
            <p className="text-xs sm:text-sm text-gray-500">
              © 2025 Growbiz Tech. Developed by Senior Software Architect Zubair.
            </p>
          </div>
          <div className="text-center mt-6 hidden lg:block">
            <p className="text-sm text-gray-500">
              © 2025 Growbiz Tech. Developed by Senior Software Architect Zubair.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
