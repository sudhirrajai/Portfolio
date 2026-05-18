import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { Mail, User, Calendar, Trash2, MessageSquare, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '@/Components/DeleteConfirmModal';

export default function MessagesIndex({ messages }) {
    const [activeMessage, setActiveMessage] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const openDeleteModal = (e, id) => {
        e.stopPropagation(); // Prevent other clicks
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (!deleteId) return;
        
        router.delete(route('admin.messages.destroy', deleteId), {
            onSuccess: () => {
                toast.success('Message successfully deleted');
                if (activeMessage && activeMessage.id === deleteId) {
                    setActiveMessage(null);
                }
            },
            onFinish: () => setDeleteId(null)
        });
    };

    const timeAgo = (dateInput) => {
        const date = new Date(dateInput);
        const now = new Date();
        const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (secondsDiff < 60) return 'just now';
        const minutes = Math.floor(secondsDiff / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const paginatedData = messages.data || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                        Contact Form Queries
                    </h2>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Total Submissions: {messages.total || paginatedData.length}
                    </div>
                </div>
            }
        >
            <Head title="Contact Queries" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {paginatedData.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center shadow-sm">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                Any messages submitted via the website contact form will automatically appear here in your inbox.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[240px]">
                                                Sender
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Message (Click row to expand)
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[160px]">
                                                Date Submitted
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[80px] text-center">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {paginatedData.map((message) => (
                                            <tr 
                                                key={message.id}
                                                onClick={() => setActiveMessage(message)}
                                                className="hover:bg-gray-50/30 dark:hover:bg-indigo-950/10 cursor-pointer transition-colors group"
                                            >
                                                {/* Sender info */}
                                                <td className="px-6 py-5 whitespace-nowrap align-top">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                            {message.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {message.name}
                                                            </div>
                                                            <a 
                                                                href={`mailto:${message.email}`}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 mt-0.5 transition-colors"
                                                            >
                                                                <Mail className="w-3 h-3 flex-shrink-0" />
                                                                <span className="truncate">{message.email}</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Message Content - Clipped/Truncated visually */}
                                                <td className="px-6 py-5 align-top">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-normal font-sans leading-relaxed max-w-xl line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {message.message}
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 py-5 whitespace-nowrap align-top text-xs text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>{timeAgo(message.created_at)} ago</span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-5 text-center align-top">
                                                    <button
                                                        onClick={(e) => openDeleteModal(e, message.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all focus:outline-none inline-flex items-center justify-center"
                                                        title="Delete message permanently"
                                                    >
                                                        <Trash2 className="w-4.5 h-4.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            {messages.links && messages.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 flex items-center justify-between flex-wrap gap-4">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{messages.from}</span> to <span className="font-medium text-gray-700 dark:text-gray-300">{messages.to}</span> of <span className="font-medium text-gray-700 dark:text-gray-300">{messages.total}</span> queries
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {messages.links.map((link, idx) => {
                                            if (link.url === null) {
                                                return (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1.5 text-xs text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }
                                            return (
                                                <Link
                                                    key={idx}
                                                    href={link.url}
                                                    preserveScroll
                                                    className={`px-3 py-1.5 text-xs border rounded-lg transition-all duration-150 ${
                                                        link.active
                                                            ? 'bg-indigo-600 border-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/20'
                                                            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MESSAGE EXPAND MODAL */}
            {activeMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Overlay backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setActiveMessage(null)}
                    />

                    {/* Modal Container */}
                    <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden transform transition-all scale-100 opacity-100 animate-in fade-in duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-sm">
                                    {activeMessage.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden pr-2">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                        {activeMessage.name}
                                    </h3>
                                    <a 
                                        href={`mailto:${activeMessage.email}`}
                                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-1 transition-colors"
                                    >
                                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">{activeMessage.email}</span>
                                    </a>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setActiveMessage(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body Content */}
                        <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh]">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Message Body
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-xl border border-gray-100 dark:border-gray-850 text-gray-800 dark:text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans select-text break-words shadow-inner">
                                {activeMessage.message}
                            </div>
                        </div>

                        {/* Footer info */}
                        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Sent on {new Date(activeMessage.created_at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 self-end">
                                <button 
                                    onClick={() => setActiveMessage(null)}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={(e) => openDeleteModal(e, activeMessage.id)}
                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg border border-red-200/30 dark:border-red-900/30 transition-colors flex items-center gap-1.5"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* DELETE CONFIRMATION DIALOG */}
            <DeleteConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Contact Message"
                message="Are you sure you want to permanently delete this inbox query? This cannot be undone."
            />
        </AuthenticatedLayout>
    );
}
