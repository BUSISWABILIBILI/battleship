import Ship from "./Ship";

const BOARD_SIZE = 10;

function coordinatesMatch(first, second) {
  return first[0] === second[0] && first[1] === second[1];
}

function coordinatesTouch(first, second) {
  return (
    Math.abs(first[0] - second[0]) <= 1 &&
    Math.abs(first[1] - second[1]) <= 1
  );
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

    const touchesExistingShip = this.ships.some((shipData) =>
      shipData.coordinates.some((shipCoordinate) =>
        coordinates.some((coordinate) =>
          coordinatesTouch(coordinate, shipCoordinate),
        ),
      ),
    );

    if (touchesExistingShip) {
      throw new Error("Ships cannot touch.");
    }

    const ship = new Ship(length);

    this.ships.push({
      name,
      ship,
      coordinates,
      hitCoordinates: [],
    });
  }

  hasShipAt(coordinates) {
    return this.ships.some((shipData) =>
      shipData.coordinates.some((shipCoordinate) =>
        coordinatesMatch(coordinates, shipCoordinate),
      ),
    );
  }

  hasBeenAttacked(coordinates) {
    if (
      this.missedAttacks.some((missedAttack) =>
        coordinatesMatch(missedAttack, coordinates),
      )
    ) {
      return true;
    }

    return this.ships.some((shipData) =>
      shipData.hitCoordinates.some((hitCoordinate) =>
        coordinatesMatch(hitCoordinate, coordinates),
      ),
    );
  }

  getSurroundingEmptyCoordinates(shipData) {
    const surroundingCoordinates = [];

    for (const [shipX, shipY] of shipData.coordinates) {
      for (let y = shipY - 1; y <= shipY + 1; y++) {
        for (let x = shipX - 1; x <= shipX + 1; x++) {
          const coordinates = [x, y];

          if (
            !isInsideBoard(coordinates) ||
            this.hasShipAt(coordinates) ||
            surroundingCoordinates.some((existingCoordinates) =>
              coordinatesMatch(existingCoordinates, coordinates),
            )
          ) {
            continue;
          }

          surroundingCoordinates.push(coordinates);
        }
      }
    }

    return surroundingCoordinates;
  }

  markSurroundingMisses(shipData) {
    const surroundingMisses = this.getSurroundingEmptyCoordinates(shipData);

    for (const coordinates of surroundingMisses) {
      if (!this.hasBeenAttacked(coordinates)) {
        this.missedAttacks.push(coordinates);
      }
    }

    return surroundingMisses;
  }

  receiveAttack(attackCoordinates) {
    if (!isInsideBoard(attackCoordinates)) {
      throw new Error("Attacks must stay inside the board.");
    }

    if (this.hasBeenAttacked(attackCoordinates)) {
      return { coordinates: attackCoordinates, result: "repeat" };
    }

    for (const shipData of this.ships) {
      const hit = shipData.coordinates.some(
        (coordinate) => coordinatesMatch(coordinate, attackCoordinates),
      );

      if (hit) {
        shipData.hitCoordinates.push(attackCoordinates);
        shipData.ship.hit();

        const sunk = shipData.ship.isSunk();
        const surroundingMisses = sunk
          ? this.markSurroundingMisses(shipData)
          : [];

        return {
          coordinates: attackCoordinates,
          result: "hit",
          ship: shipData,
          sunk,
          surroundingMisses,
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
