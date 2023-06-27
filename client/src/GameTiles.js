import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GameTiles = ({ onGameToggle }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/public/images');
        setImages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = () => {
    onGameToggle();
  };

  return (
    <div className="gametiles">
      {images.map((image) => (
        <img
          key={image}
          src={`http://localhost:5000/images/${image}`}
          alt={image}
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        />
      ))}
    </div>
  );
};

export default GameTiles;
