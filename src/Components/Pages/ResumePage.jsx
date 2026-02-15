import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, ArrowLeft, Sparkles, Check, Briefcase, GraduationCap, User, Mail, Link as LinkIcon, Github, Linkedin, Plus, Trash2, Upload } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { apiRequest } from '../../config/api';

const ResumePage = () => {
    const navigate = useNavigate();
    const resumeRef = useRef();
    const [step, setStep] = useState('selection'); // selection, form, preview
    const [isGenerating, setIsGenerating] = useState(false);

    const [formData, setFormData] = useState({
        fullName: 'NAVYA PACHIGOLLA',
        title: 'AIML ENGINEER | FULL STACK WEB DEVELOPER',
        email: 'navyadhritii@gmail.com',
        linkedin: 'linkedin.com/in/p-navyaa',
        portfolio: 'navya-portfolio-eta.vercel.app/',
        github: 'github.com/p-navya',
        summary: 'B. Tech student in CSE specializing in Artificial Intelligence and Machine Learning at Malla Reddy University. Interned at Arthicus as an AI/ML Tool Engineer, working on UI/UX designs, websites, and automation tools. Skilled in Python, Full-stack Development and AI tools with a passion for building impactful solutions and solving real-world problems through innovation and technology.',
        skills: {
            languages: 'Python, Java',
            backend: 'Node.js, Flask',
            databases: 'MySQL/SQLite/Workbench, MongoDB, Firebase',
            deployment: 'Vercel, Git',
            frontend: 'HTML, CSS/Tailwind CSS/ShadCN, JavaScript, React.js/Vite',
            ai: 'Artificial Intelligence, Machine Learning',
            design: 'Canva, Figma'
        },
        experience: [
            {
                role: 'AI/ML Intern',
                company: 'Arthicus Global Pvt. Ltd.',
                location: 'Hyderabad, India',
                period: 'October 2024 – Present',
                highlights: [
                    'Developed AI-driven tools including an AI Warehouse Assistant, Ticketing System, and CRM Portal; revamped the company website for better performance and user experience.',
                    'Represented the company at HYSEA, showcasing projects and networking with tech professionals.'
                ]
            }
        ],
        projects: [
            {
                name: 'AI WAREHOUSE ASSISTANT (ARTI BOT)',
                description: 'An intelligent assistant for warehouse management, leveraging AI to optimize inventory tracking, automate stock updates, and provide actionable insights for efficient operations.'
            },
            {
                name: 'TICKETING TOOL',
                description: 'A smart support system that lets clients raise tickets, enabling the support team to manage and resolve issues efficiently post-deployment.'
            },
            {
                name: 'RASOI REVEAL',
                description: 'An AI system to extract ingredients and quantities from recipes, streamlining ingredient extraction and enabling seamless integration into meal planning tools.'
            },
            {
                name: 'MENTAL HEALTH CONVERSATIONAL AI (MINO)',
                description: 'Developed a chatbot with GPT-2, Vader Sentiment Analysis, and Tkinter to provide emotional support and enhance user engagement.'
            }
        ],
        education: {
            degree: 'B. Tech in Computer Science and Engineering (AI ML)',
            university: 'Malla Reddy University, Hyderabad, India',
            period: 'August 2022 – May 2026',
            cgpa: '9.0'
        },
        achievements: [
            'Winner of Case Presentation 2025.',
            'Salesforce Ranger (2024) certification.',
            'NPTEL Certified in Java Programming & Deep Learning (2023).',
            'Completed 10+ Coursera Certifications in AI/ML & Python and earned 40+ Microsoft Badges.',
            'Treasurer of Innovation & Entrepreneurship (I&E) Cell and Member of Computer Society of India (CSI).',
            'Event Coordinator for technical / non-technical events and E-Summit Organizer at Malla Reddy University.'
        ]
    });

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSkillChange = (skillKey, value) => {
        setFormData(prev => ({
            ...prev,
            skills: { ...prev.skills, [skillKey]: value }
        }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                role: '',
                company: '',
                location: '',
                period: '',
                highlights: ['']
            }]
        }));
    };

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        const element = resumeRef.current;
        
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: 794,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${formData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
        setIsGenerating(false);
    };

    const polishField = async (field, currentValue, context = '') => {
        if (!currentValue) return;
        setIsGenerating(true);
        try {
            const prompt = `I am building my resume for a ${formData.title} role. 
            Please professionalize and polish the following ${field} text. 
            Keep it concise, high-impact, and use professional action verbs. 
            Only return the polished text itself, nothing else.
            
            Current ${field}: "${currentValue}"
            ${context ? `Extra Context: ${context}` : ''}`;

            const data = await apiRequest('/chatbot/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: prompt,
                    mode: 'resume-builder'
                })
            });

            if (data.success) {
                const cleanedResponse = data.data.response.replace(/^["']|["']$/g, '').trim();
                handleFieldChange(field, cleanedResponse);
            }
        } catch (error) {
            console.error('AI Polish error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const polishExperience = async (index) => {
        const exp = formData.experience[index];
        if (!exp.highlights.some(h => h.trim())) return;
        
        setIsGenerating(true);
        try {
            const prompt = `I am an ${exp.role} at ${exp.company}. 
            Please rewrite my experience highlights to be more professional, ATS-friendly, and results-oriented.
            Return them as a simple list of bullet points starting with "-".
            Only return the items, nothing else.
            
            Current Highlights:
            ${exp.highlights.join('\n')}`;

            const data = await apiRequest('/chatbot/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: prompt,
                    mode: 'resume-builder'
                })
            });

            if (data.success) {
                const newHighlights = data.data.response
                    .split('\n')
                    .map(line => line.replace(/^-\s*/, '').trim())
                    .filter(line => line.length > 0);
                
                const newExperience = [...formData.experience];
                newExperience[index].highlights = newHighlights;
                setFormData(prev => ({ ...prev, experience: newExperience }));
            }
        } catch (error) {
            console.error('AI Polish error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-200 font-sans transition-all duration-500 relative">
            <header className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => step === 'selection' ? navigate('/dashboard') : setStep('selection')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-teal-600" />
                            Resume Architect
                        </h1>
                    </div>
                    {step === 'form' && (
                        <button
                            onClick={() => setStep('preview')}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition"
                        >
                            <FileText className="w-4 h-4" /> Final Preview
                        </button>
                    )}
                    {step === 'preview' && (
                        <div className="flex gap-4">
                             <button
                                onClick={() => setStep('form')}
                                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-xl font-bold transition"
                            >
                                Edit Details
                            </button>
                            <button
                                onClick={generatePDF}
                                disabled={isGenerating}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition disabled:opacity-50"
                            >
                                {isGenerating ? 'Processing...' : <><Download className="w-4 h-4" /> Download PDF</>}
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {step === 'selection' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center max-w-2xl mb-12">
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Revamp Your Professional Identity</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">Transform your details into the premium format used by industry leaders.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                            <div onClick={() => setStep('form')} className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-teal-500 transition-all cursor-pointer relative overflow-hidden">
                                <Sparkles className="absolute -top-4 -right-4 w-32 h-32 text-teal-600 opacity-5 group-hover:opacity-10 transition-opacity" />
                                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-6"><Sparkles className="w-7 h-7 text-teal-600" /></div>
                                <h3 className="text-2xl font-bold mb-2">Build Live Preview</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Enter details and get an instant high-quality PDF in the exact format requested.</p>
                                <span className="text-teal-600 font-semibold flex items-center gap-2">Start Designing <Download className="w-4 h-4" /></span>
                            </div>
                            <div onClick={() => navigate('/chat', { state: { mode: 'resume-review' } })} className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-purple-500 transition-all cursor-pointer relative overflow-hidden">
                                <FileText className="absolute -top-4 -right-4 w-32 h-32 text-purple-600 opacity-5 group-hover:opacity-10 transition-opacity" />
                                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6"><Upload className="w-7 h-7 text-purple-600" /></div>
                                <h3 className="text-2xl font-bold mb-2">AI Review & Score</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Upload an existing resume and let AI rewrite sections for maximum impact.</p>
                                <span className="text-purple-600 font-semibold flex items-center gap-2">Review Resume <ArrowLeft className="w-4 h-4 rotate-180" /></span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'form' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Form Section */}
                        <div className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 h-[80vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Resume Details</h2>
                                <p className="text-gray-500 text-sm">Fill in your information to generate the PDF.</p>
                            </div>

                            <div className="space-y-4">
                                <section className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 flex items-center gap-2"><User className="w-4 h-4"/> Basic Information</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Full Name</label>
                                            <input className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 ring-teal-500 outline-none transition" value={formData.fullName} onChange={e => handleFieldChange('fullName', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Target Role(s)</label>
                                            <input className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 ring-teal-500 outline-none transition" value={formData.title} onChange={e => handleFieldChange('title', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500">Email</label>
                                                <input className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 ring-teal-500 outline-none transition text-sm" value={formData.email} onChange={e => handleFieldChange('email', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500">LinkedIn</label>
                                                <input className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 ring-teal-500 outline-none transition text-sm" value={formData.linkedin} onChange={e => handleFieldChange('linkedin', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500">Portfolio</label>
                                                <input className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 ring-teal-500 outline-none transition text-sm" value={formData.portfolio} onChange={e => handleFieldChange('portfolio', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500">GitHub</label>
                                                <input className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 ring-teal-500 outline-none transition text-sm" value={formData.github} onChange={e => handleFieldChange('github', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 flex items-center gap-2"><FileText className="w-4 h-4"/> Professional Summary</h3>
                                        <button 
                                            onClick={() => polishField('summary', formData.summary)}
                                            disabled={isGenerating || !formData.summary}
                                            className="text-[10px] bg-teal-600/10 text-teal-600 px-2 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-teal-600/20 transition disabled:opacity-50"
                                        >
                                            <Sparkles className="w-3 h-3" /> AI Polish
                                        </button>
                                    </div>
                                    <textarea rows={4} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 ring-teal-500 outline-none text-sm transition" value={formData.summary} onChange={e => handleFieldChange('summary', e.target.value)} />
                                </section>

                                <section className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 flex items-center gap-2"><Briefcase className="w-4 h-4"/> Professional Experience</h3>
                                        <button onClick={addExperience} className="text-xs bg-teal-600 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-teal-700 transition"><Plus className="w-3 h-3"/> Add</button>
                                    </div>
                                    <div className="space-y-6">
                                        {formData.experience.map((exp, idx) => (
                                            <div key={idx} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 relative group/exp">
                                                <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover/exp:opacity-100 transition"><Trash2 className="w-4 h-4"/></button>
                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                    <input placeholder="Role" className="col-span-2 text-sm font-bold border-b border-gray-100 p-1 w-full outline-none focus:border-teal-500 bg-transparent" value={exp.role} onChange={e => {
                                                        const newExp = [...formData.experience];
                                                        newExp[idx].role = e.target.value;
                                                        setFormData(prev => ({ ...prev, experience: newExp }));
                                                    }} />
                                                    <input placeholder="Company" className="text-xs border-b border-gray-100 p-1 w-full outline-none focus:border-teal-500 bg-transparent" value={exp.company} onChange={e => {
                                                        const newExp = [...formData.experience];
                                                        newExp[idx].company = e.target.value;
                                                        setFormData(prev => ({ ...prev, experience: newExp }));
                                                    }} />
                                                    <input placeholder="Period (e.g. Oct 2024 - Present)" className="text-xs border-b border-gray-100 p-1 w-full outline-none focus:border-teal-500 bg-transparent text-right" value={exp.period} onChange={e => {
                                                        const newExp = [...formData.experience];
                                                        newExp[idx].period = e.target.value;
                                                        setFormData(prev => ({ ...prev, experience: newExp }));
                                                    }} />
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Experience Highlights</label>
                                                    <button 
                                                        onClick={() => polishExperience(idx)}
                                                        disabled={isGenerating || exp.highlights.some(h => !h.trim())}
                                                        className="text-[10px] bg-teal-600/10 text-teal-600 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 hover:bg-teal-600/20 transition disabled:opacity-50"
                                                    >
                                                        <Sparkles className="w-3 h-3" /> AI Polish Bullets
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {exp.highlights.map((h, hidx) => (
                                                        <input key={hidx} placeholder="Focus on achievements..." className="w-full text-xs p-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg outline-none focus:ring-1 ring-teal-500 transition" value={h} onChange={e => {
                                                            const newExp = [...formData.experience];
                                                            newExp[idx].highlights[hidx] = e.target.value;
                                                            setFormData(prev => ({ ...prev, experience: newExp }));
                                                        }} />
                                                    ))}
                                                    <button onClick={() => {
                                                        const newExp = [...formData.experience];
                                                        newExp[idx].highlights.push('');
                                                        setFormData(prev => ({ ...prev, experience: newExp }));
                                                    }} className="text-[10px] text-teal-600 hover:underline">+ Add Bullet</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 flex items-center gap-2"><GraduationCap className="w-4 h-4"/> Education</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="Degree" className="col-span-2 text-sm font-bold border-b border-gray-100 p-1 w-full outline-none focus:border-teal-500 bg-transparent" value={formData.education.degree} onChange={e => {
                                            setFormData(prev => ({ ...prev, education: { ...prev.education, degree: e.target.value } }));
                                        }} />
                                        <input placeholder="University" className="text-xs border-b border-gray-100 p-1 w-full outline-none focus:border-teal-500 bg-transparent" value={formData.education.university} onChange={e => {
                                            setFormData(prev => ({ ...prev, education: { ...prev.education, university: e.target.value } }));
                                        }} />
                                        <input placeholder="Period" className="text-xs border-b border-gray-100 p-1 w-full outline-none focus:border-teal-500 bg-transparent text-right" value={formData.education.period} onChange={e => {
                                            setFormData(prev => ({ ...prev, education: { ...prev.education, period: e.target.value } }));
                                        }} />
                                    </div>
                                </section>

                                <section className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Technical Skills</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.keys(formData.skills).map(key => (
                                            <div key={key}>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">{key}</label>
                                                <input className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 focus:ring-2 ring-teal-500 outline-none text-sm transition" value={formData.skills[key]} onChange={e => handleSkillChange(key, e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Fast Preview Section */}
                        <div className="sticky top-24 h-[80vh] border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-2xl bg-gray-100/50 dark:bg-gray-900/20 backdrop-blur-sm flex flex-col">
                            <div className="bg-white/80 dark:bg-gray-800/80 p-4 border-b flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Auto-Formatted Preview</span>
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-200/30">
                                <div className="bg-white shadow-2xl transform scale-[0.6] origin-top">
                                    <ResumeTemplate data={formData} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'preview' && (
                    <div className="flex flex-col items-center animate-in fade-in duration-500">
                         <div className="mb-10 text-center">
                            <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">Review Your Professional Resume</h2>
                            <p className="text-gray-500">The document is perfectly formatted for A4 printing and ATS systems.</p>
                         </div>
                         <div className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] mb-12 select-none" style={{ width: '210mm', minHeight: '297mm' }}>
                            <div ref={resumeRef}>
                                <ResumeTemplate data={formData} />
                            </div>
                         </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const ResumeTemplate = ({ data }) => {
    return (
        <div id="resume-document" className="bg-white text-black p-[40px] font-serif leading-[1.3] text-[12px] w-[210mm] min-h-[297mm] mx-auto box-border text-left relative" style={{ color: '#000', backgroundColor: '#fff' }}>
            <header className="mb-6">
                <h1 className="text-[36px] font-bold tracking-tight mb-1 uppercase" style={{ fontFamily: 'Georgia, serif' }}>{data.fullName}</h1>
                <div className="text-[15px] font-medium text-gray-600 mb-3 tracking-wider uppercase">
                    {data.title}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-sans">
                    <a href={`mailto:${data.email}`} className="text-blue-800 underline flex items-center gap-1">{data.email}</a>
                    {data.linkedin && <><span className="text-gray-300">|</span> <a href="#" className="text-blue-800 underline">{data.linkedin}</a></>}
                    {data.portfolio && <><span className="text-gray-300">|</span> <a href="#" className="text-blue-800 underline">{data.portfolio}</a></>}
                    {data.github && <><span className="text-gray-300">|</span> <a href="#" className="text-blue-800 underline">{data.github}</a></>}
                </div>
            </header>

            <div className="mb-6">
                <h2 className="text-[13px] font-bold border-b-2 border-blue-800 mb-2 uppercase tracking-wide">Summary</h2>
                <p className="text-justify leading-relaxed text-[12px]">{data.summary}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-[13px] font-bold border-b-2 border-blue-800 mb-2 uppercase tracking-wide">Technical Skills</h2>
                <div className="grid grid-cols-2 gap-x-12 gap-y-1 text-[11.5px]">
                    <div className="space-y-1">
                        <div><strong className="font-bold">Programming Languages:</strong> {data.skills.languages}</div>
                        <div><strong className="font-bold">Databases:</strong> {data.skills.databases}</div>
                        <div><strong className="font-bold">Frontend Technologies:</strong> {data.skills.frontend}</div>
                        <div><strong className="font-bold">Design Tools:</strong> {data.skills.design}</div>
                    </div>
                    <div className="space-y-1">
                        <div><strong className="font-bold">Backend Technologies:</strong> {data.skills.backend}</div>
                        <div><strong className="font-bold">Deployment & Version Control:</strong> {data.skills.deployment}</div>
                        <div><strong className="font-bold">AI/ML:</strong> {data.skills.ai}</div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-[13px] font-bold border-b-2 border-blue-800 mb-2 uppercase tracking-wide">Professional Experience</h2>
                {data.experience.map((exp, i) => (
                    <div key={i} className="mb-3">
                        <div className="flex justify-between font-bold text-[13px]">
                            <span>{exp.role} ({exp.company}, {exp.location})</span>
                            <span className="text-[11px] uppercase">{exp.period}</span>
                        </div>
                        <ul className="list-disc ml-5 mt-1.5 space-y-1 text-[11.5px]">
                            {exp.highlights.map((bullet, j) => (
                                <li key={j} className="text-justify">{bullet}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <h2 className="text-[13px] font-bold border-b-2 border-blue-800 mb-2 uppercase tracking-wide">Projects</h2>
                <ul className="list-disc ml-5 space-y-2 text-[11.5px]">
                    {data.projects.map((proj, i) => (
                        <li key={i}>
                            <strong className="font-bold uppercase">{proj.name}</strong>: {proj.description}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-[13px] font-bold border-b-2 border-blue-800 mb-2 uppercase tracking-wide">Education</h2>
                <div className="flex justify-between font-bold text-[13px]">
                    <span>{data.education.degree}</span>
                    <span className="text-[11px] uppercase">{data.education.period}</span>
                </div>
                <div className="mt-0.5 text-gray-700 italic">{data.education.university}</div>
                <div className="mt-0.5 font-semibold">CGPA: {data.education.cgpa}</div>
            </div>

            <div className="mb-6">
                <h2 className="text-[13px] font-bold border-b-2 border-blue-800 mb-2 uppercase tracking-wide">Co-Curricular & Achievements</h2>
                <ul className="list-disc ml-5 space-y-1 mt-1 text-[11.5px]">
                    {data.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ResumePage;
