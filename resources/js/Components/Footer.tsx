import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export const Footer = () => {
  const { profile } = usePage().props as any;
  const displayName = profile?.name ? profile.name.toUpperCase() : 'SUDHIR RAJAI';
  const tagline = profile?.summary ? profile.summary.substring(0, 100) + '...' : 'Building fast, dynamic, and scalable full-stack web applications.';

  return (
    <footer className="bg-white dark:bg-[#0a0a0a] border-t border-black dark:border-white/20 py-12 mt-20 font-sans text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
              {displayName}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs leading-relaxed line-clamp-2">
              {tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:text-[#FA76FF] transition-colors">HOME</Link>
            <Link href="/work" className="hover:text-[#FA76FF] transition-colors">WORK</Link>
            <Link href="/blog" className="hover:text-[#FA76FF] transition-colors">BLOG</Link>
            <Link href="/about" className="hover:text-[#FA76FF] transition-colors">ABOUT</Link>
            <Link href="/contact" className="hover:text-[#FA76FF] transition-colors">CONTACT</Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
          <p>© {new Date().getFullYear()} {profile?.name || 'Sudhir Rajai'}. All rights reserved.</p>
          <div className="flex gap-6 uppercase tracking-widest text-[10px]">
            {profile?.social_links?.github && (
              <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="hover:text-[#FA76FF] dark:hover:text-white transition-colors">GitHub</a>
            )}
            {profile?.social_links?.linkedin && (
              <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#FA76FF] dark:hover:text-white transition-colors">LinkedIn</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
