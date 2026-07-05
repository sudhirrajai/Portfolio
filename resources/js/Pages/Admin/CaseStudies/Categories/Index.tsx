import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { DeleteConfirmModal } from '@/Components/DeleteConfirmModal';
import { toast } from 'sonner';
import { Tag, Edit2, Trash2, FolderPlus, Save, X, AlertCircle } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    case_studies_count: number;
}

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        description: '',
    });

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

    const startEdit = (category: Category) => {
        setEditingCategory(category);
        clearErrors();
        setData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
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
            put(route('admin.case-study-categories.update', editingCategory.slug), {
                onSuccess: () => {
                    toast.success('Category updated successfully');
                    cancelEdit();
                }
            });
        } else {
            post(route('admin.case-study-categories.store'), {
                onSuccess: () => {
                    toast.success('Category created successfully');
                    reset();
                }
            });
        }
    };

    const handleConfirmDelete = () => {
        if (!deleteId) return;

        // Find slug of category to delete
        const targetCategory = categories.find(c => c.id === deleteId);
        if (!targetCategory) return;

        router.delete(route('admin.case-study-categories.destroy', targetCategory.slug), {
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
                        Case Study Categories
                    </h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Organize your commercial work for better navigation
                    </span>
                </div>
            }
        >
            <Head title="Case Study Categories" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    
                    {/* LEFT COLUMN: Categories Table */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden h-fit">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Existing Categories</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                View and manage Case Study taxonomies.
                            </p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-gray-850">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Slug / URL</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Works Count</th>
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
                                                    /case-studies/category/{category.slug}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                                                    <span className="inline-block bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded text-xs border border-indigo-100 dark:border-indigo-900/30">
                                                        {category.case_studies_count}
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

                    {/* RIGHT COLUMN: Create/Edit Form */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl p-6 h-fit">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                <FolderPlus className="w-4 h-4 text-indigo-600" />
                                {editingCategory ? 'Edit Category' : 'Create Category'}
                            </h3>
                            {editingCategory && (
                                <button
                                    onClick={cancelEdit}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Mobile Apps"
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                                    required
                                />
                                {errors.name && (
                                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                                    Slug / Url Handle
                                </label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="e.g. mobile-apps"
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-xs"
                                    required
                                />
                                {errors.slug && (
                                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.slug}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter a brief description..."
                                    rows={3}
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl shadow-sm transition-all disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? The Case Studies belonging to this category will not be deleted, but they will be detached from this category."
            />
        </AuthenticatedLayout>
    );
}
