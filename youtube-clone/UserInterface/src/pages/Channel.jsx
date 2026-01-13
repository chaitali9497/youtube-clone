import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import ChannelVideoCard from "../components/ChannelVideoCard";
import EditVideoModal from "../components/EditVideoModal";
import Loader from "../components/Loader";  




function Channel() {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);

  useEffect(() => {
    if (!channelId) navigate("/create-channel");
  }, [channelId, navigate]);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/channels/${channelId}`);
        setChannel(res.data.channel);
        setVideos(res.data.videos);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChannel();
  }, [channelId]);

  if (!channel) return <div><Loader /></div>;
  const handleDelete = async (id) => {
  if (!window.confirm("Delete this video?")) return;

  try {
    await axios.delete(`/videos/${id}`);
    setVideos((prev) => prev.filter((v) => v._id !== id));
  } catch {
    alert("Delete failed");
  }
};


const handleEditSave = async (id, data) => {
  const res = await axios.put(`/videos/${id}`, data);

  setVideos((prev) =>
    prev.map((v) => (v._id === id ? res.data : v))
  );
};


  return (
    <div className="pt-14">
      {/* Banner */}
      <div className="h-48 md:h-56 w-full bg-gray-200">
        <img
          src={channel.banner || "https://i.imgur.com/8Km9tLL.jpg"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <div className="px-6 py-6 bg-white flex gap-6 items-center">
        <img
          src={channel.avatar || `https://ui-avatars.com/api/?name=${channel.name}`}
          className="w-24 h-24 rounded-full"
        />

        <div>
          <h1 className="text-2xl font-bold">{channel.name}</h1>
          <p className="text-sm text-gray-600">
            @{channel.handle} • {videos.length} videos
          </p>
        </div>
      </div>

      {/* Videos */}
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {videos.map((video) => (
  <ChannelVideoCard
    key={video._id}
    video={video}
    onEdit={setEditingVideo}
    onDelete={handleDelete}
  />
))}
{editingVideo && (
  <EditVideoModal
    video={editingVideo}
    onClose={() => setEditingVideo(null)}
    onSave={handleEditSave}
  />
)}

      </div>
    </div>
  );
}

export default Channel;
