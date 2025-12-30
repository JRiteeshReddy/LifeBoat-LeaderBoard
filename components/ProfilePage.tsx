import React, { useState, useEffect } from 'react';
import { Profile, GameRecord } from '../types';
import { Icons } from '../constants';
import { mockSupabase } from '../services/mockSupabase';
import { formatValue } from '../services/leaderboardService';

interface ProfilePageProps {
  profile: Profile;
  onUpdate: (data: Partial<Profile>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [mySubmissions, setMySubmissions] = useState<GameRecord[]>([]);
  const [formData, setFormData] = useState({
    username: profile.username,
    bio: profile.bio || '',
  });

  useEffect(() => {
    const loadSubs = async () => {
      const { data } = await mockSupabase.from('records').select().eq('user_id', profile.id);
      setMySubmissions(data || []);
    };
    loadSubs();
  }, [profile.id]);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="h-2 bg-blue-600"></div>
        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <img 
              src={profile.avatar_url} 
              className="w-28 h-28 rounded-lg border-4 border-gray-100 shadow-sm" 
              alt="" 
            />
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow">
              <Icons.Shield className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <h2 className="text-3xl font-black text-black uppercase italic tracking-tight">{profile.username}</h2>
              <span className="inline-flex px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-black uppercase tracking-widest self-center">
                {profile.role}
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-xl italic font-medium leading-relaxed">
              {profile.bio || "This pilot has not yet broadcasted a public biography."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase rounded hover:bg-red-600 transition-all"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button className="px-6 py-2 bg-white border border-gray-200 text-gray-500 text-[10px] font-black uppercase rounded hover:bg-gray-100 transition-all">
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operation History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase font-black border-b border-gray-100">
                    <th className="px-6 py-3">Mode</th>
                    <th className="px-6 py-3">Performance</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Video</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mySubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-bold text-black uppercase">{sub.categories?.name || 'Unknown'}</td>
                      <td className="px-6 py-3 font-mono font-black italic text-sm">{sub.value}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          sub.status === 'approved' ? 'bg-blue-50 text-blue-600' : 
                          sub.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <a href={sub.proof_url} target="_blank" className="text-red-600 hover:scale-110 inline-block transition-transform">
                          <Icons.Video className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {mySubmissions.length === 0 && (
                <div className="p-12 text-center text-gray-400 uppercase font-black tracking-widest text-[10px]">No records found.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Key Metrics</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-[9px] font-black text-gray-400 uppercase">Total Runs</p>
                <p className="text-3xl font-black text-black italic">{mySubmissions.length}</p>
              </div>
              <div className="text-center p-4 bg-red-600 rounded">
                <p className="text-[9px] font-black text-white/70 uppercase">World Records</p>
                <p className="text-3xl font-black text-white italic">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};