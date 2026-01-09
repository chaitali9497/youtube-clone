import { useParams } from "react-router-dom";
import { videos } from "../utils/dummyData";
import { FiShare2, FiMoreHorizontal } from "react-icons/fi";
import Comments from "../components/Comments";
import VideoPlayer from "../components/VideoPlayer";
import RecommendedVideoCard from "../components/RecommendedVideoCard";
import LikeDislike from "../components/LikeDislike";

function Watch() {
  const { id } = useParams();
  const video = videos.find((v) => v.id === id);

  if (!video) {
    return <div className="pt-20 text-center">Video not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-350 mx-auto px-4 flex flex-col lg:flex-row gap-6">
        {/* VIDEO */}
        <div className="w-full lg:flex-3">
          <div className="aspect-video bg-black rounded-none sm:rounded-xl overflow-hidden">
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnail}
              videoId={video.id}
            />
          </div>

          <h1 className="mt-4 text-lg sm:text-xl font-semibold">
            {video.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            {/* CHANNEL */}
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

            {/* ACTIONS */}
            <div className="flex gap-3 flex-wrap">
              {/*  ONLY THIS */}
              <LikeDislike
                videoId={video.id}
                initialLikes={video.likes}
              />

              <button className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-full">
                <FiShare2 /> Share
              </button>

              <button className="p-2 bg-gray-200 rounded-full">
                <FiMoreHorizontal />
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-4 bg-gray-100 rounded-xl p-4 text-sm">
            <p className="font-medium">
              {video.views} • {video.uploadedAt}
            </p>
            <p className="mt-2 text-gray-700">
              {video.description}
            </p>
          </div>

          {/* COMMENTS */}
          <div className="hidden lg:block">
            <Comments comments={video.comments} />
          </div>
        </div>

        {/* RECOMMENDED */}
        <div className="w-full lg:flex-[1.4]">
          {videos
            .filter((v) => v.id !== video.id)
            .map((v) => (
              <RecommendedVideoCard
                key={v.id}
                video={v}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Watch;
