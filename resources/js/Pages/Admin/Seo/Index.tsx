import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { Search, FileText, Tag, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

function SeoFormRow({ seoItem }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        page_title: seoItem.page_title,
        meta_description: seoItem.meta_description,
        meta_keywords: seoItem.meta_keywords || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.seo.update', seoItem.id), {
            preserveScroll: true,
            onSuccess: () => toast.success(`${seoItem.page_key.toUpperCase()} SEO tags updated successfully!`)
        });
    };

    const formatPageName = (key) => {
        return key.charAt(0).toUpperCase() + key.slice(1) + ' Page';
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Card Head */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-wide uppercase border border-indigo-100/30 dark:border-indigo-900/30">
                        {seoItem.page_key.substring(0, 2)}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {formatPageName(seoItem.page_key)}
                    </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Key: {seoItem.page_key}
                </span>
            </div>

            {/* Form Content */}
            <form onSubmit={submit} className="p-6 space-y-5">
                {/* Page Title */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5" /> Meta Page Title
                    </label>
                    <input
                        type="text"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={data.page_title}
                        onChange={(e) => setData('page_title', e.target.value)}
                        placeholder="Enter visual page title..."
                    />
                    {errors.page_title && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.page_title}
                        </span>
                    )}
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 italic">
                        Character count: {data.page_title.length} (Recommended max: 70)
                    </p>
                </div>

                {/* Meta Description */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Meta Description
                    </label>
                    <textarea
                        rows={3}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        value={data.meta_description}
                        onChange={(e) => setData('meta_description', e.target.value)}
                        placeholder="Enter page summary snippet..."
                    />
                    {errors.meta_description && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.meta_description}
                        </span>
                    )}
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 italic">
                        Character count: {data.meta_description.length} (Recommended: 120-160)
                    </p>
                </div>

                {/* Meta Keywords */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Meta Keywords (Comma separated)
                    </label>
                    <input
                        type="text"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={data.meta_keywords}
                        onChange={(e) => setData('meta_keywords', e.target.value)}
                        placeholder="e.g. laravel, react, full stack, coding tip"
                    />
                    {errors.meta_keywords && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.meta_keywords}
                        </span>
                    )}
                </div>

                {/* Save Action Footer */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 h-5">
                        {recentlySuccessful && "✨ All tags updated!"}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-1.5 bg-gray-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white dark:text-gray-900 hover:text-white dark:hover:text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
                    >
                        <Save className="w-3.5 h-3.5" />
                        {processing ? 'Saving...' : 'Update Tags'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function GlobalSeoForm({ globalSeo }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        google_analytics_id: globalSeo?.google_analytics_id || '',
        google_search_console_id: globalSeo?.google_search_console_id || '',
        custom_meta_tags: globalSeo?.custom_meta_tags || '',
        google_analytics_property_id: globalSeo?.google_analytics_property_id || '',
        google_analytics_credentials_json: globalSeo?.google_analytics_credentials_json || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.seo.update', globalSeo.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Global SEO & Tracking settings updated successfully!')
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Card Head */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-wide uppercase border border-indigo-100/30 dark:border-indigo-900/30">
                        GL
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Global Tracking & Search Integrations
                    </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Site-Wide Config
                </span>
            </div>

            {/* Form Content */}
            <form onSubmit={submit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Google Analytics ID */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Google Analytics Measurement ID (gtag)
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={data.google_analytics_id}
                            onChange={(e) => setData('google_analytics_id', e.target.value)}
                            placeholder="e.g. G-XXXXXXXXXX"
                        />
                        {errors.google_analytics_id && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.google_analytics_id}
                            </span>
                        )}
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed">
                            Used for front-end tracking scripts. Tracks visits and SPA page views automatically.
                        </p>
                    </div>

                    {/* Google Search Console ID */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                            <Search className="w-3.5 h-3.5" /> Google Search Console ID
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={data.google_search_console_id}
                            onChange={(e) => setData('google_search_console_id', e.target.value)}
                            placeholder="e.g. a8b9c10d..."
                        />
                        {errors.google_search_console_id && (
                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.google_search_console_id}
                            </span>
                        )}
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed">
                            Enter only the token value of the google-site-verification meta tag to verify site ownership.
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
                        Google Analytics Dashboard Reporting API (GA4)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* GA4 Property ID */}
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                                GA4 Property ID
                            </label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={data.google_analytics_property_id}
                                onChange={(e) => setData('google_analytics_property_id', e.target.value)}
                                placeholder="e.g. 312847192"
                            />
                            {errors.google_analytics_property_id && (
                                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.google_analytics_property_id}
                                </span>
                            )}
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed">
                                The numeric property ID (found under GA4 Admin &gt; Property Settings).
                            </p>
                        </div>

                        {/* Service Account JSON credentials */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                                Google Cloud Service Account JSON Key
                            </label>
                            <textarea
                                rows={3}
                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                value={data.google_analytics_credentials_json}
                                onChange={(e) => setData('google_analytics_credentials_json', e.target.value)}
                                placeholder='{ "type": "service_account", "project_id": ... }'
                            />
                            {errors.google_analytics_credentials_json && (
                                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.google_analytics_credentials_json}
                                </span>
                            )}
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed">
                                Paste the complete contents of the downloaded Google Cloud IAM Service Account JSON key. Note: Ensure this service account has **Viewer** permissions in Google Analytics.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Custom Meta Tags */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Custom Header Meta Tags & Scripts
                    </label>
                    <textarea
                        rows={3}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        value={data.custom_meta_tags}
                        onChange={(e) => setData('custom_meta_tags', e.target.value)}
                        placeholder="e.g. &lt;meta name=&quot;author&quot; content=&quot;Developer&quot; /&gt;&#10;&lt;script&gt;...&lt;/script&gt;"
                    />
                    {errors.custom_meta_tags && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.custom_meta_tags}
                        </span>
                    )}
                    <p className="text-[10px] text-yellow-600 dark:text-yellow-500 mt-1.5 font-medium">
                        ⚠️ Warning: Paste only valid HTML tags (&lt;meta&gt;, &lt;script&gt;, &lt;link&gt;). Incorrect tags can break site rendering.
                    </p>
                </div>

                {/* Save Action Footer */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 h-5">
                        {recentlySuccessful && "✨ Global settings updated!"}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
                    >
                        <Save className="w-3.5 h-3.5" />
                        {processing ? 'Saving...' : 'Save Global Integrations'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function SeoIndex({ seoSettings, globalSeo }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                        SEO & Metadata Settings
                    </h2>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
                        Drive discovery on Search Engines & Social Networks
                    </p>
                </div>
            }
        >
            <Head title="SEO Configurator" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Info Header Prompt */}
                    <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-5 rounded-2xl flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm">
                            <Search className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Fine-tune search result appearance</h4>
                            <p className="text-xs text-indigo-800/70 dark:text-indigo-400/70 mt-1 max-w-3xl leading-relaxed">
                                The metadata populated here feeds Google Search snippets, Facebook Open Graph, and Twitter cards instantly. Keep titles descriptive and descriptions around 120-160 characters for maximum readability and SERP performance.
                            </p>
                        </div>
                    </div>

                    {/* Global Integrations Form */}
                    {globalSeo && <GlobalSeoForm globalSeo={globalSeo} />}

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Page-Specific Metadata</h3>
                    </div>

                    {/* Responsive Grid of Editable Rows */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {seoSettings.map((item) => (
                            <SeoFormRow key={item.id} seoItem={item} />
                        ))}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
