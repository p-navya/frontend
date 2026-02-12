import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Lock, Globe, Search, MessageCircle, LogIn, X, Hash } from 'lucide-react';

const StudyGroupsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('browse'); // browse, my-groups
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Mock Data
    const [groups, setGroups] = useState(() => {
        const savedGroups = localStorage.getItem('studybuddy_groups');
        if (savedGroups) {
            return JSON.parse(savedGroups);
        }
        return [
            { id: 1, name: 'Physics 101 Finals', subject: 'Physics', members: 12, type: 'public', description: 'Exam prep for Physics 101' },
            { id: 2, name: 'Advanced Calculus', subject: 'Math', members: 5, type: 'public', description: 'Weekly problem solving' },
            { id: 3, name: 'Literature Club', subject: 'English', members: 8, type: 'private', description: 'Discussing classic novels' },
        ];
    });

    const [myGroups, setMyGroups] = useState(() => {
        const savedMyGroups = localStorage.getItem('studybuddy_my_groups');
        return savedMyGroups ? JSON.parse(savedMyGroups) : [];
    });

    // Ensure defaults are persisted
    useEffect(() => {
        if (!localStorage.getItem('studybuddy_groups')) {
            localStorage.setItem('studybuddy_groups', JSON.stringify(groups));
        }
    }, [groups]);

    const handleCreateGroup = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newGroup = {
            id: Date.now(),
            name: formData.get('name'),
            subject: formData.get('subject'),
            description: formData.get('description'),
            type: formData.get('type'), // public/private
            members: 1,
            code: Math.random().toString(36).substring(2, 8).toUpperCase() // Simple invite code
        };

        const updatedGroups = [...groups, newGroup];
        const updatedMyGroups = [...myGroups, newGroup];

        setGroups(updatedGroups);
        setMyGroups(updatedMyGroups);

        localStorage.setItem('studybuddy_groups', JSON.stringify(updatedGroups));
        localStorage.setItem('studybuddy_my_groups', JSON.stringify(updatedMyGroups));

        setShowCreateModal(false);
        setActiveTab('my-groups');
    };

    const handleJoinGroup = (group) => {
        if (!myGroups.find(g => g.id === group.id)) {
            const updated = [...myGroups, group];
            setMyGroups(updated);
            localStorage.setItem('studybuddy_my_groups', JSON.stringify(updated));
            alert(`Joined ${group.name}!`);
        }
    };

    const isMember = (groupId) => myGroups.some(g => g.id === groupId);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            Study Groups
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-semibold shadow-md"
                    >
                        <Plus className="w-4 h-4" /> Create Group
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`pb-3 px-1 font-medium text-sm transition relative ${activeTab === 'browse' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Browse Public Groups
                        {activeTab === 'browse' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('my-groups')}
                        className={`pb-3 px-1 font-medium text-sm transition relative ${activeTab === 'my-groups' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        My Groups
                        {activeTab === 'my-groups' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>}
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'browse' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.filter(g => g.type === 'public').map(group => (
                            <div key={group.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${isMember(group.id) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Public
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h3>
                                <p className="text-sm text-green-600 font-medium mb-3">{group.subject}</p>
                                <p className="text-sm text-gray-500 mb-6">{group.description}</p>

                                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                    <span className="text-xs text-gray-500">{group.members} members</span>
                                    {isMember(group.id) ? (
                                        <span className="text-sm font-semibold text-green-600 flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Joined</span>
                                    ) : (
                                        <button
                                            onClick={() => handleJoinGroup(group)}
                                            className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition shadow-sm"
                                        >
                                            Join Group
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'my-groups' && (
                    <div>
                        {myGroups.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myGroups.map(group => (
                                    <div key={group.id} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500 transition hover:shadow-md">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 rounded-xl bg-green-50 text-green-600">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            {group.type === 'private' && (
                                                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded flex items-center gap-1">
                                                    <Lock className="w-3 h-3" /> Private
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{group.description}</p>
                                        <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2">
                                            <MessageCircle className="w-4 h-4" /> Open Chat
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No groups joined yet</h3>
                                <p className="text-gray-500 mb-6">Browse public groups or create your own!</p>
                                <button onClick={() => setActiveTab('browse')} className="text-green-600 font-semibold hover:underline">Browse Groups</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Create Study Group</h3>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateGroup} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                    <input name="name" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="e.g. Calculus Heroes" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input name="subject" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="e.g. Mathematics" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea name="description" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="What's this group about?" rows="3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                                    <select name="type" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white">
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
