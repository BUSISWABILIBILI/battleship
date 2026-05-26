import Gameboard from "./Gameboard.js";

const BOARD_SIZE = 10;

function coordinatesMatch(first, second) {
  return first[0] === second[0] && first[1] === second[1];
}

class Player {
  constructor(type = "real") {
    this.type = type;
    this.gameboard = new Gameboard();
    this.previousAttacks = [];
  }

  randomAttack(enemyGameboard) {
    const availableAttacks = [];

    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const coordinates = [x, y];

        if (!enemyGameboard.hasBeenAttacked(coordinates)) {
          availableAttacks.push(coordinates);
        }
      }
    }

    if (availableAttacks.length === 0) {
      return null;
    }

    const attack =
      availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
    const result = enemyGameboard.receiveAttack(attack);

    this.recordAttack(attack);
    result.surroundingMisses?.forEach((coordinates) =>
      this.recordAttack(coordinates),
    );

    return result;
  }

  recordAttack(coordinates) {
    const alreadyRecorded = this.previousAttacks.some((previousAttack) =>
      coordinatesMatch(previousAttack, coordinates),
    );

    if (!alreadyRecorded) {
      this.previousAttacks.push(coordinates);
    }
  }
}

export default Player;
