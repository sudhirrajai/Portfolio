import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { FolderDown, Trash2, Globe, Eye, Download, Clipboard, Check, Plus, AlertCircle, FileText, Lock, Unlock, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function Index({ files }) {
    const [isPublic, setIsPublic] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        description: '',
        file: null as File | null,
        is_public: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.files.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                toast.success('File uploaded successfully!');
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: () => {
                toast.error('Failed to upload file.');
            }
        });
    };

    // Helper to format file sizes
    const formatBytes = (bytes: number, decimals = 2) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this file? This action is permanent.')) {
            router.delete(route('admin.files.destroy', id), {
                onSuccess: () => toast.success('File deleted successfully!'),
                onError: () => toast.error('Failed to delete file.')
            });
        }
    };

    const toggleVisibility = (file: any) => {
        router.put(route('admin.files.update', file.id), {
            title: file.title,
            description: file.description,
            is_public: !file.is_public
        }, {
            onSuccess: () => toast.success('File visibility updated!'),
            onError: () => toast.error('Failed to update visibility.')
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 tracking-tight">
                        Secure File Manager & Downloader
                    </h2>
                </div>
            }
        >
            <Head title="File Manager" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Upload Section */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-indigo-500" /> Upload New File
                        </h3>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                                            Attachment Title
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="e.g. Next.js Boilerplate Code Setup"
                                        />
                                        {errors.title && (
                                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.title}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                                            Description / Release Notes (Optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            placeholder="Provide brief details about this download..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                                            Select File (Max 100MB)
                                        </label>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-950/40 dark:file:text-indigo-400 hover:file:bg-indigo-100 transition-all"
                                            onChange={e => setData('file', e.target.files ? e.target.files[0] : null)}
                                        />
                                        {errors.file && (
                                            <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.file}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                                            Visibility Settings
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('is_public', true);
                                                    setIsPublic(true);
                                                }}
                                                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                    isPublic
                                                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                                        : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                                                }`}
                                            >
                                                <Unlock className="w-3.5 h-3.5" /> Public Download
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('is_public', false);
                                                    setIsPublic(false);
                                                }}
                                                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                    !isPublic
                                                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                                        : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                                                }`}
                                            >
                                                <Lock className="w-3.5 h-3.5" /> Admin Only (Private)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
                                >
                                    {processing ? 'Uploading...' : 'Upload Attachment'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Files List Table */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-500" /> Active Attachments
                            </h3>
                            <span className="text-[11px] font-bold text-gray-400">
                                Total Files: {files.length}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800/50 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50/30 dark:bg-gray-900/30">
                                        <th className="p-4 pl-6">Title & Info</th>
                                        <th className="p-4">File Name / Size</th>
                                        <th className="p-4 text-center">Visibility</th>
                                        <th className="p-4 text-center">Views</th>
                                        <th className="p-4 text-center">Downloads</th>
                                        <th className="p-4 pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
                                    {files.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-xs text-gray-400 italic">
                                                No files uploaded yet. Select a file above to begin hosting attachments.
                                            </td>
                                        </tr>
                                    ) : (
                                        files.map((file) => {
                                            const previewUrl = `${window.location.origin}/files/preview/${file.id}`;
                                            const directDownloadUrl = `${window.location.origin}/files/download/${file.id}`;
                                            return (
                                                <tr key={file.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-950/20 transition-all">
                                                    <td className="p-4 pl-6">
                                                        <div className="font-semibold text-gray-900 dark:text-white leading-normal">
                                                            {file.title}
                                                        </div>
                                                        {file.description && (
                                                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed max-w-[280px] truncate">
                                                                {file.description}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                                                        <div className="max-w-[200px] truncate">{file.original_filename}</div>
                                                        <div className="text-[10px] text-gray-400 mt-0.5">{formatBytes(file.size_bytes)}</div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <button
                                                            onClick={() => toggleVisibility(file)}
                                                            className="focus:outline-none"
                                                            title="Click to toggle visibility"
                                                        >
                                                            {file.is_public ? (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-100/30 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all">
                                                                    <Unlock className="w-3 h-3" /> Public
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-100/30 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all">
                                                                    <Lock className="w-3 h-3" /> Admin Only
                                                                </span>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="p-4 text-center font-bold font-mono text-gray-900 dark:text-white">
                                                        {file.views_count}
                                                    </td>
                                                    <td className="p-4 text-center font-bold font-mono text-gray-900 dark:text-white">
                                                        {file.downloads_count}
                                                    </td>
                                                    <td className="p-4 pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => copyToClipboard(previewUrl, file.id)}
                                                                className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center border border-gray-200/50 dark:border-gray-700/50 transition-all"
                                                                title="Copy Shareable Link"
                                                            >
                                                                {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                                                            </button>
                                                            <a
                                                                href={directDownloadUrl}
                                                                className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/30 dark:border-indigo-900/30 transition-all"
                                                                title="Download Directly"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                            </a>
                                                            <button
                                                                onClick={() => handleDelete(file.id)}
                                                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100/30 dark:border-red-900/30 transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
