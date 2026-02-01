import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, X, ArrowLeft, Plus, History, MessageSquare, Menu } from 'lucide-react';
import { sendChatMessage } from '../../services/chatbotService';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

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
        <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">

            {/* Sidebar - ChatGPT Style */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-black transition-all duration-300 flex flex-col border-r border-gray-800 relative z-20`}>
                <div className="p-3">
                    <button
                        onClick={() => { setMessages([]); setInputMessage(''); }}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md border border-gray-700 hover:bg-gray-800 transition text-sm text-white"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2">Today</div>
                    {/* Dummy History Items */}
                    <div className="flex items-center gap-2 px-3 py-3 rounded-md hover:bg-gray-800 cursor-pointer text-sm text-gray-300 truncate">
                        <MessageSquare className="w-4 h-4" />
                        Physics Homework Help...
                    </div>
                </div>

                {/* User Profile / Back Button */}
                <div className="p-3 border-t border-gray-800">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-800 transition text-sm text-gray-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative bg-gray-800">

                {/* Mobile Toggle & Header */}
                <div className="p-2 text-gray-400 flex items-center md:hidden">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-700 rounded-md">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-2 font-semibold">StudyBuddy AI</span>
                </div>

                {/* Top Model Bar (Optional) */}
                {!sidebarOpen && (
                    <div className="absolute top-4 left-4 z-10 hidden md:block">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-700 rounded-md text-gray-400">
                            <History className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="w-full flex justify-center py-2 text-sm text-gray-400 border-b border-gray-700/50">
                    Resume Copilot (AI Powered)
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto relative">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
                            <div className="bg-gray-700 p-4 rounded-full mb-6">
                                <Bot className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full py-10">
                            {messages.map((msg, index) => (
                                <div key={index} className={`w-full max-w-3xl px-4 py-6 text-base flex gap-4 ${msg.role === 'assistant' ? 'bg-transparent' : 'bg-transparent'}`}>
                                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-green-500' : 'bg-purple-600'}`}>
                                        {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <span className="text-white font-bold text-xs">U</span>}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="font-semibold text-sm text-gray-300 mb-1">{msg.role === 'assistant' ? 'StudyBuddy' : 'You'}</div>
                                        <div className="leading-relaxed text-gray-100 whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="w-full max-w-3xl px-4 py-6 flex gap-4">
                                    <div className="w-8 h-8 rounded-sm bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mx-1"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mx-1 delay-75"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mx-1 delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>

                {/* Output Input Area */}
                <div className="w-full flex-shrink-0 pb-6 px-4">
                    <div className="max-w-3xl mx-auto relative">
                        {selectedFile && (
                            <div className="absolute -top-12 left-0 bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg border border-gray-600">
                                <Paperclip className="w-4 h-4 text-gray-400" />
                                <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                                <button onClick={() => setSelectedFile(null)} className="hover:text-red-400"><X className="w-4 h-4" /></button>
                            </div>
                        )}

                        <div className="flex items-end gap-2 bg-[#40414F] rounded-xl p-3 shadow-md border border-gray-600/50 focus-within:border-gray-500">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-400 hover:text-white transition"
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
                                className="flex-1 bg-transparent text-white focus:outline-none resize-none overflow-hidden py-0 my-1 max-h-[200px]"
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
                                className={`p-2 rounded-md transition ${loading || (!inputMessage.trim() && !selectedFile) ? 'bg-transparent text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center text-xs text-gray-500 mt-2">
                            StudyBuddy can make mistakes. Consider checking important information.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChatPage;
