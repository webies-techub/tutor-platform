import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const email = location.state?.email || new URLSearchParams(location.search).get('email') || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      setUser(data.user, data.accessToken);
      if (data.user.role === 'student') navigate('/student/overview');
      else if (data.user.role === 'tutor') navigate('/tutor/overview');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setResent(false);
    try {
      await api.post('/auth/resend-otp', { email });
      setResent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl" />
        <Link to="/" className="relative">
          <span className="text-2xl font-display font-extrabold tracking-tight">
            <span className="text-white">Learn</span><span className="text-sky-400">Hub</span>
          </span>
        </Link>
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 ring-1 ring-blue-500/30 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white leading-tight mb-4">
            One quick step to verify your identity.
          </h2>
          <p className="text-slate-400 leading-relaxed">We sent a 6-digit code to your email. Enter it to activate your account and start learning.</p>
        </div>
        <p className="relative text-slate-500 text-sm">&copy; {new Date().getFullYear()} LearnHub</p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden mb-10 inline-block">
            <span className="text-xl font-display font-extrabold tracking-tight">
              <span className="text-slate-900">Learn</span><span className="text-blue-600">Hub</span>
            </span>
          </Link>

          <div className="w-14 h-14 rounded-2xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center mb-6">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2">Check your email</h1>
          <p className="text-slate-500 mb-1">We sent a 6-digit code to:</p>
          <p className="font-semibold text-slate-900 mb-8">{email}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Verification code</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-2xl tracking-[0.5em] font-bold"
                placeholder="000000"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-rose-600 text-sm font-medium bg-rose-50 rounded-xl px-4 py-3 ring-1 ring-rose-100">{error}</p>
            )}
            {resent && (
              <p className="text-emerald-600 text-sm font-medium bg-emerald-50 rounded-xl px-4 py-3 ring-1 ring-emerald-100">New code sent — check your inbox.</p>
            )}

            <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full text-base !py-3.5">
              {loading ? 'Verifying...' : 'Verify email'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend code'}
              </button>
            </p>
          </div>

          <p className="text-center text-sm text-slate-400 mt-4">
            <Link to="/register" className="hover:underline">Back to sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
