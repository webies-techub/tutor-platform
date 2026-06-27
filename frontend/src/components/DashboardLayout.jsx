import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ICONS = {
  overview: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  courses: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  bookings: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  groups: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  profile: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
};

function Icon({ d }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const NAV = {
  student: [
    { to: '/student/overview', label: 'Overview', icon: ICONS.overview },
    { to: '/student/my-courses', label: 'My Courses', icon: ICONS.courses },
    { to: '/student/my-bookings', label: 'My Bookings', icon: ICONS.bookings },
    { to: '/student/my-sessions', label: 'Group Classes', icon: ICONS.groups },
  ],
  tutor: [
    { to: '/tutor/overview', label: 'Overview', icon: ICONS.overview },
    { to: '/tutor/bookings', label: 'Bookings', icon: ICONS.bookings },
    { to: '/tutor/group-sessions', label: 'Group Classes', icon: ICONS.groups },
    { to: '/tutor/profile', label: 'My Profile', icon: ICONS.profile },
  ],
};

export default function DashboardLayout({ title, subtitle, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 fixed inset-y-0">
        <div className="h-[4.5rem] flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center">
            <img src="/edu-spire-logo.png" alt="TheEduSpire" className="h-12 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-navy-50 text-navy-800 shadow-sm ring-1 ring-navy-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon d={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 ring-1 ring-gold-400/40 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} title="Log out" className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center">
            <img src="/edu-spire-logo.png" alt="TheEduSpire" className="h-11 w-auto" />
          </Link>
          <div className="flex gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `p-2.5 rounded-lg ${isActive ? 'bg-navy-50 text-navy-800' : 'text-slate-400'}`
                }
              >
                <Icon d={item.icon} />
              </NavLink>
            ))}
            <button onClick={handleLogout} className="p-2.5 rounded-lg text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          {(title || subtitle) && (
            <div className="mb-8 animate-fade-in-up">
              {title && <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>}
              {subtitle && <p className="text-slate-500 mt-1.5">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
