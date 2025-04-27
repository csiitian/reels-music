import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const NewSong = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [songUrl, setSongUrl] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const { songId } = useParams();

  const resetForm = () => {
    setTitle("");
    setArtist("");
    setAlbum("");
    setAudioFile(null);
    setThumbnail(null);
  };

  useEffect(() => {
    if (songId) {
      // Fetch song details if editing
      const fetchSong = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/songs/${songId}`);
          const song = response.data;
          setTitle(song.title);
          setArtist(song.artist);
          setAlbum(song.album);
          setSongUrl(song.songUrl);
          setThumbnailUrl(song.thumbnailUrl);
        } catch (error) {
          console.error("Error fetching song:", error);
        }
      };

      fetchSong();
    }
  }, [songId]);

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleThumbnailChange = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!audioFile && !songUrl) {
      alert("Please select an audio file to upload.");
      return;
    }

    if (!thumbnail && !thumbnailUrl) {
      alert("Please select a thumbnail to upload.");
      return;
    }

    try {
      // Step 1: Upload the audio file and get its URL
      let uploadedSongUrl = songUrl;
      if (audioFile) {
        const fileData = new FormData();
        fileData.append("file", audioFile);

        const uploadResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/media/upload`, fileData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedSongUrl = uploadResponse.data; // Assuming the response contains the file URL
      }

      // Step 2: Upload the thumbnail and get its URL
      let uploadedThumbnailUrl = thumbnailUrl;
      if (thumbnail) {
        const thumbnailData = new FormData();
        thumbnailData.append("file", thumbnail);

        const thumbnailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/media/upload`, thumbnailData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedThumbnailUrl = thumbnailResponse.data; // Assuming the response contains the file URL
      }

      // Step 3: Send song metadata along with Song URL and Thumbnail URL
      const songData = {
        title,
        artist,
        album,
        songUrl: uploadedSongUrl,
        thumbnailUrl: uploadedThumbnailUrl,
      };

      const songResponse = songId
        ? await axios.put(`${process.env.REACT_APP_API_URL}/api/songs/${songId}`, songData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        : await axios.post(`${process.env.REACT_APP_API_URL}/api/songs`, songData, {
            headers: {
              "Content-Type": "application/json",
            },
          });

      console.log("Song uploaded successfully:", songResponse.data);

      resetForm(); // Reset form after submission
    } catch (error) {
      console.error("Error uploading the song:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        {songId ? "Edit Song" : "Upload a New Song"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Artist:</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Album:</label>
          <input
            type="text"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Audio File:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {songUrl && (
            <audio
              src={songUrl}
              controls
              className="w-full mt-4"
            />
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Thumbnail:</label>
          <input
            type="file"
            onChange={handleThumbnailChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              className="w-40 h-40 object-cover mt-4"
            />
          )}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
          >
            {songId ? "Update Song" : "Upload Song"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSong;
