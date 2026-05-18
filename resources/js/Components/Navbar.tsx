import React from 'react';
import { createPortal } from 'react-dom';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { HeaderStatus } from '@/Components/HeaderStatus';

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/work', label: 'WORK' },
  { href: '/blog', label: 'BLOG' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { url } = usePage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? url === '/' : url.startsWith(href);

  return createPortal(
    <>
      <HeaderStatus />

      <nav className={`fixed top-8 left-4 md:left-8 ${isMobileMenuOpen ? 'z-[4000]' : 'z-[2000]'} flex items-center gap-0`}>
        <Link
          href="/"
          className="bg-black dark:bg-white text-white dark:text-black h-[34px] w-[34px] border border-black dark:border-white flex items-center justify-center font-bold text-[13px] transition-colors duration-200"
          aria-label="Home"
        >
          SR
        </Link>

        <div className="hidden md:flex items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              id={`nav-link-${link.label.toLowerCase()}`}
              href={link.href}
              className={`relative overflow-hidden h-[34px] px-3 flex items-center text-[11px] font-medium uppercase border-l-0 border border-black dark:border-white leading-none group ${
                isActive(link.href) ? 'bg-[#FA76FF] text-black' : 'bg-white dark:bg-black text-black dark:text-white'
              }`}
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute inset-0 bg-[#FA76FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            </Link>
          ))}
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative overflow-hidden h-[34px] px-3 flex items-center justify-center border-l-0 border border-black dark:border-white group bg-white dark:bg-black text-black dark:text-white cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            <span className="relative z-10">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FA76FF]" /> : <Moon className="w-4 h-4" />}
            </span>
            <span className="absolute inset-0 bg-[#FA76FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
          </button>
        )}

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[3000] flex flex-col animate-in slide-in-from-top duration-300">
            <div className="bg-[#1A1A1A] flex items-center justify-between px-6 py-12">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 px-3 py-1.5 border border-white/20 hover:border-white rounded-sm transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#FA76FF]" /> : <Moon className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}</span>
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white text-[11px] font-medium uppercase tracking-wider border border-white/20 px-3 py-1.5 rounded-sm hover:border-white transition-colors"
              >
                CLOSE
              </button>
            </div>
            <div className="flex-1 flex flex-col bg-white">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex-1 flex items-center justify-center text-[17px] font-medium uppercase border-b border-black tracking-[-0.34px] animate-fade-in ${
                    isActive(link.href) ? 'bg-[#FA76FF]' : ''
                  } text-[#1A1A1A]`}
                  style={{ animationDelay: `${0.1 * (i + 1)}s`, animationFillMode: 'both' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative overflow-hidden bg-white text-black h-[34px] px-3 border border-l-0 border-black flex items-center justify-center text-[11px] font-medium uppercase leading-none group cursor-pointer"
        >
          <span className="relative z-10">MENU</span>
          <span className="absolute inset-0 bg-[#FA76FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
        </button>
      </nav>
    </>,
    document.body,
  );
};
