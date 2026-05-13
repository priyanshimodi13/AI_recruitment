import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  ThumbsUp, 
  MessageCircle, 
  Eye, 
  Clock, 
  TrendingUp, 
  HelpCircle,
  MoreVertical,
  Pin
} from 'lucide-react';

const CommunityView = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [postContent, setPostContent] = useState('');

  const tabs = ['All', 'Discussions', 'Questions', 'Polls'];

  const mockPosts = [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 px-2">
        <h2 className="text-3xl font-display font-bold text-white tracking-tighter">Community</h2>
        <div className="flex-grow flex justify-end">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search community..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-[#c4eec6]/40"
            />
          </div>
        </div>
      </div>

      {/* CREATE POST BOX */}
      <div className="card-premium p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400 font-bold">
          P
        </div>
        <div className="flex-grow">
          <input 
            type="text" 
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm text-white focus:outline-none focus:border-[#c4eec6]/40"
          />
        </div>
        <button className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/90 transition-all">
          <Plus className="w-3.5 h-3.5" /> Post
        </button>
      </div>

      {/* TABS & FILTERS */}
      <div className="space-y-4">
        <div className="flex border-b border-white/5">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab === 'Discussions' && <MessageSquare className="w-3.5 h-3.5" />}
                {tab === 'Questions' && <HelpCircle className="w-3.5 h-3.5" />}
                {tab === 'Polls' && <TrendingUp className="w-3.5 h-3.5" />}
                {tab}
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c4eec6]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full bg-transparent border-none rounded-xl py-2 pl-10 pr-6 text-xs text-white focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4 text-white/30">
            <Clock className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <TrendingUp className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <HelpCircle className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* POSTS LIST */}
      <div className="space-y-6">
        {mockPosts.length > 0 ? mockPosts.map(post => (
          <div key={post.id} className="card-premium p-8 group hover:border-white/20 transition-all duration-500 relative">
            <div className="space-y-6">
              {post.isPinned && (
                <div className="flex items-center gap-2 text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] -mb-2">
                  <Pin className="w-3 h-3 rotate-45" /> Pinned
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-400/20 border border-orange-400/30 flex items-center justify-center">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} 
                      className="w-full h-full rounded-full opacity-80" 
                      alt="" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{post.author}</p>
                      {post.role === 'Staff' && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[7px] font-bold uppercase tracking-widest">
                          Staff
                        </span>
                      )}
                      <span className="text-[10px] text-white/30">&bull; {post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={`px-2 py-0.5 rounded-full ${post.type === 'Poll' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'} text-[7px] font-bold uppercase tracking-widest flex items-center gap-1`}>
                        {post.type === 'Poll' ? <TrendingUp className="w-2.5 h-2.5" /> : <MessageSquare className="w-2.5 h-2.5" />}
                        {post.type}
                      </div>
                    </div>
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-white/20 cursor-pointer" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white leading-tight group-hover:text-[#c4eec6] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs font-medium text-white/50 leading-relaxed line-clamp-3">
                  {post.content}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-6 text-white/30">
                <button className="flex items-center gap-2 hover:text-white transition-all">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-white transition-all">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{post.comments}</span>
                </button>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{post.views}</span>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-40 text-center card-premium !border-dashed !border-white/10">
            <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-sm font-bold text-white/30 uppercase tracking-[0.4em]">No neural transmissions detected</p>
            <p className="text-[10px] text-white/20 mt-2 font-medium">Be the first to synchronize with the community.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityView;
