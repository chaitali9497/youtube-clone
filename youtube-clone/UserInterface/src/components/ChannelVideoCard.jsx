function ChannelVideoCard({ video }) {
  return (
    <div className="cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover 
                     group-hover:scale-105 transition duration-300"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 
                         text-white text-xs px-2 py-0.5 rounded">
          {video.duration}
        </span>
      </div>

      {/* Video Info */}
      <h3 className="mt-3 text-sm font-semibold line-clamp-2">
        {video.title}
      </h3>
      <p className="text-xs text-gray-600 mt-1">
        {video.views} • {video.uploadedAt}
      </p>
    </div>
  );
}

export default ChannelVideoCard;
