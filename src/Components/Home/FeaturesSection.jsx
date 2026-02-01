import React from 'react'
import { Shield, Zap, Users, Lock, Brain, BarChart3 } from 'lucide-react'

const Feature = ({ icon, title, description }) => {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
        <div className="text-sky-500">{icon}</div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Advanced NLP & Sentiment Analysis",
      description: "Our AI understands context, emotion, and intent to provide truly helpful responses.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Privacy First & FERPA Compliant",
      description: "Your conversations and data are encrypted and never shared. Complete anonymity guaranteed.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant, Always Available",
      description: "Get support 24/7 without waiting. Our AI is always ready to help when you need it.",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Document Intelligence",
      description: "Upload resumes, notes, or papers and get instant AI-powered analysis and insights.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Peer Collaboration",
      description: "Connect with fellow students, share resources, and build study groups.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Secure & Scalable",
      description: "Built on microservices architecture to handle millions of users reliably.",
    },
  ]

  return (
    <section className="py-0 bg-gray-50 relative">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for Students,
            <span className="block text-sky-500">Powered by AI</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Cutting-edge technology designed with your success in mind.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="animate-[fade-in-up_0.8s_ease-out_forwards] opacity-0"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Feature {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

