import { FiThumbsUp } from "react-icons/fi";

function Comments({ comments }) {
  return (
    <div className="mt-6">
      {/* Comment count */}
      <h2 className="text-lg font-semibold mb-4">
        {comments.length} Comments
      </h2>

      {/* Add Comment (UI only for now) */}
      <div className="flex gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
          U
        </div>

        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black pb-2"
        />
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <img
              src={c.avatar}
              alt={c.user}
              className="w-10 h-10 rounded-full"
            />

            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{c.user}</p>
                <span className="text-xs text-gray-500">{c.time}</span>
              </div>

              <p className="text-sm mt-1">{c.text}</p>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <button className="flex items-center gap-1">
                  <FiThumbsUp /> {c.likes}
                </button>
                <button className="font-medium">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
