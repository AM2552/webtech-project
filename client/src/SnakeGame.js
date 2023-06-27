import React, { useEffect, useState, useRef } from 'react';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState('right');
  const [score, setScore] = useState(0);
  const gameRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);

  const getRandomFoodPosition = () => {
    return {
      x: Math.floor(Math.random() * 25),
      y: Math.floor(Math.random() * 25),
    };
  };
  const [food, setFood] = useState(getRandomFoodPosition());

  useEffect(() => {
    gameRef.current.focus();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!gameStarted) return;

      if (event.keyCode === 37 && direction !== 'right') {
        setDirection('left');
      } else if (event.keyCode === 38 && direction !== 'down') {
        setDirection('up');
      } else if (event.keyCode === 39 && direction !== 'left') {
        setDirection('right');
      } else if (event.keyCode === 40 && direction !== 'up') {
        setDirection('down');
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction, gameStarted]);

  useEffect(() => {
    const moveSnake = () => {
      if (!gameStarted) return;

      const head = { ...snake[0] };

      switch (direction) {
        case 'up':
          head.y -= 1;
          break;
        case 'down':
          head.y += 1;
          break;
        case 'left':
          head.x -= 1;
          break;
        case 'right':
          head.x += 1;
          break;
        default:
          break;
      }

      const newSnake = [head, ...snake.slice(0, -1)];
      setSnake(newSnake);
    };

    const checkCollision = () => {
      if (!gameStarted) return;

      const head = snake[0];

      // Check if snake hits the walls
      if (head.x < 0 || head.x >= 25 || head.y < 0 || head.y >= 25) {
        gameOver();
        return;
      }

      // Check if snake hits itself
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          gameOver();
          return;
        }
      }

      // Check if snake eats the food
      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => prevScore + 10);
        setFood(getRandomFoodPosition());
        growSnake();
      }
    };

    const gameLoop = setInterval(() => {
      moveSnake();
      checkCollision();
    }, 100);

    return () => {
      clearInterval(gameLoop);
    };
  }, [snake, direction, food, gameStarted]);

  const growSnake = () => {
    const tail = { ...snake[snake.length - 1] };
    setSnake((prevSnake) => [...prevSnake, tail]);
  };

  const gameOver = () => {
    alert('Game over!');
    setSnake([{ x: 10, y: 10 }]);
    setDirection('right');
    setScore(0);
    setGameStarted(false);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const renderGrid = () => {
    const grid = [];

    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        let cellClass = 'cell';

        // Check if cell is part of the snake
        for (const segment of snake) {
          if (segment.x === col && segment.y === row) {
            cellClass += ' snake';
            break;
          }
        }

        // Check if cell is the food
        if (food.x === col && food.y === row) {
          cellClass += ' food';
        }

        grid.push(
          <div className={cellClass} key={`${col}-${row}`}></div>
        );
      }
    }

    return grid;
  };

  return (
    <div
      className="snake-game"
      ref={gameRef}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {!gameStarted && (
        <button className="start-button" onClick={handleStartGame}>
          Start Game
        </button>
      )}
      <div className="score">Score: {score}</div>
      <div className="grid">{renderGrid()}</div>
    </div>
  );
};

export default SnakeGame;
