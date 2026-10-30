import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { 
    Search, FileText, Tag, Save, AlertCircle, RefreshCw, 
    CheckCircle2, AlertTriangle, ArrowRight, Activity, 
    ExternalLink, Trash2, PlusCircle, ShieldCheck, Globe,
    TrendingUp, MousePointer, Eye, Layers, Terminal, Copy,
    Check, Play, Sparkles, X, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { toast } from 'sonner';

function SeoFormRow({ seoItem }: { seoItem: any }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        page_title: seoItem.page_title,
        meta_description: seoItem.meta_description,
        meta_keywords: seoItem.meta_keywords || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.seo.update', seoItem.id), {
            preserveScroll: true,
            onSuccess: () => toast.success(`${seoItem.page_key.toUpperCase()} SEO tags updated successfully!`)
        });
    };

    const formatPageName = (key: string) => {
        return key.charAt(0).toUpperCase() + key.slice(1) + ' Page';
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
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

            <form onSubmit={submit} className="p-6 space-y-5">
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
                        Character count: {data.page_title.length} (Recommended: 50-65)
                    </p>
                </div>

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

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Meta Keywords
                    </label>
                    <input
                        type="text"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={data.meta_keywords}
                        onChange={(e) => setData('meta_keywords', e.target.value)}
                        placeholder="e.g. laravel, react, full stack, coding tip"
                    />
                </div>

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

function GlobalSeoForm({ globalSeo }: { globalSeo: any }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        google_analytics_id: globalSeo?.google_analytics_id || '',
        google_search_console_id: globalSeo?.google_search_console_id || '',
        custom_meta_tags: globalSeo?.custom_meta_tags || '',
        google_analytics_property_id: globalSeo?.google_analytics_property_id || '',
        google_analytics_credentials_json: globalSeo?.google_analytics_credentials_json || '',
        llm_instructions: globalSeo?.llm_instructions || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.seo.update', globalSeo.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Global SEO, LLM & Tracking settings updated successfully!')
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-wide uppercase border border-indigo-100/30 dark:border-indigo-900/30">
                        GL
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Global Tracking, SEO & AI Search Integrations
                    </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Site-Wide Config
                </span>
            </div>

            <form onSubmit={submit} className="p-6 space-y-5">
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                            🤖 AI Model & Recruiting Agent Directives (/llms.txt)
                        </label>
                        <a href="/llms.txt" target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                            View /llms.txt ↗
                        </a>
                    </div>
                    <textarea
                        rows={3}
                        className="w-full bg-white dark:bg-gray-950 border border-indigo-200 dark:border-indigo-900/60 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        value={data.llm_instructions}
                        onChange={(e) => setData('llm_instructions', e.target.value)}
                        placeholder="Instructions for AI Search Engines (Perplexity, ChatGPT, SearchGPT, Claude, Gemini)..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Google Analytics ID (gtag: G-XXXXXXXXXX)
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={data.google_analytics_id}
                            onChange={(e) => setData('google_analytics_id', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Google Analytics Property ID (GA4)
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={data.google_analytics_property_id}
                            onChange={(e) => setData('google_analytics_property_id', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Google Service Account JSON (Analytics & Search Console API)
                    </label>
                    <textarea
                        rows={4}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        value={data.google_analytics_credentials_json}
                        onChange={(e) => setData('google_analytics_credentials_json', e.target.value)}
                        placeholder='{"type": "service_account", ...}'
                    />
                </div>

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

export default function SeoIndex({ 
    seoSettings, 
    globalSeo, 
    gscConnected, 
    gscSiteUrl, 
    performanceOverview, 
    healthIssues, 
    redirects, 
    inspections 
}: any) {
    const { flash } = usePage().props as any;

    const [activeTab, setActiveTab] = useState<'rankings' | 'inspections' | 'redirects' | 'health' | 'meta'>('rankings');
    const [runningAction, setRunningAction] = useState<string | null>(null);
    const [inspectInputUrl, setInspectInputUrl] = useState('');
    const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Watch for terminal output returned from Artisan commands via flash session
    useEffect(() => {
        if (flash?.console_output) {
            setTerminalOutput(flash.console_output);
        }
    }, [flash?.console_output]);

    // Redirect Form State
    const { data: redirectData, setData: setRedirectData, post: postRedirect, reset: resetRedirect, processing: redirectProcessing } = useForm({
        source_path: '',
        target_path: '',
        status_code: 301,
        notes: '',
    });

    // 1. Trigger: Fast Search Console Metrics Sync
    const handleSyncGsc = () => {
        setRunningAction('sync-gsc');
        router.post(route('admin.seo.sync-gsc'), { inspect: false }, {
            preserveScroll: true,
            onFinish: () => setRunningAction(null),
            onSuccess: () => toast.success('Search Console metrics synced!')
        });
    };

    // 2. Trigger: Deep URL Inspection for all posts & case studies
    const handleDeepInspectAll = () => {
        setRunningAction('deep-inspect');
        router.post(route('admin.seo.sync-gsc'), { inspect: true }, {
            preserveScroll: true,
            onFinish: () => setRunningAction(null),
            onSuccess: () => toast.success('Deep Google URL inspections completed!')
        });
    };

    // 3. Trigger: Internal Site Health Audit
    const handleRunHealthCheck = () => {
        setRunningAction('health-audit');
        router.post(route('admin.seo.health-check'), {}, {
            preserveScroll: true,
            onFinish: () => setRunningAction(null),
            onSuccess: () => toast.success('Internal SEO audit completed!')
        });
    };

    // 4. Trigger: Submit Sitemap to Google (Bulk Recrawl all 40 URLs)
    const handleSubmitSitemap = () => {
        setRunningAction('submit-sitemap');
        router.post(route('admin.seo.submit-sitemap'), {}, {
            preserveScroll: true,
            onFinish: () => setRunningAction(null),
            onSuccess: () => toast.success('Sitemap submitted to Google! All pages queued for crawling.')
        });
    };

    // 5. Trigger: Single URL Inspection
    const handleInspectUrl = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inspectInputUrl.trim()) return;
        setRunningAction('inspect-single');
        router.post(route('admin.seo.inspect-url'), { url: inspectInputUrl }, {
            preserveScroll: true,
            onFinish: () => setRunningAction(null),
            onSuccess: () => toast.success(`Inspection finished for ${inspectInputUrl}!`)
        });
    };

    const handleAddRedirect = (e: React.FormEvent) => {
        e.preventDefault();
        postRedirect(route('admin.seo.redirects.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('301 Redirect added successfully!');
                resetRedirect();
            }
        });
    };

    const handleDeleteRedirect = (id: number) => {
        if (!confirm('Are you sure you want to delete this redirect rule?')) return;
        router.delete(route('admin.seo.redirects.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Redirect rule deleted.')
        });
    };

    const copyTerminalOutput = () => {
        if (!terminalOutput) return;
        navigator.clipboard.writeText(terminalOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Terminal output copied to clipboard');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                            <span>SEO Command Center & Automation</span>
                            {gscConnected && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                                    <CheckCircle2 className="w-3 h-3" /> GSC Connected ({gscSiteUrl})
                                </span>
                            )}
                        </h2>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                            Trigger automated ranking syncs, Google URL inspections, 404 self-healing, and health audits
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <a
                            href="/sitemap.xml"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            View sitemap.xml ↗
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="SEO Command Center" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* MANUAL TRIGGER COMMAND BAR */}
                    <div className="bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent border border-indigo-200/60 dark:border-indigo-900/50 p-6 rounded-3xl shadow-sm space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                    Manual SEO Execution Triggers
                                </h3>
                            </div>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                Click any command to trigger live execution with real-time terminal feedback
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* Command 1: Fast GSC Sync */}
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                            <TrendingUp className="w-3.5 h-3.5" /> seo:sync-gsc
                                        </span>
                                        <span className="text-[10px] text-gray-400">Daily @ 4:00 AM</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Sync Search Console Rankings</p>
                                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Pulls daily queries, impressions, clicks & positions for the past 30 days.</p>
                                </div>
                                <button
                                    onClick={handleSyncGsc}
                                    disabled={runningAction !== null}
                                    className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${runningAction === 'sync-gsc' ? 'animate-spin' : ''}`} />
                                    {runningAction === 'sync-gsc' ? 'Syncing...' : 'Sync Rankings Now'}
                                </button>
                            </div>

                            {/* Command 2: Deep URL Inspection */}
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                            <ShieldCheck className="w-3.5 h-3.5" /> seo:sync-gsc --inspect
                                        </span>
                                        <span className="text-[10px] text-gray-400">Deep Live Check</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Deep Inspect All 16 URLs with Google</p>
                                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Runs Google URL Inspection API across all blogs & case studies for crawl verdict.</p>
                                </div>
                                <button
                                    onClick={handleDeepInspectAll}
                                    disabled={runningAction !== null}
                                    className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
                                >
                                    <Play className={`w-3.5 h-3.5 ${runningAction === 'deep-inspect' ? 'animate-spin' : ''}`} />
                                    {runningAction === 'deep-inspect' ? 'Inspecting with Google...' : 'Run Deep URL Inspection'}
                                </button>
                            </div>

                            {/* Command 3: Internal Health Audit */}
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            <Activity className="w-3.5 h-3.5" /> seo:health-check
                                        </span>
                                        <span className="text-[10px] text-gray-400">Weekly @ Mon 5 AM</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Internal Health & 404 Crawler</p>
                                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Simulates crawler on all 40 site routes to verify HTTP 200, speed, and meta tags.</p>
                                </div>
                                <button
                                    onClick={handleRunHealthCheck}
                                    disabled={runningAction !== null}
                                    className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
                                >
                                    <Activity className={`w-3.5 h-3.5 ${runningAction === 'health-audit' ? 'animate-spin' : ''}`} />
                                    {runningAction === 'health-audit' ? 'Crawling Site...' : 'Run Site Health Audit'}
                                </button>
                            </div>

                            {/* Command 4: Submit Sitemap to Google */}
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            <Globe className="w-3.5 h-3.5" /> GSC Sitemap Ping
                                        </span>
                                        <span className="text-[10px] text-gray-400">Bulk Re-crawl</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Submit Sitemap to Google</p>
                                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Pings Google Search Console to queue all 40 site URLs for recrawling at once.</p>
                                </div>
                                <button
                                    onClick={handleSubmitSitemap}
                                    disabled={runningAction !== null}
                                    className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
                                >
                                    <Globe className={`w-3.5 h-3.5 ${runningAction === 'submit-sitemap' ? 'animate-spin' : ''}`} />
                                    {runningAction === 'submit-sitemap' ? 'Submitting...' : 'Submit Sitemap to Google'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LIVE TERMINAL CONSOLE DRAWER */}
                    {terminalOutput && (
                        <div className="bg-[#0f172a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl font-mono text-xs animate-in fade-in duration-300">
                            <div className="bg-[#1e293b] px-5 py-3 flex items-center justify-between text-gray-300 border-b border-gray-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                                    <span className="text-xs font-bold text-gray-200 ml-2 flex items-center gap-1.5 font-mono">
                                        <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Artisan Execution Terminal
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={copyTerminalOutput}
                                        className="inline-flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-gray-300 hover:text-white transition-all"
                                    >
                                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={() => setTerminalOutput(null)}
                                        className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
                                        title="Close Terminal"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <pre className="p-5 overflow-x-auto text-emerald-400 font-mono text-[11px] leading-relaxed max-h-96 whitespace-pre-wrap select-all">
                                {terminalOutput}
                            </pre>
                        </div>
                    )}

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-px">
                        <button
                            onClick={() => setActiveTab('rankings')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'rankings'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <TrendingUp className="w-4 h-4" /> Rankings & Performance
                        </button>

                        <button
                            onClick={() => setActiveTab('inspections')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'inspections'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <ShieldCheck className="w-4 h-4" /> Google URL Inspections
                            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px]">
                                {inspections?.length || 0}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('redirects')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'redirects'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Layers className="w-4 h-4" /> 301 Redirect Engine
                            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px]">
                                {redirects?.length || 0}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('health')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'health'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Activity className="w-4 h-4" /> Internal Health
                            {healthIssues?.length > 0 && (
                                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px]">
                                    {healthIssues.length} issues
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('meta')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'meta'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Tag className="w-4 h-4" /> Metadata & LLMs
                        </button>
                    </div>

                    {/* TAB 1: RANKINGS & PERFORMANCE */}
                    {activeTab === 'rankings' && (
                        <div className="space-y-6">
                            {/* Summary Metrics Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <div className="flex items-center justify-between text-gray-400 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider">Search Clicks</span>
                                        <MousePointer className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">
                                        {performanceOverview?.total_clicks || 0}
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1">From Google Organic</p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <div className="flex items-center justify-between text-gray-400 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider">Impressions</span>
                                        <Eye className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">
                                        {performanceOverview?.total_impressions || 0}
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1">SERP appearances</p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <div className="flex items-center justify-between text-gray-400 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider">Average CTR</span>
                                        <TrendingUp className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">
                                        {performanceOverview?.avg_ctr || 0}%
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1">Click-through rate</p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <div className="flex items-center justify-between text-gray-400 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider">Avg Position</span>
                                        <Globe className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">
                                        {performanceOverview?.avg_position || 0}
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1">Average Google Rank</p>
                                </div>
                            </div>

                            {/* Two Column Tables: Top Queries & Top Pages */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span>🔍</span> Top Search Queries (GSC)
                                        </h3>
                                        <span className="text-xs text-gray-400">Past 30 Days</span>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {performanceOverview?.top_queries?.map((q: any) => (
                                            <div key={q.query} className="p-4 flex items-center justify-between text-xs">
                                                <div className="max-w-[65%]">
                                                    <p className="font-semibold text-gray-900 dark:text-white truncate">{q.query}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">Rank: Pos {parseFloat(q.avg_position).toFixed(1)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{q.total_impressions} imp</span>
                                                    <span className="text-gray-400 ml-2">({q.total_clicks} clicks)</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!performanceOverview?.top_queries || performanceOverview.top_queries.length === 0) && (
                                            <p className="p-6 text-xs text-gray-400 text-center">No queries synced yet. Click "Sync Rankings Now" above.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span>📄</span> Top Landing Pages (SERP)
                                        </h3>
                                        <span className="text-xs text-gray-400">Past 30 Days</span>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {performanceOverview?.top_pages?.map((p: any) => (
                                            <div key={p.page_url} className="p-4 flex items-center justify-between text-xs">
                                                <div className="max-w-[70%]">
                                                    <a href={p.page_url} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline truncate block">
                                                        {p.page_url.replace('https://sudhirrajai.com', '') || '/'}
                                                    </a>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">Rank: Pos {parseFloat(p.avg_position).toFixed(1)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-gray-900 dark:text-white">{p.total_clicks} clicks</span>
                                                    <span className="text-gray-400 ml-2">({p.total_impressions} imp)</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: GOOGLE URL INSPECTION */}
                    {activeTab === 'inspections' && (
                        <div className="space-y-6">
                            {/* Live Inspection Bar */}
                            <form onSubmit={handleInspectUrl} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
                                <Search className="w-5 h-5 text-gray-400 ml-2" />
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-0 placeholder-gray-400"
                                    placeholder="Enter full URL to inspect via Google Search Console API (e.g. https://sudhirrajai.com/blog/how-i-cut-laravel-api...)"
                                    value={inspectInputUrl}
                                    onChange={(e) => setInspectInputUrl(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={runningAction !== null || !inspectInputUrl.trim()}
                                    className="inline-flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all disabled:opacity-50 shrink-0"
                                >
                                    {runningAction === 'inspect-single' ? 'Inspecting...' : 'Inspect URL'}
                                </button>
                            </form>

                            {/* Inspections Table */}
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                        Inspected URLs & Live Indexation Coverage
                                    </h3>
                                    <span className="text-xs text-gray-400">Google URL Inspection API</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 dark:bg-gray-950/50 border-b border-gray-200 dark:border-gray-800 uppercase font-bold text-gray-400 text-[10px]">
                                            <tr>
                                                <th className="px-5 py-3">Inspected URL</th>
                                                <th className="px-5 py-3">Verdict</th>
                                                <th className="px-5 py-3">Coverage State</th>
                                                <th className="px-5 py-3">Google Canonical</th>
                                                <th className="px-5 py-3">Last Crawled</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                                            {inspections?.map((item: any) => (
                                                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-5 py-4 max-w-xs truncate">
                                                        <a href={item.url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1">
                                                            {item.url.replace('https://sudhirrajai.com', '') || '/'}
                                                            <ExternalLink className="w-3 h-3 opacity-60" />
                                                        </a>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {item.verdict === 'PASS' ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                                                                <CheckCircle2 className="w-3 h-3" /> Indexed
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                                                                <AlertTriangle className="w-3 h-3" /> Attention
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                                                        {item.coverage_state || 'Unspecified'}
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 font-mono text-[10px] max-w-xs truncate">
                                                        {item.google_canonical || 'None'}
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                                                        {item.last_crawl_time ? new Date(item.last_crawl_time).toLocaleDateString() : 'Never'}
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!inspections || inspections.length === 0) && (
                                                <tr>
                                                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                                                        No inspection records found. Click "Run Deep URL Inspection" above.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: 301 REDIRECT ENGINE */}
                    {activeTab === 'redirects' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    <PlusCircle className="w-4 h-4 text-indigo-500" /> Add Permanent 301 Redirect Rule
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    Eliminate 404 crawl errors by redirecting old or broken URLs to their new active pages.
                                </p>
                                <form onSubmit={handleAddRedirect} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1">Source Path (Old URL)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder="/blog/old-slug"
                                            value={redirectData.source_path}
                                            onChange={(e) => setRedirectData('source_path', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1">Target Path (Destination)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder="/blog/new-slug"
                                            value={redirectData.target_path}
                                            onChange={(e) => setRedirectData('target_path', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1">Notes / Reason</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder="Renamed article in 2026"
                                            value={redirectData.notes}
                                            onChange={(e) => setRedirectData('notes', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={redirectProcessing}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm"
                                    >
                                        Add 301 Rule
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                        Active Redirect Rules ({redirects?.length || 0})
                                    </h3>
                                    <span className="text-xs text-gray-400">Includes Self-Healing Rules</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 dark:bg-gray-950/50 border-b border-gray-200 dark:border-gray-800 uppercase font-bold text-gray-400 text-[10px]">
                                            <tr>
                                                <th className="px-5 py-3">Source URL</th>
                                                <th className="px-5 py-3">Destination URL</th>
                                                <th className="px-5 py-3">Hits Count</th>
                                                <th className="px-5 py-3">Type / Notes</th>
                                                <th className="px-5 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                                            {redirects?.map((r: any) => (
                                                <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-5 py-4 font-mono text-gray-700 dark:text-gray-300">
                                                        {r.source_path}
                                                    </td>
                                                    <td className="px-5 py-4 font-mono text-indigo-600 dark:text-indigo-400">
                                                        <span className="flex items-center gap-1.5">
                                                            <ArrowRight className="w-3 h-3 opacity-50" />
                                                            {r.target_path}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                                                            {r.hits} hits
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-400 text-[11px]">
                                                        {r.notes || 'Manual rule'}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteRedirect(r.id)}
                                                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!redirects || redirects.length === 0) && (
                                                <tr>
                                                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                                                        No redirect rules configured.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: INTERNAL HEALTH */}
                    {activeTab === 'health' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Internal Site Audit Status</h3>
                                    <p className="text-xs text-gray-400 mt-1">Crawls all sitemap URLs, blog posts, projects, checking response codes & meta tags.</p>
                                </div>
                                <button
                                    onClick={handleRunHealthCheck}
                                    disabled={runningAction !== null}
                                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50"
                                >
                                    <Activity className={`w-3.5 h-3.5 ${runningAction === 'health-audit' ? 'animate-spin' : ''}`} />
                                    {runningAction === 'health-audit' ? 'Auditing...' : 'Run Audit Now'}
                                </button>
                            </div>

                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Detected Health Issues</h3>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {healthIssues?.map((issue: any) => (
                                        <div key={issue.id} className="p-5 flex items-start justify-between text-xs">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        issue.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                                    }`}>
                                                        {issue.issue_type}
                                                    </span>
                                                    <span className="font-mono text-gray-900 dark:text-white font-bold">{issue.url}</span>
                                                </div>
                                                <p className="text-gray-400 text-[11px]">{JSON.stringify(issue.details)}</p>
                                            </div>
                                            <span className="text-gray-400 text-[10px]">{new Date(issue.detected_at).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {(!healthIssues || healthIssues.length === 0) && (
                                        <div className="p-12 text-center space-y-2">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Zero Health Issues Detected</p>
                                            <p className="text-xs text-gray-400">All crawled routes returned HTTP 200 OK with fast response times.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: METADATA & LLMs */}
                    {activeTab === 'meta' && (
                        <div className="space-y-6">
                            {globalSeo && <GlobalSeoForm globalSeo={globalSeo} />}

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Page-Specific Metadata</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {seoSettings.map((item: any) => (
                                    <SeoFormRow key={item.id} seoItem={item} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
