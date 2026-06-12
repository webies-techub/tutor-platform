// Resolves a stored media path to a usable URL.
// Absolute URLs (e.g. Unsplash stock photos in seed data) are returned as-is;
// local upload paths are served from the backend.
export function mediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `http://localhost:3001/${path}`;
}
