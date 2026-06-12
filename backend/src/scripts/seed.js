/**
 * Seeds demo data: approved tutors (with qualifications/experience),
 * detailed courses across all subject offerings, lessons, and live group sessions.
 * Idempotent — clears previously seeded demo rows (by tagged emails) and re-creates.
 *
 * Run: node src/scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const {
  User, TutorProfile, Course, Lesson, GroupSession, GroupRegistration,
} = require('../models');

const SAMPLE_VIDEO = path.join('src', 'uploads', 'videos', 'sample-lesson.mp4');
const VIDEO_PATH = fs.existsSync(path.join(__dirname, '../../', SAMPLE_VIDEO)) ? SAMPLE_VIDEO : null;
const PASS = 'Tutor@123';

const daysFromNow = (d, hour = 18) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  dt.setHours(hour, 0, 0, 0);
  return dt;
};

const TUTORS = [
  {
    name: 'Dr. Mei Tan', email: 'seed.mei@learnhub.demo',
    headline: 'PhD Physics · Former University Lecturer',
    qualifications: 'PhD in Theoretical Physics (University of Sydney), B.Sc (Hons)',
    experience_years: 12, hourly_rate: 85, subjects: 'Physics, Mathematics',
    bio: 'I make complex physics intuitive. Over 12 years I have taught everything from high-school mechanics to university quantum theory, helping hundreds of students top their exams.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'James Okafor', email: 'seed.james@learnhub.demo',
    headline: 'MSc Mathematics · Exam Specialist',
    qualifications: 'MSc Applied Mathematics, B.Ed Secondary Mathematics',
    experience_years: 8, hourly_rate: 65, subjects: 'Mathematics, Economics',
    bio: 'Maths and economics tutor focused on exam technique and real understanding. My students consistently lift two grade bands within a term.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Sarah Chen', email: 'seed.sarah@learnhub.demo',
    headline: 'Senior Product Designer · Ex-Atlassian',
    qualifications: 'BA Interaction Design, Google UX Professional Certificate',
    experience_years: 9, hourly_rate: 90, subjects: 'UI/UX Design',
    bio: 'I have shipped products used by millions and now help new designers build portfolios that get hired. Practical, industry-first teaching.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Raj Patel', email: 'seed.raj@learnhub.demo',
    headline: 'Digital Marketing Lead · AI Consultant',
    qualifications: 'MBA Marketing, Google & Meta Certified, OpenAI API specialist',
    experience_years: 10, hourly_rate: 80, subjects: 'Digital Marketing, AI/Prompt Engineering',
    bio: 'I help people turn marketing and AI into real career skills — from running paid campaigns to building with large language models.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Dr. Aisha Rahman', email: 'seed.aisha@learnhub.demo',
    headline: 'PhD Chemistry · Senior School Examiner',
    qualifications: 'PhD Organic Chemistry, B.Sc Biochemistry (Hons)',
    experience_years: 11, hourly_rate: 78, subjects: 'Chemistry, Biology',
    bio: 'As a chemistry and biology specialist and exam marker, I know exactly what examiners look for — and I teach you to deliver it.',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80&auto=format&fit=crop',
  },
];

// course defs reference tutor by email
const COURSES = [
  {
    tutor: 'seed.mei@learnhub.demo', subject: 'Physics', price: 59.99, featured: true,
    title: 'HSC Physics: Mechanics, Waves & Electricity',
    thumb: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=900&q=80&auto=format&fit=crop',
    description: 'A complete senior-school physics course. Master kinematics, dynamics, energy, waves, electricity and magnetism through clear explanations and fully worked exam questions. Includes problem-solving frameworks examiners reward.',
    lessons: ['Motion & Kinematics', 'Forces & Newton\'s Laws', 'Energy, Work & Power', 'Waves & Sound', 'Electricity & Circuits', 'Magnetism & Induction', 'Exam Problem-Solving Masterclass'],
  },
  {
    tutor: 'seed.james@learnhub.demo', subject: 'Mathematics', price: 54.99, featured: true,
    title: 'Year 11–12 Mathematics: Calculus & Algebra',
    thumb: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=900&q=80&auto=format&fit=crop',
    description: 'Build rock-solid foundations in advanced algebra, functions, differentiation and integration. Every concept is taught from first principles with hundreds of practice problems and step-by-step solutions.',
    lessons: ['Functions & Graphs', 'Limits & Continuity', 'Differentiation from First Principles', 'Applications of Derivatives', 'Integration Techniques', 'Definite Integrals & Area', 'Exam Technique & Common Traps'],
  },
  {
    tutor: 'seed.aisha@learnhub.demo', subject: 'Chemistry', price: 56.99, featured: true,
    title: 'Chemistry Mastery: From Atoms to Organic Reactions',
    thumb: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=80&auto=format&fit=crop',
    description: 'From atomic structure and bonding to acids, equilibrium and organic chemistry — this course covers the full senior syllabus with crystal-clear diagrams, mnemonics and exam-style questions marked by a real examiner.',
    lessons: ['Atomic Structure & Periodicity', 'Chemical Bonding', 'Stoichiometry & Moles', 'Acids, Bases & Equilibrium', 'Reaction Rates & Energy', 'Organic Chemistry Foundations', 'Organic Reaction Pathways'],
  },
  {
    tutor: 'seed.aisha@learnhub.demo', subject: 'Biology', price: 49.99, featured: false,
    title: 'Biology for Senior School: Cells, Genetics & Ecology',
    thumb: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=900&q=80&auto=format&fit=crop',
    description: 'Understand life from the molecular to the ecosystem level. Cell biology, DNA and inheritance, evolution, human systems and ecology — explained visually and reinforced with exam practice.',
    lessons: ['The Cell & Its Organelles', 'DNA, Genes & Protein Synthesis', 'Inheritance & Genetics', 'Evolution & Natural Selection', 'Human Body Systems', 'Ecology & Ecosystems'],
  },
  {
    tutor: 'seed.james@learnhub.demo', subject: 'Economics', price: 52.99, featured: false,
    title: 'Economics 101: Micro, Macro & Real-World Markets',
    thumb: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80&auto=format&fit=crop',
    description: 'Demystify how economies work. Supply and demand, market structures, inflation, unemployment, fiscal and monetary policy — taught with current real-world examples and clear graph work.',
    lessons: ['Scarcity & Opportunity Cost', 'Supply, Demand & Equilibrium', 'Market Structures', 'Macroeconomic Indicators', 'Fiscal & Monetary Policy', 'Trade & Globalisation'],
  },
  {
    tutor: 'seed.sarah@learnhub.demo', subject: 'UI/UX Design', price: 79.99, featured: true,
    title: 'UI/UX Design Bootcamp: From Wireframe to Prototype',
    thumb: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80&auto=format&fit=crop',
    description: 'Go from zero to a hireable UI/UX portfolio. Learn user research, wireframing, design systems, Figma prototyping and usability testing — following the exact process used at top product companies.',
    lessons: ['Design Thinking & User Research', 'Information Architecture', 'Wireframing Fundamentals', 'Visual Design & Colour Theory', 'Building a Design System', 'Prototyping in Figma', 'Usability Testing', 'Building Your Portfolio'],
  },
  {
    tutor: 'seed.raj@learnhub.demo', subject: 'Digital Marketing', price: 74.99, featured: false,
    title: 'Digital Marketing Pro: SEO, Social & Paid Ads',
    thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop',
    description: 'Become a full-stack digital marketer. Master SEO, content strategy, social media, email funnels and paid advertising on Google and Meta — with live campaign walkthroughs and real metrics.',
    lessons: ['Digital Marketing Foundations', 'SEO & Keyword Strategy', 'Content & Social Media', 'Email Marketing Funnels', 'Google Ads Deep-Dive', 'Meta Ads & Retargeting', 'Analytics & Optimisation'],
  },
  {
    tutor: 'seed.raj@learnhub.demo', subject: 'AI/Prompt Engineering', price: 89.99, featured: true,
    title: 'AI & Prompt Engineering: Build with LLMs',
    thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80&auto=format&fit=crop',
    description: 'Learn to build real applications with large language models. Understand how LLMs work, master prompt engineering patterns, retrieval-augmented generation, tool use and agents — with hands-on projects.',
    lessons: ['How Large Language Models Work', 'Prompt Engineering Fundamentals', 'Advanced Prompting Patterns', 'Retrieval-Augmented Generation (RAG)', 'Tool Use & Function Calling', 'Building AI Agents', 'Shipping an AI Product'],
  },
];

const GROUP_SESSIONS = [
  {
    tutor: 'seed.james@learnhub.demo', subject: 'Mathematics',
    title: 'Live Calculus Problem-Solving Workshop',
    description: 'A fast-paced live class where we solve the toughest calculus exam problems together, step by step. Bring your questions!',
    datetime: daysFromNow(3, 18), duration_min: 90, capacity: 20, price: 19.99,
  },
  {
    tutor: 'seed.mei@learnhub.demo', subject: 'Physics',
    title: 'Physics Exam Crash Course (Live)',
    description: 'Everything you need to walk into your physics exam with confidence — key formulas, worked examples and marker insights in one intensive live session.',
    datetime: daysFromNow(5, 17), duration_min: 120, capacity: 30, price: 24.99,
  },
  {
    tutor: 'seed.raj@learnhub.demo', subject: 'AI/Prompt Engineering',
    title: 'Intro to Prompt Engineering — Live Workshop',
    description: 'Hands-on introduction to prompting large language models effectively. We build and refine prompts live and discuss real use cases.',
    datetime: daysFromNow(7, 19), duration_min: 90, capacity: 25, price: 29.99,
  },
  {
    tutor: 'seed.sarah@learnhub.demo', subject: 'UI/UX Design',
    title: 'UI/UX Portfolio Review (Group)',
    description: 'Bring your designs for live feedback. A supportive group session where Sarah reviews portfolios and shares what hiring managers look for.',
    datetime: daysFromNow(9, 18), duration_min: 75, capacity: 12, price: 22.99,
  },
];

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected. Applying schema changes...');

    // Idempotent column additions/changes (ignore "already exists" errors)
    const safe = async (sql) => {
      try { await sequelize.query(sql); }
      catch (e) {
        if (/Duplicate column|check that column|already exists|Duplicate key/i.test(e.message)) return;
        throw e;
      }
    };
    await safe("ALTER TABLE tutor_profiles ADD COLUMN headline VARCHAR(200) NULL AFTER user_id");
    await safe("ALTER TABLE tutor_profiles ADD COLUMN qualifications VARCHAR(500) NULL AFTER subjects");
    await safe("ALTER TABLE tutor_profiles ADD COLUMN experience_years INT UNSIGNED NOT NULL DEFAULT 0 AFTER qualifications");
    await safe("ALTER TABLE payments MODIFY COLUMN course_id INT UNSIGNED NULL");
    await safe("ALTER TABLE payments ADD COLUMN session_id INT UNSIGNED NULL AFTER course_id");
    await safe("ALTER TABLE payments ADD COLUMN kind ENUM('course','group_session') NOT NULL DEFAULT 'course' AFTER session_id");

    // Create new tables only (IF NOT EXISTS) — does not touch existing tables
    await GroupSession.sync();
    await GroupRegistration.sync();
    console.log('Schema ready.');

    const emails = TUTORS.map((t) => t.email);
    const existing = await User.findAll({ where: { email: emails } });
    if (existing.length) {
      const ids = existing.map((u) => u.id);
      // FK cascade removes their courses, lessons, group sessions, profiles
      await User.destroy({ where: { id: ids } });
      console.log(`Removed ${ids.length} previously-seeded tutors (cascade).`);
    }

    const hash = await bcrypt.hash(PASS, 12);
    const tutorByEmail = {};

    for (const t of TUTORS) {
      const user = await User.create({ name: t.name, email: t.email, password_hash: hash, role: 'tutor' });
      await TutorProfile.create({
        user_id: user.id, headline: t.headline, bio: t.bio, subjects: t.subjects,
        qualifications: t.qualifications, experience_years: t.experience_years,
        hourly_rate: t.hourly_rate, is_approved: true, avatar_path: t.avatar,
      });
      tutorByEmail[t.email] = user.id;
    }
    console.log(`Created ${TUTORS.length} approved tutors.`);

    let courseCount = 0, lessonCount = 0;
    for (const c of COURSES) {
      const course = await Course.create({
        tutor_id: tutorByEmail[c.tutor], title: c.title, subject: c.subject,
        description: c.description, price: c.price, type: 'recorded',
        thumbnail_path: c.thumb, is_approved: true, is_featured: c.featured,
      });
      courseCount++;
      for (let i = 0; i < c.lessons.length; i++) {
        await Lesson.create({
          course_id: course.id, title: c.lessons[i], video_path: VIDEO_PATH,
          duration: 480 + i * 60, order_index: i,
        });
        lessonCount++;
      }
    }
    console.log(`Created ${courseCount} courses with ${lessonCount} lessons.`);

    const { v4: uuidv4 } = require('uuid');
    for (const g of GROUP_SESSIONS) {
      await GroupSession.create({
        tutor_id: tutorByEmail[g.tutor], title: g.title, subject: g.subject,
        description: g.description, datetime: g.datetime, duration_min: g.duration_min,
        capacity: g.capacity, seats_taken: Math.floor(g.capacity * 0.3), price: g.price,
        meeting_link: `https://meet.learnhub.local/group/${uuidv4()}`, status: 'scheduled',
      });
    }
    console.log(`Created ${GROUP_SESSIONS.length} live group sessions.`);

    console.log('\n✅ Seed complete.');
    console.log(`   Tutor logins: ${emails.join(', ')}  (password: ${PASS})`);
    if (!VIDEO_PATH) console.log('   ⚠️  sample-lesson.mp4 missing — lessons created without video.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
})();
