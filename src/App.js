import React, { useState } from "react";
import { itemType, movePlayer, directions } from "./functions";
import { getMaze } from "./mazes";
import Buttons from "./Buttons";
import GameOver from "./GameOver";
import { useInterval } from "./useInterval";

function App() {
  const [maze, setMaze] = useState(getMaze);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState(directions.IDLE);

  useInterval(() => {
    if (maze.reachedExit || direction === directions.IDLE) return;
    moveToDirection();
  }, 400);

  function moveToDirection() {
    let updatedMaze = movePlayer(maze, direction, updateScore);
    setMaze(updatedMaze);
  }

  function updateScore(item) {
    if (item.type === itemType.DOT) setScore(score + 1);
    if (item.type === itemType.FOOD) setScore(score + 10);
  }

  function resetGame() {
    setMaze(getMaze());
    setScore(0);
    setDirection(directions.IDLE);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>My Game</h1>

      <div>SCORE {score}</div>

      {maze.reachedExit && <GameOver score={score} tryAgain={resetGame} />}

      <svg width={maze.width} height={maze.height}>
        <rect width={maze.width} height={maze.height} />

        {maze.items.map((item) => {
          return <Item key={item.id} item={item} />;
        })}
      </svg>

      <div>
        <Buttons
          buttonClicked={(direction) => setDirection(direction)}
          disabled={maze.reachedExit}
        />
      </div>
    </div>
  );
}

function Item(props) {
  if (props.item.type === itemType.PLAYER)
    return <circle r="7" fill="yellow" cx={props.item.x} cy={props.item.y} />;
  if (props.item.type === itemType.WALL)
    return (
      <rect
        width="20"
        height="20"
        x={props.item.x}
        y={props.item.y}
        fill="brown"
        rx="5"
        ry="5"
        stroke="black"
      />
    );
  if (props.item.type === itemType.FOOD)
    return <circle r="7" fill="green" cx={props.item.x} cy={props.item.y} />;
  if (props.item.type === itemType.NONE) return null;

  return <circle r="2" fill="green" cx={props.item.x} cy={props.item.y} />;
}

export default App;
