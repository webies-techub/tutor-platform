import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../api/axios';

const LESSON_TYPES = [
  { value: 'video',    label: 'Video',         icon: '▶', hint: 'MP4, MOV, WebM — up to 500 MB' },
  { value: 'text',     label: 'Text',          icon: '✏', hint: 'Written content, notes, or instructions' },
  { value: 'image',    label: 'Image',         icon: '🖼', hint: 'JPG, PNG, GIF — displayed inline' },
  { value: 'resource', label: 'Resource/PDF',  icon: '📄', hint: 'PDF handouts or downloadable files' },
];

export default function LessonUpload() {
  const { courseId } = useParams();
  const [courseTitle, setCourseTitle] = useState('');
  const [lessons, setLessons] = useState([]);
  const [lessonType, setLessonType] = useState('video');
  const [form, setForm] = useState({ title: '', order_index: 0, duration: 0, content: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refresh = () => {
    api.get(`/courses/${courseId}`)
      .then(({ data }) => {
        setLessons(data.lessons || []);
        setCourseTitle(data.title || '');
      })
      .catch(() => {});
  };

  useEffect(() => { refresh(); }, [courseId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (lessonType !== 'text' && !file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append('course_id', courseId);
    fd.append('title', form.title);
    fd.append('order_index', form.order_index);
    fd.append('lesson_type', lessonType);

    if (lessonType === 'video') {
      fd.append('duration', form.duration);
      fd.append('file', file);
    } else if (lessonType === 'text') {
      fd.append('content', form.content);
    } else {
      fd.append('file', file);
    }

    try {
      await api.post('/admin/lessons', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Lesson added!');
      setForm({ title: '', order_index: 0, duration: 0, content: '' });
      setFile(null);
      // Reset the file input by re-rendering
      const fi = document.getElementById('lesson-file-input');
      if (fi) fi.value = '';
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteLesson = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    await api.delete(`/lessons/${id}`);
    refresh();
  };

  const typeInfo = LESSON_TYPES.find((t) => t.value === lessonType);

  const lessonTypeIcon = (type) => {
    const t = LESSON_TYPES.find((x) => x.value === type);
    return t ? t.icon : '▶';
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <Link to="/courses" className="text-sky-600 hover:underline text-sm">← Back to Courses</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Manage Lessons — <span className="text-sky-600">{courseTitle || `Course #${courseId}`}</span>
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Add Lesson</h2>

          {/* Lesson type tabs */}
          <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl">
            {LESSON_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => { setLessonType(t.value); setError(''); setFile(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  lessonType === t.value
                    ? 'bg-white text-sky-700 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-4">{typeInfo.hint}</p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Lesson Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className={`grid gap-3 ${lessonType === 'video' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.order_index}
                  onChange={(e) => setForm({ ...form, order_index: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              {lessonType === 'video' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Type-specific content field */}
            {lessonType === 'text' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
                <textarea
                  required
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your lesson content here…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono leading-relaxed resize-y"
                />
              </div>
            )}

            {lessonType === 'video' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Video File</label>
                <input
                  id="lesson-file-input"
                  type="file"
                  accept="video/*"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500"
                />
              </div>
            )}

            {lessonType === 'image' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Image File</label>
                <input
                  id="lesson-file-input"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500"
                />
              </div>
            )}

            {lessonType === 'resource' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Resource File (PDF)</label>
                <input
                  id="lesson-file-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500"
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-sky-600 text-white py-2.5 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-50 text-sm"
            >
              {uploading ? 'Uploading…' : `Add ${typeInfo.label} Lesson`}
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
              {[...lessons].sort((a, b) => a.order_index - b.order_index).map((l) => {
                const typeLabel = LESSON_TYPES.find((t) => t.value === l.lesson_type) || LESSON_TYPES[0];
                return (
                  <div key={l.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0">{lessonTypeIcon(l.lesson_type)}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {l.order_index + 1}. {l.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            l.lesson_type === 'video'    ? 'bg-blue-50 text-blue-600' :
                            l.lesson_type === 'text'     ? 'bg-green-50 text-green-600' :
                            l.lesson_type === 'image'    ? 'bg-purple-50 text-purple-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {typeLabel.label}
                          </span>
                          {l.lesson_type === 'video' && l.duration > 0 && (
                            <span className="text-xs text-gray-400">{Math.floor(l.duration / 60)}m {l.duration % 60}s</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteLesson(l.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium flex-shrink-0 ml-3"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
