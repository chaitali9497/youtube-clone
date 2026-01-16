import { useState, useEffect } from "react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import api from "../utils/axios";

/* helper */
const getLikeKey = (videoId) => `like_state_${videoId}`;

function LikeDislike({ videoId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(Number(initialLikes) || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [loading, setLoading] = useState(false);

  /* restore state */
  useEffect(() => {
    const saved = localStorage.getItem(getLikeKey(videoId));
    if (saved) {
      const parsed = JSON.parse(saved);
      setLiked(parsed.liked);
      setDisliked(parsed.disliked);
    }
  }, [videoId]);

  /* LIKE */
  const handleLike = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post(`/videos/${videoId}/like`);

      setLikes(res.data.likes);
      setLiked(true);
      setDisliked(false);

      localStorage.setItem(
        getLikeKey(videoId),
        JSON.stringify({ liked: true, disliked: false })
      );
    } catch (err) {
      console.error("Like failed", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  /* DISLIKE */
  const handleDislike = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post(`/videos/${videoId}/dislike`);

      setLikes(res.data.likes); // backend should return updated likes
      setLiked(false);
      setDisliked(true);

      localStorage.setItem(
        getLikeKey(videoId),
        JSON.stringify({ liked: false, disliked: true })
      );
    } catch (err) {
      console.error("Dislike failed", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center bg-gray-100 rounded-full overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* LIKE */}
      <button
        onClick={handleLike}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200"
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

      <div className="w-px h-6 bg-gray-300" />

      {/* DISLIKE */}
      <button
        onClick={handleDislike}
        disabled={loading}
        className="px-4 py-2 hover:bg-gray-200"
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
