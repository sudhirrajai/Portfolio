import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Form({ auth, experience }) {
    const isEditing = !!experience;

    const { data, setData, post, put, processing, errors } = useForm({
        company: experience?.company || '',
        role: experience?.role || '',
        period: experience?.period || '',
        bullets: experience?.bullets ? experience.bullets.join('\n') : '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        const payload = {
            ...data,
            bullets: data.bullets.split('\n').map(s => s.trim()).filter(s => s),
        };

        if (isEditing) {
            router.put(route('admin.experiences.update', experience.id), payload);
        } else {
            post(route('admin.experiences.store'), {
                data: payload
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {isEditing ? 'Edit Experience' : 'Create Experience'}
                </h2>
            }
        >
            <Head title={isEditing ? 'Edit Experience' : 'Create Experience'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                                <input
                                    type="text"
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                                <input
                                    type="text"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Period</label>
                                <input
                                    type="text"
                                    value={data.period}
                                    onChange={(e) => setData('period', e.target.value)}
                                    placeholder="Jul 2023 — Present"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.period && <p className="mt-1 text-sm text-red-600">{errors.period}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bullets (one per line)</label>
                                <textarea
                                    value={data.bullets}
                                    onChange={(e) => setData('bullets', e.target.value)}
                                    rows={5}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                ></textarea>
                                {errors.bullets && <p className="mt-1 text-sm text-red-600">{errors.bullets}</p>}
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                >
                                    Save
                                </button>
                                <Link
                                    href={route('admin.experiences.index')}
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
