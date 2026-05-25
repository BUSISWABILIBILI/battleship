import "./style.css";
import createBoard from "./dom";
import Player from "./Player";

const app = document.querySelector("#app");

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
}

const playerCells = createBoard(app, "Player");
createBoard(app, "Computer", handleComputerBoardClick);
