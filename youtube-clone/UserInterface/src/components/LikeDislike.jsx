import { useState, useEffect } from "react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

function LikeDislike({ videoId, initialLikes }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(initialLikes || 0);

  useEffect(() => {
    const saved = localStorage.getItem(`reaction-${videoId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setLiked(data.liked);
      setDisliked(data.disliked);
      setLikes(initialLikes + (data.liked ? 1 : 0));
    }
  }, [videoId, initialLikes]);

  useEffect(() => {
    localStorage.setItem(
      `reaction-${videoId}`,
      JSON.stringify({ liked, disliked })
    );
  }, [liked, disliked, videoId]);

  const handleLike = (e) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikes((p) => p - 1);
    } else {
      setLiked(true);
      setLikes((p) => p + 1);
      if (disliked) setDisliked(false);
    }
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      if (liked) {
        setLiked(false);
        setLikes((p) => p - 1);
      }
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
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-300"
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
        className="px-4 py-2 hover:bg-gray-300"
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
