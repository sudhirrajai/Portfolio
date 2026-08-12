import React from 'react';
import { Link, usePage } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';
import { AlertTriangle, ShieldAlert, FileQuestion, RefreshCw, ServerCrash } from 'lucide-react';

interface ErrorPageProps {
  status?: number;
  message?: string;
}

export default function ErrorPage({ status = 404, message }: ErrorPageProps) {
  const { url } = usePage();

  const getErrorDetails = (code: number) => {
    switch (code) {
      case 404:
        return {
          title: '404 - Page Not Found',
          badge: 'Error 404',
          headlinePart1: 'Page',
          headlinePart2: 'Not Found.',
          description: message || "The requested path could not be located or may have been relocated. Let's get you back to safety.",
          icon: FileQuestion,
          primaryCta: { label: 'Back to Home', href: '/' },
          secondaryCta: { label: 'Explore Projects', href: '/work' },
        };
      case 403:
        return {
          title: '403 - Forbidden Access',
          badge: 'Access Denied',
          headlinePart1: 'Restricted',
          headlinePart2: 'Zone.',
          description: message || "You don't have authorization to access this area. If you believe this is a mistake, verify your account access.",
          icon: ShieldAlert,
          primaryCta: { label: 'Return to Home', href: '/' },
          secondaryCta: { label: 'Go to Login', href: '/login' },
        };
      case 500:
        return {
          title: '500 - Server Error',
          badge: 'System Error 500',
          headlinePart1: 'Server',
          headlinePart2: 'Glitch.',
          description: message || "An unexpected error occurred on our server. Our team has been notified. Please try refreshing in a moment.",
          icon: ServerCrash,
          primaryCta: { label: 'Back to Home', href: '/' },
          secondaryCta: { label: 'Reload Page', action: 'reload' },
        };
      case 503:
        return {
          title: '503 - Service Unavailable',
          badge: 'Maintenance',
          headlinePart1: 'System',
          headlinePart2: 'Offline.',
          description: message || "We are currently performing brief scheduled maintenance or updates. Please check back shortly.",
          icon: AlertTriangle,
          primaryCta: { label: 'Reload Page', action: 'reload' },
          secondaryCta: { label: 'Go to Home', href: '/' },
        };
      case 419:
        return {
          title: '419 - Page Expired',
          badge: 'Session Timeout 419',
          headlinePart1: 'Page',
          headlinePart2: 'Expired.',
          description: message || "Your security token or active session timed out due to inactivity. Reloading will refresh your session.",
          icon: RefreshCw,
          primaryCta: { label: 'Refresh Session', action: 'reload' },
          secondaryCta: { label: 'Return Home', href: '/' },
        };
      default:
        return {
          title: `${code} - Error`,
          badge: `Status ${code}`,
          headlinePart1: 'Unexpected',
          headlinePart2: 'Error.',
          description: message || "An unexpected error was encountered. We're working on fixing it.",
          icon: AlertTriangle,
          primaryCta: { label: 'Back to Home', href: '/' },
          secondaryCta: { label: 'Reload', action: 'reload' },
        };
    }
  };

  const details = getErrorDetails(status);
  const IconComponent = details.icon;

  const handleAction = (cta: { label: string; href?: string; action?: string }) => {
    if (cta.action === 'reload') {
      window.location.reload();
    }
  };

  return (
    <>
      <SEOHead 
        title={details.title}
        description={details.description}
      />
      <div className="pf-page flex flex-col justify-between min-h-screen">
        <div className="w-full">
          <Navbar />
          <PageContainer className="flex flex-col items-center justify-center text-center min-h-[60vh] py-12">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full max-w-2xl mx-auto"
            >
              {/* Icon & Badge Header */}
              <div className="flex flex-col items-center justify-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-full border-2 border-black dark:border-white bg-[#ff6bff]/10 dark:bg-[#ff6bff]/20 flex items-center justify-center text-[#ff6bff] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                  <IconComponent className="w-7 h-7 text-black dark:text-white" />
                </div>
                <span className="bg-[#ff6bff] border-2 border-black dark:border-white px-4 py-1.5 rounded-[20px] text-black text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  {details.badge}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-none mb-8 tracking-[-3px] flex flex-wrap justify-center items-center gap-2 sm:gap-3">
                <span className="border-2 border-black dark:border-white px-4 py-2 md:px-6 md:py-3 bg-white dark:bg-black text-black dark:text-white">
                  {details.headlinePart1}
                </span>
                <span className="bg-[#ff6bff] border-2 border-black dark:border-white px-4 py-2 md:px-6 md:py-3 rounded-[20px] md:rounded-[45px] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {details.headlinePart2}
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-lg leading-relaxed mb-10">
                {details.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                {details.primaryCta.href ? (
                  <Link
                    href={details.primaryCta.href}
                    className="px-6 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black hover:bg-[#ff6bff] dark:hover:bg-[#ff6bff] hover:text-black dark:hover:text-black transition-all duration-300 active:scale-[0.97] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  >
                    {details.primaryCta.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleAction(details.primaryCta)}
                    className="px-6 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black hover:bg-[#ff6bff] dark:hover:bg-[#ff6bff] hover:text-black dark:hover:text-black transition-all duration-300 active:scale-[0.97] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  >
                    {details.primaryCta.label}
                  </button>
                )}

                {details.secondaryCta.href ? (
                  <Link
                    href={details.secondaryCta.href}
                    className="px-6 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest bg-transparent text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 active:scale-[0.97] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  >
                    {details.secondaryCta.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleAction(details.secondaryCta)}
                    className="px-6 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest bg-transparent text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 active:scale-[0.97] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  >
                    {details.secondaryCta.label}
                  </button>
                )}
              </div>
            </motion.div>
          </PageContainer>
        </div>
        <Footer />
      </div>
    </>
  );
}
