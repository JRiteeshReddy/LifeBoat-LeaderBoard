import React, { useEffect, useState } from 'react';
import { fetchLeaderboard, formatValue } from '../services/leaderboardService';
import { Category, MetricType } from '../types';
import { Icons } from '../constants';

interface LeaderboardViewProps {
  category: Category;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ category }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState('all-time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchLeaderboard(category.id, filter);
      setRecords(data);
      setLoading(false);
    };
    load();
  }, [category.id, filter]);

  const getRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-red-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
      case 2: return 'bg-blue-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
      case 3: return 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
      default: return 'text-black border-black bg-white';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white border-2 border-black p-10 rounded shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-blue-600 border-4 border-black flex items-center justify-center text-4xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
             {category.gamemodes?.icon || '🏆'}
          </div>
          <div>
            <h2 className="text-5xl font-black uppercase text-black italic tracking-tighter leading-none">{category.name}</h2>
            <div className="flex gap-4 mt-4">
              <span className="text-[11px] font-black px-4 py-1.5 bg-red-600 text-white uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">RANKED STATUS</span>
              <span className="text-[11px] font-black px-4 py-1.5 border-2 border-black text-black uppercase tracking-widest bg-gray-50">
                {category.metric_type.toUpperCase()} ARCHIVE
              </span>
            </div>
          </div>
        </div>
        <div className="flex bg-black border-2 border-black p-2 rounded">
          {['all-time', 'monthly', 'weekly'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-4 rounded text-[11px] font-black uppercase tracking-[0.3em] transition-all border-2 border-transparent ${
                filter === f ? 'bg-blue-600 text-white border-white shadow-inner' : 'text-white hover:bg-gray-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-black rounded overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
        {loading ? (
          <div className="p-40 flex flex-col items-center justify-center space-y-10 bg-gray-50">
            <div className="w-20 h-20 border-4 border-black border-t-red-600 rounded-full animate-spin shadow-2xl"></div>
            <p className="text-base font-black text-black uppercase tracking-[0.6em] italic animate-pulse">Synchronizing Data Buffer...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-black text-white uppercase font-black text-[11px] border-b-2 border-black tracking-[0.5em]">
              <tr>
                <th className="px-10 py-7 w-28 text-center">Pos</th>
                <th className="px-10 py-7">Pilot Interface</th>
                <th className="px-10 py-7 text-right">Metric Value</th>
                <th className="px-10 py-7 text-right hidden lg:table-cell">Timestamp</th>
                <th className="px-10 py-7 text-center">Intel</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-black font-bold">
              {records.map((record) => (
                <tr 
                  key={record.id} 
                  className={`group transition-all ${record.is_pb ? 'bg-red-50/50' : 'hover:bg-blue-50/50'}`}
                >
                  <td className="px-10 py-7">
                    <div className={`w-14 h-14 rounded border-2 flex items-center justify-center font-black italic text-xl ${getRankStyle(record.rank)}`}>
                      {record.rank}
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-6">
                      <div className="relative group-hover:rotate-6 transition-transform">
                        <img src={record.avatar_url} className="w-14 h-14 rounded border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" alt="" />
                        {record.rank === 1 && (
                          <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded border-2 border-black flex items-center justify-center shadow-md">
                            <Icons.Trophy className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-black group-hover:text-blue-600 transition-colors uppercase tracking-tight text-lg">{record.username}</span>
                        <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">{record.role} clearance</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <span className="font-black font-mono italic text-4xl tracking-tighter group-hover:text-red-600 transition-colors">
                      {formatValue(record.value, category.metric_type)}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-right hidden lg:table-cell text-gray-400 font-black text-[12px] uppercase italic">
                    {new Date(record.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-7 text-center">
                    <a 
                      href={record.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-14 h-14 rounded border-2 border-black bg-white text-black hover:bg-black hover:text-white hover:border-black transition-all shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                      <Icons.Video className="w-7 h-7" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {records.length === 0 && !loading && (
          <div className="p-48 text-center space-y-12 bg-white">
            <div className="w-28 h-28 rounded border-2 border-dashed border-black flex items-center justify-center mx-auto text-black bg-gray-50 shadow-[12px_12px_0px_0px_rgba(220,38,38,1)]">
              <Icons.Shield className="w-16 h-16 opacity-20" />
            </div>
            <div className="space-y-4">
              <p className="text-black font-black uppercase tracking-[0.4em] text-2xl italic">NO DATA DETECTED</p>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Awaiting initial pilot synchronization.</p>
            </div>
            <button 
              onClick={() => window.location.hash = '#/submit'}
              className="px-14 py-6 bg-blue-600 text-white rounded border-2 border-black font-black uppercase tracking-widest hover:bg-black transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Initiate Transmission
            </button>
          </div>
        )}
      </div>
    </div>
  );
};