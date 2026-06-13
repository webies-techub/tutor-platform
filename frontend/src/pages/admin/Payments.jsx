import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const statusColors = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
};

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/payments').then(({ data }) => setPayments(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const total = payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 shadow-sm">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-sky-600">${total.toFixed(2)}</p>
        </div>
      </div>
      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{p.student?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{p.course?.title}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${Number(p.amount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(p.created_at).toLocaleDateString('en-AU')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[p.status]}`}>
                      {p.status}
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
