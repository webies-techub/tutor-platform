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
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {b.tutor?.name?.[0]}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-slate-900">{b.subject}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">with {b.tutor?.name}</p>
                    <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(b.datetime).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={STATUS_BADGE[b.status]}>
                    {b.status === 'pending' && 'Awaiting confirmation'}
                    {b.status === 'confirmed' && 'Confirmed'}
                    {b.status === 'cancelled' && 'Cancelled'}
                  </span>
                  {b.meeting_link && b.status === 'confirmed' && (
                    <a href={b.meeting_link} target="_blank" rel="noopener noreferrer" className="btn-primary !px-5 !py-2.5 text-sm">
                      Join session
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
