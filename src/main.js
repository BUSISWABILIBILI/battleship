import "./style.css";
import { clearShips, createBoard, formatCoordinate, renderShips } from "./dom";
import { EXPANDED_FLEET } from "./fleet";
import Player from "./Player";
import { placeFleet } from "./shipPlacement";

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
statusMessage.textContent = "Expanded fleet deployed. Fire on enemy waters.";

const stats = document.createElement("div");
stats.classList.add("stats");

const commandActions = document.createElement("div");
commandActions.classList.add("command-actions");

const randomiseButton = document.createElement("button");
randomiseButton.classList.add("secondary-button");
randomiseButton.type = "button";
randomiseButton.textContent = "Randomise Fleet";

const restartButton = document.createElement("button");
restartButton.classList.add("restart-button");
restartButton.type = "button";
restartButton.textContent = "New Game";

restartButton.addEventListener("click", () => {
  window.location.reload();
});

commandActions.append(randomiseButton, restartButton);
commandPanel.append(statusMessage, stats, commandActions);
gameHeader.append(headingGroup, commandPanel);

const boards = document.createElement("section");
boards.classList.add("boards");

app.append(gameHeader, boards);

let gameOver = false;
let gameStarted = false;

const player = new Player("real");
const computer = new Player("computer");
const activeFleet = EXPANDED_FLEET;

placeFleet(computer.gameboard, activeFleet);
placeFleet(player.gameboard, activeFleet);

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

function formatAttackMessage(actor, coordinate, attack) {
  if (attack.result === "miss") {
    return `${actor} missed ${coordinate}`;
  }

  if (attack.sunk) {
    return `${actor} hit ${coordinate} and sunk ${attack.ship.name}`;
  }

  return `${actor} hit ${coordinate}: ${attack.ship.name}`;
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

function randomisePlayerFleet() {
  if (gameStarted) {
    return;
  }

  player.gameboard.ships = [];
  player.gameboard.missedAttacks = [];
  placeFleet(player.gameboard, activeFleet);
  clearShips(playerCells, "Your Fleet");
  renderShips(playerCells, player.gameboard.ships);
  statusMessage.textContent = "Your fleet has been randomised.";
  updateStats();
}

function handleComputerBoardClick(coordinates, cell) {
  if (gameOver) {
    return;
  }

  if (cell.classList.contains("hit") || cell.classList.contains("miss")) {
    return;
  }

  if (!gameStarted) {
    gameStarted = true;
    randomiseButton.disabled = true;
  }

  const playerCoordinate = formatCoordinate(coordinates);
  const playerAttack = computer.gameboard.receiveAttack(coordinates);
  const playerResult = playerAttack.result;

  markCell(cell, playerResult, playerCoordinate);

  if (computer.gameboard.allShipsSunk()) {
    statusMessage.textContent = `${formatAttackMessage(
      "You",
      playerCoordinate,
      playerAttack,
    )}. You win.`;
    gameOver = true;
    disableComputerBoard();
    updateStats();
    return;
  }

  const computerAttack = computer.randomAttack(player.gameboard);
  const playerCell = playerCells[computerAttack.coordinates.toString()];
  const computerCoordinate = formatCoordinate(computerAttack.coordinates);
  const computerResult = computerAttack.result;

  markCell(playerCell, computerResult, computerCoordinate);

  if (player.gameboard.allShipsSunk()) {
    statusMessage.textContent = `${formatAttackMessage(
      "Enemy",
      computerCoordinate,
      computerAttack,
    )}. Computer wins.`;
    gameOver = true;
    disableComputerBoard();
    updateStats();
    return;
  }

  statusMessage.textContent = `${formatAttackMessage(
    "You",
    playerCoordinate,
    playerAttack,
  )}. ${formatAttackMessage("Enemy", computerCoordinate, computerAttack)}.`;
  updateStats();
}

const playerCells = createBoard(boards, "Your Fleet", null, {
  panelClass: "player-board",
  subtitle: `${activeFleet.length} ships deployed. Computer salvos land here.`,
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

randomiseButton.addEventListener("click", randomisePlayerFleet);

updateStats();
