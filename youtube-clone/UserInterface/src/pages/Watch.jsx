import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ChannelVideoCard({ video, onDelete, isOwner }) {
  const navigate = useNavigate();

  return (
    <div className="relative group">
      {/* PLAY */}
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/watch/${video._id}`)}
      >
        <img
          src={
            video.thumbnail && video.thumbnail.startsWith("http")
              ? video.thumbnail
              : "https://i.imgur.com/8Km9tLL.jpg"
          }
          className="rounded-lg w-full h-40 object-cover"
          alt={video.title}
        />
      </div>

      {/* OWNER ACTIONS */}
      {isOwner && (
        <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
          <button
            onClick={() => navigate(`/edit-video/${video._id}`)}
            className="bg-white p-2 rounded-full shadow"
          >
            <FiEdit2 size={14} />
          </button>

          <button
            onClick={() => onDelete(video._id)}
            className="bg-white p-2 rounded-full shadow text-red-600"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}

      <h3 className="mt-2 text-sm font-medium">{video.title}</h3>
    </div>
  );
}

export default ChannelVideoCard;
