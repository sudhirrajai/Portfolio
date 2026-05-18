import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

import { useState } from 'react';
import { DeleteConfirmModal } from '@/Components/DeleteConfirmModal';
import { toast } from 'sonner';

export default function Index({ auth, projects }) {
    const [deleteSlug, setDeleteSlug] = useState(null);

    const handleConfirmDelete = () => {
        if (!deleteSlug) return;
        router.delete(route('admin.projects.destroy', deleteSlug), {
            onSuccess: () => {
                toast.success('Project deleted successfully');
            },
            onFinish: () => setDeleteSlug(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Projects
                    </h2>
                    <Link
                        href={route('admin.projects.create')}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 border border-indigo-500/10 hover:shadow"
                    >
                        <span className="text-lg leading-none font-light">+</span> Create Project
                    </Link>
                </div>
            }
        >
            <Head title="Projects" />

            <div className="max-w-7xl mx-auto py-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project List</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage all projects shown in your public work grid.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-850">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Project Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Year</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Tech Stack</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-500">
                                            No projects found. Create your first one above!
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="w-8 h-8 rounded-lg flex-shrink-0 shadow-sm border border-black/5 flex items-center justify-center text-xs font-bold"
                                                        style={{ backgroundColor: project.color || '#eee', color: '#000' }}
                                                    >
                                                        {project.title.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                        {project.title}
                                                        {project.is_featured && (
                                                            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-900 flex items-center gap-0.5 flex-shrink-0">
                                                                ★ Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                                    {project.year}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5 max-w-sm">
                                                    {project.stack.map((tech) => (
                                                        <span 
                                                            key={tech} 
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={route('admin.projects.edit', project.slug)}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/60 transition-colors border border-indigo-100 dark:border-indigo-900/50"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteSlug(project.slug)}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-300 dark:bg-red-950/30 dark:hover:bg-red-950/60 transition-colors border border-red-100 dark:border-red-900/50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* DELETE PROJECT MODAL */}
            <DeleteConfirmModal
                isOpen={!!deleteSlug}
                onClose={() => setDeleteSlug(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Project Showcase"
                message="Are you sure you want to delete this project? It will be immediately removed from your public portfolios and case study grids."
            />
        </AuthenticatedLayout>
    );
}
