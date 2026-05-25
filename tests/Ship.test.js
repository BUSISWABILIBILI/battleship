import Ship from "../src/Ship.js";

test("create a ship with a given length and 0 hits", () => {
  const ship = new Ship(3);

  expect(ship.length).toBe(3);
  expect(ship.hits).toBe(0);
});

test("increments hits when hit is called", () => {
  const ship = new Ship(3);

  ship.hit();

  expect(ship.hits).toBe(1);
});
