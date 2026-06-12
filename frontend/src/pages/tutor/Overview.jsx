import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function TutorOverview() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/bookings/incoming').then(({ data }) => setBookings(data)).catch(() => {});
    api.get('/tutors/profile').then(({ data }) => setProfile(data)).catch(() => {});
  }, []);

  const pending = bookings.filter((b) => b.status === 'pending');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');

  const stats = [
    { label: 'Pending requests', value: pending.length, color: 'from-amber-400 to-orange-500' },
    { label: 'Confirmed sessions', value: confirmed.length, color: 'from-emerald-400 to-teal-500' },
    { label: 'Hourly rate', value: profile ? `$${Number(profile.hourly_rate).toFixed(0)}` : '—', color: 'from-violet-500 to-indigo-600' },
  ];

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name?.split(' ')[0]}!`}
      subtitle="Manage your sessions and profile from here."
    >
      {profile && !profile.is_approved && (
        <div className="mb-8 flex items-start gap-3 bg-amber-50 ring-1 ring-amber-200 rounded-2xl p-5">
          <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-amber-800">Your profile is under review</p>
            <p className="text-sm text-amber-700 mt-0.5">
              You'll appear in the tutor directory once an admin approves your application. We'll email you when you're live.
            </p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="card p-6 relative overflow-hidden">
            <span className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
            <p className="font-display text-4xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-slate-500 text-sm mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending requests preview */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-lg">Booking requests</h2>
        <Link to="/tutor/bookings" className="text-sm text-violet-600 font-semibold hover:underline">Manage all</Link>
      </div>

      {pending.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-400">No pending requests right now. New booking requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.slice(0, 3).map((b) => (
            <div key={b.id} className="card p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {b.student?.name?.[0]}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{b.subject}</p>
                  <p className="text-sm text-slate-500 truncate">
                    {b.student?.name} &bull; {new Date(b.datetime).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
              <Link to="/tutor/bookings" className="btn-secondary !px-4 !py-2 text-sm flex-shrink-0">Review</Link>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
