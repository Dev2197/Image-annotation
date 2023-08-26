import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

const ImageDisplay = ({ img, onMouseDown }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const imageToLoad = new window.Image();
    imageToLoad.src = img;

    const handleImageLoad = () => {
      setImage(imageToLoad);
    };

    imageToLoad.addEventListener("load", handleImageLoad);

    return () => {
      imageToLoad.removeEventListener("load", handleImageLoad);
    };
  }, [img, setImage]);

  return <Image image={image} onMouseDown={onMouseDown} />;
};

export default ImageDisplay;
