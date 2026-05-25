function createBoard(container, boardName, handleCellClick = null) {
  const boardWrapper = document.createElement("div");

  const title = document.createElement("h2");
  title.textContent = boardName;

  const board = document.createElement("div");
  board.classList.add("board");

  const cells = {};

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");

      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      cells[`${x},${y}`] = cell;

      if (handleCellClick) {
        cell.addEventListener("click", () => {
          handleCellClick([x, y], cell);
        });
      }
      board.appendChild(cell);
    }
  }

  boardWrapper.appendChild(title);
  boardWrapper.appendChild(board);

  container.appendChild(boardWrapper);

  return cells;
}

export default createBoard;
