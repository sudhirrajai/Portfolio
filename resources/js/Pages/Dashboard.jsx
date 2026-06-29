import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Eye, Users, MessageSquare, Briefcase, FileText, ArrowUpRight, Globe, Smartphone, Monitor } from 'lucide-react';

export default function Dashboard({ stats, top_pages, top_referrers, browsers, platforms, chart_data, data_source }) {
    
    // Simple helper to calculate relative percentages for native CSS visual bars
    const maxViews = Math.max(...chart_data.map(d => d.views), 1);
    const maxTopPageView = Math.max(...top_pages.map(p => p.total_views), 1);
    const maxReferrer = Math.max(...top_referrers.map(r => r.occurrences), 1);

    const coreStats = [
        { 
            label: "Today's Views", 
            value: stats.today_views, 
            icon: Eye, 
            color: "bg-indigo-500", 
            lightColor: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
            desc: `${stats.today_uniques} unique visitors today`
        },
        { 
            label: 'Total Views', 
            value: stats.total_views, 
            icon: Globe, 
            color: "bg-emerald-500",
            lightColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
            desc: `${stats.unique_visitors} all-time uniques`
        },
        { 
            label: 'User Queries', 
            value: stats.unread_messages, 
            icon: MessageSquare, 
            color: "bg-amber-500",
            lightColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
            desc: "Total inbox entries",
            link: "admin.messages.index"
        },
        { 
            label: 'Active Content', 
            value: stats.projects + stats.blogs, 
            icon: Briefcase, 
            color: "bg-pink-500",
            lightColor: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400",
            desc: `${stats.projects} Projects • ${stats.blogs} Posts`
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 tracking-tight">
                        Portfolio Metrics Overview
                    </h2>
                    <div className="flex items-center gap-2">
                        {data_source === 'google_analytics' ? (
                            <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                Google Analytics Active
                            </span>
                        ) : (
                            <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/40 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                Local Database Analytics
                            </span>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Admin Analytics Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Row 1: Summary Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreStats.map((s, idx) => {
                            const Icon = s.icon;
                            const cardContent = (
                                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-500/50 dark:hover:border-indigo-400/30 p-6 rounded-2xl shadow-sm transition-all duration-200 relative group overflow-hidden h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                                                {s.label}
                                            </p>
                                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                                {s.value.toLocaleString()}
                                            </h3>
                                        </div>
                                        <div className={`w-12 h-12 rounded-xl ${s.lightColor} flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        {s.desc}
                                    </p>
                                </div>
                            );

                            return s.link ? (
                                <Link key={idx} href={route(s.link)} className="block cursor-pointer">
                                    {cardContent}
                                </Link>
                            ) : (
                                <div key={idx}>{cardContent}</div>
                            );
                        })}
                    </div>

                    {/* Row 2: 7-Day Traffic Chart & Platform Breakdowns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Native Bar Chart (7 Days) */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm lg:col-span-2">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Eye className="w-4 h-4 text-indigo-500" /> 7-Day Page View Activity
                            </h3>
                            <div className="h-[240px] flex items-end gap-3 pt-4">
                                {chart_data.map((day, idx) => {
                                    const pct = Math.max((day.views / maxViews) * 100, 4); // Min height to keep visible
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center h-full group relative">
                                            {/* Tooltip hover */}
                                            <div className="absolute bottom-full mb-2 px-2 py-1 rounded bg-black text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center z-10 whitespace-nowrap shadow-md border border-white/10">
                                                <div>Views: {day.views}</div>
                                                <div>Uniques: {day.uniques}</div>
                                            </div>
                                            {/* Dynamic Bar column */}
                                            <div className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 rounded-t-xl flex-1 flex flex-col justify-end overflow-hidden">
                                                <div 
                                                    style={{ height: `${pct}%` }} 
                                                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-pink-400 transition-all duration-500 ease-out rounded-t-xl relative"
                                                >
                                                    {/* Inner Unique Visitors Indicator */}
                                                    <div 
                                                        style={{ height: day.views > 0 ? `${(day.uniques / day.views) * 100}%` : '0%' }} 
                                                        className="absolute inset-x-0 bottom-0 bg-black/10 group-hover:bg-white/10 transition-colors"
                                                    ></div>
                                                </div>
                                            </div>
                                            {/* Label */}
                                            <span className="text-[10px] font-medium text-gray-400 mt-3 group-hover:text-indigo-500 transition-colors">
                                                {day.date_label.split(',')[0]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Side Breakdown: Systems & Browsers */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-indigo-500" /> Platforms & Browsers
                                </h3>
                                
                                <div className="space-y-4 flex-1 flex flex-col justify-center">
                                    <div>
                                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                            <span>Operating System</span>
                                            <span>Total</span>
                                        </div>
                                        <div className="space-y-2">
                                            {platforms.length === 0 ? (
                                                <span className="text-xs text-gray-400 italic">No visits recorded.</span>
                                            ) : (
                                                platforms.map((plat, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-700 dark:text-gray-300 min-w-[60px] font-medium">{plat.platform || 'Unknown'}</span>
                                                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(plat.count / Math.max(...platforms.map(p => p.count), 1)) * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-[11px] font-bold tabular-nums">{plat.count}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                            <span>Top Browsers</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {browsers.length === 0 ? (
                                                <span className="text-xs text-gray-400 italic">No browser data.</span>
                                            ) : (
                                                browsers.map((b, idx) => (
                                                    <div key={idx} className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                        {b.browser || 'Other'} ({b.count})
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Top Paths & Top Referrers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Most Popular Pages */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-4 border-b border-gray-50 dark:border-gray-800/50 pb-3">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                    Most Visited Pages
                                </h3>
                                <span className="text-[11px] font-semibold text-gray-400">Hits</span>
                            </div>
                            <div className="space-y-2 flex-1">
                                {top_pages.length === 0 ? (
                                    <div className="text-center py-6 text-xs text-gray-400 italic">No analytics logged yet. Visit pages on the frontend to populate!</div>
                                ) : (
                                    top_pages.map((page, idx) => {
                                        const pct = Math.max((page.total_views / maxTopPageView) * 100, 1);
                                        return (
                                            <div key={idx} className="relative p-3 rounded-xl group overflow-hidden flex items-center justify-between bg-gray-50/30 dark:bg-gray-950/20 border border-gray-100/40 dark:border-gray-800/30">
                                                {/* Custom Relative Indicator Background fill */}
                                                <div style={{ width: `${pct}%` }} className="absolute inset-y-0 left-0 bg-indigo-50 dark:bg-indigo-950/20 opacity-80 transition-all duration-500"></div>
                                                
                                                <div className="relative flex items-center gap-2 text-xs">
                                                    <span className="font-bold text-gray-400">{idx+1}.</span>
                                                    <span className="font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-[10px]">{page.url_path}</span>
                                                </div>
                                                
                                                <span className="relative text-xs font-bold tabular-nums text-gray-900 dark:text-white">
                                                    {page.total_views}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Top Referrer (Traffic Sources) */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-4 border-b border-gray-50 dark:border-gray-800/50 pb-3">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                    Top Traffic Referrers
                                </h3>
                                <span className="text-[11px] font-semibold text-gray-400">Total</span>
                            </div>
                            <div className="space-y-2 flex-1">
                                {top_referrers.length === 0 ? (
                                    <div className="text-center py-6 text-xs text-gray-400 italic">No traffic sources recorded.</div>
                                ) : (
                                    top_referrers.map((ref, idx) => {
                                        const pct = Math.max((ref.occurrences / maxReferrer) * 100, 1);
                                        return (
                                            <div key={idx} className="relative p-3 rounded-xl group overflow-hidden flex items-center justify-between bg-gray-50/30 dark:bg-gray-950/20 border border-gray-100/40 dark:border-gray-800/30">
                                                <div style={{ width: `${pct}%` }} className="absolute inset-y-0 left-0 bg-emerald-50 dark:bg-emerald-950/20 opacity-80 transition-all duration-500"></div>
                                                
                                                <div className="relative flex items-center gap-2 text-xs">
                                                    <span className="font-bold text-gray-400">{idx+1}.</span>
                                                    <span className="font-medium text-gray-700 dark:text-gray-200">{ref.referer}</span>
                                                </div>
                                                
                                                <span className="relative text-xs font-bold tabular-nums text-gray-900 dark:text-white">
                                                    {ref.occurrences}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
