import React from 'react';
import { Link, router } from "@inertiajs/react";
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';

const Blog = ({ blogs, categories = [], activeCategory = null }: any) => {
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
      <SEOHead 
        pageKey={activeCategory ? undefined : 'blog'}
        title={activeCategory ? activeCategory.meta_title || `${activeCategory.name} Articles` : undefined}
        description={activeCategory ? activeCategory.meta_description || activeCategory.description : undefined}
      />
      <div className="pf-page">
        <Navbar />
        <PageContainer>
          <div className="mb-10 md:mb-12">
            <h1 className="pf-heading mb-4">
              {activeCategory ? `Category: ${activeCategory.name}` : 'Blog.'}
            </h1>
            <p className="pf-excerpt">
              {activeCategory 
                ? activeCategory.description || `Read articles categorized under "${activeCategory.name}".`
                : 'Field notes from building Laravel + Vue apps, scaling REST APIs, and learning my way around DevOps.'}
            </p>
          </div>

          {/* Categories Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mb-10 overflow-x-auto pb-2 scrollbar-none">
              <Link
                href="/blog"
                className={`px-4 py-2 border-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-250 ${
                  !activeCategory
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-[3px_3px_0px_0px_rgba(250,118,255,0.5)]'
                    : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                All Posts
              </Link>
              {categories.map((cat) => {
                const isActive = activeCategory?.id === cat.id;
                return (
                  <Link
                    key={cat.id}
                    href={`/blog/category/${cat.slug}`}
                    className={`px-4 py-2 border-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-250 ${
                      isActive
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-[3px_3px_0px_0px_rgba(250,118,255,0.5)]'
                        : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {cat.name} ({cat.posts_count})
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-8">
            {visibleBlogs.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-1 md:grid-cols-[120px_1fr] lg:grid-cols-[120px_1fr_240px] gap-6 md:gap-8 items-start lg:items-center border-2 border-black dark:border-white bg-white dark:bg-zinc-900/40 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 rounded-sm"
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
                    {post.categories && post.categories.map((category) => (
                      <span
                        key={category.slug}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.visit(`/blog/category/${category.slug}`);
                        }}
                        className="pf-badge px-3 h-[23px] bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-300 font-bold hover:bg-indigo-100 hover:border-indigo-300 dark:hover:bg-indigo-950/50 transition-colors"
                      >
                        📂 {category.name}
                      </span>
                    ))}
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
                  className="relative w-full aspect-[16/10] lg:w-[240px] lg:h-[150px] border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-zinc-950 transition-all duration-300 rounded-sm flex-shrink-0"
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
