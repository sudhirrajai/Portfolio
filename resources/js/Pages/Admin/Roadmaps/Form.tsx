import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';

const phaseOptions = [
    { value: 'Past', label: 'Past', dot: 'bg-slate-400 dark:bg-slate-500', desc: 'Completed milestone goals' },
    { value: 'Now', label: 'Now', dot: 'bg-emerald-500', desc: 'Current active focus area' },
    { value: 'Next', label: 'Next', dot: 'bg-blue-500', desc: 'Upcoming next target' },
    { value: 'Future', label: 'Future', dot: 'bg-purple-500', desc: 'Long-term learning & vision' }
];

function CustomPhaseSelect({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = phaseOptions.find(opt => opt.value === value) || phaseOptions[1];

    return (
        <div className="relative mt-1.5" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-full cursor-pointer rounded-lg border-2 border-black dark:border-white bg-white dark:bg-gray-900 py-3 pl-4 pr-10 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
            >
                <span className="flex items-center gap-3">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${selectedOption.dot} animate-pulse`} />
                    <span className="font-bold text-xs uppercase tracking-widest text-black dark:text-white">{selectedOption.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">— {selectedOption.desc}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-black dark:text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2.5 w-full rounded-lg border-2 border-black dark:border-white bg-white dark:bg-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                    <ul className="max-h-60 overflow-auto py-1 text-base focus:outline-none sm:text-sm">
                        {phaseOptions.map((option) => {
                            const isSelected = option.value === value;
                            return (
                                <li
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`relative cursor-pointer select-none py-3.5 pl-4 pr-9 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-colors duration-150 flex items-center justify-between gap-4 ${isSelected ? 'bg-indigo-50/50 dark:bg-zinc-800/30' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${option.dot}`} />
                                        <span className={`font-bold uppercase tracking-wider text-xs ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-black dark:text-white'}`}>
                                            {option.label}
                                        </span>
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden md:inline">
                                            — {option.desc}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 dark:text-indigo-400">
                                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

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
                                <CustomPhaseSelect
                                    value={data.phase}
                                    onChange={(val) => setData('phase', val)}
                                />
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
