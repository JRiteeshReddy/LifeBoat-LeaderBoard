import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RecordForm } from './components/RecordForm';
import { StrategyAnalyst } from './components/StrategyAnalyst';
import { LeaderboardView } from './components/LeaderboardView';
import { Auth } from './components/Auth';
import { ProfilePage } from './components/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ModerationQueue } from './components/ModerationQueue';
import { AdminDashboard } from './components/AdminDashboard';
import { GAMES, Icons } from './constants';
import { mockSupabase } from './services/mockSupabase';
import { Category, Gamemode, Profile } from './types';
import { useAuth } from './hooks/useAuth';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-16">
      {/* Balanced Hero Section */}
      <div className="relative group">
        <div className="bg-red-600 border-4 border-black rounded p-14 text-white overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] mb-8 border-2 border-white">EST. 2024 • LIFEBOAT ARCHIVE</div>
            <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-6 leading-none">Championship<br/>Database</h2>
            <p className="text-xl font-bold opacity-90 mb-10 leading-snug">
              Official record tracking for the LifeBoat network. Competitive integrity enforced through video metadata validation.
            </p>
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => navigate('/games')}
                className="px-10 py-5 bg-white text-black text-sm font-black uppercase rounded border-2 border-black hover:bg-blue-600 hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                Enter Arenas
              </button>
              <button 
                onClick={() => navigate('/submit')}
                className="px-10 py-5 bg-black text-white text-sm font-black uppercase rounded border-2 border-black hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                Submit Entry
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 text-[28rem] font-black opacity-10 italic pointer-events-none select-none translate-x-1/4 -translate-y-1/4">LB</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-3 space-y-16">
          {/* Games Grid - Red/Blue Balance */}
          <section>
            <div className="flex items-center justify-between mb-10 border-b-4 border-black pb-2">
              <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter flex items-center gap-4">
                <div className="w-3 h-8 bg-blue-600 border-2 border-black"></div> Active Sectors
              </h3>
              <button onClick={() => navigate('/games')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Full Registry</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {GAMES.map((game, idx) => (
                <div 
                  key={game.id} 
                  onClick={() => navigate('/games')}
                  className={`group cursor-pointer bg-white border-2 border-black rounded overflow-hidden transition-all hover:-translate-x-1 hover:-translate-y-1 ${
                    idx % 2 === 0 ? 'hover:shadow-[10px_10px_0px_0px_rgba(220,38,38,1)]' : 'hover:shadow-[10px_10px_0px_0px_rgba(37,99,235,1)]'
                  }`}
                >
                  <div className="flex h-40">
                    <div className="w-40 bg-gray-50 border-r-2 border-black flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center bg-white">
                      <h4 className="text-xl font-black text-black uppercase italic">{game.name}</h4>
                      <p className="text-xs text-gray-500 font-bold mt-2 uppercase tracking-tight line-clamp-2">{game.description}</p>
                      <div className="mt-4 flex gap-1">
                         <div className="w-4 h-1 bg-red-600"></div>
                         <div className="w-4 h-1 bg-blue-600"></div>
                         <div className="w-4 h-1 bg-black"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Feed */}
          <section>
            <div className="flex items-center justify-between mb-10 border-b-4 border-black pb-2">
              <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter flex items-center gap-4">
                <div className="w-3 h-8 bg-red-600 border-2 border-black"></div> Recent Logs
              </h3>
              <button className="text-xs font-black text-red-600 uppercase tracking-widest hover:underline">Global Stream</button>
            </div>
            <div className="bg-white border-2 border-black rounded overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black text-white uppercase font-black text-[10px] border-b-2 border-black tracking-[0.3em]">
                    <th className="px-8 py-5">Pilot Identity</th>
                    <th className="px-8 py-5">Combat Area</th>
                    <th className="px-8 py-5 text-right">Result</th>
                    <th className="px-8 py-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black font-bold">
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded border-2 border-black bg-white flex items-center justify-center font-black">P</div>
                        <span className="text-sm font-black text-black hover:text-blue-600 cursor-pointer uppercase tracking-tight">Pilot_{i * 992}</span>
                      </td>
                      <td className="px-8 py-5">
                         <div className="text-[10px] font-black text-red-600 uppercase tracking-widest">SKYWARS</div>
                         <div className="text-xs text-black font-bold uppercase italic">Fastest Win</div>
                      </td>
                      <td className="px-8 py-5 text-right font-mono text-black font-black italic text-xl tracking-tighter">14.{i * 12}s</td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1 bg-blue-600 text-white rounded border-2 border-black text-[9px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">VERIFIED</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-16">
          <StrategyAnalyst />
          
          <div className="bg-white border-2 border-black rounded p-8 shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]">
            <h4 className="text-[12px] font-black text-black uppercase tracking-[0.4em] mb-8 border-b-2 border-black pb-2">Global Meta</h4>
            <div className="space-y-10">
              {[
                { label: 'Verified Streams', value: '42,109', color: 'blue' },
                { label: 'Active Pilots', value: '8,421', color: 'red' },
                { label: 'Sector Records', value: '942', color: 'black' }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col group">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">{stat.label}</p>
                  <p className={`text-5xl font-black italic tracking-tighter ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'red' ? 'text-red-600' : 'text-black'}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<Gamemode | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [gamemodes, setGamemodes] = useState<Gamemode[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await mockSupabase.from('gamemodes').select();
      setGamemodes(data || []);
    };
    load();
  }, []);

  const handleSelectGame = async (game: Gamemode) => {
    setSelectedGame(game);
    const { data } = await mockSupabase.from('categories').select().eq('gamemode_id', game.id);
    setCategories(data || []);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between border-b-4 border-black pb-6">
        <div className="flex items-center gap-6">
          {selectedGame && (
            <button 
              onClick={() => setSelectedGame(null)}
              className="w-12 h-12 border-2 border-black rounded flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="text-6xl font-black uppercase italic text-black tracking-tighter">
            {selectedGame ? selectedGame.name : 'Operation Registry'}
          </h2>
        </div>
      </div>

      {!selectedGame ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {gamemodes.map((game, idx) => (
            <div 
              key={game.id} 
              onClick={() => handleSelectGame(game)}
              className={`bg-white border-2 border-black rounded p-12 text-center cursor-pointer transition-all hover:-translate-x-1 hover:-translate-y-1 group ${
                idx % 2 === 0 ? 'hover:shadow-[12px_12px_0px_0px_rgba(220,38,38,1)]' : 'hover:shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]'
              }`}
            >
              <div className="text-8xl mb-8 group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12">{game.icon}</div>
              <h3 className="text-xl font-black uppercase text-black italic mb-2">{game.name}</h3>
              <p className="text-[10px] font-black text-blue-600 mt-2 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity">Select Sector</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {/* Brutalist Category Tab Bar */}
          <div className="flex flex-wrap gap-3 p-2 bg-black border-2 border-black rounded shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 min-w-[180px] px-8 py-5 text-xs font-black uppercase tracking-[0.3em] rounded border-2 border-transparent transition-all ${
                  selectedCategory?.id === cat.id 
                  ? 'bg-red-600 text-white border-white shadow-inner' 
                  : 'text-white hover:bg-gray-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            {selectedCategory ? (
              <LeaderboardView category={selectedCategory} />
            ) : (
              <div className="h-96 flex flex-col items-center justify-center bg-white border-4 border-dashed border-black rounded">
                <div className="w-28 h-28 rounded-full border-2 border-black flex items-center justify-center mb-8 bg-blue-50">
                   <Icons.Trophy className="w-16 h-16 text-blue-600" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.5em] text-black">Select Category to Synchronize</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SubmitPage = () => (
  <div className="max-w-4xl mx-auto space-y-12 pb-24">
    <div className="border-b-4 border-black pb-4 flex items-center gap-6">
      <div className="w-6 h-12 bg-blue-600 border-2 border-black"></div>
      <h2 className="text-6xl font-black uppercase italic text-black tracking-tighter leading-none">Transmission<br/>Portal</h2>
    </div>
    <div className="bg-white border-4 border-black rounded p-14 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 text-[12rem] font-black text-gray-100 opacity-20 pointer-events-none select-none">UPLOAD</div>
      <RecordForm />
    </div>
  </div>
);

const App: React.FC = () => {
  const { user, profile, loading, login, setProfile } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/auth" element={<Auth onSuccess={login} />} />
          
          <Route path="/submit" element={
            <ProtectedRoute isAuthenticated={!!user} isLoading={loading}>
              <SubmitPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute isAuthenticated={!!user} isLoading={loading}>
              {profile && <ProfilePage profile={profile} onUpdate={(data) => setProfile({...profile, ...data})} />}
            </ProtectedRoute>
          } />

          <Route path="/moderation" element={
            <ProtectedRoute isAuthenticated={!!user && (profile?.role === 'moderator' || profile?.role === 'admin')} isLoading={loading}>
              <ModerationQueue />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute isAuthenticated={!!user && profile?.role === 'admin'} isLoading={loading}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;