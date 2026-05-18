export const profile = {
  name: 'Sudhir Rajai',
  role: 'Full Stack Developer',
  tagline: 'Laravel · Vue.js · DevOps',
  email: 'rajaisudhir11@gmail.com',
  phone: '+91 7043917381',
  linkedin: 'https://linkedin.com/in/rajai-sudhir',
  github: 'https://github.com/sudhirrajai',
  location: 'India',
  summary:
    "Full Stack Developer with 1.5+ years of experience building scalable web applications using Laravel and Vue.js. Experienced in REST API development, payment gateway integrations (Stripe, Braintree), and cloud storage (S3, Backblaze, Wasabi). Hands-on with EC2 and VPS setup, Nginx, Docker, and basic Linux administration. Actively learning DevOps practices including containerization, CI/CD, and cloud infrastructure.",
};

export const skills = {
  Languages: ['PHP', 'JavaScript', 'Python', 'HTML', 'CSS'],
  'Frameworks & Libraries': ['Laravel', 'Vue.js', 'Inertia.js', 'ASP.net', 'Bootstrap'],
  'DevOps & Cloud': [
    'Docker',
    'AWS EC2',
    'VPS Management',
    'Nginx',
    'Supervisor',
    'CI/CD',
    'Kubernetes (learning)',
  ],
  'Tools & Platforms': [
    'Git',
    'GitHub',
    'REST API',
    'Linux',
    'S3',
    'Backblaze B2',
    'Wasabi',
    'Stripe',
    'Braintree',
  ],
  Databases: ['MySQL', 'PostgreSQL'],
};

export type Project = {
  id: string;
  title: string;
  year: string;
  stack: string[];
  summary: string;
  highlights: string[];
  color: string;
};

export const projects: Project[] = [
  {
    id: 'nimbus',
    title: 'Nimbus',
    year: '2025',
    stack: ['Laravel', 'Vue.js', 'Inertia.js'],
    summary: 'A self-hosted VPS control panel to manage domains, files, PHP, Nginx, cron, databases & backups from a unified dashboard.',
    highlights: [
      'Built a self-hosted VPS control panel managing domains, files, PHP versions, Nginx config, Supervisor, cron jobs, databases and backups.',
      'Implemented automated code deployment via the GitHub Releases API, enabling a lightweight CI/CD pipeline for auto-updates.',
      'Designed modular architecture using Laravel + Vue.js + Inertia.js for clean separation of concerns and extensibility.',
    ],
    color: '#FA76FF',
  },
  {
    id: 'larasafe',
    title: 'LaraSafe',
    year: '2025',
    stack: ['Laravel', 'Vue.js', 'Inertia.js'],
    summary: 'Automated project backup tool with full / files-only / DB-only modes and configurable scheduling.',
    highlights: [
      'Developed automated backups supporting full project, files-only, or DB-only modes with configurable scheduling.',
      'Integrated cloud storage destinations including Amazon S3, Backblaze B2, and Wasabi for cost-effective backup strategies.',
      'Built a clean admin UI for managing backup configurations, schedules, and restore operations.',
    ],
    color: '#FFD23F',
  },
  {
    id: 'crm',
    title: 'CRM — Client Management',
    year: '2025',
    stack: ['Laravel', 'Vue.js', 'Inertia.js', 'Reverb'],
    summary: 'Full-featured CRM with automation, Kanban boards, real-time team chat and financial reporting.',
    highlights: [
      'Built a full-featured CRM with triggered email workflows, Kanban deal/task tracking, and client management.',
      'Implemented real-time live group discussion using Laravel Reverb WebSockets for instant team communication.',
      'Implemented financial modules: expenses, invoices, P&L reports, and analytics dashboards.',
      'Designed a role-based access control system with granular user and permission management.',
    ],
    color: '#3DDC97',
  },
  {
    id: 'village-on-web',
    title: 'Village On Web',
    year: '2024',
    stack: ['PHP', 'Bootstrap', 'MySQL'],
    summary: 'Web application to digitalize village data with automated multi-database support per village.',
    highlights: [
      'Digitalized village records with an automated multi-database structure improving data accessibility by 30%.',
      'Built scripts that dynamically provision new databases, ensuring scalable architecture.',
    ],
    color: '#5B8DEF',
  },
  {
    id: 'tild',
    title: 'TILD',
    year: '2024',
    stack: ['PHP', 'Bootstrap', 'MySQL'],
    summary: 'Interactive UI and admin panel with consistent responsive performance across devices.',
    highlights: [
      'Built interactive UI and admin panel for smooth management and user-friendly experience.',
      'Designed a responsive frontend with Bootstrap and PHP, ensuring consistent performance across devices.',
    ],
    color: '#FF6B6B',
  },
  {
    id: 'quick-transport',
    title: 'Quick Transport',
    year: '2022',
    stack: ['PHP', 'Bootstrap', 'MySQL'],
    summary: 'Logistics platform allowing users to post goods and hire trucks, with a full admin dashboard.',
    highlights: [
      'Developed a logistics platform allowing users to post goods and hire trucks.',
      'Implemented an admin dashboard to manage bids, users, and contact queries.',
    ],
    color: '#A78BFA',
  },
];

export const experience = [
  {
    company: 'Sapphire Software Solutions',
    role: 'Laravel & Vue.js Developer',
    period: 'Jul 2025 — Present',
    bullets: [
      'Developing and maintaining full-stack web applications with Laravel, Vue.js and Inertia.js.',
      'Building and optimizing REST APIs, including media upload APIs with chunking and storage optimization.',
      'Integrated Stripe and Braintree payment gateways for secure transaction handling.',
      'Managing VPS and EC2 deployments — configuring Nginx, Supervisor, and cron jobs for production.',
      'Set up Docker containers with Nginx for local and staging environments.',
      'Built a real-time live chat system using WebSockets.',
    ],
  },
  {
    company: 'Revatics',
    role: 'PHP Laravel Developer',
    period: 'Jan 2025 — Jun 2025',
    bullets: [
      'Worked on PHP Laravel development, enhancing backend logic and REST API creation.',
      'Optimized REST API performance, reducing response time from 500–800ms to under 400ms.',
      'Hands-on experience in web application development and database management.',
    ],
  },
  {
    company: 'Freelance',
    role: 'WordPress & Shopify Developer',
    period: 'Aug 2023 — Nov 2024',
    bullets: [
      'Added rich SEO content on Y2 Write, improving website ranking and discovery by 30%.',
      'Developed engaging UIs and optimized SEO, increasing user traffic by 10%.',
      'Built responsive WordPress and Shopify sites for e-commerce, blogs, LMS, and news platforms.',
    ],
  },
];

export const education = [
  {
    school: 'PG Department of Computer Science and Technology, Anand',
    degree: 'Master of Computer Application',
    period: 'Jul 2023 — 2025',
  },
  {
    school: 'Shree Swaminarayan College of Computer Science, Bhavnagar',
    degree: 'Bachelor of Computer Application',
    period: 'Jul 2020 — 2023',
  },
];

export const certifications = ['SQL Injection Attacks — EC Council'];
