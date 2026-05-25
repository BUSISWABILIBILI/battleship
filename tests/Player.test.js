import Player from "../src/Player";

test("create a player with a name and an empty gameboard", () => {
  const player = new Player("real");

  expect(player.type).toBe("real");
  expect(player.gameboard).toBeDefined();
});

test("computer can make a random attack", () => {
  const computer = new Player("computer");
  const enemy = new Player("real");

  computer.randomAttack(enemy.gameboard);

  const totalAttacks =
    enemy.gameboard.missedAttacks.length +
    enemy.gameboard.ships.reduce((total, shipData) => {
      return total + shipData.ship.hits;
    }, 0);

  expect(totalAttacks).toBe(1);
});
