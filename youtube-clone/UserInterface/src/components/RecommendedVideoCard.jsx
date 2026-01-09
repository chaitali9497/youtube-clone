import { useNavigate } from "react-router-dom";

function RecommendedVideoCard({ video }) {
  const navigate = useNavigate();

  if (!video) return null;

  return (
    <div
      onClick={() => navigate(`/watch/${video.id}`)}
      className="
        flex gap-3 mb-4 cursor-pointer
        hover:bg-gray-100 rounded-lg p-2
        transition
      "
    >
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-40 h-24 rounded-lg object-cover"
        />
        {video.duration && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-sm font-medium line-clamp-2">
          {video.title}
        </h3>

        <p className="text-xs text-gray-600 mt-1">
          {video.channelName || video.channel}
        </p>

        <p className="text-xs text-gray-600">
          {video.views} • {video.uploadedAt}
        </p>
      </div>
    </div>
  );
}

export default RecommendedVideoCard;
