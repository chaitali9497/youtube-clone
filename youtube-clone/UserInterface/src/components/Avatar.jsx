import { useState } from "react";

/* ===== Helper: Generate avatar URL from name ===== */
export const getAvatarFromName = (name = "") => {
  if (!name) return "";
  const index =
    name
      .split("")
      .reduce((sum, c) => sum + c.charCodeAt(0), 0) % 8;

  return `https://i.pravatar.cc/150?img=${index + 1}`;
};

/* ===== Avatar Component ===== */
function Avatar({ name = "", src, size = 36 }) {
  const [imgError, setImgError] = useState(false);

  const letter = name.charAt(0).toUpperCase() || "U";

  const colors = [
    "bg-purple-600",
    "bg-blue-600",
    "bg-green-600",
    "bg-red-600",
    "bg-pink-600",
    "bg-yellow-600",
  ];

  const color = colors[letter.charCodeAt(0) % colors.length];

  // 🔁 Fallback to letter avatar
  if (!src || imgError) {
    return (
      <div
        className={`flex items-center justify-center rounded-full text-white font-semibold ${color}`}
        style={{
          width: size,
          height: size,
          fontSize: size / 2,
        }}
      >
        {letter}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImgError(true)}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export default Avatar;
