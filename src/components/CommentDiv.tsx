const CommentDiv = ({ comment }) => {
 
  return (
    <div className="flex gap-4">
      <img
        className="w-9.5 rounded-[40px]"
        src={comment.author_avatar}
        alt=""
      />
      <div>
        <h3
          className="text-neutral-800
text-lg
font-medium"
        >
          {comment.author_nickname}
        </h3>
        <p
          className="text-neutral-700
text-base"
        >
          {comment.text}
        </p>
      </div>
    </div>
  );
};

export default CommentDiv;
