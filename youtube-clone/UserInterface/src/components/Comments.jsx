import { useEffect, useState } from "react";
import api from "../utils/axios";
import { FiThumbsUp } from "react-icons/fi";
import Avatar from "../components/Avatar";
import AlertBox from "../components/AlertBox";

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    if (!videoId) return;

    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${videoId}`);
        setComments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };

    fetchComments();
  }, [videoId]);

  /* ================= ADD COMMENT ================= */
  const handleAddComment = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) return;

    if (!user) {
      setError("Login required to comment");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(`/comments/${videoId}`, {
        text: text.trim(),
      });

      setComments((prev) => [res.data, ...prev]);
      setText("");
      setFocused(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add comment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setText("");
    setFocused(false);
    setError("");
  };

  return (
    <div className="mt-6">
      {/* HEADER */}
      <h2 className="text-lg font-semibold mb-4">
        {comments.length} Comment{comments.length !== 1 && "s"}
      </h2>

      {/* ERROR */}
      <AlertBox
        type="error"
        message={error}
        onClose={() => setError("")}
      />

      {/* ADD COMMENT */}
      <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
        <Avatar
          name={user?.name || "User"}
          src={user?.avatar}
          size={40}
        />

        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-black pb-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            disabled={loading}
          />

          {/* ACTION BUTTONS */}
          {focused && (
            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm rounded-full hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!text.trim() || loading}
                className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white disabled:opacity-50"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* COMMENTS LIST */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet</p>
      ) : (
        <div className="space-y-6">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <Avatar
                name={c.user?.name || "User"}
                src={c.user?.avatar}
                size={40}
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
                  <button className="flex items-center gap-1 hover:text-black">
                    <FiThumbsUp /> {c.likes?.length || 0}
                  </button>
                  <button className="font-medium hover:text-black">
                    Reply
                  </button>
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
