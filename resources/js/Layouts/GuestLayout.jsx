import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 py-8">
            <div className="w-full sm:max-w-md">
                
                {/* Logo Wrapper */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <ApplicationLogo className="h-10 w-10 text-indigo-600 dark:text-[#FA76FF]" />
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
                            Sudhir<span className="text-indigo-600 dark:text-[#FA76FF]">Rajai</span>
                        </span>
                    </Link>
                </div>

                {/* Form Container Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl shadow-indigo-500/5 overflow-hidden p-8">
                    {children}
                </div>
                
                {/* Footer credit link */}
                <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Sudhir Rajai. All rights reserved.
                </p>

            </div>
        </div>
    );
}
