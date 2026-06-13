import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const fmtDate = (d) =>
  new Date(d).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' });

export default function BookingCheckout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/bookings/${bookingId}`)
      .then(({ data }) => setBooking(data))
      .catch(() => setError('Booking not found.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePay = async (e) => {
    e.preventDefault();
    setPaying(true);
    setError('');
    try {
      await api.post('/payments/simulate-booking', { booking_id: Number(bookingId) });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const hourlyRate = parseFloat(booking?.tutor?.tutorProfile?.hourly_rate || 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <Link to="/tutors" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to tutors
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : error && !booking ? (
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
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Booking confirmed!</h2>
              <p className="text-slate-500 mb-2">
                Your session with <span className="font-semibold text-slate-700">{booking?.tutor?.name}</span> has been booked and paid.
              </p>
              <p className="text-sm text-slate-400 mb-8">
                Use the chat widget (bottom right) to coordinate session details with your tutor.
              </p>
              <Link to="/student/my-bookings" className="btn-primary">View my bookings</Link>
            </div>
          ) : (
            <>
              {/* Booking summary */}
              <div className="card p-6 mb-6">
                <h2 className="font-display font-bold text-lg text-slate-900 mb-4">Session summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tutor</span>
                    <span className="font-semibold text-slate-800">{booking?.tutor?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subject</span>
                    <span className="font-semibold text-slate-800">{booking?.subject}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date &amp; time</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[60%]">{fmtDate(booking?.datetime)}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-semibold text-slate-700">Total</span>
                    <span className="font-display font-extrabold text-xl text-slate-900">
                      {hourlyRate > 0 ? `$${hourlyRate.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment form */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-lg text-slate-900 mb-5">Payment details</h2>
                <form onSubmit={handlePay} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Cardholder name</label>
                    <input
                      type="text"
                      defaultValue="Test User"
                      readOnly
                      className="input bg-slate-50 cursor-default"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Card number</label>
                    <input
                      type="text"
                      defaultValue="4242 4242 4242 4242"
                      readOnly
                      className="input bg-slate-50 font-mono cursor-default"
                    />
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

                  {error && <p className="text-rose-600 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={paying}
                    className="btn-primary w-full !py-3.5 text-base mt-2 disabled:opacity-60"
                  >
                    {paying ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing…
                      </span>
                    ) : (
                      `Pay ${hourlyRate > 0 ? `$${hourlyRate.toFixed(2)}` : 'now'} & confirm booking`
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    This is a simulated payment. No real charge will be made.
                  </p>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
