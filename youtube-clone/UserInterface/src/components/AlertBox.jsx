import { XMarkIcon } from "@heroicons/react/24/outline";

function AlertBox({ type = "error", message, onClose }) {
  if (!message) return null;

  const styles = {
    error: "bg-red-50 border-red-400 text-red-700",
    success: "bg-green-50 border-green-400 text-green-700",
    info: "bg-blue-50 border-blue-400 text-blue-700",
  };

  return (
    <div
      className={`flex items-start justify-between gap-4 border rounded-lg px-4 py-3 mb-4 ${styles[type]}`}
    >
      <p className="text-sm">{message}</p>

      {onClose && (
        <button onClick={onClose}>
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default AlertBox;
