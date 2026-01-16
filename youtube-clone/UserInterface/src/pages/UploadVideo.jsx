import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import Avatar from "../components/Avatar";

function UploadVideo() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const handleUpload = async () => {
  setError("");
  setSuccess("");

  const missingFields = [];

  if (!title.trim()) missingFields.push("Title");
  if (!thumbnail.trim()) missingFields.push("Thumbnail");
  if (!videoUrl.trim()) missingFields.push("Video URL");

  if (missingFields.length > 0) {
    setError(`Please add: ${missingFields.join(", ")}`);
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

    setSuccess("Video uploaded successfully ");

    setTimeout(() => {
      navigate(`/channel/${user.channel._id}`, { replace: true });
    }, 800);
  } catch (err) {
    setError(
      err.response?.data?.message || "Upload failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    navigate(`/channel/${user.channel._id}`);
  };

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} size={40} />

            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">
                Upload video
              </h1>
              <p className="text-sm text-gray-500">
                {user?.channel?.name || "Your channel"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleCancel}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium disabled:opacity-50 w-full sm:w-auto"
            >
              {loading ? "Uploading…" : "Publish"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Video URL (required)
              </label>
              <input
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://…mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
          </div>

         
          <div className="space-y-4">
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Thumbnail (required)
              </label>

              <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Thumbnail preview"
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
                  className="w-full max-h-64 sm:max-h-none rounded-lg border"
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
