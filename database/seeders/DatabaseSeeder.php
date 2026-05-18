<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Sudhir Rajai',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
        ]);

        \App\Models\Profile::create([
            'name' => 'Sudhir Rajai',
            'role' => 'Full Stack Developer',
            'tagline' => 'Laravel · Vue.js · DevOps',
            'email' => 'rajaisudhir11@gmail.com',
            'phone' => '+91 7043917381',
            'location' => 'India',
            'summary' => "Full Stack Developer with 1.5+ years of experience building scalable web applications using Laravel and Vue.js. Experienced in REST API development, payment gateway integrations (Stripe, Braintree), and cloud storage (S3, Backblaze, Wasabi). Hands-on with EC2 and VPS setup, Nginx, Docker, and basic Linux administration. Actively learning DevOps practices including containerization, CI/CD, and cloud infrastructure.",
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/rajai-sudhir',
                'github' => 'https://github.com/sudhirrajai',
            ],
        ]);

        $skills = [
            'Languages' => ['PHP', 'JavaScript', 'Python', 'HTML', 'CSS'],
            'Frameworks & Libraries' => ['Laravel', 'Vue.js', 'Inertia.js', 'ASP.net', 'Bootstrap'],
            'DevOps & Cloud' => ['Docker', 'AWS EC2', 'VPS Management', 'Nginx', 'Supervisor', 'CI/CD', 'Kubernetes (learning)'],
            'Tools & Platforms' => ['Git', 'GitHub', 'REST API', 'Linux', 'S3', 'Backblaze B2', 'Wasabi', 'Stripe', 'Braintree'],
            'Databases' => ['MySQL', 'PostgreSQL'],
        ];

        foreach ($skills as $category => $items) {
            \App\Models\Skill::create([
                'category' => $category,
                'items' => $items,
            ]);
        }

        $projects = [
            [
                'title' => 'Nimbus',
                'slug' => 'nimbus',
                'year' => '2025',
                'stack' => ['Laravel', 'Vue.js', 'Inertia.js'],
                'summary' => 'A self-hosted VPS control panel to manage domains, files, PHP, Nginx, cron, databases & backups from a unified dashboard.',
                'highlights' => [
                    'Built a self-hosted VPS control panel managing domains, files, PHP versions, Nginx config, Supervisor, cron jobs, databases and backups.',
                    'Implemented automated code deployment via the GitHub Releases API, enabling a lightweight CI/CD pipeline for auto-updates.',
                    'Designed modular architecture using Laravel + Vue.js + Inertia.js for clean separation of concerns and extensibility.',
                ],
                'color' => '#FA76FF',
                'is_open_source' => true,
                'github_url' => 'https://github.com/sudhirrajai/nimbus',
                'open_source_content' => "### Getting Started with Nimbus\n\nNimbus is a secure, light-weight VPS panel designed for self-hosters and developers. \n\n#### Prerequisites\n- A clean VPS running Ubuntu 22.04 LTS or 24.04 LTS.\n- Minimum 1GB RAM / 1 vCPU.\n\n#### Installation CLI\nRun this direct install command on your target VPS server:\n```bash\ncurl -sS https://raw.githubusercontent.com/sudhirrajai/nimbus/main/install.sh | bash\n```\n\n#### Core Features\n1. **Dynamic Nginx Proxy:** Auto-configure virtual hosts, TLS certificates with Let's Encrypt, and secure redirection logs.\n2. **Database Management:** Instantly spin up MySQL or PostgreSQL databases with hourly automated backups.\n3. **Supervisor Dials:** Manage and monitor Laravel queues, Horizon, and WebSocket servers live."
            ],
            [
                'title' => 'LaraSafe',
                'slug' => 'larasafe',
                'year' => '2025',
                'stack' => ['Laravel', 'Vue.js', 'Inertia.js'],
                'summary' => 'Automated project backup tool with full / files-only / DB-only modes and configurable scheduling.',
                'highlights' => [
                    'Developed automated backups supporting full project, files-only, or DB-only modes with configurable scheduling.',
                    'Integrated cloud storage destinations including Amazon S3, Backblaze B2, and Wasabi for cost-effective backup strategies.',
                    'Built a clean admin UI for managing backup configurations, schedules, and restore operations.',
                ],
                'color' => '#FFD23F',
                'is_open_source' => true,
                'github_url' => 'https://github.com/sudhirrajai/larasafe',
                'open_source_content' => "### Setup & Installation\n\nIntegrate LaraSafe seamlessly in your existing Laravel application using Composer.\n\n```bash\ncomposer require sudhirrajai/larasafe\n```\n\nPublish assets & run the migration script:\n```bash\nphp artisan larasafe:install\n```\n\n#### Backup Configuration example:\nDefine your destinations inside `config/larasafe.php`:\n```php\nreturn [\n    'driver' => 's3',\n    'destinations' => [\n        's3' => [\n            'bucket' => env('LARASAFE_S3_BUCKET'),\n        ],\n    ],\n];\n```"
            ],
            [
                'title' => 'CRM — Client Management',
                'slug' => 'crm-client-management',
                'year' => '2025',
                'stack' => ['Laravel', 'Vue.js', 'Inertia.js', 'Reverb'],
                'summary' => 'Full-featured CRM with automation, Kanban boards, real-time team chat and financial reporting.',
                'highlights' => [
                    'Built a full-featured CRM with triggered email workflows, Kanban deal/task tracking, and client management.',
                    'Implemented real-time live group discussion using Laravel Reverb WebSockets for instant team communication.',
                    'Implemented financial modules: expenses, invoices, P&L reports, and analytics dashboards.',
                    'Designed a role-based access control system with granular user and permission management.',
                ],
                'color' => '#3DDC97',
            ],
            [
                'title' => 'Village On Web',
                'slug' => 'village-on-web',
                'year' => '2024',
                'stack' => ['PHP', 'Bootstrap', 'MySQL'],
                'summary' => 'Web application to digitalize village data with automated multi-database support per village.',
                'highlights' => [
                    'Digitalized village records with an automated multi-database structure improving data accessibility by 30%.',
                    'Built scripts that dynamically provision new databases, ensuring scalable architecture.',
                ],
                'color' => '#5B8DEF',
            ],
            [
                'title' => 'TILD',
                'slug' => 'tild',
                'year' => '2024',
                'stack' => ['PHP', 'Bootstrap', 'MySQL'],
                'summary' => 'Interactive UI and admin panel with consistent responsive performance across devices.',
                'highlights' => [
                    'Built interactive UI and admin panel for smooth management and user-friendly experience.',
                    'Designed a responsive frontend with Bootstrap and PHP, ensuring consistent performance across devices.',
                ],
                'color' => '#FF6B6B',
            ],
            [
                'title' => 'Quick Transport',
                'slug' => 'quick-transport',
                'year' => '2022',
                'stack' => ['PHP', 'Bootstrap', 'MySQL'],
                'summary' => 'Logistics platform allowing users to post goods and hire trucks, with a full admin dashboard.',
                'highlights' => [
                    'Developed a logistics platform allowing users to post goods and hire trucks.',
                    'Implemented an admin dashboard to manage bids, users, and contact queries.',
                ],
                'color' => '#A78BFA',
            ],
        ];


        foreach ($projects as $project) {
            \App\Models\Project::create($project);
        }

        $experience = [
            [
                'company' => 'Sapphire Software Solutions',
                'role' => 'Laravel & Vue.js Developer',
                'period' => 'Jul 2025 — Present',
                'bullets' => [
                    'Developing and maintaining full-stack web applications with Laravel, Vue.js and Inertia.js.',
                    'Building and optimizing REST APIs, including media upload APIs with chunking and storage optimization.',
                    'Integrated Stripe and Braintree payment gateways for secure transaction handling.',
                    'Managing VPS and EC2 deployments — configuring Nginx, Supervisor, and cron jobs for production.',
                    'Set up Docker containers with Nginx for local and staging environments.',
                    'Built a real-time live chat system using WebSockets.',
                ],
            ],
            [
                'company' => 'Revatics',
                'role' => 'PHP Laravel Developer',
                'period' => 'Jan 2025 — Jun 2025',
                'bullets' => [
                    'Worked on PHP Laravel development, enhancing backend logic and REST API creation.',
                    'Optimized REST API performance, reducing response time from 500–800ms to under 400ms.',
                    'Hands-on experience in web application development and database management.',
                ],
            ],
            [
                'company' => 'Freelance',
                'role' => 'WordPress & Shopify Developer',
                'period' => 'Aug 2023 — Nov 2024',
                'bullets' => [
                    'Added rich SEO content on Y2 Write, improving website ranking and discovery by 30%.',
                    'Developed engaging UIs and optimized SEO, increasing user traffic by 10%.',
                    'Built responsive WordPress and Shopify sites for e-commerce, blogs, LMS, and news platforms.',
                ],
            ],
        ];

        foreach ($experience as $exp) {
            \App\Models\Experience::create($exp);
        }

        $education = [
            [
                'school' => 'PG Department of Computer Science and Technology, Anand',
                'degree' => 'Master of Computer Application',
                'period' => 'Jul 2023 — 2025',
            ],
            [
                'school' => 'Shree Swaminarayan College of Computer Science, Bhavnagar',
                'degree' => 'Bachelor of Computer Application',
                'period' => 'Jul 2020 — 2023',
            ],
        ];

        foreach ($education as $edu) {
            \App\Models\Education::create($edu);
        }

        $blogPosts = [
            [
                'slug' => 'optimizing-laravel-rest-apis',
                'title' => 'Cutting Laravel API response times in half',
                'excerpt' => 'How a few targeted changes — eager loading, query caching, and response shaping — took our APIs from 800ms to under 400ms.',
                'date' => 'Apr 12, 2025',
                'read_time' => '6 min read',
                'tags' => ['Laravel', 'Performance', 'API'],
                'color' => '#FA76FF',
                'content' => "Most slow Laravel APIs aren't slow because of the framework — they're slow because of N+1 queries, oversized payloads, and missing indexes. In this post I walk through the exact profiling workflow I used to take a production API from 500–800ms down to under 400ms, including how I leaned on Telescope, Clockwork, and a few well-placed eager loads.",
            ],
            [
                'slug' => 'self-hosted-vps-control-panel',
                'title' => 'Building Nimbus: a self-hosted VPS control panel',
                'excerpt' => 'Lessons from designing a Laravel + Vue.js dashboard that manages Nginx, PHP versions, cron, databases and backups.',
                'date' => 'Mar 02, 2025',
                'read_time' => '9 min read',
                'tags' => ['Laravel', 'Vue.js', 'DevOps'],
                'color' => '#FFD23F',
                'content' => "Nimbus started as a side project to scratch my own itch — I was tired of SSH-ing into VPS boxes to flip an Nginx config or rotate a cron job. This post covers the architecture decisions: why Inertia.js over a separate SPA, how I keep the panel safe when it has root-level shell access, and how the GitHub Releases API powers a tiny CI/CD pipeline.",
            ],
            [
                'slug' => 'docker-nginx-laravel-local',
                'title' => 'A sane Docker + Nginx setup for Laravel projects',
                'excerpt' => 'My current local dev template — fast cold starts, sensible defaults, and the same image works in staging.',
                'date' => 'Feb 10, 2025',
                'read_time' => '5 min read',
                'tags' => ['Docker', 'Nginx', 'Laravel'],
                'color' => '#3DDC97',
                'content' => "Docker for PHP can either be wonderful or a multi-hour rabbit hole. Here's the minimal Compose setup I now reach for on every Laravel project: PHP-FPM, Nginx, MySQL, and a tiny worker container — small enough to read in one sitting, but mirrors my staging environment closely enough to catch real bugs.",
            ],
            [
                'slug' => 'integrating-stripe-and-braintree',
                'title' => 'Stripe vs Braintree: integrating both in one Laravel app',
                'excerpt' => 'A pragmatic comparison after shipping payment flows on both — pricing, webhook ergonomics, and SDK quality.',
                'date' => 'Jan 18, 2025',
                'read_time' => '7 min read',
                'tags' => ['Payments', 'Stripe', 'Braintree'],
                'color' => '#5B8DEF',
                'content' => "I've shipped checkout flows on both Stripe and Braintree, sometimes side-by-side in the same product. This is the honest, not-marketing-page comparison: where Braintree's PayPal integration shines, why Stripe's webhook tooling still wins, and the abstraction I use to swap providers without rewriting the order pipeline.",
            ],
        ];

        foreach ($blogPosts as $post) {
            \App\Models\BlogPost::create($post);
        }

        // Initialize Default Calendar Working Hours
        \App\Models\BookingSetting::create([
            'days_of_week' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            'work_hours_start' => '09:00:00',
            'work_hours_end' => '17:00:00',
            'slot_duration' => 30,
        ]);

        // Seed default roadmap milestones
        $roadmaps = [
            [
                'phase' => 'Now',
                'title' => 'Container Orchestration & CI/CD',
                'description' => 'Deep diving into Kubernetes orchestration, Helm charts, and building secure self-hosted GitLab/GitHub Action CI/CD pipelines.',
                'tags' => ['Kubernetes', 'Helm', 'CI/CD'],
                'order_weight' => 1
            ],
            [
                'phase' => 'Now',
                'title' => 'LaraSafe Feature Expansion',
                'description' => 'Integrating automated database restoration, encrypted backups, and custom Slack/Discord webhook status alerts.',
                'tags' => ['Laravel', 'Security'],
                'order_weight' => 2
            ],
            [
                'phase' => 'Next',
                'title' => 'System Utilities in Rust',
                'description' => 'Exploring Rust development to build highly performant system-level backup utilities and file watchers.',
                'tags' => ['Rust', 'Systems Programming'],
                'order_weight' => 3
            ],
            [
                'phase' => 'Next',
                'title' => 'Modular SaaS Architecture',
                'description' => 'Designing a lightweight, multi-tenant Laravel SaaS template featuring single-database tenancy and Stripe billing modules.',
                'tags' => ['SaaS', 'Stripe'],
                'order_weight' => 4
            ],
            [
                'phase' => 'Future',
                'title' => 'AWS Certified Solutions Architect',
                'description' => 'Studying to obtain AWS solutions architect certification to build robust enterprise-grade cloud architectures.',
                'tags' => ['AWS', 'Cloud Architecture'],
                'order_weight' => 5
            ]
        ];

        foreach ($roadmaps as $road) {
            \App\Models\Roadmap::create($road);
        }
    }
}

