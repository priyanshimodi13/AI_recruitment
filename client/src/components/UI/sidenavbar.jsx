import { Button } from "@/components/UI/button";
import {
 Collapsible,
 CollapsibleContent,
 CollapsibleTrigger,
} from "@/components/UI/collapsible";
import { ScrollArea } from "@/components/UI/scroll-area";
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
 Plus
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidenavbar({ children, userRole = 'candidate', activeView, setActiveView }) {
 const [isOpen, setIsOpen] = useState(true);
 const location = useLocation();

 const navItems = userRole === 'admin' ? [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: CheckCircle2, label: "Resumes" },
  { icon: Briefcase, label: "Jobs" },
 ] : userRole === 'employer' ? [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Briefcase, label: "Jobs" },
  { icon: Calendar, label: "Interviews" },
  { icon: CheckCircle2, label: "Candidates" },
 ] : [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Briefcase, label: "Jobs" },
  { icon: Calendar, label: "Preparation" },
  { icon: CheckCircle2, label: "Applications" },
 ];

 return (
  <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
   <aside
    className={`${
     isOpen ? "w-72" : "w-20"
    } flex flex-col border-r border-[var(--color-border)] transition-all duration-500 ease-in-out bg-[#09090b] z-30`}
   >
    <div className="flex h-20 items-center justify-between px-6 border-b border-[var(--color-border)]">
     <div className={`${isOpen ? "flex" : "hidden"} items-center gap-3 overflow-hidden`}>
      <div className="w-8 h-8 bg-[#c4eec6] rounded-lg flex items-center justify-center shrink-0">
        <span className="text-black font-bold text-base">H</span>
      </div>
      <span className="text-lg font-bold uppercase tracking-tight text-[var(--color-heading)] whitespace-nowrap">
        HireVision
      </span>
     </div>
     {!isOpen && (
      <div className="w-8 h-8 bg-[#c4eec6] rounded-lg flex items-center justify-center mx-auto">
        <span className="text-black font-bold text-base">H</span>
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
    
    <ScrollArea className="flex-1 px-3 py-6">
     <nav className="space-y-3">
      <p className={`${isOpen ? "px-4 text-left" : "text-center"} text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 opacity-40`}>
       {isOpen ? "Primary Menu" : "Menu"}
      </p>
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
        <p className={`${isOpen ? "px-4 text-left" : "text-center"} text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 opacity-40`}>
        {isOpen ? "Platform Overview" : "Overview"}
       </p>
       {[
        { icon: User, label: "Profile", path: "/profile" },
        { icon: Settings, label: "Settings", path: "/settings" },
       ].map((item, i) => (
        <Button
         key={i}
         variant="ghost"
         className={`w-full ${isOpen ? "justify-start px-6" : "justify-center px-0"} py-8 rounded-[1.5rem] text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white transition-all duration-500 group`}
        >
         <item.icon className="w-6 h-6 shrink-0 opacity-70 group-hover:opacity-100" />
         {isOpen && <span className="ml-5 text-sm uppercase tracking-widest">{item.label}</span>}
        </Button>
       ))}
      </div>
     </nav>
    </ScrollArea>

    {isOpen && (
     <div className="p-8">
      <div className="bg-gradient-to-br from-lime-400/20 to-transparent rounded-[2rem] p-6 border border-lime-400/10 relative overflow-hidden group shadow-inner">
       <p className="text-[10px] font-bold text-lime-400 mb-2 uppercase tracking-widest ">Core Status</p>
       <p className="text-[10px] text-[var(--color-text-muted)] font-bold mb-4 leading-relaxed opacity-70">AI career intelligence is fully synchronized.</p>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
         <div className="h-full bg-lime-400 w-4/5 shadow-[0_0_15px_rgba(200,241,53,0.5)]"></div>
       </div>
      </div>
     </div>
    )}
   </aside>

   <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#09090b]">
     {/* TOP BAR */}
     <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#09090b]/80 backdrop-blur-3xl z-20">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 group cursor-pointer">
         <div className="w-8 h-8 rounded-full bg-[#c4eec6] flex items-center justify-center font-bold text-black text-[10px] group-hover:scale-105 transition-all">
           RC
         </div>
         <div className="hidden sm:block">
           <p className="text-[10px] font-bold uppercase tracking-wide text-white/50 leading-none mb-1">Ryan Crawford</p>
           <p className="text-[9px] font-bold text-[#c4eec6] uppercase tracking-wider">Premium Account</p>
         </div>
        </div>
        <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c4eec6] text-black text-xs font-bold hover:opacity-90 transition-all">
         Post Job <Plus className="w-3.5 h-3.5" />
        </button>
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
         <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all relative">
          <Calendar className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full"></span>
         </div>
        </div>
      </div>
     </header>

     <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
      {children}
     </div>
   </main>
  </div>
 );
}
