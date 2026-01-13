import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "../utils/axios";

function ChannelVideoCard({ video, onDelete, onEdit }) {
  return (
    <div className="relative group">
      <img
        src={video.thumbnail}
        className="rounded-lg w-full h-40 object-cover"
      />

      {/* Actions */}
      <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
        <button
          onClick={() => onEdit(video)}
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

      <h3 className="mt-2 text-sm font-medium">{video.title}</h3>
    </div>
  );
}

export default ChannelVideoCard;
