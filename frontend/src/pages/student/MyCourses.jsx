import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/enrollments/mine'),
      api.get('/progress/mine'),
    ])
      .then(([{ data: enrollments }, { data: doneIds }]) => {
        setEnrollments(enrollments);
        setCompletedIds(new Set(doneIds));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Courses" subtitle="All the courses in your library.">
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : enrollments.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl block mb-4">&#128218;</span>
          <h3 className="font-display font-bold text-lg mb-1">Your library is empty</h3>
          <p className="text-slate-500 mb-6">Enroll in a course and it will appear here.</p>
          <Link to="/courses" className="btn-primary">Browse courses</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((e) => {
            const lessons = [...(e.course?.lessons || [])].sort((a, b) => a.order_index - b.order_index);
            const total = lessons.length;
            const done = lessons.filter((l) => completedIds.has(l.id)).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div key={e.id} className="card overflow-hidden">
                <div className="p-6 sm:p-7 flex items-start justify-between gap-4 border-b border-slate-100">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{e.course?.subject}</span>
                    <h2 className="font-display font-bold text-lg mt-1">{e.course?.title}</h2>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100 ? '#10b981' : '#2563eb',
                          }}
                        />
                      </div>
                      <span className={`text-xs font-semibold flex-shrink-0 ${pct === 100 ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {done}/{total} {pct === 100 ? '✓ Complete' : 'lessons'}
                      </span>
                    </div>
                  </div>
                  {lessons[0] && (
                    <Link
                      to={`/student/watch/${done < total ? (lessons.find((l) => !completedIds.has(l.id))?.id ?? lessons[0].id) : lessons[0].id}`}
                      className="btn-primary !px-5 !py-2.5 text-sm flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      {pct === 100 ? 'Rewatch' : done === 0 ? 'Start' : 'Continue'}
                    </Link>
                  )}
                </div>
                <div className="divide-y divide-slate-50">
                  {lessons.map((lesson, i) => {
                    const isDone = completedIds.has(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        to={`/student/watch/${lesson.id}`}
                        className="flex items-center justify-between px-6 sm:px-7 py-4 hover:bg-blue-50/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className={`w-9 h-9 rounded-xl ring-1 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                            isDone
                              ? 'bg-emerald-50 ring-emerald-100 text-emerald-600 group-hover:bg-emerald-100'
                              : 'bg-slate-50 ring-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:ring-blue-200 group-hover:text-blue-700'
                          }`}>
                            {isDone ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : i + 1}
                          </span>
                          <span className={`font-medium text-sm truncate ${isDone ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-slate-900'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <span className="flex items-center gap-3 flex-shrink-0 ml-4">
                          {lesson.duration > 0 && (
                            <span className="text-xs text-slate-400">{Math.floor(lesson.duration / 60)}m</span>
                          )}
                          <span className={`w-8 h-8 rounded-full ring-1 flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-emerald-50 ring-emerald-100'
                              : 'bg-white ring-slate-200 group-hover:bg-blue-600 group-hover:ring-blue-600'
                          }`}>
                            <svg className={`w-3.5 h-3.5 transition-colors ${isDone ? 'text-emerald-500' : 'text-slate-400 group-hover:text-white'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
