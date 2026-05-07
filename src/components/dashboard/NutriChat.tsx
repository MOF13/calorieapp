import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getNutriChatMessages, createNutriChatMessage } from '@/lib/db';
import { supabase } from '@/lib/supabase';

interface NutriChatProps {
  userId: string;
  userProfile: any;
}

export function NutriChat({ userId, userProfile }: NutriChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    const data = await getNutriChatMessages(userId);
    setMessages(data);
    if (data.length === 0) {
      // Add welcome message if new
      const welcome = {
        role: 'assistant',
        content: `Marhaba ${userProfile?.full_name?.split(' ')[0] || 'Athlete'}! I'm your AI Nutrition Coach. How can I help you reach your ${userProfile?.goal_type || 'fitness'} goal today?`,
      };
      setMessages([welcome]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      user_id: userId,
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Save user message to DB
      await createNutriChatMessage(userMessage);

      // 2. Call Edge Function (Mocked for now, will implement later)
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nutrichat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          message: input,
          profile: userProfile,
          history: messages.slice(-5)
        }),
      });

      const data = await response.json();
      const botMessage = {
        user_id: userId,
        role: 'assistant',
        content: data.reply || "I'm having trouble connecting to my brain. Please try again in a moment!",
      };

      // 3. Save bot message to DB
      await createNutriChatMessage(botMessage);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "What should I eat for dinner?",
    "Check my protein intake",
    "How many calories in a Shawarma?",
    "Healthy Iftar ideas"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-slate-50/50 rounded-[2.5rem] overflow-hidden border border-white shadow-inner">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 vitality-gradient rounded-xl flex items-center justify-center shadow-lg shadow-vitality-emerald/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-black text-vitality-slate">NutriChat AI</h3>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-vitality-emerald animate-pulse"></div>
               <span className="text-[10px] font-bold text-vitality-emerald uppercase tracking-widest">Active Coach</span>
            </div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-vitality-amber animate-pulse" />
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide"
      >
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-vitality-emerald text-white' : 'bg-white shadow-sm text-slate-400'}`}>
                 {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
               </div>
               <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                 m.role === 'user' 
                   ? 'bg-vitality-emerald text-white shadow-lg shadow-vitality-emerald/20 rounded-tr-none' 
                   : 'bg-white text-vitality-slate shadow-sm border border-slate-100 rounded-tl-none'
               }`}>
                 {m.content}
               </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
               <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-white shadow-sm text-slate-400">
                 <Bot className="w-4 h-4" />
               </div>
               <div className="p-4 bg-white rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                 <Loader2 className="w-4 h-4 text-vitality-emerald animate-spin" />
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100 space-y-4">
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="flex-shrink-0 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-500 hover:bg-vitality-lime/10 hover:border-vitality-emerald/30 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your diet..."
            className="h-14 rounded-2xl border-slate-200 pr-14 focus-visible:ring-vitality-emerald"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 w-10 h-10 bg-vitality-emerald text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
