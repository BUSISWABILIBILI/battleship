const COLUMN_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function formatCoordinate(coordinates) {
  return `${COLUMN_LABELS[coordinates[0]]}${coordinates[1] + 1}`;
}

function slugify(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function createBoard(
  container,
  boardName,
  handleCellClick = null,
  options = {},
) {
  const { panelClass = "", subtitle = "", targetSide = null } = options;
  const boardWrapper = document.createElement("section");
  boardWrapper.classList.add("board-panel");

  if (panelClass) {
    boardWrapper.classList.add(panelClass);
  }

  const titleId = `${slugify(boardName)}-title`;
  boardWrapper.setAttribute("aria-labelledby", titleId);

  const title = document.createElement("h2");
  title.id = titleId;
  title.textContent = boardName;

  const header = document.createElement("div");
  header.classList.add("board-header");
  header.appendChild(title);

  if (subtitle) {
    const subtitleElement = document.createElement("p");
    subtitleElement.textContent = subtitle;
    header.appendChild(subtitleElement);
  }

  const board = document.createElement("div");
  board.classList.add("board");
  board.setAttribute("aria-label", `${boardName} grid`);

  const corner = document.createElement("span");
  corner.classList.add("coordinate-label", "corner-label");
  corner.setAttribute("aria-hidden", "true");
  board.appendChild(corner);

  for (const label of COLUMN_LABELS) {
    const coordinateLabel = document.createElement("span");
    coordinateLabel.classList.add("coordinate-label");
    coordinateLabel.textContent = label;
    coordinateLabel.setAttribute("aria-hidden", "true");
    board.appendChild(coordinateLabel);
  }

  const cells = {};

  for (let y = 0; y < 10; y++) {
    const rowLabel = document.createElement("span");
    rowLabel.classList.add("coordinate-label", "row-label");
    rowLabel.textContent = y + 1;
    rowLabel.setAttribute("aria-hidden", "true");
    board.appendChild(rowLabel);

    for (let x = 0; x < 10; x++) {
      const coordinateLabel = formatCoordinate([x, y]);
      const cell = document.createElement(handleCellClick ? "button" : "div");

      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.coordinate = coordinateLabel;
      cell.setAttribute("aria-label", `${boardName} ${coordinateLabel}`);

      cells[`${x},${y}`] = cell;

      if (handleCellClick) {
        cell.type = "button";
        cell.classList.add("target-cell");
        cell.setAttribute(
          "aria-label",
          `Attack ${coordinateLabel} on ${boardName}`,
        );
        cell.addEventListener("click", () => {
          handleCellClick([x, y], cell);
        });
      }
      board.appendChild(cell);
    }
  }

  const boardArea = document.createElement("div");
  boardArea.classList.add("board-area");

  if (targetSide) {
    boardArea.classList.add(`targets-${targetSide}`);
  }

  const fleetTargets = document.createElement("div");
  fleetTargets.classList.add("fleet-targets");
  fleetTargets.setAttribute("aria-label", `${boardName} ship targets`);

  if (targetSide === "left") {
    boardArea.append(fleetTargets, board);
  } else if (targetSide === "right") {
    boardArea.append(board, fleetTargets);
  } else {
    boardArea.appendChild(board);
  }

  boardWrapper.appendChild(header);
  boardWrapper.appendChild(boardArea);

  container.appendChild(boardWrapper);

  return cells;
}

function clearShips(cells, boardName = "Grid") {
  for (const cell of Object.values(cells)) {
    cell.classList.remove("ship");
    cell.setAttribute(
      "aria-label",
      `${boardName} ${cell.dataset.coordinate}`,
    );
  }
}

function renderShips(cells, ships) {
  for (const shipData of ships) {
    for (const coordinate of shipData.coordinates) {
      const key = coordinate.toString();
      const cell = cells[key];

      cell.classList.add("ship");
      cell.setAttribute("aria-label", `Ship at ${cell.dataset.coordinate}`);
    }
  }
}

function renderFleetTargets(container, ships, ownerLabel) {
  container.replaceChildren();

  ships.forEach((shipData, index) => {
    const target = document.createElement("div");
    target.classList.add("fleet-target");
    target.dataset.shipIndex = index;
    target.title = `${shipData.name} (${shipData.ship.length})`;
    target.setAttribute(
      "aria-label",
      `${ownerLabel} ${shipData.name}, length ${shipData.ship.length}, afloat`,
    );

    for (let segment = 0; segment < shipData.ship.length; segment++) {
      const segmentElement = document.createElement("span");
      segmentElement.classList.add("target-segment");
      target.appendChild(segmentElement);
    }

    container.appendChild(target);
  });
}

function updateFleetTargets(container, ships, ownerLabel) {
  const targets = container.querySelectorAll(".fleet-target");

  targets.forEach((target, index) => {
    const shipData = ships[index];
    const sunk = shipData.ship.isSunk();

    target.classList.toggle("sunk", sunk);
    target.setAttribute(
      "aria-label",
      `${ownerLabel} ${shipData.name}, length ${shipData.ship.length}, ${
        sunk ? "sunk" : "afloat"
      }`,
    );
  });
}

export {
  clearShips,
  createBoard,
  formatCoordinate,
  renderFleetTargets,
  renderShips,
  updateFleetTargets,
};
