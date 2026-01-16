import { FiX, FiLink } from "react-icons/fi";
import { FaWhatsapp, FaTwitter, FaEnvelope } from "react-icons/fa";

function ShareModal({ open, onClose, url, title = "Check this video" }) {
  if (!open) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-sm p-5 relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Share</h2>

        <div className="grid grid-cols-4 gap-4 text-center">
          {/* WHATSAPP */}
          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 hover:opacity-80"
          >
            <div className="bg-green-500 text-white p-3 rounded-full">
              <FaWhatsapp size={20} />
            </div>
            <span className="text-xs">WhatsApp</span>
          </a>

          {/* TWITTER */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 hover:opacity-80"
          >
            <div className="bg-sky-500 text-white p-3 rounded-full">
              <FaTwitter size={20} />
            </div>
            <span className="text-xs">Twitter</span>
          </a>

          {/* EMAIL */}
          <a
            href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
            className="flex flex-col items-center gap-1 hover:opacity-80"
          >
            <div className="bg-gray-600 text-white p-3 rounded-full">
              <FaEnvelope size={20} />
            </div>
            <span className="text-xs">Email</span>
          </a>

          {/* COPY LINK */}
          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-1 hover:opacity-80"
          >
            <div className="bg-gray-200 text-gray-800 p-3 rounded-full">
              <FiLink size={20} />
            </div>
            <span className="text-xs">Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
