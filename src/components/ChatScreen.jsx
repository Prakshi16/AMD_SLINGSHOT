import { useState, useRef, useEffect } from 'react';
import { useUser } from '../UserContext';

export default function ChatScreen() {
  const { user } = useUser();
  const userName = user?.name?.split(' ')[0] || 'there';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // First message on load
  useEffect(() => {
    const streakDays = parseInt(localStorage.getItem('nourishme_streakDays') || '0');
    let greeting = `Hey ${userName}! 🌿 I'm your NourishMe assistant. Ask me anything about food, nutrition, or what to eat today based on your health profile!`;
    if (streakDays > 0) {
      greeting = `Hey ${userName}! You're on a 🔥 ${streakDays} day streak — keep it going! Ask me anything about food, nutrition, or what to eat today!`;
    } else {
      greeting = `Hey ${userName}! Let's start a new streak today 💪 Here's what I'd suggest... Ask me anything about food, nutrition, or what to eat today!`;
    }
    setMessages([{ role: 'assistant', content: greeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  }, [userName]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: 'user',
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const systemPrompt = `You are NourishMe's health nutrition assistant. The user's profile: Name=${user?.name || 'User'}, Age=${user?.dob ? Math.floor((new Date() - new Date(user.dob)) / 31557600000) : 'unknown'}, Conditions=${(user?.conditions || []).join(', ') || 'None'}, Diet=${user?.dietStyle || 'Balanced'}. You ONLY discuss food, nutrition, health, and meal advice. Keep responses under 3 sentences. Be warm and Gen Z friendly. Always suggest Indian food options when recommending meals.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.filter(m => m.role !== 'system').map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content,
            })),
            { role: 'user', content: userMsg.content },
          ],
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const aiText = data.content?.[0]?.text || "I'm resting for a moment, try again in a sec 🌿";

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm resting for a moment, try again in a sec 🌿",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* TopAppBar */}
      <header className="bg-white/60 backdrop-blur-xl fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-50 flex justify-between items-center px-6 py-4 border-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-indigo-500">NourishMe AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-indigo-400 hover:opacity-80 transition-opacity cursor-pointer">notifications</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 px-container-margin pt-24 pb-40 w-full">
        <div className="flex flex-col space-y-xl mt-4">
          {messages.map((msg, i) => (
            msg.role === 'assistant' ? (
              <div key={i} className="flex items-start gap-3 max-w-[85%]">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-primary-container text-on-primary-container p-lg rounded-xl rounded-tl-sm shadow-sm">
                    <p className="font-body-md text-body-md">{msg.content}</p>
                  </div>
                  <span className="text-label-sm font-label-sm text-outline px-2">{msg.time}</span>
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start justify-end gap-3 self-end max-w-[85%]">
                <div className="flex flex-col gap-2 items-end">
                  <div className="bg-secondary-container text-on-secondary-fixed-variant p-lg rounded-xl rounded-tr-sm shadow-sm">
                    <p className="font-body-md text-body-md">{msg.content}</p>
                  </div>
                  <span className="text-label-sm font-label-sm text-outline px-2">{msg.time}</span>
                </div>
              </div>
            )
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center opacity-50">
                <span className="material-symbols-outlined text-on-primary-container text-sm">smart_toy</span>
              </div>
              <div className="bg-surface-container-low p-md rounded-xl flex gap-1">
                <div className="w-2 h-2 bg-primary/40 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-primary/40 rounded-full typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-container-margin pb-4 pt-4 bg-gradient-to-t from-background via-background/90 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <input
              className="w-full h-14 bg-white border-none rounded-full px-6 pr-14 shadow-[0_10px_30px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-primary-container transition-all font-body-md text-on-surface-variant"
              placeholder="Ask about your diet..."
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              className="absolute right-2 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
