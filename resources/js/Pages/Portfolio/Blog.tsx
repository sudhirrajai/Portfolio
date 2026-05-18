import React from 'react';
import { Link } from "@inertiajs/react";
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';

const Blog = ({ blogs }) => {
  const INITIAL_COUNT = 5;
  const LOAD_MORE_STEP = 5;
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_COUNT);

  const allBlogs = blogs || [];
  const visibleBlogs = allBlogs.slice(0, visibleCount);
  const hasMore = allBlogs.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  return (
    <>
      <SEOHead pageKey="blog" />
      <link
        href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="pf-page">
        <Navbar />
        <PageContainer>
          <div className="mb-12 md:mb-16">
            <h1 className="pf-heading mb-6">
              Blog.
            </h1>
            <p className="pf-excerpt">
              Field notes from building Laravel + Vue apps, scaling REST APIs, and learning my way around DevOps.
            </p>
          </div>

          <div className="border-t pf-border">
            {visibleBlogs.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-1 md:grid-cols-[120px_1fr] lg:grid-cols-[120px_1fr_240px] gap-6 md:gap-8 items-start lg:items-center border-b pf-border py-8 md:py-12 px-2 hover:bg-[#FFF8DC]/30 dark:hover:bg-[#121212]/30 transition-all duration-300"
              >
                {/* Date Block */}
                <div className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 md:pt-1">
                  {post.date}
                  <div className="mt-1 text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-semibold tracking-wide">{post.read_time}</div>
                </div>

                {/* Title/Excerpt Block */}
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-[-1px] mb-3 group-hover:translate-x-1.5 transition-transform duration-300">
                    {post.title}
                  </h2>
                  <p className="text-[15px] md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="pf-badge px-3 h-[23px] group-hover:border-[#FA76FF]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Visual Frame (Now High Impact 16:10 Banner) */}
                <div
                  className="relative w-full aspect-[16/10] lg:w-[240px] lg:h-[150px] border pf-border overflow-hidden bg-white dark:bg-zinc-950 group-hover:border-black dark:group-hover:border-white/50 group-hover:-translate-y-1 transition-all duration-300 rounded-sm flex-shrink-0"
                >
                  {post.image_path ? (
                    <img 
                      src={`/storage/${post.image_path}`} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    // Clean brand gradient placeholder if no thumbnail provided
                    <div 
                      className="w-full h-full bg-gradient-to-br from-[#FA76FF]/10 to-indigo-500/10 flex items-center justify-center"
                    >
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400/60 dark:text-gray-500/40">Field Note</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent pointer-events-none transition-colors duration-300" />
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 active:scale-[0.97]"
              >
                Load More Articles ↓
              </button>
            </div>
          )}
        </PageContainer>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
