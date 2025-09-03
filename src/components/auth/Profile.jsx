import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { User, Mail, Camera, AlertCircle, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || null
  });
  
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    // Basic validation
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return;
    }

    try {
      // Create form data for file upload
      const profileData = new FormData();
      profileData.append('name', formData.name);
      profileData.append('bio', formData.bio);
      
      if (formData.profileImage && formData.profileImage instanceof File) {
        profileData.append('profileImage', formData.profileImage);
      }

      await updateProfile(profileData);
      setSuccessMessage('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  if (!user) {
    return (
      <div className="glass-effect rounded-xl p-8 text-center">
        <p className="text-white/70">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

      {error || formError ? (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-200">{formError || error}</p>
        </div>
      ) : null}

      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-200">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt={formData.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <label 
              htmlFor="profileImage" 
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
            >
              <Camera className="w-4 h-4 text-white" />
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
          <p className="mt-2 text-sm text-white/70">
            {user.subscriptionTier === 'free' ? 'Free Plan' : `${user.subscriptionTier} Plan`}
          </p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white/70 focus:outline-none"
              disabled={true}
            />
          </div>
          <p className="mt-1 text-xs text-white/50">
            Email cannot be changed
          </p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-white/70 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="block w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself..."
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

