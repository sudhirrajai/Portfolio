import React from 'react';
import { Link } from "@inertiajs/react";
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  client?: string;
  year: string;
  summary: string;
  content: string;
  stack: string[];
  tags?: string[];
  color: string;
  image_path?: string;
  categories?: Category[];
}

const Show = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  const [activePreviewImage, setActivePreviewImage] = React.useState<{ src: string; alt: string } | null>(null);

  if (!caseStudy) {
    return (
      <div className="pf-page min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300">
        <SEOHead title="Case Study Not Found" description="This case study doesn't exist." />
        <Navbar />
        <PageContainer>
          <h1 className="text-4xl font-medium mb-6">Case Study not found.</h1>
          <Link
            href="/case-studies"
            className="pf-btn px-6 py-3"
          >
            ← Back to Case Studies
          </Link>
        </PageContainer>
        <Footer />
      </div>
    );
  }

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      setActivePreviewImage({
        src: img.src,
        alt: img.alt || caseStudy.title
      });
    }
  };

  return (
    <>
      <SEOHead 
        title={`${caseStudy.title} | Case Study`} 
        description={caseStudy.summary} 
        keywords={caseStudy.stack && Array.isArray(caseStudy.stack) ? caseStudy.stack.join(', ') : undefined} 
      />
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300 font-sans">
        <Navbar />
        <PageContainer className="max-w-4xl py-8">
          
          {/* Back Action */}
          <div className="mb-6">
            <Link 
              href="/case-studies" 
              className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              ← Back to Case Studies
            </Link>
          </div>

          {/* Heading */}
          <h1 className="pf-heading mb-4 leading-[1.05] tracking-tight">
            {caseStudy.title}
          </h1>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-3.5 mb-8 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {caseStudy.client && (
              <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                Client: {caseStudy.client}
              </span>
            )}
            <span className="bg-gray-100 dark:bg-gray-900 text-gray-750 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-250 dark:border-gray-800">
              Year: {caseStudy.year}
            </span>
            {caseStudy.categories && caseStudy.categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/case-studies/category/${cat.slug}`}
                className="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
              >
                Category: {cat.name}
              </Link>
            ))}
          </div>

          {/* Cover Hero Image */}
          <div
            className="aspect-[2/1] w-full mb-10 border-2 border-black dark:border-white bg-[#222] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 overflow-hidden flex items-center justify-center relative rounded-xl"
            style={{ backgroundColor: caseStudy.color || '#6366f1' }}
          >
            {caseStudy.image_path ? (
              <img 
                src={`/storage/${caseStudy.image_path}`} 
                alt={caseStudy.title} 
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setActivePreviewImage({ src: `/storage/${caseStudy.image_path}`, alt: caseStudy.title })}
              />
            ) : (
              <span className="text-white text-5xl md:text-7xl font-medium tracking-tight select-none opacity-40">
                Case Study
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25 pointer-events-none" />
          </div>

          {/* Left Summary & Right Stack Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 border-b border-black/10 dark:border-white/10 pb-8">
            <div className="md:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Executive Summary</h3>
              <p className="text-lg leading-relaxed text-gray-850 dark:text-gray-350">
                {caseStudy.summary}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Core Technologies</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {caseStudy.stack && caseStudy.stack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-850 dark:text-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {caseStudy.tags && caseStudy.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Scope & Focus</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {caseStudy.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#FA76FF]/10 border border-[#FA76FF]/35 text-[#FA76FF]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Case Study Article Body */}
          <article 
            className="pf-prose"
            dangerouslySetInnerHTML={{ __html: caseStudy.content }}
            onClick={handleContentClick}
          />

          {/* Action Back Button */}
          <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
            <Link
              href="/case-studies"
              className="pf-btn px-8 py-4 inline-flex items-center gap-2"
            >
              ← All Case Studies
            </Link>
          </div>

        </PageContainer>
        <Footer />
      </div>

      {/* Premium Lightbox Modal for Image Preview */}
      {activePreviewImage && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 dark:bg-black/98 backdrop-blur-md cursor-zoom-out p-4 md:p-8 animate-fade-in"
          onClick={() => setActivePreviewImage(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all focus:outline-none z-[10000]"
            onClick={() => setActivePreviewImage(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Main expanded image */}
          <img 
            src={activePreviewImage.src} 
            alt={activePreviewImage.alt}
            className="max-w-full max-h-[85vh] object-contain rounded-xl border border-white/10 shadow-2xl select-none"
          />
          
          {/* Image caption */}
          {activePreviewImage.alt && (
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400 select-none bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              {activePreviewImage.alt}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default Show;
