import React from "react";
import classes from "./Modal.module.css";
import { Button } from "./Button";

export const Modal = (props) => {
  return (
    <div className={classes.Modal}>
      <p>{props.text}</p>
      <p>{props.score}</p>
      <Button click={props.click} text="Play again!" />
    </div>
  );
};
