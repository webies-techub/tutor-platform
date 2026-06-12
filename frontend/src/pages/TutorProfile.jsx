import { useEffect, useState } from 'react';
import { mediaUrl } from '../lib/media';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function TutorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [bookingForm, setBookingForm] = useState({ subject: '', datetime: '' });
  const [booked, setBooked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/tutors/${id}`).then(({ data }) => setData(data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/bookings', { tutor_id: id, ...bookingForm });
      setBooked(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Tutor not found</h1>
            <Link to="/tutors" className="text-blue-600 font-semibold hover:underline">Browse all tutors</Link>
          </div>
        </div>
      </div>
    );
  }

  const { profile, courses } = data;
  const subjectList = (profile.subjects || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Profile header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {profile.avatar_path ? (
              <img src={mediaUrl(profile.avatar_path)} alt="" className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-100" />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-4xl font-display font-bold text-white shadow-xl shadow-blue-500/25">
                {profile.user?.name?.[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight">{profile.user?.name}</h1>
                <span className="badge-green">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                  Verified tutor
                </span>
              </div>
              {profile.headline && <p className="text-slate-500 mt-1">{profile.headline}</p>}
              <p className="font-display text-xl font-bold text-blue-600 mt-2">
                ${Number(profile.hourly_rate).toFixed(0)}<span className="text-slate-400 font-normal text-base">/hour</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-sm text-slate-600">
                {profile.qualifications && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" /></svg>
                    {profile.qualifications}
                  </span>
                )}
                {profile.experience_years > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {profile.experience_years}+ years experience
                  </span>
                )}
              </div>
              {subjectList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {subjectList.map((s) => (
                    <span key={s} className="badge bg-slate-100 text-slate-600">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section className="card p-8">
              <h2 className="font-display font-bold text-xl mb-4">About</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio || 'No bio provided yet.'}</p>
            </section>

            {courses.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-xl mb-6">Courses by {profile.user?.name}</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {courses.map((c) => <CourseCard key={c.id} course={c} />)}
                </div>
              </section>
            )}
          </div>

          {/* Booking panel */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="card p-7 shadow-xl shadow-slate-200/50">
              <h3 className="font-display font-bold text-lg mb-1">Book a live session</h3>
              <p className="text-sm text-slate-400 mb-6">1-on-1 video session, tailored to you.</p>

              {!user ? (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm mb-4">Log in to book a session with {profile.user?.name}.</p>
                  <Link to="/login" className="btn-primary w-full">Log in</Link>
                </div>
              ) : user.role !== 'student' ? (
                <p className="text-slate-400 text-sm text-center py-4">Only student accounts can book sessions.</p>
              ) : booked ? (
                <div className="text-center py-6">
                  <span className="w-14 h-14 mx-auto rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <h4 className="font-display font-bold mb-1">Request sent!</h4>
                  <p className="text-sm text-slate-500 mb-4">{profile.user?.name} will confirm your session shortly. You'll get an email with the meeting link.</p>
                  <Link to="/student/my-bookings" className="text-blue-600 text-sm font-semibold hover:underline">View my bookings</Link>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="field-label">What do you need help with?</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.subject}
                      onChange={(e) => setBookingForm({ ...bookingForm, subject: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Year 10 Algebra"
                    />
                  </div>
                  <div>
                    <label className="field-label">Preferred date &amp; time</label>
                    <input
                      type="datetime-local"
                      required
                      value={bookingForm.datetime}
                      onChange={(e) => setBookingForm({ ...bookingForm, datetime: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  {error && <p className="text-rose-600 text-sm font-medium">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full">
                    {submitting ? 'Sending request...' : 'Request booking'}
                  </button>
                  <p className="text-xs text-slate-400 text-center">Free to request — pay only after your session.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
