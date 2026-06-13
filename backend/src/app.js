const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS — allow configured dev origins; in production (same-origin deployment)
// this is a no-op since browsers don't send CORS headers for same-origin requests.
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Thumbnails and avatars are public; videos are NOT served statically
app.use(
  '/uploads/thumbnails',
  express.static(path.join(__dirname, 'uploads/thumbnails'))
);

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tutors', require('./routes/tutors'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/group-sessions', require('./routes/groupSessions'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));

// ── Serve React build (production) ───────────────────────────────────────────
// The frontend is built into frontend/dist at the repo root.
// __dirname here is backend/src, so ../../frontend/dist resolves correctly.
const FRONTEND_DIST = path.join(__dirname, '../../frontend/dist');
app.use(express.static(FRONTEND_DIST));

// SPA catch-all — any route not matched above returns index.html so that
// React Router handles client-side navigation.
app.use((req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
