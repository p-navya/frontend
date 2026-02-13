import React from 'react'
import { Shield, Clock, Users, Zap, Award, Globe } from 'lucide-react'

const FeatureItem = ({ icon, title, description, delay }) => {
    const Icon = icon;
    return (
        <div
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-[fade-in-up_0.8s_ease-out_forwards] opacity-0"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center mb-3 text-sky-600">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-xs leading-relaxed">{description}</p>
        </div>
    );
};

const FeaturesSection = () => {
    const features = [
        {
            icon: Zap,
            title: "Real-time AI Responses",
            description: "Get instant answers and support whenever you need it, powered by advanced language models.",
            delay: 0.1
        },
        {
            icon: Shield,
            title: "Private & Secure",
            description: "Your conversations and data are encrypted and handled with strict privacy standards.",
            delay: 0.2
        },
        {
            icon: Clock,
            title: "24/7 Availability",
            description: "Unlike human counselors or advisors, StudyBuddyAI is always awake and ready to help.",
            delay: 0.3
        },
        {
            icon: Users,
            title: "Community Driven",
            description: "Connect with peers, share resources, and grow together in a supportive environment.",
            delay: 0.4
        },
        {
            icon: Award,
            title: "Personalized Growth",
            description: "Adaptive learning paths and suggestions tailored specifically to your goals and needs.",
            delay: 0.5
        },
        {
            icon: Globe,
            title: "Accessible Anywhere",
            description: "Access your dashboard from any device, ensuring your support system travels with you.",
            delay: 0.6
        }
    ]

    return (
        <section className="py-10 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Built for Your Success
                    </h2>
                    <p className="text-base text-gray-600">
                        We combine cutting-edge AI technology with student-centric design to provide a superior support experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <FeatureItem key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
