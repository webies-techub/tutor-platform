const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
