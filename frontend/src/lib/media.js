// Resolves a stored media path to a usable URL.
// Absolute URLs (e.g. external images) are returned as-is.
// Relative paths like "uploads/thumbnails/file.jpg" become "/uploads/thumbnails/file.jpg".
// In dev the Vite proxy forwards /uploads → localhost:3001.
// In production Express serves /uploads directly.
export function mediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `/${path}`;
}
