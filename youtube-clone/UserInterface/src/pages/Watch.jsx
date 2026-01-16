import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/axios";
import { FiShare2, FiMoreHorizontal } from "react-icons/fi";
import ShareModal from "../components/ShareModal";

import Comments from "../components/Comments";
import VideoPlayer from "../components/VideoPlayer";
import RecommendedVideoCard from "../components/RecommendedVideoCard";
import LikeDislike from "../components/LikeDislike";
import Loader from "../components/Loader";
import Avatar, { getAvatarFromName } from "../components/Avatar";


function Watch() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openShare, setOpenShare] = useState(false);


  /* ================= FETCH CURRENT VIDEO ================= */
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data.video);
      } catch (err) {
        console.error("Failed to fetch video", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  /* ================= FETCH RECOMMENDED VIDEOS ================= */
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await api.get("/videos");
        setRecommended(res.data.videos || []);
      } catch (err) {
        console.error("Failed to fetch recommended videos", err.response?.data);
      }
    };

    fetchRecommended();
  }, [id]); 

  /* ================= SCROLL TO TOP ================= */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  /* ================= SHUFFLED RECOMMENDED ================= */
  const recommendedList = useMemo(() => {
    return [...recommended]
      .filter(v => v._id !== id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);
  }, [recommended, id]);

  /* ================= LOADING ================= */
  if (loading || !video) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6">
        {/* ================= VIDEO SECTION ================= */}
        <div className="w-full lg:flex-[2.5]">
          {/* VIDEO */}
          <div className="aspect-video bg-black rounded-none sm:rounded-xl overflow-hidden">
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnail}
              videoId={video._id}
            />
          </div>

          {/* TITLE */}
          <h1 className="mt-4 text-lg sm:text-xl font-semibold">
            {video.title}
          </h1>

          {/* CHANNEL + ACTIONS */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
           {/* CHANNEL */}
<Link
  to={`/channel/${video.channel?._id}`}
  className="flex items-center gap-3"
>
  <Avatar
    name={video.channel?.name || "Channel"}
    src={
      video.channel?.avatar ||
      getAvatarFromName(video.channel?.name || "Channel")
    }
    size={40}
  />

  <div>
    <p className="font-semibold">
      {video.channel?.name || "Unknown Channel"}
    </p>
    <p className="text-xs text-gray-500">
      {video.channel?.subscribers || 0} subscribers
    </p>
  </div>
</Link>


            {/* ACTIONS */}
            <div className="flex gap-3 flex-wrap">
              <LikeDislike
                videoId={video._id}
                initialLikes={video.likes?.length || 0}
              />

            <button
  onClick={() => setOpenShare(true)}
  className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
>
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
              {video.views?.toLocaleString()} views •{" "}
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 text-gray-700">
              {video.description}
            </p>
          </div>

          {/* COMMENTS */}
          <div className="hidden lg:block">
            <Comments videoId={video._id} />
          </div>
        </div>

        {/* ================= RECOMMENDED ================= */}
        <div className="w-full lg:flex-[1.4]">
          {recommendedList.length === 0 && (
            <p className="text-gray-500 text-sm">No recommendations</p>
          )}

          {recommendedList.map(v => (
            <RecommendedVideoCard key={v._id} video={v} />
          ))}
        </div>
      </div>
      <ShareModal
  open={openShare}
  onClose={() => setOpenShare(false)}
  url={window.location.href}
  title={video.title}
/>

    </div>
  );
}

export default Watch;
