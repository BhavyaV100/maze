import React, { useState, useEffect } from 'react';
import Grid from './grid';

const Maze = () => {
  const [grid, setGrid] = useState([]);
  const [isSelectingStart, setIsSelectingStart] = useState(false);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [isPlacingObstacles, setIsPlacingObstacles] = useState(false);
  const [carPosition, setCarPosition] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initialGrid = createGrid();
    setGrid(initialGrid);
  }, []);

  const createGrid = () => {
    const grid = Array(50)
      .fill(null)
      .map(() => Array(50).fill({ isWall: false }));

    // Create walls around the grid
    for (let i = 0; i < 50; i++) {
      grid[0][i] = { isWall: true };
      grid[49][i] = { isWall: true };
      grid[i][0] = { isWall: true };
      grid[i][49] = { isWall: true };
    }

    return grid;
  };

  const handleCellClick = (row, col) => {
    const newGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          if (isSelectingStart) {
            setStartPoint({ row, col });
            setCarPosition({ row, col });
            return { ...cell, isEntrance: true, isWall: false };
          } else if (isSelectingEnd) {
            setEndPoint({ row, col });
            return { ...cell, isExit: true, isWall: false };
          } else if (isPlacingObstacles && !cell.isEntrance && !cell.isExit) {
            return { ...cell, isWall: true };
          }
        }
        return cell;
      })
    );
    setGrid(newGrid);
    setIsSelectingStart(false);
    setIsSelectingEnd(false);
  };

  const startJourney = () => {
    if (!startPoint || !endPoint) {
      setMessage('Please select both start and end points.');
      return;
    }

    const path = findPath(grid, startPoint, endPoint);
    if (path.length === 0) {
      setMessage('Not a Valid Path.');
      return;
    }

    setMessage('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < path.length) {
        setCarPosition(path[index]);
        index++;
      } else {
        clearInterval(interval);
        setMessage('Reached Destination.');
      }
    }, 300);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const findPath = (grid, start, end) => {
    const queueStart = [start];
    const queueEnd = [end];
    const visitedStart = new Set();
    const visitedEnd = new Set();
    const previousStart = {};
    const previousEnd = {};
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
    ];

    const getKey = (pos) => `${pos.row}-${pos.col}`;

    while (queueStart.length > 0 && queueEnd.length > 0) {
      // BFS from start
      const currentStart = queueStart.shift();
      const keyStart = getKey(currentStart);
      if (visitedEnd.has(keyStart)) {
        return constructPath(previousStart, previousEnd, currentStart, true);
      }
      visitedStart.add(keyStart);

      shuffleArray(directions);
      for (const dir of directions) {
        const next = { row: currentStart.row + dir.row, col: currentStart.col + dir.col };
        const nextKey = getKey(next);

        if (
          next.row >= 0 &&
          next.row < 50 &&
          next.col >= 0 &&
          next.col < 50 &&
          !grid[next.row][next.col].isWall &&
          !visitedStart.has(nextKey)
        ) {
          queueStart.push(next);
          previousStart[nextKey] = currentStart;
          visitedStart.add(nextKey);
        }
      }

      // BFS from end
      const currentEnd = queueEnd.shift();
      const keyEnd = getKey(currentEnd);
      if (visitedStart.has(keyEnd)) {
        return constructPath(previousStart, previousEnd, currentEnd, false);
      }
      visitedEnd.add(keyEnd);

      shuffleArray(directions);
      for (const dir of directions) {
        const next = { row: currentEnd.row + dir.row, col: currentEnd.col + dir.col };
        const nextKey = getKey(next);

        if (
          next.row >= 0 &&
          next.row < 50 &&
          next.col >= 0 &&
          next.col < 50 &&
          !grid[next.row][next.col].isWall &&
          !visitedEnd.has(nextKey)
        ) {
          queueEnd.push(next);
          previousEnd[nextKey] = currentEnd;
          visitedEnd.add(nextKey);
        }
      }
    }

    return [];
  };

  const constructPath = (prevStart, prevEnd, meetingPoint, isFromStart) => {
    const path = [];
    let step = meetingPoint;

    while (step) {
      path.unshift(step);
      step = prevStart[`${step.row}-${step.col}`];
    }

    step = isFromStart ? prevEnd[`${meetingPoint.row}-${meetingPoint.col}`] : meetingPoint;

    while (step) {
      path.push(step);
      step = prevEnd[`${step.row}-${step.col}`];
    }

    return path;
  };

  const clearAll = () => {
    setGrid(createGrid());
    setCarPosition(null);
    setStartPoint(null);
    setEndPoint(null);
    setMessage('');
  };

  return (
    <div className="maze">
      <button onClick={() => setIsSelectingStart(true)}>Start Point</button>
      <button onClick={() => setIsSelectingEnd(true)}>End Point</button>
      <button onClick={() => setIsPlacingObstacles(true)}>Create Obstacles</button>
      <button onClick={startJourney}>Start Car</button>
      <button onClick={clearAll}>Clear</button>
      <div>{message}</div>
      <Grid grid={grid} handleCellClick={handleCellClick} carPosition={carPosition} />
    </div>
  );
};

export default Maze;
