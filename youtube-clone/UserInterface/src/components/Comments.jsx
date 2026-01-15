import { useEffect, useState } from "react";
import api from "../utils/axios";
import { FiThumbsUp } from "react-icons/fi";

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    if (!videoId) return;

    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };

    fetchComments();
  }, [videoId]);

  /* ================= ADD COMMENT ================= */
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await api.post(`/comments/${videoId}`, {
        text,
      });

      // add new comment on top
      setComments((prev) => [res.data, ...prev]);
      setText("");
    } catch (err) {
      console.error("Add comment failed", err.response?.data);
      alert("Login required to comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {/* HEADER */}
      <h2 className="text-lg font-semibold mb-4">
        {comments.length} Comment{comments.length !== 1 && "s"}
      </h2>

      {/* ADD COMMENT */}
      <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
          U
        </div>

        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border-b border-gray-300 bg-transparent focus:outline-none focus:border-black pb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
      </form>

      {/* COMMENTS LIST */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet</p>
      ) : (
        <div className="space-y-6">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <img
                src={c.user?.avatar || "/default-avatar.png"}
                alt={c.user?.name}
                className="w-10 h-10 rounded-full"
              />

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">
                    {c.user?.name || "User"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm mt-1">{c.text}</p>

                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <button className="flex items-center gap-1">
                    <FiThumbsUp /> {c.likes?.length || 0}
                  </button>
                  <button className="font-medium">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Comments;
