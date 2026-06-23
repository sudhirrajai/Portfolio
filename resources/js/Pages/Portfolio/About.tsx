import React from 'react';
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { certifications } from '@/data/portfolio';
import { Footer } from '@/Components/Footer';

const About = ({ profile, experience, education, skills }) => {
  return (
    <>
      <SEOHead pageKey="about" />
      <div className="pf-page">
        <Navbar />
        <PageContainer className="max-w-5xl">
          <h1 className="pf-heading mb-6">
            About me.
          </h1>
          <p className="pf-excerpt mb-8">
            {profile.summary}
          </p>

          {profile.resume_path && (
            <div className="mb-16 md:mb-20">
              <a 
                href={`/${profile.resume_path}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-[11px] uppercase font-bold tracking-widest border-2 border-black dark:border-white px-8 py-3.5 bg-black text-white dark:bg-white dark:text-black hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all duration-300 active:scale-[0.98] shadow-[4px_4px_0px_0px_rgba(250,118,255,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,118,255,1)]"
              >
                <span>Download Active Resume</span>
                <span className="text-[14px] leading-none">↓</span>
              </a>
            </div>
          )}

          {/* Skills */}
          <section className="mb-16 md:mb-20">
            <div className="flex items-center gap-2 mb-8">
              <hr className="flex-1 pf-hr" />
              <h2 className="text-[11px] font-medium uppercase">Technologies</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {skills && skills.map((skillGroup) => (
                <div key={skillGroup.id}>
                  <h3 className="text-[11px] font-medium uppercase mb-3 text-gray-500 dark:text-gray-400">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((item) => (
                      <span
                        key={item}
                        className="pf-badge h-[28px]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="mb-16 md:mb-20">
            <div className="flex items-center gap-2 mb-8">
              <hr className="flex-1 pf-hr" />
              <h2 className="text-[11px] font-medium uppercase">Experience</h2>
            </div>
            <div className="flex flex-col gap-12">
              {experience && experience.map((job) => (
                <div key={job.company} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                  <div className="text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400">{job.period}</div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-medium tracking-[-1px] mb-1">{job.role}</h3>
                    <div className="text-[11px] font-medium uppercase mb-4 text-indigo-600 dark:text-indigo-400 font-bold">{job.company}</div>
                    <ul className="flex flex-col gap-2">
                      {job.bullets.map((b, i) => (
                        <li key={i} className="text-[15px] leading-snug pl-5 relative text-gray-700 dark:text-gray-300">
                          <span className="absolute left-0 text-indigo-600 dark:text-indigo-400">—</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-16 md:mb-20">
            <div className="flex items-center gap-2 mb-8">
              <hr className="flex-1 pf-hr" />
              <h2 className="text-[11px] font-medium uppercase">Education</h2>
            </div>
            <div className="flex flex-col gap-8">
              {education && education.map((e) => (
                <div key={e.school} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                  <div className="text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400">{e.period}</div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-medium tracking-[-0.5px]">{e.degree}</h3>
                    <div className="text-[11px] font-medium uppercase mt-1 text-gray-600 dark:text-gray-400">{e.school}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section>
            <div className="flex items-center gap-2 mb-8">
              <hr className="flex-1 pf-hr" />
              <h2 className="text-[11px] font-medium uppercase">Certifications</h2>
            </div>
            <ul className="flex flex-col gap-2">
              {certifications.map((c) => (
                <li key={c} className="text-[15px] pl-5 relative text-gray-700 dark:text-gray-300">
                  <span className="absolute left-0 text-indigo-600 dark:text-indigo-400">—</span>
                  {c}
                </li>
              ))}
            </ul>
          </section>
        </PageContainer>
        <Footer />
      </div>
    </>
  );
};

export default About;
