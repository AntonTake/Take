
import React from 'react';
import { NewsItem } from '../types';
import { 
  BrainCircuit, 
  Send, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Hash
} from 'lucide-react';

interface NewsFeedProps {
  news: NewsItem[];
  onProcess: (id: string) => void;
  onPublish: (id: string) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news, onProcess, onPublish }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white">Curation Desk</h2>
        <p className="text-slate-400 mt-2">AI processes pending news for Telegram publication</p>
      </header>

      {news.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#1e293b] rounded-3xl border border-slate-700 border-dashed">
          <AlertCircle className="w-12 h-12 text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg">No new messages captured yet</p>
          <p className="text-slate-500 text-sm">Hit "Sync Sources Now" to fetch latest news</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {news.map(item => (
            <NewsCard 
              key={item.id} 
              item={item} 
              onProcess={() => onProcess(item.id)} 
              onPublish={() => onPublish(item.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NewsCard: React.FC<{ item: NewsItem, onProcess: () => void, onPublish: () => void }> = ({ item, onProcess, onPublish }) => {
  const isPendingAI = !item.processedText;
  
  return (
    <div className={`bg-[#1e293b] border rounded-3xl overflow-hidden transition-all ${item.status === 'PUBLISHED' ? 'border-green-500/50 opacity-80' : 'border-slate-700'}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
              {item.sourceName}
            </span>
            <span className="text-slate-500 text-xs">
              {new Date(item.timestamp).toLocaleTimeString()}
            </span>
          </div>
          {item.status === 'PUBLISHED' && (
            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> Published
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Original View */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ExternalLink className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Original Capture</span>
            </div>
            <h3 className="text-lg font-bold text-slate-200">{item.originalTitle}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.originalText}</p>
          </div>

          {/* AI Transformation */}
          <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-400">
                <BrainCircuit className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Edit (2026 Engine)</span>
              </div>
              {item.sentiment && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  item.sentiment === 'POSITIVE' ? 'bg-green-500/20 text-green-400' : 
                  item.sentiment === 'NEGATIVE' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'
                }`}>
                  {item.sentiment}
                </span>
              )}
            </div>

            {isPendingAI ? (
              <div className="h-full flex flex-col items-center justify-center py-8">
                <p className="text-slate-500 text-sm mb-4">Awaiting AI rephrase...</p>
                <button 
                  onClick={onProcess}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  <BrainCircuit className="w-4 h-4" /> Generate 2026 Version
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="AI Generated News" className="w-full h-40 object-cover rounded-xl border border-slate-700" />
                )}
                <h3 className="text-lg font-bold text-white leading-tight">{item.processedTitle}</h3>
                <p className="text-slate-300 text-sm whitespace-pre-wrap">{item.processedText}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">
                    <Hash className="w-3 h-3" /> crypto
                  </span>
                  <span className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">
                    <Hash className="w-3 h-3" /> innovation
                  </span>
                </div>

                {item.status !== 'PUBLISHED' && (
                  <div className="pt-4 flex gap-4">
                    <button 
                      onClick={onPublish}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-4 h-4" /> Post to Telegram
                    </button>
                    <button className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
