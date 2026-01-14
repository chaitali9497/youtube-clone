import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "../utils/axios";
import ChannelVideoCard from "../components/ChannelVideoCard";
import Loader from "../components/Loader";

function Channel() {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
  const checkChannel = async () => {
    try {
      const res = await api.get("/channels/me");

      if (res.data?._id) {
        navigate(`/channel/${res.data._id}`, { replace: true });
      }
    } catch {
      // user has no channel → allow create page
    }
  };

  checkChannel();
}, [navigate]);


  useEffect(() => {
    if (!channelId) return;

    const fetchChannel = async () => {
      try {
        const res = await api.get(`/channels/${channelId}`);

        // backend returns { channel, videos }
        setChannel(res.data.channel);
        setVideos(res.data.videos);
      } catch (err) {
        console.error("Fetch channel failed", err);
      }
    };

    fetchChannel();
  }, [channelId]);

  //  check ownership safely
  const isOwner = useMemo(() => {
    if (!user || !channel) return false;
    return user._id === channel.owner?._id;
  }, [user, channel]);

  if (!channel) return <Loader />;

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
    <div className="pt-14">
      {/* BANNER */}
      <div className="h-48 bg-gray-200">
        <img
          src={channel.banner || "https://i.imgur.com/8Km9tLL.jpg"}
          className="w-full h-full object-cover"
          alt="banner"
        />
      </div>

      {/* HEADER */}
      <div className="px-6 py-6 flex gap-6 items-center">
        <img
          src={
            channel.avatar ||
            `https://ui-avatars.com/api/?name=${channel.name}`
          }
          className="w-24 h-24 rounded-full"
          alt="avatar"
        />

        <div>
          <h1 className="text-2xl font-bold">{channel.name}</h1>
          <p className="text-gray-600">
            {videos.length} videos • {channel.subscribers} subscribers
          </p>
        </div>
      </div>

      {/* VIDEOS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        {videos.map((video) => (
          <ChannelVideoCard
            key={video._id}
            video={video}
            onDelete={handleDelete}
            isOwner={isOwner}   
          />
        ))}
      </div>
    </div>
  );
}

export default Channel;
