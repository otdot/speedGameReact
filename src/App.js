import "./App.css";
import React, { Component } from "react";
import { Circle } from "./components/Circle";
import { Button } from "./components/Button";
import { Modal } from "./components/Modal";
import { NameInput } from "./components/NameInput";
import { TopList } from "./components/TopList";
import StartMusic from "./assets/sounds/Bongos.mp3";
import StopMusic from "./assets/sounds/Failure.mp3";

let randnum;
let prevnum = -1;
let skippedrounds = 0;

let startMusic = new Audio(StartMusic);
let stopMusic = new Audio(StopMusic);

const createIndex = (minNum, maxNum) => {
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
};

const randomColor = () => {
  const red = Math.floor(Math.random() * 225 + 30);
  const green = Math.floor(Math.random() * 225 + 30);
  const blue = Math.floor(Math.random() * 225 + 30);
  return `rgb(${red},${green},${blue})`;
};

class App extends Component {
  state = {
    maxRandomNumber: 0,
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
        this.setState({ difficulty: 4, maxRandomNumber: 3 });
        this.createCircles(4);
        break;
      case "medium":
        this.setState({ difficulty: 5, maxRandomNumber: 4 });
        this.createCircles(5);
        break;
      case "hard":
        this.setState({ difficulty: 6, maxRandomNumber: 5 });
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
    startMusic.play();
    startMusic.loop = true;
    if (this.state.intervalId) {
      this.stopGame();
      return this.setState({ intervalId: 0 });
    }
    this.handleRound();
    return this.setState({ gameOn: !this.state.gameOn });
  };

  handleRound = () => {
    randnum = createIndex(0, this.state.maxRandomNumber);
    while (randnum === prevnum) {
      randnum = createIndex(0, this.state.maxRandomNumber);
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
    this.setState({ circles: newCircles, pace: this.state.pace * 0.96 });
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
    startMusic.pause();
    stopMusic.play();
    clearInterval(this.state.intervalId);

    localStorage.setItem(
      [this.state.name, this.state.difficulty],
      this.state.score
    );
    this.setState({
      gameOn: !this.state.gameOn,
      showModal: !this.state.showModal,
      circle: this.createCircles(this.state.difficulty),
      pace: 2000,
    });
    skippedrounds = 0;
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
    stopMusic.pause();
    this.setState({
      gameOn: false,
      showModal: false,
      intervalId: 0,
      score: 0,
      pace: 2000,
    });
  };

  changeDifficulty = () => {
    this.setState({
      difficulty: false,
      gameOn: false,
      showModal: false,
      intervalId: 0,
      score: 0,
      pace: 2000,
    });
  };

  conditionalText = (score) => {
    if (score > 50) {
      return "Champion level score! You got: ";
    } else if (score > 30) {
      return "Very good! You got: ";
    } else if (score > 15) {
      return "Good job! You got: ";
    } else if (score > 10) {
      return "Pretty good! You got: ";
    } else {
      return "Better luck next time! You got: ";
    }
  };

  render() {
    return (
      <div className="container">
        <h1>Speed game</h1>

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
            text={this.conditionalText(this.state.score)}
            score={this.state.score}
            click={this.reload}
          />
        )}
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
              click={this.state.gameOn ? console.log : this.changeDifficulty}
              text="change difficulty"
            />
          </div>,
        ]}
        <div className="topListContainer">
          <TopList diffnum="4" key="4" propClass="topList" difficulty="Easy" />
          <TopList
            diffnum="5"
            key="5"
            propClass="topList"
            difficulty="Medium"
          />
          <TopList diffnum="6" key="6" propClass="topList" difficulty="Hard" />
        </div>
      </div>
    );
  }
}

export default App;
