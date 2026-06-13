import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { mediaUrl } from '../../lib/media';

const TYPE_ICONS = {
  video:    { label: 'Video',        cls: 'bg-blue-600/20 text-blue-400' },
  text:     { label: 'Reading',      cls: 'bg-green-600/20 text-green-400' },
  image:    { label: 'Image',        cls: 'bg-purple-600/20 text-purple-400' },
  resource: { label: 'Resource',     cls: 'bg-amber-600/20 text-amber-400' },
};

function SidebarIcon({ lesson, isCurrent, done, index }) {
  const type = lesson.lesson_type || 'video';
  if (isCurrent) {
    return (
      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-600 text-white">
        {type === 'video' ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        ) : type === 'text' ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        ) : type === 'image' ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        ) : (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        )}
      </span>
    );
  }
  if (done) {
    return (
      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-500/20 text-emerald-400">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </span>
    );
  }
  return (
    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 bg-white/10 text-slate-400">
      {index + 1}
    </span>
  );
}

export default function WatchLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState('');
  const [lessonInfo, setLessonInfo] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [marking, setMarking] = useState(false);
  const blobRef = useRef(null);

  // Load lesson context + completed progress
  useEffect(() => {
    Promise.all([
      api.get('/enrollments/mine'),
      api.get('/progress/mine'),
    ]).then(([{ data: enrollments }, { data: doneIds }]) => {
      setCompletedIds(new Set(doneIds));
      for (const enrollment of enrollments) {
        const lessons = [...(enrollment.course?.lessons || [])].sort((a, b) => a.order_index - b.order_index);
        const match = lessons.find((l) => String(l.id) === String(lessonId));
        if (match) {
          setLessonInfo({ ...match, courseTitle: enrollment.course.title });
          setSiblings(lessons);
          break;
        }
      }
    }).catch(() => {});
  }, [lessonId]);

  // Fetch video blob only for video lessons
  useEffect(() => {
    if (lessonInfo && lessonInfo.lesson_type !== 'video') {
      setLoading(false);
      return;
    }

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
  }, [lessonId, lessonInfo?.lesson_type]);

  const handleMarkComplete = async () => {
    if (marking) return;
    setMarking(true);
    try {
      await api.post(`/progress/${lessonId}`);
      setCompletedIds((prev) => new Set([...prev, Number(lessonId)]));
      const idx = siblings.findIndex((l) => String(l.id) === String(lessonId));
      if (idx !== -1 && idx < siblings.length - 1) {
        navigate(`/student/watch/${siblings[idx + 1].id}`);
      }
    } catch {
      setCompletedIds((prev) => new Set([...prev, Number(lessonId)]));
    } finally {
      setMarking(false);
    }
  };

  const isCompleted = completedIds.has(Number(lessonId));
  const lessonType = lessonInfo?.lesson_type || 'video';

  // ── Lesson content renderer ───────────────────────────────────────────────
  const renderContent = () => {
    if (lessonType === 'video') {
      if (loading) {
        return (
          <div className="aspect-video rounded-2xl bg-white/5 ring-1 ring-white/10 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading your lesson…</p>
          </div>
        );
      }
      if (error) {
        return (
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
        );
      }
      return (
        <video src={videoUrl} controls autoPlay className="w-full rounded-2xl bg-black shadow-2xl" style={{ maxHeight: '72vh' }} />
      );
    }

    if (lessonType === 'text') {
      return (
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 min-h-[40vh] overflow-y-auto max-h-[72vh]">
          <pre className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap font-sans">
            {lessonInfo?.content || 'No content available for this lesson.'}
          </pre>
        </div>
      );
    }

    if (lessonType === 'image') {
      const src = mediaUrl(lessonInfo?.resource_path);
      if (!src) {
        return (
          <div className="aspect-video rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
            <p className="text-slate-400">No image available for this lesson.</p>
          </div>
        );
      }
      return (
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center" style={{ maxHeight: '72vh' }}>
          <img src={src} alt={lessonInfo?.title} className="max-w-full max-h-[72vh] object-contain" />
        </div>
      );
    }

    if (lessonType === 'resource') {
      const src = mediaUrl(lessonInfo?.resource_path);
      return (
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 flex flex-col items-center justify-center p-12 gap-6 min-h-[40vh]">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-white font-semibold text-lg text-center">{lessonInfo?.title}</p>
          {src ? (
            <>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download Resource
              </a>
              {/* Inline PDF preview */}
              <div className="w-full mt-2">
                <iframe
                  src={src}
                  title={lessonInfo?.title}
                  className="w-full rounded-xl bg-white"
                  style={{ height: '60vh' }}
                />
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-sm">No file available for this lesson.</p>
          )}
        </div>
      );
    }

    return null;
  };

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
          <div className="flex items-center gap-3">
            {lessonType !== 'video' && (
              <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${TYPE_ICONS[lessonType]?.cls || ''}`}>
                {TYPE_ICONS[lessonType]?.label}
              </span>
            )}
            <p className="text-slate-400 text-sm truncate ml-2 hidden sm:block">{lessonInfo.courseTitle}</p>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-start justify-center p-4 sm:p-8">
            <div className="w-full max-w-4xl">
              {renderContent()}

              {lessonInfo && !(lessonType === 'video' && error) && (
                <div className="mt-5 flex items-start justify-between gap-4">
                  <h1 className="font-display text-xl font-bold text-white">{lessonInfo.title}</h1>
                  <button
                    onClick={handleMarkComplete}
                    disabled={isCompleted || marking}
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Completed
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {marking ? 'Saving…' : 'Mark complete'}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson sidebar */}
        {siblings.length > 0 && (
          <aside className="lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 p-5 flex-shrink-0">
            <h3 className="text-white font-display font-bold text-sm uppercase tracking-wider mb-4">Course content</h3>
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {siblings.map((l, i) => {
                const isCurrent = String(l.id) === String(lessonId);
                const done = completedIds.has(l.id);
                return (
                  <Link
                    key={l.id}
                    to={`/student/watch/${l.id}`}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors ${
                      isCurrent ? 'bg-blue-600/20 ring-1 ring-blue-500/40 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <SidebarIcon lesson={l} isCurrent={isCurrent} done={done} index={i} />
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
