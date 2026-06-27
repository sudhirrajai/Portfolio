import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { DeleteConfirmModal } from '@/Components/DeleteConfirmModal';
import { toast } from 'sonner';

export default function Index({ auth, blogs }) {
    const [deleteId, setDeleteId] = useState(null);

    const handleConfirmDelete = () => {
        if (!deleteId) return;
        router.delete(route('admin.blogs.destroy', deleteId), {
            onSuccess: () => {
                toast.success('Blog article deleted successfully');
            },
            onFinish: () => setDeleteId(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Blog Posts
                    </h2>
                    <Link
                        href={route('admin.blogs.create')}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 border border-indigo-500/10 hover:shadow"
                    >
                        <span className="text-lg leading-none font-light">+</span> Create Post
                    </Link>
                </div>
            }
        >
            <Head title="Blog Posts" />

            <div className="max-w-7xl mx-auto py-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blog Articles</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Draft, edit, and manage rich-text blog posts.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-850">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Post Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Date Published</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                                            No posts written yet. Click 'Create Post' to start!
                                        </td>
                                    </tr>
                                ) : (
                                    blogs.map((blog) => (
                                        <tr key={blog.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border border-black/5 shadow-sm"
                                                        style={{ backgroundColor: blog.color || '#eee' }}
                                                    />
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-md">
                                                        {blog.title}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {blog.category ? (
                                                    <span className="inline-flex bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-xs font-semibold border border-indigo-100 dark:border-indigo-900/30">
                                                        {blog.category.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-650 text-xs italic">Uncategorized</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {blog.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={route('admin.blogs.edit', blog.id)}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/60 transition-colors border border-indigo-100 dark:border-indigo-900/50"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(blog.id)}
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
            {/* DELETE MODAL */}
            <DeleteConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Blog Post"
                message="Are you sure you want to delete this blog article permanently? This will remove the content from your public field notes."
            />
        </AuthenticatedLayout>
    );
}
