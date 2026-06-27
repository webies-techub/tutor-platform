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
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <h2 className="font-display text-3xl font-extrabold text-white leading-tight mb-6">
            Join hundreds of students learning smarter every day.
          </h2>
          <ul className="space-y-4">
            {['On-demand HD video courses', 'Live 1-on-1 tutoring sessions', 'Verified expert tutors', 'No subscriptions — pay per course'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-300">
                <span className="w-6 h-6 rounded-full bg-gold-500/25 ring-1 ring-gold-400/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-slate-500 text-sm">&copy; {new Date().getFullYear()} TheEduSpire</p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center mb-10">
            <img src="/edu-spire-logo.png" alt="TheEduSpire" className="h-12 w-auto" />
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
                        ? 'border-navy-700 bg-navy-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className={`font-display font-bold ${form.role === opt.value ? 'text-navy-800' : 'text-slate-900'}`}>
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
            <Link to="/login" className="text-navy-800 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
