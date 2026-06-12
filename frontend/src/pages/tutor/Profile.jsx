import { useEffect, useState } from 'react';
import { mediaUrl } from '../../lib/media';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

export default function TutorProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ headline: '', bio: '', subjects: '', qualifications: '', experience_years: '', hourly_rate: '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tutors/profile')
      .then(({ data }) => {
        setProfile(data);
        setForm({
          headline: data.headline || '', bio: data.bio || '', subjects: data.subjects || '',
          qualifications: data.qualifications || '', experience_years: data.experience_years || '',
          hourly_rate: data.hourly_rate || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    const fd = new FormData();
    fd.append('headline', form.headline);
    fd.append('bio', form.bio);
    fd.append('subjects', form.subjects);
    fd.append('qualifications', form.qualifications);
    fd.append('experience_years', form.experience_years || 0);
    fd.append('hourly_rate', form.hourly_rate);
    if (avatar) fd.append('avatar', avatar);
    try {
      const { data } = await api.put('/tutors/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(data);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Profile">
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const avatarSrc = preview || (profile?.avatar_path ? mediaUrl(profile.avatar_path) : null);

  return (
    <DashboardLayout title="My Profile" subtitle="This is how students see you in the directory.">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card p-8 sm:p-10 space-y-7">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="w-20 h-20 rounded-3xl object-cover ring-4 ring-blue-100" />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-2xl font-display font-bold">
                ?
              </div>
            )}
            <div>
              <label className="btn-secondary !px-4 !py-2 text-sm cursor-pointer">
                Change photo
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
              <p className="text-xs text-slate-400 mt-2">JPG or PNG, up to 5 MB</p>
            </div>
          </div>

          <div>
            <label className="field-label">Professional headline</label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              className="input-field"
              placeholder="e.g. PhD Physics · Exam Specialist"
            />
          </div>

          <div>
            <label className="field-label">Bio</label>
            <textarea
              rows={5}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="input-field resize-none"
              placeholder="Tell students about your experience and teaching style..."
            />
          </div>

          <div>
            <label className="field-label">Qualifications</label>
            <input
              type="text"
              value={form.qualifications}
              onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
              className="input-field"
              placeholder="e.g. PhD Physics (USyd), B.Sc (Hons)"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="field-label">Subjects</label>
              <input
                type="text"
                value={form.subjects}
                onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                className="input-field"
                placeholder="Math, Physics"
              />
              <p className="text-xs text-slate-400 mt-1.5">Separate with commas</p>
            </div>
            <div>
              <label className="field-label">Years of experience</label>
              <input
                type="number"
                min="0"
                value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                className="input-field"
                placeholder="8"
              />
            </div>
            <div>
              <label className="field-label">Hourly rate (AUD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.hourly_rate}
                  onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
                  className="input-field !pl-8"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-rose-600 text-sm font-medium bg-rose-50 rounded-xl px-4 py-3 ring-1 ring-rose-100">{error}</p>}
          {saved && (
            <p className="text-emerald-700 text-sm font-medium bg-emerald-50 rounded-xl px-4 py-3 ring-1 ring-emerald-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Profile saved successfully
            </p>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full text-base">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
