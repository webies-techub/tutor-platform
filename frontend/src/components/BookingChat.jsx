import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const POLL_INTERVAL = 8000;

export default function BookingChat({ bookingId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchMessages = () => {
    api.get(`/messages/${bookingId}`)
      .then(({ data }) => setMessages(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const { data } = await api.post(`/messages/${bookingId}`, { body: text.trim() });
      setMessages((prev) => [...prev, data]);
      setText('');
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  const fmt = (d) =>
    new Date(d).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Messages</p>

      {/* Message list */}
      <div className="h-52 overflow-y-auto space-y-2.5 pr-1 mb-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-400 text-center">
              No messages yet. Use this chat to coordinate your session details.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender?.id === user?.id;
            return (
              <div key={m.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isMe ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {m.sender?.name?.[0]}
                </span>
                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                    {m.body}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1">{fmt(m.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
