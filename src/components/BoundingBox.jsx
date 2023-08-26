import React from "react";
import { Rect, Transformer } from "react-konva";

function BoundingBox({ boxData, isSelected, onSelect, onChange }) {
  return (
    <React.Fragment>
      <Rect
        x={boxData.x1}
        y={boxData.y1}
        width={boxData.x2 - boxData.x1}
        height={boxData.y2 - boxData.y1}
        stroke="red"
        strokeWidth={2}
        draggable
        onClick={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...boxData,
            x1: e.target.x(),
            y1: e.target.y(),
            x2: e.target.x() + e.target.width(),
            y2: e.target.y() + e.target.height(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          anchorStroke="red"
          borderStroke="red"
          ref={(node) => {
            if (node) {
              node.moveToTop();
            }
          }}
        />
      )}
    </React.Fragment>
  );
}

export default BoundingBox;