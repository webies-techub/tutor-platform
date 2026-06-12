import { Link } from 'react-router-dom';
import { mediaUrl } from '../lib/media';

export default function TutorCard({ profile }) {
  const { user, headline, subjects, qualifications, experience_years, hourly_rate, avatar_path } = profile;
  const subjectList = (subjects || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);

  return (
    <Link to={`/tutors/${user?.id}`} className="card card-hover p-6 group flex flex-col">
      <div className="flex items-center gap-4">
        {avatar_path ? (
          <img
            src={mediaUrl(avatar_path)}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg shadow-blue-500/25">
            {user?.name?.[0]}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-display font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
            {user?.name}
          </h3>
          {headline && <p className="text-sm text-slate-500 mt-0.5 truncate">{headline}</p>}
          <p className="font-semibold text-blue-600 mt-0.5">
            ${Number(hourly_rate).toFixed(0)}<span className="text-slate-400 font-normal text-sm">/hour</span>
          </p>
        </div>
      </div>

      {/* Qualifications & experience */}
      <div className="mt-4 space-y-2">
        {qualifications && (
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
            </svg>
            <span className="line-clamp-2">{qualifications}</span>
          </div>
        )}
        {experience_years > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{experience_years}+ years experience</span>
          </div>
        )}
      </div>

      {subjectList.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {subjectList.map((s) => (
            <span key={s} className="badge bg-slate-100 text-slate-600">{s}</span>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-slate-100 text-sm text-blue-600 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        View profile
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
