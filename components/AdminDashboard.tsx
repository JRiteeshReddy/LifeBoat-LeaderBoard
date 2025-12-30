import React, { useState, useEffect } from 'react';
import { mockSupabase } from '../services/mockSupabase';
import { Gamemode, Category, UserRole, Profile } from '../types';
import { Icons } from '../constants';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'games' | 'users' | 'logs'>('games');
  const [gamemodes, setGamemodes] = useState<Gamemode[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'games') {
      const { data } = await mockSupabase.from('gamemodes').select();
      setGamemodes(data || []);
    } else if (activeTab === 'users') {
      const { data } = await mockSupabase.from('profiles').select();
      setUsers(data || []);
    } else if (activeTab === 'logs') {
      // Mock logs
      setLogs([
        { id: '1', actor: 'Hypixel_Mod', action: 'APPROVE_RECORD', target: 'Dream', date: new Date().toISOString() },
        { id: '2', actor: 'Hypixel_Mod', action: 'REJECT_RECORD', target: 'Techno', date: new Date().toISOString() },
      ]);
    }
  };

  const handleToggleActive = async (id: string, table: string, current: boolean) => {
    await mockSupabase.from(table).update({ is_active: !current }).eq('id', id);
    loadData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-4xl font-black text-black italic uppercase tracking-tighter">Command Center</h2>
          <p className="text-sm text-gray-500 mt-1 uppercase font-bold tracking-widest">Global Operations Control</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
          {['games', 'users', 'logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'games' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black uppercase tracking-tight">Gamemode Registry</h3>
              <button className="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-colors">Add Gamemode</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gamemodes.map(game => (
                <div key={game.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between group hover:border-red-600 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{game.icon}</span>
                    <div>
                      <h4 className="font-bold text-black uppercase text-sm">{game.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">ID: {game.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggleActive(game.id, 'gamemodes', game.is_active)}
                    className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest border transition-all ${
                      game.is_active ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-red-50 border-red-600 text-red-600'
                    }`}
                  >
                    {game.is_active ? 'ONLINE' : 'OFFLINE'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4">Pilot</th>
                  <th className="px-8 py-4">Auth Tier</th>
                  <th className="px-8 py-4">Joined</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4 flex items-center gap-3">
                      <img src={user.avatar_url} className="w-8 h-8 rounded border border-gray-200" alt="" />
                      <span className="text-sm font-bold text-black">{user.username}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                        user.role === 'admin' ? 'border-red-600 text-red-600 bg-red-50' :
                        user.role === 'moderator' ? 'border-blue-600 text-blue-600 bg-blue-50' :
                        'border-gray-600 text-gray-600 bg-gray-50'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-xs text-gray-500 font-mono">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-[10px] font-bold text-red-600 hover:text-black uppercase tracking-widest transition-colors">
                        Modify Clearance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black uppercase tracking-tight">Security & Moderation Logs</h3>
            <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
              {logs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 group hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <div>
                      <p className="text-sm font-bold text-black uppercase tracking-tight">
                        {log.actor} <span className="text-gray-500 font-normal italic">executed</span> {log.action}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono uppercase">Target: {log.target}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase">
                    {new Date(log.date).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};