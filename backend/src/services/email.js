const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';
const BRAND = 'TheEduSpire';
const PRIMARY = '#16233f';
const PRIMARY_DARK = '#101a30';
const INK = '#0f172a';
const MUTED = '#64748b';
const BORDER = '#e2e8f0';
const BG = '#f1f5f9';

/**
 * Master responsive email layout (table-based for client compatibility).
 * `preheader` is the hidden inbox-preview line.
 */
function layout({ title, preheader, bodyHtml, ctaText, ctaUrl }) {
  const button = ctaText && ctaUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0 8px;">
         <tr><td align="center" bgcolor="${PRIMARY}" style="border-radius:12px;">
           <a href="${ctaUrl}" target="_blank"
              style="display:inline-block;padding:14px 32px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;background:${PRIMARY};">
             ${ctaText}
           </a>
         </td></tr>
       </table>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${BG};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader || ''}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${BORDER};border-radius:18px;overflow:hidden;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${PRIMARY} 0%,#0284c7 100%);padding:28px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                    📘 ${BRAND}
                  </td>
                  <td align="right" style="font-size:12px;color:#dbeafe;font-weight:500;">
                    Learn. Grow. Succeed.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 36px 32px;color:${INK};">
              ${bodyHtml}
              ${button}
            </td>
          </tr>
          <!-- Divider -->
          <tr><td style="padding:0 36px;"><div style="height:1px;background:${BORDER};"></div></td></tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 36px 32px;">
              <p style="margin:0 0 6px;font-size:13px;color:${MUTED};line-height:1.6;">
                You're receiving this email because you have an account on ${BRAND}.
              </p>
              <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.6;">
                <a href="${FRONTEND}" style="color:${PRIMARY};text-decoration:none;font-weight:600;">Visit ${BRAND}</a>
                &nbsp;·&nbsp; Need help? Just reply to this email.
              </p>
              <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} ${BRAND}. Online tutoring & courses.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:11px;color:#94a3b8;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
          ${BRAND} · Recorded courses · 1-to-1 tutoring · Live group classes
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function heading(text) {
  return `<h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:${INK};letter-spacing:-0.4px;">${text}</h1>`;
}
function para(text) {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">${text}</p>`;
}
function detailTable(rows) {
  const trs = rows
    .map(
      ([k, v]) => `<tr>
        <td style="padding:10px 16px;font-size:13px;color:${MUTED};font-weight:600;width:130px;border-bottom:1px solid ${BORDER};">${k}</td>
        <td style="padding:10px 16px;font-size:14px;color:${INK};font-weight:500;border-bottom:1px solid ${BORDER};">${v}</td>
      </tr>`
    )
    .join('');
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid ${BORDER};border-radius:12px;overflow:hidden;margin:8px 0 4px;">${trs}</table>`;
}
function fmtDate(d) {
  return new Date(d).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' });
}

const sendEmail = (to, subject, html) =>
  transporter.sendMail({ from: `"${BRAND}" <${process.env.SMTP_FROM}>`, to, subject, html });

/* ----------------------------- Templates ----------------------------- */

const sendWelcomeEmail = (user) => {
  const isStudent = user.role === 'student';
  const body =
    heading(`Welcome to ${BRAND}, ${user.name.split(' ')[0]}! 🎉`) +
    para(isStudent
      ? 'Your account is ready. Explore on-demand courses, book private 1-to-1 sessions, and join live group classes — all in one place.'
      : 'Thanks for joining as a tutor. Your application is being reviewed by our team, and we\'ll email you the moment you\'re approved to start teaching.');
  return sendEmail(
    user.email,
    `Welcome to ${BRAND}, ${user.name.split(' ')[0]}!`,
    layout({
      title: 'Welcome',
      preheader: `Your ${BRAND} account is ready.`,
      bodyHtml: body,
      ctaText: isStudent ? 'Start learning' : 'Go to your dashboard',
      ctaUrl: isStudent ? `${FRONTEND}/courses` : `${FRONTEND}/login`,
    })
  );
};

const sendTutorApplicationEmails = async (tutor) => {
  await sendEmail(
    tutor.email,
    'We received your tutor application',
    layout({
      title: 'Application received',
      preheader: 'Our team is reviewing your tutor application.',
      bodyHtml:
        heading('Application received ✅') +
        para(`Hi ${tutor.name.split(' ')[0]}, thank you for applying to teach on ${BRAND}.`) +
        para('Our team reviews every application carefully to keep quality high for students. We\'ll be in touch within <strong>2 business days</strong>.'),
      ctaText: 'View your dashboard',
      ctaUrl: `${FRONTEND}/tutor/overview`,
    })
  );

  await sendEmail(
    process.env.ADMIN_EMAIL,
    `New tutor application — ${tutor.name}`,
    layout({
      title: 'New tutor application',
      preheader: `${tutor.name} has applied to teach.`,
      bodyHtml:
        heading('New tutor application') +
        para('A new tutor is awaiting review:') +
        detailTable([
          ['Name', tutor.name],
          ['Email', tutor.email],
          ['Subjects', tutor.subjects || 'Not specified'],
        ]),
      ctaText: 'Review in admin panel',
      ctaUrl: `${process.env.ADMIN_URL}/tutors`,
    })
  );
};

const sendTutorApprovedEmail = (tutor) =>
  sendEmail(
    tutor.email,
    `You're approved to teach on ${BRAND}! 🎓`,
    layout({
      title: "You're approved",
      preheader: 'Your tutor profile is now live.',
      bodyHtml:
        heading("You're live on " + BRAND + '! 🎓') +
        para(`Congratulations ${tutor.name.split(' ')[0]} — your tutor profile has been approved.`) +
        para('You can now create recorded courses, accept 1-to-1 bookings, and host live group classes. Students can find you in our tutor directory right away.'),
      ctaText: 'Go to your dashboard',
      ctaUrl: `${FRONTEND}/tutor/overview`,
    })
  );

const sendEnrollmentEmail = (student, course, amount) =>
  sendEmail(
    student.email,
    `You're enrolled in ${course.title}`,
    layout({
      title: 'Enrolment confirmed',
      preheader: `You now have lifetime access to ${course.title}.`,
      bodyHtml:
        heading('Enrolment confirmed 🎉') +
        para(`Hi ${student.name.split(' ')[0]}, your purchase was successful and you now have <strong>lifetime access</strong> to this course.`) +
        detailTable([
          ['Course', course.title],
          ['Subject', course.subject],
          ['Amount paid', `$${Number(amount).toFixed(2)} AUD`],
        ]),
      ctaText: 'Start learning',
      ctaUrl: `${FRONTEND}/student/my-courses`,
    })
  );

const sendBookingConfirmedEmail = (student, tutor, booking) =>
  sendEmail(
    student.email,
    `Your session with ${tutor.name} is confirmed`,
    layout({
      title: 'Session confirmed',
      preheader: `Your 1-to-1 session is booked for ${fmtDate(booking.datetime)}.`,
      bodyHtml:
        heading('Your session is confirmed ✅') +
        para(`Hi ${student.name.split(' ')[0]}, great news — ${tutor.name} has confirmed your private session.`) +
        detailTable([
          ['Subject', booking.subject],
          ['Date & time', fmtDate(booking.datetime)],
          ['Tutor', tutor.name],
          ['Format', '1-to-1 video session'],
        ]) +
        para('Use the button below to join at the scheduled time. We recommend joining a couple of minutes early.'),
      ctaText: 'Join your session',
      ctaUrl: booking.meeting_link,
    })
  );

const sendNewBookingRequestEmail = (tutor, student, booking) =>
  sendEmail(
    tutor.email,
    `New booking request from ${student.name}`,
    layout({
      title: 'New booking request',
      preheader: `${student.name} requested a 1-to-1 session.`,
      bodyHtml:
        heading('New booking request 📅') +
        para(`Hi ${tutor.name.split(' ')[0]}, you have a new private session request.`) +
        detailTable([
          ['Student', student.name],
          ['Subject', booking.subject],
          ['Requested time', fmtDate(booking.datetime)],
        ]) +
        para('Please review and confirm so the student receives their meeting link.'),
      ctaText: 'Review & confirm',
      ctaUrl: `${FRONTEND}/tutor/bookings`,
    })
  );

const sendGroupRegistrationEmail = (student, session) =>
  sendEmail(
    student.email,
    `You're registered: ${session.title}`,
    layout({
      title: 'Group class registration',
      preheader: `Your seat in ${session.title} is reserved.`,
      bodyHtml:
        heading("You're registered! 👥") +
        para(`Hi ${student.name.split(' ')[0]}, your seat in this live group class is reserved.`) +
        detailTable([
          ['Class', session.title],
          ['Subject', session.subject],
          ['Date & time', fmtDate(session.datetime)],
          ['Duration', `${session.duration_min} minutes`],
          ['Format', 'Live group class'],
        ]) +
        para('Save the link below — you\'ll use it to join the live class with your tutor and classmates.'),
      ctaText: 'Join the class',
      ctaUrl: session.meeting_link,
    })
  );

const sendOtpEmail = (user, otp) =>
  sendEmail(
    user.email,
    `Your ${BRAND} verification code: ${otp}`,
    layout({
      title: 'Verify your email',
      preheader: `Your verification code is ${otp}. It expires in 15 minutes.`,
      bodyHtml:
        heading('Verify your email address') +
        para(`Hi ${user.name.split(' ')[0]}, use the code below to verify your email address and activate your account.`) +
        `<div style="margin:24px 0;text-align:center;">
           <span style="display:inline-block;background:#f4f6fb;border:2px dashed ${PRIMARY};border-radius:16px;padding:20px 48px;font-size:40px;font-weight:800;letter-spacing:12px;color:${PRIMARY};font-family:'Courier New',monospace;">${otp}</span>
         </div>` +
        para(`This code expires in <strong>15 minutes</strong>. If you didn't create a ${BRAND} account, you can safely ignore this email.`),
    })
  );

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail,
  sendTutorApplicationEmails,
  sendTutorApprovedEmail,
  sendEnrollmentEmail,
  sendBookingConfirmedEmail,
  sendNewBookingRequestEmail,
  sendGroupRegistrationEmail,
};
