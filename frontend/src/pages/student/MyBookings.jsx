import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const STATUS_BADGE = {
  pending: 'badge-yellow',
  confirmed: 'badge-green',
  cancelled: 'badge-red',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/mine')
      .then(({ data }) => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Bookings" subtitle="Your live tutoring sessions.">
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl block mb-4">&#128197;</span>
          <h3 className="font-display font-bold text-lg mb-1">No bookings yet</h3>
          <p className="text-slate-500 mb-6">Find a tutor and request your first live session.</p>
          <Link to="/tutors" className="btn-primary">Find a tutor</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="card p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4 min-w-0">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {b.tutor?.name?.[0]}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-slate-900">{b.subject}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">with {b.tutor?.name}</p>
                    <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(b.datetime).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                    {b.status === 'confirmed' && (
                      b.meeting_link ? (
                        <a
                          href={b.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                          </svg>
                          Join session
                        </a>
                      ) : (
                        <p className="mt-2 text-xs text-amber-600 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          No meeting link yet — message your tutor via the chat widget (bottom right)
                        </p>
                      )
                    )}
                    {b.status === 'pending' && (
                      <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Waiting for tutor to confirm — you can chat via the widget (bottom right)
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className={STATUS_BADGE[b.status]}>
                    {b.status === 'pending' && 'Awaiting confirmation'}
                    {b.status === 'confirmed' && 'Confirmed'}
                    {b.status === 'cancelled' && 'Cancelled'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
