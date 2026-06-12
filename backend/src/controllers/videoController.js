const fs = require('fs');
const path = require('path');
const { Lesson, Enrollment } = require('../models');

exports.streamVideo = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const enrollment = await Enrollment.findOne({
      where: { student_id: req.user.id, course_id: lesson.course_id },
    });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' });

    if (!lesson.video_path) {
      return res.status(404).json({ message: 'No video for this lesson' });
    }

    const videoPath = path.resolve(lesson.video_path);
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found on disk' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(videoPath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
