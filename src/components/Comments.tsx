import CommentDiv from "./CommentDiv";
import type { Comment } from "../types/types";

const Comments = ({ comments }: { comments?: Comment[] | null }) => {
  return (
    <section className="flex flex-col gap-5 mt-2">
      {comments && comments.length > 0 ? (
        comments.map((comment: Comment) => {
          return <CommentDiv key={comment.id} comment={comment} />;
        })
      ) : (
        <p className="text-neutral-400 dark:text-purple-300/40 text-sm text-center py-6 italic transition-colors">
          კომენტარები ჯერ არ არის
        </p>
      )}
    </section>
  );
};

export default Comments;