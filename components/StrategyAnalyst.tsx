import React, { useState } from 'react';
import { getStrategyAdvice } from '../services/geminiService';

export const StrategyAnalyst: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const advice = await getStrategyAdvice("General Minecraft", query);
    setResponse(advice);
    setLoading(false);
  };

  return (
    <div className="bg-white border-2 border-black rounded p-8 shadow-[12px_12px_0px_0px_rgba(37,99,235,1)] relative overflow-hidden">
      <div className="flex items-center gap-4 mb-8 border-b-2 border-black pb-4">
        <div className="w-10 h-10 bg-blue-600 border-2 border-black rounded flex items-center justify-center text-[12px] text-white font-black italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">AI</div>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-black italic">Neural Intelligence</h3>
      </div>
      
      <p className="text-xs text-black font-black mb-8 leading-tight uppercase tracking-tight">
        Analyze arena mechanics and combat metadata.
      </p>

      <div className="space-y-4">
        <div className="relative">
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="e.g. movement meta"
            className="w-full bg-white border-2 border-black rounded px-4 py-4 text-xs text-black font-black focus:outline-none focus:ring-4 focus:ring-red-600/20 transition-all placeholder-gray-300"
          />
        </div>
        <button 
          onClick={handleAsk}
          disabled={loading}
          className="w-full py-4 bg-black hover:bg-red-600 text-white text-[11px] font-black rounded border-2 border-black transition-all uppercase tracking-[0.4em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {loading ? 'COMPUTING...' : 'Deploy Query'}
        </button>
      </div>

      {response && (
        <div className="mt-8 p-6 bg-blue-50 border-2 border-black rounded text-[11px] text-black leading-relaxed font-mono relative">
          <div className="absolute top-0 right-0 p-3 text-blue-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
          <div className="text-blue-600 font-black mb-2 uppercase tracking-[0.2em] border-b border-blue-200 pb-1 inline-block">INTEL_FEED:</div>
          <p className="mt-2">{response}</p>
        </div>
      )}
    </div>
  );
};