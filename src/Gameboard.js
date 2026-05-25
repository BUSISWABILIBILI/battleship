import Ship from "./Ship";

class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(length, coordinates) {
    const ship = new Ship(length);

    this.ships.push({
      ship,
      coordinates,
    });
  }
}

export default Gameboard;
