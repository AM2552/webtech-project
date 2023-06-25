import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GameTiles = () => {
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

  return (
    <div className="gametiles">
      {images.map((image) => (
        <img
          key={image}
          src={`http://localhost:5000/images/${image}`}
          alt={image}
        />
      ))}
    </div>
  );
};

export default GameTiles;
