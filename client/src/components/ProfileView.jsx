import React, { useState, useEffect } from 'react';
import { Mail, Phone, Save } from 'lucide-react';
import { InfinityLoader } from './UI/loader-13';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

const ProfileView = ({ user, userRole, getToken, addToast }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setFormData(prev => ({
              ...prev,
              bio: data.user.bio || '',
              phone: data.user.phone || ''
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setDbLoading(false);
      }
    };
    fetchProfile();
  }, [getToken]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Update Clerk Data (Name)
      if (user) {
        await user.update({
          firstName: formData.firstName,
          lastName: formData.lastName
        });
      }

      // 2. Update Backend Data (Bio, Phone)
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        if (addToast) addToast("Neural Profile updated successfully.", 'success');
        else alert("Profile updated successfully!");
      } else {
        if (addToast) addToast("Failed to sync profile data.", 'error');
        else alert("Failed to save profile data.");
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      if (addToast) addToast("Error during synchronization.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (dbLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <InfinityLoader size={60} className="text-[#c4eec6]" />
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em]">Accessing Profile Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="space-y-2 px-2">
        <h2 className="text-3xl font-display font-bold text-white tracking-tighter">Account Profile</h2>
        <p className="text-xs text-white/50 font-medium">Manage your personal information and market positioning.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="card-premium !p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 p-1 flex items-center justify-center relative group">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-[#c4eec6]/10 flex items-center justify-center">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[#c4eec6] opacity-30">{user?.firstName?.[0]}</span>
                )}
              </div>
              <div className="absolute inset-1 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="text-[8px] font-bold text-white uppercase tracking-widest">Change</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white">{user?.fullName}</h3>
              <p className="text-[10px] font-bold text-[#c4eec6] uppercase tracking-[0.2em]">{userRole} Account</p>
            </div>

            <div className="w-full pt-6 border-t border-white/5 space-y-3">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                <Mail className="w-4 h-4 text-white/30" />
                <div className="text-left">
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Primary Email</p>
                  <p className="text-xs font-medium text-white/80 truncate w-40">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="col-span-12 lg:col-span-8">
          <form onSubmit={handleSave} className="card-premium !p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:outline-none focus:border-[#c4eec6]/40 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:outline-none focus:border-[#c4eec6]/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Professional Bio</label>
              <textarea 
                rows="4"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Briefly describe your expertise and neural alignment goals..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:outline-none focus:border-[#c4eec6]/40 transition-all resize-none"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-semibold text-white focus:outline-none focus:border-[#c4eec6]/40 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="btn-primary !py-4 !px-10 text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 disabled:opacity-50"
              >
                {isSaving ? (
                  <>Synchronizing... <InfinityLoader size={16} /></>
                ) : (
                  <>Update Profile <Save className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
