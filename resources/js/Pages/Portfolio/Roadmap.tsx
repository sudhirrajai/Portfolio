import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/Components/Navbar';
import { SEOHead } from '@/Components/SEOHead';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';

interface RoadmapMilestone {
  id: number;
  phase: 'Now' | 'Next' | 'Future';
  title: string;
  description: string;
  tags: string[];
  order_weight: number;
}

const Roadmap = ({ roadmaps }: { roadmaps: RoadmapMilestone[] }) => {
  // Sort roadmaps by phase weight: Now (1), Next (2), Future (3) then by order_weight
  const sortedRoadmaps = [...roadmaps].sort((a, b) => {
    const phaseWeights = { Now: 1, Next: 2, Future: 3 };
    const weightDiff = (phaseWeights[a.phase] || 4) - (phaseWeights[b.phase] || 4);
    if (weightDiff !== 0) return weightDiff;
    return a.order_weight - b.order_weight;
  });

  const getPhaseStyles = (phase: string) => {
    switch (phase) {
      case 'Now':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-500',
          dot: 'bg-emerald-500',
          labelBg: 'bg-emerald-500 text-black',
        };
      case 'Next':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-500',
          dot: 'bg-blue-500',
          labelBg: 'bg-blue-500 text-white',
        };
      default:
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/20',
          text: 'text-purple-700 dark:text-purple-400',
          border: 'border-purple-500',
          dot: 'bg-purple-500',
          labelBg: 'bg-purple-500 text-white',
        };
    }
  };

  return (
    <>
      <SEOHead title="Roadmap & Future Goals" description="A visual look into my current focus, next goals, and future career vision." />
      <link
        href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300">
        <Navbar />
        <PageContainer>
          {/* Header Area */}
          <div className="mb-16 text-left">
            <div className="inline-block bg-[#FA76FF] text-black text-[10px] font-bold px-2.5 py-1 mb-4 border border-black uppercase tracking-wider">
              Career Path & Milestones
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6 tracking-[-2px]">
              My Learning & Focus Roadmap.
            </h1>
            <p className="text-base md:text-lg max-w-2xl leading-relaxed text-zinc-600 dark:text-zinc-400">
              A transparent view of what I'm actively researching, building next, and exploring in the long term. This keeps me accountable and maps my engineering progress.
            </p>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative max-w-4xl mx-auto py-8">
            {/* Center Line for Desktop Timeline */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-black dark:bg-white z-0" />

            <div className="space-y-12">
              {sortedRoadmaps.map((milestone, index) => {
                const styles = getPhaseStyles(milestone.phase);
                const isEven = index % 2 === 0;

                return (
                  <div key={milestone.id} className="relative flex flex-col md:flex-row items-stretch w-full z-10">
                    {/* Circle Dot Anchor */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-[7px] md:-translate-x-2 top-8 w-4 h-4 rounded-full border-2 border-black dark:border-white bg-white dark:bg-black flex items-center justify-center z-20">
                      <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                    </div>

                    {/* Timeline Card Container */}
                    <div className={`w-full md:w-[calc(50%-2rem)] flex ${
                      isEven ? 'md:justify-end md:text-right md:ml-auto' : 'md:justify-start md:mr-auto'
                    } pl-10 md:pl-0`}>
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className={`w-full p-6 bg-white dark:bg-[#111] border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300`}
                      >
                        {/* Phase Flag */}
                        <div className={`inline-block px-2.5 py-0.5 border border-black dark:border-white text-[9px] font-bold uppercase tracking-wider mb-4 ${styles.labelBg}`}>
                          {milestone.phase}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold tracking-tight mb-2">
                          {milestone.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mb-4">
                          {milestone.description}
                        </p>

                        {/* Tags */}
                        {milestone.tags && milestone.tags.length > 0 && (
                          <div className={`flex flex-wrap gap-1.5 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                            {milestone.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                );
              })}

              {sortedRoadmaps.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                  <p className="text-zinc-500">No career roadmap goals entered yet. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        </PageContainer>
        <Footer />
      </div>
    </>
  );
};

export default Roadmap;
