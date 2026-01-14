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
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!title || !thumbnail || !videoUrl) {
      alert("Title, thumbnail and video URL are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/videos", {
        title,
        description,
        thumbnail,
        videoUrl,
      });

      navigate(`/channel/${user.channel._id}`, { replace: true });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Upload video</h1>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Uploading…" : "Publish"}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Details */}
          <div className="md:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Title (required)
              </label>
              <input
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a title that describes your video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                rows={6}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell viewers about your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Video URL
              </label>
              <input
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://…mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className="space-y-4">
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Thumbnail
              </label>

              <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                    Thumbnail preview
                  </div>
                )}
              </div>

              <input
                className="mt-2 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Thumbnail image URL"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />
            </div>

            {/* Video Preview */}
            {videoUrl && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Video preview
                </label>

                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadVideo;
