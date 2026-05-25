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

  receiveAttack(attackCoordinates) {
    for (const shipData of this.ships) {
      const hit = shipData.coordinates.some(
        (coordinate) =>
          coordinate[0] === attackCoordinates[0] &&
          coordinate[1] === attackCoordinates[1],
      );

      if (hit) {
        shipData.ship.hit();
        return;
      }
    }

    this.missedAttacks.push(attackCoordinates);
  }

  allShipsSunk() {
    return this.ships.every((shipData) => shipData.ship.isSunk());
  }
}

export default Gameboard;
