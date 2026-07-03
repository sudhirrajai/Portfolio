import { Head } from '@inertiajs/react';
import { Download, FileText, ArrowLeft, ShieldCheck, CheckCircle2, Calendar, FileBox, Server } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            {/* Background decorative glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

            <Head title={`Download - ${file.title}`} />

            {/* Navbar Header */}
            <header className="border-b border-gray-900 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 group text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Portfolio
                    </a>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-3 py-1.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" /> Secure Link verified
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6 my-12">
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-xl bg-gray-900/40 border border-gray-800/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
                >
                    {/* Upper decorative file banner */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>

                    {/* File Icon Badge */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-950/40 border border-indigo-900/30 flex items-center justify-center text-indigo-400">
                            <FileBox className="w-8 h-8 animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center space-y-3 mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
                            {file.title}
                        </h1>
                        {file.description ? (
                            <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
                                {file.description}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 italic">No description provided for this file.</p>
                        )}
                    </div>

                    {/* File Attributes Metadata Box */}
                    <div className="bg-gray-950/50 border border-gray-900 rounded-2xl p-5 mb-8 space-y-4 font-sans">
                        <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-900">
                            <span className="text-gray-500 font-medium flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-gray-500" /> Filename:
                            </span>
                            <span className="font-mono text-gray-300 max-w-[240px] truncate" title={file.original_filename}>
                                {file.original_filename}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                                <span className="text-gray-500 font-medium">File Size:</span>
                                <p className="font-bold text-gray-200">{formatBytes(file.size_bytes)}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-gray-500 font-medium">Extension:</span>
                                <p className="font-bold text-gray-200">{getFileExtension(file.original_filename)}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-gray-500 font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Uploaded:
                                </span>
                                <p className="font-bold text-gray-200">
                                    {new Date(file.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-gray-500 font-medium flex items-center gap-1">
                                    <Download className="w-3 h-3" /> Downloads:
                                </span>
                                <p className="font-bold text-gray-200">{file.downloads_count.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Download Buttons */}
                    <div className="space-y-4">
                        <a
                            href={route('files.download', file.id)}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center gap-2.5 transition-all group"
                        >
                            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                            Download Attachment
                        </a>

                        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500">
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Safe & Secure Download
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Server className="w-3.5 h-3.5" /> High-speed Server
                            </span>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-900 py-6 bg-gray-950">
                <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} Sudhir Rajai. Hosted attachments are screened and secure.
                </div>
            </footer>
        </div>
    );
}
