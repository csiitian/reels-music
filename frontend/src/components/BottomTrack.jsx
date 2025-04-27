import React, { useState, useRef, useEffect } from 'react';
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';

const BottomTrack = ({ selectedTrack }) => {
  const { title, artist, songUrl, thumbnailUrl } = selectedTrack || {};
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    try {
      if (audio) {
        if (!audio.paused) audio.pause();
        audio.load();
        if (audio.readyState >= 2) audio.play();

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => setIsPlaying(false);

        // Set event listeners
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        setIsPlaying(true);

        // Clean up event listeners on component unmount or song change
        return () => {
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('ended', handleEnded);
        };
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  }, [selectedTrack]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      if (audio.readyState >= 2) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.load();
        audio.play();
        setIsPlaying(true);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeekChange = (e) => {
    const value = e.target.value;
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = (audio.duration * value) / 100;
    }
  };

  return (
    <div className="bottom-track flex items-center justify-between bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="track-info flex items-center space-x-4">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-16 h-16 rounded-md object-cover"
        />
        <div className="text-white">
          <h4 className="track-name text-lg font-semibold">{title}</h4>
          <h5 className="artist-name text-sm text-gray-400">by {artist}</h5>
        </div>
      </div>

      <div className="controls flex items-center space-x-4">
        <button
          onClick={togglePlayPause}
          className="play-pause-button p-2 rounded-full bg-gray-600 hover:bg-gray-500"
        >
          {isPlaying ? (
            <IconPlayerPause stroke={2} />
          ) : (
            <IconPlayerPlay stroke={2} />
          )}
        </button>

        <div className="audio-controls flex flex-col space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            defaultValue={0}
            value={audioRef.current ? (audioRef.current.currentTime / audioRef.current.duration) * 100 : 0}
            onChange={handleSeekChange}
            className="progress-bar w-48 h-1 bg-gray-500 rounded-md"
          />

          {songUrl ? (
            <audio ref={audioRef} controls className='hidden' loop autoPlay>
              <source src={songUrl} type="audio/mp3" />
            </audio>
          ) : (
            <p>Audio file not available</p>
          )}
        </div>
      </div>

      <div className="flex">
        
      </div>
    </div>
  );
};

export default BottomTrack;
