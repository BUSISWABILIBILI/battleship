import { CLASSIC_FLEET, EXPANDED_FLEET, getFleetHealth } from "../src/fleet";

test("classic fleet uses the standard five ship sizes", () => {
  expect(CLASSIC_FLEET.map((ship) => ship.length)).toEqual([5, 4, 3, 3, 2]);
  expect(getFleetHealth(CLASSIC_FLEET)).toBe(17);
});

test("expanded fleet adds ten ships", () => {
  expect(EXPANDED_FLEET.map((ship) => ship.length)).toEqual([
    4, 3, 3, 2, 2, 2, 1, 1, 1, 1,
  ]);
  expect(EXPANDED_FLEET).toHaveLength(10);
  expect(getFleetHealth()).toBe(20);
});
