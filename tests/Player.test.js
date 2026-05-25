import Player from "../src/Player";

test("create a player with a name and an empty gameboard", () => {
  const player = new Player("real");

  expect(player.type).toBe("real");
  expect(player.gameboard).toBeDefined();
});
