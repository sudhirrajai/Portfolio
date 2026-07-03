import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { useState, useEffect } from 'react';
import { 
    Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, 
    List, ListOrdered, Quote, Code, FileCode, Link as LinkIcon, 
    Image as ImageIcon, Undo, Redo, Minus, Eye, Code2, Save, AlertCircle
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

    // Sync manual HTML source edits back to editor when toggling HTML view
    const handleHtmlChange = (e) => {
        const newHtml = e.target.value;
        setHtmlSource(newHtml);
        onChange(newHtml);
    };

    const toggleView = () => {
        if (isHtmlMode && editor) {
            // Hydrate visual editor with HTML code
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

    // Helper for toolbar button active states
    const btnStyle = (active) => `p-2 rounded-lg transition-all border ${
        active 
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-white'
    }`;

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 shadow-sm group focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all duration-200">
            {/* Editor Header/Toolbar */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between flex-wrap gap-3">
                
                {/* Visual Mode Actions */}
                {!isHtmlMode ? (
                    <div className="flex items-center flex-wrap gap-1">
                        {/* Text Style Group */}
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

                        {/* Headings */}
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

                        {/* Layout/Lists Group */}
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

                        {/* Embeds Group */}
                        <button type="button" title="Insert Image" onClick={addImageUrl} className={btnStyle(editor.isActive('image'))}>
                            <ImageIcon className="w-4 h-4" />
                        </button>
                        <button type="button" title="Insert Hyperlink" onClick={setLink} className={btnStyle(editor.isActive('link'))}>
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        <button type="button" title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnStyle(false)}>
                            <Minus className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 hidden md:block" />

                        {/* History Group */}
                        <button type="button" title="Undo" onClick={() => editor.chain().focus().undo().run()} className={`${btnStyle(false)} hidden md:block`}>
                            <Undo className="w-4 h-4" />
                        </button>
                        <button type="button" title="Redo" onClick={() => editor.chain().focus().redo().run()} className={`${btnStyle(false)} hidden md:block`}>
                            <Redo className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-orange-500 font-bold uppercase py-2 px-1">
                        <Code2 className="w-4 h-4" /> Direct HTML Source Mode (WordPress style)
                    </div>
                )}

                {/* Mode Toggler (Visual vs HTML Source) */}
                <button 
                    type="button"
                    onClick={toggleView}
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase px-3 py-2 bg-gray-200/80 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent transition-colors"
                >
                    {isHtmlMode ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                    {isHtmlMode ? 'Visual Editor' : 'Edit HTML'}
                </button>
            </div>

            {/* Main Content Panel */}
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

            {/* Beautiful Modal Dialogs */}
            
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

export default function Form({ auth, blog, categories = [] }) {
    const isEditing = !!blog;

    const { data, setData, post, processing, errors } = useForm({
        category_ids: blog?.categories ? blog.categories.map(c => c.id) : [],
        title: blog?.title || '',
        date: blog?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        read_time: blog?.read_time || '5 min read',
        color: blog?.color || '#000000',
        excerpt: blog?.excerpt || '',
        content: blog?.content || '',
        tags: blog?.tags ? blog.tags.join(', ') : '',
        image: null, // Multi-part featured image
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Payload formatting
        const payload = {
            ...data,
            tags: data.tags.split(',').map(s => s.trim()).filter(s => s),
        };

        if (isEditing) {
            // Spoof PUT via POST for multi-part media uploads
            router.post(route('admin.blogs.update', blog.id), {
                _method: 'put',
                ...payload
            });
        } else {
            post(route('admin.blogs.store'), {
                data: payload
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                        {isEditing ? 'Edit Blog Post' : 'Draft New Article'}
                    </h2>
                    <Link href={route('admin.blogs.index')} className="text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                        ← Back to Listing
                    </Link>
                </div>
            }
        >
            <Head title={isEditing ? 'Edit Post' : 'New Article'} />

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                    
                    {/* LEFT BLOCK: Editor & Content */}
                    <div className="space-y-6">
                        
                        {/* Title */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Post Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Rebuilding a Scaled API with Redis..."
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                {errors.title && (
                                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.title}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Brief Excerpt</label>
                                <textarea
                                    rows={2}
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    placeholder="Provide a short summary for search previews..."
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                />
                                {errors.excerpt && (
                                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.excerpt}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Powerful TipTap WYSIWYG Block */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                            <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-3">Main Article Body</label>
                            <TiptapEditor content={data.content} onChange={(html) => setData('content', html)} />
                            {errors.content && (
                                <span className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.content}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* RIGHT BLOCK: Settings & Medias */}
                    <div className="space-y-6">

                        {/* Save Component */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Publishing</h4>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm py-3 rounded-xl shadow-sm transition-all disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving Progress...' : 'Save & Publish'}
                            </button>
                        </div>

                        {/* Featured Image Block */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                            <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-3 flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5" /> Featured Media
                            </label>
                            
                            {/* Display existing image if editing */}
                            {blog?.image_path && !data.image && (
                                <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                    <img src={`/storage/${blog.image_path}`} alt="Featured" className="w-full h-36 object-cover" />
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
                                        {data.image ? data.image.name : 'Upload new banner'}
                                    </span>
                                    <span className="mt-0.5 text-[10px] text-gray-400 block">Max: 3MB (JPG, PNG, WEBP)</span>
                                </div>
                            </div>
                            {errors.image && (
                                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.image}
                                </span>
                            )}
                        </div>

                        {/* Meta Attributes */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-5">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Categories</label>
                                    <Link 
                                        href={route('admin.categories.index')} 
                                        className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                                    >
                                        + Manage Categories
                                    </Link>
                                </div>
                                {categories.length === 0 ? (
                                    <p className="text-xs text-gray-400 dark:text-gray-600 italic">No categories created yet.</p>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl p-3">
                                        {categories.map((category) => {
                                            const isChecked = data.category_ids.includes(category.id);
                                            const handleCheckboxChange = () => {
                                                if (isChecked) {
                                                    setData('category_ids', data.category_ids.filter(id => id !== category.id));
                                                } else {
                                                    setData('category_ids', [...data.category_ids, category.id]);
                                                }
                                            };
                                            return (
                                                <label key={category.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={handleCheckboxChange}
                                                        className="rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500/20 dark:bg-gray-900 w-4 h-4"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold">{category.name}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                                {errors.category_ids && <p className="text-xs text-red-500 mt-1">{errors.category_ids}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Publish Date</label>
                                <input
                                    type="text"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Estimated Read Time</label>
                                <input
                                    type="text"
                                    value={data.read_time}
                                    onChange={(e) => setData('read_time', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                {errors.read_time && <p className="text-xs text-red-500 mt-1">{errors.read_time}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Accent Branding Color</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="h-10 w-14 rounded-lg overflow-hidden bg-transparent cursor-pointer border border-gray-200 dark:border-gray-800"
                                    />
                                    <span className="font-mono text-xs text-gray-500 uppercase">{data.color}</span>
                                </div>
                                {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-1.5">Taxonomy Tags (comma split)</label>
                                <input
                                    type="text"
                                    value={data.tags}
                                    onChange={(e) => setData('tags', e.target.value)}
                                    placeholder="React, NextJS, DevOps"
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags}</p>}
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
