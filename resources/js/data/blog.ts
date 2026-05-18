export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  color: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'optimizing-laravel-rest-apis',
    title: 'Cutting Laravel API response times in half',
    excerpt:
      'How a few targeted changes — eager loading, query caching, and response shaping — took our APIs from 800ms to under 400ms.',
    date: 'Apr 12, 2025',
    readTime: '6 min read',
    tags: ['Laravel', 'Performance', 'API'],
    color: '#FA76FF',
    content:
      "Most slow Laravel APIs aren't slow because of the framework — they're slow because of N+1 queries, oversized payloads, and missing indexes. In this post I walk through the exact profiling workflow I used to take a production API from 500–800ms down to under 400ms, including how I leaned on Telescope, Clockwork, and a few well-placed eager loads.",
  },
  {
    slug: 'self-hosted-vps-control-panel',
    title: 'Building Nimbus: a self-hosted VPS control panel',
    excerpt:
      'Lessons from designing a Laravel + Vue.js dashboard that manages Nginx, PHP versions, cron, databases and backups.',
    date: 'Mar 02, 2025',
    readTime: '9 min read',
    tags: ['Laravel', 'Vue.js', 'DevOps'],
    color: '#FFD23F',
    content:
      "Nimbus started as a side project to scratch my own itch — I was tired of SSH-ing into VPS boxes to flip an Nginx config or rotate a cron job. This post covers the architecture decisions: why Inertia.js over a separate SPA, how I keep the panel safe when it has root-level shell access, and how the GitHub Releases API powers a tiny CI/CD pipeline.",
  },
  {
    slug: 'docker-nginx-laravel-local',
    title: 'A sane Docker + Nginx setup for Laravel projects',
    excerpt:
      'My current local dev template — fast cold starts, sensible defaults, and the same image works in staging.',
    date: 'Feb 10, 2025',
    readTime: '5 min read',
    tags: ['Docker', 'Nginx', 'Laravel'],
    color: '#3DDC97',
    content:
      "Docker for PHP can either be wonderful or a multi-hour rabbit hole. Here's the minimal Compose setup I now reach for on every Laravel project: PHP-FPM, Nginx, MySQL, and a tiny worker container — small enough to read in one sitting, but mirrors my staging environment closely enough to catch real bugs.",
  },
  {
    slug: 'integrating-stripe-and-braintree',
    title: 'Stripe vs Braintree: integrating both in one Laravel app',
    excerpt:
      'A pragmatic comparison after shipping payment flows on both — pricing, webhook ergonomics, and SDK quality.',
    date: 'Jan 18, 2025',
    readTime: '7 min read',
    tags: ['Payments', 'Stripe', 'Braintree'],
    color: '#5B8DEF',
    content:
      "I've shipped checkout flows on both Stripe and Braintree, sometimes side-by-side in the same product. This is the honest, not-marketing-page comparison: where Braintree's PayPal integration shines, why Stripe's webhook tooling still wins, and the abstraction I use to swap providers without rewriting the order pipeline.",
  },
];
