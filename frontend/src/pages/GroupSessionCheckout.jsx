import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const fmtDate = (d) =>
  new Date(d).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' });

export default function GroupSessionCheckout() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/group-sessions/${sessionId}`),
      api.get(`/group-sessions/${sessionId}/check`),
    ])
      .then(([{ data: sess }, { data: check }]) => {
        if (check.registered) {
          setDone(true);
        }
        setSession(sess);
      })
      .catch(() => setError('Session not found.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handlePay = async (e) => {
    e.preventDefault();
    setPaying(true);
    setError('');
    try {
      await api.post(`/group-sessions/${sessionId}/register`);
      setDone(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response.data.message);
        if (err.response.data.message?.toLowerCase().includes('already')) setDone(true);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setPaying(false);
    }
  };

  const price = parseFloat(session?.price || 0);
  const seatsLeft = session ? session.capacity - session.seats_taken : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <Link to="/group-classes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to group classes
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : error && !session ? (
            <div className="card p-10 text-center">
              <p className="text-rose-600 font-medium">{error}</p>
            </div>
          ) : done ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">You're registered!</h2>
              <p className="text-slate-500 mb-2">
                <span className="font-semibold text-slate-700">{session?.title}</span> has been added to your classes.
              </p>
              <p className="text-sm text-slate-400 mb-8">
                Check your email for confirmation. The join link will appear in My Group Classes when the session is ready.
              </p>
              <Link to="/student/my-sessions" className="btn-primary">View my group classes</Link>
            </div>
          ) : (
            <>
              {/* Session summary */}
              <div className="card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-lg text-slate-900">Class summary</h2>
                  {seatsLeft > 0 ? (
                    <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">{seatsLeft} seats left</span>
                  ) : (
                    <span className="badge-red">Full</span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Class</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[60%]">{session?.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subject</span>
                    <span className="font-semibold text-slate-800">{session?.subject}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tutor</span>
                    <span className="font-semibold text-slate-800">{session?.tutor?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date &amp; time</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[60%]">{fmtDate(session?.datetime)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-semibold text-slate-800">{session?.duration_min} minutes</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-semibold text-slate-700">Total</span>
                    <span className="font-display font-extrabold text-xl text-slate-900">
                      {price > 0 ? `$${price.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                </div>
              </div>

              {seatsLeft <= 0 ? (
                <div className="card p-8 text-center">
                  <p className="font-semibold text-slate-700 mb-1">This class is full</p>
                  <p className="text-sm text-slate-400 mb-5">Check back for more upcoming classes.</p>
                  <Link to="/group-classes" className="btn-primary">Browse other classes</Link>
                </div>
              ) : (
                /* Payment form */
                <div className="card p-6">
                  <h2 className="font-display font-bold text-lg text-slate-900 mb-5">
                    {price > 0 ? 'Payment details' : 'Confirm registration'}
                  </h2>
                  <form onSubmit={handlePay} className="space-y-4">
                    {price > 0 && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Cardholder name</label>
                          <input type="text" defaultValue="Test User" readOnly className="input bg-slate-50 cursor-default" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Card number</label>
                          <input type="text" defaultValue="4242 4242 4242 4242" readOnly className="input bg-slate-50 font-mono cursor-default" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry</label>
                            <input type="text" defaultValue="12 / 27" readOnly className="input bg-slate-50 cursor-default" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">CVC</label>
                            <input type="text" defaultValue="•••" readOnly className="input bg-slate-50 cursor-default" />
                          </div>
                        </div>
                      </>
                    )}

                    {error && <p className="text-rose-600 text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={paying}
                      className="btn-primary w-full !py-3.5 text-base disabled:opacity-60"
                    >
                      {paying ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Processing…
                        </span>
                      ) : price > 0 ? (
                        `Pay $${price.toFixed(2)} & reserve seat`
                      ) : (
                        'Reserve my seat — free'
                      )}
                    </button>

                    {price > 0 && (
                      <p className="text-center text-xs text-slate-400">
                        This is a simulated payment. No real charge will be made.
                      </p>
                    )}
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
