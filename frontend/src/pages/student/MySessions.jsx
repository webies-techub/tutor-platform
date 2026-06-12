import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const fmtDate = (d) => new Date(d).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' });

export default function MySessions() {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/group-sessions/registrations/mine')
      .then(({ data }) => setRegs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Group Classes" subtitle="Live classes you've registered for.">
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>
      ) : regs.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl block mb-4">👥</span>
          <h3 className="font-display font-bold text-lg mb-1">No group classes yet</h3>
          <p className="text-slate-500 mb-6">Browse upcoming live classes and reserve your seat.</p>
          <Link to="/group-classes" className="btn-primary">Browse live classes</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {regs.map((r) => {
            const s = r.session;
            if (!s) return null;
            const upcoming = new Date(s.datetime) > new Date();
            return (
              <div key={r.id} className="card p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    <div>
                      <span className="badge bg-blue-50 text-blue-700 ring-1 ring-blue-200 mb-1">{s.subject}</span>
                      <h3 className="font-display font-bold text-slate-900">{s.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">with {s.tutor?.name} · {s.duration_min} min</p>
                      <p className="text-sm text-slate-600 mt-2">{fmtDate(s.datetime)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={upcoming ? 'badge-green' : 'badge bg-slate-100 text-slate-500'}>
                      {upcoming ? 'Upcoming' : 'Past'}
                    </span>
                    {upcoming && s.meeting_link && (
                      <a href={s.meeting_link} target="_blank" rel="noopener noreferrer" className="btn-primary !px-5 !py-2.5 text-sm">Join class</a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
