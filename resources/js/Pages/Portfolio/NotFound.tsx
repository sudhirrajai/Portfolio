import React, { useEffect } from 'react';
import { Link, usePage } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';

const NotFound = () => {
  const { url } = usePage();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", url);
    }
  }, [url]);

  return (
    <>
      <SEOHead 
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Let's get you back on track."
      />
      <div className="pf-page flex flex-col justify-between">
        <div className="w-full">
          <Navbar />
          <PageContainer className="flex flex-col items-center justify-center text-center min-h-[50vh]">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full max-w-2xl mx-auto"
            >
              {/* Styled 404 badge */}
              <div className="flex items-center justify-center mb-6">
                <span className="bg-[#ff6bff] border-2 border-black dark:border-white px-4 py-1.5 rounded-[20px] text-black text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  Error 404
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-none mb-8 tracking-[-3px] flex flex-wrap justify-center items-center gap-2 sm:gap-3">
                <span className="border-2 border-black dark:border-white px-4 py-2 md:px-6 md:py-3 bg-white dark:bg-black">
                  Page
                </span>
                <span className="bg-[#ff6bff] border-2 border-black dark:border-white px-4 py-2 md:px-6 md:py-3 rounded-[20px] md:rounded-[45px] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  Not Found.
                </span>
              </h1>

              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-md leading-relaxed mb-10">
                The path you requested does not exist or has been moved. Let's get you back to the home page or showcase items.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black hover:bg-[#ff6bff] dark:hover:bg-[#ff6bff] hover:text-black dark:hover:text-black transition-all duration-300 active:scale-[0.97]"
                >
                  Go to Home
                </Link>
                <Link
                  href="/work"
                  className="px-6 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 active:scale-[0.97]"
                >
                  Explore Work
                </Link>
              </div>
            </motion.div>
          </PageContainer>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
