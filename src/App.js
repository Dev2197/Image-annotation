import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Stage, Layer } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import ImageDisplay from "./components/ImageDisplay";
import Annotation from "./components/Annotation";
import "./App.css";
import Images from "./assets/images";

function App() {
  const initialAnnotations = [
    {
      id: uuidv4(),
      x: 100,
      y: 100,
      width: 100,
      height: 100,
    },
  ];

  const [imageAnnotations, setImageAnnotations] = useState([
    {
      id: "IMAGE_1",
      img: Images.Image1,
      annotations: initialAnnotations,
    },
    { id: "IMAGE_2", img: Images.Image2, annotations: [] },
    { id: "IMAGE_3", img: Images.Image3, annotations: [] },
    { id: "IMAGE_4", img: Images.Image4, annotations: [] },
    { id: "IMAGE_5", img: Images.Image5, annotations: [] },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [unsavedAnnotations, setUnsavedAnnotations] = useState([]);

  const handleMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  const handleMouseDown = (event) => {
    if (!selectedId && newAnnotation.length === 0) {
      const stage = event.target.getStage();
      const { x, y } = stage.getPointerPosition();
      setNewAnnotation([{ id: uuidv4(), x, y, width: 0, height: 0 }]);
    }
  };

  const handleMouseMove = (event) => {
    if (!selectedId && newAnnotation.length > 0) {
      const stage = event.target.getStage();
      const pointerPos = stage.getPointerPosition();
      const newWidth = pointerPos.x - newAnnotation[0].x;
      const newHeight = pointerPos.y - newAnnotation[0].y;

      setNewAnnotation([
        {
          ...newAnnotation[0],
          width: newWidth,
          height: newHeight,
        },
      ]);
    }
  };

  const handleMouseUp = () => {
    if (!selectedId && newAnnotation.length > 0) {
      // const updatedImageAnnotations = [...imageAnnotations];
      // updatedImageAnnotations[currentImageIndex].annotations.push(
      //   ...newAnnotation
      // );

      // setImageAnnotations(updatedImageAnnotations);
      // setNewAnnotation([]);
      setUnsavedAnnotations([...unsavedAnnotations, ...newAnnotation]);
      setNewAnnotation([]);
    }
  };

  const handleChangeAnnotation = (newShapeProps) => {
    const updatedAnnotations = [...imageAnnotations];
    const currentImageAnnotations =
      updatedAnnotations[currentImageIndex].annotations;

    const newAnnotations = currentImageAnnotations.map((annotation) => {
      if (annotation.id === newShapeProps.id) {
        return newShapeProps;
      }
      return annotation;
    });

    updatedAnnotations[currentImageIndex].annotations = newAnnotations;
    setImageAnnotations(updatedAnnotations);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      if (selectedId !== null) {
        const updatedAnnotations = [...imageAnnotations];
        const currentImageAnnotations =
          updatedAnnotations[currentImageIndex].annotations;

        const newAnnotations = currentImageAnnotations.filter(
          (annotation) => annotation.id !== selectedId
        );
        if (newAnnotations.length === currentImageAnnotations.length) {
          const newUnsavedAnnotations = unsavedAnnotations.filter(
            (annotation) => annotation.id !== selectedId
          );
          setUnsavedAnnotations(newUnsavedAnnotations);
          return;
        }

        updatedAnnotations[currentImageIndex].annotations = newAnnotations;
        setImageAnnotations(updatedAnnotations);
      }
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageAnnotations.length - 1 ? 0 : prevIndex + 1
    );
    setUnsavedAnnotations([]);
    setSelectedId(null); // Reset selected annotation when switching images
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageAnnotations.length - 1 : prevIndex - 1
    );
    setUnsavedAnnotations([]);
    setSelectedId(null); // Reset selected annotation when switching images
  };

  const handleSave = () => {
    const updatedImageAnnotations = [...imageAnnotations];
    updatedImageAnnotations[currentImageIndex].annotations.push(
      ...unsavedAnnotations
    );
    console.log(updatedImageAnnotations);
    if (updatedImageAnnotations[currentImageIndex].annotations.length === 0) {
      alert("Please draw annotations before saving.");
    } else {
      setImageAnnotations(updatedImageAnnotations);
      setUnsavedAnnotations([]);
      alert(
        `${updatedImageAnnotations[currentImageIndex].annotations.length} ${
          updatedImageAnnotations[currentImageIndex].annotations.length !== 1
            ? "annotations"
            : "annotation"
        } saved for ${currentImage.id}`
      );
    }
  };

  const handleSubmit = () => {
    const numUnsavedAnnotations = unsavedAnnotations.length;
    if (numUnsavedAnnotations > 0) {
      alert("Please save before submitting.");
      return;
    }

    const currentImage = imageAnnotations[currentImageIndex];
    const formattedAnnotations = currentImage.annotations.map((annotation) => ({
      x1: annotation.x,
      y1: annotation.y,
      x2: annotation.x + annotation.width,
      y2: annotation.y + annotation.height,
    }));

    const annotationsData = {
      [currentImage.id]: formattedAnnotations,
    };

    const formattedJson = JSON.stringify(annotationsData, null, 2); // Indent with 2 spaces

    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(formattedJson);
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `${currentImage.id}_annotations.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    alert(`Annotations for ${currentImage.id} downloaded!`);

  };

  const currentImage = imageAnnotations[currentImageIndex];

  const annotationsDraw = [
    ...imageAnnotations[currentImageIndex].annotations,
    ...newAnnotation,
    ...unsavedAnnotations,
  ];

  return (
    <div tabIndex={1} onKeyDown={handleKeyDown} className="canvas-container">
      <div className="header">
        <h2>Image Annotation Studio</h2>
        <div className="header-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <Stage
        width={800}
        height={500}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <ImageDisplay
            img={currentImage.img}
            onMouseDown={() => {
              setSelectedId(null);
            }}
          />
          {annotationsDraw.map((annotation, i) => {
            return (
              <Annotation
                key={i}
                shapeProps={annotation}
                isSelected={annotation.id === selectedId}
                onSelect={() => {
                  setSelectedId(annotation.id);
                }}
                onChange={handleChangeAnnotation}
              />
            );
          })}
        </Layer>
      </Stage>
      <div className="navigation-buttons">
        <button onClick={handlePreviousImage} className="prev-btn">
          Previous
        </button>
        <div className="image-counter">
          {currentImageIndex + 1} / {imageAnnotations.length}
        </div>
        <button onClick={handleNextImage} className="next-btn">
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
