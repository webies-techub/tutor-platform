import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const fmtDate = (d) => new Date(d).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' });

function SessionCard({ session, user, onRegistered }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | confirm | loading | done | full | error
  const [error, setError] = useState('');
  const seatsLeft = session.capacity - session.seats_taken;

  const handleRegister = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'student') { setError('Only students can register.'); setStatus('error'); return; }
    setStatus('loading');
    try {
      await api.post(`/group-sessions/${session.id}/register`);
      setStatus('done');
      onRegistered?.();
    } catch (err) {
      if (err.response?.status === 409) { setStatus('error'); setError(err.response.data.message); }
      else { setStatus('error'); setError(err.response?.data?.message || 'Registration failed'); }
    }
  };

  return (
    <div className="card card-hover p-6 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="badge bg-blue-50 text-blue-700 ring-1 ring-blue-200">{session.subject}</span>
        {seatsLeft > 0 ? (
          <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">{seatsLeft} seats left</span>
        ) : (
          <span className="badge-red">Full</span>
        )}
      </div>
      <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">{session.title}</h3>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2 flex-1">{session.description}</p>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {fmtDate(session.datetime)}
        </p>
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {session.duration_min} minutes · with {session.tutor?.name}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="font-display text-xl font-extrabold text-slate-900">${Number(session.price).toFixed(2)}</span>
        {status === 'done' ? (
          <span className="badge-green">Registered ✓</span>
        ) : seatsLeft <= 0 ? (
          <button disabled className="btn-primary !px-5 !py-2.5 text-sm opacity-50 pointer-events-none">Full</button>
        ) : (
          <button onClick={handleRegister} disabled={status === 'loading'} className="btn-primary !px-5 !py-2.5 text-sm">
            {status === 'loading' ? 'Registering...' : 'Register'}
          </button>
        )}
      </div>
      {status === 'error' && <p className="text-rose-600 text-xs mt-3">{error}</p>}
      {status === 'done' && <p className="text-emerald-600 text-xs mt-3">You're in! Check your email and "My Sessions" for the join link.</p>}
    </div>
  );
}

export default function GroupClasses() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/group-sessions').then(({ data }) => setSessions(data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="bg-slate-950 relative overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-sky-300 font-bold text-xs uppercase tracking-[0.18em] mb-3">Live &amp; interactive</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Live group classes</h1>
          <p className="text-slate-300 mt-3 text-lg max-w-2xl">Join scheduled live classes with expert tutors and fellow students. Reserve your seat — places are limited.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>
        ) : sessions.length === 0 ? (
          <div className="card p-16 text-center">
            <span className="text-5xl block mb-4">👥</span>
            <h3 className="font-display font-bold text-lg mb-1">No classes scheduled yet</h3>
            <p className="text-slate-500">New live group classes are added regularly — check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {sessions.map((s) => <SessionCard key={s.id} session={s} user={user} onRegistered={load} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
