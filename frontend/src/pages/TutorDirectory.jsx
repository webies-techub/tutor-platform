import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TutorCard from '../components/TutorCard';
import api from '../api/axios';

export default function TutorDirectory() {
  const [tutors, setTutors] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tutors').then(({ data }) => setTutors(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = tutors.filter((t) => {
    const q = query.toLowerCase();
    return (
      !q ||
      t.user?.name?.toLowerCase().includes(q) ||
      (t.subjects || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Find your tutor</h1>
          <p className="text-slate-500 mt-2 text-lg">Verified experts ready to help you 1-on-1.</p>

          <div className="relative max-w-md mt-6">
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or subject..."
              className="input-field !pl-12"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <span className="text-5xl block mb-4">&#129335;</span>
            <h3 className="font-display font-bold text-lg mb-1">No tutors found</h3>
            <p className="text-slate-500">
              {tutors.length === 0 ? 'New tutors are being onboarded — check back soon!' : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((t) => <TutorCard key={t.id} profile={t} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
