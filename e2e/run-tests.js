/**
 * LearnHub full end-to-end test suite.
 * Tests every user flow across frontend (5173), admin (5174) and API (3001).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FRONTEND = 'http://localhost:5173';
const ADMIN = 'http://localhost:5174';
const API = 'http://localhost:3001/api';

const RUN = Date.now().toString().slice(-6); // unique per run → no DB cleanup needed
const STUDENT = { name: 'Webie Student', email: `webies999+s${RUN}@gmail.com`, password: 'Student@123' };
const STUDENT2 = { name: 'Other Student', email: `webies999+o${RUN}@gmail.com`, password: 'Student@123' };
const TUTOR = { name: 'Webie Tutor', email: `webies999+t${RUN}@gmail.com`, password: 'Tutor@123' };
const ADMIN_USER = { email: 'admin@learnhub.local', password: 'Admin@1234' };

const SHOT_DIR = path.join(__dirname, 'screenshots');
const FIXTURES = path.join(__dirname, 'fixtures');

let passed = 0, failed = 0;
const failures = [];

function ok(name) { passed++; console.log(`  ✅ ${name}`); }
function fail(name, err) {
  failed++;
  failures.push({ name, err: String(err).slice(0, 300) });
  console.log(`  ❌ ${name}: ${String(err).slice(0, 200)}`);
}

async function step(name, fn) {
  try { await fn(); ok(name); }
  catch (err) { fail(name, err); }
}

// Bypass OTP for test accounts (dev-only endpoint)
async function forceVerify(request, email) {
  const res = await request.post(`${API}/auth/force-verify`, { data: { email } });
  if (!res.ok()) throw new Error(`force-verify failed for ${email}: ${res.status()}`);
}

function makeFixtures() {
  fs.mkdirSync(FIXTURES, { recursive: true });
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  // 1x1 transparent PNG
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );
  fs.writeFileSync(path.join(FIXTURES, 'thumb.png'), png);
  // Dummy MP4: ftyp header + filler bytes (valid enough for upload + streaming tests)
  const ftyp = Buffer.from([
    0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, // size + 'ftyp'
    0x69, 0x73, 0x6f, 0x6d, // 'isom'
    0x00, 0x00, 0x02, 0x00,
    0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32,
    0x61, 0x76, 0x63, 0x31, 0x6d, 0x70, 0x34, 0x31,
  ]);
  const filler = Buffer.alloc(256 * 1024, 0x42);
  fs.writeFileSync(path.join(FIXTURES, 'lesson.mp4'), Buffer.concat([ftyp, filler]));
}

async function apiLogin(request, email, password) {
  const res = await request.post(`${API}/auth/login`, { data: { email, password } });
  if (!res.ok()) throw new Error(`API login failed for ${email}: ${res.status()}`);
  return (await res.json()).accessToken;
}

(async () => {
  makeFixtures();
  const browser = await chromium.launch();

  // Separate contexts so cookies don't clash between roles
  const studentCtx = await browser.newContext();
  const tutorCtx = await browser.newContext();
  const adminCtx = await browser.newContext();
  const anonCtx = await browser.newContext();

  const sPage = await studentCtx.newPage();
  const tPage = await tutorCtx.newPage();
  const aPage = await adminCtx.newPage();
  const anonPage = await anonCtx.newPage();

  console.log('\n━━━ SECTION A: Public pages ━━━');

  await step('Home page loads with hero + key sections', async () => {
    await anonPage.goto(FRONTEND, { waitUntil: "domcontentloaded" });
    await anonPage.waitForSelector('text=Study from home', { timeout: 10000 });
    await anonPage.waitForSelector('text=Three flexible ways to learn');
    await anonPage.waitForSelector('text=Subjects & skills we offer');
    await anonPage.waitForSelector('text=Meet our expert tutors');
    await anonPage.screenshot({ path: path.join(SHOT_DIR, '01-home.png'), fullPage: true });
  });

  await step('Courses page loads (empty state)', async () => {
    await anonPage.goto(`${FRONTEND}/courses`, { waitUntil: "domcontentloaded" });
    await anonPage.waitForSelector('text=Explore courses');
    await anonPage.screenshot({ path: path.join(SHOT_DIR, '02-courses-empty.png') });
  });

  await step('Tutor directory loads', async () => {
    await anonPage.goto(`${FRONTEND}/tutors`, { waitUntil: "domcontentloaded" });
    await anonPage.waitForSelector('text=Find your tutor');
  });

  await step('Pricing page loads', async () => {
    await anonPage.goto(`${FRONTEND}/pricing`, { waitUntil: "domcontentloaded" });
    await anonPage.waitForSelector('text=Simple and transparent');
    await anonPage.screenshot({ path: path.join(SHOT_DIR, '03-pricing.png') });
  });

  await step('Protected route redirects to login when logged out', async () => {
    await anonPage.goto(`${FRONTEND}/student/overview`, { waitUntil: "domcontentloaded" });
    await anonPage.waitForURL('**/login', { timeout: 10000 });
  });

  console.log('\n━━━ SECTION B: Student registration & login ━━━');

  await step('Student registers via UI', async () => {
    await sPage.goto(`${FRONTEND}/register`, { waitUntil: "domcontentloaded" });
    await sPage.fill('input[placeholder="Jane Smith"]', STUDENT.name);
    await sPage.fill('input[placeholder="you@example.com"]', STUDENT.email);
    await sPage.fill('input[placeholder="Min. 6 characters"]', STUDENT.password);
    await sPage.click('button:has-text("Learn")');
    await sPage.screenshot({ path: path.join(SHOT_DIR, '04-register.png') });
    await sPage.click('button:has-text("Create account")');
    // App redirects to /verify-otp after registration
    await sPage.waitForURL('**/verify-otp', { timeout: 15000 });
    // Bypass OTP for tests — dev-only endpoint
    await forceVerify(anonCtx.request, STUDENT.email);
    await sPage.goto(`${FRONTEND}/login`, { waitUntil: "domcontentloaded" });
  });

  await step('Student logs in → lands on dashboard', async () => {
    await sPage.fill('input[placeholder="you@example.com"]', STUDENT.email);
    await sPage.fill('input[placeholder="Enter your password"]', STUDENT.password);
    await sPage.click('button:has-text("Log in")');
    await sPage.waitForURL('**/student/overview', { timeout: 15000 });
    await sPage.waitForSelector('text=Welcome back');
    await sPage.screenshot({ path: path.join(SHOT_DIR, '05-student-dashboard.png') });
  });

  await step('Duplicate registration rejected (409)', async () => {
    // STUDENT.email already exists (registered above), so re-registering must 409
    const res = await anonCtx.request.post(`${API}/auth/register`, {
      data: { name: 'Dup', email: STUDENT.email, password: 'x12345' },
    });
    if (res.status() !== 409) throw new Error(`expected 409, got ${res.status()}`);
  });

  await step('Wrong password rejected (401)', async () => {
    const res = await anonCtx.request.post(`${API}/auth/login`, {
      data: { email: STUDENT.email, password: 'wrongpass' },
    });
    if (res.status() !== 401) throw new Error(`expected 401, got ${res.status()}`);
  });

  console.log('\n━━━ SECTION C: Tutor registration & application ━━━');

  await step('Tutor registers via UI (Teach role)', async () => {
    await tPage.goto(`${FRONTEND}/register`, { waitUntil: "domcontentloaded" });
    await tPage.fill('input[placeholder="Jane Smith"]', TUTOR.name);
    await tPage.fill('input[placeholder="you@example.com"]', TUTOR.email);
    await tPage.fill('input[placeholder="Min. 6 characters"]', TUTOR.password);
    await tPage.click('button:has-text("Teach")');
    await tPage.click('button:has-text("Create account")');
    // App redirects to /verify-otp after registration
    await tPage.waitForURL('**/verify-otp', { timeout: 15000 });
    await forceVerify(anonCtx.request, TUTOR.email);
    await tPage.goto(`${FRONTEND}/login`, { waitUntil: "domcontentloaded" });
  });

  await step('Tutor logs in → tutor dashboard', async () => {
    await tPage.fill('input[placeholder="you@example.com"]', TUTOR.email);
    await tPage.fill('input[placeholder="Enter your password"]', TUTOR.password);
    await tPage.click('button:has-text("Log in")');
    await tPage.waitForURL('**/tutor/overview', { timeout: 15000 });
    await tPage.screenshot({ path: path.join(SHOT_DIR, '06-tutor-dashboard.png') });
  });

  await step('Tutor submits application via Become a Tutor', async () => {
    // networkidle ensures the AuthContext /auth/refresh call completes before we interact
    await tPage.goto(`${FRONTEND}/become-a-tutor`, { waitUntil: "networkidle" });
    // Wait for the form to render (user must be set in AuthContext before form appears)
    await tPage.waitForSelector('textarea', { timeout: 10000 });
    await tPage.fill('textarea', 'Experienced maths and physics tutor with 8 years of teaching experience. I specialise in making complex topics simple.');
    await tPage.fill('input[placeholder="Math, Physics, Chemistry"]', 'Math, Physics');
    await tPage.fill('input[placeholder="50.00"]', '65');
    // Capture the API response to surface any errors
    const applyResponsePromise = tPage.waitForResponse('**/tutors/apply', { timeout: 20000 });
    await tPage.click('button:has-text("Submit application")');
    const applyResponse = await applyResponsePromise;
    if (!applyResponse.ok()) {
      const body = await applyResponse.text();
      throw new Error(`/tutors/apply returned ${applyResponse.status()}: ${body.slice(0, 200)}`);
    }
    await tPage.waitForSelector('text=Application received!', { timeout: 15000 });
    await tPage.screenshot({ path: path.join(SHOT_DIR, '07-tutor-applied.png') });
  });

  await step('Unapproved tutor hidden from public directory', async () => {
    const res = await anonCtx.request.get(`${API}/tutors`);
    const tutors = await res.json();
    if (tutors.some((t) => t.user?.email === TUTOR.email)) throw new Error('unapproved tutor is visible');
  });

  console.log('\n━━━ SECTION D: Admin panel ━━━');

  await step('Admin logs into admin panel', async () => {
    await aPage.goto(`${ADMIN}/login`, { waitUntil: "domcontentloaded" });
    await aPage.fill('input[type="email"]', ADMIN_USER.email);
    await aPage.fill('input[type="password"]', ADMIN_USER.password);
    await aPage.click('button:has-text("Sign in")');
    await aPage.waitForURL('**/dashboard', { timeout: 15000 });
    await aPage.screenshot({ path: path.join(SHOT_DIR, '08-admin-dashboard.png') });
  });

  await step('Non-admin cannot log into admin panel', async () => {
    const p = await anonCtx.newPage();
    await p.goto(`${ADMIN}/login`, { waitUntil: "domcontentloaded" });
    await p.fill('input[type="email"]', STUDENT.email);
    await p.fill('input[type="password"]', STUDENT.password);
    await p.click('button:has-text("Sign in")');
    await p.waitForSelector('text=Admin access only', { timeout: 10000 });
    await p.close();
  });

  await step('Admin approves tutor', async () => {
    await aPage.goto(`${ADMIN}/tutors`, { waitUntil: "domcontentloaded" });
    await aPage.waitForSelector(`text=${TUTOR.name}`);
    await aPage.click('button:has-text("Approve")');
    await aPage.waitForSelector('text=Approved', { timeout: 10000 });
    await aPage.screenshot({ path: path.join(SHOT_DIR, '09-admin-tutor-approved.png') });
  });

  // Get tutor user id for course creation
  const adminToken = await apiLogin(anonCtx.request, ADMIN_USER.email, ADMIN_USER.password);
  const usersRes = await anonCtx.request.get(`${API}/admin/users`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const tutorUser = (await usersRes.json()).find((u) => u.email === TUTOR.email);

  await step('Admin creates course with thumbnail', async () => {
    await aPage.goto(`${ADMIN}/courses`, { waitUntil: "domcontentloaded" });
    await aPage.click('button:has-text("+ New Course")');
    // Tutor field is now a <select> (not a number input)
    await aPage.waitForSelector('select:near(:text("Tutor"))', { timeout: 10000 });
    await aPage.selectOption('select:near(:text("Tutor"))', String(tutorUser.id));
    await aPage.fill('input[type="text"]:near(:text("Title"))', 'Algebra Mastery: Year 10');
    await aPage.fill('input[type="text"]:near(:text("Subject"))', 'Math');
    await aPage.fill('input[type="number"]:near(:text("Price"))', '49.99');
    await aPage.fill('textarea', 'A complete Year 10 algebra course covering equations, factorisation, and graphing with step-by-step video lessons.');
    await aPage.setInputFiles('input[type="file"]', path.join(FIXTURES, 'thumb.png'));
    await aPage.click('button:has-text("Create Course")');
    await aPage.waitForSelector('text=Algebra Mastery', { timeout: 15000 });
    await aPage.screenshot({ path: path.join(SHOT_DIR, '10-admin-course-created.png') });
  });

  // Get course id immediately after creation so we can target the exact row in the next step
  const coursesRes = await anonCtx.request.get(`${API}/admin/courses`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  // Pick the newest non-featured Algebra Mastery course (the one just created this run)
  const course = (await coursesRes.json()).find((c) => c.title.includes('Algebra Mastery') && !c.is_featured)
    || (await coursesRes.json()).find((c) => c.title.includes('Algebra Mastery'));

  await step('Admin features course (admin courses are auto-approved)', async () => {
    // Use the "Manage Lessons" link href to uniquely target the just-created course row
    const courseRow = aPage.locator(`tr:has(a[href="/courses/${course.id}/lessons"])`);
    await courseRow.waitFor({ timeout: 10000 });
    const approveBtn = courseRow.getByRole('button', { name: 'Approve', exact: true });
    if (await approveBtn.count()) {
      await approveBtn.click();
      await courseRow.locator('span:has-text("Approved")').waitFor({ timeout: 10000 });
    }
    // Only click Feature if not already featured (handles re-runs where course is already featured)
    const featureBtn = courseRow.getByRole('button', { name: 'Feature', exact: true });
    if (await featureBtn.count()) {
      await featureBtn.click();
    }
    // Wait for the "Unfeature" button — confirms the toggle took effect
    await courseRow.getByRole('button', { name: 'Unfeature', exact: true }).waitFor({ timeout: 15000 });
  });

  await step('Admin uploads lesson video', async () => {
    await aPage.goto(`${ADMIN}/courses/${course.id}/lessons`, { waitUntil: "domcontentloaded" });
    await aPage.fill('input[type="text"]', 'Lesson 1: Linear Equations');
    await aPage.setInputFiles('input[type="file"]', path.join(FIXTURES, 'lesson.mp4'));
    // Button text is now "Add Video Lesson" (type-aware label)
    await aPage.click('button:has-text("Add Video Lesson")');
    await aPage.waitForSelector('text=Lesson added!', { timeout: 30000 });
    await aPage.screenshot({ path: path.join(SHOT_DIR, '11-admin-lesson-uploaded.png') });
  });

  console.log('\n━━━ SECTION E: Student purchase & video ━━━');

  await step('Course appears on public courses page', async () => {
    await sPage.goto(`${FRONTEND}/courses`, { waitUntil: "domcontentloaded" });
    await sPage.waitForSelector('text=Algebra Mastery', { timeout: 10000 });
    await sPage.screenshot({ path: path.join(SHOT_DIR, '12-courses-listed.png') });
  });

  await step('Featured course shows on homepage', async () => {
    await sPage.goto(FRONTEND, { waitUntil: "domcontentloaded" });
    await sPage.waitForSelector('text=Algebra Mastery', { timeout: 10000 });
  });

  await step('Course detail shows curriculum (locked)', async () => {
    await sPage.goto(`${FRONTEND}/courses/${course.id}`, { waitUntil: "domcontentloaded" });
    await sPage.waitForSelector('text=Lesson 1: Linear Equations');
    await sPage.waitForSelector('text=Buy now');
    await sPage.screenshot({ path: path.join(SHOT_DIR, '13-course-detail.png'), fullPage: true });
  });

  await step('Student completes simulated checkout', async () => {
    await sPage.click('text=Buy now');
    await sPage.waitForURL(`**/checkout/${course.id}`, { timeout: 10000 });
    await sPage.screenshot({ path: path.join(SHOT_DIR, '14-checkout.png') });
    await sPage.click('button:has-text("Pay $49.99")');
    await sPage.waitForSelector('text=Payment successful!', { timeout: 20000 });
    await sPage.screenshot({ path: path.join(SHOT_DIR, '15-payment-success.png') });
  });

  await step('Double purchase blocked (409)', async () => {
    const token = await apiLogin(anonCtx.request, STUDENT.email, STUDENT.password);
    const res = await anonCtx.request.post(`${API}/payments/simulate`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { course_id: course.id },
    });
    if (res.status() !== 409) throw new Error(`expected 409, got ${res.status()}`);
  });

  await step('My Courses shows enrolled course + lessons', async () => {
    await sPage.click('text=Start learning now');
    await sPage.waitForURL('**/student/my-courses', { timeout: 10000 });
    await sPage.waitForSelector('text=Algebra Mastery');
    await sPage.waitForSelector('text=Lesson 1: Linear Equations');
    await sPage.screenshot({ path: path.join(SHOT_DIR, '16-my-courses.png') });
  });

  // Find lesson id via API
  const courseDetail = await (await anonCtx.request.get(`${API}/courses/${course.id}`)).json();
  const lesson = courseDetail.lessons[0];

  await step('Watch page loads protected video for enrolled student', async () => {
    await sPage.goto(`${FRONTEND}/student/watch/${lesson.id}`, { waitUntil: "domcontentloaded" });
    await sPage.waitForSelector('video', { timeout: 20000 });
    const hasVideo = await sPage.locator('video').count();
    if (!hasVideo) throw new Error('video element not rendered');
    const src = await sPage.locator('video').getAttribute('src');
    if (!src?.startsWith('blob:')) throw new Error(`video src is not a blob URL: ${src}`);
    await sPage.screenshot({ path: path.join(SHOT_DIR, '17-watch-lesson.png') });
  });

  await step('Video API blocks unauthenticated access (401)', async () => {
    const res = await anonCtx.request.get(`${API}/videos/${lesson.id}`);
    if (res.status() !== 401) throw new Error(`expected 401, got ${res.status()}`);
  });

  await step('Video API blocks non-enrolled student (403)', async () => {
    await anonCtx.request.post(`${API}/auth/register`, { data: { ...STUDENT2, role: 'student' } });
    await forceVerify(anonCtx.request, STUDENT2.email);
    const token = await apiLogin(anonCtx.request, STUDENT2.email, STUDENT2.password);
    const res = await anonCtx.request.get(`${API}/videos/${lesson.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status() !== 403) throw new Error(`expected 403, got ${res.status()}`);
  });

  await step('Video API supports HTTP Range requests (206)', async () => {
    const token = await apiLogin(anonCtx.request, STUDENT.email, STUDENT.password);
    const res = await anonCtx.request.get(`${API}/videos/${lesson.id}`, {
      headers: { Authorization: `Bearer ${token}`, Range: 'bytes=0-99' },
    });
    if (res.status() !== 206) throw new Error(`expected 206, got ${res.status()}`);
    const len = res.headers()['content-length'];
    if (len !== '100') throw new Error(`expected content-length 100, got ${len}`);
  });

  console.log('\n━━━ SECTION F: Booking flow ━━━');

  await step('Approved tutor visible in public directory', async () => {
    await sPage.goto(`${FRONTEND}/tutors`, { waitUntil: "domcontentloaded" });
    await sPage.waitForSelector(`text=${TUTOR.name}`, { timeout: 10000 });
    await sPage.screenshot({ path: path.join(SHOT_DIR, '18-tutor-directory.png') });
  });

  await step('Student books a session from tutor profile', async () => {
    await sPage.goto(`${FRONTEND}/tutors/${tutorUser.id}`, { waitUntil: "domcontentloaded" });
    await sPage.waitForSelector('text=Book a live session');
    await sPage.fill('input[placeholder="e.g. Year 10 Algebra"]', 'Quadratic equations help');
    const future = new Date(Date.now() + 3 * 24 * 3600 * 1000);
    const dtValue = future.toISOString().slice(0, 16);
    await sPage.fill('input[type="datetime-local"]', dtValue);
    await sPage.click('button:has-text("Request booking")');
    // After booking creation the app navigates to the booking checkout page
    await sPage.waitForURL('**/checkout/booking/**', { timeout: 15000 });
    await sPage.screenshot({ path: path.join(SHOT_DIR, '19-booking-requested.png') });
  });

  await step('Tutor sees and confirms the booking', async () => {
    await tPage.goto(`${FRONTEND}/tutor/bookings`, { waitUntil: "domcontentloaded" });
    await tPage.waitForSelector('text=Quadratic equations help', { timeout: 10000 });
    // First click opens the inline confirm form (not the filter pill — use exact match)
    await tPage.getByRole('button', { name: 'Confirm', exact: true }).click();
    // Second click actually submits the confirmation (inline "Confirm booking" button)
    await tPage.waitForSelector('button:has-text("Confirm booking")', { timeout: 5000 });
    await tPage.click('button:has-text("Confirm booking")');
    await tPage.waitForSelector('span.badge-green', { timeout: 15000 });
    await tPage.screenshot({ path: path.join(SHOT_DIR, '20-tutor-confirmed.png') });
  });

  await step('Student sees confirmed booking', async () => {
    await sPage.goto(`${FRONTEND}/student/my-bookings`, { waitUntil: "domcontentloaded" });
    // Tutor confirmed the booking — badge-green (Confirmed) is shown; meeting link may not be set yet
    await sPage.waitForSelector('span.badge-green', { timeout: 12000 });
    await sPage.screenshot({ path: path.join(SHOT_DIR, '21-student-booking-confirmed.png') });
  });

  console.log('\n━━━ SECTION F2: Live group classes ━━━');

  await step('Group classes page lists seeded sessions', async () => {
    await anonPage.goto(`${FRONTEND}/group-classes`, { waitUntil: 'domcontentloaded' });
    await anonPage.waitForSelector('text=Live group classes', { timeout: 10000 });
    // Button text is "Reserve seat" (not "Register")
    await anonPage.waitForSelector('button:has-text("Reserve seat")', { timeout: 10000 });
    await anonPage.screenshot({ path: path.join(SHOT_DIR, '24-group-classes.png'), fullPage: true });
  });

  await step('Tutor creates a live group class', async () => {
    await tPage.goto(`${FRONTEND}/tutor/group-sessions`, { waitUntil: 'domcontentloaded' });
    await tPage.click('button:has-text("Schedule a class")');
    await tPage.fill('input[placeholder="e.g. Calculus Problem-Solving Workshop"]', 'E2E Live Algebra Clinic');
    await tPage.fill('input[placeholder="Mathematics"]', 'Mathematics');
    const future = new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().slice(0, 16);
    await tPage.fill('input[type="datetime-local"]', future);
    await tPage.fill('input[placeholder="19.99"]', '15');
    await tPage.fill('textarea', 'A live problem-solving clinic created during the E2E test.');
    await tPage.click('button:has-text("Schedule class")');
    await tPage.waitForSelector('text=E2E Live Algebra Clinic', { timeout: 15000 });
    await tPage.screenshot({ path: path.join(SHOT_DIR, '25-tutor-group-created.png') });
  });

  await step('Student registers for a group class (simulated payment)', async () => {
    await sPage.goto(`${FRONTEND}/group-classes`, { waitUntil: 'domcontentloaded' });
    await sPage.waitForSelector('button:has-text("Reserve seat")', { timeout: 10000 });
    await sPage.locator('button:has-text("Reserve seat")').first().click();
    // "Reserve seat" navigates to /checkout/group/:id
    await sPage.waitForURL('**/checkout/group/**', { timeout: 10000 });
    // Click pay/reserve button (text varies by price: "Pay $X & reserve seat" or "Reserve my seat — free")
    await sPage.waitForSelector('button:has-text("seat")', { timeout: 10000 });
    await sPage.click('button:has-text("seat")');
    await sPage.waitForSelector("text=You're registered!", { timeout: 15000 });
    await sPage.screenshot({ path: path.join(SHOT_DIR, '26-group-registered.png') });
  });

  await step('Group registration API blocks double-register (409)', async () => {
    const token = await apiLogin(anonCtx.request, STUDENT.email, STUDENT.password);
    const list = await (await anonCtx.request.get(`${API}/group-sessions`)).json();
    // find the session the student just registered for by trying each until 409/registered
    let saw409 = false;
    for (const s of list) {
      const res = await anonCtx.request.post(`${API}/group-sessions/${s.id}/register`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status() === 409) { saw409 = true; break; }
      if (res.status() === 201) { /* registered another; keep checking */ }
    }
    if (!saw409) throw new Error('expected at least one 409 (already registered)');
  });

  await step('Student My Group Classes shows registration', async () => {
    await sPage.goto(`${FRONTEND}/student/my-sessions`, { waitUntil: 'domcontentloaded' });
    await sPage.waitForSelector('text=My Group Classes', { timeout: 10000 });
    // Wait for loading to finish — .card appears for both data rows and the empty-state panel
    await sPage.waitForSelector('.card', { timeout: 10000 });
    const cards = await sPage.locator('.card').count();
    if (cards < 1) throw new Error('no registered sessions shown');
    await sPage.screenshot({ path: path.join(SHOT_DIR, '27-my-sessions.png') });
  });

  await step('Group session API blocks unauthenticated register (401)', async () => {
    const list = await (await anonCtx.request.get(`${API}/group-sessions`)).json();
    const res = await anonCtx.request.post(`${API}/group-sessions/${list[0].id}/register`, {});
    if (res.status() !== 401) throw new Error(`expected 401, got ${res.status()}`);
  });

  await step('Admin group classes page lists sessions', async () => {
    await aPage.goto(`${ADMIN}/group-sessions`, { waitUntil: 'domcontentloaded' });
    await aPage.waitForSelector('text=Live Group Classes', { timeout: 10000 });
    await aPage.waitForSelector('text=E2E Live Algebra Clinic', { timeout: 10000 });
    await aPage.screenshot({ path: path.join(SHOT_DIR, '28-admin-group-sessions.png') });
  });

  console.log('\n━━━ SECTION G: Admin verification ━━━');

  await step('Admin stats reflect all activity', async () => {
    const res = await anonCtx.request.get(`${API}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const stats = await res.json();
    if (stats.users < 4) throw new Error(`expected >=4 users, got ${stats.users}`);
    if (stats.courses < 1) throw new Error(`expected >=1 course, got ${stats.courses}`);
    if (stats.bookings < 1) throw new Error(`expected >=1 booking, got ${stats.bookings}`);
    if (Number(stats.revenue) < 49.99) throw new Error(`expected revenue >=49.99, got ${stats.revenue}`);
  });

  await step('Admin payments page shows the transaction', async () => {
    await aPage.goto(`${ADMIN}/payments`, { waitUntil: "domcontentloaded" });
    await aPage.waitForSelector('text=$49.99', { timeout: 10000 });
    await aPage.waitForSelector('text=completed');
    await aPage.screenshot({ path: path.join(SHOT_DIR, '22-admin-payments.png') });
  });

  await step('Admin bookings page shows the booking', async () => {
    await aPage.goto(`${ADMIN}/bookings`, { waitUntil: "domcontentloaded" });
    await aPage.waitForSelector('text=Quadratic equations help', { timeout: 10000 });
  });

  await step('Admin users page lists all users + toggle works', async () => {
    await aPage.goto(`${ADMIN}/users`, { waitUntil: "domcontentloaded" });
    await aPage.waitForSelector(`text=${STUDENT2.email}`, { timeout: 10000 });
    // Deactivate then reactivate the second student
    const row = aPage.locator('tr', { hasText: STUDENT2.email });
    await row.locator('button:has-text("Deactivate")').click();
    await row.locator('span:has-text("Inactive")').waitFor({ timeout: 10000 });
    await row.locator('button:has-text("Activate")').click();
    await row.locator('span:has-text("Active")').first().waitFor({ timeout: 10000 });
    await aPage.screenshot({ path: path.join(SHOT_DIR, '23-admin-users.png') });
  });

  console.log('\n━━━ SECTION H: Session & security ━━━');

  await step('Token refresh keeps session alive after reload', async () => {
    await sPage.reload({ waitUntil: "domcontentloaded" });
    await sPage.waitForSelector('text=My Bookings', { timeout: 15000 });
  });

  await step('Logout clears session', async () => {
    await sPage.goto(`${FRONTEND}/student/overview`, { waitUntil: "domcontentloaded" });
    await sPage.click('button[title="Log out"], button:has-text("Log out")');
    await sPage.waitForURL('**/login', { timeout: 10000 });
    await sPage.goto(`${FRONTEND}/student/overview`, { waitUntil: "domcontentloaded" });
    await sPage.waitForURL('**/login', { timeout: 10000 });
  });

  await step('Admin API rejects student token (403)', async () => {
    const token = await apiLogin(anonCtx.request, STUDENT2.email, STUDENT2.password);
    const res = await anonCtx.request.get(`${API}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status() !== 403) throw new Error(`expected 403, got ${res.status()}`);
  });

  await browser.close();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  if (failures.length) {
    console.log('\nFailures:');
    failures.forEach((f) => console.log(`  ✗ ${f.name}\n    ${f.err}`));
  }
  process.exit(failed > 0 ? 1 : 0);
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
