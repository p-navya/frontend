import React from 'react'
import { UserPlus, MessageSquare, TrendingUp, Sparkles } from 'lucide-react'

const Step = ({ number, icon, title, description }) => {
  return (
    <div className="relative flex flex-col items-center text-center group z-10">
      {/* Step number badge */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center shadow-md z-20">
        {number}
      </div>

      {/* Icon container */}
      <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-md flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 relative z-10">
        <div className="text-sky-500">{icon}</div>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-gray-900 mb-1 text-sm">{title}</h3>
      <p className="text-xs text-gray-600 max-w-[180px]">{description}</p>
    </div>
  )
}

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: <UserPlus className="w-6 h-6" />,
      title: "Create Your Profile",
      description: "Sign up in seconds and personalize your experience.",
    },
    {
      number: 2,
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Choose Your Support",
      description: "Select mental health, career, or academic resources.",
    },
    {
      number: 3,
      icon: <Sparkles className="w-6 h-6" />,
      title: "Get AI Assistance",
      description: "Receive personalized guidance powered by advanced AI.",
    },
    {
      number: 4,
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Your Progress",
      description: "Monitor your growth and achieve your goals.",
    },
  ]

  return (
    <section className="py-0 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gray-100/30 blur-3xl" />

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Get Started in
            <span className="text-sky-500"> Minutes</span>
          </h2>
          <p className="text-gray-600 text-base mb-6">
            A simple process to unlock powerful AI-driven support.
          </p>
        </div>

        {/* Steps container with relative positioning for connection line */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection lines (desktop only) - centered vertically with icons */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-gray-200 to-transparent z-0" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="animate-[fade-in-up_0.8s_ease-out_forwards] opacity-0 relative z-10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Step {...step} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection

