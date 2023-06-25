import React, { useEffect, useState } from 'react';

const GameTiles = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/images')
      .then((response) => response.json())
      .then((data) => setImages(data.images))
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  return (
    <div className="gametile">
      <div className="image-container">
        {images.map((image, index) => (
          <img key={index} src={`/resources${image}`} alt={`Game ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default GameTiles;