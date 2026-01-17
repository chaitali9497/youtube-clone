import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import api from "../utils/axios";
import ChannelVideoCard from "../components/ChannelVideoCard";
import Loader from "../components/Loader";
import EditVideoModal from "../components/EditVideoModal";
import Snackbar from "../components/Snackbar";
import Avatar, { getAvatarFromName } from "../components/Avatar";

function Channel() {
  const { channelId } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");
  const [editingVideo, setEditingVideo] = useState(null);
  const [snackbar, setSnackbar] = useState({ message: "", type: "success" });

  const tabsRef = useRef(null);

  /* ================= NORMALIZE USER ================= */
  const rawUser = JSON.parse(localStorage.getItem("user"));
  const user = rawUser
    ? { ...rawUser, _id: rawUser._id || rawUser.id }
    : null;

  /* ================= FETCH CHANNEL + VIDEOS ================= */
  useEffect(() => {
    if (!channelId) return;

    const fetchChannel = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/channels/${channelId}`);
        const raw = res.data.channel;

        /* ===== CORRECT NORMALIZATION ===== */
        const normalizedChannel = {
          id: raw._id,
          name: raw.name,
          description: raw.description,
          banner: raw.banner || null,
          subscribers: raw.subscribers || 0,
          avatar: raw.avatar || getAvatarFromName(raw.name),
          owner: {
            _id:
              typeof raw.owner === "object"
                ? raw.owner._id || raw.owner.id
                : raw.owner,
          },
        };

        setChannel(normalizedChannel);
        setVideos(res.data.videos || []);
      } catch (err) {
        console.error("Fetch channel failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [channelId]);

  /* ================= AUTO HIDE SNACKBAR ================= */
  useEffect(() => {
    if (!snackbar.message) return;
    const t = setTimeout(
      () => setSnackbar({ message: "", type: "success" }),
      3000
    );
    return () => clearTimeout(t);
  }, [snackbar.message]);

  /* ================= OWNER CHECK ================= */
  const isOwner = useMemo(() => {
    if (!user?._id || !channel?.owner?._id) return false;
    return String(user._id) === String(channel.owner._id);
  }, [user, channel]);

  /* ================= DELETE VIDEO ================= */
  const handleDelete = (id) => {
    if (!isOwner) return;

    setSnackbar({
      message: "Delete this video?",
      type: "error",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await api.delete(`/videos/${id}`);
            setVideos((prev) => prev.filter((v) => v._id !== id));
            setSnackbar({ message: "Video deleted", type: "success" });
          } catch {
            setSnackbar({ message: "Delete failed", type: "error" });
          }
        },
      },
    });
  };

  /* ================= EDIT VIDEO ================= */
  const handleEdit = (video) => {
    if (!isOwner) return;
    setEditingVideo(video);
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(updatedData).filter(
          ([_, value]) => value !== undefined && value !== ""
        )
      );

      const res = await api.patch(`/videos/${id}`, cleanData);

      setVideos((prev) =>
        prev.map((v) => (v._id === id ? res.data.video : v))
      );

      setEditingVideo(null);
      setSnackbar({ message: "Video updated", type: "success" });
    } catch (err) {
      setSnackbar({
        message: err.response?.data?.message || "Update failed",
        type: "error",
      });
    }
  };

  /* ================= LOADING ================= */
  if (loading || !channel) return <Loader />;

  return (
    <div className="pt-14 max-w-7xl mx-auto">
      {/* ===== CHANNEL HEADER ===== */}
      <div className="flex flex-col sm:flex-row gap-6 px-6 py-6">
        <Avatar
          name={channel.name}
          src={channel.avatar}
          size={128}
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {channel.name}
          </h1>

          <p className="text-gray-600 mt-1">
            @{channel.name.toLowerCase().replace(/\s+/g, "")} •{" "}
            {videos.length} videos
          </p>

          <p className="mt-2 text-gray-700">
            {channel.description || "More about this channel..."}
          </p>

          {isOwner && (
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-gray-100 rounded-full">
                Customize channel
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-full">
                Manage videos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="border-b px-6">
        <div className="flex gap-6 overflow-x-auto" ref={tabsRef}>
          {["Home", "Videos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 ${
                activeTab === tab
                  ? "border-black font-semibold"
                  : "border-transparent text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ===== VIDEOS ===== */}
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <ChannelVideoCard
            key={video._id}
            video={video}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isOwner={isOwner}
          />
        ))}
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* ===== SNACKBAR ===== */}
     <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        action={snackbar.action}
        onClose={() =>
          setSnackbar({ message: "", type: "success"})
        }
      />
    </div>
  );
}

export default Channel;
