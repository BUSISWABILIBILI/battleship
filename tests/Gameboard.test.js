import Gameboard from "../src/Gameboard";

test("create an empty gameboard", () => {
  const gameboard = new Gameboard();

  expect(gameboard.ships).toEqual([]);
  expect(gameboard.missedAttacks).toEqual([]);
});

test("places a ship at given coordinates", () => {
  const gameboard = new Gameboard();

  gameboard.placeShip(3, [
    [0, 0],
    [0, 1],
    [0, 2],
  ]);

  expect(gameboard.ships.length).toBe(1);
  expect(gameboard.ships[0].coordinates).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
});

test("records missed attacks", () => {
  const gameboard = new Gameboard();

  gameboard.receiveAttack([5, 5]);

  expect(gameboard.missedAttacks).toContainEqual([5, 5]);
});

test("hits the correct ship", () => {
  const gameboard = new Gameboard();

  gameboard.placeShip(2, [
    [0, 0],
    [0, 1],
  ]);

  gameboard.receiveAttack([0, 0]);

  expect(gameboard.ships[0].ship.hits).toBe(1);
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
