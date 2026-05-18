import React from 'react';
import { Link, router } from "@inertiajs/react";
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';

const ProjectDetail = ({ project }) => {
  if (!project) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white dark:bg-[#0a0a0a] text-black dark:text-white px-4 transition-colors duration-300">
        <SEOHead title="Project Not Found" description="This project doesn't exist." />
        <Navbar />
        <div className="text-center mt-20">
          <h1 className="text-4xl font-medium mb-4 text-black dark:text-white">Project Not Found</h1>
          <button
            onClick={() => router.visit('/')}
            className="pf-btn px-6 py-3 text-sm font-bold"
          >
            Back to Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={project.title} description={project.summary} />
      <link
        href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Navbar />

      <main className="flex h-screen justify-center items-start w-full relative bg-white dark:bg-[#0a0a0a] mx-auto my-0 max-lg:flex-col max-lg:h-auto transition-colors duration-300">
        {/* Visual Cover */}
        <div
          className="flex flex-col justify-end items-start fixed h-screen w-[calc(100%-540px)] pl-[49px] pr-[590px] pt-[calc(100vh-97px)] pb-12 left-0 top-0 overflow-hidden max-lg:relative max-lg:w-full max-lg:h-[400px] max-lg:pt-80 max-lg:pb-6 max-lg:px-4 max-lg:right-0 max-sm:h-[300px] max-sm:pt-60 max-sm:pb-6 max-sm:px-4 border-r pf-border-soft"
          style={!project.image_path ? { backgroundColor: project.color || '#333' } : {}}
          role="img"
          aria-label={`${project.title} cover`}
        >
          {project.image_path ? (
             <>
               <img src={`/storage/${project.image_path}`} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/30 z-[5]" />
             </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 z-[5]" />
          )}
          <div
            className="absolute inset-0 flex items-center justify-center animate-[zoom-in_1.2s_ease-out_forwards] z-10 px-4"
          >
            <span className={`text-[80px] sm:text-[100px] md:text-[120px] lg:text-[150px] font-medium leading-[0.9] tracking-[-5px] text-center break-words ${
              project.image_path ? 'text-white select-none' : 'text-black select-none mix-blend-overlay'
            }`}>
              {project.title}
            </span>
          </div>
        </div>

        {/* Sidebar Details */}
        <aside className="flex w-[540px] flex-col justify-start items-start fixed h-screen box-border right-0 top-0 bg-white dark:bg-[#111] text-black dark:text-white overflow-y-auto border-l pf-border-soft max-lg:relative max-lg:w-full max-lg:h-auto max-lg:right-auto max-lg:top-0 max-lg:overflow-y-visible transition-colors duration-300">
          <div className="flex w-full flex-col items-start gap-10 relative p-10 pb-32 max-lg:w-full max-lg:px-6 max-lg:py-8 max-lg:pb-10 max-lg:gap-8 opacity-0 animate-fade-in [animation-delay:200ms]">
            
            {/* Header Block */}
            <div className="flex flex-col items-start gap-5 self-stretch relative">
              <div className="flex items-center gap-2">
                <div className="pf-badge px-3 h-[23px]">
                  <div className="text-[10px] font-bold uppercase tracking-wider leading-none">{project.year}</div>
                </div>
                <div className="pf-badge px-3 h-[23px]">
                  <div className="text-[10px] font-bold uppercase tracking-wider leading-none text-indigo-600 dark:text-indigo-400">Portfolio</div>
                </div>
              </div>
              <header>
                <h1 className="pf-heading leading-[54.88px] text-[56px] max-md:text-[42px] max-md:leading-[38px] max-md:tracking-[-1.68px] max-sm:text-[36px] max-sm:leading-[32px] max-sm:tracking-[-1.28px]">
                  {project.title}
                </h1>
              </header>
              <div className="text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wide">
                {project.stack.join(' • ')}
              </div>
            </div>

            {/* Summary Block */}
            <section className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex flex-col items-start gap-4 self-stretch w-full">
                <hr className="pf-hr w-full" />
                <h2 className="text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider">ABOUT THIS PROJECT</h2>
              </div>
              <p className="self-stretch text-gray-800 dark:text-gray-200 text-[17px] font-normal leading-relaxed tracking-[-0.2px]">
                {project.summary}
              </p>
            </section>

            {/* Highlights Block */}
            <section className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex flex-col items-start gap-4 self-stretch w-full">
                <hr className="pf-hr w-full" />
                <h2 className="text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider">HIGHLIGHTS & ACHIEVEMENTS</h2>
              </div>
              <ul className="self-stretch flex flex-col gap-3.5">
                {project.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="text-gray-800 dark:text-gray-300 text-[16px] font-normal leading-relaxed tracking-[-0.2px] pl-6 relative"
                  >
                    <span className="absolute left-0 top-0 text-[#FA76FF] font-bold">—</span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Fixed Footer Navigation */}
          <div className="fixed bottom-0 right-0 w-[540px] bg-white dark:bg-[#111] py-6 border-t pf-border-soft z-30 max-lg:relative max-lg:w-full max-lg:py-6 max-lg:border-t max-lg:bg-transparent max-lg:dark:bg-transparent max-lg:border-none">
            <div className="px-10 max-lg:px-6">
              <Link
                href="/"
                className="pf-btn w-full group"
              >
                <span className="group-hover:-translate-x-1 transition-transform mr-1.5">←</span> Back to all work
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
};

export default ProjectDetail;
