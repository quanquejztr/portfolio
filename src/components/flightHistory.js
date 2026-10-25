import boardingPasses from './flightPasses.json';
import additionalFlights from './additionalFlightHistory.json';

// A repeated route or flight number on another day is a separate journey.
export function flightKey(flight) {
  const number = flight.flight.replace(/\s+/g, '').toUpperCase().replace(/^(\D+)0+(\d)/, '$1$2');
  return [flight.sortDate || flight.date || '', number, flight.origin, flight.destination].join('|');
}

export function mergeFlightHistory(passes, history) {
  const unique = new Map();
  // Prefer the actual boarding-pass record when the same journey appears in both sources.
  [...passes, ...history].forEach(flight => {
    const key = flightKey(flight);
    if (!unique.has(key)) unique.set(key, flight);
  });
  return [...unique.values()];
}

export const mapFlights = mergeFlightHistory(boardingPasses, additionalFlights);
