import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

// Component responsible for displaying the image and handling its load
const ImageDisplay = ({ img, onMouseDown }) => {
  // State to hold the loaded image
  const [image, setImage] = useState(null);

  // Load the image when the component mounts or 'img' changes
  useEffect(() => {
    // Create a new instance of the Image class provided by the browser
    const imageToLoad = new window.Image();

    // Set the source URL of the image to the 'img' prop
    imageToLoad.src = img;

    // Function to run when the image is successfully loaded
    const handleImageLoad = () => {
      setImage(imageToLoad);
    };

    // Listen for the 'load' event of the image and attach the handler
    imageToLoad.addEventListener("load", handleImageLoad);

    // Clean up the event listener when the component unmounts or 'img' changes
    return () => {
      imageToLoad.removeEventListener("load", handleImageLoad);
    };
  }, [img, setImage]);

  // Render the Image component from react-konva
  return <Image image={image} onMouseDown={onMouseDown} />;
};

export default ImageDisplay;
