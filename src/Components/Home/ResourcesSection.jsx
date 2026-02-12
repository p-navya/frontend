import React from 'react'
import { FileText, Video, Users, BookOpen } from 'lucide-react'

const ResourceCard = ({ icon, title, description, count }) => {
    const Icon = icon;
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {count}
                </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
};

const ResourcesSection = () => {
    const resources = [
        {
            icon: FileText,
            title: "Lecture Notes",
            description: "Comprehensive notes from top students covering various subjects and courses.",
            count: "500+ Docs"
        },
        {
            icon: Video,
            title: "Video Tutorials",
            description: "Curated video explanations for complex topics and problem-solving techniques.",
            count: "200+ Hours"
        },
        {
            icon: BookOpen,
            title: "Practice Papers",
            description: "Past exam papers and mock tests to help you prepare for your finals.",
            count: "150+ Sets"
        },
        {
            icon: Users,
            title: "Study Groups",
            description: "Join subject-specific discussion forums to ask questions and share knowledge.",
            count: "50+ Active"
        },
    ]

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="text-orange-500 font-semibold tracking-wider uppercase text-sm">Academic Hub</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                        Curated Resources for <span className="text-orange-500">Better Learning</span>
                    </h2>
                    <p className="text-lg text-gray-600 mt-4 mb-8">
                        Access a vast library of study materials shared by the community and verified by experts.
                    </p>
                    <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors">
                        View All Resources
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map((resource, index) => (
                        <ResourceCard key={index} {...resource} />
                    ))}
                </div>

                {/* Banner/Callout */}
                <div className="mt-16 bg-linear-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Have useful notes?</h3>
                            <p className="text-orange-100">Share your knowledge and earn community badges.</p>
                        </div>
                        <button className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
                            Upload Material
                        </button>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </div>
            </div>
        </section>
    )
}

export default ResourcesSection
