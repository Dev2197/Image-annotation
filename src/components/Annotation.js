import React from "react";
import { Rect, Transformer } from "react-konva";

const Annotation = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const transformRef = React.useRef();

  const handleDragEnd = (e) => {
    const box = e.target;
    const x = box.x();
    const y = box.y();
      onChange({ x, y, width: shapeProps.width, height: shapeProps.height });
    
  };

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
      //   console.log(newShapeProps);
      // Call the onChange prop to notify the parent component of the change
      onChange(newShapeProps);
    }
  };

  const onMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "move";
  };

  const onMouseLeave = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

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
        stroke="blue"
        strokeWidth={2}
        onMouseDown={onSelect}
        draggable
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={shapeRef}
      />

      {isSelected && <Transformer ref={transformRef} rotateEnabled={false} />}
    </React.Fragment>
  );
};

export default Annotation;
