import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentOverview() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/enrollments/mine').then(({ data }) => setEnrollments(data)).catch(() => {});
    api.get('/bookings/mine').then(({ data }) => setBookings(data)).catch(() => {});
  }, []);

  const upcoming = bookings.filter((b) => b.status === 'confirmed' && new Date(b.datetime) > new Date());
  const totalLessons = enrollments.reduce((s, e) => s + (e.course?.lessons?.length || 0), 0);

  const stats = [
    { label: 'Courses enrolled', value: enrollments.length, color: 'from-blue-500 to-sky-600' },
    { label: 'Total lessons', value: totalLessons, color: 'from-cyan-500 to-blue-600' },
    { label: 'Upcoming sessions', value: upcoming.length, color: 'from-sky-500 to-sky-500' },
  ];

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
      subtitle="Here's what's happening with your learning."
    >
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="card p-6 relative overflow-hidden">
            <span className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
            <p className="font-display text-4xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-slate-500 text-sm mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Continue learning */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-lg">Continue learning</h2>
        {enrollments.length > 0 && (
          <Link to="/student/my-courses" className="text-sm text-blue-600 font-semibold hover:underline">View all</Link>
        )}
      </div>

      {enrollments.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <h3 className="font-display font-bold text-lg mb-1">Start your learning journey</h3>
          <p className="text-slate-500 mb-6">You haven't enrolled in any courses yet — explore the catalogue to begin.</p>
          <Link to="/courses" className="btn-primary">Browse courses</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {enrollments.slice(0, 4).map((e) => (
            <div key={e.id} className="card card-hover p-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{e.course?.subject}</span>
              <h3 className="font-display font-bold mt-1.5 leading-snug">{e.course?.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{e.course?.lessons?.length || 0} lessons</p>
              {e.course?.lessons?.[0] && (
                <Link
                  to={`/student/watch/${e.course.lessons[0].id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:gap-3 transition-all"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                  Continue
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upcoming sessions */}
      {upcoming.length > 0 && (
        <>
          <h2 className="font-display font-bold text-lg mb-5">Upcoming sessions</h2>
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((b) => (
              <div key={b.id} className="card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{b.subject}</p>
                    <p className="text-sm text-slate-500">
                      with {b.tutor?.name} &bull; {new Date(b.datetime).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                {b.meeting_link && (
                  <a href={b.meeting_link} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-4 !py-2 text-sm">
                    Join
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
