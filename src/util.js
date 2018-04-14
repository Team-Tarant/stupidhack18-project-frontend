import geolib from 'geolib';

const possibleUnits = ['km', 'cm', 'sm', 'mm', 'mi', 'ft', 'in', 'yd'];

export function getDistanceInRandomUnit(distance) {
  var randomUnit =
    possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
  return {
    distance: geolib.convertUnit(randomUnit, distance),
    unit: randomUnit
  };
}

export function distance(coord1, coord2) {
  return geolib.getDistance(coord1, coord2);
}

// assumes query is obj with string keys and values
const querify = (key, value) => `${key}=${encodeURIComponent(value)}`;
const formatQuery = query => {
  const queryArray = Object.keys(query).reduce((acc, key) => {
    const value = query[key];
    return [...acc, querify(key, value)];
  }, []);
  return queryArray.join('&');
};

const formatCoords = ({ longitude, latitude }) =>
  `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

export const buildApiUrl = (startCoords, destAddress) => {
  const startLocation = formatCoords(startCoords);
  const homeAddress = destAddress;
  return `/api/routes/getRoute?${formatQuery({ startLocation, homeAddress })}`;
};
