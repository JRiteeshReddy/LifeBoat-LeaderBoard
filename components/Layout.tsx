import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { useAuth } from '../hooks/useAuth';

const NavItem = ({ to, label, icon: Icon, active }: { to: string, label: string, icon: any, active: boolean }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 border-[3px] border-black transition-all font-black text-[11px] uppercase tracking-wider shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-white text-black'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-blue-600'}`} />
      <span>{label}</span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin';
  const isAdmin = profile?.role === 'admin';

  const LOGO_URL = "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/lifeboat-logo.png";

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r-[3px] border-black flex flex-col sticky top-0 h-auto md:h-screen z-20">
        <div 
          className="p-6 border-b-[3px] border-black bg-blue-600 cursor-pointer flex flex-row items-center gap-4 group" 
          onClick={() => navigate('/')}
        >
          {/* Reduced logo size and horizontal alignment */}
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <img 
              src={LOGO_URL} 
              alt="LifeBoat Logo" 
              className="w-full h-full object-contain drop-shadow-[3px_3px_0px_rgba(0,0,0,0.3)] group-hover:rotate-6 transition-transform"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-[900] tracking-tighter text-white uppercase italic leading-none">LifeBoat</h1>
            <p className="text-[9px] font-black text-white/90 uppercase tracking-[0.1em] mt-0.5">Leaderboard</p>
          </div>
        </div>

        <div className="p-5 space-y-6 flex-1 overflow-y-auto bg-white">
          <NavItem to="/" label="Main Page" icon={Icons.Trophy} active={location.pathname === '/'} />
          <NavItem to="/games" label="View Games" icon={Icons.Shield} active={location.pathname.startsWith('/games')} />
          <NavItem to="/submit" label="Send a Score" icon={Icons.Check} active={location.pathname === '/submit'} />
          
          {(isModerator || isAdmin) && (
            <div className="mt-10 pt-8 border-t-[3px] border-black space-y-4">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin</p>
              {isModerator && <NavItem to="/moderation" label="Check Scores" icon={Icons.Video} active={location.pathname === '/moderation'} />}
              {isAdmin && <NavItem to="/admin" label="Settings" icon={Icons.Shield} active={location.pathname === '/admin'} />}
            </div>
          )}
        </div>

        <div className="p-5 border-t-[3px] border-black bg-white">
          {user && profile ? (
            <div className="space-y-4">
              <Link 
                to="/profile" 
                className={`flex items-center gap-3 p-3 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] transition-all hover:bg-gray-50 ${
                  location.pathname === '/profile' ? 'bg-red-600 text-white shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-white'
                }`}
              >
                <img src={profile.avatar_url} alt="" className="w-8 h-8 border-2 border-black" />
                <span className="text-[11px] font-black uppercase truncate">{profile.username}</span>
              </Link>
              <button 
                onClick={logout}
                className="w-full py-3 bg-black text-white text-[11px] font-black uppercase border-[3px] border-black hover:bg-red-600 transition-all shadow-[4px_4px_0px_0px_#2563EB]"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/auth')}
              className="w-full py-4 bg-black text-white text-[12px] font-black uppercase border-[3px] border-black hover:bg-blue-600 transition-all shadow-[4px_4px_0px_0px_#2563EB] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Log In
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 bg-white border-b-[3px] border-black px-10 flex items-center sticky top-0 z-10">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search for a player..."
                className="w-full bg-white border-[3px] border-black px-6 py-3 text-sm font-bold focus:outline-none focus:bg-blue-50 transition-colors placeholder-gray-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">SEARCH</div>
            </div>
          </div>
        </header>

        <main className="p-10 lg:p-14 bg-white min-h-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
