import { useParams } from "react-router-dom";
import { videos } from "../utils/dummyData";
import { FiThumbsUp, FiShare2, FiMoreHorizontal } from "react-icons/fi";
import Comments from "../components/Comments";
import VideoPlayer from "../components/VideoPlayer";

function Watch() {
  const { id } = useParams();
  const video = videos.find((v) => v.id === id);

  if (!video) {
    return <div className="pt-20 text-center">Video not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div
        className="
          max-w-350 mx-auto px-4
          flex flex-col lg:flex-row gap-6
        "
      >
        {/* videoplayer */}
        <div className="w-full lg:flex-3">
          <div className="aspect-video bg-black rounded-none sm:rounded-xl overflow-hidden">
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnail}
            />
          </div>

          <h1 className="mt-4 text-lg sm:text-xl font-semibold">
            {video.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            {/* Channel */}
            <div className="flex items-center gap-3">
              <img
                src={video.channelAvatar}
                alt={video.channelName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{video.channelName}</p>
                <p className="text-xs text-gray-500">
                  {video.subscribers} subscribers
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-full">
                <FiThumbsUp /> {video.likes}
              </button>
              <button className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-full">
                <FiShare2 /> Share
              </button>
              <button className="p-2 bg-gray-200 rounded-full">
                <FiMoreHorizontal />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4 bg-gray-100 rounded-xl p-4 text-sm">
            <p className="font-medium">
              {video.views} • {video.uploadedAt}
            </p>
            <p className="mt-2 text-gray-700">
              {video.description}
            </p>
          </div>

          {/* Comments */}
          <div className="hidden lg:block">
            <Comments comments={video.comments} />
          </div>
        </div>

        {/*Recommended  in right sidebar */}
        <div className="w-full lg:flex-[1.4] space-y-4">
          {videos
            .filter((v) => v.id !== video.id)
            .map((v) => (
              <div key={v.id} className="flex gap-3 cursor-pointer">
                <img
                  src={v.thumbnail}
                  className="w-36 h-20 sm:w-40 sm:h-24 rounded-lg object-cover"
                  alt={v.title}
                />
                <div>
                  <p className="text-sm font-semibold line-clamp-2">
                    {v.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {v.channelName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {v.views}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Watch;
