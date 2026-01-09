import ChannelVideoCard from "../components/ChannelVideoCard";

const videos = [
  {
    id: 1,
    title: "React JS Full Course 2024",
    thumbnail: "https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg",
    views: "1.2M views",
    uploadedAt: "2 days ago",
    duration: "2:35:20",
  },
  {
    id: 2,
    title: "YouTube Clone with React & Tailwind",
    thumbnail: "https://i.ytimg.com/vi/FHTbsZEJspU/maxresdefault.jpg",
    views: "850K views",
    uploadedAt: "1 week ago",
    duration: "1:45:10",
  },
  {
    id: 3,
    title: "Node.js Crash Course",
    thumbnail: "https://i.ytimg.com/vi/f2EqECiTBL8/maxresdefault.jpg",
    views: "640K views",
    uploadedAt: "3 weeks ago",
    duration: "1:10:42",
  },
];

function Channel() {
  return (
    <div className="pt-14">

      {/*  CHANNEL BANNER */}
      <div className="h-48 md:h-56 w-full">
        <img
          src="https://i.imgur.com/8Km9tLL.jpg"
          alt="Channel Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/*  CHANNEL HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center 
                      gap-6 px-6 py-6 bg-white">
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Channel Avatar"
          className="w-24 h-24 rounded-full"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Code With Chaiti</h1>
          <p className="text-gray-600 text-sm">
            @codewithchaiti • 120K subscribers • 120 videos
          </p>
          <p className="text-gray-700 text-sm mt-1 max-w-xl">
            Learn React, Node.js, MongoDB & build real-world projects 🚀
          </p>
        </div>

        <button className="bg-black text-white px-6 py-2 rounded-full 
                           hover:bg-gray-800 transition">
          Subscribe
        </button>
      </div>

      {/*  CHANNEL TABS */}
      <div className="border-b px-6">
        <ul className="flex gap-8 text-sm font-medium text-gray-600">
          <li className="pb-3 border-b-2 border-black text-black cursor-pointer">
            Home
          </li>
          <li className="pb-3 cursor-pointer hover:text-black">Videos</li>
          <li className="pb-3 cursor-pointer hover:text-black">Shorts</li>
          <li className="pb-3 cursor-pointer hover:text-black">About</li>
        </ul>
      </div>

      {/*  VIDEOS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                      gap-6 p-6">
        {videos.map(video => (
          <ChannelVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Channel;
