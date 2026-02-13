import React, { useState, useRef } from 'react'
import { GraduationCap, Brain, User, Save, X, Plus, Camera, Image, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function EditProfileModal({ onClose }) {
    const { user } = useAuth()
    const fileInputRef = useRef(null)

    // Load initial state from localStorage if available, otherwise use auth user
    const savedProfile = JSON.parse(localStorage.getItem('user_profile_data') || '{}')

    const [formData, setFormData] = useState({
        name: savedProfile.name || user?.name || '',
        email: savedProfile.email || user?.email || '',
        bio: savedProfile.bio || user?.bio || '',
        degree: savedProfile.degree || user?.degree || '',
        stream: savedProfile.stream || savedProfile.major || user?.stream || user?.major || '',
        year: savedProfile.year || user?.year || '',
        profileImage: savedProfile.profileImage || user?.profileImage || null
    })
    const [showUploadMenu, setShowUploadMenu] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')


    const handleImageUpload = () => {
        fileInputRef.current.click()
        setShowUploadMenu(false)
    }

    const handleRemovePhoto = () => {
        setFormData(prev => ({
            ...prev,
            profileImage: null
        }))
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

        setSuccessMessage('Profile updated successfully!')
        setTimeout(() => {
            setSuccessMessage('')
            onClose() // Close modal after save
        }, 1500)
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h1>

                    {/* Success Message Toast */}
                    {successMessage && (
                        <div className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm z-50 relative">
                            <div className="bg-white/20 p-1 rounded-full"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                            {successMessage}
                        </div>
                    )}

                    <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 mb-6 relative z-10">
                        {/* Profile Banner / Avatar */}
                        <div className="h-24 bg-linear-to-r from-indigo-500 to-purple-600 relative rounded-t-xl">
                            <div className="absolute -bottom-8 left-6">
                                <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-lg relative group">
                                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                                        {formData.profileImage ? (
                                            <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-8 h-8" />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowUploadMenu(!showUploadMenu)}
                                        className="absolute bottom-0 right-0 p-1 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition cursor-pointer z-20"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>

                                    {showUploadMenu && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 origin-top">
                                            {/* Arrow (now at top) */}
                                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-100"></div>

                                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition text-left relative z-10">
                                                <Camera className="w-4 h-4" />
                                                Take Photo
                                            </button>
                                            <button
                                                onClick={handleImageUpload}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition text-left relative z-10"
                                            >
                                                <Image className="w-4 h-4" />
                                                Upload from Library
                                            </button>
                                            {formData.profileImage && (
                                                <button
                                                    onClick={handleRemovePhoto}
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition text-left relative z-10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove Photo
                                                </button>
                                            )}
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

                        {/* Spacer for banner */}
                        <div className="h-10"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                <select
                                    id="degree"
                                    name="degree"
                                    value={formData.degree}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                >
                                    <option value="">Select Degree</option>
                                    <option value="B.Tech">B.Tech</option>
                                    <option value="B.E">B.E</option>
                                    <option value="B.Sc">B.Sc</option>
                                    <option value="BCA">BCA</option>
                                    <option value="M.Tech">M.Tech</option>
                                    <option value="M.Sc">M.Sc</option>
                                    <option value="MCA">MCA</option>
                                    <option value="MBA">MBA</option>
                                    <option value="MBBS">MBBS</option>
                                    <option value="Ph.D">Ph.D</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="stream" className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                                <input
                                    type="text"
                                    id="stream"
                                    name="stream"
                                    value={formData.stream}
                                    onChange={handleChange}
                                    placeholder="e.g. Computer Science"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <select
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="5th Year">5th Year</option>
                                    <option value="Graduated">Graduated</option>
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
    )
}

export default EditProfileModal
