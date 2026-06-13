import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const fmtDate = (d) => new Date(d).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
const STATUS = {
  scheduled: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  completed: 'bg-slate-100 text-slate-600',
};

export default function AdminGroupSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/group-sessions').then(({ data }) => setSessions(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Live Group Classes</h1>
      {loading ? <p className="text-gray-500">Loading...</p> : sessions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500">No group classes scheduled.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Class</th>
                <th className="px-6 py-3 text-left">Tutor</th>
                <th className="px-6 py-3 text-left">When</th>
                <th className="px-6 py-3 text-left">Seats</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{s.title}</div>
                    <div className="text-gray-400 text-xs">{s.subject}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.tutor?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{fmtDate(s.datetime)}</td>
                  <td className="px-6 py-4 text-gray-600">{s.seats_taken}/{s.capacity}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${Number(s.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS[s.status] || 'bg-gray-100 text-gray-600'}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
