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

function hasOverlap(existingShips, coordinates) {
  return existingShips.some((shipData) =>
    shipData.coordinates.some((shipCoordinate) =>
      coordinates.some(
        (coordinate) =>
          coordinate[0] === shipCoordinate[0] &&
          coordinate[1] === shipCoordinate[1],
      ),
    ),
  );
}

function placeRandomShip(gameboard, length) {
  let coordinates;

  do {
    const direction = getRandomDirection();
    const start = getRandomStart(length, direction);

    coordinates = createCoordinates(start, length, direction);
  } while (hasOverlap(gameboard.ships, coordinates));

  gameboard.placeShip(length, coordinates);
}

export { placeRandomShip };
