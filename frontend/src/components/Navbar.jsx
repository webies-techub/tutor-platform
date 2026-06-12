import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </span>
      <span className="text-xl font-display font-bold text-slate-900 tracking-tight">LearnHub</span>
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashboardLink =
    user?.role === 'student' ? '/student/overview'
    : user?.role === 'tutor' ? '/tutor/overview'
    : null;

  const links = [
    { to: '/courses', label: 'Courses' },
    { to: '/group-classes', label: 'Group Classes' },
    { to: '/tutors', label: 'Tutors' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/become-a-tutor', label: 'Teach with us' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[4.5rem]">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'text-blue-700 font-semibold' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {dashboardLink && (
                <Link to={dashboardLink} className="btn-ghost text-sm">
                  Dashboard
                </Link>
              )}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <button onClick={handleLogout} className="nav-link">Log out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Log in</Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                {dashboardLink && (
                  <Link to={dashboardLink} onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-blue-700 font-semibold hover:bg-blue-50">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-sm">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
