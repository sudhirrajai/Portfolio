import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface TimelineItem {
  id: number;
  type: 'experience' | 'education';
  title: string;       // Role or Degree
  subtitle: string;    // Company or School
  period: string;      // "2022 — Present" etc
  bullets?: string[];  // Work descriptions
  created_at: string;
}

interface TimelineProps {
  experience: any[];
  education: any[];
}

export const Timeline: React.FC<TimelineProps> = ({ experience = [], education = [] }) => {
  const [filter, setFilter] = useState<'all' | 'experience' | 'education'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Helper to extract the starting year from period string (e.g., "2022 — Present" -> 2022)
  const getStartYear = (periodStr: string): number => {
    const match = periodStr.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Combine and format the timeline data
  const combinedData: TimelineItem[] = [
    ...experience.map((exp) => ({
      id: exp.id,
      type: 'experience' as const,
      title: exp.role,
      subtitle: exp.company,
      period: exp.period,
      bullets: exp.bullets || [],
      created_at: exp.created_at
    })),
    ...education.map((edu) => ({
      id: edu.id,
      type: 'education' as const,
      title: edu.degree,
      subtitle: edu.school,
      period: edu.period,
      created_at: edu.created_at
    }))
  ];

  // Sort chronologically (newest start year first)
  const sortedData = combinedData.sort((a, b) => {
    const yearA = getStartYear(a.period);
    const yearB = getStartYear(b.period);
    
    if (yearA !== yearB) {
      return yearB - yearA; // descending
    }
    
    // Fallback to database creation timestamp
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Filter items
  const filteredData = sortedData.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const toggleExpand = (uniqueId: string) => {
    if (expandedId === uniqueId) {
      setExpandedId(null);
    } else {
      setExpandedId(uniqueId);
    }
  };

  return (
    <section className="px-4 md:px-8 py-24 max-w-7xl mx-auto overflow-hidden">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-block px-3 py-1 bg-[#FA76FF]/10 border border-[#FA76FF]/20 text-[#FA76FF] text-[10px] uppercase font-bold tracking-wider mb-3 rounded-sm">
            Interactive Roadmap
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black dark:text-white">
            The Journey & Milestones
          </h2>
        </div>

        {/* Tab Filters */}
        <div className="flex border pf-border bg-white dark:bg-[#111] p-1.5 rounded-sm self-start md:self-auto">
          {(['all', 'experience', 'education'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilter(tab);
                setExpandedId(null);
              }}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 rounded-sm cursor-pointer ${
                filter === tab
                  ? 'bg-black text-white dark:bg-[#FA76FF] dark:text-black'
                  : 'text-gray-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Journeys' : tab === 'experience' ? 'Experience' : 'Education'}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className="relative w-full">
          {/* Vertical central timeline path line (hidden on small screens, centered on large) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed pf-border opacity-30 -translate-x-1/2" />

          {/* Timeline Nodes */}
          <div className="flex flex-col gap-12 relative">
            {filteredData.map((item, index) => {
              const uniqueId = `${item.type}-${item.id}`;
              const isEven = index % 2 === 0;
              const isExpanded = expandedId === uniqueId;

              return (
                <motion.div
                  key={uniqueId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`flex flex-col md:flex-row relative w-full items-start ${
                    isEven ? 'md:justify-start' : 'md:justify-end'
                  }`}
                >
                  
                  {/* Timeline Indicator Node Bullet (centered or left aligned) */}
                  <div className="absolute left-4 md:left-1/2 top-7 -translate-x-1/2 z-10 flex items-center justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className={`size-4 rounded-full border-2 border-black dark:border-white cursor-pointer flex items-center justify-center transition-all ${
                        item.type === 'experience' 
                          ? 'bg-[#FA76FF]' 
                          : 'bg-indigo-500'
                      }`}
                    >
                      <span className="size-1 bg-white dark:bg-black rounded-full" />
                    </motion.div>
                  </div>

                  {/* Connective Horizontal Line (Desktop only) */}
                  <div 
                    className={`hidden md:block absolute top-[35px] w-[calc(50%-1.5rem)] h-px border-t pf-border-soft ${
                      isEven ? 'left-[calc(50%+1rem)]' : 'right-[calc(50%+1rem)]'
                    }`} 
                  />

                  {/* Content Event Card */}
                  <div 
                    className={`w-full md:w-[calc(50%-2.5rem)] pl-12 md:pl-0 ${
                      isEven ? 'md:pr-8' : 'md:pl-8'
                    }`}
                  >
                    <div 
                      onClick={() => item.bullets && item.bullets.length > 0 && toggleExpand(uniqueId)}
                      className={`group border pf-border bg-white dark:bg-zinc-900/40 p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 relative rounded-sm ${
                        item.bullets && item.bullets.length > 0 ? 'cursor-pointer select-none' : ''
                      }`}
                    >
                      {/* Event Type Icon badge */}
                      <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                        {item.type === 'experience' ? (
                          <Briefcase className="size-7 text-[#FA76FF]" />
                        ) : (
                          <GraduationCap className="size-7 text-indigo-500" />
                        )}
                      </div>

                      {/* Period Pill */}
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider border pf-badge bg-gray-50 dark:bg-zinc-950 px-3 py-1 mb-4 rounded-sm">
                        <Calendar className="size-3 text-indigo-500 dark:text-[#FA76FF]" />
                        {item.period}
                      </div>

                      {/* Header info */}
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white leading-tight mb-1">
                        {item.title}
                      </h3>
                      
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-[#FA76FF] mb-4">
                        {item.subtitle}
                      </div>

                      {/* Expandable work bullets */}
                      {item.bullets && item.bullets.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors pt-2">
                            <span>{isExpanded ? 'Collapse Details' : 'Expand Journey Details'}</span>
                            {isExpanded ? <ChevronUp className="size-4.5" /> : <ChevronDown className="size-4.5" />}
                          </div>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden mt-4"
                              >
                                <ul className="flex flex-col gap-3 pt-4 border-t pf-border-soft">
                                  {item.bullets.map((bullet, idx) => (
                                    <li 
                                      key={idx} 
                                      className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 pl-4 relative"
                                    >
                                      <span className="absolute left-0 text-[#FA76FF] font-bold">—</span>
                                      {bullet}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 dark:border-zinc-800 p-12 text-center text-gray-500 rounded-lg">
          ⏳ Journey items are loading or database tables are currently empty!
        </div>
      )}

    </section>
  );
};
