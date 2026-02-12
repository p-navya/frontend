import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sun, CloudRain, Coffee, ArrowRight, MessageCircle, Sparkles, Smile, ArrowLeft } from 'lucide-react';

const WellnessPage = () => {
    const navigate = useNavigate();

    const handleAction = (action, initialMessage) => {
        navigate('/chat', {
            state: {
                mode: 'mental-support',
                initialMessage: initialMessage
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 font-sans">
            {/* Header */}
            <header className="px-6 py-4 flex items-center gap-4 sticky top-0 bg-white/60 backdrop-blur-md z-10">
                <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/80 rounded-full transition text-gray-600">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2 text-pink-600 font-bold text-xl">
                    <Heart className="w-6 h-6 fill-current" />
                    <span>Wellness Companion</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10">
                {/* Hero Greeting */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-block p-3 bg-pink-100 rounded-full mb-4">
                        <Smile className="w-8 h-8 text-pink-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
                        How are you feeling today?
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        It's okay to have ups and downs. I'm here to listen, motivate, or just chat whenever you need a boost.
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Motivation */}
                    <button
                        onClick={() => handleAction('motivation', 'I need some motivation. Can you give me a pep talk?')}
                        className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all border border-pink-100 text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition">
                            <Sun className="w-32 h-32 text-orange-500" />
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-500">
                            <Sun className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Need Motivation?</h3>
                        <p className="text-gray-500 mb-4">Get a boost of positivity and energy to keep going.</p>
                        <div className="flex items-center text-orange-500 font-semibold group-hover:gap-2 transition-all">
                            Get Inspired <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>

                    {/* Venting / Stress */}
                    <button
                        onClick={() => handleAction('vent', 'I have been feeling stressed lately. I want to talk about it.')}
                        className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all border border-pink-100 text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition">
                            <CloudRain className="w-32 h-32 text-blue-500" />
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                            <CloudRain className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Feeling Stressed?</h3>
                        <p className="text-gray-500 mb-4">Share what's on your mind. No judgment, just support.</p>
                        <div className="flex items-center text-blue-500 font-semibold group-hover:gap-2 transition-all">
                            Let it Out <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>

                    {/* Casual Chat */}
                    <button
                        onClick={() => handleAction('chat', 'Hi! I just wanted to chat for a bit.')}
                        className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all border border-pink-100 text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition">
                            <Coffee className="w-32 h-32 text-purple-500" />
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-500">
                            <Coffee className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Just Chatting</h3>
                        <p className="text-gray-500 mb-4">Take a break and have a casual, friendly conversation.</p>
                        <div className="flex items-center text-purple-500 font-semibold group-hover:gap-2 transition-all">
                            Start Chat <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>

                    {/* Anxiety Helper */}
                    <button
                        onClick={() => handleAction('anxiety', 'I am feeling anxious. Can you help me calm down?')}
                        className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all border border-pink-100 text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition">
                            <Sparkles className="w-32 h-32 text-teal-500" />
                        </div>
                        <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-500">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Anxiety Relief</h3>
                        <p className="text-gray-500 mb-4">Simple breathing exercises and calming techniques.</p>
                        <div className="flex items-center text-teal-500 font-semibold group-hover:gap-2 transition-all">
                            Find Calm <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>
                </div>

                {/* Daily Quote (Static for now) */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white text-center shadow-lg">
                    <h3 className="text-xl opacity-90 mb-2 font-medium">Daily Wisdom</h3>
                    <p className="text-2xl md:text-3xl font-bold serif italic">"Believe you can and you're halfway there."</p>
                    <p className="mt-4 opacity-75">— Theodore Roosevelt</p>
                </div>
            </main>
        </div>
    );
};

export default WellnessPage;
