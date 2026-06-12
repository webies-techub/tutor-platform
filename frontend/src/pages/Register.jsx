import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <span className="text-2xl font-display font-bold text-white">LearnHub</span>
        </Link>

        <div className="relative">
          <h2 className="font-display text-3xl font-extrabold text-white leading-tight mb-6">
            Join hundreds of students learning smarter every day.
          </h2>
          <ul className="space-y-4">
            {['On-demand HD video courses', 'Live 1-on-1 tutoring sessions', 'Verified expert tutors', 'No subscriptions — pay per course'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-300">
                <span className="w-6 h-6 rounded-full bg-violet-600/30 ring-1 ring-violet-500/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-slate-500 text-sm">&copy; {new Date().getFullYear()} LearnHub</p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-10">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <span className="text-xl font-display font-bold">LearnHub</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight mb-2">Create your account</h1>
          <p className="text-slate-500 mb-9">Free to join. Start learning in minutes.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Full name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Jane Smith"
              />
            </div>
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
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="field-label">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Learn', desc: 'as a student' },
                  { value: 'tutor', label: 'Teach', desc: 'as a tutor' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`rounded-xl border-2 p-4 text-left transition-all duration-150 ${
                      form.role === opt.value
                        ? 'border-violet-600 bg-violet-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className={`font-display font-bold ${form.role === opt.value ? 'text-violet-700' : 'text-slate-900'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <p className="text-rose-600 text-sm font-medium bg-rose-50 rounded-xl px-4 py-3 ring-1 ring-rose-100">{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full text-base !py-3.5">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
