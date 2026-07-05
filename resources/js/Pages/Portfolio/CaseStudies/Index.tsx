import React from 'react';
import { Link } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';

interface Category {
  id: number;
  name: string;
  slug: string;
  case_studies_count?: number;
}

interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  summary: string;
  client?: string;
  year: string;
  stack: string[];
  tags?: string[];
  color: string;
  image_path?: string;
  categories?: Category[];
}

const CaseStudyCard = ({ study }: { study: CaseStudy }) => (
  <Link 
    href={`/case-studies/${study.slug}`} 
    id={`case-study-card-${study.slug}`}
    className="relative cursor-pointer group flex flex-col h-full bg-white dark:bg-[#111] border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 rounded-lg overflow-hidden"
  >
    <div className="overflow-hidden mb-0 border-b-2 border-black dark:border-white">
      <div
        className="aspect-[4/3] bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.02] flex items-end p-6 relative"
        style={!study.image_path ? { backgroundColor: study.color || '#6366f1' } : {}}
      >
        {study.image_path ? (
           <>
             <img 
               src={`/storage/${study.image_path}`} 
               alt={study.title} 
               className="absolute inset-0 w-full h-full object-cover" 
               loading="lazy"
               decoding="async"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent z-[5]" />
           </>
        ) : null}
        
        <div className="relative z-10">
          {study.client && (
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FA76FF] block mb-1">
              Client: {study.client}
            </span>
          )}
          <span className={`text-2xl sm:text-3xl font-semibold leading-tight tracking-tight relative z-10 ${
            study.image_path ? 'text-white' : 'text-black mix-blend-overlay'
          }`}>
            {study.title}
          </span>
        </div>
      </div>
    </div>
    
    <div className="absolute top-4 left-4 flex flex-col gap-0.5 z-20">
      <div className="pf-badge h-[23px] px-3 bg-black dark:bg-white text-white dark:text-black">
        <div className="text-[10px] font-bold leading-none">{study.year}</div>
      </div>
    </div>

    <div className="p-5 flex flex-col flex-1">
      {study.categories && study.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {study.categories.map(cat => (
            <span key={cat.id} className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 px-2 py-0.5 rounded">
              {cat.name}
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-505 font-bold uppercase tracking-wider mb-2">
        {study.stack && study.stack.slice(0, 3).join(' • ')}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex-1 leading-relaxed line-clamp-3">{study.summary}</p>
      <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1.5 transition-transform duration-300">
        Read Case Study →
      </div>
    </div>
  </Link>
);

const Index = ({ caseStudies, categories = [], activeCategory = null }: { caseStudies: CaseStudy[]; categories: Category[]; activeCategory: Category | null }) => {
  const INITIAL_COUNT = 6;
  const LOAD_MORE_STEP = 6;
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_COUNT);

  const allStudies = caseStudies || [];
  const visibleStudies = allStudies.slice(0, visibleCount);
  const hasMore = allStudies.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  return (
    <>
      <SEOHead 
        title={activeCategory ? `${activeCategory.name} Case Studies | Portfolio` : "Case Studies | Portfolio"} 
        description="Deep dives into my commercial products, freelance works, custom integrations, and system architectures." 
      />
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300">
        <Navbar />
        <PageContainer>
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4 tracking-[-2px]">
              Case Studies{activeCategory ? `: ${activeCategory.name}` : '.'}
            </h1>
            <p className="text-base md:text-lg max-w-2xl leading-relaxed text-gray-600 dark:text-gray-400">
              Deep dives and architectural breakdowns of real-world freelance contracts, production platforms, and client solutions.
            </p>
          </div>

          {/* Categories Horizontal Selector tabs */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 border-b border-black/10 dark:border-white/10 pb-6">
              <Link
                href="/case-studies"
                className={`px-4 py-2 border text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 ${
                  !activeCategory
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-[-1px]'
                    : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-250 dark:border-gray-800 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                }`}
              >
                All Works
              </Link>
              {categories.map((category) => {
                const isActive = activeCategory?.id === category.id;
                return (
                  <Link
                    key={category.id}
                    href={`/case-studies/category/${category.slug}`}
                    className={`px-4 py-2 border text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-[-1px]'
                        : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-250 dark:border-gray-800 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                    }`}
                  >
                    {category.name} ({category.case_studies_count ?? 0})
                  </Link>
                );
              })}
            </div>
          )}

          {allStudies.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400 italic">No case studies found in this category. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                {visibleStudies.map((study, index) => (
                  <motion.div
                    key={study.id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="h-full"
                  >
                    <CaseStudyCard study={study} />
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 active:scale-[0.97]"
                  >
                    Load More Case Studies ↓
                  </button>
                </div>
              )}
            </>
          )}
        </PageContainer>
        <Footer />
      </div>
    </>
  );
};

export default Index;
