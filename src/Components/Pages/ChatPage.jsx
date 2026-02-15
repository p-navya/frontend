import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, X, ArrowLeft, Plus, History, MessageSquare, Menu, MoreVertical, Edit, Trash2, Share2, Check, Sparkles, RefreshCcw, Smile, User, Brain } from 'lucide-react';
import { sendChatMessage } from '../../services/chatbotService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

console.log("ChatPage Revamp v4 Loaded - Intelligence & History Update");

const ChatPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [activeMenuChatId, setActiveMenuChatId] = useState(null);
    const [editingChatId, setEditingChatId] = useState(null);
    const [newChatTitle, setNewChatTitle] = useState('');
    const [currentMode, setCurrentMode] = useState('studybuddy-ai');

    const modes = [
        { id: 'studybuddy-ai', label: 'StudyBuddy AI', icon: Bot, color: 'text-blue-600', bg: 'bg-blue-600/10' },
        { id: 'student-helper', label: 'Academic Assistant', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { id: 'mental-support', label: 'Mental Support', icon: Smile, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { id: 'resume-builder', label: 'Resume Architect', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const [displaySuggestions, setDisplaySuggestions] = useState([
        { label: "Deep dive into Calculus", prompt: "Explain the fundamental theorem of calculus in simple terms." },
        { label: "Study plan for finals", prompt: "Create a 2-week study plan for my upcoming finals." },
        { label: "Summarize my notes", prompt: "I'll upload a PDF of my notes, can you summarize the key concepts?" },
        { label: "Practice quiz help", prompt: "Give me 5 practice questions about cellular biology." }
    ]);

    const allSuggestions = [
        { label: "Deep dive into Calculus", prompt: "Explain the fundamental theorem of calculus in simple terms." },
        { label: "Study plan for finals", prompt: "Create a 2-week study plan for my upcoming finals." },
        { label: "Summarize my notes", prompt: "I'll upload a PDF of my notes, can you summarize the key concepts?" },
        { label: "Practice quiz help", prompt: "Give me 5 practice questions about cellular biology." },
        { label: "History Timeline", prompt: "Create a timeline of the most important events in the French Revolution." },
        { label: "Coding Debugger", prompt: "Explain how this JavaScript async/await code works and find potential bugs." },
        { label: "Writing Better Essays", prompt: "Give me 3 different hooks for an essay about climate change policy." },
        { label: "Quick Math Shortcuts", prompt: "What are some mental math tricks for calculating percentages quickly?" }
    ];

    const shuffleSuggestions = () => {
        const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
        setDisplaySuggestions(shuffled.slice(0, 4));
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const chatIdFromUrl = queryParams.get('id');

        const savedHistory = localStorage.getItem('studybuddy_chat_history');
        if (savedHistory) {
            const parsedHistory = JSON.parse(savedHistory);
            setChatHistory(parsedHistory);

            if (chatIdFromUrl) {
                const targetChat = parsedHistory.find(chat => chat.id.toString() === chatIdFromUrl);
                if (targetChat) {
                    setCurrentChatId(targetChat.id);
                    setMessages(targetChat.messages);
                }
            }
        }
    }, [location.search]);

    useEffect(() => {
        if (location.state?.initialMessage) {
            setInputMessage(location.state.initialMessage);
        }
    }, [location.state]);

    useEffect(() => {
        if (messages.length > 0) {
            const previewText = messages[0].content.length > 30
                ? messages[0].content.substring(0, 30) + '...'
                : messages[0].content;

            if (currentChatId) {
                setChatHistory(prev => {
                    const updated = prev.map(chat =>
                        chat.id === currentChatId
                            ? { ...chat, messages, preview: previewText }
                            : chat
                    );
                    localStorage.setItem('studybuddy_chat_history', JSON.stringify(updated));
                    return updated;
                });
            } else {
                const newId = Date.now();
                const newChat = {
                    id: newId,
                    title: previewText || 'New Chat',
                    messages: messages,
                    date: 'Today',
                    preview: previewText
                };
                setCurrentChatId(newId);
                setChatHistory(prev => {
                    const updated = [newChat, ...prev];
                    localStorage.setItem('studybuddy_chat_history', JSON.stringify(updated));
                    return updated;
                });
            }
        }
    }, [messages, currentChatId]);

    const loadChat = (chat) => {
        setCurrentChatId(chat.id);
        setMessages(chat.messages);
        setIsHistoryOpen(false);
    };

    const deleteChat = (e, chatId) => {
        e.stopPropagation();
        const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
        setChatHistory(updatedHistory);
        localStorage.setItem('studybuddy_chat_history', JSON.stringify(updatedHistory));
        if (currentChatId === chatId) {
            setMessages([]);
            setCurrentChatId(null);
        }
        setActiveMenuChatId(null);
    };

    const startRenaming = (e, chat) => {
        e.stopPropagation();
        setEditingChatId(chat.id);
        setNewChatTitle(chat.title);
        setActiveMenuChatId(null);
    };

    const saveRename = (e) => {
        e.stopPropagation();
        if (editingChatId) {
            const updatedHistory = chatHistory.map(chat =>
                chat.id === editingChatId ? { ...chat, title: newChatTitle } : chat
            );
            setChatHistory(updatedHistory);
            localStorage.setItem('studybuddy_chat_history', JSON.stringify(updatedHistory));
            setEditingChatId(null);
        }
    };

    const handleShare = (e, chat) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/chat?id=${chat.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Chat link copied to clipboard!');
        });
        setActiveMenuChatId(null);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Please select a PDF file');
        }
    };

    const handleSendMessage = async (msgOverride) => {
        const finalMsg = msgOverride || inputMessage;
        if ((!finalMsg.trim() && !selectedFile) || loading) return;

        const userMessage = finalMsg.trim();
        const fileToSend = selectedFile;

        setInputMessage('');
        setSelectedFile(null);
        setIsHistoryOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = '';

        setLoading(true);

        const newUserMessage = {
            role: 'user',
            content: fileToSend ? `[Attached: ${fileToSend.name}] ${userMessage}` : userMessage
        };
        setMessages(prev => [...prev, newUserMessage]);

        const conversationHistory = messages.map(msg => ({ role: msg.role, content: msg.content }));

        // Determine mode based on context
        let mode = currentMode;
        if (fileToSend) {
            if (currentMode === 'resume-builder') {
                mode = 'resume-review';
            } else {
                mode = 'pdf-qa';
            }
        }

        try {
            const response = await sendChatMessage(userMessage, conversationHistory, mode, fileToSend);
            if (response.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
            } else {
                throw new Error(response.message || 'Failed to get response');
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="relative flex h-screen bg-white dark:bg-[#0d0d0d] text-gray-800 dark:text-gray-200 font-sans overflow-hidden transition-all duration-500">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-600/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            <div className="flex-1 flex flex-col relative w-full overflow-hidden">
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-6 z-30 border-b border-white/20 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-xl sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 group"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-800 dark:text-gray-500 dark:group-hover:text-white group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="flex items-center gap-4 pl-2">
                            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl shadow-xl flex items-center justify-center transition-transform hover:scale-110 duration-500 overflow-hidden">
                                <Bot className="w-6 h-6 text-white dark:text-black" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-lg tracking-tight text-gray-900 dark:text-white leading-none">StudyBuddy AI</span>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-1">Smart Learning</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                            className={`p-2 rounded-full transition-all duration-300 ${isHistoryOpen ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
                            title="Chat History"
                        >
                            <History className="w-5 h-5" />
                        </button>

                        {/* History Popup Card - Glassmorphism style (Notification Card Match) */}
                        {isHistoryOpen && (
                            <div className="absolute right-0 top-12 w-80 max-h-[70vh] bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 z-50 flex flex-col animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                                <div className="p-4 border-b border-white/10 dark:border-white/5 flex items-center justify-between bg-white/30 dark:bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <History className="w-4 h-4 text-blue-600" />
                                        <span className="font-bold text-sm">Recent Chats</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setMessages([]);
                                            setCurrentChatId(null);
                                            setIsHistoryOpen(false);
                                        }}
                                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors"
                                        title="New Chat"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar min-h-[200px]">
                                    {chatHistory.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <MessageSquare className="w-8 h-8 text-gray-200 dark:text-gray-800 mx-auto mb-2" />
                                            <p className="text-xs text-gray-400">Your chat history will appear here</p>
                                        </div>
                                    ) : (
                                        chatHistory.map(chat => (
                                            <div
                                                key={chat.id}
                                                onClick={() => loadChat(chat)}
                                                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-200 ${currentChatId === chat.id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'}`}
                                            >
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${currentChatId === chat.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                                    <MessageSquare className="w-4 h-4" />
                                                </div>

                                                <div className="flex-1 min-w-0 text-left">
                                                    {editingChatId === chat.id ? (
                                                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                            <input
                                                                autoFocus
                                                                value={newChatTitle}
                                                                onChange={e => setNewChatTitle(e.target.value)}
                                                                onKeyDown={e => e.key === 'Enter' && saveRename(e)}
                                                                className="w-full bg-white dark:bg-gray-900 border border-blue-500 rounded px-1.5 py-0.5 text-xs focus:ring-0"
                                                            />
                                                            <button onClick={saveRename} className="text-green-500 p-0.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded">
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className={`text-xs font-semibold truncate ${currentChatId === chat.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'}`}>{chat.title}</p>
                                                            <p className="text-[10px] text-gray-400 truncate mt-0.5">{chat.preview || 'No messages yet'}</p>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (activeMenuChatId === chat.id) setActiveMenuChatId(null);
                                                            else setActiveMenuChatId(chat.id);
                                                        }}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400"
                                                    >
                                                        <MoreVertical className="w-3 h-3" />
                                                    </button>

                                                    {activeMenuChatId === chat.id && (
                                                        <div className="absolute right-8 top-0 z-60 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-xl py-1 min-w-[100px] animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                                                            <button onClick={(e) => startRenaming(e, chat)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                                <Edit className="w-3 h-3 text-blue-500" /> Rename
                                                            </button>
                                                            <button onClick={(e) => handleShare(e, chat)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                                <Share2 className="w-3 h-3 text-emerald-500" /> Share
                                                            </button>
                                                            <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                                                            <button onClick={(e) => deleteChat(e, chat.id)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500">
                                                                <Trash2 className="w-3 h-3" /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-3 bg-gray-50/50 dark:bg-white/5 border-t border-white/10 dark:border-white/5 text-center">
                                    <button
                                        onClick={() => setIsHistoryOpen(false)}
                                        className="text-[10px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                                    >
                                        Close History
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                            {user?.name?.[0].toUpperCase() || 'M'}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto px-4 pb-40 pt-10 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="w-full max-w-2xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="relative mb-8">
                                <div className="w-20 h-20 bg-linear-to-tr from-green-400 to-blue-500 rounded-full blur-[2px] shadow-[0_0_40px_rgba(72,187,120,0.4)] dark:shadow-[0_0_60px_rgba(72,187,120,0.6)] animate-pulse" />
                                <div className="absolute inset-0 w-20 h-20 bg-linear-to-tr from-green-300 to-emerald-400 rounded-full opacity-60 mix-blend-screen" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 leading-tight">
                                {getGreeting()}, {user?.name?.split(' ')[0] || 'Friend'}
                            </h1>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8 opacity-90">
                                Can I help you with anything today?
                            </h2>

                            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-12">
                                Choose a prompt below or write your own to start chatting with StudyBuddy.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl">
                                {displaySuggestions.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(item.prompt)}
                                        className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/50 p-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] group"
                                    >
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1 group-hover:text-blue-500 transition-colors">{item.label}</p>
                                        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                                            <span>Click to try</span>
                                            <Sparkles className="w-3 h-3 group-hover:animate-spin-slow" />
                                        </div>
                                    </button>
                                ))}
                            </div>


                            <button
                                onClick={shuffleSuggestions}
                                className="mt-12 flex items-center gap-2 text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group"
                            >
                                <RefreshCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" /> Refresh prompts
                            </button>
                        </div>
                    ) : (
                        <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-500">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white'}`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`space-y-1.5 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                                                {msg.role === 'user' ? 'You' : 'StudyBuddy'}
                                            </div>
                                            <div className={`px-5 py-3.5 rounded-3xl leading-relaxed text-sm md:text-base ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100/80 dark:bg-white/5 text-gray-800 dark:text-gray-200 border border-transparent dark:border-white/5'}`}>
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-4 max-w-[80%]">
                                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center font-bold text-xs">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="px-5 py-3.5 rounded-3xl bg-gray-100/80 dark:bg-white/5 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-30 flex justify-center backdrop-blur-md bg-white/20 dark:bg-[#0d0d0d]/40">
                    <div className="w-full max-w-3xl animate-in slide-in-from-bottom-4 duration-700">
                        {selectedFile && (
                            <div className="mb-3 inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm ml-4">
                                <Paperclip className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-xs font-medium truncate max-w-[150px]">{selectedFile.name}</span>
                                <button onClick={() => setSelectedFile(null)} className="hover:text-red-500 transition"><X className="w-3.5 h-3.5" /></button>
                            </div>
                        )}

                        <div className="bg-white/80 dark:bg-[#1a1a1a]/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-4xl p-4 shadow-xl focus-within:border-blue-500/50 group">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="How can StudyBuddy help you today?"
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-gray-800 dark:text-gray-200 px-3 min-h-[40px] max-h-[200px] resize-none text-base placeholder-gray-400 dark:placeholder-gray-500"
                                rows={1}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                            />

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-1">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 ${modes.find(m => m.id === currentMode)?.bg || 'bg-gray-100 dark:bg-gray-800'} rounded-full text-[11px] font-bold ${modes.find(m => m.id === currentMode)?.color || 'text-gray-500'} border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer transition relative group/mode`}>
                                        {React.createElement(modes.find(m => m.id === currentMode)?.icon || Sparkles, { className: "w-3 h-3" })}
                                        <span>{modes.find(m => m.id === currentMode)?.label || 'StudyBuddy AI'}</span>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

                                        {/* Quick Mode Switcher Tooltip */}
                                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover/mode:flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-1 min-w-[150px] overflow-hidden">
                                            {modes.map(m => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => setCurrentMode(m.id)}
                                                    className={`flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition ${currentMode === m.id ? m.color : 'text-gray-500'}`}
                                                >
                                                    <m.icon className="w-3.5 h-3.5" />
                                                    <span className="text-[10px]">{m.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition ml-2"
                                    >
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={loading || (!inputMessage.trim() && !selectedFile)}
                                        className={`p-2 rounded-xl transition-all duration-300 ${loading || (!inputMessage.trim() && !selectedFile) ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105'}`}
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}} />
        </div>
    );
};

export default ChatPage;
