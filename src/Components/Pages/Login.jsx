import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye } from 'lucide-react'
import { login as loginService, register as registerService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const [isFlipped, setIsFlipped] = useState(false)
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
  
  const navigate = useNavigate()
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
        setAuth(response.data.user, response.data.token, false)
        navigate('/dashboard')
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

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4"
      style={{ perspective: '1000px' }}
    >
      <div className="relative w-full max-w-3xl h-[500px]">
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >

          {/* FRONT */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <div className="flex h-full rounded-3xl overflow-hidden shadow-2xl">

              {/* SIGN IN */}
              <div className="w-1/2 bg-white flex flex-col items-center justify-center px-12">
                <h1 className="text-5xl font-bold mb-6">Sign In</h1>
                
                {/* Social Login Buttons */}
                <div className="flex gap-3 mb-6">
                  {/* Google */}
                  <button
                    type="button"
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 bg-white flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-6 h-6"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.6 20.5H42V20H24v8h11.3C33.6 31.5 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.2-.4-3.5z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.3 14.7l6.6 4.8C14.4 16 18.8 13 24 13c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.9 6.1 29.2 4 24 4 16.1 4 9.4 8.3 6.3 14.7z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.3C29.3 35 26.8 36 24 36c-5.2 0-9.5-3.5-11.1-8.3l-6.6 5.1C9.4 39.7 16.1 44 24 44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.4 5.8-6.5 7.2l6.2 5.3C38 39.5 42 32.9 42 24c0-1.3-.1-2.2-.4-3.5z"
                      />
                    </svg>
                  </button>
                  {/* GitHub */}
                  <button
                    type="button"
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 bg-white flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-gray-800"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12c0 4.657 3.022 8.606 7.213 10.002.527.097.719-.229.719-.508 0-.251-.01-1.086-.015-1.97-2.935.638-3.556-1.257-3.556-1.257-.48-1.219-1.172-1.543-1.172-1.543-.957-.655.073-.642.073-.642 1.059.074 1.617 1.088 1.617 1.088.94 1.611 2.466 1.146 3.067.876.095-.681.368-1.146.67-1.41-2.344-.267-4.807-1.172-4.807-5.214 0-1.152.411-2.093 1.086-2.831-.109-.267-.471-1.343.104-2.801 0 0 .888-.284 2.91 1.081A10.13 10.13 0 0 1 12 6.07c.9.004 1.806.122 2.653.357 2.02-1.365 2.906-1.081 2.906-1.081.577 1.458.215 2.534.106 2.801.676.738 1.084 1.679 1.084 2.831 0 4.053-2.468 4.944-4.818 5.205.379.327.717.973.717 1.962 0 1.416-.013 2.559-.013 2.907 0 .281.189.61.724.507C19.48 20.602 22.5 16.655 22.5 12c0-5.799-4.701-10.5-10.5-10.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {/* LinkedIn */}
                  <button
                    type="button"
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 bg-white flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-[#0A66C2]"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452H17.21V14.86c0-1.332-.027-3.046-1.858-3.046-1.86 0-2.144 1.45-2.144 2.948v5.69H9.006V9h3.112v1.561h.045c.434-.822 1.494-1.69 3.073-1.69 3.287 0 3.893 2.164 3.893 4.977v6.604z" />
                      <path d="M5.337 7.433a1.804 1.804 0 1 1 0-3.608 1.804 1.804 0 0 1 0 3.608zM6.777 20.452H3.894V9h2.883v11.452z" />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-600 mb-8">or use your email password</p>

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
                      className="w-full h-14 pl-10 pr-4 rounded-full bg-blue-50
                      text-gray-800 placeholder-gray-500
                      focus:outline-none focus:bg-blue-100 transition"
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
                      className="w-full h-14 pl-10 pr-10 rounded-full bg-blue-50
                      text-gray-800 placeholder-gray-500
                      focus:outline-none focus:bg-blue-100 transition"
                    />
                    <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer z-10" />
                  </div>

                  <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                    Forget Your Password?
                  </a>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-4/5 h-12 bg-purple-700 text-white rounded-full font-semibold hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'SIGNING IN...' : 'SIGN IN'}
                  </button>
                </form>
              </div>

              {/* RIGHT PANEL */}
              <div className="w-1/2 bg-purple-700 flex flex-col items-center justify-center text-white px-12">
                <h1 className="text-5xl font-bold mb-6">Hello, Friend!</h1>
                <p className="text-center mb-8">
                  Register with your personal details to use all site features
                </p>
                <button
                  onClick={() => setIsFlipped(true)}
                  className="px-8 py-3 border-2 rounded-full hover:bg-white hover:text-purple-700 transition"
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
                    className="w-4/5 h-14 px-6 rounded-full bg-blue-50 focus:outline-none focus:bg-blue-100 transition" 
                  />
                  <input 
                    type="email" 
                    name="email"
                    value={signUpForm.email}
                    onChange={handleSignUpChange}
                    placeholder="Email"
                    required
                    className="w-4/5 h-14 px-6 rounded-full bg-blue-50 focus:outline-none focus:bg-blue-100 transition" 
                  />
                  <input 
                    type="password" 
                    name="password"
                    value={signUpForm.password}
                    onChange={handleSignUpChange}
                    placeholder="Password"
                    required
                    className="w-4/5 h-14 px-6 rounded-full bg-blue-50 focus:outline-none focus:bg-blue-100 transition" 
                  />

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-4/5 h-12 bg-purple-700 text-white rounded-full font-semibold hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'SIGNING UP...' : 'SIGN UP'}
                  </button>
                </form>
              </div>

              {/* WELCOME BACK */}
              <div className="w-1/2 bg-purple-900 flex flex-col items-center justify-center text-white px-12">
                <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
                <p className="mb-8 text-center">
                  Enter your personal details to use all site features
                </p>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="px-8 py-3 border-2 rounded-full hover:bg-white hover:text-purple-700 transition"
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
