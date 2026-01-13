import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateChannel() {
  const navigate = useNavigate();

  const [channelName, setChannelName] = useState("");
  const [handle, setHandle] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = () => {
    if (!channelName || !handle) return;

    // 🔹 UI only (backend later)
    const user = JSON.parse(localStorage.getItem("user"));

    const updatedUser = {
      ...user,
      channel: {
        name: channelName,
        handle,
        avatar: preview,
      },
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    navigate("/channel");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl p-6 shadow-sm">
        {/* HEADER */}
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

        {/* CHANNEL NAME */}
        <div className="mb-4">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            placeholder="Your channel name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* HANDLE */}
        <div className="mb-6">
          <label className="text-sm font-medium">Handle</label>
          <input
            type="text"
            placeholder="@yourhandle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 mb-6">
          By clicking Create Channel, you agree to YouTube’s Terms of
          Service. Changes made to your name and profile picture are
          visible only on YouTube.
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm rounded-full hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={!channelName || !handle}
            className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white disabled:opacity-50"
          >
            Create channel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateChannel;
