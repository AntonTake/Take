
import React from 'react';
import { NewsSource, SourceType } from '../types';
import { Plus, Globe, MessageSquare, Trash2, Settings2, Link2 } from 'lucide-react';

interface SourceManagerProps {
  sources: NewsSource[];
}

const SourceManager: React.FC<SourceManagerProps> = ({ sources }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Data Sources</h2>
          <p className="text-slate-400 mt-1">Configure your 2026 scraping ecosystem</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-blue-500/20">
          <Plus className="w-5 h-5" /> Add New Source
        </button>
      </header>

      <div className="grid gap-4">
        {sources.map(source => (
          <div key={source.id} className="bg-[#1e293b] border border-slate-700 p-6 rounded-2xl flex items-center gap-6 group hover:border-slate-500 transition-all">
            <div className={`p-4 rounded-2xl ${source.type === SourceType.TELEGRAM ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
              {source.type === SourceType.TELEGRAM ? <MessageSquare className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">{source.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${source.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                  {source.isActive ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 mt-1 text-sm">
                <Link2 className="w-3 h-3" />
                <span className="font-mono">{source.url}</span>
              </div>
            </div>

            <div className="flex items-center gap-8 px-8 border-x border-slate-700/50">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sync Rate</p>
                <p className="text-slate-200 font-medium">Every 15 min</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Last Sync</p>
                <p className="text-slate-200 font-medium">{source.lastParsed || 'Never'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2.5 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors">
                <Settings2 className="w-5 h-5" />
              </button>
              <button className="p-2.5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-12 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center text-center bg-slate-800/20">
        <div className="bg-slate-800 p-4 rounded-2xl mb-4">
          <Globe className="w-8 h-8 text-slate-500" />
        </div>
        <h4 className="text-white font-bold text-lg">Suggest a Site?</h4>
        <p className="text-slate-500 mt-2 max-w-sm">
          Our AI can automatically detect the best scraping strategy for any URL provided.
        </p>
        <div className="mt-6 flex w-full max-w-md bg-[#0f172a] rounded-xl overflow-hidden border border-slate-700 focus-within:border-blue-500 transition-all">
          <input 
            type="text" 
            placeholder="https://example.com/news" 
            className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-bold text-sm transition-colors">
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourceManager;
