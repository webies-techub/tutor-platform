import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const POLL_INTERVAL = 8000;
const LS_KEY = 'chat_last_seen';

function loadLastSeen() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}

function saveLastSeen(obj) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Inner chat panel ────────────────────────────────────────────────────────
function ConvChat({ bookingId, userId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const timerRef = useRef(null);

  const fetch = () =>
    api.get(`/messages/${bookingId}`).then(({ data }) => setMessages(data)).catch(() => {});

  useEffect(() => {
    fetch();
    timerRef.current = setInterval(fetch, POLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [bookingId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const { data } = await api.post(`/messages/${bookingId}`, { body: text.trim() });
      setMessages((p) => [...p, data]);
      setText('');
    } catch { /* silent */ } finally { setSending(false); }
  };

  const fmt = (d) =>
    new Date(d).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center py-8">
            <p className="text-xs text-slate-400 text-center px-4">
              No messages yet. Start the conversation to coordinate your session.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender?.id === userId;
            return (
              <div key={m.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${isMe ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {m.sender?.name?.[0]}
                </span>
                <div className={`max-w-[75%] flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
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
      <form onSubmit={send} className="flex gap-2 p-3 border-t border-slate-100">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          maxLength={1000}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-3 py-2 rounded-xl transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}

// ── Main widget ─────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'chat'
  const [activeConv, setActiveConv] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [lastSeen, setLastSeen] = useState(loadLastSeen);

  const prevMsgIds = useRef({});
  const openRef = useRef(false);
  const activeConvRef = useRef(null);

  openRef.current = open;
  activeConvRef.current = activeConv;

  // Request notification permission once
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Poll inbox
  useEffect(() => {
    if (!user || user.role === 'admin') return;

    const fetchInbox = () =>
      api.get('/messages/inbox').then(({ data }) => {
        data.forEach((c) => {
          if (!c.lastMessage) return;
          const prevId = prevMsgIds.current[c.bookingId];
          if (prevId !== undefined && c.lastMessage.id > prevId) {
            // New message arrived during this session
            const isActiveChat =
              openRef.current && activeConvRef.current?.bookingId === c.bookingId;
            if (!isActiveChat && Notification.permission === 'granted') {
              new Notification(`${c.otherPerson.name}`, {
                body: c.lastMessage.body.slice(0, 100),
                icon: '/favicon.ico',
              });
            }
          }
          prevMsgIds.current[c.bookingId] = c.lastMessage.id;
        });
        setConversations(data);
      }).catch(() => {});

    fetchInbox();
    const iv = setInterval(fetchInbox, POLL_INTERVAL);
    return () => clearInterval(iv);
  }, [user]);

  const unreadCount = conversations.filter(
    (c) => c.lastMessage && c.lastMessage.id > (lastSeen[c.bookingId] || 0)
  ).length;

  const openConv = (conv) => {
    setActiveConv(conv);
    setView('chat');
    const updated = { ...lastSeen, [conv.bookingId]: conv.lastMessage?.id || 0 };
    setLastSeen(updated);
    saveLastSeen(updated);
  };

  const backToList = () => {
    setView('list');
    setActiveConv(null);
  };

  const toggleOpen = () => {
    setOpen((p) => !p);
    if (!open) setView('list');
  };

  if (!user || user.role === 'admin') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/60 flex flex-col overflow-hidden"
          style={{ height: '480px' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white flex-shrink-0">
            {view === 'chat' && (
              <button onClick={backToList} className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 -ml-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {view === 'chat' ? activeConv?.subject : 'Messages'}
              </p>
              {view === 'chat' && activeConv && (
                <p className="text-[11px] text-slate-400 truncate">with {activeConv.otherPerson?.name}</p>
              )}
            </div>
            <button onClick={toggleOpen} className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden">
            {view === 'list' ? (
              <div className="h-full overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2 p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">No active bookings</p>
                    <p className="text-xs text-slate-400">Chats appear here once you have a booking.</p>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const isUnread = conv.lastMessage && conv.lastMessage.id > (lastSeen[conv.bookingId] || 0);
                    return (
                      <button
                        key={conv.bookingId}
                        onClick={() => openConv(conv)}
                        className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                      >
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {conv.otherPerson?.name?.[0]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <p className={`text-sm truncate flex-1 ${isUnread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                              {conv.subject}
                            </p>
                            {conv.lastMessage && (
                              <span className="text-[10px] text-slate-400 flex-shrink-0">
                                {timeAgo(conv.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <p className={`text-xs truncate flex-1 ${isUnread ? 'text-slate-700' : 'text-slate-400'}`}>
                              {conv.lastMessage
                                ? `${conv.lastMessage.senderName}: ${conv.lastMessage.body}`
                                : 'No messages yet — start the conversation'}
                            </p>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              <ConvChat bookingId={activeConv?.bookingId} userId={user?.id} onBack={backToList} />
            )}
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/40 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {!open && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
