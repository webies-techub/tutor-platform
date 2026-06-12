import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function WatchLesson() {
  const { lessonId } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState('');
  const [lessonInfo, setLessonInfo] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [loading, setLoading] = useState(true);
  const blobRef = useRef(null);

  // Load lesson context (find the lesson + its course siblings from enrollments)
  useEffect(() => {
    api.get('/enrollments/mine')
      .then(({ data }) => {
        for (const enrollment of data) {
          const lessons = [...(enrollment.course?.lessons || [])].sort((a, b) => a.order_index - b.order_index);
          const match = lessons.find((l) => String(l.id) === String(lessonId));
          if (match) {
            setLessonInfo({ ...match, courseTitle: enrollment.course.title });
            setSiblings(lessons);
            break;
          }
        }
      })
      .catch(() => {});
  }, [lessonId]);

  useEffect(() => {
    setLoading(true);
    setError('');
    setVideoUrl(null);

    api.get(`/videos/${lessonId}`, { responseType: 'blob' })
      .then(({ data }) => {
        const url = URL.createObjectURL(data);
        blobRef.current = url;
        setVideoUrl(url);
      })
      .catch((err) => {
        if (err.response?.status === 403) setError('You are not enrolled in this course.');
        else if (err.response?.status === 404) setError('This lesson has no video yet.');
        else setError('Video could not be loaded.');
      })
      .finally(() => setLoading(false));

    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, [lessonId]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-white/10 flex-shrink-0">
        <Link to="/student/my-courses" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Courses
        </Link>
        {lessonInfo && (
          <p className="text-slate-400 text-sm truncate ml-4 hidden sm:block">
            {lessonInfo.courseTitle}
          </p>
        )}
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Player */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-4xl">
              {loading ? (
                <div className="aspect-video rounded-2xl bg-white/5 ring-1 ring-white/10 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm">Loading your lesson...</p>
                </div>
              ) : error ? (
                <div className="aspect-video rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
                  <div className="text-center px-6">
                    <span className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 ring-1 ring-rose-500/30 flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>
                    <p className="text-white font-semibold mb-1">{error}</p>
                    <Link to="/student/my-courses" className="text-blue-400 hover:underline text-sm">Go to My Courses</Link>
                  </div>
                </div>
              ) : (
                <video src={videoUrl} controls autoPlay className="w-full rounded-2xl bg-black shadow-2xl" style={{ maxHeight: '72vh' }} />
              )}
              {lessonInfo && !error && (
                <div className="mt-5">
                  <h1 className="font-display text-xl font-bold text-white">{lessonInfo.title}</h1>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson sidebar */}
        {siblings.length > 0 && (
          <aside className="lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 p-5 flex-shrink-0">
            <h3 className="text-white font-display font-bold text-sm uppercase tracking-wider mb-4">
              Course content
            </h3>
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {siblings.map((l, i) => {
                const isCurrent = String(l.id) === String(lessonId);
                return (
                  <Link
                    key={l.id}
                    to={`/student/watch/${l.id}`}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors ${
                      isCurrent
                        ? 'bg-blue-600/20 ring-1 ring-blue-500/40 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isCurrent ? 'bg-blue-600 text-white' : 'bg-white/10'
                    }`}>
                      {isCurrent ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className="truncate font-medium">{l.title}</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
