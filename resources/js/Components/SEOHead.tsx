import { Head, usePage } from '@inertiajs/react';
import React from 'react';

interface SEOHeadProps {
  pageKey?: 'home' | 'work' | 'blog' | 'about' | 'contact';
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEOHead = ({ 
  pageKey,
  title, 
  description, 
  keywords,
  image = '/placeholder.svg',
  url = typeof window !== 'undefined' ? window.location.href : ''
}: SEOHeadProps) => {
  const { profile, seoSettings } = usePage().props as any;

  // Fallback or resolve using the Global DB SEO database
  const activeSeo = pageKey && seoSettings?.[pageKey] ? seoSettings[pageKey] : null;
  
  const finalTitle = title || activeSeo?.page_title || 'Portfolio';
  const finalDesc = description || activeSeo?.meta_description || profile?.tagline || '';
  const finalKeywords = keywords || activeSeo?.meta_keywords || 'Full Stack Developer, Portfolio';
  
  // Set suffix as developer's name dynamically
  const suffixName = profile?.name || 'DevPortfolio';
  const displayTitle = finalTitle.includes(suffixName) ? finalTitle : `${finalTitle} | ${suffixName}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{displayTitle}</title>
      <meta name="title" content={displayTitle} />
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};
