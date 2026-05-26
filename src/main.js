import "./style.css";
import { createBoard, formatCoordinate, renderShips } from "./dom";
import Player from "./Player";
import { placeRandomShip } from "./shipPlacement";

const app = document.querySelector("#app");
app.classList.add("game-shell");

const gameHeader = document.createElement("header");
gameHeader.classList.add("game-header");

const headingGroup = document.createElement("div");
headingGroup.classList.add("heading-group");

const eyebrow = document.createElement("span");
eyebrow.classList.add("eyebrow");
eyebrow.textContent = "Naval command";

const heading = document.createElement("h1");
heading.textContent = "Battleship";

headingGroup.append(eyebrow, heading);

const commandPanel = document.createElement("section");
commandPanel.classList.add("command-panel");

const statusMessage = document.createElement("div");
statusMessage.classList.add("status-message");
statusMessage.setAttribute("role", "status");
statusMessage.setAttribute("aria-live", "polite");
statusMessage.textContent = "Fire on enemy waters to begin.";

const stats = document.createElement("div");
stats.classList.add("stats");

const restartButton = document.createElement("button");
restartButton.classList.add("restart-button");
restartButton.type = "button";
restartButton.textContent = "New Game";

restartButton.addEventListener("click", () => {
  window.location.reload();
});

commandPanel.append(statusMessage, stats, restartButton);
gameHeader.append(headingGroup, commandPanel);

const boards = document.createElement("section");
boards.classList.add("boards");

app.append(gameHeader, boards);

let gameOver = false;

const player = new Player("real");
const computer = new Player("computer");

placeRandomShip(computer.gameboard, 5);
placeRandomShip(computer.gameboard, 4);
placeRandomShip(computer.gameboard, 3);

placeRandomShip(player.gameboard, 5);
placeRandomShip(player.gameboard, 4);
placeRandomShip(player.gameboard, 3);

function getHitCount(gameboard) {
  return gameboard.ships.reduce(
    (total, shipData) => total + shipData.ship.hits,
    0,
  );
}

function getShipHealth(gameboard) {
  return gameboard.ships.reduce(
    (total, shipData) => total + shipData.ship.length,
    0,
  );
}

function getSunkCount(gameboard) {
  return gameboard.ships.filter((shipData) => shipData.ship.isSunk()).length;
}

function renderStat(label, value) {
  const stat = document.createElement("div");
  stat.classList.add("stat");

  const valueElement = document.createElement("strong");
  valueElement.textContent = value;

  const labelElement = document.createElement("span");
  labelElement.textContent = label;

  stat.append(valueElement, labelElement);
  return stat;
}

function updateStats() {
  stats.replaceChildren(
    renderStat(
      "Your hits",
      `${getHitCount(computer.gameboard)}/${getShipHealth(computer.gameboard)}`,
    ),
    renderStat(
      "Enemy hits",
      `${getHitCount(player.gameboard)}/${getShipHealth(player.gameboard)}`,
    ),
    renderStat(
      "Ships sunk",
      `${getSunkCount(computer.gameboard)}/${computer.gameboard.ships.length}`,
    ),
    renderStat("Misses", computer.gameboard.missedAttacks.length),
  );
}

function attackMissed(gameboard, coordinates) {
  return gameboard.missedAttacks.some(
    (attack) => attack[0] === coordinates[0] && attack[1] === coordinates[1],
  );
}

function markCell(cell, result, label) {
  cell.classList.add(result);
  cell.setAttribute("aria-label", `${label}: ${result}`);
  cell.title = `${label}: ${result}`;

  if ("disabled" in cell) {
    cell.disabled = true;
  }
}

function disableComputerBoard() {
  Object.values(computerCells).forEach((cell) => {
    cell.disabled = true;
  });
}

function handleComputerBoardClick(coordinates, cell) {
  if (gameOver) {
    return;
  }

  if (cell.classList.contains("hit") || cell.classList.contains("miss")) {
    return;
  }

  computer.gameboard.receiveAttack(coordinates);

  const playerCoordinate = formatCoordinate(coordinates);
  const missed = attackMissed(computer.gameboard, coordinates);
  const playerResult = missed ? "miss" : "hit";

  markCell(cell, playerResult, playerCoordinate);

  if (computer.gameboard.allShipsSunk()) {
    statusMessage.textContent = `Direct hit at ${playerCoordinate}. You win.`;
    gameOver = true;
    disableComputerBoard();
    updateStats();
    return;
  }

  computer.randomAttack(player.gameboard);

  const computerAttack =
    computer.previousAttacks[computer.previousAttacks.length - 1];
  const playerCell = playerCells[computerAttack.toString()];
  const computerCoordinate = formatCoordinate(computerAttack);
  const computerMissed = attackMissed(player.gameboard, computerAttack);
  const computerResult = computerMissed ? "miss" : "hit";

  markCell(playerCell, computerResult, computerCoordinate);

  if (player.gameboard.allShipsSunk()) {
    statusMessage.textContent = `Enemy ${computerResult} at ${computerCoordinate}. Computer wins.`;
    gameOver = true;
    disableComputerBoard();
    updateStats();
    return;
  }

  statusMessage.textContent = `You ${playerResult} ${playerCoordinate}. Enemy ${computerResult} at ${computerCoordinate}.`;
  updateStats();
}

const playerCells = createBoard(boards, "Your Fleet", null, {
  panelClass: "player-board",
  subtitle: "Computer salvos land here.",
});
renderShips(playerCells, player.gameboard.ships);
const computerCells = createBoard(
  boards,
  "Enemy Waters",
  handleComputerBoardClick,
  {
    panelClass: "computer-board",
    subtitle: "Choose a coordinate to fire.",
  },
);

updateStats();
