import React from 'react';
import { Link } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';
import { ProjectCard } from '@/Components/ProjectCard';

const Work = ({ projects }) => {
  const INITIAL_COUNT = 6;
  const LOAD_MORE_STEP = 6;
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_COUNT);

  const allProjects = projects || [];
  const visibleProjects = allProjects.slice(0, visibleCount);
  const hasMore = allProjects.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  return (
    <>
      <SEOHead pageKey="work" />
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300">
        <Navbar />
        <PageContainer>
          <div className="mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6 tracking-[-2px]">
              Selected Work.
            </h1>
            <p className="text-base md:text-lg max-w-2xl leading-relaxed">
              A showcase of modern, scalable web applications ranging from APIs and SaaS platforms to responsive interactive frontend interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {visibleProjects.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="h-full"
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 active:scale-[0.97]"
              >
                Load More Projects ↓
              </button>
            </div>
          )}
        </PageContainer>
        <Footer />
      </div>
    </>
  );
};

export default Work;
