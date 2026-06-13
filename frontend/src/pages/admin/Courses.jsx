import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tutor_id: '', title: '', subject: '', description: '', price: '', type: 'recorded' });
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = () => {
    api.get('/admin/courses').then(({ data }) => setCourses(data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const approve = async (id) => { await api.put(`/admin/courses/${id}/approve`); refresh(); };
  const feature = async (id) => { await api.put(`/admin/courses/${id}/feature`); refresh(); };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (thumbnail) fd.append('thumbnail', thumbnail);
    try {
      await api.post('/admin/courses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowForm(false);
      setForm({ tutor_id: '', title: '', subject: '', description: '', price: '', type: 'recorded' });
      setThumbnail(null);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700">
          {showForm ? 'Cancel' : '+ New Course'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Create Course</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tutor User ID</label>
              <input type="number" required value={form.tutor_id} onChange={(e) => setForm({ ...form, tutor_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
              <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price ($)</label>
              <input type="number" min="0" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="recorded">Recorded</option>
                <option value="live">Live</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Thumbnail</label>
              <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full text-sm text-gray-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700">Create Course</button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{c.title}</div>
                    <div className="text-gray-400 text-xs">by {c.tutor?.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{c.subject}</td>
                  <td className="px-6 py-4 text-gray-600">${Number(c.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {c.is_approved ? 'Approved' : 'Pending'}
                      </span>
                      {c.is_featured && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">Featured</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {!c.is_approved && (
                        <button onClick={() => approve(c.id)} className="text-xs text-green-700 hover:underline font-medium">Approve</button>
                      )}
                      <button onClick={() => feature(c.id)} className="text-xs text-sky-600 hover:underline font-medium">
                        {c.is_featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <Link to={`/admin/courses/${c.id}/lessons`} className="text-xs text-gray-600 hover:underline font-medium">Lessons</Link>
                    </div>
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
