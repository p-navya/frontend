import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, X, ArrowLeft, Plus, History, MessageSquare, Menu, MoreVertical, Edit, Trash2, Share2, Check } from 'lucide-react';
import { sendChatMessage } from '../../services/chatbotService';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [activeMenuChatId, setActiveMenuChatId] = useState(null);
    const [editingChatId, setEditingChatId] = useState(null);
    const [newChatTitle, setNewChatTitle] = useState('');

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Load history from local storage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('studybuddy_chat_history');
        if (savedHistory) {
            setChatHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Handle initial message from other pages (e.g. Resume Builder)
    useEffect(() => {
        if (location.state?.initialMessage) {
            setInputMessage(location.state.initialMessage);
            // Optional: clear state so it doesn't persist on refresh/back?
            // navigate(location.pathname, { replace: true });
        }
    }, [location.state]);

    // Save history when messages update
    useEffect(() => {
        if (messages.length > 0) {
            const previewText = messages[0].content.length > 30
                ? messages[0].content.substring(0, 30) + '...'
                : messages[0].content;

            if (currentChatId) {
                // Update existing chat
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
                // Create new chat
                const newId = Date.now();
                const newChat = {
                    id: newId,
                    title: previewText || 'New Chat',
                    messages: messages,
                    date: 'Today', // Simplified for now
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
        if (window.innerWidth < 768) setSidebarOpen(false); // Auto close on mobile
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
        // Simulate sharing link
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

    const handleSendMessage = async () => {
        if ((!inputMessage.trim() && !selectedFile) || loading) return;

        const userMessage = inputMessage.trim();
        const fileToSend = selectedFile;

        setInputMessage('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        setLoading(true);

        const conversationHistory = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Add user message to UI
        const displayContent = fileToSend
            ? `[Attached: ${fileToSend.name}] ${userMessage}`
            : userMessage;

        const newUserMessage = { role: 'user', content: displayContent };
        setMessages(prev => [...prev, newUserMessage]);

        // Determine mode based on context
        // Default to Resume Builder for general chat, Resume Review if file is attached
        let mode = 'resume-builder';
        if (fileToSend) mode = 'resume-review';

        try {
            const response = await sendChatMessage(userMessage, conversationHistory, mode, fileToSend);

            if (response.success) {
                const aiMessage = { role: 'assistant', content: response.data.response };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error(response.message || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = { role: 'assistant', content: `Sorry, I encountered an error: ${error.message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans overflow-hidden transition-colors duration-300">

            {/* Sidebar - ChatGPT Style */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-50 dark:bg-gray-800 transition-all duration-300 flex flex-col border-r border-gray-200 dark:border-gray-700 relative z-20`}>
                <div className="p-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-transparent font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2" onClick={() => setActiveMenuChatId(null)}>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">Chats</div>
                    {chatHistory.length === 0 ? (
                        <div className="text-sm text-gray-400 px-2 italic">No previous chats</div>
                    ) : (
                        chatHistory.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => loadChat(chat)}
                                className={`group relative flex items-center justify-between px-3 py-3 rounded-md cursor-pointer text-sm transition ${currentChatId === chat.id ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}`}
                            >
                                <div className="flex items-center gap-2 overflow-hidden w-full">
                                    <MessageSquare className="w-4 h-4 text-gray-500 shrink-0" />
                                    {editingChatId === chat.id ? (
                                        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="text"
                                                value={newChatTitle}
                                                onChange={(e) => setNewChatTitle(e.target.value)}
                                                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-xs focus:outline-none focus:border-teal-500 dark:text-white"
                                                autoFocus
                                            />
                                            <button onClick={saveRename} className="p-1 hover:bg-gray-200 rounded text-green-600">
                                                <Check className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="truncate">{chat.title}</span>
                                    )}
                                </div>

                                {!editingChatId && (
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuChatId(activeMenuChatId === chat.id ? null : chat.id);
                                            }}
                                            className={`p-1 rounded-md text-gray-500 hover:bg-gray-300 ${activeMenuChatId === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {activeMenuChatId === chat.id && (
                                            <div className="absolute right-0 top-6 w-32 bg-white dark:bg-gray-800 shadow-xl rounded-md border border-gray-100 dark:border-gray-700 z-50 overflow-hidden py-1">
                                                <button
                                                    onClick={(e) => startRenaming(e, chat)}
                                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                                >
                                                    <Edit className="w-3 h-3" /> Rename
                                                </button>
                                                <button
                                                    onClick={(e) => handleShare(e, chat)}
                                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Share2 className="w-3 h-3" /> Share
                                                </button>
                                                <button
                                                    onClick={(e) => deleteChat(e, chat.id)}
                                                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-3 h-3" /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>


                <div className="p-3 border-t border-gray-200">
                    <button
                        onClick={() => { setMessages([]); setInputMessage(''); setCurrentChatId(null); }}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative w-full bg-white dark:bg-gray-900 transition-colors duration-300">
                {/* Header for Chat Page */}
                <div className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-linear-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg text-gray-800 dark:text-white">StudyBuddyAI</span>
                        </div>
                    </div>
                </div>




                {/* Messages */}
                <div className="flex-1 overflow-y-auto relative scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-0 animate-in fade-in zoom-in duration-500 fill-mode-forwards" style={{ opacity: 1 }}>
                            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center mb-6">
                                <Bot className="w-8 h-8 text-teal-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">How can I help you today?</h2>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full py-10">
                            {messages.map((msg, index) => (
                                <div key={index} className={`w-full max-w-3xl px-4 py-6 text-base flex gap-4 ${msg.role === 'assistant' ? 'bg-transparent' : 'bg-transparent'}`}>
                                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-teal-600' : 'bg-purple-600'}`}>
                                        {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <span className="text-white font-bold text-xs">U</span>}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">{msg.role === 'assistant' ? 'StudyBuddy' : 'You'}</div>
                                        <div className="leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="w-full max-w-3xl px-4 py-6 flex gap-4">
                                    <div className="w-8 h-8 rounded-sm bg-teal-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mx-1"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mx-1 delay-75"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mx-1 delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>

                {/* Output Input Area */}
                <div className="w-full shrink-0 pb-6 px-4">
                    <div className="max-w-3xl mx-auto relative">
                        {selectedFile && (
                            <div className="absolute -top-12 left-0 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg flex items-center gap-2 shadow-md border border-gray-200 dark:border-gray-700">
                                <Paperclip className="w-4 h-4 text-teal-600" />
                                <span className="text-sm truncate max-w-[200px] font-medium">{selectedFile.name}</span>
                                <button onClick={() => setSelectedFile(null)} className="hover:text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                        )}

                        <div className="flex items-end gap-2 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-200 dark:border-gray-700 focus-within:border-teal-500">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                                title="Upload PDF"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".pdf"
                                className="hidden"
                            />

                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                style={{ height: '24px', maxHeight: '200px' }}
                                placeholder="Message StudyBuddy..."
                                className="flex-1 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none resize-none overflow-hidden py-0 my-1 max-h-[200px] placeholder-gray-400 dark:placeholder-gray-500"
                                disabled={loading}
                                rows={1}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                            />

                            <button
                                onClick={handleSendMessage}
                                disabled={loading || (!inputMessage.trim() && !selectedFile)}
                                className={`p-2 rounded-md transition ${loading || (!inputMessage.trim() && !selectedFile) ? 'bg-transparent text-gray-300 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center text-xs text-gray-400 mt-2">
                            StudyBuddy can make mistakes. Consider checking important information.
                        </div>
                    </div>
                </div>

            </div >
        </div >
    );
};

export default ChatPage;
