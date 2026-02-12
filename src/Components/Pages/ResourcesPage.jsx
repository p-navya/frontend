import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, File, Download, Trash2, Folder, Search, Plus, X, BookOpen, Monitor, MoreVertical, Edit, Share2, Check } from 'lucide-react';

const ResourcesPage = () => {
    const navigate = useNavigate();
    const [selectedFolder, setSelectedFolder] = useState('All Resources');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

    // Folder Management State
    const [activeMenuFolder, setActiveMenuFolder] = useState(null);
    const [editingFolder, setEditingFolder] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');

    // Initial dummy data or load from local storage
    // Initial dummy data or load from local storage
    const [resources, setResources] = useState(() => {
        const savedResources = localStorage.getItem('studybuddy_resources');
        if (savedResources) {
            return JSON.parse(savedResources);
        }
        return [
            { id: 1, name: 'Physics Mechanics Notes.pdf', folder: 'Core Subjects', subject: 'Physics', type: 'pdf', date: '2023-10-15', size: '2.4 MB' },
            { id: 2, name: 'Calculus I Syllabus.docx', folder: 'Math', subject: 'Mathematics', type: 'doc', date: '2023-09-01', size: '1.1 MB' },
            { id: 3, name: 'Data Structures Intro.pptx', folder: 'CS', subject: 'Computer Science', type: 'ppt', date: '2024-02-10', size: '5.2 MB' },
        ];
    });

    const [folders, setFolders] = useState(() => {
        const savedFolders = localStorage.getItem('studybuddy_folders');
        if (savedFolders) {
            return JSON.parse(savedFolders);
        }
        return ['All Resources', 'Core Subjects', 'Math', 'CS'];
    });

    // Ensure defaults are persisted if they were just created
    useEffect(() => {
        if (!localStorage.getItem('studybuddy_resources')) {
            localStorage.setItem('studybuddy_resources', JSON.stringify(resources));
        }
        if (!localStorage.getItem('studybuddy_folders')) {
            localStorage.setItem('studybuddy_folders', JSON.stringify(folders));
        }
    }, [resources, folders]);

    const handleCreateFolder = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const folderName = formData.get('folderName');
        if (folderName && !folders.includes(folderName)) {
            const updatedFolders = [...folders, folderName];
            setFolders(updatedFolders);
            localStorage.setItem('studybuddy_folders', JSON.stringify(updatedFolders));
            setShowCreateFolderModal(false);
        }
    };

    const handleRenameFolder = (e) => {
        e.preventDefault();
        if (editingFolder && newFolderName && !folders.includes(newFolderName)) {
            // Update folder list
            const updatedFolders = folders.map(f => f === editingFolder ? newFolderName : f);
            setFolders(updatedFolders);
            localStorage.setItem('studybuddy_folders', JSON.stringify(updatedFolders));

            // Update resources in that folder
            const updatedResources = resources.map(r => r.folder === editingFolder ? { ...r, folder: newFolderName } : r);
            setResources(updatedResources);
            localStorage.setItem('studybuddy_resources', JSON.stringify(updatedResources));

            if (selectedFolder === editingFolder) setSelectedFolder(newFolderName);
            setEditingFolder(null);
            setNewFolderName('');
        }
    };

    const startRenaming = (e, folder) => {
        e.stopPropagation();
        setEditingFolder(folder);
        setNewFolderName(folder);
        setActiveMenuFolder(null);
    };

    const deleteFolder = (e, folder) => {
        e.stopPropagation();
        if (folder === 'All Resources') return; // Prevent deleting default
        if (confirm(`Delete folder "${folder}" and all its contents?`)) {
            const updatedFolders = folders.filter(f => f !== folder);
            setFolders(updatedFolders);
            localStorage.setItem('studybuddy_folders', JSON.stringify(updatedFolders));

            const updatedResources = resources.filter(r => r.folder !== folder);
            setResources(updatedResources);
            localStorage.setItem('studybuddy_resources', JSON.stringify(updatedResources));

            if (selectedFolder === folder) setSelectedFolder('All Resources');
            setActiveMenuFolder(null);
        }
    };

    const shareFolder = (e, folder) => {
        e.stopPropagation();
        alert(`Shared link for folder: ${folder}`);
        setActiveMenuFolder(null);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const file = formData.get('file');
        const subject = formData.get('subject');

        // If "All Resources" is selected, default to "Unsorted" or force user to choose? 
        // For simplicity, we'll assign it to "All Resources" logically, or just use the current selected folder if it's not "All Resources".
        // Let's add a folder selector in upload, defaulting to current selection if specific.
        const targetFolder = formData.get('folder') || (selectedFolder === 'All Resources' ? 'General' : selectedFolder);

        if (file && subject) {
            const newResource = {
                id: Date.now(),
                name: file.name,
                folder: targetFolder,
                subject: subject,
                type: file.name.split('.').pop().toLowerCase(),
                date: new Date().toISOString().split('T')[0],
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
            };

            const updatedResources = [...resources, newResource];
            setResources(updatedResources);
            localStorage.setItem('studybuddy_resources', JSON.stringify(updatedResources));

            // Ensure folder exists in list (if new)
            if (!folders.includes(targetFolder)) {
                const updatedFolders = [...folders, targetFolder];
                setFolders(updatedFolders);
                localStorage.setItem('studybuddy_folders', JSON.stringify(updatedFolders));
            }

            setShowUploadModal(false);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            const updatedResources = resources.filter(r => r.id !== id);
            setResources(updatedResources);
            localStorage.setItem('studybuddy_resources', JSON.stringify(updatedResources));
        }
    };

    const getFileIcon = (type) => {
        if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
        if (type.includes('doc')) return <FileText className="w-6 h-6 text-blue-500" />;
        if (type.includes('ppt')) return <Monitor className="w-6 h-6 text-orange-500" />; // Presentation
        return <File className="w-6 h-6 text-gray-500" />;
    };

    const filteredResources = resources.filter(res => {
        const matchesFolder = selectedFolder === 'All Resources' ? true : res.folder === selectedFolder;
        const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFolder && matchesSearch;
    });

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
                            <BookOpen className="w-5 h-5 text-orange-600" />
                            Resource Hub
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowCreateFolderModal(true)}
                            className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-semibold shadow-sm"
                        >
                            <Folder className="w-4 h-4 text-gray-500" /> New Folder
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-2 text-sm font-semibold shadow-md"
                        >
                            <Upload className="w-4 h-4" /> Upload Resource
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">

                {/* Sidebar - Folders */}
                <aside className="w-full md:w-64 shrink-0 md:bg-transparent rounded-xl p-4 md:p-0 shadow-sm md:shadow-none bg-white" onClick={() => setActiveMenuFolder(null)}>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">My Folders</h2>
                    <div className="space-y-1">
                        {folders.map(folder => (
                            <div
                                key={folder}
                                className={`group relative w-full rounded-lg transition ${selectedFolder === folder ? 'bg-orange-100 text-orange-800 font-semibold shadow-sm' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                            >
                                <div
                                    onClick={() => setSelectedFolder(folder)}
                                    className="flex items-center justify-between px-4 py-3 cursor-pointer w-full"
                                >
                                    <span className="flex items-center gap-3 truncate w-full">
                                        <Folder className={`w-4 h-4 shrink-0 ${selectedFolder === folder ? 'text-orange-600' : 'text-gray-400'}`} />

                                        {editingFolder === folder ? (
                                            <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                                                <input
                                                    autoFocus
                                                    value={newFolderName}
                                                    onChange={e => setNewFolderName(e.target.value)}
                                                    className="w-full bg-white border border-gray-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:border-orange-500"
                                                />
                                                <button onClick={handleRenameFolder} className="p-1 hover:bg-gray-200 rounded text-green-600">
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="truncate">{folder}</span>
                                        )}
                                    </span>
                                </div>

                                {folder !== 'All Resources' && !editingFolder && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuFolder(activeMenuFolder === folder ? null : folder);
                                            }}
                                            className={`p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-black/5 ${activeMenuFolder === folder ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {activeMenuFolder === folder && (
                                            <div className="absolute left-full top-0 ml-2 w-32 bg-white shadow-xl rounded-md border border-gray-100 z-50 overflow-hidden py-1">
                                                <button
                                                    onClick={(e) => startRenaming(e, folder)}
                                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Edit className="w-3 h-3" /> Rename
                                                </button>
                                                <button
                                                    onClick={(e) => shareFolder(e, folder)}
                                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Share2 className="w-3 h-3" /> Share
                                                </button>
                                                <button
                                                    onClick={(e) => deleteFolder(e, folder)}
                                                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-3 h-3" /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">{selectedFolder}</h2>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm bg-white"
                            />
                        </div>
                    </div>

                    {/* Resources Grid */}
                    {filteredResources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredResources.map(res => (
                                <div key={res.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between group">
                                    <div>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                {getFileIcon(res.type)}
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                <button onClick={() => handleDelete(res.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-1 truncate" title={res.name}>{res.name}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">{res.subject}</span>
                                            <span className="text-xs text-gray-400 uppercase">{res.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                                        <span className="text-xs text-gray-400">{res.date}</span>
                                        <button className="text-sm text-orange-600 font-medium hover:text-orange-700 flex items-center gap-1">
                                            Download <Download className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Folder className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No resources found</h3>
                            <p className="text-gray-500 mb-6">Upload lecture notes, textbooks, or assignments for this folder.</p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700"
                            >
                                <Plus className="w-4 h-4" /> Add First Resource
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Create Folder Modal */}
            {showCreateFolderModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">New Folder</h3>
                            <button onClick={() => setShowCreateFolderModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateFolder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
                                <input
                                    name="folderName"
                                    type="text"
                                    required
                                    placeholder="e.g. Electives"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateFolderModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 shadow-md hover:shadow-lg transition"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Upload Resource</h3>
                            <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    name="subject"
                                    type="text"
                                    required
                                    placeholder="e.g. Mathematics"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
                                <select
                                    name="folder"
                                    defaultValue={selectedFolder !== 'All Resources' ? selectedFolder : ''}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                                >
                                    {folders.filter(f => f !== 'All Resources').map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                    <option value="General">General (New Folder)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                    <input
                                        name="file"
                                        type="file"
                                        required
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 font-medium">Click to select file</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, PPT (Max 10MB)</p>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 shadow-md hover:shadow-lg transition"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourcesPage;
