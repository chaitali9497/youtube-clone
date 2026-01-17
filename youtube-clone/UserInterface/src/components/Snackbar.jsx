function Snackbar({ message, type = "success", action, onClose }) {
  if (!message) return null;

  const isConfirm = Boolean(action);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-4 px-5 py-3 rounded-lg shadow-lg text-white
          ${type === "error" ? "bg-red-600" : "bg-green-600"}`}
      >
        <span className="text-sm">{message}</span>

        {/* BUTTONS ONLY FOR CONFIRM */}
        {isConfirm && (
          <div className="flex gap-2">
            {/* OK */}
            <button
              onClick={action.onClick}
              className="px-3 py-1 bg-white text-red-600 rounded text-sm font-semibold"
            >
              OK
            </button>

            {/* CANCEL */}
            <button
              onClick={onClose}
              className="px-3 py-1 border border-white rounded text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Snackbar;
