import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const plans = [
  {
    name: 'Free',
    price: '$0',
    sub: 'forever',
    desc: 'Explore the platform at no cost.',
    features: ['Browse all courses', 'View tutor profiles', 'Preview course curriculums'],
    cta: 'Get started',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Student',
    price: 'Pay per course',
    sub: 'no subscription',
    desc: 'Buy only what you want to learn.',
    features: ['Lifetime access to purchased courses', 'HD video streaming', 'Book live 1-on-1 sessions', 'Email support'],
    cta: 'Browse courses',
    href: '/courses',
    highlight: true,
  },
  {
    name: 'Tutor',
    price: 'Free to join',
    sub: 'earn on your terms',
    desc: 'Teach and earn with zero upfront cost.',
    features: ['Create & sell courses', 'Accept session bookings', 'Set your own hourly rate', 'Dedicated tutor dashboard'],
    cta: 'Become a tutor',
    href: '/become-a-tutor',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-violet-600 font-bold text-sm uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="section-title mb-4">Simple and transparent</h1>
          <p className="text-slate-500 text-lg">No hidden fees, no subscriptions. Pay only for what you learn.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-slate-950 text-white shadow-2xl shadow-violet-600/20 ring-1 ring-violet-500/50 lg:scale-105'
                  : 'card'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg px-4">
                  Most popular
                </span>
              )}
              <h2 className={`font-display font-bold text-lg ${plan.highlight ? 'text-white' : ''}`}>{plan.name}</h2>
              <div className="mt-3 mb-1">
                <span className={`font-display text-3xl font-extrabold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {plan.price}
                </span>
              </div>
              <p className={`text-sm ${plan.highlight ? 'text-violet-300' : 'text-violet-600'} font-medium mb-3`}>{plan.sub}</p>
              <p className={`text-sm mb-7 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>

              <ul className="space-y-3.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-3 text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                    <svg className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-violet-400' : 'text-violet-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={plan.highlight
                  ? 'inline-flex items-center justify-center bg-white text-slate-900 font-bold px-6 py-3.5 rounded-xl hover:bg-violet-50 active:scale-[0.98] transition-all'
                  : 'btn-secondary w-full'}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
