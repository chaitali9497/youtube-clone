import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import api from "../utils/axios";
import ChannelVideoCard from "../components/ChannelVideoCard";
import Loader from "../components/Loader";

function Channel() {
  const { channelId } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");

  const tabsRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH CHANNEL + VIDEOS ================= */
  useEffect(() => {
    if (!channelId) return;

    const fetchChannel = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/channels/${channelId}`);
        setChannel(res.data.channel);
        setVideos(res.data.videos || []);
      } catch (err) {
        console.error("Fetch channel failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [channelId]);

  /* ================= OWNER CHECK ================= */
  const isOwner = useMemo(() => {
    if (!user || !channel) return false;
    return user._id === channel.owner?._id;
  }, [user, channel]);

  /* ================= LOADING ================= */
  if (loading || !channel) return <Loader />;

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

  /* ================= TAB SCROLL ================= */
  const scrollTabs = () => {
    tabsRef.current?.scrollBy({
      left: 120,
      behavior: "smooth",
    });
  };

  return (
    <div className="pt-14 max-w-7xl mx-auto">
      {/* ===== CHANNEL HEADER ===== */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start px-4 sm:px-6 py-4 sm:py-6">
        {/* Avatar */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center text-white text-4xl sm:text-6xl font-semibold">
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

        {/* Channel Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {channel.name}
          </h1>

          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            @{channel.handle || "yourhandle"} •{" "}
            {channel.subscribers || 0} subscriber
            {channel.subscribers !== 1 && "s"} •{" "}
            {videos.length} video
            {videos.length !== 1 && "s"}
          </p>

          <p className="text-sm sm:text-base text-gray-700 mt-2">
            {channel.description || "More about this channel..."}
          </p>

          {isOwner && (
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
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

      {/* ===== CHANNEL TABS ===== */}
      <div className="border-b px-4 sm:px-6">
        <div className="relative flex items-center">
          <div
            ref={tabsRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide"
          >
            {["Home", "Videos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm sm:text-base whitespace-nowrap border-b-2 transition
                  ${
                    activeTab === tab
                      ? "border-black font-semibold"
                      : "border-transparent text-gray-500 hover:text-black"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Arrow (mobile only) */}
          <button
            onClick={scrollTabs}
            className="absolute right-0 bg-white pl-3 md:hidden"
          >
            ▶
          </button>
        </div>
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="px-4 sm:px-6 py-6">
        {/* HOME TAB */}
        {activeTab === "Home" && (
          <>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Latest videos
            </h2>

            {videos.length === 0 ? (
              <p className="text-gray-500">No videos uploaded yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {videos.slice(0, 4).map((video) => (
                  <ChannelVideoCard
                    key={video._id}
                    video={video}
                    onDelete={handleDelete}
                    isOwner={isOwner}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* VIDEOS TAB */}
        {activeTab === "Videos" && (
          <>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Videos
            </h2>

            {videos.length === 0 ? (
              <p className="text-gray-500">No videos uploaded yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
          </>
        )}
      </div>
    </div>
  );
}

export default Channel;
