const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"LearnHub" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html,
  });
};

const sendWelcomeEmail = (user) => {
  const isStudent = user.role === 'student';
  const roleMsg = isStudent
    ? 'Start exploring courses and book your first session today.'
    : 'Your application is under review. We will notify you once approved.';

  const html = `
    <h2>Welcome to LearnHub, ${user.name}!</h2>
    <p>${roleMsg}</p>
    <p><a href="${process.env.FRONTEND_URL}/login" style="background:#4F46E5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Go to LearnHub</a></p>
    <hr/>
    <small>LearnHub — Online Learning Platform</small>
  `;
  return sendEmail(user.email, `Welcome to LearnHub, ${user.name}!`, html);
};

const sendTutorApplicationEmails = async (tutor) => {
  const applicantHtml = `
    <h2>Application Received</h2>
    <p>Hi ${tutor.name}, thanks for applying to teach on LearnHub.</p>
    <p>Our team will review your profile within 2 business days.</p>
    <hr/><small>LearnHub</small>
  `;
  await sendEmail(tutor.email, 'We received your tutor application', applicantHtml);

  const adminHtml = `
    <h2>New Tutor Application</h2>
    <p><strong>Name:</strong> ${tutor.name}</p>
    <p><strong>Email:</strong> ${tutor.email}</p>
    <p><strong>Subjects:</strong> ${tutor.subjects || 'Not specified'}</p>
    <p><a href="${process.env.ADMIN_URL}/tutors">Review in Admin Panel</a></p>
  `;
  await sendEmail(
    process.env.ADMIN_EMAIL,
    `New tutor application — ${tutor.name}`,
    adminHtml
  );
};

const sendTutorApprovedEmail = (tutor) => {
  const html = `
    <h2>You're live on LearnHub!</h2>
    <p>Hi ${tutor.name}, your tutor profile has been approved.</p>
    <p>You can now create courses and accept bookings.</p>
    <p><a href="${process.env.FRONTEND_URL}/tutor/overview" style="background:#4F46E5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Go to your dashboard</a></p>
    <hr/><small>LearnHub</small>
  `;
  return sendEmail(tutor.email, "You're live on LearnHub!", html);
};

const sendEnrollmentEmail = (student, course, amount) => {
  const html = `
    <h2>You're enrolled in ${course.title}!</h2>
    <p>Hi ${student.name}, your enrollment has been confirmed.</p>
    <p><strong>Course:</strong> ${course.title}</p>
    <p><strong>Amount paid:</strong> $${Number(amount).toFixed(2)}</p>
    <p><a href="${process.env.FRONTEND_URL}/student/my-courses" style="background:#4F46E5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Start Learning</a></p>
    <hr/><small>LearnHub</small>
  `;
  return sendEmail(student.email, `You're enrolled in ${course.title}`, html);
};

const sendBookingConfirmedEmail = (student, tutor, booking) => {
  const dt = new Date(booking.datetime).toLocaleString('en-AU', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const html = `
    <h2>Your session is confirmed!</h2>
    <p>Hi ${student.name}, your booking with ${tutor.name} has been confirmed.</p>
    <table>
      <tr><td><strong>Subject</strong></td><td>${booking.subject}</td></tr>
      <tr><td><strong>Date &amp; Time</strong></td><td>${dt}</td></tr>
      <tr><td><strong>Tutor</strong></td><td>${tutor.name}</td></tr>
      <tr><td><strong>Meeting Link</strong></td><td><a href="${booking.meeting_link}">${booking.meeting_link}</a></td></tr>
    </table>
    <p>Save this link — you will need it to join your session.</p>
    <hr/><small>LearnHub</small>
  `;
  return sendEmail(
    student.email,
    `Your session with ${tutor.name} is confirmed`,
    html
  );
};

const sendNewBookingRequestEmail = (tutor, student, booking) => {
  const dt = new Date(booking.datetime).toLocaleString('en-AU', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const html = `
    <h2>New Booking Request</h2>
    <p>Hi ${tutor.name}, you have a new booking request.</p>
    <table>
      <tr><td><strong>Student</strong></td><td>${student.name}</td></tr>
      <tr><td><strong>Subject</strong></td><td>${booking.subject}</td></tr>
      <tr><td><strong>Requested time</strong></td><td>${dt}</td></tr>
    </table>
    <p><a href="${process.env.FRONTEND_URL}/tutor/bookings" style="background:#4F46E5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Review &amp; Confirm</a></p>
    <p>You have 24 hours to confirm or it will expire.</p>
    <hr/><small>LearnHub</small>
  `;
  return sendEmail(tutor.email, `New booking request from ${student.name}`, html);
};

module.exports = {
  sendWelcomeEmail,
  sendTutorApplicationEmails,
  sendTutorApprovedEmail,
  sendEnrollmentEmail,
  sendBookingConfirmedEmail,
  sendNewBookingRequestEmail,
};
