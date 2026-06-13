import { useEffect, useState } from 'react';
import { mediaUrl } from '../lib/media';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(({ data }) => {
        setCourse(data);
        if (user?.role === 'student') return api.get(`/enrollments/${id}/check`);
      })
      .then((res) => { if (res) setEnrolled(res.data.enrolled); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Course not found</h1>
            <Link to="/courses" className="text-blue-600 font-semibold hover:underline">Browse all courses</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalMinutes = (course.lessons || []).reduce((s, l) => s + (l.duration || 0), 0) / 60;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header band */}
      <div className="bg-slate-950 relative overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40 uppercase tracking-wider">{course.subject}</span>
              <span className="badge bg-white/10 text-slate-300 ring-1 ring-white/20 capitalize">{course.type}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>
            <div className="flex items-center gap-2 mt-5">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-xs font-bold">
                {course.tutor?.name?.[0]}
              </span>
              <span className="text-slate-300 text-sm">
                Taught by <span className="text-white font-semibold">{course.tutor?.name}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-10 min-w-0">
            <section className="card p-5 sm:p-8">
              <h2 className="font-display font-bold text-xl mb-4">About this course</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {course.description || 'No description provided.'}
              </p>
            </section>

            <section className="card overflow-hidden">
              <div className="p-5 sm:p-8 sm:pb-4 flex items-center justify-between gap-3">
                <h2 className="font-display font-bold text-xl">Course curriculum</h2>
                <span className="text-sm text-slate-400 font-medium flex-shrink-0 text-right">
                  {course.lessons?.length || 0} lessons
                  {totalMinutes > 0 && ` · ${Math.round(totalMinutes)} min`}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {(course.lessons || []).map((lesson, i) => (
                  <div key={lesson.id} className="flex items-center justify-between px-5 sm:px-8 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${enrolled ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                        {enrolled ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 font-medium">Lesson {i + 1}</p>
                        {enrolled ? (
                          <Link to={`/student/watch/${lesson.id}`} className="font-semibold text-slate-900 hover:text-blue-700 transition-colors truncate block">
                            {lesson.title}
                          </Link>
                        ) : (
                          <p className="font-semibold text-slate-700 truncate">{lesson.title}</p>
                        )}
                      </div>
                    </div>
                    {lesson.duration > 0 && (
                      <span className="text-sm text-slate-400 flex-shrink-0 ml-4">{Math.floor(lesson.duration / 60)}m</span>
                    )}
                  </div>
                ))}
                {(!course.lessons || course.lessons.length === 0) && (
                  <p className="px-5 sm:px-8 py-6 text-slate-400 text-sm">Lessons coming soon.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right column — purchase card */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="card overflow-hidden shadow-xl shadow-slate-200/50">
              {course.thumbnail_path ? (
                <img src={mediaUrl(course.thumbnail_path)} alt={course.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 via-sky-50 to-sky-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              )}
              <div className="p-7">
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="font-display text-4xl font-extrabold text-slate-900">${Number(course.price).toFixed(2)}</span>
                  <span className="text-slate-400 text-sm">one-time</span>
                </div>

                {enrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold bg-emerald-50 rounded-xl px-4 py-3 ring-1 ring-emerald-100">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      You're enrolled
                    </div>
                    <Link to="/student/my-courses" className="btn-primary w-full">Continue learning</Link>
                  </div>
                ) : user?.role === 'student' ? (
                  <Link to={`/checkout/${course.id}`} className="btn-primary w-full text-base">
                    Buy now
                  </Link>
                ) : !user ? (
                  <Link to="/login" className="btn-primary w-full text-base">Log in to enroll</Link>
                ) : (
                  <p className="text-sm text-slate-400 text-center">Log in as a student to enroll.</p>
                )}

                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {[
                    `${course.lessons?.length || 0} on-demand video lessons`,
                    'Stream on any device',
                    'Lifetime access',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
