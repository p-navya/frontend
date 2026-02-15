import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, ArrowLeft, Sparkles, Check, Briefcase, GraduationCap, User } from 'lucide-react';

const ResumePage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('selection'); // selection, form, upload

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: '',
        experience: '',
        education: '',
        skills: ''
    });

    const handleStartBuild = () => {
        setStep('form');
    };

    const handleStartAnalyze = () => {
        // For analysis, we can guide them to the chat with a specific intent
        // Or implement a simple upload UI here that redirects
        navigate('/chat', { state: { mode: 'resume-review', initialMessage: "I'd like to review my resume. I'll upload it now." } });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Construct a prompt from the form data
        const prompt = `I need help building a resume. Here are my details:
        Name: ${formData.fullName}
        Role: ${formData.role}
        Email: ${formData.email}
        Experience: ${formData.experience}
        Education: ${formData.education}
        Skills: ${formData.skills}
        
        Please draft a professional resume for me based on this information.`;

        // Navigate to chat with this prompt
        navigate('/chat', { state: { mode: 'resume-builder', initialMessage: prompt } });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-200 font-sans transition-all duration-500 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-teal-400/10 dark:bg-teal-600/5 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-400/10 dark:bg-blue-600/5 blur-[100px] rounded-full animate-pulse [animation-delay:3s]" />
            </div>
            {/* Header */}
            <header className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-teal-600" />
                            Resume Architect
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

                {step === 'selection' && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center max-w-2xl mb-12">
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Build Your Perfect Resume</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">Choose how you want to get started. Our AI can build a resume from scratch or analyze your existing one.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                            {/* Build Option */}
                            <div
                                onClick={handleStartBuild}
                                className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Sparkles className="w-32 h-32 text-teal-600" />
                                </div>
                                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Sparkles className="w-7 h-7 text-teal-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Build from Scratch</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Enter your details and let our AI draft a professional, ATS-optimized resume for you in seconds.</p>
                                <span className="inline-flex items-center text-teal-600 font-semibold group-hover:gap-2 transition-all">
                                    Start Building <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                </span>
                            </div>

                            {/* Analyze Option */}
                            <div
                                onClick={handleStartAnalyze}
                                className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FileText className="w-32 h-32 text-purple-600" />
                                </div>
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Upload className="w-7 h-7 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyze Existing</h3>
                                <p className="text-gray-600 mb-6">Upload your current resume. We'll score it against ATS standards and suggest improvements.</p>
                                <span className="inline-flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                                    Upload & Analyze <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'form' && (
                    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tell us about yourself</h2>
                            <p className="text-gray-600 dark:text-gray-400">We'll use this information to draft your resume.</p>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><User className="w-4 h-4" /> Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900 outline-none transition"
                                        placeholder="e.g. John Doe"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Target Role</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900 outline-none transition"
                                        placeholder="e.g. Software Engineer"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900 outline-none transition"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience Highlights</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900 outline-none transition min-h-[100px]"
                                    placeholder="Briefly describe your recent roles and achievements..."
                                    value={formData.experience}
                                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Education</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900 outline-none transition min-h-[80px]"
                                    placeholder="Degree, University, Graduation Year..."
                                    value={formData.education}
                                    onChange={e => setFormData({ ...formData, education: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Skills</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900 outline-none transition"
                                    placeholder="e.g. React, Node.js, Project Management..."
                                    value={formData.skills}
                                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStep('selection')}
                                    className="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-lg hover:shadow-teal-500/30 transition flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" /> Generate Resume with AI
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResumePage;
