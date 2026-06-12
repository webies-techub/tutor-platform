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
            <div className="mb-4">
              <span className="font-display font-extrabold text-[1.35rem] tracking-tight leading-none">
                <span className="text-slate-900">Learn</span><span className="text-blue-600">Hub</span>
              </span>
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
                    <Link to={l.to} className="text-sm text-slate-500 hover:text-blue-700 transition-colors">
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
