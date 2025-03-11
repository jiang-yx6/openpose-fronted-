import React from 'react';
import './FrameGallery.css';

const FrameGallery = ({ keyframes }) => {
  return (
    <div className="frame-gallery">
      {keyframes.map((frame, index) => (
        <img key={index} src={frame} alt={`Frame ${index + 1}`} className="frame-image" />
      ))}
    </div>
  );
};

export default FrameGallery; 