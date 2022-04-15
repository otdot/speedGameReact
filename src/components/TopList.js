import React from "react";

export const TopList = (props) => {
  return (
    <div className={props.propClass}>
      <h2>Top players: {props.difficulty}</h2>
      {props.children}
    </div>
  );
};
