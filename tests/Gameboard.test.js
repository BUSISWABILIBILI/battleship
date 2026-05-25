import Gameboard from "../src/Gameboard.js";

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
