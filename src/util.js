import geolib from 'geolib';

const possibleUnits = ['km', 'cm', 'sm', 'mm', 'mi', 'ft', 'in', 'yd'];

export function getDistanceInRandomUnit(distance) {
  var randomUnit =
    possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
  return {
    distance: geolib.convertUnit(randomUnit, distance),
    unit: randomUnit
  }
}
