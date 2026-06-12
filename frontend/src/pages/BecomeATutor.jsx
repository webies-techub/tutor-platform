import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PERKS = [
  { title: 'Set your own rate', desc: 'You decide what your time is worth.' },
  { title: 'Teach your way', desc: 'Recorded courses, live sessions, or both.' },
  { title: 'We bring the students', desc: 'Get discovered through our directory.' },
];

export default function BecomeATutor() {
  const { user } = useAuth();
  const [form, setForm] = useState({ headline: '', bio: '', subjects: '', qualifications: '', experience_years: '', hourly_rate: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/tutors/apply', {
        headline: form.headline,
        bio: form.bio,
        subjects: form.subjects,
        qualifications: form.qualifications,
        experience_years: parseInt(form.experience_years, 10) || 0,
        hourly_rate: parseFloat(form.hourly_rate) || 0,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-slate-950 relative overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Teach what you love.
            <span className="block mt-1 bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">Earn what you deserve.</span>
          </h1>
          <p className="mt-5 text-lg text-slate-300 max-w-xl mx-auto">
            Join a growing community of expert tutors helping students succeed across Australia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Perks */}
          <div className="lg:col-span-2 space-y-6">
            {PERKS.map((p, i) => (
              <div key={p.title} className="card p-6 flex gap-4">
                <span className="w-10 h-10 rounded-xl bg-blue-50 ring-1 ring-blue-100 text-blue-600 font-display font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display font-bold mb-1">{p.title}</h3>
                  <p className="text-sm text-slate-500">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Application form */}
          <div className="lg:col-span-3">
            {!user ? (
              <div className="card p-12 text-center">
                <h2 className="font-display font-bold text-xl mb-2">Ready to apply?</h2>
                <p className="text-slate-500 mb-6">Create a free account or log in to submit your tutor application.</p>
                <div className="flex justify-center gap-3">
                  <Link to="/register" className="btn-primary">Create account</Link>
                  <Link to="/login" className="btn-secondary">Log in</Link>
                </div>
              </div>
            ) : success ? (
              <div className="card p-12 text-center">
                <span className="w-16 h-16 mx-auto rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h2 className="font-display font-bold text-2xl mb-2">Application received!</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  Our team will review your profile within 2 business days. You'll receive an email at <strong>{user.email}</strong> once you're approved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 sm:p-10 space-y-6">
                <div>
                  <h2 className="font-display font-bold text-xl">Tutor application</h2>
                  <p className="text-sm text-slate-400 mt-1">Tell us about yourself — this is what students will see.</p>
                </div>
                <div>
                  <label className="field-label">Professional headline</label>
                  <input
                    type="text"
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    className="input-field"
                    placeholder="e.g. PhD Physics · Former University Lecturer"
                  />
                </div>
                <div>
                  <label className="field-label">Your bio</label>
                  <textarea
                    required
                    rows={5}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Share your teaching experience and what makes your sessions great..."
                  />
                </div>
                <div>
                  <label className="field-label">Qualifications</label>
                  <input
                    type="text"
                    value={form.qualifications}
                    onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                    className="input-field"
                    placeholder="e.g. PhD Physics (USyd), B.Sc (Hons)"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="field-label">Subjects you teach</label>
                    <input
                      type="text"
                      required
                      value={form.subjects}
                      onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                      className="input-field"
                      placeholder="Math, Physics, Chemistry"
                    />
                    <p className="text-xs text-slate-400 mt-1.5">Separate with commas</p>
                  </div>
                  <div>
                    <label className="field-label">Years of experience</label>
                    <input
                      type="number"
                      min="0"
                      value={form.experience_years}
                      onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                      className="input-field"
                      placeholder="8"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="field-label">Hourly rate (AUD)</label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.hourly_rate}
                        onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
                        className="input-field !pl-8"
                        placeholder="50.00"
                      />
                    </div>
                  </div>
                </div>
                {error && <p className="text-rose-600 text-sm font-medium bg-rose-50 rounded-xl px-4 py-3 ring-1 ring-rose-100">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full text-base">
                  {loading ? 'Submitting...' : 'Submit application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
