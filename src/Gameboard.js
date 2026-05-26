import Ship from "./Ship";

const BOARD_SIZE = 10;

function coordinatesMatch(first, second) {
  return first[0] === second[0] && first[1] === second[1];
}

function isInsideBoard(coordinates) {
  const [x, y] = coordinates;

  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function isStraightLine(coordinates) {
  const xValues = new Set(coordinates.map((coordinate) => coordinate[0]));
  const yValues = new Set(coordinates.map((coordinate) => coordinate[1]));

  return xValues.size === 1 || yValues.size === 1;
}

function isContiguous(coordinates) {
  const sameColumn = coordinates.every(
    (coordinate) => coordinate[0] === coordinates[0][0],
  );
  const axis = sameColumn ? 1 : 0;
  const sortedValues = coordinates
    .map((coordinate) => coordinate[axis])
    .sort((first, second) => first - second);

  return sortedValues.every((value, index) => {
    if (index === 0) {
      return true;
    }

    return value === sortedValues[index - 1] + 1;
  });
}

class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(length, coordinates, name = "Ship") {
    if (coordinates.length !== length) {
      throw new Error("Ship coordinates must match the ship length.");
    }

    if (!coordinates.every(isInsideBoard)) {
      throw new Error("Ships must stay inside the board.");
    }

    if (!isStraightLine(coordinates) || !isContiguous(coordinates)) {
      throw new Error("Ships must be placed horizontally or vertically.");
    }

    const overlapsExistingShip = this.ships.some((shipData) =>
      shipData.coordinates.some((shipCoordinate) =>
        coordinates.some((coordinate) =>
          coordinatesMatch(coordinate, shipCoordinate),
        ),
      ),
    );

    if (overlapsExistingShip) {
      throw new Error("Ships cannot overlap.");
    }

    const ship = new Ship(length);

    this.ships.push({
      name,
      ship,
      coordinates,
      hitCoordinates: [],
    });
  }

  receiveAttack(attackCoordinates) {
    if (!isInsideBoard(attackCoordinates)) {
      throw new Error("Attacks must stay inside the board.");
    }

    if (
      this.missedAttacks.some((missedAttack) =>
        coordinatesMatch(missedAttack, attackCoordinates),
      )
    ) {
      return { coordinates: attackCoordinates, result: "repeat" };
    }

    for (const shipData of this.ships) {
      const hit = shipData.coordinates.some(
        (coordinate) => coordinatesMatch(coordinate, attackCoordinates),
      );

      if (hit) {
        const alreadyHit = shipData.hitCoordinates.some((coordinate) =>
          coordinatesMatch(coordinate, attackCoordinates),
        );

        if (alreadyHit) {
          return {
            coordinates: attackCoordinates,
            result: "repeat",
            ship: shipData,
            sunk: shipData.ship.isSunk(),
          };
        }

        shipData.hitCoordinates.push(attackCoordinates);
        shipData.ship.hit();

        return {
          coordinates: attackCoordinates,
          result: "hit",
          ship: shipData,
          sunk: shipData.ship.isSunk(),
        };
      }
    }

    this.missedAttacks.push(attackCoordinates);

    return { coordinates: attackCoordinates, result: "miss" };
  }

  allShipsSunk() {
    return this.ships.every((shipData) => shipData.ship.isSunk());
  }
}

export default Gameboard;
