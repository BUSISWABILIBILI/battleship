import Gameboard from "../src/Gameboard";

test("create an empty gameboard", () => {
  const gameboard = new Gameboard();

  expect(gameboard.ships).toEqual([]);
  expect(gameboard.missedAttacks).toEqual([]);
});

test("places a ship at given coordinates", () => {
  const gameboard = new Gameboard();

  gameboard.placeShip(
    3,
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    "Cruiser",
  );

  expect(gameboard.ships.length).toBe(1);
  expect(gameboard.ships[0].name).toBe("Cruiser");
  expect(gameboard.ships[0].coordinates).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
});

test("records missed attacks", () => {
  const gameboard = new Gameboard();

  const result = gameboard.receiveAttack([5, 5]);

  expect(result.result).toBe("miss");
  expect(gameboard.missedAttacks).toContainEqual([5, 5]);
});

test("hits the correct ship", () => {
  const gameboard = new Gameboard();

  gameboard.placeShip(2, [
    [0, 0],
    [0, 1],
  ]);

  const result = gameboard.receiveAttack([0, 0]);

  expect(result.result).toBe("hit");
  expect(result.sunk).toBe(false);
  expect(gameboard.ships[0].ship.hits).toBe(1);
});

test("reports when a ship is sunk", () => {
  const gameboard = new Gameboard();

  gameboard.placeShip(2, [
    [0, 0],
    [0, 1],
  ]);

  gameboard.receiveAttack([0, 0]);
  const result = gameboard.receiveAttack([0, 1]);

  expect(result.result).toBe("hit");
  expect(result.sunk).toBe(true);
});

test("does not count repeated attacks twice", () => {
  const gameboard = new Gameboard();

  gameboard.placeShip(2, [
    [0, 0],
    [0, 1],
  ]);

  gameboard.receiveAttack([0, 0]);
  const result = gameboard.receiveAttack([0, 0]);

  expect(result.result).toBe("repeat");
  expect(gameboard.ships[0].ship.hits).toBe(1);
});

test("rejects overlapping ships", () => {
  const gameboard = new Gameboard();

  gameboard.placeShip(2, [
    [0, 0],
    [0, 1],
  ]);

  expect(() => {
    gameboard.placeShip(2, [
      [0, 1],
      [0, 2],
    ]);
  }).toThrow("Ships cannot overlap.");
});

test("rejects diagonal ships", () => {
  const gameboard = new Gameboard();

  expect(() => {
    gameboard.placeShip(2, [
      [0, 0],
      [1, 1],
    ]);
  }).toThrow("Ships must be placed horizontally or vertically.");
});

test("returns false if not all ships are sunk", () => {
  const gameboard = new Gameboard();

  gameboard.placeShip(2, [
    [0, 0],
    [0, 1],
  ]);

  gameboard.receiveAttack([0, 0]);

  expect(gameboard.allShipsSunk()).toBe(false);
});

test("returns true if all ships are sunk", () => {
  const gameboard = new Gameboard();

  gameboard.placeShip(2, [
    [0, 0],
    [0, 1],
  ]);

  gameboard.receiveAttack([0, 0]);
  gameboard.receiveAttack([0, 1]);

  expect(gameboard.allShipsSunk()).toBe(true);
});
