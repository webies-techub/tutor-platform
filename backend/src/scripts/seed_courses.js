require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const sequelize = require('../config/database');
const { Course, Lesson, Enrollment, Payment } = require('../models');

// Tutor IDs from DB (approved tutors with real names)
const TUTORS = {
  raj:    21,  // Raj Patel
  james:  19,  // James Okafor
  sarah:  20,  // Sarah Chen
  mei:    18,  // Dr. Mei Tan
  aisha:  22,  // Dr. Aisha Rahman
  abhishek: 27, // Abhishek Teacher
};

const YT = 'v1B8fAFxzlg'; // provided YouTube video ID (used as placeholder across all courses)

const COURSES = [
  {
    tutor_id: TUTORS.raj,
    title: 'The Complete Web Development Bootcamp',
    subject: 'Web Development',
    description: 'Go from complete beginner to full-stack developer. Master HTML, CSS, JavaScript, React, Node.js and more through hands-on projects used by over 50,000 students worldwide.',
    price: 89.99,
    type: 'recorded',
    is_approved: true,
    is_featured: true,
    thumbnail_path: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    lessons: [
      { title: 'Welcome & Course Overview', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 0 },
      { title: 'Setting Up Your Dev Environment', lesson_type: 'text', order_index: 1, content: `# Setting Up Your Development Environment\n\nBefore we write a single line of code, let's make sure your machine is ready.\n\n## What You'll Need\n- **VS Code** — Download from code.visualstudio.com\n- **Node.js v20+** — Download from nodejs.org\n- **Git** — Download from git-scm.com\n- **Chrome or Firefox** with DevTools\n\n## VS Code Extensions to Install\n1. Prettier — Code formatter\n2. ESLint — JavaScript linting\n3. Live Server — Preview HTML in real time\n4. GitLens — Git supercharged\n\n## Verifying Your Setup\nOpen your terminal and run:\n\`\`\`\nnode --version   # Should output v20.x.x\nnpm --version    # Should output 10.x.x\ngit --version    # Should output git version 2.x.x\n\`\`\`\n\nIf all three print version numbers, you're ready to build!` },
      { title: 'HTML5 Foundations', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 2 },
      { title: 'CSS3 Layouts: Flexbox & Grid', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 3 },
      { title: 'JavaScript Essentials', lesson_type: 'text', order_index: 4, content: `# JavaScript Essentials\n\nJavaScript is the programming language of the web. Every interactive element you see online is powered by it.\n\n## Variables & Data Types\n\`\`\`js\nconst name = "Alice";        // String\nlet age = 28;                // Number\nconst isStudent = true;      // Boolean\nconst scores = [95, 87, 92]; // Array\n\`\`\`\n\n## Functions\n\`\`\`js\n// Arrow function (modern syntax)\nconst greet = (name) => {\n  return \`Hello, \${name}!\`;\n};\n\nconsole.log(greet("Alice")); // Hello, Alice!\n\`\`\`\n\n## The DOM\nThe Document Object Model lets JavaScript interact with your HTML:\n\`\`\`js\nconst btn = document.querySelector('#myButton');\nbtn.addEventListener('click', () => {\n  alert('Button clicked!');\n});\n\`\`\`\n\n## Next Steps\nIn the next lesson we'll dive into React — the industry-standard library for building user interfaces.` },
      { title: 'Building with React', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 5 },
    ],
  },
  {
    tutor_id: TUTORS.mei,
    title: 'Python for Data Science & Machine Learning',
    subject: 'Data Science',
    description: 'Learn Python, NumPy, Pandas, Matplotlib, and Scikit-learn to analyse data and build predictive models. Includes real-world datasets and Jupyter notebook projects.',
    price: 79.99,
    type: 'recorded',
    is_approved: true,
    is_featured: true,
    thumbnail_path: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    lessons: [
      { title: 'Introduction to Python & Jupyter', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 0 },
      { title: 'Python Data Structures', lesson_type: 'text', order_index: 1, content: `# Python Data Structures\n\nUnderstanding Python's built-in data structures is fundamental to writing efficient data science code.\n\n## Lists\n\`\`\`python\nscores = [88, 92, 75, 95, 60]\nprint(max(scores))  # 95\nprint(min(scores))  # 60\nprint(sum(scores)/len(scores))  # 82.0\n\`\`\`\n\n## Dictionaries\n\`\`\`python\nstudent = {\n    "name": "Alice",\n    "age": 22,\n    "grades": {"math": 95, "science": 88}\n}\nprint(student["grades"]["math"])  # 95\n\`\`\`\n\n## List Comprehensions\n\`\`\`python\n# Get only scores above 80\nhigh_scores = [s for s in scores if s > 80]\nprint(high_scores)  # [88, 92, 95]\n\`\`\`\n\n## Why This Matters\nDataFrames in Pandas are built on these concepts. Master lists and dicts and Pandas becomes intuitive.` },
      { title: 'NumPy & Pandas for Data Analysis', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 2 },
      { title: 'Data Visualisation with Matplotlib', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 3 },
      { title: 'Your First Machine Learning Model', lesson_type: 'text', order_index: 4, content: `# Your First Machine Learning Model\n\nWe'll train a simple classifier using Scikit-learn on the classic Iris dataset.\n\n## The Steps\n1. **Load data** — Import dataset\n2. **Split** — Training vs test sets\n3. **Train** — Fit the model\n4. **Evaluate** — Measure accuracy\n\n## Code\n\`\`\`python\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score\n\n# 1. Load\niris = load_iris()\nX, y = iris.data, iris.target\n\n# 2. Split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# 3. Train\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\n\n# 4. Evaluate\nprint(accuracy_score(y_test, model.predict(X_test)))  # ~0.97\n\`\`\`\n\nCongratulations — you just built a 97% accurate machine learning model!` },
    ],
  },
  {
    tutor_id: TUTORS.sarah,
    title: 'UI/UX Design Masterclass: Figma to Prototype',
    subject: 'UI/UX Design',
    description: 'Learn professional UI/UX design from scratch. Master Figma, user research, wireframing, design systems, and create polished prototypes that impress clients and hiring managers.',
    price: 74.99,
    type: 'recorded',
    is_approved: true,
    is_featured: true,
    thumbnail_path: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    lessons: [
      { title: 'What is UI/UX Design?', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 0 },
      { title: 'Design Principles & Typography', lesson_type: 'text', order_index: 1, content: `# Design Principles & Typography\n\nGreat design is invisible — it guides users effortlessly. These four principles are your foundation.\n\n## 1. Contrast\nUse contrast to create visual hierarchy. High contrast = important. Low contrast = supporting.\n\n**Bad:** Grey text on a light grey background\n**Good:** Dark slate text on white — AAA accessibility compliant\n\n## 2. Alignment\nNever place elements arbitrarily. Every item should align with something else on the page.\n\n## 3. Repetition\nRepeat visual styles throughout your design to create consistency. This builds trust.\n\n## 4. Proximity\nGroup related items together. White space separates unrelated content.\n\n## Typography Choices\n| Use Case | Font Type | Examples |\n|---|---|---|\n| Headings | Serif or Display | Playfair Display, Fraunces |\n| Body text | Sans-serif | Inter, Nunito, DM Sans |\n| Code | Monospace | Fira Code, JetBrains Mono |\n\n## Golden Rule\nLimit yourself to 2 fonts per project. One heading, one body. Variety beyond that creates noise.` },
      { title: 'Wireframing & User Flows in Figma', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 2 },
      { title: 'Building a Design System', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 3 },
      { title: 'Prototyping & User Testing', lesson_type: 'text', order_index: 4, content: `# Prototyping & User Testing\n\nA prototype is worth a thousand meetings. It turns abstract ideas into something people can interact with.\n\n## Fidelity Levels\n- **Low-fi** — Paper sketches, quick pen wireframes. Used for early ideation.\n- **Mid-fi** — Grayscale Figma frames. Used for layout validation.\n- **High-fi** — Pixel-perfect with real colours, fonts, and images. Used for stakeholder sign-off.\n\n## The 5-User Rule\nResearch shows that testing with just 5 users uncovers ~85% of usability issues.\n\n## What to Watch For\n1. Where do users hesitate?\n2. What do they click that isn't clickable?\n3. What do they expect to happen vs what actually happens?\n4. Do they understand the main CTA?\n\n## Iterating\n1. Test → 2. Note issues → 3. Redesign → 4. Test again\n\nMost products need 3–4 rounds before the UX feels natural.` },
    ],
  },
  {
    tutor_id: TUTORS.james,
    title: 'Digital Marketing & SEO: Complete 2024 Guide',
    subject: 'Digital Marketing',
    description: 'From SEO and Google Ads to social media strategy and email marketing — learn the exact frameworks used by top agencies to grow brands online and generate measurable ROI.',
    price: 59.99,
    type: 'recorded',
    is_approved: true,
    is_featured: false,
    thumbnail_path: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    lessons: [
      { title: 'Digital Marketing in 2024 — What Works Now', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 0 },
      { title: 'SEO Fundamentals: How Google Ranks Content', lesson_type: 'text', order_index: 1, content: `# SEO Fundamentals: How Google Ranks Content\n\nSEO is the art of making your content visible to people already searching for it. It's free, long-term traffic.\n\n## How Google's Algorithm Works\nGoogle's crawler reads your page, indexes it, and ranks it against millions of others based on:\n1. **Relevance** — Does your content match the search intent?\n2. **Authority** — Do other reputable sites link to you?\n3. **Experience** — Does the page load fast? Is it mobile-friendly?\n\n## The Three Types of SEO\n| Type | What It Covers |\n|---|---|\n| On-page SEO | Title tags, headings, content quality, keywords |\n| Technical SEO | Site speed, mobile, structured data, crawlability |\n| Off-page SEO | Backlinks, brand mentions, social signals |\n\n## Quick Wins\n- Write a title tag under 60 characters with your main keyword\n- Use one H1 per page\n- Make your URL slug descriptive: /blog/seo-guide not /blog/post-123\n- Add alt text to every image\n\n## Keyword Research Tool Recommendations\n- **Free:** Google Search Console, Ubersuggest\n- **Paid:** Ahrefs, SEMrush, Moz` },
      { title: 'Google Ads & Paid Search Strategy', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 2 },
      { title: 'Social Media Marketing That Converts', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 3 },
      { title: 'Email Marketing & Automation', lesson_type: 'text', order_index: 4, content: `# Email Marketing & Automation\n\nEmail delivers $42 for every $1 spent — the highest ROI of any marketing channel.\n\n## Building Your List\n- **Lead magnet** — Offer something valuable (checklist, free chapter, discount) in exchange for an email\n- **Pop-ups** — Exit-intent pop-ups convert 5–10% of abandoning visitors\n- **Landing pages** — Dedicated sign-up pages with a single CTA convert far better than homepages\n\n## Email Sequence Structure\n1. **Welcome email** — Sent immediately. Deliver the lead magnet + set expectations.\n2. **Value email** — Day 2. Teach something useful. Build trust.\n3. **Story email** — Day 4. Tell your brand story. Create connection.\n4. **Offer email** — Day 6. Make your pitch.\n5. **Follow-up** — Day 8. Handle objections.\n\n## Key Metrics\n| Metric | Good Benchmark |\n|---|---|\n| Open rate | 20–30% |\n| Click-through rate | 2–5% |\n| Unsubscribe rate | < 0.5% |\n\n## Tools\nMailchimp (free up to 500), ConvertKit (creators), Klaviyo (e-commerce)` },
    ],
  },
  {
    tutor_id: TUTORS.aisha,
    title: 'Financial Literacy: Investing & Personal Finance',
    subject: 'Finance',
    description: 'Take control of your financial future. Learn budgeting, debt elimination, investing in shares and ETFs, superannuation, and how to build lasting wealth on any income.',
    price: 49.99,
    type: 'recorded',
    is_approved: true,
    is_featured: false,
    thumbnail_path: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
    lessons: [
      { title: 'The Money Mindset Shift', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 0 },
      { title: 'Budgeting: The 50/30/20 Rule', lesson_type: 'text', order_index: 1, content: `# Budgeting: The 50/30/20 Rule\n\nThe 50/30/20 rule is a simple, proven framework to allocate your after-tax income.\n\n## The Breakdown\n| Category | % of Income | Examples |\n|---|---|---|\n| Needs | 50% | Rent, groceries, utilities, transport |\n| Wants | 30% | Dining out, subscriptions, travel |\n| Savings/Debt | 20% | Emergency fund, investments, extra debt payments |\n\n## Example (AUD $5,000/month after tax)\n- **Needs:** $2,500 — Rent $1,800 + Food $400 + Transport $300\n- **Wants:** $1,500 — Dining $400, Entertainment $300, Clothing $300, Gym $100, Misc $400\n- **Savings:** $1,000 — $500 emergency fund + $500 ETF investment\n\n## The Emergency Fund First\nBefore investing anything, build 3–6 months of living expenses in a high-interest savings account. This is your financial safety net.\n\n## Australian Context\n- Use a HISA (High Interest Savings Account) for your emergency fund — rates 4.5–5.5% (2024)\n- Salary sacrifice into Super reduces your taxable income\n- Offset accounts reduce mortgage interest dollar-for-dollar` },
      { title: 'Understanding the Share Market', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 2 },
      { title: 'ETFs vs Managed Funds vs Individual Stocks', lesson_type: 'text', order_index: 3, content: `# ETFs vs Managed Funds vs Individual Stocks\n\n## Exchange-Traded Funds (ETFs)\nAn ETF holds hundreds of companies in one product. You buy one share and instantly own a slice of all of them.\n\n**Pros:** Low fees (0.03–0.20%), diversified, simple, tax-efficient\n**Cons:** Returns match the market — never beat it\n\n**Popular Australian ETFs:**\n- VAS — Vanguard Australian Shares (ASX 300)\n- VGS — Vanguard International Shares\n- NDQ — BetaShares Nasdaq 100\n\n## Managed Funds\nA professional fund manager picks the stocks for you.\n\n**Pros:** Potentially beat market returns\n**Cons:** High fees (1–2%), most underperform the index over 10+ years\n\n## Individual Stocks\nPicking individual companies like CBA, BHP, or Apple.\n\n**Pros:** Potential for outsized returns\n**Cons:** Very high risk, requires significant research, most retail investors underperform\n\n## The Verdict for Most People\n> Low-cost index ETFs + time + consistency = wealth\n\n$500/month invested in a global index ETF at 8% average return = **$745,000 after 30 years**.` },
      { title: 'Superannuation & Tax Strategies', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 4 },
    ],
  },
  {
    tutor_id: TUTORS.abhishek,
    title: 'Business English & Professional Communication',
    subject: 'English',
    description: 'Write emails that get responses, present with confidence, and communicate clearly in any professional setting. Ideal for non-native speakers and anyone entering the corporate world.',
    price: 39.99,
    type: 'recorded',
    is_approved: true,
    is_featured: false,
    thumbnail_path: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&q=80',
    lessons: [
      { title: 'Professional Communication Foundations', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 0 },
      { title: 'Writing Emails That Get Replies', lesson_type: 'text', order_index: 1, content: `# Writing Emails That Get Replies\n\nThe average professional receives 120 emails per day. Here's how to make yours stand out and get a response.\n\n## The Perfect Email Structure\n1. **Subject line** — Clear and specific. "Quick question about Thursday's meeting" > "Question"\n2. **Opening line** — Skip the fluff. "I'm writing to..." wastes everyone's time.\n3. **Body** — One clear purpose per email. If you have 3 topics, send 3 emails.\n4. **Call to action** — End with ONE specific ask: "Can you confirm by Friday?"\n5. **Sign-off** — "Best regards" or "Kind regards" for formal; "Thanks" for internal.\n\n## Before vs After\n**Before (vague):**\n> Hi, I was just wondering if maybe you had a chance to look at the proposal I sent last week and what you might think about it?\n\n**After (clear):**\n> Hi Sarah, I sent the Q3 proposal last Tuesday. Could you share your feedback by Thursday so I can incorporate changes before the board meeting? Thanks!\n\n## Tone Guide\n| Recipient | Tone | Greeting |\n|---|---|---|\n| Client | Formal | Dear Mr/Ms [Last Name] |\n| Manager | Semi-formal | Hi [First Name] |\n| Colleague | Casual | Hey [Name] |\n\n## The 24-Hour Rule\nFor anything emotional or frustrating — write the email, then wait 24 hours before sending.` },
      { title: 'Presenting with Confidence', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 2 },
      { title: 'Meeting English: Vocabulary & Phrases', lesson_type: 'text', order_index: 3, content: `# Meeting English: Vocabulary & Phrases\n\n## Starting a Meeting\n- "Let's get started — we have a lot to cover today."\n- "Thanks everyone for joining. Today's agenda has three items."\n- "Before we begin, does anyone have questions from last time?"\n\n## Asking for Clarification\n- "Could you elaborate on that point?"\n- "Just to make sure I understand — are you saying that...?"\n- "Would you mind repeating that? I want to make sure I have it right."\n\n## Sharing Your Opinion\n- "From my perspective..." / "In my view..."\n- "I'd like to build on what [Name] said..."\n- "I see it slightly differently — here's my thinking:"\n\n## Disagreeing Professionally\n- "I take your point, though I'm not sure I agree because..."\n- "That's an interesting angle. Have we considered...?"\n- "I understand where you're coming from, but the data suggests..."\n\n## Closing & Action Items\n- "To summarise the key decisions from today..."\n- "Who's taking ownership of this by when?"\n- "I'll send the meeting notes within 24 hours."\n\n## Power Phrases to Avoid\n❌ "To be honest..." (implies you're usually not)\n❌ "This might be a stupid question..." (undercuts your confidence)\n❌ "Sorry to interrupt..." (just say "I'd like to add something")` },
      { title: 'Negotiation & Persuasion Skills', lesson_type: 'youtube', content: `https://youtu.be/${YT}`, order_index: 4 },
    ],
  },
];

async function run() {
  try {
    // 1. Alter ENUM to add 'youtube'
    console.log('Updating lesson_type ENUM...');
    await sequelize.query(`
      ALTER TABLE lessons
      MODIFY COLUMN lesson_type ENUM('video','text','image','resource','youtube')
      NOT NULL DEFAULT 'video'
    `);
    console.log('ENUM updated.');

    // 2. Delete all existing courses (cascade handles lessons + enrollments)
    console.log('Deleting existing courses...');
    const existing = await Course.findAll({ attributes: ['id'] });
    const ids = existing.map((c) => c.id);
    if (ids.length) {
      await Enrollment.destroy({ where: { course_id: ids } });
      await Lesson.destroy({ where: { course_id: ids } });
      await Course.destroy({ where: { id: ids } });
    }
    console.log(`Deleted ${ids.length} old course(s).`);

    // 3. Create 6 new courses with lessons
    for (const courseData of COURSES) {
      const { lessons, ...fields } = courseData;
      const course = await Course.create(fields);
      for (const l of lessons) {
        await Lesson.create({ ...l, course_id: course.id });
      }
      console.log(`Created: "${course.title}" (${lessons.length} lessons)`);
    }

    console.log('\nDone! 6 courses seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

run();
