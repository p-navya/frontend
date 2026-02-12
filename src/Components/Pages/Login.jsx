import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye } from 'lucide-react'
import { login as loginService, register as registerService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

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

  // Sign In form state
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  })

  // Sign Up form state
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: ''
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
        setSignUpForm({ name: '', email: '', password: '' })

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

  const toggleView = (target) => {
    if (target === 'signup') {
      navigate('/signup')
    } else {
      navigate('/login')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-sky-50 p-4"
      style={{ perspective: '1000px' }}
    >
      <div className="relative w-full max-w-3xl h-[500px]">
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
        >

          {/* FRONT */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <div className="flex h-full rounded-3xl overflow-hidden shadow-2xl">

              {/* SIGN IN */}
              <div className="w-1/2 bg-white flex flex-col items-center justify-center px-12">
                <h1 className="text-5xl font-bold mb-6">Sign In</h1>



                {error && !isFlipped && (
                  <div className="w-4/5 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignIn} className="w-full flex flex-col items-center gap-4">

                  {/* EMAIL */}
                  <div className="relative w-4/5">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                    <input
                      type="email"
                      name="email"
                      value={signInForm.email}
                      onChange={handleSignInChange}
                      placeholder="Email"
                      required
                      className="w-full h-14 pl-10 pr-4 rounded-full bg-sky-50
                      text-gray-800 placeholder-gray-500
                      focus:outline-none focus:bg-sky-100 transition"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="relative w-4/5">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                    <input
                      type="password"
                      name="password"
                      value={signInForm.password}
                      onChange={handleSignInChange}
                      placeholder="Password"
                      required
                      className="w-full h-14 pl-10 pr-10 rounded-full bg-sky-50
                      text-gray-800 placeholder-gray-500
                      focus:outline-none focus:bg-sky-100 transition"
                    />
                    <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer z-10" />
                  </div>

                  <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                    Forget Your Password?
                  </a>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-4/5 h-12 bg-gradient-to-r from-sky-400 to-green-400 text-white rounded-full font-semibold hover:from-sky-500 hover:to-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'SIGNING IN...' : 'SIGN IN'}
                  </button>
                </form>
              </div>

              {/* RIGHT PANEL */}
              <div className="w-1/2 bg-gradient-to-r from-sky-400 to-green-400 flex flex-col items-center justify-center text-white px-12">
                <h1 className="text-5xl font-bold mb-6">Hello, Friend!</h1>
                <p className="text-center mb-8">
                  Register with your personal details to use all site features
                </p>
                <button
                  onClick={() => toggleView('signup')}
                  className="px-8 py-3 border-2 rounded-full hover:bg-white hover:text-sky-500 transition"
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
              <div className="w-1/2 bg-white flex flex-col items-center justify-center px-12">
                <h1 className="text-5xl font-bold mb-8">Create Account</h1>

                {error && isFlipped && (
                  <div className="w-4/5 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignUp} className="w-full flex flex-col items-center gap-4">
                  <input
                    type="text"
                    name="name"
                    value={signUpForm.name}
                    onChange={handleSignUpChange}
                    placeholder="Name"
                    required
                    className="w-4/5 h-14 px-6 rounded-full bg-sky-50 focus:outline-none focus:bg-sky-100 transition"
                  />
                  <input
                    type="email"
                    name="email"
                    value={signUpForm.email}
                    onChange={handleSignUpChange}
                    placeholder="Email"
                    required
                    className="w-4/5 h-14 px-6 rounded-full bg-sky-50 focus:outline-none focus:bg-sky-100 transition"
                  />
                  <input
                    type="password"
                    name="password"
                    value={signUpForm.password}
                    onChange={handleSignUpChange}
                    placeholder="Password"
                    required
                    className="w-4/5 h-14 px-6 rounded-full bg-sky-50 focus:outline-none focus:bg-sky-100 transition"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-4/5 h-12 bg-gradient-to-r from-sky-400 to-green-400 text-white rounded-full font-semibold hover:from-sky-500 hover:to-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'SIGNING UP...' : 'SIGN UP'}
                  </button>
                </form>
              </div>

              {/* WELCOME BACK */}
              <div className="w-1/2 bg-gradient-to-r from-sky-500 to-green-500 flex flex-col items-center justify-center text-white px-12">
                <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
                <p className="mb-8 text-center">
                  Enter your personal details to use all site features
                </p>
                <button
                  onClick={() => toggleView('login')}
                  className="px-8 py-3 border-2 rounded-full hover:bg-white hover:text-sky-500 transition"
                >
                  SIGN IN
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
