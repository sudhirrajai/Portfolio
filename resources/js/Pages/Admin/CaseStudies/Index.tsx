import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { DeleteConfirmModal } from '@/Components/DeleteConfirmModal';
import { toast } from 'sonner';

export default function Index({ auth, caseStudies }) {
    const [deleteSlug, setDeleteSlug] = useState(null);

    const handleConfirmDelete = () => {
        if (!deleteSlug) return;
        router.delete(route('admin.case-studies.destroy', deleteSlug), {
            onSuccess: () => {
                toast.success('Case Study deleted successfully');
            },
            onFinish: () => setDeleteSlug(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Case Studies
                    </h2>
                    <Link
                        href={route('admin.case-studies.create')}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 border border-indigo-500/10 hover:shadow"
                    >
                        <span className="text-lg leading-none font-light">+</span> Create Case Study
                    </Link>
                </div>
            }
        >
            <Head title="Case Studies" />

            <div className="max-w-7xl mx-auto py-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Case Study List</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage case studies for freelance and commercial projects shown on your website.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-850">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Client</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Year</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {caseStudies.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                                            No case studies found. Create your first one above!
                                        </td>
                                    </tr>
                                ) : (
                                    caseStudies.map((caseStudy) => (
                                        <tr key={caseStudy.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="w-8 h-8 rounded-lg flex-shrink-0 shadow-sm border border-black/5 flex items-center justify-center text-xs font-bold"
                                                        style={{ backgroundColor: caseStudy.color || '#eee', color: '#000' }}
                                                    >
                                                        {caseStudy.title.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {caseStudy.title}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {caseStudy.client || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                                    {caseStudy.year}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {caseStudy.is_published ? (
                                                    <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-900">
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400 rounded-full border border-gray-250 dark:border-gray-800">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={route('admin.case-studies.edit', caseStudy.slug)}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/60 transition-colors border border-indigo-100 dark:border-indigo-900/50"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteSlug(caseStudy.slug)}
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
            {/* DELETE CASE STUDY MODAL */}
            <DeleteConfirmModal
                isOpen={!!deleteSlug}
                onClose={() => setDeleteSlug(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Case Study"
                message="Are you sure you want to delete this case study? It will be immediately removed from your public website."
            />
        </AuthenticatedLayout>
    );
}
