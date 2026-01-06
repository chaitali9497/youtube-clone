
import { useNavigate } from "react-router-dom";

function RecommendedVideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/watch/${video.id}`)}
      className="flex gap-3 mb-4 cursor-pointer"
    >
      <img
        src={video.thumbnail}
        className="w-40 h-24 rounded-lg object-cover"
      />
      <div>
        <h3 className="text-sm font-medium line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-gray-600">{video.channel}</p>
        <p className="text-xs text-gray-600">
          {video.views} • {video.uploadedAt}
        </p>
      </div>
    </div>
  );
}

export default RecommendedVideoCard;
