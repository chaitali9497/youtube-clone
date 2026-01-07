import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { videos } from "../utils/dummyData";
import FilterBar from "../components/FilterBar";

function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  // READ SEARCH QUERY FROM URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  // If user not logged in
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

  // FILTER + SEARCH (BOTH TOGETHER)
  const filteredVideos = videos.filter(video => {
    const title = video.title.toLowerCase();
    const channel = video.channelName.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      title.includes(searchQuery) ||
      channel.includes(searchQuery);

    const matchesFilter =
      activeFilter === "All" ||
      title.includes(activeFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

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
              key={video.id}
              className="cursor-pointer group"
              onClick={() => navigate(`/watch/${video.id}`)}
            >
              {/* Thumbnail */}
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play Button */}
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

                {/* Duration */}
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                  {video.duration}
                </span>
              </div>

              {/* Video Info */}
              <div className="flex gap-3 mt-3">
                <img
                  src={video.channelAvatar}
                  alt={video.channelName}
                  className="w-9 h-9 rounded-full"
                  onClick={e => e.stopPropagation()}
                />

                <div>
                  <h3 className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {video.channelName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {video.views} • {video.uploadedAt}
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
