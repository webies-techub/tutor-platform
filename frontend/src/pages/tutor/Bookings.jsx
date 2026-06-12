import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const STATUS_BADGE = {
  pending: 'badge-yellow',
  confirmed: 'badge-green',
  cancelled: 'badge-red',
};

const FILTERS = ['all', 'pending', 'confirmed', 'cancelled'];

export default function TutorBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const refresh = () => {
    api.get('/bookings/incoming')
      .then(({ data }) => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const confirm = async (id) => {
    setBusy(id);
    try { await api.put(`/bookings/${id}/confirm`); refresh(); } finally { setBusy(null); }
  };

  const cancel = async (id) => {
    setBusy(id);
    try { await api.put(`/bookings/${id}/cancel`); refresh(); } finally { setBusy(null); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <DashboardLayout title="Bookings" subtitle="Review, confirm or decline session requests.">
      {/* Filter pills */}
      <div className="flex gap-2 mb-7 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
            }`}
          >
            {f}
            {f !== 'all' && (
              <span className="ml-1.5 opacity-70">({bookings.filter((b) => b.status === f).length})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl block mb-4">&#128237;</span>
          <h3 className="font-display font-bold text-lg mb-1">
            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
          </h3>
          <p className="text-slate-500">Booking requests from students will show up here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="card p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4 min-w-0">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {b.student?.name?.[0]}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-slate-900">{b.subject}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">requested by {b.student?.name}</p>
                    <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(b.datetime).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                    {b.meeting_link && (
                      <p className="text-xs text-slate-400 mt-2 break-all">
                        Meeting link: <a href={b.meeting_link} className="text-blue-600 hover:underline">{b.meeting_link}</a>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className={STATUS_BADGE[b.status]}>{b.status}</span>
                  {b.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirm(b.id)}
                        disabled={busy === b.id}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Confirm
                      </button>
                      <button
                        onClick={() => cancel(b.id)}
                        disabled={busy === b.id}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 ring-1 ring-rose-200 hover:bg-rose-100 disabled:opacity-50 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
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
