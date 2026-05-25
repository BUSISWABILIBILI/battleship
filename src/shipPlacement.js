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

export { getRandomDirection, getRandomStart, createCoordinates };
