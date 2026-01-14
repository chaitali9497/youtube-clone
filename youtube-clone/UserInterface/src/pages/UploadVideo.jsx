import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

function UploadVideo() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleUpload = async () => {
    try {
      await api.post("/videos", {
        title,
        description,
        thumbnail,
        videoUrl,
        channelId: user.channel._id,
      });

      navigate(`/channel/${user.channel._id}`);
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="pt-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

      <input
        placeholder="Title"
        className="w-full border p-2 mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Thumbnail URL"
        className="w-full border p-2 mb-3"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
      />

      <input
        placeholder="Video URL"
        className="w-full border p-2 mb-3"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="w-full border p-2 mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}

export default UploadVideo;
