import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';

const SongView = () => {
  const { handleTrackChange } = useOutletContext();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = process.env.REACT_APP_ADMIN === "true";
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/songs`);
        const data = await response.json();
        setSongs(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleDeleteSong = async (songId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/songs/${songId}`, {
        method: 'DELETE',
      });
      setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-black mb-6">Trending Songs</h1>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <ul className="space-y-4 p-2">
          {songs.map((song) => (
            <li
              key={song.id}
              onClick={() => handleTrackChange(song)}
              className="flex items-center justify-between rounded-lg cursor-pointer border p-4 hover:bg-gray-100 transition duration-200"
            >
              <div className="flex items-center space-x-4">
                {/* Optionally, you can add an image or thumbnail */}
                <img src={song.thumbnailUrl} alt={song.title} className="w-16 h-16 rounded-md object-cover" />
                <div className="text-black">
                  <p className="text-lg font-medium">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                { isAdmin && (
                  <>
                    <Link
                      to={`/song/${song.id}/edit`}
                      className="text-indigo-400 hover:text-indigo-600 transition duration-300"
                    >
                      <IconEdit />
                    </Link>
                    <button
                      className="text-red-400 hover:text-red-600 transition duration-300"
                      onClick={() => {
                        handleDeleteSong(song.id);
                      }}
                    >
                      <IconTrash />
                    </button>
                  </>
                ) }
                
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongView;
