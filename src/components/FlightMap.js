import { useMemo, useRef, useState } from 'react';
import mapData from './flightMapData.json';
import { flightDistance, flightPath, projectAirport, routeView } from './flightGeometry';

const { airports, countries } = mapData;
const worldView = { zoom: 1, x: 0, y: 0 };

export default function FlightMap({ flights, selected }) {
  const svg = useRef(null);
  const drag = useRef(null);
  const [manualView, setManualView] = useState(null);
  const [dragging, setDragging] = useState(false);
  const origin = airports[selected.origin], destination = airports[selected.destination];
  const view = manualView?.id === selected.id ? manualView : routeView(origin, destination);
  const routes = useMemo(() => {
    const unique = new Map();
    flights.forEach(f => unique.set([f.origin, f.destination].sort().join('-'), f));
    return [...unique.values()].map(f => ({ key: `${f.origin}-${f.destination}`, path: flightPath(airports[f.origin], airports[f.destination]) }));
  }, [flights]);
  const codes = useMemo(() => [...new Set(flights.flatMap(f => [f.origin, f.destination]))], [flights]);
  const selectedPath = flightPath(origin, destination);
  const adjustZoom = factor => {
    const zoom = Math.max(1, Math.min(6, view.zoom * factor));
    const ratio = zoom / view.zoom;
    setManualView({ id: selected.id, zoom, x: 450 - (450 - view.x) * ratio, y: 225 - (225 - view.y) * ratio });
  };
  const stopDragging = () => { drag.current = null; setDragging(false); };

  return <div className="flight-map-panel">
    <div className="flight-map-stage">
      <svg ref={svg} viewBox="0 0 900 450" className={`flight-world-map${dragging ? ' is-dragging' : ''}`}
        role="img" aria-label={`World map highlighting ${selected.origin} to ${selected.destination}`}
        onPointerDown={event => {
          if (event.button !== 0) return;
          svg.current.setPointerCapture?.(event.pointerId);
          const bounds = svg.current.getBoundingClientRect();
          drag.current = { clientX: event.clientX, clientY: event.clientY, view: { ...view }, scale: 900 / bounds.width };
          setDragging(true);
        }}
        onPointerMove={event => {
          if (!drag.current) return;
          const start = drag.current;
          setManualView({ id: selected.id, zoom: start.view.zoom,
            x: Math.max(-900 * start.view.zoom, Math.min(900, start.view.x + (event.clientX - start.clientX) * start.scale)),
            y: Math.max(-450 * start.view.zoom, Math.min(450, start.view.y + (event.clientY - start.clientY) * start.scale)) });
        }}
        onPointerUp={stopDragging} onPointerCancel={stopDragging} onLostPointerCapture={stopDragging}>
        <g className={`flight-map-geography${dragging ? ' is-dragging' : ''}`} transform={`translate(${view.x} ${view.y}) scale(${view.zoom})`}>
          <g className="flight-map-countries" fill="#123d4c" stroke="#245160" strokeWidth={.55 / view.zoom}>
            {countries.map(country => <path key={country.name} d={country.path} />)}
          </g>
          <g fill="none" stroke="#81b4bd" strokeOpacity=".18" strokeWidth={.8 / view.zoom}>
            {routes.map(route => <path key={route.key} data-route={route.key} d={route.path} />)}
          </g>
          <g fill="#78a6ac" fillOpacity=".65">
            {codes.map(code => { const p = projectAirport(airports[code]); return <circle key={code} cx={p[0]} cy={p[1]} r={2 / view.zoom} />; })}
          </g>
          <path key={selected.id} data-testid="selected-flight-route" data-origin={selected.origin} data-destination={selected.destination}
            d={selectedPath} className="flight-map-active-route" fill="none" stroke="#eed7a3" strokeWidth={2 / view.zoom} strokeLinecap="round" />
          {[selected.origin, selected.destination].map((code, index) => {
            const [x, y] = projectAirport(airports[code]);
            return <g key={`${code}-${index}`}>
              <circle cx={x} cy={y} r={6 / view.zoom} fill="#eed7a3" fillOpacity=".18" />
              <circle cx={x} cy={y} r={2.8 / view.zoom} fill="#eed7a3" stroke="#002233" strokeWidth={1 / view.zoom} />
              <text x={x + (index === 0 ? -9 : 9) / view.zoom} y={y - 9 / view.zoom} textAnchor={index === 0 ? 'end' : 'start'}
                fontSize={13 / view.zoom} fill="#fff2d7" stroke="#002233" strokeWidth={3 / view.zoom} paintOrder="stroke" fontFamily="DM Sans, sans-serif">{code}</text>
            </g>;
          })}
        </g>
      </svg>
      <div className="flight-map-controls" aria-label="Map controls">
        <button type="button" aria-label="Zoom in on map" disabled={view.zoom >= 6} onClick={() => adjustZoom(1.4)}>+</button>
        <button type="button" aria-label="Zoom out on map" disabled={view.zoom <= 1} onClick={() => adjustZoom(1 / 1.4)}>−</button>
        <button type="button" aria-label="Show whole world" onClick={() => setManualView({ id: selected.id, ...worldView })}>◎</button>
        <button type="button" aria-label="Focus selected route" onClick={() => setManualView(null)}>↗</button>
      </div>
    </div>
    <dl className="flight-map-summary" aria-label="Selected flight details" aria-live="polite" aria-atomic="true">
      <div><dt>Route</dt><dd>{selected.origin} → {selected.destination}</dd></div>
      <div><dt>Flight</dt><dd>{selected.flight}</dd></div>
      <div><dt>Distance</dt><dd>{Math.round(flightDistance(origin, destination)).toLocaleString('en-US')} km</dd></div>
    </dl>
  </div>;
}
