import { useRef, useState, useEffect } from "react";
import {FiPlay,FiPause,FiVolume2,FiVolumeX,FiMaximize,} from "react-icons/fi";

function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);


  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  /* ================= CONTROL HANDLERS ================= */
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  
  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };


  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  /* ================= VIDEO EVENT HANDLERS ================= */
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

 
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  
  const handleSeek = (e) => {
    if (!duration) return;
    const seekTime = Number(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  
/* ================= PLAY/PAUSE LISTENERS ================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);
  /* ================= AUTOPLAY ON VIDEO CHANGE ================= */
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

 
  video.muted = true;
  setIsMuted(true);

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => setIsPlaying(true))
      .catch(() => {
        
      });
  }
}, [src]); 


  return (
    <div className="relative w-full h-full bg-black group select-none">
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onClick={togglePlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        playsInline
      />

      {/* CONTROLS */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          bg-linear-to-t from-black/90 to-transparent
          px-4 pb-3 pt-10
          opacity-0 group-hover:opacity-100
          transition-opacity
        "
      >
        {/* PROGRESS BAR */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 cursor-pointer accent-red-600"
        />

        {/* CONTROLS ROW */}
        <div className="flex items-center justify-between text-white mt-2 text-sm">
         
          <div className="flex items-center gap-4">
            <button onClick={togglePlay}>
              {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
            </button>

            <button onClick={toggleMute}>
              {isMuted ? (
                <FiVolumeX size={20} />
              ) : (
                <FiVolume2 size={20} />
              )}
            </button>

            {/* TIME */}
            <span className="text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

         
          <button onClick={handleFullscreen}>
            <FiMaximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
