import { CLASSIC_FLEET, getFleetHealth } from "../src/fleet";

test("classic fleet uses the standard five ship sizes", () => {
  expect(CLASSIC_FLEET.map((ship) => ship.length)).toEqual([5, 4, 3, 3, 2]);
  expect(getFleetHealth()).toBe(17);
});
