import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { useState, useEffect } from 'react';
import React from 'react';
import { 
    Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, 
    List, ListOrdered, Quote, Code, FileCode, Link as LinkIcon, 
    Image as ImageIcon, Undo, Redo, Minus, Eye, Code2, Save, AlertCircle, Trash2
} from 'lucide-react';

import { toast } from 'sonner';
import Modal from '@/Components/Modal';

const TiptapEditor = ({ content, onChange }) => {
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [htmlSource, setHtmlSource] = useState(content);

    // Modal States
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageForm, setImageForm] = useState({ src: '', alt: '', title: '', pos: null as number | null });
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-800 transition-colors',
                }
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'rounded-xl shadow-md my-6 max-w-full border border-gray-200 dark:border-gray-800 mx-auto block hover:shadow-lg transition-all',
                }
            })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setHtmlSource(html);
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-indigo dark:prose-invert max-w-none focus:outline-none min-h-[320px] px-6 py-6 dark:bg-gray-950 bg-white text-gray-900 dark:text-gray-100',
            },
            handleDoubleClick(view, pos, event) {
                if (event.target && event.target.nodeName === 'IMG') {
                    let imagePos = null;
                    view.state.doc.descendants((node, pos) => {
                        if (node.type.name === 'image' && node.attrs.src === event.target.src) {
                            imagePos = pos;
                            return false;
                        }
                    });

                    if (imagePos !== null) {
                        const node = view.state.doc.nodeAt(imagePos);
                        if (node) {
                            setImageForm({
                                src: node.attrs.src || '',
                                alt: node.attrs.alt || '',
                                title: node.attrs.title || '',
                                pos: imagePos
                            });
                            setImageModalOpen(true);
                            return true;
                        }
                    }
                }
                return false;
            }
        },
    });

    const handleHtmlChange = (e) => {
        const newHtml = e.target.value;
        setHtmlSource(newHtml);
        onChange(newHtml);
    };

    const toggleView = () => {
        if (isHtmlMode && editor) {
            editor.commands.setContent(htmlSource, true);
        }
        setIsHtmlMode(!isHtmlMode);
    };

    const addImageUrl = () => {
        if (!editor) return;

        const isImageSelected = editor.isActive('image');
        if (isImageSelected) {
            const attrs = editor.getAttributes('image');
            
            let imagePos = null;
            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'image' && node.attrs.src === attrs.src) {
                    imagePos = pos;
                    return false;
                }
            });

            setImageForm({
                src: attrs.src || '',
                alt: attrs.alt || '',
                title: attrs.title || '',
                pos: imagePos
            });
        } else {
            setImageForm({
                src: '',
                alt: '',
                title: '',
                pos: null
            });
        }
        setImageModalOpen(true);
    };

    const saveImageForm = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!editor) return;

        if (imageForm.pos !== null) {
            const node = editor.state.doc.nodeAt(imageForm.pos);
            if (node) {
                const transaction = editor.view.state.tr.setNodeMarkup(imageForm.pos, undefined, {
                    ...node.attrs,
                    src: imageForm.src,
                    alt: imageForm.alt,
                    title: imageForm.title
                });
                editor.view.dispatch(transaction);
                toast.success('Image SEO attributes updated!');
            }
        } else {
            editor.chain().focus().setImage({
                src: imageForm.src,
                alt: imageForm.alt,
                title: imageForm.title
            }).run();
            toast.success('Image inserted into draft!');
        }

        setImageModalOpen(false);
    };

    const setLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href || '';
        setLinkUrl(previousUrl);
        setLinkModalOpen(true);
    };

    const saveLinkForm = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!editor) return;

        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            toast.success('Link removed.');
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            toast.success('Hyperlink saved successfully!');
        }
        setLinkModalOpen(false);
    };

    const removeLink = () => {
        if (!editor) return;
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        toast.success('Link removed.');
        setLinkModalOpen(false);
    };

    if (!editor) return null;

    const btnStyle = (active) => `p-2 rounded-lg transition-all border ${
        active 
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-white'
    }`;

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 shadow-sm group focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all duration-200">
            <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between flex-wrap gap-3">
                {!isHtmlMode ? (
                    <div className="flex items-center flex-wrap gap-1">
                        <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={btnStyle(editor.isActive('bold'))}>
                            <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnStyle(editor.isActive('italic'))}>
                            <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnStyle(editor.isActive('underline'))}>
                            <UnderlineIcon className="w-4 h-4" />
                        </button>
                        <button type="button" title="Inline Code" onClick={() => editor.chain().focus().toggleCode().run()} className={btnStyle(editor.isActive('code'))}>
                            <Code className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />
                        <button type="button" title="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnStyle(editor.isActive('heading', { level: 1 }))}>
                            <Heading1 className="w-4 h-4" />
                        </button>
                        <button type="button" title="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnStyle(editor.isActive('heading', { level: 2 }))}>
                            <Heading2 className="w-4 h-4" />
                        </button>
                        <button type="button" title="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnStyle(editor.isActive('heading', { level: 3 }))}>
                            <Heading3 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />
                        <button type="button" title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnStyle(editor.isActive('bulletList'))}>
                            <List className="w-4 h-4" />
                        </button>
                        <button type="button" title="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnStyle(editor.isActive('orderedList'))}>
                            <ListOrdered className="w-4 h-4" />
                        </button>
                        <button type="button" title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnStyle(editor.isActive('blockquote'))}>
                            <Quote className="w-4 h-4" />
                        </button>
                        <button type="button" title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnStyle(editor.isActive('codeBlock'))}>
                            <FileCode className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />
                        <button type="button" title="Insert Image" onClick={addImageUrl} className={btnStyle(editor.isActive('image'))}>
                            <ImageIcon className="w-4 h-4" />
                        </button>
                        <button type="button" title="Insert Hyperlink" onClick={setLink} className={btnStyle(editor.isActive('link'))}>
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        <button type="button" title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnStyle(false)}>
                            <Minus className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-orange-500 font-bold uppercase py-2 px-1">
                        <Code2 className="w-4 h-4" /> Direct HTML Source Mode
                    </div>
                )}
                <button 
                    type="button"
                    onClick={toggleView}
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase px-3 py-2 bg-gray-200/80 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent transition-colors"
                >
                    {isHtmlMode ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                    {isHtmlMode ? 'Visual Editor' : 'Edit HTML'}
                </button>
            </div>

            <div className="relative">
                {isHtmlMode ? (
                    <textarea
                        value={htmlSource}
                        onChange={handleHtmlChange}
                        className="w-full font-mono text-sm p-6 min-h-[320px] border-0 focus:ring-0 bg-gray-950 text-emerald-400 placeholder-gray-700 focus:outline-none resize-y leading-relaxed"
                        spellCheck={false}
                        placeholder="Write raw HTML markup here..."
                    />
                ) : (
                    <div>
                        <EditorContent editor={editor} />
                        <div className="px-6 py-2.5 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5 select-none">
                            <span>💡 Double-click any image inside the editor to edit its URL, Alt text (SEO), and title.</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Properties Modal */}
            <Modal show={imageModalOpen} onClose={() => setImageModalOpen(false)} maxWidth="md">
                <div className="p-6 text-gray-900 dark:text-white bg-white dark:bg-gray-900">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                        {imageForm.pos !== null ? 'Configure Image Properties' : 'Insert Image'}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                                Image URL
                            </label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-xs"
                                value={imageForm.src}
                                onChange={e => setImageForm({ ...imageForm, src: e.target.value })}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        saveImageForm();
                                    }
                                }}
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                                Alt Text (highly recommended for Google SEO & screen readers)
                            </label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={imageForm.alt}
                                onChange={e => setImageForm({ ...imageForm, alt: e.target.value })}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        saveImageForm();
                                    }
                                }}
                                placeholder="e.g. AWS console showing the creation of an S3 bucket"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                                Title Attribute (optional hover tooltip)
                            </label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={imageForm.title}
                                onChange={e => setImageForm({ ...imageForm, title: e.target.value })}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        saveImageForm();
                                    }
                                }}
                                placeholder="e.g. Figure 1.1: S3 bucket setup"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800/80 pt-4">
                        <button
                            type="button"
                            onClick={() => setImageModalOpen(false)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => saveImageForm()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-sm transition-all"
                        >
                            Save Properties
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Hyperlink Dialog Modal */}
            <Modal show={linkModalOpen} onClose={() => setLinkModalOpen(false)} maxWidth="sm">
                <div className="p-6 text-gray-900 dark:text-white bg-white dark:bg-gray-900">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                        Configure Hyperlink
                    </h3>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                            Destination URL
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-xs"
                            value={linkUrl}
                            onChange={e => setLinkUrl(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    saveLinkForm();
                                }
                            }}
                            placeholder="https://example.com"
                            required
                        />
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80 pt-4">
                        {editor.isActive('link') ? (
                            <button
                                type="button"
                                onClick={removeLink}
                                className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700"
                            >
                                Remove Link
                            </button>
                        ) : <div />}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setLinkModalOpen(false)}
                                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => saveLinkForm()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-sm transition-all"
                            >
                                Save Link
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const ensureArray = (val: any): any[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
        if (val.includes(',')) {
            return val.split(',').map(s => s.trim()).filter(s => s);
        }
        if (val.trim()) {
            return [val.trim()];
        }
    }
    return [];
};

export default function Form({ auth, caseStudy }) {
    const isEditing = !!caseStudy;

    const { data, setData, post, processing, errors } = useForm({
        title: caseStudy?.title || '',
        client: caseStudy?.client || '',
        year: caseStudy?.year || new Date().getFullYear().toString(),
        summary: caseStudy?.summary || '',
        content: caseStudy?.content || '',
        stack: caseStudy?.stack ? ensureArray(caseStudy.stack).join(', ') : '',
        color: caseStudy?.color || '#6366f1',
        is_published: caseStudy ? !!caseStudy.is_published : true,
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        // Prepare raw payload transformations
        const payload = {
            ...data,
            stack: data.stack.split(',').map(s => s.trim()).filter(s => s),
        };

        if (isEditing) {
            router.post(route('admin.case-studies.update', caseStudy.slug), {
                _method: 'put',
                ...payload
            });
        } else {
            post(route('admin.case-studies.store'), {
                data: payload
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                        {isEditing ? 'Edit Case Study' : 'Draft Case Study'}
                    </h2>
                    <Link href={route('admin.case-studies.index')} className="text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                        ← Back to Listing
                    </Link>
                </div>
            }
        >
            <Head title={isEditing ? 'Edit Case Study' : 'New Case Study'} />

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                    
                    {/* LEFT BLOCK: Editor & Details */}
                    <div className="space-y-6">
                        
                        {/* Title & Metadata */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Project Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Scaling E-commerce Architecture to 1M Visitors..."
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    required
                                />
                                {errors.title && (
                                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.title}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Client Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={data.client}
                                        onChange={(e) => setData('client', e.target.value)}
                                        placeholder="e.g. Acme Corp"
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    {errors.client && (
                                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {errors.client}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Launch Year</label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                        placeholder="e.g. 2026"
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        required
                                    />
                                    {errors.year && (
                                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {errors.year}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Brief Summary / Excerpt</label>
                                <textarea
                                    rows={2}
                                    value={data.summary}
                                    onChange={(e) => setData('summary', e.target.value)}
                                    placeholder="Provide a short synopsis of the case study for the listing page card..."
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                    required
                                />
                                {errors.summary && (
                                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.summary}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Rich Text Editor */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                            <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-3">Case Study Write-up (Content)</label>
                            <TiptapEditor content={data.content} onChange={(html) => setData('content', html)} />
                            {errors.content && (
                                <span className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.content}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* RIGHT BLOCK: Settings & Media */}
                    <div className="space-y-6">

                        {/* Publishing Block */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Publishing</h4>
                            
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase text-gray-450 dark:text-gray-500 tracking-wider">Visibility Status</label>
                                <button
                                    type="button"
                                    onClick={() => setData('is_published', !data.is_published)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        data.is_published ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            data.is_published ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm py-3 rounded-xl shadow-sm transition-all disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save Case Study'}
                            </button>
                        </div>

                        {/* Banner Image */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                            <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-3 flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5" /> Cover Banner Image
                            </label>
                            
                            {caseStudy?.image_path && !data.image && (
                                <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                    <img src={`/storage/${caseStudy.image_path}`} alt="Cover Image" className="w-full h-36 object-cover" />
                                </div>
                            )}

                            <div className="relative bg-gray-50 dark:bg-gray-950 border border-dashed border-gray-300 dark:border-gray-800 hover:border-indigo-500 p-4 rounded-xl text-center transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                                    <span className="mt-2 block text-xs font-bold text-gray-600 dark:text-gray-400">
                                        {data.image ? data.image.name : 'Upload banner image'}
                                    </span>
                                    <span className="mt-0.5 text-[10px] text-gray-400 block">Max: 2MB (JPG, PNG, WEBP)</span>
                                </div>
                            </div>
                            {errors.image && (
                                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.image}
                                </span>
                            )}
                        </div>

                        {/* Metadata Tag details */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Tech Stack (comma separated)</label>
                                <input
                                    type="text"
                                    value={data.stack}
                                    onChange={(e) => setData('stack', e.target.value)}
                                    placeholder="e.g. React, Next.js, Node.js, AWS, TailwindCSS"
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    required
                                />
                                {errors.stack && (
                                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.stack}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Brand Primary Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="w-10 h-10 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <input
                                        type="text"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        placeholder="#6366f1"
                                        className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                                        required
                                    />
                                </div>
                                {errors.color && (
                                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.color}
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
