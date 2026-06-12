import { Link } from 'react-router-dom';

export default function TutorCard({ profile }) {
  const { user, subjects, hourly_rate, avatar_path, bio } = profile;
  const subjectList = (subjects || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);

  return (
    <Link
      to={`/tutors/${user?.id}`}
      className="card card-hover p-6 group flex flex-col"
    >
      <div className="flex items-center gap-4">
        {avatar_path ? (
          <img
            src={`http://localhost:3001/${avatar_path}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg shadow-violet-500/25">
            {user?.name?.[0]}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-display font-bold text-slate-900 group-hover:text-violet-700 transition-colors truncate">
            {user?.name}
          </h3>
          <p className="font-semibold text-violet-600 mt-0.5">
            ${Number(hourly_rate).toFixed(0)}
            <span className="text-slate-400 font-normal text-sm">/hour</span>
          </p>
        </div>
      </div>

      {bio && <p className="text-sm text-slate-500 mt-4 line-clamp-2 leading-relaxed">{bio}</p>}

      {subjectList.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {subjectList.map((s) => (
            <span key={s} className="badge bg-slate-100 text-slate-600">{s}</span>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-slate-100 text-sm text-violet-600 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        View profile
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
