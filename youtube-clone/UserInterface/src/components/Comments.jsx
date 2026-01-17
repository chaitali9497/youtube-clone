import { useEffect, useState } from "react";
import api from "../utils/axios";
import { FiThumbsUp, FiMoreVertical } from "react-icons/fi";
import Avatar from "../components/Avatar";
import AlertBox from "../components/AlertBox";
import Snackbar from "../components/Snackbar";

/* ================= NORMALIZE USER ================= */
const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  return {
    ...rawUser,
    _id: rawUser._id || rawUser.id,
  };
};

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [menuOpen, setMenuOpen] = useState(null);

  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "error",
    action: null,
  });

  /* ================= NORMALIZE LOGGED USER ================= */
  const rawUser = JSON.parse(localStorage.getItem("user"));
  const user = rawUser
    ? { ...rawUser, _id: rawUser._id || rawUser.id }
    : null;

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    if (!videoId) return;

    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${videoId}`);

        const normalized = (res.data || []).map((c) => ({
          ...c,
          user: normalizeUser(c.user),
        }));

        setComments(normalized);
      } catch {
        setError("Failed to load comments");
      }
    };

    fetchComments();
  }, [videoId]);

  /* ================= ADD COMMENT ================= */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await api.post(`/comments/${videoId}`, {
        text: text.trim(),
      });

      const normalizedComment = {
        ...res.data,
        user: normalizeUser(res.data.user),
      };

      setComments((prev) => [normalizedComment, ...prev]);
      setText("");
      setFocused(false);
    } catch {
      setError("Failed to add comment");
    }
  };

  /* ================= LIKE / UNLIKE ================= */
  const handleToggleLike = async (id) => {
    try {
      const res = await api.patch(`/comments/like/${id}`);

      setComments((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                likes: res.data.likedByUser
                  ? [...c.likes, user._id]
                  : c.likes.filter((uid) => uid !== user._id),
              }
            : c
        )
      );
    } catch {
      setError("Failed to like comment");
    }
  };

  /* ================= CONFIRM DELETE ================= */
  const confirmDelete = (id) => {
    setSnackbar({
      message: "Delete this comment?",
      type: "error",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/comments/${id}`);
            setComments((prev) => prev.filter((c) => c._id !== id));
            setSnackbar({
              message: "Comment deleted",
              type: "success",
              action: null,
            });
          } catch {
            setError("Failed to delete comment");
          }
        },
      },
    });
  };

  /* ================= SAVE EDIT ================= */
const handleSaveEdit = async (id) => {
  if (!editText.trim()) return;

  try {
    const { data } = await api.put(`/comments/edit/${id}`, {
      text: editText.trim(),
    });

    setComments((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, text: data.text } : c
      )
    );

    setEditingId(null);
     setEditText("");
  setSnackbar({
      message: "Comment updated successfully",
      type: "success",
      action: null,
    });
  } catch {
    setSnackbar({
      message: "Failed to edit comment",
      type: "error",
      action: null,
    });
  }
};
  /* ================= RENDER ================= */


  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">
        {comments.length} Comments
      </h2>

      <AlertBox type="error" message={error} onClose={() => setError("")} />

      {/* ADD COMMENT */}
      <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
        <Avatar name={user?.name} src={user?.avatar} size={40} />

        <div className="flex-1">
          <input
            placeholder="Add a comment..."
            className="w-full border-b pb-2 focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
          />

          {focused && (
            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={() => {
                  setFocused(false);
                  setText("");
                }}
                className="px-4 py-2 rounded-full"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full">
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* COMMENTS */}
      <div className="space-y-6">
        {comments.map((c) => {
          const isOwner = user?._id === c.user?._id;
          const likedByUser = c.likes?.includes(user?._id);

          return (
            <div key={c._id} className="flex gap-3">
              <Avatar name={c.user?.name} src={c.user?.avatar} size={40} />

              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-semibold">{c.user?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* OWNER MENU */}
                  {isOwner && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen(menuOpen === c._id ? null : c._id)
                        }
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <FiMoreVertical />
                      </button>

                      {menuOpen === c._id && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow text-sm z-10">
                          <button
                            onClick={() => {
                              setEditingId(c._id);
                              setEditText(c.text);
                              setMenuOpen(null);
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setMenuOpen(null);
                              confirmDelete(c._id);
                            }}
                            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* EDIT MODE */}
                {editingId === c._id ? (
                  <div className="mt-2 flex gap-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 border px-2 py-1 rounded"
                    />
                    <button
  onClick={() => handleSaveEdit(c._id)}
  className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full
             hover:bg-blue-700 transition"
>
  Save
</button>

<button
  onClick={() => setEditingId(null)}
  className="px-4 py-1.5 text-sm font-medium text-gray-600 rounded-full
             hover:bg-gray-100 transition"
>
  Cancel
</button>

                  </div>
                ) : (
                  <p className="text-sm mt-1">{c.text}</p>
                )}

                {/* ACTIONS */}
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <button
                    onClick={() => handleToggleLike(c._id)}
                    className={`flex items-center gap-1 ${
                      likedByUser ? "text-blue-600" : ""
                    }`}
                  >
                    <FiThumbsUp />
                    {c.likes?.length || 0}
                  </button>
                  <button>Reply</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SNACKBAR */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        action={snackbar.action}
        onClose={() =>
          setSnackbar({ message: "", type: "success", action: null })
        }
      />
    </div>
  );
}

export default Comments;
