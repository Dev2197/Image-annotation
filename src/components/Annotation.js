import React from "react";
import { Rect, Transformer } from "react-konva";

const Annotation = ({ shapeProps, isSelected, onSelect, onChange }) => {
  // Ref to hold the reference to the shape
  const shapeRef = React.useRef();

  // Ref to hold the reference to the transformer for resizing and dragging
  const transformRef = React.useRef();

  // Handler for when the shape's drag ends
  const handleDragEnd = (e) => {
    const box = e.target;
    const x = box.position().x;
    const y = box.position().y;
    onChange({ ...shapeProps, x, y });
  };

  // Handler for when the shape is being dragged
  const handleDragMove = () => {
    const node = shapeRef.current;
    if (node) {
      const x = node.x();
      const y = node.y();
      onChange({ ...shapeProps, x, y });
    }
  };

  // Handler for when the transformer's resize or rotate ends
  const handleTransformEnd = () => {
    const node = shapeRef.current;

    if (node) {
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);

      // Update the shapeProps with the new dimensions and position
      const newShapeProps = {
        ...shapeProps,
        width: node.width() * scaleX,
        height: node.height() * scaleY,
        x: node.x(),
        y: node.y(),
      };
      // Call the onChange prop to notify the parent component of the change
      onChange(newShapeProps);
    }
  };

  // Handler for when the mouse enters the shape
  const onMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "move";
  };

  // Handler for when the mouse leaves the shape
  const onMouseLeave = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  // Effect to update the transformer's node and re-render when isSelected changes
  React.useEffect(() => {
    if (isSelected) {
      transformRef.current.setNode(shapeRef.current);
      transformRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        {...shapeProps}
        fill="transparent"
        stroke="#eb4d4b"
        strokeWidth={3}
        onMouseDown={onSelect}
        draggable
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={shapeRef}
      />

      {/* Transformer for resizing and dragging */}
      {isSelected && <Transformer ref={transformRef} rotateEnabled={false} />}
    </React.Fragment>
  );
};

export default Annotation;
