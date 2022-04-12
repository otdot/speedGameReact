import "./App.css";
import React, { Component } from "react";
import { Circle } from "./components/Circle";
import { Button } from "./components/Button";
import { Modal } from "./components/Modal";

let randnum;
let prevnum = -1;
let skippedrounds = 0;

const createIndex = () => {
  const minNum = Math.ceil(0);
  const maxNum = Math.floor(3);
  return Math.floor(Math.random() * (maxNum - minNum + minNum) + minNum);
};

const randomColor = () => {
  const red = Math.floor(Math.random() * 230);
  const green = Math.floor(Math.random() * 230);
  const blue = Math.floor(Math.random() * 230);
  return `rgb(${red},${green},${blue})`;
};

class App extends Component {
  state = {
    gameOn: false,
    showModal: false,
    count: 0,
    intervalId: 0,
    circles: [
      <Circle key={0} index="0" click={this.buttonClick} />,
      <Circle key={1} index="1" click={this.buttonClick} />,
      <Circle key={2} index="2" click={this.buttonClick} />,
      <Circle key={3} index="3" click={this.buttonClick} />,
    ],
  };

  handleStart = () => {
    if (this.state.intervalId) {
      this.stopGame();
      return this.setState({ intervalId: 0 });
    }
    this.oneRound();
    return this.setState({ gameOn: !this.state.gameOn });
  };

  oneRound = () => {
    randnum = createIndex();
    while (randnum === prevnum) {
      randnum = createIndex();
    }

    const newCircles = this.state.circles.map((_, i) => {
      if (i === randnum) {
        return (
          <Circle key={i} index={i} click={this.buttonClick} style="red" />
        );
      } else {
        return <Circle key={i} index={i} click={this.buttonClick} />;
      }
    });
    this.setState({ circles: newCircles });
    prevnum = randnum;
    this.timeOut();
  };

  buttonClick = (e) => {
    if (e.target.style.backgroundColor === "red") {
      clearTimeout(this.state.intervalId);
      console.log("points: ", this.state.count);
      this.oneRound();
      this.setState({ count: this.state.count + 1 });
    } else {
      return this.stopGame();
    }
  };

  stopGame = () => {
    clearInterval(this.state.intervalId);
    this.setState({
      gameOn: !this.state.gameOn,
      showModal: !this.state.showModal,
      circles: [
        <Circle key={0} index="0" click={this.buttonClick} />,
        <Circle key={1} index="1" click={this.buttonClick} />,
        <Circle key={2} index="2" click={this.buttonClick} />,
        <Circle key={3} index="3" click={this.buttonClick} />,
      ],
    });
  };

  timeOut = () => {
    const newIntervalId = setTimeout(() => {
      skippedrounds++;
      if (skippedrounds > 3) {
        this.stopGame();
      } else {
        this.oneRound();
      }
    }, 2000);

    this.setState({ intervalId: newIntervalId });
    console.log("skippedrounds: ", skippedrounds);
  };

  reload = () => {
    window.location.reload();
  };
  render() {
    return (
      <div className="container">
        <h1>Speed game</h1>
        <h2>Points: {this.state.count}</h2>
        <div className="circleContainer">{this.state.circles}</div>
        {this.state.showModal && (
          <Modal
            text="Game over"
            score={this.state.count}
            click={this.reload}
          />
        )}
        <div>
          <Button
            click={this.handleStart}
            text={this.state.gameOn ? "stop game" : "start game"}
          />
        </div>
      </div>
    );
  }
}

export default App;
