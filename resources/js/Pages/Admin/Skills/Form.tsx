import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Form({ auth, skill }) {
    const isEditing = !!skill;

    const { data, setData, post, put, processing, errors } = useForm({
        category: skill?.category || '',
        items: skill?.items ? skill.items.join(', ') : '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        const payload = {
            ...data,
            items: data.items.split(',').map(s => s.trim()).filter(s => s),
        };

        if (isEditing) {
            router.put(route('admin.skills.update', skill.id), payload);
        } else {
            post(route('admin.skills.store'), {
                data: payload
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {isEditing ? 'Edit Skill Category' : 'Create Skill Category'}
                </h2>
            }
        >
            <Head title={isEditing ? 'Edit Skill Category' : 'Create Skill Category'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                                <input
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    placeholder="Languages"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={data.items}
                                    onChange={(e) => setData('items', e.target.value)}
                                    placeholder="PHP, JavaScript, HTML"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items}</p>}
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                >
                                    Save
                                </button>
                                <Link
                                    href={route('admin.skills.index')}
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
