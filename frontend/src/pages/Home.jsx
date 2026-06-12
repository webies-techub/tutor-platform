import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import TutorCard from '../components/TutorCard';
import api from '../api/axios';

const HERO_IMG = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop';
const TUTOR_CTA_IMG = 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1100&q=80&auto=format&fit=crop';

const WAYS = [
  {
    title: 'On-Demand Courses',
    desc: 'Buy and watch expertly-produced video courses at your own pace. Lifetime access, learn anytime, anywhere.',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=80&auto=format&fit=crop',
    icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    to: '/courses', cta: 'Browse courses',
  },
  {
    title: 'Live 1-to-1 Sessions',
    desc: 'Book private, individual lessons with a professional tutor. Personalised help, scheduled around you.',
    img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=700&q=80&auto=format&fit=crop',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    to: '/tutors', cta: 'Find a tutor',
  },
  {
    title: 'Live Group Classes',
    desc: 'Join interactive live group classes with other students. Collaborative learning at an affordable price.',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=700&q=80&auto=format&fit=crop',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    to: '/group-classes', cta: 'See live classes',
  },
];

const ACADEMIC = [
  { name: 'Mathematics', icon: '∑', tint: 'from-blue-500 to-indigo-500' },
  { name: 'Physics', icon: '⚛', tint: 'from-sky-500 to-blue-500' },
  { name: 'Chemistry', icon: '⚗', tint: 'from-cyan-500 to-sky-500' },
  { name: 'Biology', icon: '🧬', tint: 'from-teal-500 to-cyan-500' },
  { name: 'Economics', icon: '📈', tint: 'from-blue-500 to-cyan-500' },
];
const PROFESSIONAL = [
  { name: 'UI/UX Design', icon: '🎨', tint: 'from-sky-500 to-blue-500' },
  { name: 'Digital Marketing', icon: '📣', tint: 'from-cyan-500 to-blue-500' },
  { name: 'AI/Prompt Engineering', icon: '🤖', tint: 'from-blue-600 to-sky-500' },
];

const WHY = [
  { title: 'Verified expert tutors', desc: 'Every tutor is vetted and approved for their qualifications and experience before they teach.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Learn from home', desc: 'Fully remote study — recorded courses and live video sessions you can join from anywhere.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { title: 'Flexible & affordable', desc: 'Pay per course or per session — no lock-in subscriptions. Options for every budget.', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { title: 'Track your progress', desc: 'A personal dashboard for your courses, lessons, bookings and live classes — all in one place.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

const fmtDate = (d) => new Date(d).toLocaleString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get('/courses?featured=true').then(({ data }) => setFeatured(data.slice(0, 6))).catch(() => {});
    api.get('/tutors').then(({ data }) => setTutors(data.slice(0, 4))).catch(() => {});
    api.get('/group-sessions').then(({ data }) => setSessions(data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
        <div className="absolute -top-40 -left-24 w-[34rem] h-[34rem] bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute top-10 right-0 w-[30rem] h-[30rem] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-white text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full ring-1 ring-blue-200/80 shadow-sm mb-7 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Tuition · Home study · Remote learning
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] animate-fade-in-up">
                Study from home with
                <span className="block mt-2 text-gradient">expert tutors you can trust</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Australia's friendly online tuition platform. Learn academic subjects and
                in-demand professional skills through on-demand courses, private 1-to-1 sessions,
                and live group classes — all from the comfort of home.
              </p>
              <div className="mt-9 flex flex-wrap justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/courses" className="btn-primary text-base !px-8 !py-4">
                  Start learning
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link to="/tutors" className="btn-secondary text-base !px-8 !py-4">Meet our tutors</Link>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 animate-fade-in" style={{ animationDelay: '0.35s' }}>
                <div className="flex -space-x-3">
                  {['from-blue-500 to-indigo-600', 'from-sky-500 to-blue-600', 'from-cyan-500 to-sky-600', 'from-teal-500 to-cyan-600'].map((t, i) => (
                    <span key={i} className={`w-11 h-11 rounded-full bg-gradient-to-br ${t} ring-4 ring-white flex items-center justify-center text-white font-bold text-sm`}>{['A', 'B', 'C', 'D'][i]}</span>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (<svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.06 9.771c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" /></svg>))}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">Loved by 500+ students &amp; parents</p>
                </div>
              </div>
            </div>

            {/* Hero image with floating cards */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-300/30 ring-1 ring-slate-200/60">
                <img src={HERO_IMG} alt="Student learning from home" className="w-full h-[26rem] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>
              <div className="absolute -left-5 bottom-8 card px-5 py-4 shadow-xl shadow-slate-300/40 hidden sm:block">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <div><p className="font-display font-bold text-slate-900 text-sm leading-tight">Lesson complete</p><p className="text-xs text-slate-400">Great progress today!</p></div>
                </div>
              </div>
              <div className="absolute -right-4 top-8 card px-4 py-3 shadow-xl shadow-slate-300/40 hidden sm:block">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white font-bold text-sm">Mei</span>
                  <div><p className="text-sm font-semibold text-slate-900 leading-tight">Live in 5 min</p><p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Physics group class</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-16 border-t border-slate-200/70 pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[['500+', 'Students learning'], ['50+', 'Expert tutors'], ['8', 'Subjects offered'], ['3', 'Ways to learn']].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">{n}</p>
                <p className="text-sm text-slate-500 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3 WAYS TO LEARN ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow mb-3">How you learn</p>
            <h2 className="section-title">Three flexible ways to learn</h2>
            <p className="text-slate-500 mt-4 text-lg">Whether you prefer self-paced study or live guidance, we have a format that fits you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {WAYS.map((w) => (
              <div key={w.title} className="card card-hover overflow-hidden flex flex-col">
                <div className="relative h-44">
                  <img src={w.img} alt={w.title} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={w.icon} /></svg>
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-lg mb-2">{w.title}</h3>
                  <p className="text-slate-500 leading-relaxed flex-1">{w.desc}</p>
                  <Link to={w.to} className="mt-5 text-sm font-semibold text-blue-600 inline-flex items-center gap-1 hover:gap-2 transition-all">
                    {w.cta}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBJECTS ===== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-slate-50 ring-1 ring-slate-100 px-6 py-12 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="eyebrow mb-3">What you can learn</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Subjects &amp; skills we offer</h2>
          </div>

          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Academic subjects</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {ACADEMIC.map((s) => (
              <Link key={s.name} to="/courses" className="card card-hover p-5 flex flex-col items-center text-center gap-3">
                <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.tint} flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20`}>{s.icon}</span>
                <span className="font-semibold text-slate-800 text-sm">{s.name}</span>
              </Link>
            ))}
          </div>

          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Professional &amp; trending skills</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PROFESSIONAL.map((s) => (
              <Link key={s.name} to="/courses" className="card card-hover p-5 flex items-center gap-4">
                <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.tint} flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20`}>{s.icon}</span>
                <span className="font-semibold text-slate-800">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED COURSES ===== */}
      {featured.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow mb-3">Popular right now</p>
                <h2 className="section-title">Featured courses</h2>
              </div>
              <Link to="/courses" className="hidden sm:inline-flex nav-link font-semibold items-center gap-1">View all<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {featured.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== UPCOMING LIVE GROUP CLASSES ===== */}
      {sessions.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow mb-3">Join live</p>
                <h2 className="section-title">Upcoming group classes</h2>
              </div>
              <Link to="/group-classes" className="hidden sm:inline-flex nav-link font-semibold items-center gap-1">View all<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-7">
              {sessions.map((s) => {
                const left = s.capacity - s.seats_taken;
                return (
                  <Link key={s.id} to="/group-classes" className="card card-hover p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge bg-blue-50 text-blue-700 ring-1 ring-blue-200">{s.subject}</span>
                      <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">{left} seats left</span>
                    </div>
                    <h3 className="font-display font-bold text-slate-900 leading-snug">{s.title}</h3>
                    <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {fmtDate(s.datetime)}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-500">with {s.tutor?.name}</span>
                      <span className="font-display font-bold text-slate-900">${Number(s.price).toFixed(2)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== TUTORS ===== */}
      {tutors.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="eyebrow mb-3">Learn from the best</p>
              <h2 className="section-title">Meet our expert tutors</h2>
              <p className="text-slate-500 mt-4 text-lg">Qualified, experienced and hand-picked. Every tutor is verified before they teach on LearnHub.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {tutors.map((t) => <TutorCard key={t.id} profile={t} />)}
            </div>
            <div className="text-center mt-10">
              <Link to="/tutors" className="btn-secondary">Browse all tutors</Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow mb-3">Why LearnHub</p>
            <h2 className="section-title">Built for serious learning</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY.map((f) => (
              <div key={f.title} className="text-center">
                <span className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                </span>
                <h3 className="font-display font-bold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING TEASER ===== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-slate-50 ring-1 ring-slate-100 p-8 sm:p-14 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow mb-3">Simple pricing</p>
            <h2 className="font-display text-3xl font-bold mb-4">Pay only for what you learn</h2>
            <p className="text-slate-600 leading-relaxed mb-6">No subscriptions, no lock-in. Buy individual courses for lifetime access, or book live sessions and group classes as you go. Browsing and tutor profiles are always free.</p>
            <ul className="space-y-3 mb-8">
              {['Free to browse courses & tutors', 'One-time payment for lifetime course access', 'Affordable live group classes', 'Set-your-own-rate 1-to-1 tutoring'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-700">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="btn-primary">View full pricing</Link>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[['Courses', 'from $49', 'lifetime access'], ['Group classes', 'from $19', 'per live class'], ['1-to-1', 'from $50', 'per hour'], ['Browsing', 'Free', 'always']].map(([t, p, s]) => (
              <div key={t} className="card p-6 text-center">
                <p className="text-sm text-slate-500">{t}</p>
                <p className="font-display text-2xl font-extrabold text-slate-900 mt-1">{p}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BECOME A TUTOR ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden relative grid lg:grid-cols-2">
          <div className="bg-slate-950 p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute -top-20 -left-10 w-72 h-72 bg-blue-600/25 rounded-full blur-3xl" />
            <div className="relative">
              <p className="text-sky-300 font-bold text-xs uppercase tracking-[0.18em] mb-4">For tutors &amp; teachers</p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">Teach with us and grow your income</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">Join our network of professional tutors. Create courses, accept private bookings, and host live group classes — we bring you the students. Set your own rates and teach from anywhere.</p>
              <ul className="mt-6 space-y-3">
                {['Reach motivated students across Australia', 'Earn from courses, 1-to-1 and group classes', 'Free to join — keep more of what you earn'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-200">
                    <span className="w-6 h-6 rounded-full bg-blue-600/30 ring-1 ring-blue-500/50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/become-a-tutor" className="mt-8 inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl shadow-xl hover:bg-blue-50 active:scale-[0.98] transition-all">
                Become a tutor
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          <div className="relative min-h-[20rem]">
            <img src={TUTOR_CTA_IMG} alt="Tutor teaching online" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-sky-600 to-blue-700 px-8 py-16 sm:px-16 sm:py-20 text-center">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">Ready to start learning from home?</h2>
            <p className="mt-4 text-blue-100 text-lg max-w-xl mx-auto">Join thousands of students and tutors on Australia's friendly online tuition platform.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-blue-50 active:scale-[0.98] transition-all">Get started free<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
              <Link to="/courses" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-8 py-4 rounded-xl ring-1 ring-white/30 hover:bg-white/20 transition-all">Browse courses</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
