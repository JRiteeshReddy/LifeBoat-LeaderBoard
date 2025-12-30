
import React, { useState } from 'react';
import { GAMES, LEADERBOARDS } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { mockSupabase } from '../services/mockSupabase';

export const RecordForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);
  const [formData, setFormData] = useState({
    category_id: LEADERBOARDS[0].id,
    value: '',
    proof_url: '',
    notes: '',
  });

  const validateYoutube = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateYoutube(formData.proof_url)) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    const { error } = await mockSupabase.from('records').insert({
      user_id: user?.id,
      category_id: formData.category_id,
      value: parseFloat(formData.value),
      proof_url: formData.proof_url,
      notes: formData.notes,
    });

    if (!error) {
      setSuccess(true);
    }
    setLoading(false);
  };

  const filteredLeaderboards = LEADERBOARDS.filter(lb => lb.game_id === selectedGame);

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-[32px] text-center animate-in zoom-in duration-300 shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-black mb-2 uppercase italic tracking-tighter">Submission Successful!</h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto text-sm font-medium">
          Your record has been logged as <strong>PENDING</strong>. Our moderators will review the footage to ensure competitive integrity.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-8 py-3 bg-black hover:bg-green-600 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md"
        >
          Submit Another Run
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Arena</label>
          <select 
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-red-500 focus:bg-white transition-all appearance-none cursor-pointer font-bold"
          >
            {GAMES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Engagement Category</label>
          <select 
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-red-500 focus:bg-white transition-all appearance-none cursor-pointer font-bold"
          >
            {filteredLeaderboards.map(lb => <option key={lb.id} value={lb.id}>{lb.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Performance Metric</label>
          <input 
            required
            type="number" 
            step="0.001"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="e.g. 12.450"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-red-500 focus:bg-white transition-all font-mono font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">YouTube Intel (Proof)</label>
          <div className="relative">
            <input 
              required
              type="url" 
              value={formData.proof_url}
              onChange={(e) => setFormData({ ...formData, proof_url: e.target.value })}
              placeholder="https://youtu.be/..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pl-12 text-black focus:outline-none focus:border-red-500 focus:bg-white transition-all text-sm font-medium"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Strategic Notes (Optional)</label>
        <textarea 
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Briefly describe your strategy..."
          rows={3}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-red-500 focus:bg-white transition-all resize-none text-sm font-medium"
        />
      </div>

      <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex gap-3 items-start shadow-sm">
        <div className="mt-0.5 text-red-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[10px] text-red-800 leading-relaxed font-black uppercase tracking-wider">
          Verification Requirement: Video must be unedited and clearly show the game scoreboard. Protocol violation results in immediate pilot disqualification.
        </p>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-black text-white font-black uppercase tracking-widest rounded-[20px] hover:bg-red-600 disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            TRANSMITTING DATA...
          </span>
        ) : 'UPLOAD RUN TO CLOUD'}
      </button>
    </form>
  );
};