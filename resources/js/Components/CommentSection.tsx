import React, { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Reply {
  id: number;
  name: string;
  body: string;
  is_author: boolean;
  created_at: string;
}

interface Comment {
  id: number;
  name: string;
  body: string;
  is_author: boolean;
  created_at: string;
  replies: Reply[];
}

interface CommentSectionProps {
  postSlug: string;
  comments: Comment[];
  recaptchaSiteKey?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

const AVATAR_COLORS = [
  'bg-indigo-600', 'bg-violet-600', 'bg-pink-600',
  'bg-emerald-600', 'bg-amber-600', 'bg-sky-600',
];
function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── reCAPTCHA loader ─────────────────────────────────────────────────────────

function useRecaptcha(siteKey?: string) {
  useEffect(() => {
    if (!siteKey || document.getElementById('recaptcha-script')) return;
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.head.appendChild(script);
  }, [siteKey]);

  const getToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!siteKey) { resolve(''); return; }
      if (typeof (window as any).grecaptcha === 'undefined') { resolve(''); return; }
      (window as any).grecaptcha.ready(() => {
        (window as any).grecaptcha
          .execute(siteKey, { action: 'submit_comment' })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  return { getToken };
}

// ─── Comment Form ─────────────────────────────────────────────────────────────

interface CommentFormProps {
  postSlug: string;
  parentId?: number | null;
  onCancel?: () => void;
  recaptchaSiteKey?: string;
  compact?: boolean;
  initialBody?: string;
}

function CommentForm({ postSlug, parentId = null, onCancel, recaptchaSiteKey, compact = false, initialBody = '' }: CommentFormProps) {
  const { props } = usePage<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState(initialBody);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { getToken } = useRecaptcha(recaptchaSiteKey);

  // Seed body when initialBody changes (e.g. opening reply for a different comment)
  useEffect(() => {
    if (initialBody) {
      setBody(initialBody);
      // Move cursor to end of the pre-filled text
      setTimeout(() => {
        if (textareaRef.current) {
          const len = textareaRef.current.value.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 0);
    }
  }, [initialBody]);

  // Check flash after redirect
  useEffect(() => {
    if ((props as any)?.flash?.comment_submitted) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setBody('');
    }
  }, [(props as any)?.flash?.comment_submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    let recaptchaToken = '';
    try {
      recaptchaToken = await getToken();
    } catch {
      recaptchaToken = '';
    }

    router.post(
      `/blog/${postSlug}/comments`,
      { name, email, body, parent_id: parentId, recaptcha_token: recaptchaToken },
      {
        preserveScroll: true,
        onSuccess: () => {
          setSubmitted(true);
          setName('');
          setEmail('');
          setBody('');
          if (onCancel) onCancel();
        },
        onError: (errs) => setErrors(errs),
        onFinish: () => setSubmitting(false),
      }
    );
  };

  if (submitted && !onCancel) {
    return (
      <div className="border-2 border-black dark:border-white bg-emerald-50 dark:bg-emerald-950/20 px-6 py-5 text-center">
        <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
          ✓ Comment submitted for review
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          It will appear here once approved.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-3 text-xs font-bold uppercase tracking-widest underline text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          Leave another comment
        </button>
      </div>
    );
  }

  const inputClass = `w-full px-4 py-2.5 text-sm border-2 border-black dark:border-white bg-white dark:bg-[#111] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FA76FF]/60 transition-all duration-200`;
  const errorClass = 'text-red-500 text-xs mt-1 font-medium';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
              maxLength={100}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Your email * (not displayed publicly)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
              maxLength={255}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
        </div>
      )}

      {compact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input type="text" placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)}
              className={inputClass} required maxLength={100} />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>
          <div>
            <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)}
              className={inputClass} required maxLength={255} />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
        </div>
      )}

      <div>
        <textarea
          ref={textareaRef}
          placeholder="Write your comment... (minimum 5 characters)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={compact ? 3 : 5}
          className={`${inputClass} resize-none`}
          required
          minLength={5}
          maxLength={2000}
        />
        {errors.body && <p className={errorClass}>{errors.body}</p>}
        {errors.recaptcha_token && <p className={errorClass}>{errors.recaptcha_token}</p>}
        {errors.parent_id && <p className={errorClass}>{errors.parent_id}</p>}
        <div className="text-xs text-gray-400 dark:text-gray-600 mt-1 text-right">
          {body.length}/2000
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-[11px] font-bold uppercase tracking-widest border-2 border-black dark:border-white hover:bg-[#FA76FF] hover:border-[#FA76FF] dark:hover:bg-[#FA76FF] dark:hover:border-[#FA76FF] dark:hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_rgba(250,118,255,0.5)]"
        >
          {submitting ? 'Submitting...' : parentId ? 'Post Reply' : 'Post Comment'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium underline">
            Cancel
          </button>
        )}
        {recaptchaSiteKey && (
          <span className="text-[10px] text-gray-400 dark:text-gray-600 ml-auto">
            Protected by reCAPTCHA
          </span>
        )}
      </div>
    </form>
  );
}

// ─── Single Reply ─────────────────────────────────────────────────────────────

function ReplyItem({ reply }: { reply: Reply }) {
  return (
    <div className="flex gap-3 pt-3 border-t border-black/5 dark:border-white/5">
      <div className={`w-7 h-7 rounded-full ${reply.is_author ? 'bg-amber-500' : avatarColor(reply.name)} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
        {initials(reply.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-black dark:text-white">{reply.name}</span>
          {reply.is_author && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 rounded-sm">
              ✦ Author
            </span>
          )}
          <span className="text-[10px] text-gray-400">{timeAgo(reply.created_at)}</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-1 whitespace-pre-wrap break-words">{reply.body}</p>
      </div>
    </div>
  );
}

// ─── Single Comment ───────────────────────────────────────────────────────────

function CommentItem({ comment, postSlug, recaptchaSiteKey }: {
  comment: Comment;
  postSlug: string;
  recaptchaSiteKey?: string;
}) {
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div className="border-2 border-black dark:border-white bg-white dark:bg-[#111] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.06)]">
      {/* Comment header */}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full ${comment.is_author ? 'bg-amber-500' : avatarColor(comment.name)} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
          {initials(comment.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-black dark:text-white">{comment.name}</span>
            {comment.is_author && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 rounded-sm">
                ✦ Author
              </span>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-[15px] text-gray-800 dark:text-gray-200 leading-relaxed mt-2 whitespace-pre-wrap break-words">
            {comment.body}
          </p>
          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => setReplying((v) => !v)}
              className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-[#FA76FF] transition-colors"
            >
              {replying ? '✕ Cancel' : '↩ Reply'}
            </button>
            {comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies((v) => !v)}
                className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
              >
                {showReplies ? `▾ ${comment.replies.length} repl${comment.replies.length === 1 ? 'y' : 'ies'}` : `▸ Show replies`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {showReplies && comment.replies.length > 0 && (
        <div className="ml-12 mt-3 flex flex-col gap-3 border-l-2 border-black/10 dark:border-white/10 pl-4">
          {comment.replies.map((r) => <ReplyItem key={r.id} reply={r} />)}
        </div>
      )}

      {/* Reply form */}
      {replying && (
        <div className="ml-12 mt-4 pt-4 border-t border-black/10 dark:border-white/10">
          <CommentForm
            postSlug={postSlug}
            parentId={comment.id}
            onCancel={() => setReplying(false)}
            recaptchaSiteKey={recaptchaSiteKey}
            initialBody={`@${comment.name} `}
            compact
          />
        </div>
      )}
    </div>
  );
}

// ─── Main CommentSection ──────────────────────────────────────────────────────

export function CommentSection({ postSlug, comments, recaptchaSiteKey }: CommentSectionProps) {
  return (
    <section className="mt-16 border-t-2 border-black dark:border-white pt-12">
      {/* Section header */}
      <div className="flex items-baseline gap-4 mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">
          Comments
        </h2>
        {comments.length > 0 && (
          <span className="pf-badge px-2 py-0.5 text-[11px] font-bold">
            {comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)}
          </span>
        )}
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <div className="border-2 border-dashed border-black/20 dark:border-white/20 py-10 text-center mb-10">
          <p className="text-gray-400 dark:text-gray-600 text-sm font-medium">
            No comments yet — be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-10">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} postSlug={postSlug} recaptchaSiteKey={recaptchaSiteKey} />
          ))}
        </div>
      )}

      {/* Leave a comment */}
      <div className="border-2 border-black dark:border-white p-6 bg-white dark:bg-[#111]">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-5 text-black dark:text-white">
          Leave a Comment
        </h3>
        <CommentForm postSlug={postSlug} recaptchaSiteKey={recaptchaSiteKey} />
      </div>

      <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-3">
        Comments are moderated and will appear after review. No spam or disposable emails allowed.
      </p>
    </section>
  );
}
