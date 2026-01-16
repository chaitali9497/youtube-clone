import { useEffect } from "react";
import { FiX } from "react-icons/fi";

function Snackbar({
  message,
  type = "success",
  action,
  duration = 3000,
  onClose,
}) {
  if (!message) return null;

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message]);

  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500 text-black",
    info: "bg-gray-900",
  };

  return (
    <div
      className="
        fixed z-50
        bottom-4 sm:bottom-6
        left-4 right-4
        sm:left-1/2 sm:right-auto sm:-translate-x-1/2
      "
    >
      <div
        className={`
          flex items-center justify-between gap-3
          px-4 py-3
          rounded-xl sm:rounded-full
          shadow-xl
          text-sm font-medium
          animate-snackbar
          ${styles[type]}
        `}
      >
        {/* MESSAGE */}
        <span className="flex-1 truncate sm:whitespace-normal">
          {message}
        </span>

        {/* ACTION */}
        {action && (
          <button
            onClick={action.onClick}
            className="font-semibold underline whitespace-nowrap"
          >
            {action.label}
          </button>
        )}

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-black/20 transition"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
}

export default Snackbar;
