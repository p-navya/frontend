import React from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const PricingCard = ({ title, price, period, description, features, isPopular, buttonText, buttonVariant }) => (
    <div className={`relative flex flex-col p-6 rounded-2xl border ${isPopular ? 'border-sky-500 shadow-xl lg:scale-105 bg-white' : 'border-gray-200 bg-gray-50/50'} transition-all duration-300`}>
        {isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full">
                Most Popular
            </div>
        )}

        <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-xs text-gray-500">{description}</p>
        </div>

        <div className="mb-4">
            <span className="text-3xl font-extrabold text-gray-900">{price}</span>
            {period && <span className="text-gray-500 text-xs ml-1">{period}</span>}
        </div>

        <ul className="space-y-3 mb-6 flex-1">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-gray-600">
                    <Check className={`w-4 h-4 shrink-0 ${isPopular ? 'text-sky-500' : 'text-gray-400'}`} />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        <Link to="/signup" className={`w-full py-2.5 px-6 rounded-lg font-semibold text-sm transition-all text-center inline-block ${buttonVariant === 'primary'
            ? 'bg-linear-to-r from-sky-400 to-blue-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02]'
            : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}>
            {buttonText}
        </Link>
    </div>
)

const PricingSection = () => {
    const plans = [
        {
            title: "Free",
            price: "$0",
            description: "Essential tools for every student.",
            features: [
                "Access to basic AI Chatbot",
                "Community Forum Access",
                "Limited Resource Downloads",
                "Basic Study Timer"
            ],
            isPopular: false,
            buttonText: "Get Started",
            buttonVariant: "secondary"
        },
        {
            title: "Pro Student",
            price: "$9",
            period: "/month",
            description: "Advanced features for serious learners.",
            features: [
                "Unlimited AI Chat & Resume Checks",
                "Career Path Analysis",
                "Premium Resource Library",
                "Priority Support",
                "Ad-free Experience"
            ],
            isPopular: true,
            buttonText: "Try Pro Free",
            buttonVariant: "primary"
        },
        {
            title: "Institution",
            price: "Custom",
            description: "For universities and schools.",
            features: [
                "Admin Dashboard",
                "Student Analytics",
                "SSO Integration",
                "Custom Branding",
                "Dedicated Success Manager"
            ],
            isPopular: false,
            buttonText: "Contact Sales",
            buttonVariant: "secondary"
        }
    ]

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-base text-gray-600">
                        Choose the plan that fits your study needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {plans.map((plan, index) => (
                        <PricingCard key={index} {...plan} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PricingSection
