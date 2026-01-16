import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/axios";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import Avatar, { getAvatarFromName } from "../components/Avatar";

function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const [activeFilter, setActiveFilter] = useState("All");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const shouldShowContent = isLoggedIn || searchQuery;

  /* ================= FETCH VIDEOS ================= */
  useEffect(() => {
    let mounted = true;

    const fetchVideos = async () => {
      setLoading(true);
      try {
        const url = searchQuery
          ? `/videos?search=${searchQuery}`
          : `/videos?limit=12`;

        const res = await api.get(url);

        if (mounted) {
          setVideos(res.data?.videos || res.data || []);
        }
      } catch {
        if (mounted) setError("Failed to load videos");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (shouldShowContent) {
      fetchVideos();
    }

    return () => {
      mounted = false;
    };
  }, [shouldShowContent, searchQuery]);

  /* ================= EMPTY STATE (GUEST ONLY) ================= */
  if (!shouldShowContent) {
    return (
      <div className="flex justify-center pt-10">
        <div className="bg-white border rounded-xl px-10 py-8 text-center max-w-xl shadow">
          <h1 className="text-2xl font-semibold mb-2">
            Try searching to get started
          </h1>
          <p className="text-gray-400">
            Start watching videos to build your feed.
          </p>
        </div>
      </div>
    );
  }

  /* ================= FILTER + SEARCH ================= */
  const filteredVideos = videos.filter(video => {
    const title = video.title?.toLowerCase() || "";
    const channelName = video.channel?.name?.toLowerCase() || "";

    const matchesSearch =
      !searchQuery ||
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
      {/*  FILTER BAR SHOWN FOR SEARCH + LOGGED IN */}
      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {error && (
        <p className="text-center text-red-500 my-6">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex justify-center my-6">
          <Loader />
        </div>
      )}

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
                  loading="lazy"
                  className="w-full aspect-video object-cover group-hover:scale-[1.03] transition-transform"
                />

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="bg-black/70 p-4 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      className="w-8 h-8 fill-white ml-1"
                    >
                      <path d="M187.2 100.9L523.2 284.9C536 291.9 544 305.4 544 320C544 334.6 536 348.1 523.2 355.1L187.2 539.1C174.8 545.9 159.8 545.6 147.6 538.4C135.5 531.2 128 518.1 128 504L128 136C128 121.9 135.4 108.8 147.6 101.6C159.8 94.4 174.8 94.1 187.2 100.9Z" />
                    </svg>
                  </div>
                </div>

                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                )}
              </div>

              {/* INFO */}
              <div className="flex gap-3 mt-3">
                <Avatar
                  name={video.channel?.name || "Channel"}
                  src={
                    video.channel?.avatar ||
                    getAvatarFromName(
                      video.channel?.name || "Channel"
                    )
                  }
                  size={36}
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
          !loading && (
            <p className="col-span-full text-center text-gray-500">
              No videos found
            </p>
          )
        )}
      </div>
    </>
  );
}

export default Home;
