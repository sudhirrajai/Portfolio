import React from 'react';
import { Link } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';

interface LabProject {
  id: number;
  title: string;
  year: string;
  summary: string;
  stack: string[];
  color: string;
  slug: string;
  github_url?: string;
  is_open_source: boolean;
}

const ensureArray = (val: any): any[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    if (val.includes(',')) {
      return val.split(',').map(s => s.trim()).filter(s => s);
    }
    if (val.trim()) {
      return [val.trim()];
    }
  }
  return [];
};

const OpenLabs = ({ labs }: { labs: LabProject[] }) => {
  return (
    <>
      <SEOHead pageKey="work" />
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300">
        <Navbar />
        <PageContainer>
          <div className="mb-12 md:mb-16">
            <div className="inline-block bg-[#FFD23F] text-black text-[10px] font-bold px-2.5 py-1 mb-4 border border-black uppercase tracking-wider">
              DEVELOPER LABS & HUB
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6 tracking-[-2px]">
              Open Source / Labs.
            </h1>
            <p className="text-base md:text-lg max-w-2xl leading-relaxed text-zinc-600 dark:text-zinc-400">
              A curated catalog of open-source packages, custom CLI utilities, local docker templates, and internal development tools. Built to give back to the developer community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {labs.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group relative flex flex-col bg-white dark:bg-[#111] border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300"
              >
                {/* Accent Color Band */}
                <div 
                  className="h-3 w-full border-b-2 border-black dark:border-white" 
                  style={{ backgroundColor: p.color || '#3DDC97' }}
                />

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header line */}
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-2xl font-bold tracking-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        {p.title}
                      </h2>
                      <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 border border-black dark:border-white px-2 py-0.5">
                        {p.year}
                      </span>
                    </div>

                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {ensureArray(p.stack).map((tag) => (
                        <span 
                          key={tag} 
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                      {p.summary}
                    </p>
                  </div>

                  {/* Actions area */}
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Link
                      href={`/work/${p.slug}`}
                      className="flex-1 text-center py-2.5 border border-black dark:border-white text-[10px] font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
                    >
                      View Details & Setup →
                    </Link>
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 border border-black dark:border-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center"
                        title="GitHub Repository"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {labs.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                <p className="text-zinc-500">No open source projects seeded yet. Check back soon!</p>
              </div>
            )}
          </div>
        </PageContainer>
        <Footer />
      </div>
    </>
  );
};

export default OpenLabs;
