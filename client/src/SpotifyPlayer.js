import React, { useState } from 'react';
import axios from 'axios';

const SpotifyPlayer = () => {
  const [keyword, setKeyword] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistId, setPlaylistId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:5000/api/spotify/playlists', {
        params: { keyword },
      });
      setPlaylists(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlaylistSelection = async (playlist) => {
    try {
      setSelectedPlaylist(playlist);
      const response = await axios.get(`http://localhost:5000/api/spotify/playlist/${playlist.id}`);
      setPlaylistId(response.data.playlistId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="music">
      <iframe
        title="Embedded Spotify Player"
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for a playlist..."
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            {playlist.name}
            <button onClick={() => handlePlaylistSelection(playlist)}>Select</button>
          </li>
        ))}
      </ul>
      {selectedPlaylist && <p>Selected Playlist: {selectedPlaylist.name}</p>}
    </div>
  );
};

export default SpotifyPlayer;


