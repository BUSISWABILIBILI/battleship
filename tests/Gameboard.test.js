import Gameboard from "../src/Gameboard.js";

test("create an empty gameboard", () => {
  const gameboard = new Gameboard();

  expect(gameboard.ships).toEqual([]);
  expect(gameboard.missedAttacks).toEqual([]);
});
