import boardingPasses from './flightPasses.json';
import additionalFlights from './additionalFlightHistory.json';
import mapData from './flightMapData.json';
import { flightKey, mapFlights, mergeFlightHistory } from './flightHistory';
import { flightPath } from './flightGeometry';

test('imports all 31 supplied flights but skips the four journeys already backed by passes', () => {
  expect(additionalFlights).toHaveLength(31);
  expect(mapFlights).toHaveLength(boardingPasses.length + 27);
  expect(new Set(mapFlights.map(flightKey)).size).toBe(mapFlights.length);
  const existing = new Map(boardingPasses.map(flight => [flightKey(flight), flight]));
  const duplicates = additionalFlights.filter(flight => existing.has(flightKey(flight)));
  expect(duplicates.map(flight => `${flight.sortDate} ${flight.flight}`).sort()).toEqual([
    '2020-10-06 VN1384', '2020-10-23 VN7380', '2020-11-10 VN1266', '2020-12-10 VN266',
  ]);
  duplicates.forEach(flight => expect(mapFlights.find(item => flightKey(item) === flightKey(flight))).toBe(existing.get(flightKey(flight))));
});

test('keeps repeated flight numbers on distinct dates and maps every historical airport', () => {
  expect(mapFlights.filter(flight => flight.flight === 'VN1384')).toHaveLength(3);
  additionalFlights.forEach(flight => {
    const path = flightPath(mapData.airports[flight.origin], mapData.airports[flight.destination]);
    expect(path).not.toMatch(/NaN|Infinity/);
    expect(path).toMatch(/^M/);
  });
});

test('normalizes formatting when checking duplicate flight numbers', () => {
  const first = { sortDate: '2020-01-01', flight: 'AA0598', origin: 'SAN', destination: 'CLT' };
  expect(mergeFlightHistory([first], [{ ...first, flight: 'aa 598' }])).toEqual([first]);
});
