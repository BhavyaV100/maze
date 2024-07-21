import React from 'react';

const Grid = ({ grid, handleCellClick, carPosition }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(50, 20px)' }}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: cell.isWall
                ? 'black'
                : cell.isEntrance
                ? 'green'
                : cell.isExit
                ? 'red'
                : 'white',
              border: '1px solid gray',
              position: 'relative',
            }}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {carPosition &&
              carPosition.row === rowIndex &&
              carPosition.col === colIndex && (
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    backgroundColor: 'blue',
                    position: 'absolute',
                    top: '1px',
                    left: '1px',
                    borderRadius: '50%',
                  }}
                ></div>
              )}
          </div>
        ))
      )}
    </div>
  );
};

export default Grid;
