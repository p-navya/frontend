import React from 'react'
import { FileText, Video, Users, BookOpen } from 'lucide-react'

const ResourceCard = ({ icon, title, description, count }) => {
    const Icon = icon;
    return (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {count}
                </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
};

const ResourcesSection = () => {
    const resources = [
        {
            icon: FileText,
            title: "Lecture Notes",
            description: "Comprehensive notes from top students.",
            count: "500+ Docs"
        },
        {
            icon: Video,
            title: "Video Tutorials",
            description: "Curated video explanations for complex topics.",
            count: "200+ Hours"
        },
        {
            icon: BookOpen,
            title: "Practice Papers",
            description: "Past exam papers and mock tests.",
            count: "150+ Sets"
        },
        {
            icon: Users,
            title: "Study Groups",
            description: "Join subject-specific discussion forums.",
            count: "50+ Active"
        },
    ]

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <span className="text-orange-500 font-bold tracking-wider uppercase text-xl block mb-2">Academic Resource Hub</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                        Curated Resources for <span className="text-orange-500">Better Learning</span>
                    </h2>
                    <p className="text-base text-gray-600 mt-2 mb-6">
                        Access a vast library of study materials shared by the community.
                    </p>
                    <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors">
                        View All Resources
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map((resource, index) => (
                        <ResourceCard key={index} {...resource} />
                    ))}
                </div>

                {/* Banner/Callout */}
                <div className="mt-12 bg-linear-to-r from-orange-500 to-red-500 rounded-2xl p-5 md:px-10 md:py-6 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Have useful notes?</h3>
                            <p className="text-orange-100 text-sm">Share your knowledge and earn community badges.</p>
                        </div>
                        <button className="px-6 py-2.5 bg-white text-orange-600 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
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
