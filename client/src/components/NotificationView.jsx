import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, Clock, Mail, Calendar, Briefcase, Info } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

export default function NotificationView({ getToken }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [getToken]);

  const markAsRead = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application_received': return <Mail className="w-5 h-5 text-blue-400" />;
      case 'interview_scheduled': return <Calendar className="w-5 h-5 text-lime-400" />;
      case 'application_status_update': return <Briefcase className="w-5 h-5 text-purple-400" />;
      default: return <Info className="w-5 h-5 text-white/40" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Bell className="w-12 h-12 text-[#c4eec6] opacity-20 mb-4" />
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Syncing notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#c4eec6]" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white tracking-tight uppercase leading-none">Notifications</h2>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">You have {notifications.filter(n => !n.isRead).length} unread alerts</p>
          </div>
        </div>
        
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notifications.length === 0 ? (
          <div className="card-premium !bg-transparent border-dashed border-white/10 flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center opacity-20">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">No notifications detected</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`card-premium !p-6 flex items-start gap-6 group transition-all duration-500 hover:border-white/20 ${!notification.isRead ? 'border-l-4 border-l-lime-400 bg-lime-400/5' : ''}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform ${!notification.isRead ? 'bg-lime-400/10' : 'bg-white/5'}`}>
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`text-sm font-bold tracking-tight ${!notification.isRead ? 'text-white' : 'text-white/60'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead && (
                      <button 
                        onClick={() => markAsRead(notification._id)}
                        className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-[#c4eec6] hover:bg-lime-400/20 transition-all"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification._id)}
                      className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-medium text-white/50 leading-relaxed max-w-2xl">
                  {notification.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
