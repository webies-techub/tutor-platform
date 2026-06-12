import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="card card-hover overflow-hidden group flex flex-col"
    >
      <div className="relative">
        {course.thumbnail_path ? (
          <img
            src={`http://localhost:3001/${course.thumbnail_path}`}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-violet-100 via-indigo-50 to-sky-100 flex items-center justify-center">
            <span className="w-14 h-14 rounded-2xl bg-white/80 shadow-md flex items-center justify-center">
              <svg className="w-7 h-7 text-violet-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}
        <span className="absolute top-3 left-3 badge bg-white/90 backdrop-blur text-violet-700 shadow-sm capitalize">
          {course.type}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">
          {course.subject}
        </span>
        <h3 className="mt-1.5 font-display font-bold text-slate-900 leading-snug group-hover:text-violet-700 transition-colors line-clamp-2">
          {course.title}
        </h3>
        {course.tutor && (
          <p className="text-slate-500 text-sm mt-1.5 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[10px] font-bold flex items-center justify-center">
              {course.tutor.name?.[0]}
            </span>
            {course.tutor.name}
          </p>
        )}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <span className="font-display font-bold text-lg text-slate-900">
            ${Number(course.price).toFixed(2)}
          </span>
          <span className="text-sm text-violet-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            View course
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
