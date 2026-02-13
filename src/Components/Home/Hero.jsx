import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Briefcase, BookOpen, Sparkles } from 'lucide-react'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 bg-sky-50">
      {/* Animated background */}
      <div
        className="absolute inset-0 bg-linear-to-r from-sky-400 via-green-400 to-blue-400 opacity-10 bg-size-[200%_200%] animate-[gradient-shift_8s_ease_infinite]"
      />

      {/* Floating elements */}
      <div
        className="absolute top-1/4 left-[15%] w-16 h-16 rounded-2xl bg-green-500/20 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite]"
      />
      <div
        className="absolute top-1/3 right-[20%] w-12 h-12 rounded-xl bg-blue-500/20 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite_2s]"
      />
      <div
        className="absolute bottom-1/3 left-[25%] w-10 h-10 rounded-lg bg-orange-500/20 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite_4s]"
      />
      <div
        className="absolute bottom-1/4 right-[15%] w-14 h-14 rounded-2xl bg-sky-500/20 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite_1s]"
      />

      <div className="container mx-auto relative z-10 px-4 pt-2 pb-6 md:pt-4 md:pb-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/50 border border-sky-400/20 mb-6 animate-[fade-in_0.6s_ease-out_forwards]">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-xs font-medium text-gray-800/80">AI-Powered Student Support</span>
          </div>

          {/* Main heading */}
          <h5
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 animate-[fade-in-up_0.8s_ease-out_forwards_0.1s] opacity-0 text-balance"
          >
            Your All-in-One
            <span className="block mt-1 text-gray-900">
              Digital Companion
            </span>
            <span className="block mt-1 bg-linear-to-r from-sky-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
              StudyBuddyAI
            </span>
          </h5>

          {/* Subtitle */}
          <p
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 animate-[fade-in-up_0.8s_ease-out_forwards_0.2s] opacity-0 text-balance"
          >
            Supports your mental health, guides your career path, and connects you with academic resources — all in one intelligent platform.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-[fade-in-up_0.8s_ease-out_forwards_0.3s] opacity-0"
          >
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-linear-to-r from-sky-400 to-green-400 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-gray-700 font-semibold text-base border-2 border-gray-200 hover:border-sky-400 transition-all hover:scale-[1.02]"
            >
              See How It Works
            </button>
          </div>

          {/* Module indicators */}

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent" />
    </section>
  )
}

export default Hero

