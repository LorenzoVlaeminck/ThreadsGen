import React, { useState } from 'react';
import { Wand2, Loader2, Users, AtSign, PenTool, Palette } from 'lucide-react';
import { LoadingState } from '../types';

interface InputFormProps {
  onGenerate: (offer: string, tone: string, audience: string, handle: string, style: string) => void;
  loadingState: LoadingState;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, loadingState }) => {
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [handle, setHandle] = useState('');
  const [tone, setTone] = useState('Conversational');
  const [style, setStyle] = useState('Auto-Match (AI)');

  const tones = [
    'Conversational',
    'Controversial',
    'Educational',
    'Minimalist',
    'Storytelling'
  ];

  const styles = [
    { id: 'Auto-Match (AI)', label: '✨ Auto (AI)', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { id: 'Minimalist', label: '🕊️ Minimalist', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 'Neon Cyberpunk', label: '⚡ Cyberpunk', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' },
    { id: 'Corporate', label: '💼 Corporate', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'Luxury', label: '👑 Luxury', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'Organic', label: '🌿 Organic', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offer.trim()) {
      onGenerate(offer, tone, audience, handle, style);
    }
  };

  const isLoading = loadingState === LoadingState.LOADING;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 p-6 md:p-8 mb-4 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 relative z-10">
        <span className="bg-slate-900 text-white p-2 rounded-xl shadow-lg shadow-slate-900/20">
            <Wand2 size={20} />
        </span>
        Post Configuration
      </h2>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        
        {/* Offer Input */}
        <div className="space-y-2">
          <label htmlFor="offer" className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
            What are you promoting?
          </label>
          <div className="relative group">
            <textarea
              id="offer"
              rows={3}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none text-slate-900 placeholder:text-slate-400 shadow-sm group-hover:bg-white"
              placeholder="e.g., My AI Writing Course launching on Friday..."
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="absolute right-3 top-3 text-slate-300 pointer-events-none group-focus-within:text-indigo-400 transition-colors">
                <PenTool size={16} />
            </div>
          </div>
        </div>

        {/* Audience & Handle Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Users size={14} className="text-indigo-500" /> Target Audience
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 shadow-sm placeholder:text-slate-400"
              placeholder="e.g. Freelancers"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <AtSign size={14} className="text-indigo-500" /> Your Handle (Preview)
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 shadow-sm placeholder:text-slate-400"
              placeholder="e.g. zuck"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Tone Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Vibe & Tone
          </label>
          <div className="flex flex-wrap gap-2.5">
            {tones.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border shadow-sm ${
                  tone === t
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105 ring-2 ring-slate-900 ring-offset-2'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Style Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Palette size={14} className="text-indigo-500" /> Visual Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {styles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                disabled={isLoading}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border shadow-sm text-center flex items-center justify-center gap-1.5 ${
                  style === s.id
                    ? `${s.color} ring-2 ring-offset-1 ring-slate-200 shadow-md scale-[1.02]`
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
            <button
            type="submit"
            disabled={isLoading || !offer.trim()}
            className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-xl shadow-slate-900/20 group"
            >
            {isLoading ? (
                <>
                <Loader2 className="animate-spin text-indigo-300" size={20} />
                <span className="text-indigo-100">Crafting Magic...</span>
                </>
            ) : (
                <>
                Generate Content
                <Wand2 size={20} className="text-indigo-300 group-hover:rotate-12 transition-transform" />
                </>
            )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;