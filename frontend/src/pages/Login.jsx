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
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'student') navigate('/student/overview');
      else if (user.role === 'tutor') navigate('/tutor/overview');
      else navigate('/');
    } catch (err) {
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        navigate('/verify-otp', { state: { email: err.response.data.email } });
        return;
      }
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between bg-navy-950 p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-navy-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-500/20 rounded-full blur-3xl" />

        <Link to="/" className="relative flex items-center">
          <img src="/edu-spire-logo.png" alt="TheEduSpire" className="h-14 w-auto brightness-0 invert" />
        </Link>

        <div className="relative">
          <blockquote className="font-display text-2xl font-bold text-white leading-snug">
            "The video courses are brilliant and my tutor genuinely cares about my progress. Best decision I made this year."
          </blockquote>
          <div className="flex items-center gap-3 mt-6">
            <span className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 font-bold">S</span>
            <div>
              <p className="text-white font-semibold text-sm">Sarah K.</p>
              <p className="text-slate-400 text-sm">Year 12 student</p>
            </div>
          </div>
        </div>

        <p className="relative text-slate-500 text-sm">&copy; {new Date().getFullYear()} TheEduSpire</p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center mb-10">
            <img src="/edu-spire-logo.png" alt="TheEduSpire" className="h-12 w-auto" />
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
            <Link to="/register" className="text-navy-800 font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
