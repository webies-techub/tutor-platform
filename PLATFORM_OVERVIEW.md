# LearnHub — Platform Feature Overview

> **Version:** 1.0 (Pre-Launch)  
> **Stack:** React 19 · Node.js / Express · MySQL · Stripe (Test Mode)

---

## 1. User Roles

The platform supports three distinct user roles, each with a dedicated experience:

| Role | Description |
|---|---|
| **Student** | Browses and purchases courses, books 1-on-1 tutors, joins group sessions |
| **Tutor** | Applies to teach, manages courses and lessons, confirms bookings, hosts group classes |
| **Admin** | Full oversight — approves tutors & courses, features content, manages users & payments |

---

## 2. Authentication & Account Security

- **Email + Password** registration with **OTP email verification** — users receive a 6-digit code to confirm their account before they can log in.
- **JWT-based sessions** with short-lived access tokens (15 min) and long-lived refresh tokens (7 days) stored securely.
- Accounts can be deactivated by admin at any time.
- Role-based access control — each route and page is protected by the user's role.

### Email received at registration:
> *"Welcome to LearnHub — please verify your email with the code below…"*

---

## 3. Course System

### For Students
- Browse the **Courses** page with search and subject filters.
- Up to 6 courses are highlighted in the **Featured Courses** section on the homepage.
- Each course page shows the full lesson list, tutor profile, subject, price, and description.
- Students click **Enrol Now** → proceed to checkout → gain immediate access after payment.

### Lesson Types (mixed per course)
| Type | Description |
|---|---|
| **YouTube Video** | Admin/tutor pastes a YouTube link — plays as a full embedded player |
| **Uploaded Video** | MP4 / MOV file uploaded directly (up to 500 MB) |
| **Text / Reading** | Formatted written content, notes, code snippets |
| **Image** | JPG / PNG lesson displayed inline |
| **Resource / PDF** | Downloadable PDF with inline preview |

### Progress Tracking
- Students mark each lesson **Complete** as they go.
- The sidebar shows their progress through the course in real time.
- Completed lessons are ticked ✓; the current lesson is highlighted.

---

## 4. Payment & Checkout

> **⚠ Current Status:** Stripe is configured in **test/sandbox mode**. No real money is charged. This will be switched to the live Stripe account before production launch.

### Stripe Integration
The platform uses **Stripe Elements** — Stripe's own secure, PCI-compliant card form embeds directly into the checkout pages. Card data never touches our servers.

**Test card (sandbox only):** `4242 4242 4242 4242` · Any future expiry · Any CVC

### Three Checkout Flows

**① Course Purchase**
1. Student clicks *Enrol Now* on a course page.
2. Stripe card form appears with the course price.
3. On successful payment → **Enrollment is created** → student gets access to all lessons immediately.
4. Student receives a **confirmation email**: *"You're enrolled in [Course Title]…"*

**② 1-on-1 Tutor Booking**
1. Student visits a tutor's profile and selects a date/time and subject.
2. Booking is created → student is redirected to the **Booking Checkout** page.
3. Stripe payment for the tutor's hourly rate is processed.
4. Both student and tutor receive an **email notification** of the new booking.
5. Tutor **confirms the booking** from their dashboard (two-step confirm → sets meeting link).
6. Student sees status update to **Confirmed** in *My Bookings*.

**③ Group Session Registration**
1. Student browses **Group Classes**, clicks *Reserve seat*.
2. For **paid sessions** → Stripe checkout collects payment.
3. For **free sessions** → single-click confirmation (no payment).
4. On success → student receives a **group registration email** with session details.
5. Session appears in *My Group Classes* with the join link when available.

---

## 5. Email Notifications

The following emails are sent automatically via SMTP:

| Trigger | Recipient | Email Content |
|---|---|---|
| New registration | Student / Tutor | OTP verification code |
| Course enrollment | Student | Enrollment confirmation + course details |
| Tutor application submitted | Admin | New application alert |
| Tutor application approved | Tutor | Approval notification |
| New 1-on-1 booking | Tutor | Booking request details |
| Booking confirmed | Student | Confirmation + meeting info |
| Group session registration | Student | Registration confirmation + session details |

---

## 6. Tutor Experience

### Applying to Teach
1. A logged-in user visits their **Tutor Dashboard** and fills in the application form (headline, bio, subjects, qualifications, hourly rate).
2. The application goes to **Admin for approval**.
3. Once approved, the tutor's profile is visible in the **Tutor Directory**.

### Managing Courses & Lessons
- Tutors create courses (title, subject, description, price, thumbnail).
- Courses require **Admin approval** before going live.
- Once approved, tutors manage lessons via the **Manage Lessons** page:
  - Add YouTube links, upload videos, write text lessons, upload images or PDFs.
  - Edit or delete any lesson inline.

### Bookings
- All incoming 1-on-1 booking requests appear in the **Bookings** tab.
- Tutors confirm bookings and optionally add a **meeting link** (Zoom, Google Meet, etc.).

### Group Sessions
- Tutors create group sessions (title, subject, date/time, capacity, price).
- Registered students appear in the session roster.

### Real-Time Chat
- Every student–tutor pair has a **chat widget** (bottom-right corner of the screen) for direct messaging — coordinating session details, sharing notes, or answering questions.

---

## 7. Student Experience

| Feature | Location |
|---|---|
| Browse & search courses | /courses |
| Browse & filter group classes | /group-classes |
| Browse tutor profiles | /tutors |
| Enrol in a course | Course detail page → Checkout |
| Watch lessons & track progress | /student/watch/:lessonId |
| View enrolled courses | /student/my-courses |
| View & manage bookings | /student/my-bookings |
| View group class registrations | /student/my-sessions |
| Chat with tutor | Chat widget (any page) |

---

## 8. Admin Panel

The admin panel is fully embedded in the main application at `/admin/*` (no separate app or port needed). Accessible only to admin-role accounts.

| Section | Capabilities |
|---|---|
| **Dashboard** | Live stats — total users, courses, bookings, group sessions, revenue |
| **Courses** | Approve / reject courses, feature / unfeature on homepage, manage lessons |
| **Lessons** | Add YouTube / video / text / image / PDF lessons; edit or delete any lesson |
| **Users** | View all users, activate / deactivate accounts |
| **Tutors** | Review applications, approve / reject tutors |
| **Bookings** | View all 1-on-1 bookings across the platform |
| **Group Sessions** | View all sessions, registrations, and status |
| **Payments** | Full payment history with amounts, status, and type |

---

## 9. Technology Notes

| Area | Detail |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Node.js / Express 5 + Sequelize ORM |
| Database | MySQL (hosted on Hostinger) |
| File Storage | Local server (videos, images, PDFs) — can be migrated to S3 |
| Email | SMTP via Hostinger mail server |
| Payments | **Stripe (test mode)** — to be switched to live keys before launch |
| Authentication | JWT access + refresh tokens, OTP email verification |

---

## 10. Pre-Launch Checklist (for reference)

- [ ] Replace Stripe **test keys** with live keys in environment variables
- [ ] Review and update all email sender details (from name, reply-to)
- [ ] Set `FRONTEND_URL` and `ADMIN_URL` to production domain
- [ ] Configure file storage (local → cloud if expected volume is high)
- [ ] SSL certificate on production server
- [ ] Seed or migrate any required initial data (subjects, featured tutors)
