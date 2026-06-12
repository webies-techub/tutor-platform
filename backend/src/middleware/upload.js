const multer = require('multer');
const path = require('path');

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

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) return cb(null, true);
  cb(new Error('Only video files are allowed'), false);
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) return cb(null, true);
  cb(new Error('Only image files are allowed'), false);
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
