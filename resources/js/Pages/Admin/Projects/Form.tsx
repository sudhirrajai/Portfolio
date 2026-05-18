import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Form({ auth, project }) {
    const isEditing = !!project;

    const { data, setData, post, put, processing, errors } = useForm({
        is_featured: project?.is_featured || false,
        is_open_source: project?.is_open_source || false,
        github_url: project?.github_url || '',
        open_source_content: project?.open_source_content || '',
        title: project?.title || '',
        year: project?.year || '',
        summary: project?.summary || '',
        stack: project?.stack ? project.stack.join(', ') : '',
        highlights: project?.highlights ? project.highlights.join('\n') : '',
        color: project?.color || '#000000',
        image: null,
    });


    const submit = (e) => {
        e.preventDefault();
        
        // Transform stack and highlights before sending
        const payload = {
            ...data,
            stack: data.stack.split(',').map(s => s.trim()).filter(s => s),
            highlights: data.highlights.split('\n').map(h => h.trim()).filter(h => h),
        };

        if (isEditing) {
            // Use POST with _method=PUT to support file uploads in Laravel
            router.post(route('admin.projects.update', project.slug), {
                _method: 'put',
                ...payload
            });
        } else {
            post(route('admin.projects.store'), {
                data: payload
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {isEditing ? 'Edit Project' : 'Create Project'}
                </h2>
            }
        >
            <Head title={isEditing ? 'Edit Project' : 'Create Project'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Master Feature Highlight Toggle */}
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 rounded-lg flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300">Featured Showcase</label>
                                    <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5">Highlight this project directly on your homepage carousel!</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('is_featured', !data.is_featured)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        data.is_featured ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            data.is_featured ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                            
                            {/* Open Source / Lab Project Toggle */}
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-lg flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-bold text-emerald-900 dark:text-emerald-300">Open Source / Lab Project</label>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">Mark this project as an Open Source / Lab utility!</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('is_open_source', !data.is_open_source)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        data.is_open_source ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            data.is_open_source ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            {data.is_open_source && (
                                <div className="space-y-6 border-l-2 border-emerald-500 pl-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub Repository URL</label>
                                        <input
                                            type="text"
                                            value={data.github_url}
                                            onChange={(e) => setData('github_url', e.target.value)}
                                            placeholder="https://github.com/sudhirrajai/project-name"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                        />
                                        {errors.github_url && <p className="mt-1 text-sm text-red-600">{errors.github_url}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Open Source / Lab Detailed Content (Markdown supported)</label>
                                        <textarea
                                            value={data.open_source_content}
                                            onChange={(e) => setData('open_source_content', e.target.value)}
                                            rows={5}
                                            placeholder="Add extra documentation, installation scripts, or custom labs intro here..."
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                        ></textarea>
                                        {errors.open_source_content && <p className="mt-1 text-sm text-red-600">{errors.open_source_content}</p>}
                                    </div>
                                </div>
                            )}


                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                                <input
                                    type="text"
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme Color</label>
                                <input
                                    type="color"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="mt-1 block h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900"
                                />
                                {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stack (comma separated)</label>
                                <input
                                    type="text"
                                    value={data.stack}
                                    onChange={(e) => setData('stack', e.target.value)}
                                    placeholder="Laravel, Vue.js, TailwindCSS"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                />
                                {errors.stack && <p className="mt-1 text-sm text-red-600">{errors.stack}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
                                <textarea
                                    value={data.summary}
                                    onChange={(e) => setData('summary', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                ></textarea>
                                {errors.summary && <p className="mt-1 text-sm text-red-600">{errors.summary}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Highlights (one per line)</label>
                                <textarea
                                    value={data.highlights}
                                    onChange={(e) => setData('highlights', e.target.value)}
                                    rows={5}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                ></textarea>
                                {errors.highlights && <p className="mt-1 text-sm text-red-600">{errors.highlights}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Image (Optional)</label>
                                {project?.image_path && (
                                    <div className="mb-2">
                                        <img src={`/storage/${project.image_path}`} alt="Current" className="h-32 object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-gray-700 dark:file:text-gray-300"
                                />
                                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                >
                                    Save
                                </button>
                                <Link
                                    href={route('admin.projects.index')}
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
