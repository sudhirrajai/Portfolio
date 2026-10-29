import React from 'react';
import { Link } from "@inertiajs/react";
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';
import { CommentSection } from '@/Components/CommentSection';

const BlogPost = ({ post, comments = [], recaptcha_site_key, canonical_url, featured_image_url }: any) => {
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

  // Resolve absolute image & canonical URL
  const postImageUrl = featured_image_url || (post.image_path ? (post.image_path.startsWith('http') ? post.image_path : `/storage/${post.image_path}`) : '/placeholder.svg');
  const postCanonical = canonical_url || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '');

  // Generate Table of Contents and inject anchor IDs into headings
  const { processedContent, headings } = React.useMemo(() => {
    if (!post?.content) return { processedContent: '', headings: [] };

    const headingList: Array<{ id: string; text: string; level: number }> = [];
    let counter = 0;

    const modified = post.content.replace(/<(h[2-3])([^>]*)>(.*?)<\/\1>/gi, (match: string, tag: string, attrs: string, text: string) => {
      const cleanText = text.replace(/<[^>]*>/g, '').trim();
      if (!cleanText) return match;

      const slug = cleanText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `section-${++counter}`;

      headingList.push({
        id: slug,
        text: cleanText,
        level: tag.toLowerCase() === 'h2' ? 2 : 3
      });

      return `<${tag}${attrs} id="${slug}">${text}</${tag}>`;
    });

    return { processedContent: modified, headings: headingList };
  }, [post?.content]);

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

  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': postCanonical,
    },
    'headline': post.title,
    'description': post.excerpt,
    'image': [
      postImageUrl.startsWith('http') 
        ? postImageUrl 
        : (typeof window !== 'undefined' ? `${window.location.origin}${postImageUrl}` : `https://sudhirrajai.com${postImageUrl}`)
    ],
    'datePublished': post.created_at || post.date,
    'dateModified': post.updated_at || post.created_at || post.date,
    'author': {
      '@type': 'Person',
      'name': post.author_name || 'Sudhir Rajai',
      'url': typeof window !== 'undefined' ? window.location.origin : 'https://sudhirrajai.com',
      'jobTitle': 'Senior Full-Stack Developer & DevOps Engineer',
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Sudhir Rajai',
      'url': typeof window !== 'undefined' ? window.location.origin : 'https://sudhirrajai.com',
    },
    'keywords': post.tags && Array.isArray(post.tags) ? post.tags.join(', ') : (typeof post.tags === 'string' ? post.tags : undefined),
    'articleBody': post.content ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 1000) : post.excerpt,
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': typeof window !== 'undefined' ? window.location.origin : 'https://sudhirrajai.com' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': typeof window !== 'undefined' ? `${window.location.origin}/blog` : 'https://sudhirrajai.com/blog' },
      { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': postCanonical }
    ]
  };

  return (
    <>
      <SEOHead 
        title={post.title} 
        description={post.excerpt} 
        keywords={post.tags && Array.isArray(post.tags) ? post.tags.join(', ') : (typeof post.tags === 'string' ? post.tags : undefined)}
        image={postImageUrl}
        url={postCanonical}
        type="article"
        publishedTime={post.created_at || post.date}
        modifiedTime={post.updated_at || post.created_at}
        author={post.author_name || 'Sudhir Rajai'}
        schemaData={[blogPostSchema, breadcrumbsSchema]}
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

          {/* Table of Contents (SEO & Sitelinks Optimization) */}
          {headings.length >= 2 && (
            <div className="mb-10 p-5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <span>📑</span>
                <span>Table of Contents</span>
              </div>
              <nav className="flex flex-col gap-2">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                      h.level === 3 ? 'pl-4 text-xs opacity-90' : 'font-medium'
                    }`}
                  >
                    • {h.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Rich WYSIWYG HTML Block (Dark-mode Optimized via Global) */}
          <div 
            className="pf-prose" 
            dangerouslySetInnerHTML={{ __html: processedContent || post.content }} 
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
