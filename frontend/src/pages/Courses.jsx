import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import api from '../api/axios';

const SUBJECTS = ['All', 'Math', 'Science', 'English', 'Physics', 'Chemistry', 'Biology', 'History'];
const TYPES = [
  { value: 'All', label: 'All types' },
  { value: 'recorded', label: 'Recorded' },
  { value: 'live', label: 'Live' },
];

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-slate-100 rounded w-1/4" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [subject, setSubject] = useState('All');
  const [type, setType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (subject !== 'All') params.subject = subject;
    if (type !== 'All') params.type = type;
    api.get('/courses', { params })
      .then(({ data }) => setCourses(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [subject, type]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Explore courses</h1>
          <p className="text-slate-500 mt-2 text-lg">Learn from expertly crafted video courses across every subject.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Subject pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                subject === s
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-700'
              }`}
            >
              {s}
            </button>
          ))}
          <div className="ml-auto">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field !w-auto !py-2 text-sm font-medium"
            >
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="card p-16 text-center">
            <span className="text-5xl block mb-4">&#128269;</span>
            <h3 className="font-display font-bold text-lg mb-1">No courses found</h3>
            <p className="text-slate-500">Try a different subject or check back soon — new courses are added regularly.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
