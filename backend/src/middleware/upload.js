const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const dirs = ['videos', 'thumbnails', 'resources'].map((d) =>
  path.join(__dirname, '../uploads', d)
);
dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));

const videoStorage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads/videos'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const imageStorage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads/thumbnails'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});

// Unified lesson-file storage: videos → uploads/videos, images/PDFs → uploads/resources
const lessonFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, path.join(__dirname, '../uploads/videos'));
    } else {
      cb(null, path.join(__dirname, '../uploads/resources'));
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) return cb(null, true);
  cb(new Error('Only video files are allowed'), false);
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) return cb(null, true);
  cb(new Error('Only image files are allowed'), false);
};

const lessonFileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('video/') ||
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf'
  ) {
    return cb(null, true);
  }
  cb(new Error('Only video, image, or PDF files are allowed'), false);
};

const maxVideoBytes = (parseInt(process.env.MAX_VIDEO_SIZE_MB, 10) || 500) * 1024 * 1024;

exports.uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: maxVideoBytes },
});

exports.uploadThumbnail = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

exports.uploadAvatar = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Used for all lesson types: video, image, resource (PDF)
exports.uploadLessonFile = multer({
  storage: lessonFileStorage,
  fileFilter: lessonFileFilter,
  limits: { fileSize: maxVideoBytes },
});
