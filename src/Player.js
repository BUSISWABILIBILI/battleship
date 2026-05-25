import Gameboard from "./Gameboard";

class Player {
  constructor(type = "real") {
    this.type = type;
    this.gameboard = new Gameboard();
    this.previousAttacks = [];
  }

  randomAttack(enemyGameboard) {
    let attack;

    do {
      attack = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    } while (
      this.previousAttacks.some(
        (previousAttack) =>
          previousAttack[0] === attack[0] && previousAttack[1] === attack[1],
      )
    );

    this.previousAttacks.push(attack);
    enemyGameboard.receiveAttack(attack);
  }
}

export default Player;
