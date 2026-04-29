import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { EyeIcon, EyeSlashIcon, KeyIcon, EnvelopeIcon, ChevronRightIcon, Cog6ToothIcon, MegaphoneIcon, BanknotesIcon, SparklesIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const departmentOptions = useMemo(() => ([
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
    <div className="h-screen overflow-hidden flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_25%)]"></div>
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_45%)]"></div>
        <div className="relative z-10 flex h-full w-full flex-col justify-center px-10 py-8 text-white xl:px-14">
          <div className="mx-auto w-full max-w-[540px] rounded-[36px] border border-white/10 bg-white/5 px-8 py-8 shadow-[0_30px_80px_rgba(15,23,42,0.22)] backdrop-blur-[2px]">
          <div className="mb-7 flex items-center gap-4">
            <img src="/whitelogo.png" alt="The Sintra Hotel" className="h-20 w-20 rounded-3xl bg-white/10 p-3 object-contain shadow-xl backdrop-blur-sm" />
            <div>
              <div className="text-4xl font-extrabold tracking-tight">PMS</div>
              <div className="text-base font-semibold text-blue-100">Hotel Management System</div>
            </div>
          </div>

          <div className="max-w-2xl">
            <h1 className="whitespace-nowrap text-[1.95rem] font-extrabold leading-tight xl:text-[2.15rem]">Sign in to your Department</h1>
            <div className="mt-3 flex items-center gap-4 text-blue-100">
              <span className="h-px flex-1 bg-white/20"></span>
              <span className="text-base font-medium">Select your login category</span>
              <span className="h-px flex-1 bg-white/20"></span>
            </div>
          </div>

          <div className="mt-6 flex max-w-xl flex-col gap-2.5">
            {departmentOptions.map(option => {
              const Icon = option.icon
              const isActive = option.id === selectedDepartment

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleDepartmentSelect(option.id)}
                  className={`group flex items-center justify-between rounded-2xl bg-gradient-to-r px-5 py-3.5 text-left shadow-xl transition duration-200 hover:scale-[1.01] ${option.buttonClass} ${isActive ? 'ring-2 ring-white/70' : 'opacity-90 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold leading-none text-white">{option.title}</div>
                      <div className="mt-1 text-xs text-white/85">{option.subtitle}</div>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-6 w-6 text-white transition group-hover:translate-x-1" />
                </button>
              )
            })}
          </div>

          <div className="mt-5 max-w-xl rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">Selected Access</div>
            <div className="mt-2 text-2xl font-bold text-white">{activeDepartment.title}</div>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              {activeDepartment.subtitle}. Use your authorized users account on the right side to continue securely into the system.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-blue-50">
              <div className="rounded-2xl bg-white/10 px-4 py-3">Users access by role</div>
              <div className="rounded-2xl bg-white/10 px-4 py-3">Department wise login tabs</div>
            </div>
          </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-40 w-40 translate-x-20 -translate-y-20 rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-white/10"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center overflow-hidden bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/whitelogo.png" alt="The Sintra Hotel" className="h-24 w-24 mx-auto mb-4 rounded-2xl shadow-md object-contain" />
            <h2 className="text-2xl font-bold text-gray-900">The Sintra Hotel</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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
          
          <div className="text-center mt-6">
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
