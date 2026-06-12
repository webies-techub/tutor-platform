import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'student') navigate('/student/overview');
      else if (user.role === 'tutor') navigate('/tutor/overview');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <span className="text-2xl font-display font-bold text-white">LearnHub</span>
        </Link>

        <div className="relative">
          <blockquote className="font-display text-2xl font-bold text-white leading-snug">
            "The video courses are brilliant and my tutor genuinely cares about my progress. Best decision I made this year."
          </blockquote>
          <div className="flex items-center gap-3 mt-6">
            <span className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">S</span>
            <div>
              <p className="text-white font-semibold text-sm">Sarah K.</p>
              <p className="text-slate-400 text-sm">Year 12 student</p>
            </div>
          </div>
        </div>

        <p className="relative text-slate-500 text-sm">&copy; {new Date().getFullYear()} LearnHub</p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-10">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <span className="text-xl font-display font-bold">LearnHub</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-9">Log in to continue your learning journey.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <p className="text-rose-600 text-sm font-medium bg-rose-50 rounded-xl px-4 py-3 ring-1 ring-rose-100">{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full text-base !py-3.5">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
