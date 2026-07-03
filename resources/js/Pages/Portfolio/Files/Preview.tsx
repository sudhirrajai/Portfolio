import React from 'react';
import { Head } from '@inertiajs/react';
import { Download, FileText, ArrowLeft, ShieldCheck, CheckCircle2, Calendar, FileBox, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/Components/Navbar';
import { PageContainer } from '@/Components/PageContainer';
import { Footer } from '@/Components/Footer';

export default function Preview({ file }) {
    // Helper to format file sizes
    const formatBytes = (bytes: number, decimals = 2) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // Helper to extract file extension
    const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toUpperCase() || 'FILE';
    };

    return (
        <>
            <Head title={`Download - ${file.title}`} />
            
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
                <div>
                    <Navbar />
                    
                    <PageContainer className="flex items-center justify-center min-h-[60vh]">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-xl bg-white dark:bg-[#121212] border border-[#e5e5e5] dark:border-[#222] rounded-3xl p-8 shadow-sm dark:shadow-none relative overflow-hidden"
                        >
                            {/* Accent line on top */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-black dark:bg-white"></div>

                            {/* Link Back & Verification Badge */}
                            <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                                <a 
                                    href="/" 
                                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black dark:hover:text-white transition-colors group"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                                    Back
                                </a>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1 rounded-full">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Secure link verified
                                </div>
                            </div>

                            {/* File Icon and Title */}
                            <div className="flex flex-col items-center text-center space-y-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] flex items-center justify-center text-gray-600 dark:text-gray-400">
                                    <FileBox className="w-6 h-6 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900 dark:text-white leading-tight">
                                        {file.title}
                                    </h1>
                                    {file.description ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                                            {file.description}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 italic">No description provided.</p>
                                    )}
                                </div>
                            </div>

                            {/* File Attributes Box */}
                            <div className="bg-[#f9f9f9] dark:bg-[#181818] border border-[#f0f0f0] dark:border-[#222] rounded-2xl p-5 mb-8 space-y-4 font-sans">
                                <div className="flex items-center justify-between text-xs pb-3 border-b border-[#ececec] dark:border-[#262626]">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5" /> Filename:
                                    </span>
                                    <span className="font-mono text-gray-700 dark:text-gray-300 max-w-[240px] truncate" title={file.original_filename}>
                                        {file.original_filename}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="space-y-1">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">File Size:</span>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">{formatBytes(file.size_bytes)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">Extension:</span>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">{getFileExtension(file.original_filename)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Uploaded:
                                        </span>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">
                                            {new Date(file.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                                            <Download className="w-3 h-3" /> Downloads:
                                        </span>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">{file.downloads_count.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Download Action */}
                            <div className="space-y-4">
                                <a
                                    href={route('files.download', file.id)}
                                    className="w-full py-4 border-2 border-black dark:border-white text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98]"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Attachment
                                </a>

                                <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Safe Scan
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Server className="w-3.5 h-3.5" /> Secure Stream
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </PageContainer>
                </div>
                <Footer />
            </div>
        </>
    );
}
