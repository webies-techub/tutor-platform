import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import api from '../api/axios';

const FEATURES = [
  {
    title: 'Learn at your pace',
    desc: 'On-demand video courses you can watch anytime, on any device — pause, rewind, and revisit as often as you like.',
    icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    tint: 'from-violet-500 to-indigo-500',
  },
  {
    title: '1-on-1 live sessions',
    desc: 'Book private video sessions with expert tutors who tailor every lesson to your goals and pace.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    tint: 'from-fuchsia-500 to-pink-500',
  },
  {
    title: 'Verified experts',
    desc: 'Every tutor is reviewed and approved by our team before they can teach, so you always learn from the best.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    tint: 'from-emerald-500 to-teal-500',
  },
];

const STEPS = [
  { n: '01', title: 'Find your course or tutor', desc: 'Browse our catalogue or search the tutor directory by subject and budget.' },
  { n: '02', title: 'Enrol or book a session', desc: 'Buy a course for instant lifetime access, or request a live session at a time that suits you.' },
  { n: '03', title: 'Start learning', desc: 'Stream lessons in HD or join your 1-on-1 — and track all your progress from one dashboard.' },
];

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science', 'Economics'];

const TESTIMONIALS = [
  { quote: 'The video courses are brilliant and my tutor genuinely cares about my progress. Best decision I made this year.', name: 'Sarah K.', role: 'Year 12 student', initial: 'S', tint: 'from-fuchsia-500 to-violet-600' },
  { quote: 'I went from failing maths to a band 6. The 1-on-1 sessions made everything finally click for me.', name: 'James L.', role: 'HSC graduate', initial: 'J', tint: 'from-sky-500 to-indigo-600' },
  { quote: 'As a tutor, LearnHub handles all the admin so I can just focus on teaching. The students keep coming.', name: 'Dr. Mei T.', role: 'Physics tutor', initial: 'M', tint: 'from-emerald-500 to-teal-600' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/courses?featured=true').then(({ data }) => setFeatured(data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50/80 via-white to-white">
        {/* soft color glows */}
        <div className="absolute -top-40 -left-20 w-[36rem] h-[36rem] bg-violet-200/40 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-0 w-[30rem] h-[30rem] bg-fuchsia-200/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-white text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full ring-1 ring-violet-200/80 shadow-sm mb-7 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Trusted by 500+ learners across Australia
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] animate-fade-in-up">
                Master any subject with
                <span className="block mt-2 text-gradient">tutors who truly care</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                On-demand video courses and live 1-on-1 tutoring — all in one beautiful place.
                Learn smarter with hand-picked experts.
              </p>
              <div className="mt-9 flex flex-wrap justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/courses" className="btn-primary text-base !px-8 !py-4">
                  Explore courses
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/tutors" className="btn-secondary text-base !px-8 !py-4">Find a tutor</Link>
              </div>

              {/* trust row */}
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 animate-fade-in" style={{ animationDelay: '0.35s' }}>
                <div className="flex -space-x-3">
                  {['from-violet-500 to-indigo-600', 'from-fuchsia-500 to-pink-600', 'from-sky-500 to-cyan-600', 'from-emerald-500 to-teal-600'].map((t, i) => (
                    <span key={i} className={`w-11 h-11 rounded-full bg-gradient-to-br ${t} ring-4 ring-white flex items-center justify-center text-white font-bold text-sm`}>
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.06 9.771c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" /></svg>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">Rated 4.9/5 by students</p>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="relative mx-auto max-w-md">
                {/* main card */}
                <div className="card p-6 shadow-2xl shadow-violet-300/30 rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-fuchsia-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-dots opacity-30" />
                    <span className="relative w-16 h-16 rounded-full bg-white/90 shadow-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-violet-600 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="eyebrow text-[10px]">Mathematics</span>
                    <h3 className="font-display font-bold text-slate-900 mt-1">Algebra Mastery: Year 10</h3>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <span className="text-sm text-slate-500">12 lessons</span>
                      <span className="font-display font-bold text-slate-900">$49.99</span>
                    </div>
                  </div>
                </div>

                {/* floating stat card */}
                <div className="absolute -left-6 -bottom-6 card px-5 py-4 shadow-xl shadow-slate-300/40 -rotate-3 hover:rotate-0 transition-transform duration-500 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <div>
                      <p className="font-display font-bold text-slate-900 leading-tight">Lesson complete!</p>
                      <p className="text-xs text-slate-400">Keep up the streak 🔥</p>
                    </div>
                  </div>
                </div>

                {/* floating tutor card */}
                <div className="absolute -right-4 -top-6 card px-4 py-3 shadow-xl shadow-slate-300/40 rotate-3 hover:rotate-0 transition-transform duration-500 hidden sm:block">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">M</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 leading-tight">Dr. Mei T.</p>
                      <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online now
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* logo / stat strip */}
        <div className="relative border-t border-slate-200/70 bg-white/60 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-3 divide-x divide-slate-200">
            {[['500+', 'Active students'], ['50+', 'Expert tutors'], ['200+', 'Video courses']].map(([n, l]) => (
              <div key={l} className="text-center px-4">
                <p className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">{n}</p>
                <p className="text-sm text-slate-500 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow mb-3">Why LearnHub</p>
            <h2 className="section-title">Everything you need to learn well</h2>
            <p className="text-slate-500 mt-4 text-lg">One platform for recorded courses and live tutoring — designed to keep you motivated.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-hover p-8">
                <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.tint} flex items-center justify-center mb-5 shadow-lg shadow-violet-500/20`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </span>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBJECTS ===== */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-slate-50 ring-1 ring-slate-100 px-8 py-12 sm:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow mb-2">Popular subjects</p>
              <h2 className="font-display text-2xl font-bold">Learn what matters to you</h2>
            </div>
            <Link to="/courses" className="btn-ghost text-sm self-start sm:self-auto">Browse all →</Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {SUBJECTS.map((s) => (
              <Link
                key={s}
                to="/courses"
                className="bg-white px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-violet-300 hover:text-violet-700 hover:shadow-md transition-all"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="section-title">Start learning in three steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="card card-hover p-8 h-full">
                  <span className="font-display text-5xl font-extrabold text-gradient">{s.n}</span>
                  <h3 className="font-display font-bold text-lg mt-4 mb-2">{s.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <svg className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-violet-200 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED COURSES ===== */}
      {featured.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow mb-3">Hand-picked</p>
                <h2 className="section-title">Featured courses</h2>
              </div>
              <Link to="/courses" className="hidden sm:inline-flex nav-link font-semibold items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {featured.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow mb-3">Loved by learners</p>
            <h2 className="section-title">Don't just take our word for it</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card card-hover p-8 flex flex-col">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.06 9.771c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" /></svg>
                  ))}
                </div>
                <blockquote className="text-slate-600 leading-relaxed flex-1">"{t.quote}"</blockquote>
                <figcaption className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                  <span className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.tint} flex items-center justify-center text-white font-bold`}>{t.initial}</span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-sm text-slate-400">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 px-8 py-16 sm:px-16 sm:py-20 text-center">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
              Ready to start learning — or teaching?
            </h2>
            <p className="mt-4 text-violet-100 text-lg max-w-xl mx-auto">
              Join thousands of students and tutors building their future on LearnHub.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-violet-50 active:scale-[0.98] transition-all">
                Get started free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link to="/become-a-tutor" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-8 py-4 rounded-xl ring-1 ring-white/30 hover:bg-white/20 transition-all">
                Become a tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
