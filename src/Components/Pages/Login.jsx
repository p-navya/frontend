import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, X, User } from 'lucide-react'
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
  const [signupSuccess, setSignupSuccess] = useState(false)

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
        setSignupSuccess(true)
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

  const handleSocialLogin = (provider) => {
    // In a real app, this would redirect to your backend OAuth endpoint
    // Example: window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
    console.log(`Initiating social login with ${provider}`);
    setError(`Social login with ${provider} is coming soon! Requires backend OAuth setup.`);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) return

    setLoading(true)
    setForgotStatus({ type: '', message: '' })

    try {
      await forgotPasswordService(forgotEmail)
      setForgotStatus({ type: 'success', message: 'Password reset link sent! Check your inbox to resend or reset.' })
      // Keep forgotEmail so user can resend if needed
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
      setSignupSuccess(false)
    }
  }

  const background = useMemo(() => (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-md"></div>
      <div className="w-full h-full pointer-events-none filter blur-sm transform scale-[1.02]">
        <Home />
      </div>
    </div>
  ), [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blurred Background - Landing Page */}
      {background}

      <div
        className="relative z-20 min-h-screen flex items-center justify-center p-4 overflow-hidden"
      >
        <div className="relative w-full max-w-md">
          <div className="bg-white/80 dark:bg-black/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 bg-gradient-to-br from-sky-400/10 via-green-400/10 to-blue-400/10">

            {!isFlipped ? (
              /* SIGN IN VIEW */
              <div className="flex flex-col items-center">
                <div className="h-12 flex items-center justify-center">
                  <span className="font-['Pacifico'] text-4xl gradient-text animate-write drop-shadow-sm pb-1">
                    hello..
                  </span>
                </div>
                <h1 className="text-2xl font-bold mt-2 mb-2 text-gray-800 dark:text-white">Sign In</h1>

                {/* Social Icons */}
                <div className="flex gap-4 mb-4">
                  {/* Google */}
                  <button
                    onClick={() => handleSocialLogin('google')}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-transparent border-none"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </button>
                  {/* LinkedIn */}
                  <button
                    onClick={() => handleSocialLogin('linkedin')}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-transparent border-none"
                  >
                    <svg className="w-6 h-6 text-[#0077b5] fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </button>
                  {/* Microsoft */}
                  <button
                    onClick={() => handleSocialLogin('microsoft')}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-transparent border-none"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                  </button>
                  {/* GitHub */}
                  <button
                    onClick={() => handleSocialLogin('github')}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-transparent border-none"
                  >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white fill-current" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </button>
                </div>

                <div className="w-full flex items-center justify-between mb-4">
                  <div className="h-px bg-white/30 dark:bg-white/10 w-full"></div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm px-4 whitespace-nowrap">or</span>
                  <div className="h-px bg-white/30 dark:bg-white/10 w-full"></div>
                </div>

                {error && (
                  <div className="w-full mb-4 p-3 bg-red-100/90 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}

                {signupSuccess && (
                  <div className="w-full mb-4 p-3 bg-green-100/90 border border-green-400 text-green-700 rounded-lg text-sm text-center">
                    Account created! Please sign in with your email.
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
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/80 dark:focus:bg-black/50 transition"
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
                      className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/80 dark:focus:bg-black/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 z-10 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="w-full flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(signInForm.email)
                        setShowForgotPassword(true)
                      }}
                      className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:underline"
                    >
                      Forget Your Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-4/5 h-10 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full font-bold hover:from-teal-600 hover:to-green-600 transition shadow-lg mt-2"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <button
                    onClick={() => toggleView('signup')}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </div>
              </div>

            ) : (
              /* SIGN UP VIEW */
              <div className="flex flex-col items-center">
                <div className="h-12 flex items-center justify-center">
                  <span className="font-['Pacifico'] text-4xl gradient-text animate-write drop-shadow-sm pb-1">
                    hello..
                  </span>
                </div>
                <h1 className="text-2xl font-bold mt-2 mb-2 text-gray-800 dark:text-white">Create Account</h1>



                {error && (
                  <div className="w-full mb-4 p-3 bg-red-100/90 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignUp} className="w-full flex flex-col items-center gap-4" autoComplete="off">
                  {/* NAME */}
                  <div className="relative w-full">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                    <input
                      type="text"
                      name="name"
                      value={signUpForm.name}
                      onChange={handleSignUpChange}
                      placeholder="Full Name"
                      required
                      autoComplete="off"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/80 dark:focus:bg-black/50 transition"
                    />
                  </div>
                  {/* EMAIL */}
                  <div className="relative w-full">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                    <input
                      type="email"
                      name="email"
                      value={signUpForm.email}
                      onChange={handleSignUpChange}
                      placeholder="Email"
                      required
                      autoComplete="off"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/80 dark:focus:bg-black/50 transition"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="relative w-full">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      name="password"
                      value={signUpForm.password}
                      onChange={handleSignUpChange}
                      placeholder="Password"
                      required
                      autoComplete="new-password"
                      className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/80 dark:focus:bg-black/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 z-10 focus:outline-none"
                    >
                      {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="relative w-full">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={signUpForm.confirmPassword}
                      onChange={handleSignUpChange}
                      placeholder="Re-enter Password"
                      required
                      autoComplete="new-password"
                      className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/80 dark:focus:bg-black/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 z-10 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-4/5 h-10 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full font-bold hover:from-teal-600 hover:to-green-600 transition shadow-lg mt-2"
                  >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </form>

                <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                  <button
                    onClick={() => toggleView('login')}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
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
