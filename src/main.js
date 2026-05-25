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
}

createBoard(app, "Player");
createBoard(app, "Computer", handleComputerBoardClick);
