import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/bookings').then(({ data }) => setBookings(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Bookings</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Tutor</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Date &amp; Time</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{b.student?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{b.tutor?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{b.subject}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(b.datetime).toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
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
