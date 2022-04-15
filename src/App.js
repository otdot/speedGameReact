import "./App.css";
import React, { Component } from "react";
import { Circle } from "./components/Circle";
import { Button } from "./components/Button";
import { Modal } from "./components/Modal";
import { NameInput } from "./components/NameInput";
import { TopList } from "./components/TopList";

let randnum;
let prevnum = -1;
let skippedrounds = 0;
let easyScores = localStorage.getItem("easy")
  ? JSON.parse(localStorage.getItem("easy"))
  : [];
let mediumScores = [];
let hardScores = [];

const createIndex = () => {
  const minNum = Math.ceil(0);
  const maxNum = Math.floor(3);
  return Math.floor(Math.random() * (maxNum - minNum + minNum) + minNum);
};

const randomColor = () => {
  const red = Math.floor(Math.random() * 225 + 30);
  const green = Math.floor(Math.random() * 225 + 30);
  const blue = Math.floor(Math.random() * 225 + 30);
  return `rgb(${red},${green},${blue})`;
};

class App extends Component {
  state = {
    name: false,
    difficulty: false,
    gameOn: false,
    showModal: false,
    score: 0,
    intervalId: 0,
    pace: 2000,
    circles: [],
  };

  handleName = (e) => {
    e.preventDefault();
    console.log("name handled");
    this.setState({ name: e.target.children[1].value });
  };

  handleCircles = (e) => {
    switch (e.target.textContent) {
      case "easy":
        this.setState({ difficulty: 4 });
        this.createCircles(4);
        break;
      case "medium":
        this.setState({ difficulty: 5 });
        this.createCircles(5);
        break;
      case "hard":
        this.setState({ difficulty: 6 });
        this.createCircles(6);
        break;
    }
  };

  createCircles = (circleamount) => {
    const circles = [];
    for (let i = 0; i < circleamount; i++) {
      circles.push(<Circle key={i} index={i} />);
    }
    return this.setState({ circles: circles });
  };

  handleStart = () => {
    if (this.state.intervalId) {
      this.stopGame();
      return this.setState({ intervalId: 0 });
    }
    this.handleRound();
    return this.setState({ gameOn: !this.state.gameOn });
  };

  handleRound = () => {
    randnum = createIndex();
    while (randnum === prevnum) {
      randnum = createIndex();
    }

    const newCircles = this.state.circles.map((_, i) => {
      if (i === randnum) {
        return (
          <Circle
            key={i}
            index={i}
            click={this.circleClick}
            style={randomColor()}
          />
        );
      } else {
        return <Circle key={i} index={i} click={this.circleClick} />;
      }
    });
    this.setState({ circles: newCircles, pace: this.state.pace - 50 });
    prevnum = randnum;
    this.timeOut();
  };

  circleClick = (e) => {
    if (e.target.dataset.index == randnum) {
      clearTimeout(this.state.intervalId);
      this.handleRound();
      this.setState({ score: this.state.score + 1 });
    } else {
      return this.stopGame();
    }
  };

  stopGame = () => {
    clearInterval(this.state.intervalId);

    // if (this.state.difficulty === 4) {
    //   localStorage.setItem("easy", [this.createTopScores(easyScores)]);
    // } else if (this.state.difficulty === 5) {
    //   localStorage.setItem("medium", this.createTopScores(mediumScores));
    // } else if (this.state.difficulty === 6) {
    //   localStorage.setItem("hard", this.createTopScores(hardScores));
    // }

    console.log(easyScores);
    this.setState({
      gameOn: !this.state.gameOn,
      showModal: !this.state.showModal,
      circle: this.createCircles(this.state.difficulty),
    });
  };

  timeOut = () => {
    const newIntervalId = setTimeout(() => {
      skippedrounds++;
      if (skippedrounds > 3) {
        this.stopGame();
      } else {
        this.handleRound();
      }
    }, this.state.pace);

    this.setState({ intervalId: newIntervalId });
  };

  reload = () => {
    this.setState({
      gameOn: false,
      showModal: false,
      intervalId: 0,
      score: 0,
    });
  };

  //Listaan päivittyy vain viimeisin pelaaja ja tulos

  // createTopScores = (arr) => {
  //   if ([...arr].some((score) => score.includes(this.state.name))) {
  //     arr = [...arr].map((score) => {
  //       if (score[1] < this.state.score && score[0] === this.state.name) {
  //         console.log("old player updated");
  //         return (score = [this.state.name, this.state.score]);
  //       } else {
  //         console.log("other player returned with one being old");
  //         return score;
  //       }
  //     });
  //   } else {
  //     console.log("new player added");
  //     arr = [...arr].push([this.state.name, this.state.score]);
  //     return arr;
  //   }
  //   return [arr];
  // };

  updateTopScores = () => {
    let localStorageKeys = Object.keys(localStorage);
    let localStorageValues = Object.values(localStorage);
    let myLocalStorage = [];
    for (let i = 0; i < localStorageKeys.length; i++) {
      myLocalStorage.push([localStorageKeys[i], localStorageValues[i]]);
    }
    return myLocalStorage.sort((a, b) => b[1] - a[1]);
  };

  render() {
    console.log(easyScores);
    return (
      <div className="container">
        <h1>Speed game</h1>
        {/* <TopList propClass="topList">
          {this.updateTopScores().map((player) => (
            <div key={player[0]}>
              <p className="pname">{player[0]}</p>
              <b className="ppoints">Points: {player[1]}</b>
            </div>
          ))}
        </TopList> */}

        {!this.state.name && <NameInput submit={this.handleName} />}
        <h2>Points: {this.state.score}</h2>
        <div className="difficultyButtons">
          {!this.state.difficulty &&
            this.state.name && [
              <h1 className="difficultyh1">Select difficulty</h1>,
              <Button
                key={"easy"}
                click={this.handleCircles}
                style="#6ddb69"
                text="easy"
              />,
              <Button
                key={"medium"}
                click={this.handleCircles}
                style="#7072ba"
                text="medium"
              />,
              <Button
                key={"hard"}
                click={this.handleCircles}
                style="#780606"
                text="hard"
              />,
            ]}
        </div>
        {this.state.showModal && (
          <Modal
            text="Game over"
            score={this.state.score}
            click={this.reload}
          />
        )}
        <div>
          {this.state.difficulty && [
            <div key="circles" className="circleContainer">
              {this.state.circles}
            </div>,
            <div key="buttons" className="buttonContainer">
              <Button
                key="start"
                click={this.handleStart}
                text={this.state.gameOn ? "stop game" : "start game"}
              />
              <Button
                key="change"
                click={this.reload}
                text="change difficulty"
              />
            </div>,
          ]}
        </div>
      </div>
    );
  }
}

export default App;
