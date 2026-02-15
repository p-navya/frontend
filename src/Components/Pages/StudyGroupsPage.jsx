import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Lock, Globe, Search, MessageCircle, LogIn, X, Send, Trash2, MoreVertical } from 'lucide-react';
import { apiRequest } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const StudyGroupsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('browse'); // browse, my-groups, chat
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [groups, setGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);

    // Chat State
    const [activeGroup, setActiveGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const chatIntervalRef = useRef(null);

    // Function declarations (before useEffect to avoid hoisting issues)
    const fetchGroups = async () => {
        try {
            const response = await apiRequest('/groups');
            if (response.success) {
                setGroups(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        }
    };

    const fetchMyGroups = async () => {
        try {
            const response = await apiRequest('/groups/my');
            if (response.success) {
                setMyGroups(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch my groups:', error);
        }
    };

    const fetchMessages = async (groupId) => {
        try {
            const response = await apiRequest(`/groups/${groupId}/messages`);
            if (response.success) {
                // simple check to avoid unnecessary re-renders if no new messages (could be optimized)
                setMessages(prev => {
                    if (prev.length !== response.data.length || (response.data.length > 0 && prev[prev.length - 1]?.id !== response.data[response.data.length - 1].id)) {
                        return response.data;
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchMyGroups();
    }, []);

    // Poll for messages when chat is active
    useEffect(() => {
        if (activeGroup && activeTab === 'chat') {
            fetchMessages(activeGroup.id);
            chatIntervalRef.current = setInterval(() => {
                fetchMessages(activeGroup.id);
            }, 3000);
        } else {
            if (chatIntervalRef.current) clearInterval(chatIntervalRef.current);
        }
        return () => {
            if (chatIntervalRef.current) clearInterval(chatIntervalRef.current);
        };
    }, [activeGroup, activeTab]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const response = await apiRequest('/groups', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.get('name'),
                    subject: formData.get('subject'),
                    description: formData.get('description'),
                    type: formData.get('type')
                })
            });

            if (response.success) {
                setGroups([response.data, ...groups]);
                setMyGroups([response.data, ...myGroups]); // Creator is auto-joined
                setShowCreateModal(false);
                setActiveTab('my-groups');
            }
        } catch (error) {
            alert('Failed to create group: ' + error.message);
        }
    };

    const handleJoinGroup = async (group) => {
        if (myGroups.find(g => g.id === group.id)) return;

        try {
            const response = await apiRequest(`/groups/${group.id}/join`, { method: 'POST' });
            if (response.success) {
                setMyGroups([...myGroups, group]);
                alert(`Joined ${group.name}!`);
            }
        } catch (error) {
            alert('Failed to join group: ' + error.message);
        }
    };

    const handleDeleteGroup = async (e, groupId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this group? This cannot be undone.')) return;

        try {
            const response = await apiRequest(`/groups/${groupId}`, { method: 'DELETE' });
            if (response.success) {
                setGroups(groups.filter(g => g.id !== groupId));
                setMyGroups(myGroups.filter(g => g.id !== groupId));
                if (activeGroup?.id === groupId) {
                    setActiveTab('my-groups');
                    setActiveGroup(null);
                }
            }
        } catch (error) {
            alert('Failed to delete group: ' + error.message);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await apiRequest(`/groups/${activeGroup.id}/messages`, {
                method: 'POST',
                body: JSON.stringify({ content: newMessage })
            });

            if (response.success) {
                setMessages([...messages, response.data]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const openChat = (group) => {
        setActiveGroup(group);
        setActiveTab('chat');
        setMessages([]); // Clear previous chat signals loading
        fetchMessages(group.id);
    };

    const isMember = (groupId) => myGroups.some(g => g.id === groupId);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => activeTab === 'chat' ? setActiveTab('my-groups') : navigate('/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            {activeTab === 'chat' ? activeGroup?.name : 'Study Groups'}
                        </h1>
                    </div>
                    {activeTab !== 'chat' && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-semibold shadow-md"
                        >
                            <Plus className="w-4 h-4" /> Create Group
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full h-[calc(100vh-4rem)] flex flex-col">

                {/* Tabs - Only show when not in chat */}
                {activeTab !== 'chat' && (
                    <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 shrink-0">
                        <button
                            onClick={() => setActiveTab('browse')}
                            className={`pb-3 px-1 font-medium text-sm transition relative ${activeTab === 'browse' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            Browse Public Groups
                            {activeTab === 'browse' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>}
                        </button>
                        <button
                            onClick={() => setActiveTab('my-groups')}
                            className={`pb-3 px-1 font-medium text-sm transition relative ${activeTab === 'my-groups' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            My Groups
                            {activeTab === 'my-groups' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>}
                        </button>
                    </div>
                )}

                {/* Content */}
                {activeTab === 'browse' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4">
                        {groups.map(group => (
                            <div key={group.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${isMember(group.id) ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'}`}>
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Public
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{group.name}</h3>
                                <p className="text-sm text-green-600 font-medium mb-3">{group.subject}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">{group.description}</p>

                                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-4">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Created by {group.created_by === user?.id ? 'You' : 'User'}</span>
                                    {isMember(group.id) ? (
                                        <button onClick={() => openChat(group)} className="text-sm font-semibold text-green-600 flex items-center gap-1 hover:underline">
                                            <MessageCircle className="w-4 h-4" /> Open Chat
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleJoinGroup(group)}
                                            className="text-sm bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-sm"
                                        >
                                            Join Group
                                        </button>
                                    )}
                                </div>

                                {/* Delete Button (Admin/Owner) */}
                                {(group.created_by === user?.id || user?.role === 'admin') && (
                                    <button
                                        onClick={(e) => handleDeleteGroup(e, group.id)}
                                        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100"
                                        title="Delete Group"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'my-groups' && (
                    <div className="overflow-y-auto pb-4">
                        {myGroups.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myGroups.map(group => (
                                    <div key={group.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-l-4 border-green-500 transition hover:shadow-md relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            {group.type === 'private' && (
                                                <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded flex items-center gap-1">
                                                    <Lock className="w-3 h-3" /> Private
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{group.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{group.description}</p>
                                        <button onClick={() => openChat(group)} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2">
                                            <MessageCircle className="w-4 h-4" /> Open Chat
                                        </button>

                                        {/* Delete Button (Admin/Owner) */}
                                        {(group.created_by === user?.id || user?.role === 'admin') && (
                                            <button
                                                onClick={(e) => handleDeleteGroup(e, group.id)}
                                                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100"
                                                title="Delete Group"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No groups joined yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Browse public groups or create your own!</p>
                                <button onClick={() => setActiveTab('browse')} className="text-green-600 font-semibold hover:underline">Browse Groups</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Chat Interface */}
                {activeTab === 'chat' && activeGroup && (
                    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.user_id === user?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMe ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none'}`}>
                                                {!isMe && <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{msg.user_name || 'User'}</p>}
                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Study Group</h3>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateGroup} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name</label>
                                    <input name="name" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="e.g. Calculus Heroes" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                    <input name="subject" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="e.g. Mathematics" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea name="description" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="What's this group about?" rows="3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Privacy</label>
                                    <select name="type" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                                        <option value="public">Public (Visible to all)</option>
                                        <option value="private">Private (Invite only)</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg mt-4">
                                    Create Group
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudyGroupsPage;
