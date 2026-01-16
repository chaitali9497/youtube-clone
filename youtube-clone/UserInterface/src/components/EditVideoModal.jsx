import { useState } from "react";

function EditVideoModal({ video, onClose, onSave }) {
  const [title, setTitle] = useState(video.title || "");
  const [description, setDescription] = useState(video.description || "");
  const [loading, setLoading] = useState(false);

  const isChanged =
    title.trim() !== video.title ||
    description.trim() !== (video.description || "");

  const handleSave = async () => {
    if (!title.trim()) return;

    setLoading(true);

    // ✅ ONLY send fields backend supports
    const payload = {
      title: title.trim(),
      description: description.trim(),
    };

    await onSave(video._id, payload);

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit video details</h2>

        {/* TITLE */}
        <label className="text-sm font-medium">Title</label>
        <input
          className="w-full border p-2 rounded mb-3 mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
        />

        {/* DESCRIPTION */}
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full border p-2 rounded mt-1"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!isChanged || loading}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditVideoModal;
