import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Courses', to: '/courses' },
      { label: 'Find a Tutor', to: '/tutors' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'For Tutors',
    links: [
      { label: 'Become a Tutor', to: '/become-a-tutor' },
      { label: 'Tutor Dashboard', to: '/tutor/overview' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', to: '/login' },
      { label: 'Sign up', to: '/register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/25">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <span className="text-xl font-display font-bold text-slate-900">LearnHub</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-slate-500">
              The online learning platform connecting students with expert tutors through
              recorded courses and live 1-on-1 sessions.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-slate-900 font-semibold text-sm mb-4 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-slate-500 hover:text-violet-700 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          <p>Made with care for learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
