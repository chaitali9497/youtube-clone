import { useState, useEffect } from "react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import api from "../utils/axios";

function LikeDislike({ videoId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(Number(initialLikes) || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= INITIAL USER REACTION ================= */
  useEffect(() => {
    // optional: if later you expose "likedByUser" from backend
    setLikes(Number(initialLikes) || 0);
  }, [initialLikes]);

  /* ================= LIKE ================= */
  const handleLike = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);

      // optimistic UI
      setLiked((prev) => !prev);
      setDisliked(false);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));

      const res = await api.post(`/videos/${videoId}/like`);

      setLikes(res.data.likes);
    } catch (err) {
      console.error("Like failed", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DISLIKE ================= */
  const handleDislike = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);

      // optimistic UI
      setDisliked((prev) => !prev);
      if (liked) {
        setLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
      }

      await api.post(`/videos/${videoId}/dislike`);
    } catch (err) {
      console.error("Dislike failed", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center bg-gray-200 rounded-full overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* LIKE */}
      <button
        onClick={handleLike}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
      >
        {liked ? (
          <FaThumbsUp className="text-black text-lg" />
        ) : (
          <FiThumbsUp className="text-black text-lg" />
        )}

        <span className="text-sm font-medium">
          {likes >= 1000 ? `${(likes / 1000).toFixed(1)}K` : likes}
        </span>
      </button>

      <div className="w-px h-6 bg-gray-400" />

      {/* DISLIKE */}
      <button
        onClick={handleDislike}
        disabled={loading}
        className="px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
      >
        {disliked ? (
          <FaThumbsDown className="text-black text-lg" />
        ) : (
          <FiThumbsDown className="text-black text-lg" />
        )}
      </button>
    </div>
  );
}

export default LikeDislike;
