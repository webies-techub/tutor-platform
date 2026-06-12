import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/mine')
      .then(({ data }) => setEnrollments(data))
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
          <p className="text-slate-500 mb-6">Enrol in a course and it will appear here.</p>
          <Link to="/courses" className="btn-primary">Browse courses</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((e) => {
            const lessons = [...(e.course?.lessons || [])].sort((a, b) => a.order_index - b.order_index);
            return (
              <div key={e.id} className="card overflow-hidden">
                <div className="p-6 sm:p-7 flex items-start justify-between gap-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{e.course?.subject}</span>
                    <h2 className="font-display font-bold text-lg mt-1">{e.course?.title}</h2>
                    <p className="text-sm text-slate-400 mt-1">{lessons.length} lessons</p>
                  </div>
                  {lessons[0] && (
                    <Link to={`/student/watch/${lessons[0].id}`} className="btn-primary !px-5 !py-2.5 text-sm flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      Start
                    </Link>
                  )}
                </div>
                <div className="divide-y divide-slate-50">
                  {lessons.map((lesson, i) => (
                    <Link
                      key={lesson.id}
                      to={`/student/watch/${lesson.id}`}
                      className="flex items-center justify-between px-6 sm:px-7 py-4 hover:bg-blue-50/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-slate-50 ring-1 ring-slate-100 group-hover:bg-blue-100 group-hover:ring-blue-200 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-blue-700 transition-colors flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-medium text-slate-700 group-hover:text-slate-900 text-sm truncate">{lesson.title}</span>
                      </div>
                      <span className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {lesson.duration > 0 && (
                          <span className="text-xs text-slate-400">{Math.floor(lesson.duration / 60)}m</span>
                        )}
                        <span className="w-8 h-8 rounded-full bg-white ring-1 ring-slate-200 group-hover:bg-blue-600 group-hover:ring-blue-600 flex items-center justify-center transition-all">
                          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
