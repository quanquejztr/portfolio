import { flightDistance, flightPath, greatCirclePoints, projectAirport } from './flightGeometry';
import { airports } from './flightMapData.json';

test('transpacific routes split at the dateline instead of crossing the entire map', () => {
  const path = flightPath(airports.HND, airports.ORD);
  expect((path.match(/M/g) || []).length).toBe(2);
  const points = greatCirclePoints(airports.HND, airports.ORD);
  const start = projectAirport(airports.HND), end = projectAirport(airports.ORD);
  expect(points[0][0]).toBeCloseTo(start[0]);
  expect(points[points.length - 1][1]).toBeCloseTo(end[1]);
  expect(path).not.toMatch(/NaN|Infinity/);
});

test('route distance uses geography and handles identical airports', () => {
  expect(flightDistance(airports.TPA, airports.JFK)).toBeGreaterThan(1600);
  expect(flightDistance(airports.TPA, airports.JFK)).toBeLessThan(1700);
  expect(flightDistance(airports.TPA, airports.TPA)).toBe(0);
  expect(flightPath(airports.TPA, airports.TPA)).not.toMatch(/NaN|Infinity/);
});
