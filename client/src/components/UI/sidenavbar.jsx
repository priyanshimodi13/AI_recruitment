import { Button } from "@/components/UI/button";
import {
 Collapsible,
 CollapsibleContent,
 CollapsibleTrigger,
} from "@/components/UI/collapsible";

import {
 ChevronRight,
 Home,
 Menu,
 Package,
 Settings,
 Users,
 LayoutDashboard,
 Briefcase,
 Calendar,
 CheckCircle2,
 User,
 Search,
 Plus,
 Bell,
 LogOut,
 HelpCircle
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, SignOutButton, useAuth, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";

 export default function Sidenavbar({ children, userRole = 'candidate', activeView, setActiveView, onPostJob }) {
   const [isOpen, setIsOpen] = useState(true);
   const [unreadCount, setUnreadCount] = useState(0);
   const [showLogoutModal, setShowLogoutModal] = useState(false);
   const { user } = useUser();
   const { getToken } = useAuth();
   const { signOut } = useClerk();
   const location = useLocation();

  const fetchUnreadCount = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5957'}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const unread = data.notifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [getToken]);

  useEffect(() => {
    // If we just navigated to Notifications, we might want to refresh count soon
    if (activeView === 'Notifications') {
      setTimeout(fetchUnreadCount, 1000);
    }
  }, [activeView]);

 const navItems = userRole === 'admin' ? [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CheckCircle2, label: "Resumes" },
  { icon: Briefcase, label: "Jobs" },
  { icon: User, label: "Profile" },
 ] : userRole === 'employer' ? [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Briefcase, label: "Jobs" },
  { icon: Calendar, label: "Interviews" },
  { icon: CheckCircle2, label: "Candidates" },
  { icon: User, label: "Profile" },
 ] : [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Briefcase, label: "Jobs" },
  { icon: Calendar, label: "Interviews" },
  { icon: CheckCircle2, label: "Applications" },
  { icon: User, label: "Profile" },
 ];

 return (
  <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
   <aside
    className={`${
     isOpen ? "w-72" : "w-20"
    } flex flex-col border-r border-[var(--color-border)] transition-all duration-500 ease-in-out bg-[#09090b] z-30`}
   >
    <div className={`flex h-20 items-center ${isOpen ? 'justify-between' : 'justify-center'} px-6 border-b border-[var(--color-border)]`}>
      {isOpen && (
        <div className="flex items-center gap-2 overflow-hidden group cursor-pointer">
         <div className="p-1.5 bg-[#c4eec6]/10 rounded-lg border border-[#c4eec6]/20">
          <Briefcase className="w-4 h-4 text-[#c4eec6]" />
         </div>
         <span className="text-base font-display font-bold tracking-tight text-[#c4eec6]">
          Hire.Vision
         </span>
        </div>
      )}
     <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsOpen(!isOpen)}
      className="text-[var(--color-text-muted)] hover:text-white"
     >
      <Menu className="h-5 w-5" />
     </Button>
    </div>
    
    <div className="flex-1 px-3 py-6">
     <nav className="space-y-3">
      {isOpen && (
       <p className="px-4 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 opacity-40">
        Primary Menu
       </p>
      )}
      {navItems.map((item, i) => (
       <Button
        key={i}
        variant="ghost"
        onClick={() => setActiveView && setActiveView(item.label)}
        className={`w-full ${isOpen ? "justify-start px-5" : "justify-center px-0"} py-6 rounded-[1.25rem] transition-all duration-500 group
         ${activeView === item.label 
          ? 'bg-lime-400 text-black shadow-xl shadow-lime-400/20 font-bold' 
          : 'text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white'}`}
       >
        <item.icon className={`w-5 h-5 shrink-0 ${activeView === item.label ? 'text-black' : 'opacity-70 group-hover:opacity-100'}`} />
        {isOpen && <span className="ml-4 text-xs uppercase tracking-widest">{item.label}</span>}
       </Button>
      ))}

      <div className="pt-10 mt-10 border-t border-white/5">
        {isOpen && (
         <p className="px-4 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 opacity-40">
          Platform Overview
         </p>
        )}
       {[
        { icon: Bell, label: "Notifications" },
        { icon: HelpCircle, label: "Help & Support" },
       ].map((item, i) => (
         <Button
          key={i}
          variant="ghost"
          onClick={() => setActiveView && setActiveView(item.label)}
          className={`w-full ${isOpen ? "justify-start px-6" : "justify-center px-0"} py-8 rounded-[1.5rem] text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white transition-all duration-500 group
           ${activeView === item.label ? 'bg-white/5 text-white' : ''}`}
         >
          <item.icon className={`w-6 h-6 shrink-0 ${activeView === item.label ? 'text-[#c4eec6]' : 'opacity-70 group-hover:opacity-100'}`} />
          {isOpen && <span className="ml-5 text-sm uppercase tracking-widest">{item.label}</span>}
         </Button>
       ))}

        <div className="pt-4 mt-4 border-t border-white/5">
          <Button
           variant="ghost"
           onClick={() => setShowLogoutModal(true)}
           className={`w-full ${isOpen ? "justify-start px-6" : "justify-center px-0"} py-8 rounded-[1.5rem] text-red-400/60 hover:bg-red-400/5 hover:text-red-400 transition-all duration-500 group`}
          >
           <LogOut className="w-6 h-6 shrink-0 opacity-70 group-hover:opacity-100" />
           {isOpen && <span className="ml-5 text-sm uppercase tracking-widest">Sign Out</span>}
          </Button>
        </div>
      </div>
     </nav>
    </div>

   </aside>

   <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#09090b]">
     {/* TOP BAR */}
     <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#09090b]/80 backdrop-blur-3xl z-20">
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-4 group cursor-pointer"
          onClick={() => setActiveView && setActiveView('Profile')}
        >
         <div className="w-8 h-8 rounded-full bg-[#c4eec6] flex items-center justify-center font-bold text-black text-[10px] group-hover:scale-105 transition-all overflow-hidden">
           {user?.imageUrl ? (
             <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
           ) : (
             user?.firstName?.[0] || 'U'
           )}
         </div>
         <div className="hidden sm:block">
           <p className="text-[10px] font-bold uppercase tracking-wide text-white/50 leading-none mb-1 group-hover:text-white transition-colors">{user?.fullName || 'User Profile'}</p>
           <p className="text-[9px] font-bold text-[#c4eec6] uppercase tracking-wider">{userRole} Account</p>
         </div>
        </div>

      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-64 hidden xl:block">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
         <input 
          type="text" 
          placeholder="Search Node..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-14 pr-6 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-lime-400/40 transition-all placeholder:text-white/10"
         />
        </div>
        <div className="flex items-center gap-3">
         <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
          <Settings className="w-5 h-5" />
         </button>
         <button 
           onClick={() => setActiveView && setActiveView('Notifications')}
           className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all relative ${
             activeView === 'Notifications' 
             ? 'bg-lime-400 border-lime-400 text-black' 
             : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:bg-white/10'
           }`}
         >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#09090b] text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
         </button>
        </div>
      </div>
     </header>

     <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
      {children}
     </div>
   </main>

   {/* LOGOUT CONFIRMATION MODAL */}
   {showLogoutModal && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
     <div className="relative w-full max-w-sm bg-[#09090b] rounded-[2.5rem] border border-white/10 shadow-2xl p-10 overflow-hidden text-center space-y-8 animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-red-400/10 rounded-full flex items-center justify-center mx-auto border border-red-400/20">
       <LogOut className="w-8 h-8 text-red-400" />
      </div>
      
      <div className="space-y-3">
       <h2 className="text-2xl font-display font-bold text-white tracking-tight">Are you sure?</h2>
       <p className="text-sm text-white/40 font-medium">You will be logged out of your neural session.</p>
      </div>
      
      <div className="flex gap-4">
       <button 
        onClick={() => setShowLogoutModal(false)}
        className="flex-1 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
       >
        No, Cancel
       </button>
       <button 
        onClick={() => signOut()}
        className="flex-1 py-4 px-6 rounded-2xl bg-red-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
       >
        Yes, Logout
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 );
}
