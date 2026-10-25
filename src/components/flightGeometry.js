// Equirectangular projection shared by the country outlines and flight routes.
export const projectAirport = airport => [(airport.lon + 180) * 2.5, (90 - airport.lat) * 2.5];
const radians = value => value * Math.PI / 180;
const degrees = value => value * 180 / Math.PI;

export function greatCirclePoints(from, to, steps = 80) {
  const vector = airport => {
    const lat = radians(airport.lat), lon = radians(airport.lon);
    return [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
  };
  const a = vector(from), b = vector(to);
  const angle = Math.acos(Math.max(-1, Math.min(1, a.reduce((sum, v, i) => sum + v * b[i], 0))));
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const left = angle < 1e-8 ? 1 - t : Math.sin((1 - t) * angle) / Math.sin(angle);
    const right = angle < 1e-8 ? t : Math.sin(t * angle) / Math.sin(angle);
    const p = a.map((v, j) => v * left + b[j] * right);
    return projectAirport({ lon: degrees(Math.atan2(p[1], p[0])), lat: degrees(Math.atan2(p[2], Math.hypot(p[0], p[1]))) });
  });
}

export function flightPath(from, to) {
  const points = greatCirclePoints(from, to);
  // Split at the antimeridian instead of drawing a line across the entire map.
  return points.map(([x, y], i) => `${i === 0 || Math.abs(x - points[i - 1][0]) > 450 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join('');
}

export function flightDistance(from, to) {
  const lat = radians(to.lat - from.lat), lon = radians(to.lon - from.lon);
  const a = Math.sin(lat / 2) ** 2 + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(lon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

export function routeView(from, to) {
  const points = greatCirclePoints(from, to);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const zoom = Math.max(1, Math.min(4, 650 / Math.max(maxX - minX, 1), 300 / Math.max(maxY - minY, 1)));
  return { zoom, x: 450 - (minX + maxX) / 2 * zoom, y: 225 - (minY + maxY) / 2 * zoom };
}
