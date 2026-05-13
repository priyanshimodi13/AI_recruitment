import React, { useState } from 'react';
import { BookOpen, MessageSquare, Users, Send, HelpCircle, ChevronRight } from 'lucide-react';

const HelpSupportView = ({ addToast }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'General Inquiry',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      setFormData({ subject: '', category: 'General Inquiry', message: '' });
      if (addToast) addToast("Support request synchronized. We'll contact you soon.", 'success');
      else alert("Message sent successfully!");
    }, 1500);
  };

  const supportCards = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Guides, tutorials and API references for the Hire.Vision ecosystem.",
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Neural synchronization with our support team in real-time.",
      color: "text-[#c4eec6]",
      bg: "bg-[#c4eec6]/10"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join discussions and network with other platform participants.",
      color: "text-indigo-400",
      bg: "bg-indigo-400/10"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* HEADER */}
      <div className="space-y-3 px-2">
        <h2 className="text-4xl font-display font-bold text-white tracking-tighter">Help & Support</h2>
        <p className="text-sm text-white/50 font-medium">Find answers or get in touch with our neural support team.</p>
      </div>

      {/* SUPPORT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportCards.map((card, i) => (
          <div key={i} className="card-premium p-8 group hover:border-white/20 transition-all duration-500 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                <p className="text-xs font-medium text-white/40 leading-relaxed">{card.description}</p>
              </div>
            </div>
            <div className="pt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c4eec6] cursor-pointer hover:gap-3 transition-all">
              View Resources <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* CONTACT FORM */}
      <div className="card-premium !p-10 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c4eec6]/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
        
        <div className="space-y-2 relative z-10">
          <h3 className="text-2xl font-display font-bold text-white tracking-tight">Contact Support</h3>
          <p className="text-xs font-medium text-white/40 italic">Can't find what you're looking for? Send us a message through the grid.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Subject</label>
              <input 
                required
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Brief summary of your query..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:outline-none focus:border-[#c4eec6]/40 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:outline-none focus:border-[#c4eec6]/40 transition-all appearance-none cursor-pointer"
              >
                <option value="General Inquiry" className="bg-[#09090b]">General Inquiry</option>
                <option value="Technical Issue" className="bg-[#09090b]">Technical Issue</option>
                <option value="Billing" className="bg-[#09090b]">Billing & Subscription</option>
                <option value="Role Synchronization" className="bg-[#09090b]">Role Synchronization</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Message</label>
            <textarea 
              required
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Describe your issue in detail..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:outline-none focus:border-[#c4eec6]/40 transition-all resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSending}
            className="w-full btn-primary !py-5 !rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSending ? (
              <>Synchronizing Message...</>
            ) : (
              <>Send Message <Send className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpSupportView;
