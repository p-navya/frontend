import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Folder, Upload, Search, MoreVertical, Plus, ArrowLeft, Trash2, Edit, X, Download, FileText, File, ExternalLink, Paperclip } from 'lucide-react';

const ResourcesPage = () => {
    const navigate = useNavigate();
    const [selectedFolder, setSelectedFolder] = useState('All Resources');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuFolder, setActiveMenuFolder] = useState(null);
    const [activeMenuResourceId, setActiveMenuResourceId] = useState(null);
    const [renamingFolder, setRenamingFolder] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');

    // Mock Data
    const [folders, setFolders] = useState(() => {
        const saved = localStorage.getItem('studybuddy_folders');
        return saved ? JSON.parse(saved) : ['Notes', 'Textbooks', 'Assignments', 'Past Papers'];
    });

    const [resources, setResources] = useState(() => {
        const saved = localStorage.getItem('studybuddy_resources');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, name: 'Physics Unit 1.pdf', folder: 'Notes', type: 'PDF', size: '2.4 MB', date: '2023-10-01', subject: 'Physics' },
            { id: 2, name: 'Calculus Assignment.docx', folder: 'Assignments', type: 'DOCX', size: '1.2 MB', date: '2023-10-05', subject: 'Math' },
            { id: 3, name: 'Modern History.pdf', folder: 'Textbooks', type: 'PDF', size: '15.8 MB', date: '2023-09-20', subject: 'History' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('studybuddy_folders', JSON.stringify(folders));
    }, [folders]);

    useEffect(() => {
        localStorage.setItem('studybuddy_resources', JSON.stringify(resources));
    }, [resources]);

    const handleCreateFolder = (e) => {
        e.preventDefault();
        const name = e.target.folderName.value;
        if (name && !folders.includes(name)) {
            setFolders([...folders, name]);
            setShowCreateFolderModal(false);
        }
    };

    const deleteFolder = (e, folderName) => {
        e.stopPropagation();
        if (window.confirm(`Delete folder "${folderName}" and all its contents?`)) {
            setFolders(folders.filter(f => f !== folderName));
            setResources(resources.filter(r => r.folder !== folderName));
            if (selectedFolder === folderName) setSelectedFolder('All Resources');
        }
    };

    const startRenaming = (e, folderName) => {
        e.stopPropagation();
        setRenamingFolder(folderName);
        setNewFolderName(folderName);
        setActiveMenuFolder(null);
    };

    const saveRename = (e) => {
        e.stopPropagation();
        if (newFolderName && !folders.includes(newFolderName)) {
            setFolders(folders.map(f => f === renamingFolder ? newFolderName : f));
            setResources(resources.map(r => r.folder === renamingFolder ? { ...r, folder: newFolderName } : r));
            if (selectedFolder === renamingFolder) setSelectedFolder(newFolderName);
        }
        setRenamingFolder(null);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('file').name || 'New Resource.pdf';
        const newRes = {
            id: Date.now(),
            name: name,
            folder: formData.get('folder') || 'Notes',
            subject: formData.get('subject'),
            type: name.split('.').pop().toUpperCase(),
            size: '0.1 MB',
            date: new Date().toISOString().split('T')[0]
        };
        setResources([...resources, newRes]);
        setShowUploadModal(false);
    };

    const deleteResource = (id) => {
        if (window.confirm('Delete this resource?')) {
            setResources(resources.filter(r => r.id !== id));
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesFolder = selectedFolder === 'All Resources' || res.folder === selectedFolder;
        const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFolder && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-orange-600" />
                            Resource Hub
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowCreateFolderModal(true)}
                            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2 text-sm font-semibold shadow-sm"
                        >
                            <Folder className="w-4 h-4 text-gray-500" /> New Folder
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-2 text-sm font-semibold shadow-md"
                        >
                            <Upload className="w-4 h-4" /> Upload
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">

                {/* Sidebar - Folders */}
                <aside className="w-full md:w-64 shrink-0 md:bg-transparent rounded-xl p-4 md:p-0 shadow-sm md:shadow-none bg-white dark:bg-gray-800 md:dark:bg-transparent" onClick={() => setActiveMenuFolder(null)}>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">My Folders</h2>
                    <div className="space-y-1">
                        <button
                            onClick={() => setSelectedFolder('All Resources')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${selectedFolder === 'All Resources' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'}`}
                        >
                            <BookOpen className="w-4 h-4" /> All Resources
                        </button>
                        {folders.map(folder => (
                            <div
                                key={folder}
                                className={`group relative w-full rounded-lg transition ${selectedFolder === folder ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 font-semibold shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'}`}
                            >
                                <div
                                    onClick={() => setSelectedFolder(folder)}
                                    className="flex items-center gap-3 px-4 py-3 cursor-pointer w-full text-sm"
                                >
                                    <Folder className={`w-4 h-4 ${selectedFolder === folder ? 'text-orange-600' : 'text-gray-400'}`} />
                                    {renamingFolder === folder ? (
                                        <div className="flex items-center gap-1 w-full">
                                            <input
                                                autoFocus
                                                value={newFolderName}
                                                onChange={e => setNewFolderName(e.target.value)}
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-1 py-0.5 text-xs focus:outline-none focus:border-orange-500 dark:text-white"
                                            />
                                            <button onClick={saveRename} className="p-0.5 hover:bg-green-100 rounded text-green-600"><Check className="w-3 h-3" /></button>
                                        </div>
                                    ) : (
                                        <span className="truncate flex-1 text-left">{folder}</span>
                                    )}
                                </div>
                                {renamingFolder !== folder && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveMenuFolder(activeMenuFolder === folder ? null : folder); }}
                                        className="absolute right-2 top-2.5 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
                                    >
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}

                                {activeMenuFolder === folder && (
                                    <div className="absolute left-full top-0 ml-2 w-32 bg-white dark:bg-gray-800 shadow-xl rounded-md border border-gray-100 dark:border-gray-700 z-50 overflow-hidden py-1">
                                        <button
                                            onClick={(e) => startRenaming(e, folder)}
                                            className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <Edit className="w-3 h-3" /> Rename
                                        </button>
                                        <button
                                            onClick={(e) => deleteFolder(e, folder)}
                                            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1" onClick={() => setActiveMenuResourceId(null)}>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedFolder}</h2>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 outline-none text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                            />
                        </div>
                    </div>

                    {filteredResources.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResources.map(res => (
                                <div key={res.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition flex flex-col justify-between group">
                                    <div>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                {res.type === 'PDF' ? <FileText className="w-6 h-6 text-red-500" /> : <File className="w-6 h-6 text-blue-500" />}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveMenuResourceId(activeMenuResourceId === res.id ? null : res.id); }}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                                            >
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                            {activeMenuResourceId === res.id && (
                                                <div className="absolute top-10 right-0 w-32 bg-white dark:bg-gray-800 shadow-xl rounded-md border border-gray-100 dark:border-gray-700 z-20 py-1">
                                                    <button onClick={() => deleteResource(res.id)} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                                        <Trash2 className="w-3 h-3" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 truncate" title={res.name}>{res.name}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">{res.subject}</span>
                                            <span className="text-xs text-gray-400 uppercase">{res.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700 mt-2">
                                        <span className="text-xs text-gray-400">{res.date}</span>
                                        <div className="flex gap-2">
                                            <button className="p-1.5 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition" title="Download">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition" title="View">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Folder className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No resources found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Upload lecture notes, textbooks, or assignments for this folder.</p>
                            <button onClick={() => setShowUploadModal(true)} className="text-orange-600 font-semibold flex items-center justify-center gap-2 mx-auto hover:gap-3 transition-all">
                                <Plus className="w-4 h-4" /> Upload first resource
                            </button>
                        </div>
                    )}
                </div>

                {/* Create Folder Modal */}
                {showCreateFolderModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">New Folder</h3>
                                <button onClick={() => setShowCreateFolderModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateFolder} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folder Name</label>
                                    <input
                                        name="folderName"
                                        type="text"
                                        required
                                        placeholder="e.g. Electives"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-900 focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateFolderModal(false)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 transition shadow-md shadow-orange-500/20"
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
                        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Resource</h3>
                                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                    <input
                                        name="subject"
                                        type="text"
                                        required
                                        placeholder="e.g. Mathematics"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-900 focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folder</label>
                                    <select
                                        name="folder"
                                        defaultValue={selectedFolder !== 'All Resources' ? selectedFolder : ''}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-900 focus:border-orange-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                                    >
                                        <option value="">Select Folder</option>
                                        {folders.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File</label>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer relative">
                                        <input
                                            name="file"
                                            type="file"
                                            required
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Click to select file</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, DOC, PPT (Max 10MB)</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 transition shadow-md shadow-orange-500/20"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResourcesPage;
