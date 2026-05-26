const CLASSIC_FLEET = [
  { name: "Carrier", length: 5 },
  { name: "Battleship", length: 4 },
  { name: "Cruiser", length: 3 },
  { name: "Submarine", length: 3 },
  { name: "Destroyer", length: 2 },
];

const EXPANDED_FLEET = [
  { name: "Battleship", length: 4 },
  { name: "Cruiser 1", length: 3 },
  { name: "Cruiser 2", length: 3 },
  { name: "Destroyer 1", length: 2 },
  { name: "Destroyer 2", length: 2 },
  { name: "Destroyer 3", length: 2 },
  { name: "Patrol Boat 1", length: 1 },
  { name: "Patrol Boat 2", length: 1 },
  { name: "Patrol Boat 3", length: 1 },
  { name: "Patrol Boat 4", length: 1 },
];

function getFleetHealth(fleet = EXPANDED_FLEET) {
  return fleet.reduce((total, ship) => total + ship.length, 0);
}

export { CLASSIC_FLEET, EXPANDED_FLEET, getFleetHealth };
