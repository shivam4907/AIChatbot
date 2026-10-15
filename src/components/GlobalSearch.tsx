import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Package,
  Layers,
  Users,
  Building2,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Bot,
  Mic,
  MicOff
} from 'lucide-react';
import { SearchResultItem, UserRole } from '../types.ts';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole;
  onSelectResultItem?: (type: string, id?: number) => void;
  onAskAi?: (term: string) => void;
  onAskAiAbout?: (term: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  userRole = 'user',
  onSelectResultItem,
  onAskAi,
  onAskAiAbout
}) => {
  const askAiHandler = onAskAi || onAskAiAbout;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'products' | 'services' | 'departments' | 'employees' | 'faqs'>('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceNotice('Listening... speak your search term');
        };

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setQuery(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setVoiceNotice(`Voice search notice: ${event.error}`);
          setTimeout(() => setVoiceNotice(null), 3000);
        };

        recognition.onend = () => {
          setIsListening(false);
          setVoiceNotice(null);
        };

        recognitionRef.current = recognition;
      } catch (_) {}
    }

    return () => {
      try {
        recognitionRef.current?.abort();
      } catch (_) {}
    };
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      setVoiceNotice('Microphone speech recognition not supported in this browser.');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (_) {
        setVoiceNotice('Could not start microphone. Try again.');
        setTimeout(() => setVoiceNotice(null), 2500);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      if (isListening) {
        try {
          recognitionRef.current?.stop();
        } catch (_) {}
        setIsListening(false);
      }
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${category}&role=${userRole}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, category, userRole]);

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'service':
        return <Layers className="w-4 h-4 text-purple-600" />;
      case 'department':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'employee':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'faq':
        return <HelpCircle className="w-4 h-4 text-indigo-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isListening ? "Listening... speak now" : "Search products, services, departments, personnel, office hours, or policies..."}
            className={`flex-1 text-base text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent ${
              isListening ? 'text-rose-600 font-medium' : ''
            }`}
          />
          {/* Voice Search Button */}
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`p-1.5 rounded-lg border transition-colors flex items-center justify-center ${
              isListening
                ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                : 'text-slate-400 hover:text-indigo-600 border-transparent hover:bg-slate-100'
            }`}
            title={isListening ? 'Stop voice search' : 'Voice Search with Microphone'}
          >
            {isListening ? <MicOff className="w-4 h-4 text-rose-600" /> : <Mic className="w-4 h-4" />}
          </button>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium"
          >
            Esc
          </button>
        </div>

        {voiceNotice && (
          <div className="px-4 py-1.5 bg-rose-50 border-b border-rose-100 text-xs text-rose-700 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>{voiceNotice}</span>
          </div>
        )}

        {/* Filter Segmented Controls */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium mr-1 shrink-0">Filter:</span>
          {(['all', 'products', 'services', 'departments', 'employees', 'faqs'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors shrink-0 ${
                category === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {cat === 'all' ? 'All Records' : cat}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && (
            <div className="py-12 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Querying verified records...</span>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-slate-700">No exact records matching &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for &quot;ApexCloud&quot;, &quot;hours&quot;, &quot;HR&quot;, &quot;San Francisco&quot;, or &quot;Zero-Trust&quot;
              </p>
              {askAiHandler && (
                <button
                  onClick={() => {
                    onClose();
                    askAiHandler(query);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Assistant about &quot;{query}&quot;</span>
                </button>
              )}
            </div>
          )}

          {!isLoading && !query && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium text-slate-600">Universal Enterprise Search</p>
              <p className="text-xs text-slate-400 mt-1">
                Type keywords like department names, product features, employee profiles, or policies to retrieve verified records.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['ApexCloud', 'Working Hours', 'Elena Rostova', 'SOC 2 Type II', 'Support SLA', 'Hybrid Policy'].map(
                  (example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(example)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-md transition-colors"
                    >
                      {example}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {!isLoading &&
            results.map((item) => (
              <div
                key={`${item.item_type}_${item.id}`}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {getTypeIcon(item.item_type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-slate-500">· {item.category}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {askAiHandler && (
                    <button
                      onClick={() => {
                        onClose();
                        askAiHandler(`Tell me about ${item.name}`);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                      title="Ask AI about this record"
                    >
                      <Bot className="w-4 h-4" />
                    </button>
                  )}
                  {onSelectResultItem && (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectResultItem(item.item_type, item.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-200/50 transition-colors"
                      title="Navigate to section"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <span>{results.length} verified records found</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
