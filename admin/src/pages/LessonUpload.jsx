import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

export default function LessonUpload() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ title: '', order_index: 0, duration: 0 });
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refresh = () => {
    api.get(`/courses/${courseId}`)
      .then(({ data }) => setLessons(data.lessons || []))
      .catch(() => {});
  };

  useEffect(() => { refresh(); }, [courseId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!video) { setError('Please select a video file'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('course_id', courseId);
    fd.append('title', form.title);
    fd.append('order_index', form.order_index);
    fd.append('duration', form.duration);
    fd.append('video', video);
    try {
      await api.post('/admin/lessons', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Lesson uploaded!');
      setForm({ title: '', order_index: 0, duration: 0 });
      setVideo(null);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteLesson = async (id) => {
    await api.delete(`/lessons/${id}`);
    refresh();
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <Link to="/courses" className="text-sky-600 hover:underline text-sm">← Back to Courses</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Lessons (Course #{courseId})</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Add Lesson</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Lesson Title</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                <input type="number" min="0" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Duration (seconds)</label>
                <input type="number" min="0" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Video File</label>
              <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="w-full text-sm text-gray-500" required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
            <button type="submit" disabled={uploading} className="w-full bg-sky-600 text-white py-2.5 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-50 text-sm">
              {uploading ? 'Uploading...' : 'Upload Lesson'}
            </button>
          </form>
        </div>

        {/* Existing lessons */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Existing Lessons ({lessons.length})</h2>
          {lessons.length === 0 ? (
            <p className="text-gray-500 text-sm">No lessons yet.</p>
          ) : (
            <div className="space-y-3">
              {lessons.sort((a, b) => a.order_index - b.order_index).map((l) => (
                <div key={l.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{l.order_index + 1}. {l.title}</p>
                    {l.duration > 0 && <p className="text-xs text-gray-400">{Math.floor(l.duration / 60)}m {l.duration % 60}s</p>}
                  </div>
                  <button onClick={() => deleteLesson(l.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
