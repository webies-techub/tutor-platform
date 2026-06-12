const { chromium } = require('playwright');
const FRONTEND = 'http://localhost:5173';
const API = 'http://localhost:3001/api';
const R = Date.now().toString().slice(-6);
const S = { name: 'DbgS', email: `webies999+ds${R}@gmail.com`, password: 'Pass@123' };
const T = { name: 'DbgT', email: `webies999+dt${R}@gmail.com`, password: 'Pass@123' };

(async () => {
  // Seed via API: student + tutor, approve tutor, student books
  const reg = (u, role) => fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...u, role }) });
  await reg(S, 'student'); await reg(T, 'tutor');
  const login = async (u) => (await (await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: u.email, password: u.password }) })).json());
  const sL = await login(S); const tL = await login(T);
  const admin = await login({ email: 'admin@learnhub.local', password: 'Admin@1234' });
  await fetch(`${API}/tutors/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tL.accessToken}` }, body: JSON.stringify({ bio: 'x', subjects: 'Math', hourly_rate: 50 }) });
  await fetch(`${API}/admin/tutors/${tL.user.id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${admin.accessToken}` } });
  await fetch(`${API}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sL.accessToken}` }, body: JSON.stringify({ tutor_id: tL.user.id, subject: 'Debug session', datetime: '2026-08-01T10:00' }) });

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  page.on('console', (m) => console.log('  [console]', m.type(), m.text()));
  page.on('requestfailed', (r) => console.log('  [reqfailed]', r.method(), r.url(), r.failure()?.errorText));
  page.on('response', (r) => {
    if (r.url().includes('/bookings')) console.log('  [response]', r.status(), r.request().method(), r.url());
  });

  // login as tutor in UI
  await page.goto(`${FRONTEND}/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[placeholder="you@example.com"]', T.email);
  await page.fill('input[placeholder="Enter your password"]', T.password);
  await page.click('button:has-text("Log in")');
  await page.waitForURL('**/tutor/overview', { timeout: 15000 });

  await page.goto(`${FRONTEND}/tutor/bookings`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('text=Debug session', { timeout: 10000 });
  console.log('Booking visible. Clicking Confirm...');
  await page.click('button:has-text("Confirm")');
  await page.waitForTimeout(4000);

  const badges = await page.locator('span').allInnerTexts();
  console.log('All span texts after confirm:', JSON.stringify(badges.filter(Boolean).slice(0, 20)));

  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
