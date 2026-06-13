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
  const [confirmingId, setConfirmingId] = useState(null);
  const [meetingUrl, setMeetingUrl] = useState('');

  const refresh = () => {
    api.get('/bookings/incoming')
      .then(({ data }) => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const startConfirm = (id) => { setConfirmingId(id); setMeetingUrl(''); };

  const submitConfirm = async (id) => {
    setBusy(id);
    try {
      await api.put(`/bookings/${id}/confirm`, { meeting_url: meetingUrl || undefined });
      setConfirmingId(null);
      refresh();
    } finally {
      setBusy(null);
    }
  };

  const cancel = async (id) => {
    setBusy(id);
    try { await api.put(`/bookings/${id}/cancel`); refresh(); } finally { setBusy(null); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <DashboardLayout title="Bookings" subtitle="Review, confirm or decline session requests.">
      {/* Tutor responsibility notice */}
      <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex gap-3 items-start">
        <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-blue-100 flex items-center justify-center mt-0.5">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-900 mb-0.5">You are responsible for session coordination</p>
          <p className="text-sm text-blue-700 leading-relaxed">
            Once you confirm a booking, use the <span className="font-semibold">chat widget</span> (bottom right of your screen) to communicate with the student and share your Zoom or Google Meet link. Students rely on you to provide session details promptly.
          </p>
        </div>
      </div>

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
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4 min-w-0">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {b.student?.name?.[0]}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-slate-900">{b.subject}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">requested by {b.student?.name}</p>
                    <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(b.datetime).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                    {b.status === 'confirmed' && (
                      <p className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Session confirmed — chat with {b.student?.name} to share your meeting link
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className={STATUS_BADGE[b.status]}>{b.status}</span>
                  {b.status === 'pending' && confirmingId !== b.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startConfirm(b.id)}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
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

              {/* Confirm inline form */}
              {confirmingId === b.id && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="bg-amber-50 ring-1 ring-amber-200 rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-amber-800 mb-1">Share a meeting link with the student</p>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Create a meeting on <a href="https://zoom.us" target="_blank" rel="noopener noreferrer" className="underline font-medium">Zoom</a> or <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Meet</a>, then paste the link below. You can also skip and share it via the chat widget after confirming.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={meetingUrl}
                      onChange={(e) => setMeetingUrl(e.target.value)}
                      placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => submitConfirm(b.id)}
                      disabled={busy === b.id}
                      className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex-shrink-0"
                    >
                      {busy === b.id ? 'Confirming...' : 'Confirm booking'}
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex-shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
