import React from "react";
import "./Circle.css";

export const Circle = (props) => {
  return (
    <div
      data-index={props.index}
      onClick={props.click}
      className="Circle"
      style={{ backgroundColor: props.style }}
    >
      {props.text}
    </div>
  );
};
