import CommentDiv from "./CommentDiv";

const Comments = ({ comments }) => {

  return (
    <section className="max-h-100 overflow-y-scroll mt-10 flex flex-col gap-10">
      <div className="flex gap-3 items-center">
        <h3
          className="text-black
text-xl
font-medium"
        >
          კომენტარები
        </h3>
        <button
          className=" text-white
text-sm
font-medium w-7 h-5 flex items-center justify-center bg-violet-600 rounded-[30px]"
        >
          {comments && comments.length}
        </button>
      </div>

      {comments &&
        comments.map((comment) => {
          return <CommentDiv key={comment.id} comment={comment} />;
        })}
    </section>
  );
};

export default Comments;
