import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { LayoutDashboard, Briefcase, FileText, GraduationCap, Wrench, User, Settings, LogOut, MessageSquare, Settings2, Globe, Calendar, Mail, Milestone } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const isActive = (routeName) => {
        if (routeName.endsWith('*')) {
            return route().current(routeName);
        }
        return route().current(routeName);
    };

    const navItems = [
        { label: 'Dashboard', route: 'dashboard', pattern: 'dashboard', icon: LayoutDashboard },
        { label: 'Projects', route: 'admin.projects.index', pattern: 'admin.projects.*', icon: Briefcase },
        { label: 'Roadmap', route: 'admin.roadmaps.index', pattern: 'admin.roadmaps.*', icon: Milestone },
        { label: 'Blog Posts', route: 'admin.blogs.index', pattern: 'admin.blogs.*', icon: FileText },
        { label: 'Experience', route: 'admin.experiences.index', pattern: 'admin.experiences.*', icon: Briefcase },
        { label: 'Education', route: 'admin.educations.index', pattern: 'admin.educations.*', icon: GraduationCap },
        { label: 'Skills', route: 'admin.skills.index', pattern: 'admin.skills.*', icon: Wrench },
        { label: 'Messages', route: 'admin.messages.index', pattern: 'admin.messages.*', icon: MessageSquare },
        { label: 'Bookings & Calendar', route: 'admin.bookings.index', pattern: 'admin.bookings.*', icon: Calendar },
        { label: 'CMS / Profile Info', route: 'admin.profile.edit', pattern: 'admin.profile.*', icon: Settings2 },
        { label: 'SEO Settings', route: 'admin.seo.index', pattern: 'admin.seo.*', icon: Globe },
        { label: 'Mail & SMTP Server', route: 'admin.mail.index', pattern: 'admin.mail.*', icon: Mail },
    ];


    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden sm:flex flex-col flex-shrink-0 overflow-hidden shadow-sm">
                <div className="h-16 flex items-center px-8 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white font-bold rounded-lg group-hover:bg-indigo-700 transition-colors">
                            SR
                        </div>
                        <span className="font-semibold tracking-tight text-gray-900 dark:text-white">
                            Portfolio Admin
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 py-6 px-4 overflow-y-auto space-y-1.5">
                    <div className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Overview
                    </div>
                    {navItems.map((item) => {
                        const active = isActive(item.pattern);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={route(item.route)}
                                className={`flex items-center gap-3.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                    active
                                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <Icon className={`w-[18px] h-[18px] transition-colors duration-200 ${
                                    active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                                }`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar Toggle & Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top header (Mobile Nav & Profile Dropdown) */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex items-center ml-auto">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                                    {user.name}
                                    <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Mobile Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {navItems.map((item) => (
                            <ResponsiveNavLink
                                key={item.label}
                                href={route(item.route)}
                                active={isActive(item.pattern)}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </div>
                            </ResponsiveNavLink>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>

                {header && (
                    <header className="bg-white shadow dark:bg-gray-800">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
