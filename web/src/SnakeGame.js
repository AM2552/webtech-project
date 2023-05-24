import React, { useState, useEffect } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';
const INITIAL_FRUIT = { x: 15, y: 15 };

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [fruit, setFruit] = useState(INITIAL_FRUIT);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Change direction based on arrow keys
      if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        setDirection('UP');
      } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        setDirection('DOWN');
      } else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        setDirection('LEFT');
      } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        setDirection('RIGHT');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction]);

  useEffect(() => {
    const moveSnake = setInterval(() => {
      // Calculate the new head position based on the current direction
      const { x, y } = snake[0];
      let newHead;
      switch (direction) {
        case 'UP':
          newHead = { x, y: y - 1 };
          break;
        case 'DOWN':
          newHead = { x, y: y + 1 };
          break;
        case 'LEFT':
          newHead = { x: x - 1, y };
          break;
        case 'RIGHT':
          newHead = { x: x + 1, y };
          break;
        default:
          break;
      }

      // Check if the snake hits the wall or itself
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y >= GRID_SIZE ||
        snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        clearInterval(moveSnake);
        return;
      }

      // Check if the snake eats the fruit
      if (newHead.x === fruit.x && newHead.y === fruit.y) {
        // Increase the length of the snake and place a new fruit
        const newSnake = [newHead, ...snake];
        setSnake(newSnake);
        setFruit(getRandomPosition());
      } else {
        // Move the snake by removing the tail segment and adding a new head segment
        const newSnake = [newHead, ...snake.slice(0, -1)];
        setSnake(newSnake);
      }
    }, 200);

    return () => {
      clearInterval(moveSnake);
    };
  }, [snake, direction, fruit]);

  const getRandomPosition = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeSegment = snake.some((segment) => segment.x === x && segment.y === y);
        const isFruit = fruit.x === x && fruit.y === y;
        grid.push(
          <div
            key={`${x}-${y}`}
            className={`cell ${isSnakeSegment ? 'snake' : ''} ${isFruit ? 'fruit' : ''}`}
          ></div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="snake-game">
      {gameOver ? (
        <div className="game-over">Game Over!</div>
      ) : (
        <div className="grid">{renderGrid()}</div>
      )}
    </div>
  );
};

export default SnakeGame;