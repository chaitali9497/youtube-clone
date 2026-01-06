import { useRef, useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";

function VideoPlayer({ src }) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // play / pause
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // update progress
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  // seek
  const handleSeek = (e) => {
    const time = Number(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // volume
  const handleVolume = (e) => {
    const vol = Number(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  // mute
  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // fullscreen
  const handleFullscreen = () => {
    videoRef.current.requestFullscreen();
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() =>
          setDuration(videoRef.current.duration)
        }
      />

      {/* CONTROLS */}
      <div className="bg-black/80 text-white px-4 py-2 space-y-2">

        {/* Progress */}
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full"
        />

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">

            <button onClick={togglePlay}>
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>

            <button onClick={toggleMute}>
              {isMuted ? (
                <SpeakerXMarkIcon className="w-6 h-6" />
              ) : (
                <SpeakerWaveIcon className="w-6 h-6" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
            />
          </div>

          <button onClick={handleFullscreen}>
            <ArrowsPointingOutIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
