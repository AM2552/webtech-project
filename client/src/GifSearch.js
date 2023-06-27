import React, { useState } from 'react';
import axios from 'axios';

const GifSearch = ({ onReceiveGif }) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/giphy', { keyword: searchKeyword });
      const { gif } = response.data;

      onReceiveGif(gif);
    } catch (error) {
      console.error('Error:', error);
    }

    setSearchKeyword('');
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Enter a keyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button type="submit">Random Giphy</button>
      </form>
    </div>
  );
};

export default GifSearch;
