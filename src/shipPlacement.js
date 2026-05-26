function getRandomDirection() {
  return Math.random() < 0.5 ? "horizontal" : "vertical";
}

function getRandomStart(length, direction) {
  const max = 10 - length;

  if (direction === "horizontal") {
    return [
      Math.floor(Math.random() * (max + 1)),
      Math.floor(Math.random() * 10),
    ];
  }

  return [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * (max + 1)),
  ];
}

function createCoordinates(start, length, direction) {
  const [x, y] = start;
  const coordinates = [];

  for (let i = 0; i < length; i++) {
    if (direction === "horizontal") {
      coordinates.push([x + i, y]);
    } else {
      coordinates.push([x, y + i]);
    }
  }

  return coordinates;
}

function coordinatesTouch(first, second) {
  return (
    Math.abs(first[0] - second[0]) <= 1 &&
    Math.abs(first[1] - second[1]) <= 1
  );
}

function hasPlacementConflict(existingShips, coordinates) {
  return existingShips.some((shipData) =>
    shipData.coordinates.some((shipCoordinate) =>
      coordinates.some(
        (coordinate) => coordinatesTouch(coordinate, shipCoordinate),
      ),
    ),
  );
}

function placeRandomShip(gameboard, ship) {
  const length = typeof ship === "number" ? ship : ship.length;
  const name = typeof ship === "number" ? "Ship" : ship.name;
  let coordinates;

  do {
    const direction = getRandomDirection();
    const start = getRandomStart(length, direction);

    coordinates = createCoordinates(start, length, direction);
  } while (hasPlacementConflict(gameboard.ships, coordinates));

  gameboard.placeShip(length, coordinates, name);
}

function placeFleet(gameboard, fleet) {
  for (const ship of fleet) {
    placeRandomShip(gameboard, ship);
  }
}

export { placeFleet, placeRandomShip };
