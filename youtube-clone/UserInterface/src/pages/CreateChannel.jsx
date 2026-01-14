import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

function CreateChannel() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ redirect if channel already exists
  useEffect(() => {
    const redirectIfChannelExists = async () => {
      try {
        const res = await api.get("/channels/me");

        if (res.data?._id) {
          navigate(`/channel/${res.data._id}`, { replace: true });
        }
      } catch {
        // no channel → stay on create page
      }
    };

    redirectIfChannelExists();
  }, [navigate]);

  // ✅ avatar handler (was missing)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  // ✅ create channel
  const handleCreate = async () => {
    if (!name || loading) return;

    setLoading(true);
    try {
      const res = await api.post("/channels", {
        name,
        description,
        avatar: preview
      });

      const user = JSON.parse(localStorage.getItem("user"));

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          channel: res.data
        })
      );

      navigate(`/channel/${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Channel creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-1">How you’ll appear</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your channel profile appears across YouTube.
        </p>

        {/* AVATAR */}
        <div className="flex flex-col items-center mb-6">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl">
                👤
              </div>
            )}
          </label>

          <span className="text-sm text-blue-600 mt-2">
            Select picture
          </span>
        </div>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm font-medium">Channel name</label>
          <input
            type="text"
            placeholder="Your channel name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <label className="text-sm font-medium">Description</label>
          <textarea
            placeholder="Tell viewers about your channel"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="text-xs text-gray-500 mb-6">
          By clicking Create Channel, you agree to YouTube’s Terms of Service.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm rounded-full hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={!name || loading}
            className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create channel"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateChannel;
