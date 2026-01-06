import { useParams } from "react-router-dom";
import { videos } from "../utils/dummyData";

function Watch() {
  const { id } = useParams();

  const video = videos.find(v => v.id === id);

  if (!video) {
    return (
      <div className="pt-20 text-center text-gray-500">
        Video not found
      </div>
    );
  }

  return (
    <div className="pt-16 px-6 flex gap-6 bg-gray-50 min-h-screen">
      {/* LEFT */}
      <div className="flex-1 max-w-225">
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        <h1 className="mt-4 text-xl font-semibold">
          {video.title}
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          {video.views} • {video.uploadedAt}
        </p>
      </div>
    </div>
  );
}

export default Watch;
