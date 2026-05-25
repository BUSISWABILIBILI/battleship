import "./style.css";
import { createBoard, renderShips } from "./dom";
import Player from "./Player";

const app = document.querySelector("#app");

const statusMessage = document.createElement("div");
statusMessage.classList.add("status-message");
statusMessage.textContent = "Attack the computer's board to start the game!";
app.before(statusMessage);

let gameOver = false;

const player = new Player("real");
const computer = new Player("computer");

computer.gameboard.placeShip(3, [
  [0, 0],
  [0, 1],
  [0, 2],
]);

player.gameboard.placeShip(3, [
  [4, 4],
  [4, 5],
  [4, 6],
]);

function handleComputerBoardClick(coordinates, cell) {
  if (gameOver) {
    return;
  }

  if (cell.classList.contains("hit") || cell.classList.contains("miss")) {
    return;
  }

  computer.gameboard.receiveAttack(coordinates);

  const missed = computer.gameboard.missedAttacks.some(
    (attack) => attack[0] === coordinates[0] && attack[1] === coordinates[1],
  );

  if (missed) {
    cell.classList.add("miss");
  } else {
    cell.classList.add("hit");
  }

  computer.randomAttack(player.gameboard);

  const computerAttack =
    computer.previousAttacks[computer.previousAttacks.length - 1];

  const playerCell = playerCells[computerAttack.toString()];

  const computerMissed = player.gameboard.missedAttacks.some(
    (attack) =>
      attack[0] === computerAttack[0] && attack[1] === computerAttack[1],
  );

  if (computerMissed) {
    playerCell.classList.add("miss");
  } else {
    playerCell.classList.add("hit");
  }

  if (computer.gameboard.allShipsSunk()) {
    statusMessage.textContent = "You win! All computer ships have been sunk.";
    gameOver = true;
    return;
  }

  if (player.gameboard.allShipsSunk()) {
    statusMessage.textContent = "Computer wins! All your ships have been sunk.";
    gameOver = true;
    return;
  }

  statusMessage.textContent = "Your turn! Attack another square.";
}

const playerCells = createBoard(app, "Player");
renderShips(playerCells, player.gameboard.ships);
createBoard(app, "Computer", handleComputerBoardClick);
