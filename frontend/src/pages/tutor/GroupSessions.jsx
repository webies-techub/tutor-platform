import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const fmtDate = (d) => new Date(d).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
const empty = { title: '', subject: '', description: '', datetime: '', duration_min: 60, capacity: 10, price: '' };

export default function TutorGroupSessions() {
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = () => {
    api.get('/group-sessions/hosted/mine').then(({ data }) => setSessions(data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { refresh(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/group-sessions', {
        ...form,
        duration_min: Number(form.duration_min),
        capacity: Number(form.capacity),
        price: parseFloat(form.price) || 0,
      });
      setForm(empty);
      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create class');
    }
  };

  const remove = async (id) => {
    await api.delete(`/group-sessions/${id}`);
    refresh();
  };

  return (
    <DashboardLayout title="Group Classes" subtitle="Schedule and manage your live group classes.">
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !px-5 !py-2.5 text-sm">
          {showForm ? 'Cancel' : '+ Schedule a class'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-6 sm:p-8 mb-8 space-y-5">
          <h2 className="font-display font-bold text-lg">New live group class</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="field-label">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Calculus Problem-Solving Workshop" />
            </div>
            <div>
              <label className="field-label">Subject</label>
              <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="Mathematics" />
            </div>
            <div>
              <label className="field-label">Date &amp; time</label>
              <input type="datetime-local" required value={form.datetime} onChange={(e) => setForm({ ...form, datetime: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="field-label">Duration (minutes)</label>
              <input type="number" min="15" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="field-label">Capacity</label>
              <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Price per seat (AUD)</label>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input type="number" min="0" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field !pl-8" placeholder="19.99" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="What will students learn in this class?" />
            </div>
          </div>
          {error && <p className="text-rose-600 text-sm font-medium">{error}</p>}
          <button type="submit" className="btn-primary">Schedule class</button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>
      ) : sessions.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl block mb-4">📅</span>
          <h3 className="font-display font-bold text-lg mb-1">No classes scheduled</h3>
          <p className="text-slate-500">Schedule your first live group class to start filling seats.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div key={s.id} className="card p-6 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="badge bg-blue-50 text-blue-700 ring-1 ring-blue-200 mb-1">{s.subject}</span>
                <h3 className="font-display font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{fmtDate(s.datetime)} · {s.duration_min} min</p>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-semibold text-slate-900">{s.seats_taken}</span> / {s.capacity} seats filled · ${Number(s.price).toFixed(2)} each
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={s.status === 'scheduled' ? 'badge-green' : 'badge bg-slate-100 text-slate-500'}>{s.status}</span>
                <button onClick={() => remove(s.id)} className="text-rose-500 hover:text-rose-700 text-sm font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
