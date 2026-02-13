import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react'
import { login as loginService, register as registerService, forgotPassword as forgotPasswordService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import Home from './Home'

function Login() {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine initial state based on URL
  const [isFlipped, setIsFlipped] = useState(location.pathname === '/signup')

  useEffect(() => {
    setIsFlipped(location.pathname === '/signup')
  }, [location.pathname])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState({ type: '', message: '' })

  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Sign In form state
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  })

  // Sign Up form state
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })


  const { login: setAuth } = useAuth()

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginService({
        email: signInForm.email,
        password: signInForm.password
      })

      if (response.success) {
        setAuth(response.data.user, response.data.token, response.data.firstLogin || false)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await registerService({
        name: signUpForm.name,
        email: signUpForm.email,
        password: signUpForm.password
      })

      if (response.success) {
        // Save email before resetting form
        const registeredEmail = signUpForm.email
        // Reset sign up form
        setSignUpForm({ name: '', email: '', password: '', confirmPassword: '' })

        // Navigate to login page
        navigate('/login')

        setError('')
        // Pre-fill email in sign in form
        setSignInForm({ email: registeredEmail, password: '' })
        alert('Registration successful! Please sign in.')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes for Sign In
  const handleSignInChange = (e) => {
    setSignInForm({
      ...signInForm,
      [e.target.name]: e.target.value
    })
  }

  // Handle input changes for Sign Up
  const handleSignUpChange = (e) => {
    setSignUpForm({
      ...signUpForm,
      [e.target.name]: e.target.value
    })
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) return

    setLoading(true)
    setForgotStatus({ type: '', message: '' })

    try {
      await forgotPasswordService(forgotEmail)
      // Even if API fails (security practice), usually we show success or handle error. 
      // Assuming API returns success if email exists or even if not (to prevent enumeration).
      // If your API throws error for non-existent email, catch block handles it.
      setForgotStatus({ type: 'success', message: 'If an account exists, a password reset link has been sent.' })
      setForgotEmail('')
    } catch (err) {
      setForgotStatus({ type: 'error', message: err.message || 'Failed to send reset link.' })
    } finally {
      setLoading(false)
    }
  }


  const toggleView = (target) => {
    if (target === 'signup') {
      navigate('/signup')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blurred Background - Landing Page */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-md"></div>
        <div className="w-full h-full pointer-events-none filter blur-sm transform scale-[1.02]">
          <Home />
        </div>
      </div>

      <div
        className="relative z-20 min-h-screen flex items-center justify-center p-4 overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <div className="relative w-full max-w-4xl h-[550px]">
          <div
            className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
          >

            {/* FRONT */}
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <div className="flex h-full rounded-3xl overflow-hidden shadow-2xl">

                {/* SIGN IN */}
                <div className="w-1/2 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center px-8">
                  <h1 className="text-3xl font-bold mb-6 text-gray-800">Sign In</h1>

                  {error && !isFlipped && (
                    <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSignIn} className="w-full flex flex-col items-center gap-4" autoComplete="off">

                    {/* EMAIL */}
                    <div className="relative w-full">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                      <input
                        type="email"
                        name="email"
                        value={signInForm.email}
                        onChange={handleSignInChange}
                        placeholder="Email"
                        required
                        autoComplete="off"
                        className="w-full h-14 pl-10 pr-4 rounded-full bg-gray-50
                      text-gray-800 placeholder-gray-500
                      focus:outline-none focus:bg-sky-50 transition border border-gray-100"
                      />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative w-full">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={signInForm.password}
                        onChange={handleSignInChange}
                        placeholder="Password"
                        required
                        autoComplete="new-password"
                        className="w-full h-14 pl-10 pr-10 rounded-full bg-gray-50
                      text-gray-800 placeholder-gray-500
                      focus:outline-none focus:bg-sky-50 transition border border-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="w-full flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                      >
                        Forget Your Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-sky-400 to-green-400 text-white rounded-full font-bold hover:from-sky-500 hover:to-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loading ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>
                  </form>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-1/2 bg-gradient-to-r from-sky-400 to-green-400 flex flex-col items-center justify-center text-white px-8">
                  <h1 className="text-3xl font-bold mb-6">Hello Friend!</h1>
                  <p className="text-center mb-8">
                    Register with your personal details to use all site features
                  </p>
                  <button
                    onClick={() => toggleView('signup')}
                    className="px-8 py-3 border-2 rounded-full hover:bg-white hover:text-sky-500 transition font-bold"
                  >
                    SIGN UP
                  </button>
                </div>
              </div>
            </div>

            {/* BACK */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex h-full rounded-3xl overflow-hidden shadow-2xl">

                {/* SIGN UP */}
                <div className="w-1/2 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center px-8">
                  <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create Account</h1>

                  {error && isFlipped && (
                    <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSignUp} className="w-full flex flex-col items-center gap-4" autoComplete="off">
                    <input
                      type="text"
                      name="name"
                      value={signUpForm.name}
                      onChange={handleSignUpChange}
                      placeholder="Name"
                      required
                      autoComplete="off"
                      className="w-full h-14 px-6 rounded-full bg-gray-50 focus:outline-none focus:bg-sky-50 transition border border-gray-100"
                    />
                    <input
                      type="email"
                      name="email"
                      value={signUpForm.email}
                      onChange={handleSignUpChange}
                      placeholder="Email"
                      required
                      autoComplete="off"
                      className="w-full h-14 px-6 rounded-full bg-gray-50 focus:outline-none focus:bg-sky-50 transition border border-gray-100"
                    />

                    {/* Password */}
                    <div className="relative w-full">
                      <input
                        type={showSignUpPassword ? "text" : "password"}
                        name="password"
                        value={signUpForm.password}
                        onChange={handleSignUpChange}
                        placeholder="Password"
                        required
                        autoComplete="new-password"
                        className="w-full h-14 px-6 rounded-full bg-gray-50 focus:outline-none focus:bg-sky-50 transition border border-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10 focus:outline-none"
                      >
                        {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative w-full">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={signUpForm.confirmPassword}
                        onChange={handleSignUpChange}
                        placeholder="Confirm Password"
                        required
                        autoComplete="new-password"
                        className="w-full h-14 px-6 rounded-full bg-gray-50 focus:outline-none focus:bg-sky-50 transition border border-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-sky-400 to-green-400 text-white rounded-full font-bold hover:from-sky-500 hover:to-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loading ? 'SIGNING UP...' : 'SIGN UP'}
                    </button>
                  </form>
                </div>

                {/* WELCOME BACK */}
                <div className="w-1/2 bg-gradient-to-r from-sky-500 to-green-500 flex flex-col items-center justify-center text-white px-8">
                  <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>
                  <p className="mb-8 text-center">
                    Enter your details to use all site features
                  </p>
                  <button
                    onClick={() => toggleView('login')}
                    className="px-8 py-3 border-2 rounded-full hover:bg-white hover:text-sky-500 transition font-bold"
                  >
                    SIGN IN
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {
        showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-in zoom-in-95">
              <button
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotStatus({ type: '', message: '' })
                  setForgotEmail('')
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h3>
                <p className="text-gray-600 text-sm">Enter your email address to receive a password reset link.</p>
              </div>

              {forgotStatus.message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${forgotStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {forgotStatus.message}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-70 flex items-center justify-center"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default Login
