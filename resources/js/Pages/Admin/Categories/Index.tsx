import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { DeleteConfirmModal } from '@/Components/DeleteConfirmModal';
import { toast } from 'sonner';
import { Tag, Edit2, Trash2, FolderPlus, Save, Eye, Sparkles, X, Globe, MessageSquare } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    meta_title: string | null;
    meta_description: string | null;
    posts_count: number;
}

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Form logic
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        description: '',
        meta_title: '',
        meta_description: '',
    });

    // Auto-generate slug from name during creation
    useEffect(() => {
        if (!editingCategory) {
            const generatedSlug = data.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setData('slug', generatedSlug);
        }
    }, [data.name]);

    // Fill form when editing starts
    const startEdit = (category: Category) => {
        setEditingCategory(category);
        clearErrors();
        setData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            meta_title: category.meta_title || '',
            meta_description: category.meta_description || '',
        });
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        clearErrors();
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCategory) {
            put(route('admin.categories.update', editingCategory.id), {
                onSuccess: () => {
                    toast.success('Category updated successfully');
                    cancelEdit();
                }
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => {
                    toast.success('Category created successfully');
                    reset();
                }
            });
        }
    };

    const handleConfirmDelete = () => {
        if (!deleteId) return;

        router.delete(route('admin.categories.destroy', deleteId), {
            onSuccess: () => {
                toast.success('Category deleted successfully');
            },
            onFinish: () => setDeleteId(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Blog Categories
                    </h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Organize your articles for visitors and SEO crawlers
                    </span>
                </div>
            }
        >
            <Head title="Blog Categories" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    
                    {/* LEFT COLUMN: Categories Table */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden h-fit">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Existing Categories</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                View and manage taxonomies. Posts belonging to a deleted category will be set to uncategorized.
                            </p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-gray-850">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Slug / Url</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Post Count</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                                                No categories created yet. Fill out the form to add one!
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                                                            <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                                            {category.name}
                                                        </span>
                                                        {category.description && (
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 max-w-[200px]">
                                                                {category.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-mono text-xs">
                                                    /blog/category/{category.slug}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                                                    <span className="inline-block bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded text-xs border border-indigo-100 dark:border-indigo-900/30">
                                                        {category.posts_count}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2.5">
                                                        <button
                                                            onClick={() => startEdit(category)}
                                                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/40"
                                                            title="Edit Category"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteId(category.id)}
                                                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/40"
                                                            title="Delete Category"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
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

                    {/* RIGHT COLUMN: Form Editor */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl p-6 h-fit space-y-6">
                        <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-850 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FolderPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    {editingCategory ? 'Edit Category' : 'Create Category'}
                                </h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {editingCategory ? 'Update existing taxonomy values' : 'Introduce a new category taxonomy'}
                                </p>
                            </div>
                            {editingCategory && (
                                <button 
                                    onClick={cancelEdit} 
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Category Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Web Development"
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            {/* Category Slug */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Slug (URL friendly)</label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="e.g. web-development"
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 text-gray-600 dark:text-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-xs"
                                />
                                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                            </div>

                            {/* Category Description */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Description</label>
                                <textarea
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Quick overview for category page..."
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                />
                                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                            </div>

                            {/* SEO OPTIMIZED METADATA BLOCK */}
                            <div className="border-t border-gray-150 dark:border-gray-850 pt-4 mt-2 space-y-4">
                                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5" /> SEO Optimizations
                                </h4>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Meta Title</label>
                                    <input
                                        type="text"
                                        value={data.meta_title}
                                        onChange={(e) => setData('meta_title', e.target.value)}
                                        placeholder="e.g. Web Development Blogs | Sudhir Rajai"
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    {errors.meta_title && <p className="text-xs text-red-500 mt-1">{errors.meta_title}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Meta Description</label>
                                    <textarea
                                        rows={3}
                                        value={data.meta_description}
                                        onChange={(e) => setData('meta_description', e.target.value)}
                                        placeholder="SEO crawl snippet description..."
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                    />
                                    {errors.meta_description && <p className="text-xs text-red-500 mt-1">{errors.meta_description}</p>}
                                </div>
                            </div>

                            {/* Submit action */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50 uppercase tracking-widest"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* DELETE CONFIRM MODAL */}
            <DeleteConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? Associated blog posts will become uncategorized but won't be deleted."
            />
        </AuthenticatedLayout>
    );
}
