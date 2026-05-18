import React from 'react';
import { Link, router } from "@inertiajs/react";
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';

const renderMarkdown = (content: string) => {
  if (!content) return null;
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeLines: string[] = [];
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    // Code block check
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const codeText = codeLines.join('\n');
        codeLines = [];
        elements.push(
          <pre key={`code-${index}`} className="bg-zinc-950 text-[#FA76FF] font-mono text-xs p-4 rounded-sm border-2 border-black dark:border-white overflow-x-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,118,255,1)] my-3">
            <code>{codeText}</code>
          </pre>
        );
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    // Headers
    if (line.startsWith('#### ')) {
      elements.push(<h4 key={index} className="text-sm font-bold uppercase tracking-wider text-black dark:text-white mt-4">{line.replace('#### ', '')}</h4>);
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-lg font-bold text-black dark:text-white mt-4">{line.replace('### ', '')}</h3>);
      return;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={index} className="flex gap-2 items-start pl-2">
          <span className="text-emerald-500 font-bold">•</span>
          <span>{line.substring(2)}</span>
        </div>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={index} className="h-2" />);
      return;
    }

    elements.push(<p key={index} className="font-normal">{line}</p>);
  });

  return elements;
};

const ensureArray = (val: any): any[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    if (val.includes(',')) {
      return val.split(',').map(s => s.trim()).filter(s => s);
    }
    if (val.trim()) {
      return [val.trim()];
    }
  }
  return [];
};

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
        <aside className="flex w-[540px] flex-col justify-start items-start fixed h-screen box-border right-0 top-0 bg-white dark:bg-[#111] text-black dark:text-white overflow-y-auto border-l pf-border-soft max-lg:relative max-lg:w-full max-lg:h-auto max-lg:right-auto max-lg:top-0 max-lg:overflow-y-visible transition-colors duration-300 pb-44">
          <div className="flex w-full flex-col items-start gap-10 relative p-10 max-lg:w-full max-lg:px-6 max-lg:py-8 max-lg:gap-8 opacity-0 animate-fade-in [animation-delay:200ms]">
            
            {/* Header Block */}
            <div className="flex flex-col items-start gap-5 self-stretch relative">
              <div className="flex items-center gap-2">
                <div className="pf-badge px-3 h-[23px]">
                  <div className="text-[10px] font-bold uppercase tracking-wider leading-none">{project.year}</div>
                </div>
                {project.is_open_source ? (
                  <div className="pf-badge px-3 h-[23px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                    <div className="text-[10px] font-bold uppercase tracking-wider leading-none">Open Source</div>
                  </div>
                ) : (
                  <div className="pf-badge px-3 h-[23px]">
                    <div className="text-[10px] font-bold uppercase tracking-wider leading-none text-indigo-600 dark:text-indigo-400">Portfolio</div>
                  </div>
                )}
              </div>
              <header>
                <h1 className="pf-heading leading-[54.88px] text-[56px] max-md:text-[42px] max-md:leading-[38px] max-md:tracking-[-1.68px] max-sm:text-[36px] max-sm:leading-[32px] max-sm:tracking-[-1.28px]">
                  {project.title}
                </h1>
              </header>
              <div className="text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wide">
                {ensureArray(project.stack).join(' • ')}
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
                {ensureArray(project.highlights).map((h, i) => (
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

            {/* Open Source Detailed Documentation */}
            {project.is_open_source && project.open_source_content && (
              <section className="flex flex-col items-start gap-4 self-stretch">
                <div className="flex flex-col items-start gap-4 self-stretch w-full">
                  <hr className="pf-hr w-full" />
                  <h2 className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider">LABS / GETTING STARTED</h2>
                </div>
                <div className="self-stretch flex flex-col gap-3.5 text-gray-800 dark:text-gray-300 text-[15px] font-normal leading-relaxed tracking-[-0.2px]">
                  {renderMarkdown(project.open_source_content)}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Footer Actions */}
          <div className="fixed bottom-0 right-0 w-[540px] bg-white/95 dark:bg-[#111]/95 backdrop-blur-sm py-6 border-t pf-border-soft z-30 max-lg:relative max-lg:w-full max-lg:py-6 max-lg:border-t max-lg:bg-transparent max-lg:dark:bg-transparent max-lg:border-none">
            <div className="px-10 max-lg:px-6 flex flex-col gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest bg-[#3DDC97] text-black hover:bg-[#32c485] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 active:scale-[0.97]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Get Source Code on GitHub
                </a>
              )}
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-1.5 py-3 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
              >
                <span>←</span> Back to all work
              </Link>

            </div>
          </div>
        </aside>
      </main>
    </>
  );
};

export default ProjectDetail;
