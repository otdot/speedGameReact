import "./App.css";
import React, { Component } from "react";
import { Circle } from "./components/Circle";
import { Button } from "./components/Button";

let randnum;
let prevnum;
let skippedrounds = 0;

class App extends Component {
  state = {
    gameOn: false,
    count: 0,
    intervalId: 0,
    circles: [
      <Circle key={0} index="0" click={this.buttonClick} />,
      <Circle key={1} index="1" click={this.buttonClick} />,
      <Circle key={2} index="2" click={this.buttonClick} />,
      <Circle key={3} index="3" click={this.buttonClick} />,
    ],
  };

  createIndex = () => {
    const minNum = Math.ceil(0);
    const maxNum = Math.floor(3);
    return Math.floor(Math.random() * (maxNum - minNum + minNum) + minNum);
  };

  handleStart = () => {
    this.setState({ ...this.state, gameOn: true });
    if (this.state.intervalId) {
      clearTimeout(this.state.intervalId);
      this.setState((prevstate) => {
        return { ...prevstate, intervalId: 0 };
      });
      return;
    }
    this.oneRound();
  };

  oneRound = () => {
    randnum = this.createIndex();
    while (randnum === prevnum) {
      randnum = this.createIndex();
    }

    const newCircles = this.state.circles.map((circle, i) => {
      if (i === randnum) {
        return (
          <Circle key={i} index={i} click={this.buttonClick} style="red" />
        );
      } else {
        return <Circle key={i} index={i} click={this.buttonClick} />;
      }
    });
    this.setState({
      ...this.state,
      circles: newCircles,
    });
    prevnum = randnum;
    this.timeOut();
  };

  buttonClick = (e) => {
    if (e.target.style.backgroundColor === "red") {
      clearTimeout(this.state.intervalId);
      console.log("points: ", this.state.count);
      this.oneRound();
    } else {
      this.stopGame();
    }
    this.setState((prevstate) => {
      return { ...prevstate, count: prevstate.count + 1 };
    });
  };

  stopGame = () => {
    clearInterval(this.state.intervalId);
    this.setState({
      ...this.state,
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
      this.oneRound();
    }, 2000);

    this.setState((prevstate) => {
      return {
        ...prevstate,
        intervalId: newIntervalId,
      };
    });
    console.log("skippedrounds: ", skippedrounds);
    if (skippedrounds > 3) {
      clearTimeout(this.state.intervalId);
      this.stopGame();
    }
  };

  render() {
    return (
      <div className="container">
        <h1>Speed game</h1>
        <h2>Points: {this.state.count}</h2>
        <div className="circleContainer">{this.state.circles}</div>
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
