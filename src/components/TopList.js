import React from "react";

const updateTopScores = (difficulty) => {
  let localStorageKeys = Object.keys(localStorage);
  let scoreArr = [];
  for (let i = 0; i < localStorageKeys.length; i++) {
    if (localStorageKeys[i].includes(difficulty)) {
      let tempScore = localStorage.getItem(localStorageKeys[i]);
      let tempName = localStorageKeys[i].replace(`,${difficulty}`, "");
      scoreArr.push([tempName, tempScore]);
    }
  }
  return scoreArr.sort((a, b) => b[1] - a[1]).slice(0, 3);
};

export const TopList = (props) => {
  return (
    <div className={props.propClass}>
      <h2>Top players: {props.difficulty}</h2>
      {updateTopScores(props.diffnum).map((player) => (
        <div key={player[0]}>
          <p>{player[0]}</p>
          <b>Points: {player[1]}</b>
        </div>
      ))}
    </div>
  );
};
