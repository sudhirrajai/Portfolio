import React from 'react';
import { Link } from "@inertiajs/react";
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';
import { CommentSection } from '@/Components/CommentSection';

const BlogPost = ({ post, comments = [], recaptcha_site_key }: any) => {
  const [activePreviewImage, setActivePreviewImage] = React.useState<{ src: string; alt: string } | null>(null);

  if (!post) {
    return (
      <div className="pf-page">
        <SEOHead title="Post not found" description="This blog post doesn't exist." />
        <Navbar />
        <PageContainer>
          <h1 className="text-4xl font-medium mb-6">Post not found.</h1>
          <Link
            href="/blog"
            className="pf-btn px-6 py-3"
          >
            ← Back to blog
          </Link>
        </PageContainer>
      </div>
    );
  }

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      setActivePreviewImage({
        src: img.src,
        alt: img.alt || post.title
      });
    }
  };

  return (
    <>
      <SEOHead 
        title={post.title} 
        description={post.excerpt} 
        keywords={post.tags && Array.isArray(post.tags) ? post.tags.join(', ') : (typeof post.tags === 'string' ? post.tags : undefined)} 
      />
      <div className="pf-page">
        <Navbar />
        <PageContainer className="max-w-3xl py-8">
          
          {/* Metadata Row */}
          <div className="flex items-center gap-2 flex-wrap mb-6 text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
            <span>{post.date}</span>
            <span className="text-indigo-600 dark:text-indigo-400">•</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{post.read_time}</span>
            {post.categories && post.categories.map((category) => (
              <React.Fragment key={category.slug}>
                <span className="text-indigo-600 dark:text-indigo-400">•</span>
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                >
                  📂 {category.name}
                </Link>
              </React.Fragment>
            ))}
          </div>

          {/* Main Heading */}
          <h1 className="pf-heading mb-8 leading-[1.05]">
            {post.title}
          </h1>

          {/* Featured Hero Card */}
          <div
            className="aspect-[2/1] w-full mb-12 border-2 border-black dark:border-white bg-[#222] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 overflow-hidden flex items-center justify-center relative"
            style={{ backgroundColor: post.color || '#222' }}
          >

            {post.image_path ? (
              <img 
                src={`/storage/${post.image_path}`} 
                alt={post.title} 
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setActivePreviewImage({ src: `/storage/${post.image_path}`, alt: post.title })}
              />
            ) : (
              <div className="w-24 h-24 border-2 border-white/10 rounded-full animate-pulse pointer-events-none" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
          </div>

          {/* Lead Paragraph (Excerpt) */}
          <p className="text-xl md:text-2xl leading-relaxed mb-10 font-medium text-gray-900 dark:text-gray-100 tracking-tight border-l-4 border-[#FA76FF] pl-5 italic">
            {post.excerpt}
          </p>

          {/* Rich WYSIWYG HTML Block (Dark-mode Optimized via Global) */}
          <div 
            className="pf-prose" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            onClick={handleContentClick}
          />

          {/* Bottom Tags list */}
          <div className="flex flex-wrap gap-2 mb-12 border-t border-black/10 dark:border-white/10 pt-8">
            {post.tags && post.tags.map((tag) => (
              <span
                key={tag}
                className="pf-badge py-1 px-3"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comment Section */}
          <CommentSection
            postSlug={post.slug}
            comments={comments}
            recaptchaSiteKey={recaptcha_site_key}
          />

          {/* Action Button Group */}
          <Link
            href="/blog"
            className="pf-btn px-8 py-4 group mt-8 inline-flex"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> All posts
          </Link>
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

export default BlogPost;
