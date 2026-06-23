import React from 'react';
import { Link } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { Footer } from '@/Components/Footer';
import { ProjectCard } from '@/Components/ProjectCard';
import { ArrowDown } from 'lucide-react';
import { Timeline } from '@/Components/Timeline';
import { DevTerminal } from '@/Components/DevTerminal';

const Home = ({ projects, blogPosts, profile, experience = [], education = [] }) => {
  const scrollToWork = () => {
    document.getElementById('work-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!profile) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pf-page"
    >
      <SEOHead pageKey="home" />
      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Navbar />
      </div>


      {/* Hero */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-8 md:mb-10 inline-flex flex-col items-center">
            <div className="flex items-center">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="border pf-border px-3 md:px-6 py-2 md:py-4 bg-white dark:bg-black mr-2"
              >
                Hi, I'm
              </motion.span>
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-[#ff6bff] border pf-border px-3 md:px-6 py-2 md:py-4 rounded-[20px] md:rounded-[40px] text-black"
              >
                {profile.name.split(' ')[0]}
              </motion.span>
            </div>
            <div className="flex items-center mt-4 md:mt-6">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="border pf-border px-3 md:px-6 py-2 md:py-4 bg-white dark:bg-black mr-2"
              >
                full-stack
              </motion.span>
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="border pf-border px-3 md:px-6 py-2 md:py-4 bg-white dark:bg-black"
              >
                developer
              </motion.span>
            </div>
          </h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm md:text-base lg:text-[18px] text-black dark:text-gray-300 max-w-2xl mx-auto"
          >
            {profile.summary}
          </motion.p>
          {profile.resume_path && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex justify-center"
            >
              <a 
                href={`/${profile.resume_path}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-[11px] uppercase font-bold tracking-widest border-2 border-black dark:border-white px-6 py-3 bg-black text-white dark:bg-white dark:text-black hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(255,107,255,1)] active:scale-[0.98]"
              >
                Download Resume <ArrowDown className="size-3.5" />
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* Interactive Timeline Section */}
      <Timeline experience={experience} education={education} />

      {/* Visual Divider Ribbon */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <hr className="border-t pf-border opacity-60" />
      </div>

      {/* Work */}
      <section id="work-section" className="px-4 md:px-8 pb-20 md:pb-24 pt-8 md:pt-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <div>
            <div className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider mb-3 rounded-sm">
              Portfolio Showroom
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black dark:text-white">
              Selected Works & Case Studies
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider border pf-badge bg-gray-50 dark:bg-zinc-950 px-3 py-2.5 rounded-sm self-start md:self-auto">
            <span className="text-gray-400">Showcase Era:</span>
            <span className="text-emerald-500 dark:text-[#FA76FF]">2022 — {new Date().getFullYear()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects && projects.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>

        {/* "View All Work" Dynamic CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center md:justify-start"
        >
          <Link 
            href="/work" 
            className="inline-flex items-center gap-2.5 text-[11px] uppercase font-bold tracking-widest border-2 border-black dark:border-white px-8 py-3.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 active:scale-[0.98]"
          >
            Explore Entire Portfolio
            <span className="text-[14px] leading-none">→</span>
          </Link>
        </motion.div>
      </section>

      {/* Dev Terminal Git Stats Section */}
      <DevTerminal profile={profile} />

      {/* Visual Divider Ribbon */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <hr className="border-t pf-border opacity-60" />
      </div>

      {/* Home Blog Showcase Section */}
      <section className="px-4 md:px-8 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase font-bold tracking-wider mb-3 rounded-[4px]">
              From The Journal
            </div>
            <h2 className="text-2xl md:text-4xl font-medium tracking-tight">
              Latest Insights & Learnings
            </h2>
          </div>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-[#FA76FF] transition-colors pb-1 border-b-2 border-transparent hover:border-current"
          >
            Visit Full Blog Grid →
          </Link>
        </div>

        {blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Link 
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full border-2 border-black dark:border-white bg-white dark:bg-zinc-900/40 p-6 hover:bg-[#FFF8DC]/20 dark:hover:bg-[#121212]/40 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 relative overflow-hidden"
                >

                  {/* Decorative Subtle Light Glow on hover */}
                  <div className="absolute -inset-y-0 -right-full w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[25deg] group-hover:animate-shine pointer-events-none" />
                  
                  {/* Post Meta */}
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-gray-400 mb-4">
                    <span>{post.date || new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <span className="text-indigo-500 dark:text-[#FA76FF]">{post.read_time || '5 min read'}</span>
                  </div>

                  <h3 className="text-xl md:text-lg lg:text-xl font-semibold leading-tight mb-3 group-hover:text-indigo-600 dark:group-hover:text-[#FA76FF] transition-colors duration-200">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {(post.tags || []).slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[9px] font-bold uppercase border pf-border px-2.5 py-1 bg-gray-50 dark:bg-zinc-900 text-gray-500 tracking-wider rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 dark:border-zinc-800 p-12 text-center text-gray-500 rounded-lg">
             ✏️ No insights posted yet. They will appear here automatically once published!
          </div>
        )}
      </section>

      <Footer />
    </motion.div>
  );
};

export default Home;
