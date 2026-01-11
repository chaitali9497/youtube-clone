import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/axios";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";

function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const [activeFilter, setActiveFilter] = useState("All");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const safeVideos = Array.isArray(videos) ? videos : [];

  /* ================= FETCH VIDEOS ================= */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get("/api/videos");

        // supports: { videos: [] } OR []
        setVideos(res.data.videos || res.data || []);
      } catch (error) {
        console.error("Failed to fetch videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  /* ================= AUTH CHECK ================= */
  if (!isLoggedIn) {
    return (
      <div className="flex items-start justify-center h-full pt-8">
        <div className="bg-white border border-gray-100 rounded-xl px-10 py-8 text-center max-w-2xl shadow-lg">
          <h1 className="text-2xl font-semibold text-black mb-2">
            Try searching to get started
          </h1>
          <p className="text-gray-400">
            Start watching videos to help us build a feed of videos you’ll love.
          </p>
        </div>
      </div>
    );
  }

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  /* ================= FILTER + SEARCH ================= */
  const filteredVideos = safeVideos.filter(video => {
    const title = video.title?.toLowerCase() || "";
    const channelName = video.channel?.name?.toLowerCase() || "";

    const matchesSearch =
      searchQuery === "" ||
      title.includes(searchQuery) ||
      channelName.includes(searchQuery);

    const matchesFilter =
      activeFilter === "All" ||
      title.includes(activeFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  /* ================= UI ================= */
  return (
    <>
      {/* FILTER BAR */}
      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* VIDEO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map(video => (
            <div
              key={video._id}
              className="cursor-pointer group"
              onClick={() => navigate(`/watch/${video._id}`)}
            >
              {/* THUMBNAIL */}
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* PLAY ICON */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/70 p-4 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      className="w-8 h-8 fill-white ml-1"
                    >
                      <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z" />
                    </svg>
                  </div>
                </div>

                {/* DURATION */}
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                )}
              </div>

              {/* VIDEO INFO */}
              <div className="flex gap-3 mt-3">
                <img
                  src={video.channel?.avatar || "/default-avatar.png"}
                  alt={video.channel?.name}
                  className="w-9 h-9 rounded-full"
                  onClick={e => e.stopPropagation()}
                />

                <div>
                  <h3 className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="text-xs text-gray-600 mt-1">
                    {video.channel?.name || "Unknown Channel"}
                  </p>

                  <p className="text-xs text-gray-600">
                    {video.views?.toLocaleString()} views •{" "}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No videos found
          </p>
        )}
      </div>
    </>
  );
}

export default Home;
