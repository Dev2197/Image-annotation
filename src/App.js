import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Stage, Layer } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import ImageDisplay from "./components/ImageDisplay";
import Annotation from "./components/Annotation";
import "./App.css";
import Images from "./assets/images";

const initialAnnotations = [
  {
    id: uuidv4(),
    x: 100,
    y: 100,
    width: 100,
    height: 100,
  },
];

function App() {
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
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

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
      setAnnotations([...annotations, ...newAnnotation]);
      setNewAnnotation([]);
    }
  };

  const handleChangeAnnotation = (newShapeProps) => {
    const newAnnotations = annotations.map((annotation) => {
      if (annotation.id === newShapeProps.id) {
        return newShapeProps;
      }
      return annotation;
    });
    setAnnotations(newAnnotations);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      if (selectedId !== null) {
        const newAnnotations = annotations.filter(
          (annotation) => annotation.id !== selectedId
        );
        setAnnotations(newAnnotations);
      }
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageAnnotations.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageAnnotations.length - 1 : prevIndex - 1
    );
  };

  const annotationsDraw = [...annotations, ...newAnnotation];

  return (
    <div tabIndex={1} onKeyDown={handleKeyDown} className="canvas-container">
      <Stage
        width={500}
        height={500}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <ImageDisplay
            img={imageAnnotations[currentImageIndex].img}
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
      <div className="image-navigation">
        <button onClick={handlePreviousImage}>Previous</button>
        <button onClick={handleNextImage}>Next</button>
      </div>
      {/* <img src={images[currentImageIndex]} /> */}
    </div>
  );
}

export default App;
