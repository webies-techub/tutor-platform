import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function SimulatedCheckout() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/courses/${courseId}`).then(({ data }) => setCourse(data)).catch(() => {});
  }, [courseId]);

  const handlePay = async () => {
    setStatus('loading');
    try {
      await api.post('/payments/simulate', { course_id: Number(courseId) });
      setStatus('success');
    } catch (err) {
      if (err.response?.status === 409) {
        setStatus('alreadyEnrolled');
      } else {
        setError(err.response?.data?.message || 'Payment failed');
        setStatus('error');
      }
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Checkout</h1>
        <p className="text-slate-500 mb-10">Secure simulated payment — no real charge will be made.</p>

        {status === 'success' ? (
          <div className="card max-w-lg mx-auto p-12 text-center shadow-xl shadow-slate-200/50">
            <span className="w-16 h-16 mx-auto rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h2 className="font-display font-bold text-2xl mb-2">Payment successful!</h2>
            <p className="text-slate-500 mb-8">
              You're now enrolled in <strong className="text-slate-700">{course.title}</strong>.
              A confirmation email is on its way.
            </p>
            <Link to="/student/my-courses" className="btn-primary w-full text-base">
              Start learning now
            </Link>
          </div>
        ) : status === 'alreadyEnrolled' ? (
          <div className="card max-w-lg mx-auto p-12 text-center">
            <span className="text-5xl block mb-4">&#128075;</span>
            <h2 className="font-display font-bold text-xl mb-2">You're already enrolled</h2>
            <p className="text-slate-500 mb-6">No need to pay twice — this course is already in your library.</p>
            <Link to="/student/my-courses" className="btn-primary">Go to My Courses</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Payment form */}
            <div className="lg:col-span-3 card p-8">
              <div className="flex items-center justify-between mb-7">
                <h2 className="font-display font-bold text-lg">Payment details</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Simulated &amp; secure
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="field-label">Card number</label>
                  <div className="relative">
                    <input type="text" defaultValue="4242 4242 4242 4242" readOnly className="input-field !bg-slate-50 text-slate-400 font-mono" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                      <span className="w-7 h-5 rounded bg-gradient-to-r from-rose-500 to-amber-400 opacity-70" />
                      <span className="w-7 h-5 rounded bg-gradient-to-r from-sky-600 to-indigo-500 opacity-70" />
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="field-label">Expiry date</label>
                    <input type="text" defaultValue="12/28" readOnly className="input-field !bg-slate-50 text-slate-400 font-mono" />
                  </div>
                  <div>
                    <label className="field-label">CVC</label>
                    <input type="text" defaultValue="123" readOnly className="input-field !bg-slate-50 text-slate-400 font-mono" />
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <p className="mt-5 text-rose-600 text-sm font-medium bg-rose-50 rounded-xl px-4 py-3 ring-1 ring-rose-100">{error}</p>
              )}

              <button
                onClick={handlePay}
                disabled={status === 'loading'}
                className="btn-primary w-full text-base !py-4 mt-7"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ${Number(course.price).toFixed(2)}</>
                )}
              </button>
              <p className="text-xs text-slate-400 text-center mt-4">
                This is a demo checkout. No real payment will be processed.
              </p>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="card p-7 lg:sticky lg:top-24">
                <h2 className="font-display font-bold text-lg mb-5">Order summary</h2>
                <div className="flex gap-4 pb-5 border-b border-slate-100">
                  {course.thumbnail_path ? (
                    <img src={`http://localhost:3001/${course.thumbnail_path}`} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">{course.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{course.subject} &bull; {course.lessons?.length || 0} lessons</p>
                  </div>
                </div>
                <div className="py-4 space-y-2.5 text-sm border-b border-slate-100">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>${Number(course.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Taxes</span>
                    <span>$0.00</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="font-display font-bold">Total</span>
                  <span className="font-display text-2xl font-extrabold">${Number(course.price).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
