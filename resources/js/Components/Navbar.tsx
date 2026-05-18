import React from 'react';
import { createPortal } from 'react-dom';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { HeaderStatus } from '@/Components/HeaderStatus';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { url } = usePage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? url === '/' : url.startsWith(href);

  // Desktop Links excluding the custom dropdown
  const desktopLinks = [
    { href: '/', label: 'HOME' },
    { href: '/work', label: 'WORK' },
    { href: '/open-labs', label: 'OPEN LABS' },
    { href: '/blog', label: 'BLOG' },
  ];

  // Mobile navigation fully lists all options flatly
  const mobileLinks = [
    { href: '/', label: 'HOME' },
    { href: '/work', label: 'WORK' },
    { href: '/open-labs', label: 'OPEN LABS' },
    { href: '/blog', label: 'BLOG' },
    { href: '/about', label: 'ABOUT ME' },
    { href: '/roadmap', label: 'ROADMAP' },
    { href: '/contact', label: 'CONTACT' },
  ];

  return createPortal(
    <>
      <HeaderStatus />

      <nav className={`fixed top-8 left-4 md:left-8 ${isMobileMenuOpen ? 'z-[4000]' : 'z-[2000]'} flex items-center gap-0`}>
        {/* Brand Home Key */}
        <Link
          href="/"
          className="bg-black dark:bg-white text-white dark:text-black h-[34px] w-[34px] border border-black dark:border-white flex items-center justify-center font-bold text-[13px] transition-colors duration-200"
          aria-label="Home"
        >
          SR
        </Link>

        {/* Desktop Links Grid */}
        <div className="hidden md:flex items-center">
          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              id={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
              href={link.href}
              className={`relative overflow-hidden h-[34px] px-3 flex items-center text-[11px] font-medium uppercase border-l-0 border border-black dark:border-white leading-none group ${
                isActive(link.href) ? 'bg-[#FA76FF] text-black' : 'bg-white dark:bg-black text-black dark:text-white'
              }`}
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute inset-0 bg-[#FA76FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            </Link>
          ))}

          {/* About Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
          >
            <button
              id="nav-link-about"
              className={`relative overflow-hidden h-[34px] px-3 flex items-center text-[11px] font-medium uppercase border-l-0 border border-black dark:border-white leading-none group cursor-pointer ${
                isActive('/about') || isActive('/roadmap') ? 'bg-[#FA76FF] text-black' : 'bg-white dark:bg-black text-black dark:text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-1">
                ABOUT
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </span>
              <span className="absolute inset-0 bg-[#FA76FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            </button>

            {isAboutOpen && (
              <div className="absolute top-[33px] left-0 w-36 bg-white dark:bg-black border border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] flex flex-col z-[3000]">
                <Link
                  href="/about"
                  className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-left border-b border-black dark:border-white hover:bg-[#FA76FF] hover:text-black transition-colors ${
                    isActive('/about') ? 'bg-[#FA76FF]/40 text-black dark:text-white' : 'text-black dark:text-white hover:text-black'
                  }`}
                >
                  About Me
                </Link>
                <Link
                  href="/roadmap"
                  className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-left hover:bg-[#FA76FF] hover:text-black transition-colors ${
                    isActive('/roadmap') ? 'bg-[#FA76FF]/40 text-black dark:text-white' : 'text-black dark:text-white hover:text-black'
                  }`}
                >
                  Roadmap
                </Link>
              </div>
            )}
          </div>

          {/* Contact Key */}
          <Link
            id="nav-link-contact"
            href="/contact"
            className={`relative overflow-hidden h-[34px] px-3 flex items-center text-[11px] font-medium uppercase border-l-0 border border-black dark:border-white leading-none group ${
              isActive('/contact') ? 'bg-[#FA76FF] text-black' : 'bg-white dark:bg-black text-black dark:text-white'
            }`}
          >
            <span className="relative z-10">CONTACT</span>
            <span className="absolute inset-0 bg-[#FA76FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
          </Link>
        </div>

        {/* Theme Toggler */}
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

        {/* Mobile Flyout */}
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
              {mobileLinks.map((link, i) => (
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

