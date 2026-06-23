import React from 'react';
import { Link } from "@inertiajs/react";
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';

const BlogPost = ({ post }) => {
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

  return (
    <>
      <SEOHead title={post.title} description={post.excerpt} />
      <div className="pf-page">
        <Navbar />
        <PageContainer className="max-w-3xl py-8">
          
          {/* Metadata Row */}
          <div className="flex items-center gap-2 mb-6 text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
            <span>{post.date}</span>
            <span className="text-indigo-600 dark:text-indigo-400">•</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{post.read_time}</span>
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
                className="w-full h-full object-cover"
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

          {/* Action Button Group */}
          <Link
            href="/blog"
            className="pf-btn px-8 py-4 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> All posts
          </Link>
        </PageContainer>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
