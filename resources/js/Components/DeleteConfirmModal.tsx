import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isProcessing?: boolean;
    confirmText?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Confirmation",
    message = "Are you sure you want to permanently delete this item? This action cannot be undone.",
    isProcessing = false,
    confirmText = "Delete"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Overlay */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 opacity-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                
                {/* Close trigger */}
                <button 
                    onClick={onClose}
                    disabled={isProcessing}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Content Body */}
                <div className="p-6 pt-8 flex flex-col items-center text-center">
                    {/* Visual Alarm Node */}
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 border border-red-100 dark:border-red-900/30">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                        {title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-2 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Call to Action Footer */}
                <div className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex gap-3 justify-end">
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-900 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm shadow-red-600/10 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 active:scale-[0.97]"
                    >
                        {isProcessing ? 'Deleting...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
