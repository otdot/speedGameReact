import React from "react";
import classes from "./NameInput.module.css";
export const NameInput = (props) => {
  return (
    <div className={classes.NameInput}>
      <form onSubmit={props.submit}>
        <label htmlFor="name">Your track name:</label>
        <input id="name" type="text"></input>
      </form>
    </div>
  );
};
