import React from "react";
import {
  FaRegSquare,
  FaTrash,
} from "react-icons/fa";

const Toolbar = ({ onRectangle, onDelete }) => {
  return (
    <div className="toolbar">
      <div className="icon" onClick={onRectangle}>
        <FaRegSquare />
      </div>
      <div className="icon" onClick={onDelete}>
        <FaTrash />
      </div>
    </div>
  );
};

export default Toolbar;
