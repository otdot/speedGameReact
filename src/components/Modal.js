import React from "react";
import classes from "./Modal.module.css";
import { Button } from "./Button";

export const Modal = (props) => {
  return (
    <div className={classes.Modal}>
      <h2>Game Over!</h2>
      <p className={classes.text}>
        {props.text}
        {props.score} points
      </p>
      <Button click={props.click} text="Play again!" />
    </div>
  );
};
