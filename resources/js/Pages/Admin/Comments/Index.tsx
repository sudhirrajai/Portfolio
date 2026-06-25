import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { MessageSquare, Check, X, Trash2, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '@/Components/DeleteConfirmModal';

type Status = 'pending' | 'approved' | 'rejected';

interface BlogPostRef {
  id: number;
  title: string;
  slug: string;
}

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  status: Status;
  created_at: string;
  parent: { id: number; name: string } | null;
  blog_post: BlogPostRef;
}

interface PaginatedComments {
  data: Comment[];
  current_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
  links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
  comments: PaginatedComments;
  counts: { all: number; pending: number; approved: number; rejected: number };
  filter: string;
}

const STATUS_STYLES: Record<Status, string> = {
  pending:  'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  approved: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  rejected: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800',
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CommentsIndex({ comments, counts, filter }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

  const data = comments.data ?? [];

  const handleApprove = (id: number) => {
    router.patch(route('admin.comments.approve', id), {}, {
      preserveScroll: true,
      onSuccess: () => toast.success('Comment approved — commenter notified by email.'),
    });
  };

  const handleReject = (id: number) => {
    router.patch(route('admin.comments.reject', id), {}, {
      preserveScroll: true,
      onSuccess: () => toast.success('Comment rejected.'),
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    router.delete(route('admin.comments.destroy', deleteId), {
      preserveScroll: true,
      onSuccess: () => toast.success('Comment deleted permanently.'),
      onFinish: () => setDeleteId(null),
    });
  };

  const handleReplyAsAuthor = (commentId: number) => {
    const body = replyTexts[commentId]?.trim();
    if (!body) return;
    router.post(
      route('admin.comments.reply-as-author', commentId),
      { body },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Author reply posted — it is live immediately.');
          setReplyTexts((prev) => ({ ...prev, [commentId]: '' }));
        },
      }
    );
  };

  const filterTab = (label: string, value: string, count: number) => (
    <Link
      href={`/admin/comments${value === 'all' ? '' : `?status=${value}`}`}
      className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
        filter === value
          ? 'border-black dark:border-white text-black dark:text-white'
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
      }`}
    >
      {label}
      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] ${
        filter === value ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
      }`}>{count}</span>
    </Link>
  );

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Blog Comments
          </h2>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {counts.pending > 0 && (
              <span className="bg-amber-500 text-white px-2 py-0.5 rounded font-bold">
                {counts.pending} pending
              </span>
            )}
          </div>
        </div>
      }
    >
      <Head title="Blog Comments" />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800">
            {filterTab('All', 'all', counts.all)}
            {filterTab('Pending', 'pending', counts.pending)}
            {filterTab('Approved', 'approved', counts.approved)}
            {filterTab('Rejected', 'rejected', counts.rejected)}
          </div>

          {data.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No comments yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                {filter === 'all'
                  ? 'Comments submitted on blog posts will appear here for moderation.'
                  : `No ${filter} comments at this time.`}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.map((comment) => {
                  const isExpanded = expandedId === comment.id;
                  return (
                    <div key={comment.id} className="group">
                      {/* Row */}
                      <div
                        className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => setExpandedId(isExpanded ? null : comment.id)}
                      >
                        {/* Expand chevron */}
                        <div className="mt-0.5 text-gray-400">
                          {isExpanded
                            ? <ChevronDown className="w-4 h-4" />
                            : <ChevronRight className="w-4 h-4" />}
                        </div>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.name}</span>
                            <span className="text-xs text-gray-400">{comment.email}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_STYLES[comment.status]}`}>
                              {comment.status}
                            </span>
                            {comment.parent && (
                              <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                ↩ reply to {comment.parent.name}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {comment.body}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <a
                              href={`/blog/${comment.blog_post?.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-1"
                            >
                              {comment.blog_post?.title}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <span className="text-[11px] text-gray-400">{timeAgo(comment.created_at)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          {comment.status !== 'approved' && (
                            <button
                              onClick={() => handleApprove(comment.id)}
                              title="Approve"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {comment.status !== 'rejected' && (
                            <button
                              onClick={() => handleReject(comment.id)}
                              title="Reject"
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteId(comment.id)}
                            title="Delete permanently"
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded full body */}
                      {isExpanded && (
                        <div className="px-16 pb-5 pt-1 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
                          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                            {comment.body}
                          </p>
                          <div className="flex gap-3 mt-4">
                            {comment.status !== 'approved' && (
                              <button onClick={() => handleApprove(comment.id)}
                                className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded">
                                ✓ Approve &amp; Notify
                              </button>
                            )}
                            {comment.status !== 'rejected' && (
                              <button onClick={() => handleReject(comment.id)}
                                className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-amber-500 text-white hover:bg-amber-600 transition-colors rounded">
                                ✕ Reject
                              </button>
                            )}
                            <button onClick={() => setDeleteId(comment.id)}
                              className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors rounded">
                              Delete
                            </button>
                          </div>

                          {/* Reply as Author */}
                          <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
                              ✦ Reply as Author — will appear live immediately with Author badge
                            </p>
                            <div className="flex gap-2 items-end">
                              <textarea
                                rows={3}
                                value={replyTexts[comment.id] ?? ''}
                                onChange={(e) => setReplyTexts((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                                placeholder={`Reply to ${comment.name}...`}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                              />
                              <button
                                onClick={() => handleReplyAsAuthor(comment.id)}
                                disabled={!replyTexts[comment.id]?.trim()}
                                className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded h-fit"
                              >
                                Post Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {comments.last_page > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Showing {comments.from}–{comments.to} of {comments.total}
                  </span>
                  <div className="flex gap-1">
                    {comments.links.map((link, i) => (
                      <button
                        key={i}
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                        className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                          link.active
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                            : !link.url
                            ? 'text-gray-300 dark:text-gray-700 border-transparent cursor-not-allowed'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-black dark:hover:border-white'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        itemName="comment"
      />
    </AuthenticatedLayout>
  );
}
