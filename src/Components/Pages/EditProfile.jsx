import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Brain, User, Save, ArrowLeft, Plus, Camera, Image } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function EditProfile() {
    const { user } = useAuth()
    const fileInputRef = useRef(null)

    // Load initial state from localStorage if available, otherwise use auth user
    const savedProfile = JSON.parse(localStorage.getItem('user_profile_data') || '{}')

    const [formData, setFormData] = useState({
        name: savedProfile.name || user?.name || '',
        email: savedProfile.email || user?.email || '',
        bio: savedProfile.bio || user?.bio || '',
        major: savedProfile.major || user?.major || '',
        year: savedProfile.year || user?.year || '',
        profileImage: savedProfile.profileImage || user?.profileImage || null
    })
    const [showUploadMenu, setShowUploadMenu] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')


    const handleImageUpload = () => {
        fileInputRef.current.click()
        setShowUploadMenu(false)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    profileImage: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Save to localStorage to persist data
        const updatedProfile = { ...formData }
        localStorage.setItem('user_profile_data', JSON.stringify(updatedProfile))

        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event('storage'))

        console.log('Updated Profile:', formData)
        setSuccessMessage('Profile updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
    }


    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="p-2 bg-white rounded-full hover:bg-gray-50 text-gray-600 transition shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
                </div>

                {/* Success Message Toast */}
                {successMessage && (
                    <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-4 flex items-center gap-2 z-50">
                        <div className="bg-white/20 p-1 rounded-full"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                        {successMessage}
                    </div>
                )}


                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
                    {/* Profile Banner / Avatar */}
                    <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-600 relative">
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg relative group">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                                    {formData.profileImage ? (
                                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10" />
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowUploadMenu(!showUploadMenu)}
                                    className="absolute bottom-0 right-0 p-1.5 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>

                                {showUploadMenu && (
                                    <div className="absolute top-12 left-24 ml-4 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-left-2">
                                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition text-left">
                                            <Camera className="w-4 h-4" />
                                            Take Photo
                                        </button>
                                        <button
                                            onClick={handleImageUpload}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition text-left"
                                        >
                                            <Image className="w-4 h-4" />
                                            Upload from Library
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <div className="pt-16 pb-8 px-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">Major / Field of Study</label>
                                    <input
                                        type="text"
                                        id="major"
                                        name="major"
                                        value={formData.major}
                                        onChange={handleChange}
                                        placeholder="e.g. Computer Science"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <select
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                    >
                                        <option value="">Select Year</option>
                                        <option value="Freshman">Freshman</option>
                                        <option value="Sophomore">Sophomore</option>
                                        <option value="Junior">Junior</option>
                                        <option value="Senior">Senior</option>
                                        <option value="Graduate">Graduate</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Tell us a bit about yourself..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                                />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
