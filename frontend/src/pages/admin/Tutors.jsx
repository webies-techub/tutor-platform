import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

export default function AdminTutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    api.get('/admin/tutors').then(({ data }) => setTutors(data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const approve = async (userId) => { await api.put(`/admin/tutors/${userId}/approve`); refresh(); };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tutors</h1>
      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Subjects</th>
                <th className="px-6 py-3 text-left">Rate</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tutors.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{t.user?.name}</div>
                    <div className="text-gray-400 text-xs">{t.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">{t.subjects || '—'}</td>
                  <td className="px-6 py-4 text-gray-600">${Number(t.hourly_rate).toFixed(2)}/hr</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {t.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!t.is_approved && (
                      <button onClick={() => approve(t.user_id)} className="text-xs text-green-700 hover:underline font-medium">Approve</button>
                    )}
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
