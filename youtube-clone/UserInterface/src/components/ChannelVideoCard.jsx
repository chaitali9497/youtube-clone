import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar, { getAvatarFromName } from "./Avatar";

function ChannelVideoCard({ video, onDelete, onEdit, isOwner }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const channelName = video.channel?.name || "Channel";
  const avatarSrc =
    video.channel?.avatar || getAvatarFromName(channelName);

  return (
    <div className="relative">
      {/* THUMBNAIL */}
      <div className="relative w-full h-40 overflow-hidden rounded-lg group">
        <Link to={`/watch/${video._id}`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/1280x720?text=No+Thumbnail";
            }}
            className="w-full h-full object-cover"
          />

          {/* PLAY ICON */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 p-3 rounded-full opacity-0 group-hover:opacity-100 transition">
              <FaPlay className="text-white text-lg ml-0.5" />
            </div>
          </div>
        </Link>

        {/* 3 DOT MENU */}
        {isOwner && (
          <div ref={menuRef} className="absolute top-2 right-2 z-50">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen((p) => !p);
              }}
              className="bg-black/70 text-white p-1.5 rounded-full"
            >
              <FiMoreVertical size={18} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                    onEdit?.(video);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <FiEdit2 /> Edit
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                    onDelete(video._id);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex gap-3 mt-3">
        {/* AVATAR */}
        <Avatar
          name={channelName}
          src={avatarSrc}
          size={36}
        />

        {/* TEXT */}
        <div className="flex-1">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-sm font-medium line-clamp-2 hover:underline">
              {video.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 mt-1">
            {channelName}
          </p>

          <p className="text-xs text-gray-500">
            {video.views || 0} views •{" "}
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChannelVideoCard;
