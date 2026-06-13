import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/courses', label: 'Courses' },
  { path: '/admin/users', label: 'Users' },
  { path: '/admin/tutors', label: 'Tutors' },
  { path: '/admin/bookings', label: 'Bookings' },
  { path: '/admin/group-sessions', label: 'Group Classes' },
  { path: '/admin/payments', label: 'Payments' },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <Link to="/admin/dashboard" className="flex items-center">
            <img src="/learnHubLogo.png" alt="LearnHub" className="h-10 w-auto brightness-0 invert" />
          </Link>
          <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-sky-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left text-gray-400 hover:text-white text-sm px-4 py-2.5 rounded-lg hover:bg-gray-800"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
