import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Clock,
  ShieldCheck,
  ChevronRight,
  Database,
  ExternalLink,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square
} from 'lucide-react';
import { ChatMessage, User } from '../types.ts';

// Declare Web Speech API types for TypeScript
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

interface ChatAssistantProps {
  currentUser: User | null;
  onNavigateToTab?: (tab: string) => void;
  initialQuestion?: string;
  autoStartVoice?: boolean;
}

const SUGGESTED_QUESTIONS = [
  'What does this company do?',
  'When was the company established?',
  'What products and services does the company offer?',
  'Where is the head office located?',
  'What are the company working hours?',
  'Which departments are available?',
  'How can I contact the HR department?',
  'What is the company mission and vision?',
  'Who is the CEO and leadership team?',
  'What is the remote work policy?'
];

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  currentUser,
  onNavigateToTab,
  initialQuestion,
  autoStartVoice
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: `Hello! I am the official **Apex Dynamics AI Assistant**. I can answer any questions about our company history, cloud products, enterprise services, department directories, office locations, operating hours, and official policies.\n\nAll answers are strictly grounded in our verified database. You can type or click the microphone icon below to speak your question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['Company Profile', 'Verified Database'],
      is_demo_fallback: false
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... speak your question now.');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTranscript) {
          setInputQuery((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript));
          setInterimTranscript('');
          setVoiceNotice(`Heard: "${finalTranscript}"`);
          setTimeout(() => setVoiceNotice(null), 3000);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        if (event.error === 'not-allowed') {
          setVoiceNotice('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else if (event.error === 'no-speech') {
          setVoiceNotice('No speech detected. Please click the mic and try again.');
        } else {
          setVoiceNotice(`Speech recognition error: ${event.error}`);
        }
        setTimeout(() => setVoiceNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not initialize SpeechRecognition:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (initialQuestion) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (autoStartVoice) {
      const timer = setTimeout(() => {
        toggleListening();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoStartVoice]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, interimTranscript]);

  const toggleListening = () => {
    if (!speechSupported) {
      setVoiceNotice('Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      try {
        setVoiceNotice('Accessing microphone...');
        recognitionRef.current?.start();
      } catch (err: any) {
        console.error('Error starting recognition:', err);
        setVoiceNotice('Could not start microphone. Please try again.');
        setTimeout(() => setVoiceNotice(null), 3000);
      }
    }
  };

  const handleSpeakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/`/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryToSend?: string) => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    }

    const q = (queryToSend || inputQuery).trim();
    if (!q || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryToSend) setInputQuery('');
    setInterimTranscript('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          role: currentUser?.role || 'user',
          sessionId: 'client_' + (currentUser?.id || 'anon')
        })
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: data.answer || 'No response returned from the assistant engine.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['Database Grounding'],
        is_demo_fallback: data.is_demo_fallback,
        response_time_ms: data.response_time_ms
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: 'A temporary network error occurred while communicating with the server. Please verify your connection or try again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_demo_fallback: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 'init_fresh',
        sender: 'assistant',
        text: `Conversation cleared. What company information would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['Apex Knowledge Base']
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm">Apex Enterprise AI Assistant</h2>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Database Grounded
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Voice mic dictation enabled · Zero hallucinations policy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Mic Toggle in Header */}
          <button
            onClick={toggleListening}
            className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white border-slate-700 hover:border-slate-600 hover:bg-slate-800'
            }`}
            title="Toggle Microphone Voice Dictation"
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-white" />
                <span>Stop Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span>Voice Mic</span>
              </>
            )}
          </button>

          <button
            onClick={handleClearHistory}
            className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-700 hover:border-slate-600 flex items-center gap-1 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Suggested Questions Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 text-xs whitespace-nowrap">
          <span className="text-slate-600 font-semibold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Suggestions:
          </span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 rounded-md border border-slate-200 transition-colors shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-indigo-400'
              }`}
            >
              {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`space-y-1.5 max-w-[85%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
              <div
                className={`p-4 rounded-xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {/* Message Text with Simple Markdown Line Breaks & Formatting */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph.split('\n').map((line, lIdx) => (
                        <span key={lIdx} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>

                {/* Footer metadata for Assistant messages */}
                {msg.sender === 'assistant' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-slate-600">Grounded in:</span>
                      {msg.sources && msg.sources.length > 0 ? (
                        msg.sources.map((src, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            {src}
                          </span>
                        ))
                      ) : (
                        <span>Company Records</span>
                      )}

                      {msg.is_demo_fallback && (
                        <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-amber-200/50">
                          Verified Demo Mode
                        </span>
                      )}

                      {msg.response_time_ms && (
                        <span className="text-slate-400">
                          · {msg.response_time_ms}ms
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Listen to response TTS Button */}
                      <button
                        onClick={() => handleSpeakText(msg.id, msg.text)}
                        className={`flex items-center gap-1 transition-colors ${
                          speakingMessageId === msg.id
                            ? 'text-indigo-600 font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title={speakingMessageId === msg.id ? 'Stop audio' : 'Listen to answer'}
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <Square className="w-3 h-3 text-rose-500 fill-rose-500" />
                            <span className="text-rose-600 font-medium">Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>

                      {/* Copy response */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <div
                className={`text-[10px] text-slate-500 px-1 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Interim Speech Transcription Bubble */}
        {isListening && interimTranscript && (
          <div className="flex gap-3 max-w-3xl ml-auto flex-row-reverse animate-in fade-in">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-semibold shrink-0 animate-pulse">
              <Mic className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-xl text-sm leading-relaxed shadow-sm bg-rose-50 border border-rose-200 text-rose-900 rounded-tr-none italic">
              <span>&ldquo;{interimTranscript}&rdquo;</span>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
              <div
                className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
                style={{ animationDelay: '0.15s' }}
              />
              <div
                className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
              <span className="text-xs text-slate-400 ml-1">
                Searching company database & verifying records...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Status Alert / Notice Bar */}
      {voiceNotice && (
        <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-rose-500 animate-pulse' : 'text-indigo-600'}`} />
            <span>{voiceNotice}</span>
          </div>
          {isListening && (
            <button
              onClick={toggleListening}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
            >
              Stop Dictation
            </button>
          )}
        </div>
      )}

      {/* Input Box with Microphone & Send Controls */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to your voice... Speak now'
                  : 'Ask about company products, working hours, HR contact, office locations, or policies...'
              }
              className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 ${
                isListening ? 'border-rose-400 ring-2 ring-rose-300 bg-rose-50/30' : 'border-slate-200'
              }`}
              disabled={isLoading}
            />
          </div>

          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            className={`px-3 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse hover:bg-rose-700'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 hover:border-rose-300 font-semibold text-xs'
            }`}
            title={isListening ? 'Stop voice recording' : 'Speak your question (Voice Input)'}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-semibold">Voice Mic</span>
              </>
            )}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Click the mic icon to dictate queries. Answers are grounded in verified database records.</span>
          </div>
          <span className="hidden sm:inline">Role: {currentUser?.role || 'Visitor'}</span>
        </div>
      </div>
    </div>
  );
};

