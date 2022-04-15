import React from "react";
import classes from "./Button.module.css";

export const Button = (props) => {
  return (
    <button
      onClick={props.click}
      className={classes.Button}
      style={{ backgroundColor: props.style }}
    >
      {props.text}
    </button>
  );
};
