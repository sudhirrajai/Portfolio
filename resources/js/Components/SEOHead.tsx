import { Head, usePage } from '@inertiajs/react';
import React from 'react';

interface SEOHeadProps {
  pageKey?: 'home' | 'work' | 'blog' | 'about' | 'contact';
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'software';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  schemaData?: Record<string, any> | Array<Record<string, any>>;
}

export const SEOHead = ({ 
  pageKey,
  title, 
  description, 
  keywords,
  image = '/placeholder.svg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  schemaData
}: SEOHeadProps) => {
  const { profile, seoSettings } = usePage().props as any;

  // Resolve current absolute URL
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '');

  // Fallback or resolve using the Global DB SEO database
  const activeSeo = pageKey && seoSettings?.[pageKey] ? seoSettings[pageKey] : null;
  
  const finalTitle = title || activeSeo?.page_title || 'Portfolio';
  const finalDesc = description || activeSeo?.meta_description || profile?.tagline || profile?.summary || '';
  const finalKeywords = keywords || activeSeo?.meta_keywords || 'Full Stack Developer, Software Engineer, React, Laravel, Portfolio';
  
  // Set suffix as developer's name dynamically
  const suffixName = profile?.name || 'DevPortfolio';
  const displayTitle = finalTitle.includes(suffixName) ? finalTitle : `${finalTitle} | ${suffixName}`;
  const authorName = author || profile?.name || suffixName;

  // Resolve image URL
  const absoluteImage = image.startsWith('http') 
    ? image 
    : (typeof window !== 'undefined' ? `${window.location.origin}${image}` : image);

  // Default Person & WebSite schema if none provided
  const defaultSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': displayTitle,
      'url': currentUrl,
      'description': finalDesc,
      'author': {
        '@type': 'Person',
        'name': authorName,
      }
    },
    ...(profile ? [{
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': profile.name,
      'jobTitle': profile.role || 'Full-Stack Developer',
      'url': typeof window !== 'undefined' ? window.location.origin : currentUrl,
      'email': profile.email || undefined,
      'sameAs': profile.social_links ? Object.values(profile.social_links).filter(Boolean) : [],
      'knowsAbout': ['Web Development', 'React', 'Laravel', 'TypeScript', 'PHP', 'JavaScript', 'REST APIs', 'Software Architecture']
    }] : [])
  ];

  const finalSchema = schemaData ? (Array.isArray(schemaData) ? schemaData : [schemaData]) : defaultSchemas;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{displayTitle}</title>
      <meta name="title" content={displayTitle} />
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={authorName} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {currentUrl && <link rel="canonical" href={currentUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content={suffixName} />
      <meta property="og:locale" content="en_US" />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' && authorName && <meta property="article:author" content={authorName} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {currentUrl && <meta name="twitter:url" content={currentUrl} />}
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema.length === 1 ? finalSchema[0] : finalSchema)}
      </script>
    </Head>
  );
};
