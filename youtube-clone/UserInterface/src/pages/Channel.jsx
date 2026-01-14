import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "../utils/axios";
import ChannelVideoCard from "../components/ChannelVideoCard";
import Loader from "../components/Loader";

function Channel() {
  const { channelId } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH CHANNEL + VIDEOS ================= */
  useEffect(() => {
    if (!channelId) return;

    const fetchChannel = async () => {
      try {
        
        const res = await api.get(`/channels/${channelId}`);

        
        setChannel(res.data.channel);
        setVideos(res.data.videos || []);
      } catch (err) {
        console.error("Fetch channel failed", err);
        setVideos([]);
      }
    };

    fetchChannel();
  }, [channelId]);

  /* ================= OWNER CHECK ================= */
  const isOwner = useMemo(() => {
    if (!user || !channel) return false;
    return user.id === channel.owner?._id;
  }, [user, channel]);

  /* ================= LOADING ================= */
  if (!channel) return <Loader />;

  /* ================= DELETE VIDEO ================= */
  const handleDelete = async (id) => {
    if (!isOwner) return;
    if (!window.confirm("Delete this video?")) return;

    try {
      await api.delete(`/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="pt-14 max-w-7xl mx-auto">
      {/* ===== CHANNEL HEADER ===== */}
      <div className="flex gap-6 items-center px-6 py-6">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center text-white text-6xl font-semibold">
          {channel.avatar ? (
            <img
              src={channel.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            channel.name?.[0]
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{channel.name}</h1>

          <p className="text-gray-600 mt-1">
            @{channel.handle || "yourhandle"} •{" "}
            {channel.subscribers || 0} subscriber
            {channel.subscribers !== 1 && "s"} •{" "}
            {videos.length} video
            {videos.length !== 1 && "s"}
          </p>

          <p className="text-sm text-gray-700 mt-2">
            {channel.description || "More about this channel..."}
          </p>

          {isOwner && (
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium">
                Customize channel
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium">
                Manage videos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== VIDEOS ===== */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-semibold mb-4">Videos</h2>

        {videos.length === 0 && (
          <p className="text-gray-500">No videos uploaded yet</p>
        )}

        {videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {videos.map((video) => (
              <ChannelVideoCard
                key={video._id}
                video={video}
                onDelete={handleDelete}
                isOwner={isOwner}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Channel;
