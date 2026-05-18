import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Form({ auth, roadmap }) {
    const isEditing = !!roadmap;

    const { data, setData, post, put, processing, errors } = useForm({
        phase: roadmap?.phase || 'Now',
        title: roadmap?.title || '',
        description: roadmap?.description || '',
        tags: roadmap?.tags ? roadmap.tags.join(', ') : '',
        order_weight: roadmap?.order_weight || 0,
    });

    const submit = (e) => {
        e.preventDefault();

        const payload = {
            ...data,
            tags: data.tags ? data.tags.split(',').map(s => s.trim()).filter(s => s) : [],
        };

        if (isEditing) {
            router.put(route('admin.roadmaps.update', roadmap.id), payload);
        } else {
            router.post(route('admin.roadmaps.store'), payload);
        }
    };


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {isEditing ? 'Edit Roadmap Milestone' : 'Create Roadmap Milestone'}
                </h2>
            }
        >
            <Head title={isEditing ? 'Edit Milestone' : 'Create Milestone'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phase</label>
                                <select
                                    value={data.phase}
                                    onChange={(e) => setData('phase', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                >
                                    <option value="Now">Now</option>
                                    <option value="Next">Next</option>
                                    <option value="Future">Future</option>
                                </select>
                                {errors.phase && <p className="mt-1 text-sm text-red-600">{errors.phase}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Milestone Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Learning Advanced Kubernetes"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    placeholder="Brief details about what this roadmap milestone entails..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                ></textarea>
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={data.tags}
                                    onChange={(e) => setData('tags', e.target.value)}
                                    placeholder="e.g. Kubernetes, Helm, DevOps"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Weight (milestones sort ascending)</label>
                                <input
                                    type="number"
                                    value={data.order_weight}
                                    onChange={(e) => setData('order_weight', parseInt(e.target.value) || 0)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.order_weight && <p className="mt-1 text-sm text-red-600">{errors.order_weight}</p>}
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                >
                                    Save
                                </button>
                                <Link
                                    href={route('admin.roadmaps.index')}
                                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
