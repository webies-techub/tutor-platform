import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <img src="/edu-spire-logo.png" alt="TheEduSpire" className="h-14 w-auto" />
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
    ...(!user || user.role !== 'student' ? [{ to: '/become-a-tutor', label: 'Teach with us' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100/80">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[4.5rem]">
        <Logo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-navy-800 font-semibold' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <>
              {dashboardLink && (
                <Link to={dashboardLink} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  Dashboard
                </Link>
              )}
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 ring-1 ring-gold-400/40 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Log out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">Log in</Link>
              <Link to="/register" className="bg-navy-800 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md shadow-navy-800/25 hover:bg-navy-900 transition-all">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 mt-1 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                {dashboardLink && (
                  <Link to={dashboardLink} onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-navy-800 font-semibold hover:bg-navy-50 transition-colors">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
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
