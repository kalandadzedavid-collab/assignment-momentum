import type { Comment } from "../types/types";

const CommentDiv = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex gap-4 items-start transition-colors duration-300">
      {comment.author_avatar ? (
        <img
          className="w-9 h-9 rounded-full object-cover shadow-sm ring-1 ring-neutral-100 dark:ring-purple-900/30"
          src={comment.author_avatar}
          alt=""
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-purple-950 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-purple-300 flex-shrink-0">
          {comment.author_nickname?.[0]?.toUpperCase() || "C"}
        </div>
      )}

      <div className="flex-1 bg-white/40 dark:bg-[#251B33]/30 px-3.5 py-2.5 rounded-2xl border border-neutral-100/70 dark:border-purple-900/20">
        <h4 className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold mb-0.5 transition-colors">
          {comment.author_nickname}
        </h4>
        <p className="text-neutral-600 dark:text-purple-200/80 text-sm leading-relaxed whitespace-pre-wrap transition-colors">
          {comment.text}
        </p>
      </div>
    </div>
  );
};

export default CommentDiv;
