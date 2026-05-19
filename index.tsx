
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutGrid, 
  Rss, 
  Settings as SettingsIcon, 
  Send, 
  Terminal, 
  Plus, 
  RefreshCcw, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  BrainCircuit,
  Zap
} from 'lucide-react';
import { AppState, NewsSource, NewsItem, SourceType } from './types';
import { processNewsWithAI, generateNewsImage } from './services/geminiService';
import Dashboard from './components/Dashboard';
import SourceManager from './components/SourceManager';
import NewsFeed from './components/NewsFeed';
import BotLogicPreview from './components/BotLogicPreview';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'sources' | 'logic'>('dashboard');
  const [state, setState] = useState<AppState>({
    sources: [
      { id: '1', name: 'TechCrunch', url: 'https://techcrunch.com', type: SourceType.WEBSITE, isActive: true, lastParsed: '2026-05-20 14:30' },
      { id: '2', name: 'Durop Channel', url: '@durov', type: SourceType.TELEGRAM, isActive: true, lastParsed: '2026-05-20 15:15' },
    ],
    news: [],
    isParsing: false,
    filters: ['#crypto', '#ai', '#telegram']
  });

  const [parsingProgress, setParsingProgress] = useState(0);

  const mockParsing = useCallback(async () => {
    setState(prev => ({ ...prev, isParsing: true }));
    setParsingProgress(0);

    const steps = 5;
    for (let i = 1; i <= steps; i++) {
      await new Promise(r => setTimeout(r, 800));
      setParsingProgress((i / steps) * 100);
    }

    // Add mock news
    const newItems: NewsItem[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        sourceId: '1',
        sourceName: 'TechCrunch',
        originalTitle: 'Quantum Computing Breakthrough in Silicon Valley',
        originalText: 'A new startup has achieved 1000 qubits using a revolutionary cooling method...',
        timestamp: new Date().toISOString(),
        status: 'PENDING'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        sourceId: '2',
        sourceName: 'Durov Channel',
        originalTitle: 'Telegram reaching 1.5 Billion users',
        originalText: 'Today marks a historic milestone for privacy-focused communication...',
        timestamp: new Date().toISOString(),
        status: 'PENDING'
      }
    ];

    setState(prev => ({
      ...prev,
      news: [...newItems, ...prev.news],
      isParsing: false
    }));
    setParsingProgress(0);
  }, []);

  const handleProcessItem = async (itemId: string) => {
    const item = state.news.find(n => n.id === itemId);
    if (!item) return;

    // AI Rewriting
    const processed = await processNewsWithAI(item.originalText, item.originalTitle);
    if (processed) {
      // AI Image Generation
      const imageUrl = await generateNewsImage(processed.processedTitle);
      
      setState(prev => ({
        ...prev,
        news: prev.news.map(n => n.id === itemId ? {
          ...n,
          processedTitle: processed.processedTitle,
          processedText: processed.processedText,
          sentiment: processed.sentiment,
          imageUrl: imageUrl || undefined
        } : n)
      }));
    }
  };

  const handlePublishItem = (itemId: string) => {
    setState(prev => ({
      ...prev,
      news: prev.news.map(n => n.id === itemId ? { ...n, status: 'PUBLISHED' } : n)
    }));
  };

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">
      {/* Sidebar */}
      <nav className="w-64 bg-[#1e293b] border-r border-slate-700 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">TeleNews <span className="text-blue-500">2026</span></h1>
        </div>

        <div className="mt-4 flex-1">
          <NavItem 
            icon={<LayoutGrid className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Clock className="w-5 h-5" />} 
            label="Live Feed" 
            badge={state.news.filter(n => n.status === 'PENDING').length}
            active={activeTab === 'news'} 
            onClick={() => setActiveTab('news')} 
          />
          <NavItem 
            icon={<Rss className="w-5 h-5" />} 
            label="Sources" 
            active={activeTab === 'sources'} 
            onClick={() => setActiveTab('sources')} 
          />
          <NavItem 
            icon={<Terminal className="w-5 h-5" />} 
            label="Bot Logic" 
            active={activeTab === 'logic'} 
            onClick={() => setActiveTab('logic')} 
          />
        </div>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={mockParsing}
            disabled={state.isParsing}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all"
          >
            {state.isParsing ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
            {state.isParsing ? `Parsing ${Math.round(parsingProgress)}%` : 'Sync Sources Now'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0f172a] p-8">
        {activeTab === 'dashboard' && <Dashboard state={state} onTabChange={setActiveTab} />}
        {activeTab === 'news' && <NewsFeed news={state.news} onProcess={handleProcessItem} onPublish={handlePublishItem} />}
        {activeTab === 'sources' && <SourceManager sources={state.sources} />}
        {activeTab === 'logic' && <BotLogicPreview />}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void, badge?: number }> = ({ icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${active ? 'bg-slate-800 text-blue-400 border-r-4 border-blue-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
  >
    {icon}
    <span className="font-medium flex-1 text-left">{label}</span>
    {badge && badge > 0 && (
      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
    )}
  </button>
);

export default App;
