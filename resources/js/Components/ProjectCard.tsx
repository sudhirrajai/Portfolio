import React from 'react';
import { Link } from "@inertiajs/react";

interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  year: string;
  stack: string[];
  color: string;
  image_path?: string;
}

export const ProjectCard = ({ project }: { project: Project }) => (
  <Link 
    href={`/work/${project.slug || project.id}`} 
    id={`project-card-${project.slug || project.id}`}
    className="relative cursor-pointer group flex flex-col h-full bg-white dark:bg-[#111] border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300"
  >
    <div className="overflow-hidden mb-0 border-b-2 border-black dark:border-white">
      <div
        className="aspect-square bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.02] flex items-end p-6 relative"
        style={!project.image_path ? { backgroundColor: project.color } : {}}
      >

        {project.image_path ? (
           <>
             <img 
               src={`/storage/${project.image_path}`} 
               alt={project.title} 
               className="absolute inset-0 w-full h-full object-cover" 
               loading="lazy"
               decoding="async"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-[5]" />
           </>
        ) : null}
        <span className={`text-[42px] md:text-[56px] font-medium leading-[0.9] tracking-[-1.5px] relative z-10 ${
          project.image_path ? 'text-white' : 'text-black mix-blend-overlay'
        }`}>
          {project.title}
        </span>
      </div>
    </div>
    <div className="absolute top-4 left-4 flex flex-col gap-0 z-20">
      <div className="pf-badge h-[23px] px-3">
        <div className="text-[11px] font-bold leading-none">{project.year}</div>
      </div>
      {project.stack && project.stack.length > 0 && (
          <div className="pf-badge h-[23px] px-3 border-t-0 mt-1">
            <div className="text-[11px] font-bold leading-none">{project.stack[0]}</div>
          </div>
      )}
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h3 className="text-lg font-medium text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex-1">{project.summary}</p>
    </div>
  </Link>
);
