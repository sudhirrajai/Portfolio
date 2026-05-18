import React from 'react';
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { ContactForm } from '@/Components/ContactForm';
import { Footer } from '@/Components/Footer';
import { BookingWidget } from '@/Components/BookingWidget';

const ContactRow = ({ label, value, href }: { label: string; value: string; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center justify-between border-b border-black dark:border-white/30 last:border-b-0 py-5 md:py-6 hover:bg-[#FA76FF] hover:text-black transition-all px-6"
  >
    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-black/60">{label}</span>
    <span className="text-lg md:text-2xl font-medium tracking-[-0.5px] group-hover:translate-x-[-6px] transition-transform">
      {value} →
    </span>
  </a>
);


const Contact = ({ profile, isBookingActive }) => {
  if (!profile) return null;
  return (
    <>
      <SEOHead pageKey="contact" />
      <link
        href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="pf-page">
        <Navbar />
        <PageContainer>
          <div className="mb-12 md:mb-16">
            <h1 className="pf-heading mb-6 inline-flex flex-wrap items-center gap-2">
              <span className="border pf-border px-4 py-2">Let's</span>
              <span className="bg-[#ff6bff] border pf-border px-4 py-2 rounded-[40px] text-black">build</span>
              <span>something.</span>
            </h1>
            <p className="pf-excerpt">
              Open to full-time, freelance, and collaborations on full-stack web apps, APIs, and DevOps work.
              Drop a message below or reach me directly.
            </p>
            {isBookingActive && (
              <button
                onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest border pf-border px-5 py-3 rounded-[40px] hover:bg-[#ff6bff] dark:hover:bg-[#ff6bff] hover:text-black dark:hover:text-black transition-all group"
              >
                📅 Book 1-on-1 Call
                <span className="group-hover:translate-y-[2px] transition-transform">↓</span>
              </button>
            )}
          </div>

          {(() => {
            const linkedin = profile.social_links?.linkedin;
            const github = profile.social_links?.github;
            const hasChannels = !!(profile.email || profile.phone || linkedin || github);
            
            const getLinkUsername = (url: string, fallback: string) => {
              if (!url) return fallback;
              try {
                const parsed = new URL(url);
                const segments = parsed.pathname.split('/').filter(Boolean);
                return segments.length > 0 ? segments[segments.length - 1] : fallback;
              } catch(e) {
                return fallback;
              }
            };

            return (
              <div className={hasChannels ? "grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 md:gap-16 items-start" : "max-w-2xl mx-auto"}>
                {/* Form */}
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <hr className="flex-1 pf-hr" />
                    <h2 className="text-[11px] font-medium uppercase">Send a message</h2>
                  </div>
                  <ContactForm />
                </div>

                {/* Direct channels */}
                {hasChannels && (
                  <div>
                    <div className="flex items-center gap-2 mb-8">
                      <hr className="flex-1 pf-hr" />
                      <h2 className="text-[11px] font-medium uppercase">Or reach me directly</h2>
                    </div>
                    <div className="border-2 border-black dark:border-white bg-white dark:bg-zinc-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] rounded-sm overflow-hidden">
                      {profile.email && (
                        <ContactRow label="Email" value={profile.email} href={`mailto:${profile.email}`} />
                      )}
                      {profile.phone && (
                        <ContactRow
                          label="Phone"
                          value={profile.phone}
                          href={`tel:${profile.phone.replace(/\s/g, '')}`}
                        />
                      )}
                      {linkedin && (
                        <ContactRow label="LinkedIn" value={getLinkUsername(linkedin, 'LinkedIn')} href={linkedin} />
                      )}
                      {github && (
                        <ContactRow label="GitHub" value={getLinkUsername(github, 'GitHub')} href={github} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Booking System Integration */}
          {isBookingActive && (
            <div id="booking-section" className="mt-20 md:mt-28 scroll-mt-12">
              <div className="flex items-center gap-2 mb-8">
                <hr className="flex-1 pf-hr" />
                <h2 className="text-[11px] font-medium uppercase">Book a 1-on-1 Call</h2>
              </div>
              <BookingWidget />
            </div>
          )}

        </PageContainer>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
