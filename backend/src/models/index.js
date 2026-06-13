const User = require('./User');
const TutorProfile = require('./TutorProfile');
const Course = require('./Course');
const Lesson = require('./Lesson');
const Payment = require('./Payment');
const Enrollment = require('./Enrollment');
const Booking = require('./Booking');
const GroupSession = require('./GroupSession');
const GroupRegistration = require('./GroupRegistration');
const LessonProgress = require('./LessonProgress');
const Message = require('./Message');

// User <-> TutorProfile
User.hasOne(TutorProfile, { foreignKey: 'user_id', as: 'tutorProfile' });
TutorProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User (tutor) <-> Course
User.hasMany(Course, { foreignKey: 'tutor_id', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'tutor_id', as: 'tutor' });

// Course <-> Lesson
Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Payment <-> Enrollment
Payment.hasOne(Enrollment, { foreignKey: 'payment_id', as: 'enrollment' });
Enrollment.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

// Student <-> Enrollment
User.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Course <-> Enrollment
Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Booking associations (two User references)
Booking.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
Booking.belongsTo(User, { foreignKey: 'tutor_id', as: 'tutor' });
User.hasMany(Booking, { foreignKey: 'student_id', as: 'studentBookings' });
User.hasMany(Booking, { foreignKey: 'tutor_id', as: 'tutorBookings' });

// Student <-> Payment
User.hasMany(Payment, { foreignKey: 'student_id', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Course <-> Payment
Course.hasMany(Payment, { foreignKey: 'course_id', as: 'payments' });
Payment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// GroupSession <-> tutor
User.hasMany(GroupSession, { foreignKey: 'tutor_id', as: 'groupSessions' });
GroupSession.belongsTo(User, { foreignKey: 'tutor_id', as: 'tutor' });

// GroupSession <-> GroupRegistration
GroupSession.hasMany(GroupRegistration, { foreignKey: 'session_id', as: 'registrations' });
GroupRegistration.belongsTo(GroupSession, { foreignKey: 'session_id', as: 'session' });

// Student <-> GroupRegistration
User.hasMany(GroupRegistration, { foreignKey: 'student_id', as: 'groupRegistrations' });
GroupRegistration.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Payment <-> GroupSession (for session payments)
GroupSession.hasMany(Payment, { foreignKey: 'session_id', as: 'payments' });
Payment.belongsTo(GroupSession, { foreignKey: 'session_id', as: 'session' });

// Booking <-> Payment (1-on-1 session payment)
Booking.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

// Student <-> LessonProgress
User.hasMany(LessonProgress, { foreignKey: 'student_id', as: 'lessonProgress' });
LessonProgress.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Lesson <-> LessonProgress
Lesson.hasMany(LessonProgress, { foreignKey: 'lesson_id', as: 'progress' });
LessonProgress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

// Booking <-> Message
Booking.hasMany(Message, { foreignKey: 'booking_id', as: 'messages' });
Message.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

// User <-> Message
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

module.exports = {
  User,
  TutorProfile,
  Course,
  Lesson,
  Payment,
  Enrollment,
  Booking,
  GroupSession,
  GroupRegistration,
  LessonProgress,
  Message,
};
