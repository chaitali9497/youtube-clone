import { useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
} from "react-icons/fi";

function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setProgress((current / total) * 100);
  };

  const handleSeek = (e) => {
    const seekTime =
      (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const handleFullscreen = () => {
    videoRef.current.requestFullscreen();
  };

  return (
    <div className="relative w-full h-full bg-black group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Controls */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          bg-linear-to-t from-black/80 to-transparent
          p-3 opacity-0 group-hover:opacity-100
          transition-opacity
        "
      >
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 mb-3 cursor-pointer accent-red-600"
        />

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay}>
              {isPlaying ? <FiPause size={22} /> : <FiPlay size={22} />}
            </button>

            <button onClick={toggleMute}>
              {isMuted ? (
                <FiVolumeX size={22} />
              ) : (
                <FiVolume2 size={22} />
              )}
            </button>
          </div>

          <button onClick={handleFullscreen}>
            <FiMaximize size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
