import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner';
import { User, MapPin, Mail, Phone, Clock, ShieldAlert, Save } from 'lucide-react';

export default function ProfileEdit({ profile }) {
    const { data, setData, put, processing, errors } = useForm({
        name: profile?.name || '',
        role: profile?.role || '',
        tagline: profile?.tagline || '',
        summary: profile?.summary || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        is_available: profile?.is_available ?? true,
        working_hours_start: profile?.working_hours_start || '09:00',
        working_hours_end: profile?.working_hours_end || '18:00',
        linkedin: profile?.social_links?.linkedin || '',
        github: profile?.social_links?.github || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.profile.update'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Portfolio profile details updated!'),
            onError: () => toast.error('Failed to save updates. Please review errors.')
        });
    };

    const labelStyle = "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2";
    const inputBase = "w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-60";

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                        Portfolio Profile Settings
                    </h2>
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 shadow-sm shadow-indigo-600/20"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            }
        >
            <Head title="Profile Settings" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Availability Beacon Card (Top-High priority) */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Live Availability Status</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            Manage status widget behaviors on the public website header.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Toggle */}
                                <div className="flex items-start justify-between p-5 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30">
                                    <div className="flex-1 pr-4">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            Status Master Switch
                                            <span className={`w-2 h-2 rounded-full ${data.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                            Turn ON to allow clients to see your beacon active. Turn OFF to manually override status to "UNAVAILABLE" regardless of hours.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_available', !data.is_available)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            data.is_available ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                data.is_available ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Hour Selection */}
                                <div className="space-y-5">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Working Hours Scheduling</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelStyle}>Start Hour</label>
                                            <input
                                                type="time"
                                                value={data.working_hours_start}
                                                onChange={(e) => setData('working_hours_start', e.target.value)}
                                                className={inputBase}
                                                required
                                            />
                                            {errors.working_hours_start && <p className="text-red-500 text-xs mt-1">{errors.working_hours_start}</p>}
                                        </div>
                                        <div>
                                            <label className={labelStyle}>End Hour</label>
                                            <input
                                                type="time"
                                                value={data.working_hours_end}
                                                onChange={(e) => setData('working_hours_end', e.target.value)}
                                                className={inputBase}
                                                required
                                            />
                                            {errors.working_hours_end && <p className="text-red-500 text-xs mt-1">{errors.working_hours_end}</p>}
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                                        * If current time falls outside this range, the frontend will automatically switch status to <strong className="text-gray-700 dark:text-gray-300">UNAVAILABLE</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Primary Identity Card */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Personal Branding</h3>
                            </div>
                            
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelStyle}>Display Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={inputBase}
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className={labelStyle}>Role / Title</label>
                                        <input
                                            type="text"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className={inputBase}
                                            required
                                            placeholder="e.g. Full Stack Developer"
                                        />
                                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className={labelStyle}>Branding Tagline</label>
                                    <input
                                        type="text"
                                        value={data.tagline}
                                        onChange={(e) => setData('tagline', e.target.value)}
                                        className={inputBase}
                                        placeholder="Short headline sentence"
                                    />
                                    {errors.tagline && <p className="text-red-500 text-xs mt-1">{errors.tagline}</p>}
                                </div>

                                <div>
                                    <label className={labelStyle}>About/Hero Summary</label>
                                    <textarea
                                        rows={5}
                                        value={data.summary}
                                        onChange={(e) => setData('summary', e.target.value)}
                                        className={`${inputBase} resize-none`}
                                        required
                                    />
                                    {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Contact Channels Card */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Contact Channels & Locations</h3>
                            </div>
                            
                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className={labelStyle}>Public Location Display</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className={inputBase}
                                            placeholder="MUMBAI, IND"
                                        />
                                    </div>
                                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>

                                <div>
                                    <label className={labelStyle}>Public Contact Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={inputBase}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className={labelStyle}>Public Contact Phone</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className={inputBase}
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className={labelStyle}>LinkedIn Profile URL</label>
                                    <input
                                        type="url"
                                        value={data.linkedin}
                                        onChange={(e) => setData('linkedin', e.target.value)}
                                        className={inputBase}
                                        placeholder="https://linkedin.com/in/yourname"
                                    />
                                    {errors.linkedin && <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>}
                                </div>

                                <div>
                                    <label className={labelStyle}>GitHub Profile URL</label>
                                    <input
                                        type="url"
                                        value={data.github}
                                        onChange={(e) => setData('github', e.target.value)}
                                        className={inputBase}
                                        placeholder="https://github.com/yourname"
                                    />
                                    {errors.github && <p className="text-red-500 text-xs mt-1">{errors.github}</p>}
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
