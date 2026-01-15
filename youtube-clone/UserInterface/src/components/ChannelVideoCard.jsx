import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

function ChannelVideoCard({ video, onDelete, onEdit, isOwner }) {
  return (
    <div className="relative group">
      {/* CLICKABLE THUMBNAIL */}
      <Link to={`/watch/${video._id}`} className="block">
        <div className="relative w-full h-40">
          <img
            src={
              video.thumbnail?.startsWith("http")
                ? video.thumbnail
                : "https://i.imgur.com/8Km9tLL.jpg"
            }
            alt={video.title}
            className="w-full h-full object-cover rounded-lg"
          />

          {/* ▶ PLAY BUTTON  */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 p-3 rounded-full opacity-0 group-hover:opacity-100 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="w-6 h-6 text-white fill-current"
              >
                <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* OWNER ACTIONS */}
      {isOwner && (
        <div className="absolute top-2 right-2 hidden group-hover:flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.(video);
            }}
            className="bg-white p-2 rounded-full shadow"
          >
            <FiEdit2 size={14} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(video._id);
            }}
            className="bg-white p-2 rounded-full shadow text-red-600"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}

      {/* TITLE */}
      <Link to={`/watch/${video._id}`}>
        <h3 className="mt-2 text-sm font-medium hover:underline cursor-pointer">
          {video.title}
        </h3>
      </Link>
    </div>
  );
}

export default ChannelVideoCard;
