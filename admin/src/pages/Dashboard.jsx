import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: 'Total Users', value: stats.users },
        { label: 'Courses', value: stats.courses },
        { label: 'Bookings', value: stats.bookings },
        { label: 'Revenue', value: `$${Number(stats.revenue).toFixed(2)}` },
      ]
    : [];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      {!stats ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div key={c.label} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-indigo-600">{c.value}</p>
              <p className="text-gray-500 mt-1 text-sm">{c.label}</p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
