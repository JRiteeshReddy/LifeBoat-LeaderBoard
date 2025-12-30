import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  onSuccess: (email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const LOGO_URL = "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/lifeboat-logo.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSuccess(email);
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white border-[4px] border-black rounded p-12 shadow-[16px_16px_0px_0px_#DC2626] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-5 bg-red-600 border-b-4 border-black"></div>
        
        <div className="text-center mb-12 mt-6">
          {/* Logo replacement for 'L' placeholder */}
          <div className="w-28 h-28 mx-auto mb-6">
            <img 
              src={LOGO_URL} 
              alt="LifeBoat Logo" 
              className="w-full h-full object-contain drop-shadow-[6px_6px_0px_rgba(0,0,0,0.2)]"
            />
          </div>
          <h2 className="text-4xl font-[900] text-black uppercase italic tracking-tighter leading-none">
            {isLogin ? 'Pilot Sync' : 'Fleet Registration'}
          </h2>
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.4em] mt-3">Identity Authentication Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest ml-1 italic">Network ID</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-black rounded px-5 py-4 text-black focus:outline-none focus:ring-4 focus:ring-blue-600 transition-all text-sm font-black"
              placeholder="PILOT@LIFEBOAT.PRO"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest ml-1 italic">Access Code</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-black rounded px-5 py-4 text-black focus:outline-none focus:ring-4 focus:ring-red-600 transition-all text-sm font-black"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.3em] rounded border-2 border-black shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:bg-blue-600 hover:border-blue-600 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none mt-6"
          >
            {loading ? 'SYNCING...' : isLogin ? 'Initiate Login' : 'Join Fleet'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t-2 border-black text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[11px] font-black text-black hover:text-blue-600 transition-colors uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-blue-600"
          >
            {isLogin ? "Request Clearance" : "Return to Sync"}
          </button>
        </div>
      </div>
    </div>
  );
};