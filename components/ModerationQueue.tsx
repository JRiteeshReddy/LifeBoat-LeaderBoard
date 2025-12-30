import React, { useEffect, useState } from 'react';
import { mockSupabase } from '../services/mockSupabase';
import { GameRecord } from '../types';
import { formatValue } from '../services/leaderboardService';
import { Icons } from '../constants';

export const ModerationQueue: React.FC = () => {
  const [pendingRecords, setPendingRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<GameRecord | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const { data } = await mockSupabase.from('records').select().eq('status', 'pending');
    setPendingRecords(data || []);
    setLoading(false);
  };

  const handleAction = async (status: 'approved' | 'rejected' | 'changes_requested') => {
    if (!reviewing) return;
    
    await mockSupabase.from('records').update({ 
      status, 
      moderator_feedback: feedback,
      verified_at: new Date().toISOString()
    }).eq('id', reviewing.id);
    
    setReviewing(null);
    setFeedback('');
    loadQueue();
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scanning Network...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-black italic uppercase tracking-tighter">Moderation Console</h2>
        <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
          Queue: {pendingRecords.length} Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* List */}
        <div className="space-y-4">
          {pendingRecords.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-gray-200 rounded-3xl text-center">
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Clear Skies. No pending records.</p>
            </div>
          ) : (
            pendingRecords.map(record => (
              <div 
                key={record.id}
                onClick={() => setReviewing(record)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  reviewing?.id === record.id 
                  ? 'bg-blue-50 border-blue-600 shadow-lg' 
                  : 'bg-white border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img src={record.profiles?.avatar_url} className="w-10 h-10 rounded-lg border border-gray-200" alt="" />
                    <div>
                      <h4 className="font-bold text-black text-sm">{record.profiles?.username}</h4>
                      <p className="text-[10px] text-gray-500 font-mono uppercase">Submitted {new Date(record.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-black font-mono">{record.value}</span>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">PENDING REVIEW</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 p-2 rounded-lg">
                  <span className="flex items-center gap-1 text-red-600">
                    <Icons.Shield className="w-3 h-3" /> {record.categories?.name}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Review Panel */}
        <div className="sticky top-24 h-fit">
          {reviewing ? (
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-black">
                {getYoutubeId(reviewing.proof_url) ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${getYoutubeId(reviewing.proof_url)}`} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-600 text-xs font-bold uppercase">Invalid Proof Link</div>
                )}
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Submission Intelligence</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-700 italic">"{reviewing.notes || "No operative notes provided."}"</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Moderator Feedback</label>
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter reason..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:border-blue-600 outline-none resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleAction('approved')}
                    className="py-3 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all"
                  >
                    APPROVE
                  </button>
                  <button 
                    onClick={() => handleAction('changes_requested')}
                    className="py-3 bg-gray-200 text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-gray-300 transition-all"
                  >
                    QUERY
                  </button>
                  <button 
                    onClick={() => handleAction('rejected')}
                    className="py-3 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-red-700 transition-all"
                  >
                    REJECT
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400">
              <Icons.Video className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">Select a run to initiate analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};